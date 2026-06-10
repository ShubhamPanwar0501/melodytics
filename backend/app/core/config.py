from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://app:secret@db:5432/melodytics"
    cors_origins: list[str] = ["http://localhost:3000"]

    @property
    def async_database_url(self) -> str:
        return self.database_url.replace("postgresql://", "postgresql+asyncpg://")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
