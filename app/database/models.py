from sqlalchemy import Column, Integer, String
from app.database.database import Base
from sqlalchemy import Column, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from datetime import datetime


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

class Resume(Base):

    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)

    resume_text = Column(Text)

    ats_score = Column(Integer, default=0)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User")
class Job(Base):

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    company = Column(String)

    location = Column(String)

    description = Column(Text)
    salary = Column(String)

    skills = Column(Text)

    apply_link = Column(Text)
class JobMatch(Base):

    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)

    resume_analysis_id = Column(
        Integer,
        ForeignKey("resume_analysis.id")
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id")
    )

    match_score = Column(Float)

    ats_score = Column(Float)

    matched_skills = Column(Text)

    missing_skills = Column(Text)

    recommendations = Column(Text)

    resume_analysis = relationship("ResumeAnalysis")

    job = relationship("Job")