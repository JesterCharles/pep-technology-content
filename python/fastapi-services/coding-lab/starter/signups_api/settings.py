"""Settings for calling the Spring Boot workshop catalog, read from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """TODO Task 4: declare the three settings described in README.md.

    SPRING_BASE_URL     -> spring_base_url: str (required)
    SPRING_TOKEN        -> spring_token: str (required)
    SPRING_TIMEOUT_SECONDS -> spring_timeout_seconds: float, default 2.0
    """
