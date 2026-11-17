
# Provides REST endpoints for creating, reading, updating, and deleting surveys.

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Survey, SurveyCreate, SurveyRead, SurveyUpdate

router = APIRouter(prefix="/api/surveys", tags=["Surveys"])


@router.post("", response_model=SurveyRead, status_code=201)
def create_survey(
    data: SurveyCreate,
    session: Session = Depends(get_session)
):
    survey = Survey(**data.model_dump())

    session.add(survey)
    session.commit()
    session.refresh(survey)

    return survey


@router.get("", response_model=list[SurveyRead])
def get_surveys(session: Session = Depends(get_session)):
    statement = select(Survey).order_by(Survey.id.desc())
    return session.exec(statement).all()


@router.get("/{survey_id}", response_model=SurveyRead)
def get_survey(
    survey_id: int,
    session: Session = Depends(get_session)
):
    survey = session.get(Survey, survey_id)

    if survey is None:
        raise HTTPException(status_code=404, detail="Survey not found")

    return survey


@router.put("/{survey_id}", response_model=SurveyRead)
def update_survey(
    survey_id: int,
    data: SurveyUpdate,
    session: Session = Depends(get_session)
):
    survey = session.get(Survey, survey_id)

    if survey is None:
        raise HTTPException(status_code=404, detail="Survey not found")

    for key, value in data.model_dump().items():
        setattr(survey, key, value)

    session.add(survey)
    session.commit()
    session.refresh(survey)

    return survey


@router.delete("/{survey_id}", status_code=204)
def delete_survey(
    survey_id: int,
    session: Session = Depends(get_session)
):
    survey = session.get(Survey, survey_id)

    if survey is None:
        raise HTTPException(status_code=404, detail="Survey not found")

    session.delete(survey)
    session.commit()
