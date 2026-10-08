from app.schemas.common import APIModel


class HealthResponse(APIModel):
    status: str
    environment: str
    database: str


class ErrorBody(APIModel):
    code: str
    message: str


class ErrorResponse(APIModel):
    error: ErrorBody
