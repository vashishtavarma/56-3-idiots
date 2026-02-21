# app/routers/chatbot.py
"""AWS Nova Lite–powered chatbot (normal and Knowledge-base RAG). Same model, different config."""

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.schemas import ChatRequest, ChatResponse, HealthResponse

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


def _aws_kwargs():
    """Shared AWS client kwargs from settings."""
    kwargs = {"region_name": settings.aws_region}
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        kwargs["aws_access_key_id"] = settings.aws_access_key_id
        kwargs["aws_secret_access_key"] = settings.aws_secret_access_key
    return kwargs


def _get_bedrock_client():
    """Bedrock Runtime client for Converse (Nova Lite)."""
    import boto3
    return boto3.client("bedrock-runtime", **_aws_kwargs())


def _get_kb_client():
    """Bedrock Agent Runtime client for Knowledge Base retrieve."""
    import boto3
    return boto3.client("bedrock-agent-runtime", **_aws_kwargs())


def _retrieve_from_knowledge_base(query: str) -> str:
    """
    Call Bedrock Knowledge Base retrieve with kbid; return concatenated chunk text.
    Returns empty string if KB not configured or retrieve fails.
    """
    kbid = (settings.knowledge_base_id or "").strip()
    if not kbid:
        return ""
    try:
        client = _get_kb_client()
        resp = client.retrieve(
            knowledgeBaseId=kbid,
            retrievalQuery={"text": query, "type": "TEXT"},
            retrievalConfiguration={
                "vectorSearchConfiguration": {"numberOfResults": 10}
            },
        )
        results = resp.get("retrievalResults") or []
        parts = []
        for item in results:
            content = item.get("content") or {}
            # Text chunks: content may have 'text' or nested structure
            text = content.get("text", "").strip() if isinstance(content.get("text"), str) else ""
            if text:
                parts.append(text)
        return "\n\n".join(parts) if parts else ""
    except Exception:
        return ""


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    """Normal chat or Knowledge-base chat; same Nova Lite model, different config."""
    if not body.message:
        raise HTTPException(status_code=400, detail="Message is required")
    try:
        client = _get_bedrock_client()
        system_prompt = """You are a helpful AI assistant for EduTube, a platform for organizing and tracking learning journeys. Provide concise, helpful responses. If the question is about "Agent SDK" or technical topics, explain them simply."""
        user_content = f"Current context: {body.context or 'General query'}\n\nUser question: {body.message}"

        if body.use_knowledge and (settings.knowledge_base_id or "").strip():
            # Knowledge mode: retrieve from KB, then send context + question to Nova Lite
            kb_context = _retrieve_from_knowledge_base(body.message)
            if kb_context:
                system_prompt = """You are a helpful EduTube assistant. Answer using ONLY the following knowledge-base excerpts when they are relevant. If the excerpts do not contain the answer, say so and keep the response brief."""
                user_content = f"""Knowledge base excerpts:\n{kb_context}\n\nUser question: {body.message}"""
            else:
                user_content = f"Current context: {body.context or 'General query'}\n\nUser question: {body.message}"

        response = client.converse(
            modelId=settings.bedrock_model_id,
            messages=[{"role": "user", "content": [{"text": user_content}]}],
            system=[{"text": system_prompt}],
        )
        output = response.get("output", {})
        message = output.get("message", {})
        content_blocks = message.get("content", [])
        text_parts = [
            block.get("text", "")
            for block in content_blocks
            if isinstance(block.get("text"), str)
        ]
        text = "".join(text_parts).strip() or "No response generated."
        return ChatResponse(response=text, success=True, fallback=False)
    except Exception as e:
        err_msg = str(e)
        if "ValidationException" in type(e).__name__ or "Validation" in err_msg:
            raise HTTPException(status_code=400, detail=err_msg)
        if "AccessDenied" in err_msg or "AccessDeniedException" in type(e).__name__:
            raise HTTPException(
                status_code=503,
                detail="Chatbot not configured. Set AWS credentials and enable Nova Lite in Bedrock.",
            )
        raise HTTPException(status_code=500, detail=err_msg or "Failed to process request")


@router.get("/health", response_model=HealthResponse)
async def health():
    try:
        _get_bedrock_client()
        nova_configured = True
    except Exception:
        nova_configured = False
    return HealthResponse(
        status="healthy",
        service="EduTube Chatbot",
        novaConfigured=nova_configured,
    )
