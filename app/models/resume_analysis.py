from sqlalchemy import Column, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class ResumeAnalysis(Base):

    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(Integer, ForeignKey("resumes.id"))

    ats_score = Column(Float)

    profile_strength = Column(Float)

    resume_health = Column(Float)

    skills = Column(Text)

    suggestions = Column(Text)

    summary = Column(Text)

    created_at = Column(Text)

    resume = relationship("Resume")