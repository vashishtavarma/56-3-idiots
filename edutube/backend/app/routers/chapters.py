# app/routers/chapters.py
"""Chapter CRUD under journeys."""

from fastapi import APIRouter, BackgroundTasks, HTTPException

from app.auth import CurrentUser
from app.schemas import ChapterCreate, ChapterUpdate, ChapterCompleteUpdate, ChapterCreateResponse
from app.services.chapter_service import (
    create_chapter,
    get_chapters_by_journey_id,
    get_chapter_by_id,
    update_chapter,
    update_chapter_complete,
    delete_chapter,
)
from app.services.knowledge_pipeline import schedule_transcript_processing

router = APIRouter(prefix="/journeys", tags=["chapters"])


@router.post("/{journey_id}/chapters", response_model=ChapterCreateResponse)
async def create_chapter_route(
    journey_id: str,
    body: ChapterCreate,
    user: CurrentUser,
    background_tasks: BackgroundTasks,
):
    cid = await create_chapter(
        journey_id=journey_id,
        title=body.title,
        description=body.description or "",
        video_link=body.video_link,
        external_link=body.external_link or "",
        chapter_no=body.chapter_no,
    )
    # Knowledge base: extract transcript and upload to S3 in background (non-blocking)
    background_tasks.add_task(
        schedule_transcript_processing,
        body.video_link,
        journey_id,
        chapter_id=cid,
    )
    return ChapterCreateResponse(id=cid)


@router.get("/{journey_id}/chapters")
async def list_chapters(journey_id: str, user: CurrentUser):
    return await get_chapters_by_journey_id(journey_id)


@router.get("/chapters/{chapter_id}")
async def get_chapter(chapter_id: str, user: CurrentUser):
    ch = await get_chapter_by_id(chapter_id)
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return ch


@router.put("/chapters/{chapter_id}")
async def update_chapter_route(chapter_id: str, body: ChapterUpdate, user: CurrentUser):
    updated = await update_chapter(
        chapter_id,
        title=body.title,
        description=body.description,
        video_link=body.video_link,
        external_link=body.external_link,
        chapter_no=body.chapter_no,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {"message": "Chapter updated successfully"}


@router.put("/chapters/isComplete/{chapter_id}")
async def update_chapter_complete_route(
    chapter_id: str,
    body: ChapterCompleteUpdate,
    user: CurrentUser,
):
    updated = await update_chapter_complete(chapter_id, body.is_completed)
    if not updated:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {"message": "Chapter updated successfully"}


@router.delete("/chapters/{chapter_id}")
async def delete_chapter_route(chapter_id: str, user: CurrentUser):
    deleted = await delete_chapter(chapter_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {"message": "Chapter deleted successfully"}
