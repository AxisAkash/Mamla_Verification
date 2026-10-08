from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_env: str = "development"
    database_url: str = "sqlite:///./mamla_verification.db"
    cors_origins: str = "http://localhost:3000"
    seed_demo_data: bool = True
    auto_create_tables: bool = True
    max_request_bytes: int = Field(default=12_582_912, ge=1024, le=52_428_800)
    max_upload_bytes: int = Field(default=10_485_760, ge=1024, le=50_000_000)
    storage_root: str = "./storage"
    ocr_languages: str = "eng+ben"
    tesseract_cmd: str | None = None
    max_document_pages: int = Field(default=50, ge=1, le=500)

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
