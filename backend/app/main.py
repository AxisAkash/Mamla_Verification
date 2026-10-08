from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.api.routes.cases import router as cases_router
from app.api.routes.health import router as health_router
from app.core.config import Settings, get_settings
from app.core.database import create_database_engine, create_session_factory, initialize_database
from app.seed.demo_data import seed_demo_data
from app.services.errors import CaseNotFoundError, InvalidFactsError


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings: Settings = app.state.settings
    if settings.auto_create_tables:
        initialize_database(app.state.engine)
    if settings.seed_demo_data:
        session = app.state.session_factory()
        try:
            seed_demo_data(session)
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()
    yield
    app.state.engine.dispose()


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()
    app = FastAPI(
        title="Mamla Verification API",
        version="0.1.0",
        description="Backend foundation for an evidence-oriented traffic-notice workflow. Demo results are not legal advice.",
        lifespan=lifespan,
    )
    app.state.settings = resolved_settings
    app.state.engine = create_database_engine(resolved_settings)
    app.state.session_factory = create_session_factory(app.state.engine)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.cors_origin_list,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["Content-Type"],
    )

    @app.middleware("http")
    async def request_size_limit(request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and content_length.isdigit() and int(content_length) > resolved_settings.max_request_bytes:
            return JSONResponse(status_code=413, content={"error": {"code": "request_too_large", "message": "Request body is too large."}})
        return await call_next(request)

    @app.exception_handler(CaseNotFoundError)
    async def case_not_found(_: Request, exc: CaseNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"error": {"code": "case_not_found", "message": "The requested case was not found."}})

    @app.exception_handler(InvalidFactsError)
    async def invalid_facts(_: Request, exc: InvalidFactsError) -> JSONResponse:
        return JSONResponse(status_code=422, content={"error": {"code": "invalid_fact_key", "message": "The submitted facts contain an unsupported key."}})

    @app.exception_handler(RequestValidationError)
    async def request_validation(_: Request, exc: RequestValidationError) -> JSONResponse:
        del exc
        return JSONResponse(status_code=422, content={"error": {"code": "validation_error", "message": "Request validation failed."}})

    @app.exception_handler(SQLAlchemyError)
    async def database_error(_: Request, exc: SQLAlchemyError) -> JSONResponse:
        del exc
        return JSONResponse(status_code=503, content={"error": {"code": "database_unavailable", "message": "The service could not complete the request."}})

    @app.exception_handler(Exception)
    async def unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        del exc
        return JSONResponse(status_code=500, content={"error": {"code": "internal_error", "message": "The service could not complete the request."}})

    app.include_router(health_router, prefix="/api")
    app.include_router(cases_router, prefix="/api")
    app.include_router(cases_router, prefix="/api/v1", include_in_schema=False)
    return app


app = create_app()
