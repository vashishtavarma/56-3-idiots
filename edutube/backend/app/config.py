# app/config.py
"""Application configuration from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings loaded from environment (e.g. .env)."""

    # Server
    port: int = 5000
    frontend_url: str = "http://localhost:5173"

    # Auth
    jwt_secret: str = "super-secure-jwt-secret-key-for-development-only"
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 10

    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    # Must match case of existing DB; MongoDB rejects e.g. "edutube" if "EduTube" exists
    mongodb_db_name: str = "EduTube"

    # Optional: YouTube (YT_KEY)
    yt_key: str = ""
    # AWS Bedrock (Nova Lite)
    aws_region: str = "ap-south-1"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    nova_lite_model_id: str = "apac.amazon.nova-lite-v1:0"
    # Optional: set to full inference profile ARN if profile ID returns "invalid model identifier"
    bedrock_inference_profile_arn: str = ""

    # Knowledge base: S3 bucket for transcript uploads (sync later)
    s3_bucket: str = ""
    s3_transcript_prefix: str = "edutube/transcripts"
    s3_region: str | None = None  # defaults to aws_region if unset

    # RAG: Bedrock Knowledge Base ID (for Knowledge-mode chat; same Nova Lite model)
    knowledge_base_id: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def cors_origins(self) -> list[str]:
        if "," in self.frontend_url:
            return [o.strip() for o in self.frontend_url.split(",")]
        return [self.frontend_url] if self.frontend_url else []

    @property
    def bedrock_model_id(self) -> str:
        """Model ID for Converse API. Use short ID (required by Bedrock Converse)."""
        raw = (self.nova_lite_model_id or "").strip()
        # If user set an ARN, Converse often rejects it; use regional short ID instead.
        if raw.startswith("arn:") or (self.bedrock_inference_profile_arn or "").strip():
            return self._nova_lite_short_id_for_region()
        return raw or self._nova_lite_short_id_for_region()

    def _nova_lite_short_id_for_region(self) -> str:
        """Nova Lite short model ID valid for Converse in this region."""
        r = (self.aws_region or "us-east-1").lower()
        if r.startswith("ap-"):
            return "apac.amazon.nova-lite-v1:0"
        return "amazon.nova-lite-v1:0"


settings = Settings()
