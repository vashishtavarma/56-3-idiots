# app/routers/chatbot.py
"""Gemini-powered chatbot endpoint."""

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.schemas import ChatRequest, ChatResponse, HealthResponse

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    """Send message to Gemini and return response."""
    if not body.message:
        raise HTTPException(status_code=400, detail="Message is required")
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Chatbot not configured. Set GEMINI_API_KEY in environment.",
        )
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.gemini_api_key)
        # Prefer gemini-2.0-flash; fallback to gemini-1.5-flash if needed
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = f"""You are a helpful AI assistant for EduTube, a platform for organizing and tracking learning journeys.
Current context: {body.context or 'General query'}
User question: {body.message}
Provide a concise, helpful response. If the question is about "Agent SDK" or technical topics, explain them simply."""
        response = await model.generate_content_async(prompt)
        text = response.text if response.text else ""
        return ChatResponse(response=text, success=True, fallback=False)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to process request",
        )


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        service="EduTube Chatbot",
        geminiConfigured=bool(settings.gemini_api_key),
    )
