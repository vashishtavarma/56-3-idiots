# app/routers/notes.py
"""Note CRUD endpoints."""

from fastapi import APIRouter, HTTPException

from app.auth import CurrentUser
from app.schemas import NoteCreate, NoteUpdate, NoteCreateResponse
from app.services.note_service import (
    create_note,
    get_notes_by_chapter_id,
    get_notes_by_journey_id,
    get_note_by_id,
    update_note,
    delete_note,
)
from app.services.journey_service import get_journey_by_id
from app.services.chapter_service import get_chapter_by_id

router = APIRouter(tags=["notes"])


@router.post("/journeys/{journey_id}/chapters/{chapter_id}/notes", response_model=NoteCreateResponse)
async def create_note_route(
    journey_id: str,
    chapter_id: str,
    body: NoteCreate,
    user: CurrentUser,
):
    journey = await get_journey_by_id(journey_id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    chapter = await get_chapter_by_id(chapter_id)
    if not chapter or chapter.get("journey_id") != journey_id:
        raise HTTPException(
            status_code=404,
            detail="Chapter not found or does not belong to the specified journey",
        )
    note_id = await create_note(chapter_id, journey_id, body.content, body.title)
    return NoteCreateResponse(noteId=note_id)


@router.get("/chapters/{chapter_id}/notes")
async def get_notes_by_chapter(chapter_id: str, user: CurrentUser):
    chapter = await get_chapter_by_id(chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return await get_notes_by_chapter_id(chapter_id)


@router.get("/journeys/{journey_id}/notes")
async def get_notes_by_journey(journey_id: str, user: CurrentUser):
    journey = await get_journey_by_id(journey_id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    return await get_notes_by_journey_id(journey_id)


@router.get("/notes/{note_id}")
async def get_note(note_id: str, user: CurrentUser):
    note = await get_note_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/notes/{note_id}")
async def update_note_route(note_id: str, body: NoteUpdate, user: CurrentUser):
    existing = await get_note_by_id(note_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Note not found")
    updated = await update_note(note_id, body.content, body.title)
    if not updated:
        raise HTTPException(status_code=400, detail="Failed to update note")
    return {"message": "Note updated successfully"}


@router.delete("/notes/{note_id}")
async def delete_note_route(note_id: str, user: CurrentUser):
    existing = await get_note_by_id(note_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Note not found")
    deleted = await delete_note(note_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="Failed to delete note")
    return {"message": "Note deleted successfully"}
