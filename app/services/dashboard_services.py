# from sqlalchemy.orm import Session

# from app.models.dashboard_model import Dashboard
# from app.database.models import User

# from app.schemas.dashboard_schema import DashboardResponse
# from app.schemas.dashboard_schema import JobResponse
# from app.database.models import Resume
# from app.database.models import ResumeAnalysis
# from app.database.models import Job
# from app.database.models import JobMatch

# # ==========================================
# # GET DASHBOARD DATA
# # ==========================================

# def get_dashboard_data(db: Session, user_id: int):

#     dashboard = (
#         db.query(Dashboard)
#         .filter(Dashboard.user_id == user_id)
#         .first()
#     )

#     user = (
#         db.query(User)
#         .filter(User.id == user_id)
#         .first()
#     )

#     if not user:
#         return None

#     # --------------------------------------
#     # Create dashboard if it doesn't exist
#     # --------------------------------------

#     if not dashboard:

#         dashboard = Dashboard(

#             user_id=user.id,

#             resume_name="No Resume Uploaded",

#             ats_score=0,

#             profile_strength=0,

#             skills_count=0,

#             resume_health=0,

#             job_matches=0

#         )

#         db.add(dashboard)

#         db.commit()

#         db.refresh(dashboard)

#     # --------------------------------------
# # Latest Resume
# # --------------------------------------

#     latest_resume = (

#     db.query(Resume)

#     .filter(Resume.user_id == user_id)

#     .order_by(Resume.id.desc())

#     .first()

# )

# # --------------------------------------
# # Latest Resume Analysis
# # --------------------------------------

# latest_analysis = None

# if latest_resume:

#         latest_analysis = (

#         db.query(ResumeAnalysis)

#         .filter(

#             ResumeAnalysis.resume_id == latest_resume.id

#         )

#         .order_by(

#             ResumeAnalysis.id.desc()

#         )

#         .first()

#     )

# # --------------------------------------
# # Job Matches
# # --------------------------------------

# job_matches = []

# if latest_analysis:

#     job_matches = (

#         db.query(JobMatch)

#         .filter(

#             JobMatch.resume_analysis_id == latest_analysis.id

#         )

#         .all()

#     )

# # --------------------------------------
# # Jobs
# # --------------------------------------

# jobs = []

# for match in job_matches:

#     job = (

#         db.query(Job)

#         .filter(Job.id == match.job_id)

#         .first()

#     )

#     if job:

#         jobs.append(

#             JobResponse(

#                 title=job.title,

#                 company=job.company,

#                 location=job.location,

#                 match_score=match.match_score,

#                 apply_link=job.apply_link

#             )

#         )

# # --------------------------------------
# # Skills
# # --------------------------------------

# skills = []

# if latest_analysis and latest_analysis.skills:

#     skills = latest_analysis.skills.split(",")

# # --------------------------------------
# # Suggestions
# # --------------------------------------

# suggestions = []

# if latest_analysis and latest_analysis.suggestions:

#     suggestions = latest_analysis.suggestions.split("|")

#     # --------------------------------------
#     # Return Dashboard
#     # --------------------------------------

#     return DashboardResponse(

#         username=user.username,

#         email=user.email,

#         resume_name=dashboard.resume_name,

#         ats_score=dashboard.ats_score,

#         profile_strength=dashboard.profile_strength,

#         skills_count=dashboard.skills_count,

#         resume_health=dashboard.resume_health,

#         job_matches=dashboard.job_matches,

#         skills=skills,

#         suggestions=suggestions,

#         jobs=jobs,

#         created_at=dashboard.created_at,

#         updated_at=dashboard.updated_at

#     )
from sqlalchemy.orm import Session

from app.models.dashboard_model import Dashboard
from app.models.resume_analysis import ResumeAnalysis
from app.database.models import (
    User,
    Resume,
    Job,
    JobMatch
)

from app.schemas.dashboard_schema import (
    DashboardResponse,
    JobResponse
)


# ==========================================
# GET DASHBOARD DATA
# ==========================================

def get_dashboard_data(db: Session, user_id: int):

    # --------------------------------------
    # USER
    # --------------------------------------

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    # --------------------------------------
    # DASHBOARD
    # --------------------------------------

    dashboard = (
        db.query(Dashboard)
        .filter(Dashboard.user_id == user_id)
        .first()
    )

    if not dashboard:

        dashboard = Dashboard(

            user_id=user.id,

            resume_name="No Resume Uploaded",

            ats_score=0,

            profile_strength=0,

            skills_count=0,

            resume_health=0,

            job_matches=0

        )

        db.add(dashboard)

        db.commit()

        db.refresh(dashboard)

    # --------------------------------------
    # LATEST RESUME
    # --------------------------------------

    latest_resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.id.desc())
        .first()
    )

    # --------------------------------------
    # LATEST RESUME ANALYSIS
    # --------------------------------------

    latest_analysis = None

    if latest_resume:

        latest_analysis = (
            db.query(ResumeAnalysis)
            .filter(
                ResumeAnalysis.resume_id == latest_resume.id
            )
            .order_by(
                ResumeAnalysis.id.desc()
            )
            .first()
        )

    # --------------------------------------
    # JOB MATCHES
    # --------------------------------------

    job_matches = []

    if latest_analysis:

        job_matches = (
            db.query(JobMatch)
            .filter(
                JobMatch.resume_analysis_id == latest_analysis.id
            )
            .all()
        )

    # --------------------------------------
    # JOBS
    # --------------------------------------

    jobs = []

    for match in job_matches:

        job = (
            db.query(Job)
            .filter(Job.id == match.job_id)
            .first()
        )

        if job:

            jobs.append(

                JobResponse(

                    title=job.title,

                    company=job.company,

                    location=job.location,

                    match_score=match.match_score,

                    apply_link=job.apply_link

                )

            )

    # --------------------------------------
    # SKILLS
    # --------------------------------------

    skills = []

    if latest_analysis and latest_analysis.skills:

        skills = latest_analysis.skills.split(",")

    # --------------------------------------
    # SUGGESTIONS
    # --------------------------------------

    suggestions = []

    if (
        latest_analysis
        and hasattr(latest_analysis, "suggestions")
        and latest_analysis.suggestions
    ):

        suggestions = latest_analysis.suggestions.split("|")

    # --------------------------------------
    # RETURN DASHBOARD
    # --------------------------------------

    return DashboardResponse(

        username=user.username,

        email=user.email,

        resume_name=(
            latest_resume.filename
            if latest_resume
            else dashboard.resume_name
        ),

        ats_score=(
            latest_analysis.ats_score
            if latest_analysis
            else dashboard.ats_score
        ),

        profile_strength=(
            latest_analysis.profile_strength
            if latest_analysis
            else dashboard.profile_strength
        ),

        skills_count=len(skills),

        resume_health=(
            latest_analysis.resume_health
            if latest_analysis
            else dashboard.resume_health
        ),

        job_matches=len(job_matches),

        skills=skills,

        suggestions=suggestions,

        jobs=jobs,

        created_at=dashboard.created_at,

        updated_at=dashboard.updated_at

    )