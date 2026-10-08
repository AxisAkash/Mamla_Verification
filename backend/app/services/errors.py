class CaseNotFoundError(Exception):
    def __init__(self, case_id: str) -> None:
        super().__init__(f"Case '{case_id}' was not found")
        self.case_id = case_id


class InvalidFactsError(Exception):
    def __init__(self, key: str) -> None:
        super().__init__(f"Unsupported notice fact key: {key}")
        self.key = key
