# app/schemas.py
"""Pydantic request/response schemas. IDs are strings (MongoDB ObjectId)."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


# ----- Users -----
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str


class UserCreateResponse(BaseModel):
    id: str


class TokenResponse(BaseModel):
    token: str


# ----- Journeys -----
class JourneyCreate(BaseModel):
    title: str | None = "Untitled Journey"
    description: str | None = ""
    is_public: bool = True


class JourneyUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_public: bool | None = None


class JourneyResponse(BaseModel):
    id: str
    title: str
    description: str
    is_public: bool
    user_id: str | None
    # Allow extra so we can return username for public list
    model_config = {"extra": "allow"}


class JourneyCreateResponse(BaseModel):
    id: str


class PlaylistCreate(BaseModel):
    playlistId: str = Field(..., alias="playlistId")

    model_config = {"populate_by_name": True}


# ----- Chapters -----
class ChapterCreate(BaseModel):
    title: str
    description: str | None = ""
    video_link: str
    external_link: str | None = ""
    chapter_no: int


class ChapterUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    video_link: str | None = None
    external_link: str | None = None
    chapter_no: int | None = None


class ChapterCompleteUpdate(BaseModel):
    is_completed: bool


class ChapterResponse(BaseModel):
    id: str
    title: str
    description: str
    video_link: str
    external_link: str | None
    is_completed: bool
    chapter_no: int
    journey_id: str
    model_config = {"extra": "allow"}


class ChapterCreateResponse(BaseModel):
    id: str


# ----- Notes -----
class NoteCreate(BaseModel):
    content: str


class NoteUpdate(BaseModel):
    content: str


class NoteResponse(BaseModel):
    id: str
    content: str
    chapter_id: str
    journey_id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
    model_config = {"extra": "allow"}


class NoteCreateResponse(BaseModel):
    message: str = "Note created successfully"
    noteId: str = Field(..., alias="noteId")

    model_config = {"populate_by_name": True, "serialize_by_alias": True}


# ----- Chatbot -----
class ChatRequest(BaseModel):
    message: str
    context: str | None = None
    use_knowledge: bool = False  # When True, prefer knowledge-base context (config only; still uses Nova Lite)


class ChatResponse(BaseModel):
    response: str
    success: bool = True
    fallback: bool = False


class HealthResponse(BaseModel):
    status: str
    service: str
    novaConfigured: bool = Field(..., alias="novaConfigured")

    model_config = {"populate_by_name": True, "serialize_by_alias": True}


def doc_to_journey(doc: dict[str, Any]) -> dict:
    """Convert MongoDB journey doc to API shape (id as string)."""
    doc["id"] = str(doc.pop("_id"))
    return doc


def doc_to_chapter(doc: dict[str, Any]) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def doc_to_note(doc: dict[str, Any]) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def doc_to_user(doc: dict[str, Any]) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc
