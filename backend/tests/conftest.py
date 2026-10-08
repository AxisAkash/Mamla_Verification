from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


@pytest.fixture
def client(tmp_path) -> Iterator[TestClient]:
    settings = Settings(
        app_env="test",
        database_url=f"sqlite:///{(tmp_path / 'test.db').as_posix()}",
        cors_origins="http://testserver",
        seed_demo_data=True,
        auto_create_tables=True,
    )
    application = create_app(settings)
    with TestClient(application) as test_client:
        yield test_client
