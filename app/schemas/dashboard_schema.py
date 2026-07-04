from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ==========================================
# Job Response
# ==========================================

class JobResponse(BaseModel):

    title: str

    company: str

    location: str

    match_score: float

    apply_link: str


# ==========================================
# Dashboard Response
# ==========================================

class DashboardResponse(BaseModel):

    username: str

    email: str

    resume_name: Optional[str] = None

    ats_score: float

    profile_strength: float

    skills_count: int

    resume_health: float

    job_matches: int

    skills: List[str]

    suggestions: List[str]

    jobs: List[JobResponse]

    created_at: Optional[datetime] = None

    updated_at: Optional[datetime] = None

    class Config:

        from_attributes = True