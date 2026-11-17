
# Defines the Survey database table and API request/response models.

from datetime import date
from pydantic import EmailStr, field_validator
from sqlalchemy import JSON
from sqlmodel import SQLModel, Field

LIKED_OPTIONS = {
    "Students", "Location", "Campus",
    "Atmosphere", "Dorm Rooms", "Sports"
}

INTEREST_OPTIONS = {
    "Friends", "Television", "Internet", "Other"
}

RECOMMEND_OPTIONS = {
    "Very Likely", "Likely", "Unlikely"
}


class Survey(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip_code: str
    telephone: str
    email: str
    survey_date: date

    liked_most: list[str] = Field(
        default_factory=list,
        sa_type=JSON
    )

    interest_source: str | None = None
    recommendation: str | None = None
    raffle: str | None = None
    comments: str | None = None


class SurveyData(SQLModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    street_address: str = Field(min_length=1)
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    zip_code: str = Field(min_length=1)
    telephone: str = Field(min_length=1)
    email: EmailStr
    survey_date: date

    liked_most: list[str] = Field(default_factory=list)
    interest_source: str | None = None
    recommendation: str | None = None
    raffle: str | None = None
    comments: str | None = None

    @field_validator(
        "first_name", "last_name", "street_address",
        "city", "state", "zip_code", "telephone"
    )
    @classmethod
    def validate_required_text(cls, value: str):
        if not value.strip():
            raise ValueError("This field cannot be empty")
        return value.strip()

    @field_validator("liked_most")
    @classmethod
    def validate_liked(cls, values: list[str]):
        if any(value not in LIKED_OPTIONS for value in values):
            raise ValueError("Invalid campus preference")
        return list(dict.fromkeys(values))

    @field_validator("interest_source")
    @classmethod
    def validate_interest(cls, value: str | None):
        if value is not None and value not in INTEREST_OPTIONS:
            raise ValueError("Invalid interest source")
        return value

    @field_validator("recommendation")
    @classmethod
    def validate_recommendation(cls, value: str | None):
        if value is not None and value not in RECOMMEND_OPTIONS:
            raise ValueError("Invalid recommendation option")
        return value


class SurveyCreate(SurveyData):
    pass


class SurveyUpdate(SurveyData):
    pass


class SurveyRead(SurveyData):
    id: int
