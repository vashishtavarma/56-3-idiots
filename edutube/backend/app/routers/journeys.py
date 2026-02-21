# app/routers/journeys.py
"""Journey CRUD, fork, playlist import, and public list."""

from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from app.auth import CurrentUser
from app.schemas import (
    JourneyCreate,
    JourneyUpdate,
    JourneyCreateResponse,
    PlaylistCreate,
)
from app.services.journey_service import (
    create_journey,
    get_all_journeys,
    get_journey_by_id,
    update_journey,
    delete_journey,
    fork_journey,
    get_all_public_journeys,
)
from app.services.chapter_service import create_chapter
from app.services.playlist_service import get_playlist_details, get_playlist_videos
from app.services.knowledge_pipeline import schedule_playlist_transcripts

router = APIRouter(tags=["journeys"])


@router.get("/journeys/public")
async def list_public_journeys():
    """List public journeys with username."""
    journeys = await get_all_public_journeys()
    if not journeys:
        raise HTTPException(status_code=404, detail="No public journeys found")
    return journeys


@router.post("/journeys", response_model=JourneyCreateResponse)
async def create_journey_route(body: JourneyCreate, user: CurrentUser):
    user_id = user.get("id")
    jid = await create_journey(
        title=body.title or "Untitled Journey",
        description=body.description or "",
        is_public=body.is_public,
        user_id=user_id,
    )
    return JourneyCreateResponse(id=jid)


@router.post("/journeys/playlist", response_model=JourneyCreateResponse)
async def create_journey_from_playlist(
    body: PlaylistCreate, user: CurrentUser, background_tasks: BackgroundTasks
):
    playlist_id = body.playlistId
    if not playlist_id:
        raise HTTPException(status_code=400, detail="Playlist ID is required")
    title, description = await get_playlist_details(playlist_id)
    user_id = user.get("id")
    jid = await create_journey(
        title=title,
        description=description,
        is_public=True,
        user_id=user_id,
    )
    videos = await get_playlist_videos(playlist_id)
    video_links = []
    for v in videos:
        video_link = v.get("videoLink", "no video")
        video_links.append(video_link)
        await create_chapter(
            journey_id=jid,
            title=v.get("title", ""),
            description=v.get("description", ""),
            video_link=video_link,
            external_link="",
            chapter_no=v.get("chapterNo", 1),
        )
    # Single background task processes all playlist transcripts sequentially (avoids thread/rate-limit issues)
    background_tasks.add_task(schedule_playlist_transcripts, video_links, jid)
    return JourneyCreateResponse(id=jid)


@router.get("/journeys")
async def list_journeys(user: CurrentUser):
    return await get_all_journeys(user["id"])


@router.get("/journeys/{journey_id}")
async def get_journey(journey_id: str, user: CurrentUser):
    journey = await get_journey_by_id(journey_id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    return journey


@router.put("/journeys/{journey_id}")
async def update_journey_route(journey_id: str, body: JourneyUpdate, user: CurrentUser):
    updated = await update_journey(
        journey_id,
        user["id"],
        title=body.title,
        description=body.description,
        is_public=body.is_public,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Journey not found")
    return {"message": "Journey updated"}


@router.delete("/journeys/{journey_id}")
async def delete_journey_route(journey_id: str, user: CurrentUser):
    deleted = await delete_journey(journey_id, user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Journey not found")
    return {"message": "Journey deleted"}


@router.post("/journeys/{journey_id}/fork")
async def fork_journey_route(journey_id: str, user: CurrentUser):
    try:
        new_jid = await fork_journey(journey_id, user["id"])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"message": "Journey forked successfully", "journeyId": new_jid}
