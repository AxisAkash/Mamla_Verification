from typing import Protocol

from app.models import LegalProvision


class LegalRetrievalService(Protocol):
    """Future seam for a curated legal source; no retrieval is performed today."""

    def find_for_notice(self, violation: str) -> list[LegalProvision]:
        ...


class EmptyLegalRetrievalService:
    def find_for_notice(self, violation: str) -> list[LegalProvision]:
        del violation
        return []
