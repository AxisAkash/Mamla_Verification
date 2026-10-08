import re
from dataclasses import dataclass


@dataclass(frozen=True)
class ExtractedFact:
    key: str
    label: str
    value: str
    confidence: int
    source_reference: str
    source_text: str


class StructuredNoticeExtractionService:
    """Conservative field extraction from retained text; no values are guessed."""

    def extract(self, text: str) -> list[ExtractedFact]:
        if not text.strip():
            return []
        facts: list[ExtractedFact] = []
        self._add_labelled(facts, text, "noticeType", "Notice type", self._labels("notice type", "document type", "\u09a8\u09cb\u099f\u09bf\u09b6\u09c7\u09b0 \u09a7\u09b0\u09a8"), 90)
        self._add_labelled(facts, text, "noticeNumber", "Notice number", self._labels("notice number", "reference number", "challan number", "ref", "নোটিশ নম্বর", "রেফারেন্স নম্বর"), 92)
        self._add_labelled(facts, text, "issuingAuthority", "Issuing authority", self._labels("issuing authority", "issued by", "authority", "ইস্যুকারী কর্তৃপক্ষ"), 90)
        self._add_labelled(facts, text, "violation", "Alleged violation", self._labels("violation", "offence", "offense", "অপরাধ", "লঙ্ঘন"), 86)
        self._add_labelled(facts, text, "penaltyAmount", "Fine or penalty", self._labels("fine", "penalty", "amount", "জরিমানা", "দণ্ড"), 86)
        self._add_labelled(facts, text, "location", "Location", self._labels("location", "place", "at", "স্থান", "অবস্থান"), 84)
        self._add_labelled(facts, text, "vehicleRegistration", "Vehicle registration", self._labels("vehicle registration", "registration", "reg no", "গাড়ির নম্বর", "যানবাহন নম্বর"), 88)
        self._add_labelled(facts, text, "vehicleType", "Vehicle type", self._labels("vehicle type", "vehicle", "যানবাহনের ধরন"), 84)
        self._add_labelled(facts, text, "vehicleMake", "Vehicle make", self._labels("vehicle make", "make"), 84)
        self._add_labelled(facts, text, "vehicleModel", "Vehicle model", self._labels("vehicle model", "model"), 84)
        self._add_labelled(facts, text, "date", "Date", self._labels("date", "issued on", "তারিখ"), 88)
        self._add_labelled(facts, text, "time", "Time", self._labels("time", "issued at", "সময়", "সময়"), 88)
        self._add_pattern(facts, text, "noticeNumber", "Notice number", r"\b[A-Z]{1,8}[-/]\d{2,}(?:[-/]\d{1,})*\b", 72)
        self._add_pattern(facts, text, "vehicleRegistration", "Vehicle registration", r"\b[A-Z]{2,5}[- ]?[A-Z]{1,4}[- ]?\d{3,6}\b", 72)
        self._add_pattern(facts, text, "date", "Date", r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b|\b[০-৯]{1,2}[/-][০-৯]{1,2}[/-][০-৯]{2,4}\b", 76)
        self._add_pattern(facts, text, "time", "Time", r"\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\b|\b[০-৯]{1,2}:[০-৯]{2}\b", 76)
        return facts

    @staticmethod
    def _labels(*labels: str) -> tuple[str, ...]:
        return labels

    def _add_labelled(self, facts: list[ExtractedFact], text: str, key: str, label: str, labels: tuple[str, ...], confidence: int) -> None:
        if any(fact.key == key for fact in facts):
            return
        label_pattern = "|".join(re.escape(item) for item in labels)
        match = re.search(rf"(?im)^\s*(?:{label_pattern})\s*(?:[:#-])\s*(?P<value>[^\r\n]+)", text)
        if match:
            value = self._clean_value(match.group("value"))
            if value:
                facts.append(self._fact(key, label, value, confidence, text, match.start("value"), match.end("value")))

    def _add_pattern(self, facts: list[ExtractedFact], text: str, key: str, label: str, pattern: str, confidence: int) -> None:
        if any(fact.key == key for fact in facts):
            return
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            facts.append(self._fact(key, label, match.group(0), confidence, text, match.start(), match.end()))

    @staticmethod
    def _clean_value(value: str) -> str:
        return re.sub(r"\s+", " ", value).strip(" \t:;-.")

    @staticmethod
    def _fact(key: str, label: str, value: str, confidence: int, text: str, start: int, end: int) -> ExtractedFact:
        start = max(0, start - 80)
        end = min(len(text), end + 80)
        return ExtractedFact(key, label, value, confidence, f"raw_chars:{start}-{end}", text[start:end])
