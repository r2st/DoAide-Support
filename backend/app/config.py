from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/doaide_support"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    OPENROUTER_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "support@doaide.com"

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    REDIS_URL: str = ""

    model_config = {"env_file": "../keys/.env", "extra": "ignore"}


settings = Settings()
