# app/services/note_service.py
"""Note CRUD using MongoDB."""

from bson import ObjectId
from datetime import datetime

from app.database import get_db
from app.schemas import doc_to_note


def _oid(s: str) -> ObjectId | None:
    try:
        return ObjectId(s)
    except Exception:
        return None


async def create_note(chapter_id: str, journey_id: str, content: str, title: str | None = None) -> str:
    db = get_db()
    result = await db.notes.insert_one(
        {
            "content": content,
            "title": (title or "").strip() or None,
            "chapter_id": chapter_id,
            "journey_id": journey_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )
    return str(result.inserted_id)


async def get_notes_by_chapter_id(chapter_id: str) -> list[dict]:
    db = get_db()
    cursor = db.notes.find({"chapter_id": chapter_id}).sort("created_at", 1)
    out = []
    async for doc in cursor:
        out.append(doc_to_note(doc))
    return out


async def get_notes_by_journey_id(journey_id: str) -> list[dict]:
    db = get_db()
    cursor = db.notes.find({"journey_id": journey_id}).sort(
        [("chapter_id", 1), ("created_at", 1)]
    )
    out = []
    async for doc in cursor:
        out.append(doc_to_note(doc))
    return out


async def get_note_by_id(note_id: str) -> dict | None:
    oid = _oid(note_id)
    if not oid:
        return None
    doc = await get_db().notes.find_one({"_id": oid})
    if not doc:
        return None
    return doc_to_note(doc)


async def update_note(note_id: str, content: str | None = None, title: str | None = None) -> bool:
    oid = _oid(note_id)
    if not oid:
        return False
    updates = {"updated_at": datetime.utcnow()}
    if content is not None:
        updates["content"] = content
    if title is not None:
        updates["title"] = title.strip() or None
    if len(updates) <= 1:
        return False
    r = await get_db().notes.update_one({"_id": oid}, {"$set": updates})
    return r.modified_count > 0


async def delete_note(note_id: str) -> bool:
    oid = _oid(note_id)
    if not oid:
        return False
    r = await get_db().notes.delete_one({"_id": oid})
    return r.deleted_count > 0
