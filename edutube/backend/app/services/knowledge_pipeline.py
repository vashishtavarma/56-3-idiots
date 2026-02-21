# app/services/knowledge_pipeline.py
"""
Knowledge base pipeline: fetch YouTube transcript and upload to S3.
Runs in background so playlist/chapter creation is not blocked.
"""

import asyncio
import logging
import re

from app.config import settings

logger = logging.getLogger(__name__)

# YouTube URL patterns (watch and shorts)
YT_WATCH_PATTERN = re.compile(
    r"(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
)
YT_SHORTS_PATTERN = re.compile(r"youtube\.com/shorts/([a-zA-Z0-9_-]{11})")


def extract_video_id(video_link: str) -> str | None:
    """Extract YouTube video ID from URL. Returns None if not a YouTube link."""
    if not video_link or not isinstance(video_link, str):
        return None
    link = video_link.strip()
    m = YT_WATCH_PATTERN.search(link) or YT_SHORTS_PATTERN.search(link)
    return m.group(1) if m else None


def fetch_transcript(video_id: str) -> str | None:
    """
    Fetch transcript for a YouTube video using youtube_transcript_api.
    Uses instance API: api.fetch(video_id) -> iterable of entries with .text
    Returns concatenated text or None if unavailable.
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        logger.warning("youtube_transcript_api not installed; skipping transcript fetch")
        return None
    try:
        api = YouTubeTranscriptApi()
        # Prefer English, then Hindi and other common codes so we get a transcript when en isn't available
        transcript = api.fetch(video_id, languages=["en", "hi", "en-US", "en-GB"])
        if not transcript:
            return None
        return " ".join(entry.text for entry in transcript).strip()
    except Exception as e:
        logger.warning("Transcript fetch failed for video %s: %s", video_id, type(e).__name__)
        return None


def upload_transcript_to_s3(
    video_id: str,
    journey_id: str,
    text: str,
    *,
    chapter_id: str | None = None,
) -> bool:
    """
    Upload transcript text to S3 as a text file.
    Key: {s3_transcript_prefix}/{journey_id}/{video_id}[_{chapter_id}].txt
    Returns True on success, False if S3 not configured or upload fails.
    """
    bucket = (settings.s3_bucket or "").strip()
    if not bucket:
        logger.debug("S3 bucket not configured; skipping transcript upload")
        return False
    try:
        import boto3
        from botocore.exceptions import ClientError
    except ImportError:
        logger.warning("boto3 not available; skipping S3 upload")
        return False

    prefix = (settings.s3_transcript_prefix or "edutube/transcripts").strip().rstrip("/")
    region = settings.s3_region or settings.aws_region
    key = f"{prefix}/{journey_id}/{video_id}"
    if chapter_id:
        key = f"{key}_{chapter_id}"
    key = f"{key}.txt"

    kwargs = {"region_name": region}
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        kwargs["aws_access_key_id"] = settings.aws_access_key_id
        kwargs["aws_secret_access_key"] = settings.aws_secret_access_key

    try:
        client = boto3.client("s3", **kwargs)
        client.put_object(
            Bucket=bucket,
            Key=key,
            Body=text.encode("utf-8"),
            ContentType="text/plain; charset=utf-8",
        )
        logger.info("Uploaded transcript to s3://%s/%s", bucket, key)
        return True
    except ClientError as e:
        logger.warning("S3 upload failed for %s: %s", key, e)
        return False
    except Exception as e:
        logger.warning("S3 upload error for %s: %s", key, e)
        return False


def process_video_transcript(
    video_link: str,
    journey_id: str,
    chapter_id: str | None = None,
) -> None:
    """
    Sync worker: extract video ID, fetch transcript, upload to S3.
    Safe to run in a thread; logs errors and does not raise.
    """
    video_id = extract_video_id(video_link)
    if not video_id:
        logger.debug("Not a YouTube link, skipping transcript: %s", video_link[:80])
        return
    text = fetch_transcript(video_id)
    if not text:
        return
    upload_transcript_to_s3(video_id, journey_id, text, chapter_id=chapter_id)


async def schedule_transcript_processing(
    video_link: str,
    journey_id: str,
    chapter_id: str | None = None,
) -> None:
    """
    Async wrapper for background task: runs sync transcript fetch + S3 upload
    in a thread so the event loop is not blocked.
    """
    await asyncio.to_thread(
        process_video_transcript,
        video_link,
        journey_id,
        chapter_id,
    )


async def schedule_playlist_transcripts(
    video_links: list[str],
    journey_id: str,
) -> None:
    """
    Process multiple videos sequentially (playlist). Avoids thread-pool overload
    and rate limits from firing many tasks at once.
    """
    for link in video_links:
        await schedule_transcript_processing(link, journey_id, chapter_id=None)
