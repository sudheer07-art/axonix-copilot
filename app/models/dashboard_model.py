from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Dashboard(Base):

    __tablename__ = "dashboard"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    resume_name = Column(
        String,
        nullable=True
    )

    ats_score = Column(
        Integer,
        default=0
    )

    profile_strength = Column(
        Integer,
        default=0
    )

    skills_count = Column(
        Integer,
        default=0
    )

    job_matches = Column(
        Integer,
        default=0
    )

    resume_health = Column(
        Integer,
        default=0
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        server_default=func.now()
    )

    # user = relationship(
    #     "User",
    #     back_populates="dashboard"
    # )