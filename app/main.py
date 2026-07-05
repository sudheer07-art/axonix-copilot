from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    Depends
)

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

import os
import shutil
import json

# ===========================
# Database
# ===========================

from app.database.database import (
    Base,
    engine,
    get_db
)

from app.database.models import (
    User,
    Resume,
    Job,
    JobMatch
)

# ===========================
# Models
# ===========================

from app.models.resume_analysis import ResumeAnalysis
from app.models.dashboard_model import Dashboard

# ===========================
# Authentication
# ===========================

from app.auth.auth import (
    router as auth_router
)

from app.auth.dependencies import (
    get_current_user
)

# ===========================
# Routers
# ===========================

from app.routers.dashboard_routers import (
    router as dashboard_routers
)

# ===========================
# Services
# ===========================

from app.services.resume_parser import (
    extract_text_from_pdf
)

from app.services.resume_analyzer import (
    analyze_resume
)

from app.services.job_search import (
    search_jobs
)

from app.services.job_matcher import (
    match_jobs
)

from app.services.ai_resume_review import (
    review_resume
)

from app.services.keyword_optimizer import (
    optimize_keywords
)

from app.services.jd_matcher import (
    match_resume_with_jd
)

app = FastAPI(
    title="AI Job Search Copilot"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://axonix-copilot.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all database tables
Base.metadata.create_all(bind=engine)
app.include_router(auth_router)
app.include_router(dashboard_routers)

UPLOAD_DIR = "uploads"
os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@app.get("/")
def home():
    return {
        "message": "AI Job Search Copilot Running"
    }


# =====================================
# Upload Resume
# =====================================
@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)

    resume = Resume(
        filename=file.filename,
        filepath=file_path,
        resume_text=text,
        user_id=current_user.id
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id
    }


# =====================================
# Analyze Resume
# =====================================
@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # ===========================
    # Save Uploaded Resume
    # ===========================

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ===========================
    # Extract Resume Text
    # ===========================

    text = extract_text_from_pdf(file_path)

    # ===========================
    # AI Analysis
    # ===========================

    analysis = analyze_resume(text)
    resume_skills = analysis.get("skills", [])

    print("\nAI Job Search Queries")
    print(analysis.get("job_search_queries", []))

    # ===========================
    # Save Resume
    # ===========================

    resume = Resume(
        filename=file.filename,
        filepath=file_path,
        resume_text=text,
        user_id=current_user.id
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    # ===========================
    # Save Resume Analysis
    # ===========================

    analysis_record = ResumeAnalysis(
        resume_id=resume.id,
        ats_score=analysis.get("ats_score", 0),
        profile_strength=analysis.get("profile_strength", 0),
        resume_health=analysis.get("resume_health", 0),
        skills=",".join(analysis.get("skills", [])),
        suggestions="|".join(analysis.get("suggestions", [])),
        summary=analysis.get("summary", ""),
        analysis_json=json.dumps(analysis)
    )

    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    job_queries = (
        analysis.get("priority_job_roles")
        or analysis.get("job_search_queries")
        or [
            "Python Developer",
            "Backend Developer",
            "Software Engineer",
            "AI Engineer",
            "Full Stack Developer"
        ]
    )

    print("=" * 60)
    print("AI ANALYSIS")
    print(json.dumps(analysis, indent=2))
    print("=" * 60)
    print("JOB SEARCH QUERIES")
    print(job_queries)
    print("=" * 60)

    jobs = search_jobs(job_queries)

    print("=" * 60)
    print("LIVE JOBS FOUND")
    print(len(jobs))
    print("=" * 60)

    for job in jobs[:5]:
        print(job["title"])

    print("=" * 60)
    print("Resume Skills:", resume_skills)
    print("Jobs Found:", len(jobs))

    # ===========================
    # Save Jobs
    # ===========================
    # NOTE: db.add() and saved_jobs.append() MUST be inside the loop body,
    # otherwise only the last job in `jobs` ever gets saved/matched.

    saved_jobs = []

    for job in jobs:
        job_record = Job(
            title=job.get("title"),
            company=job.get("company"),
            location=job.get("location"),
            salary=f"{job.get('salary_min')} - {job.get('salary_max')}",
            description=job.get("description"),
            apply_link=job.get("apply_link")
        )

        db.add(job_record)
        saved_jobs.append(job_record)

    # Save all jobs together
    db.commit()

    # Refresh IDs
    for job in saved_jobs:
        db.refresh(job)

    matches = match_jobs(
        analysis,
        jobs,
        len(text)
    )

    print("=" * 50)
    print("TOTAL JOBS:", len(jobs))
    print("TOTAL MATCHES:", len(matches))
    print(matches)
    print("=" * 50)
    print("Saving", len(matches), "matches...")

    for match, job in zip(matches, saved_jobs):
        match_record = JobMatch(
            resume_analysis_id=analysis_record.id,
            job_id=job.id,
            match_score=match.get("match_score"),
            ats_score=match.get("ats_score"),
            matched_skills=",".join(match.get("matched_skills", [])),
            missing_skills=",".join(match.get("missing_skills", [])),
            recommendations="|".join(match.get("recommendations", []))
        )

        db.add(match_record)

    db.commit()

    # ===========================
    # Update Dashboard
    # ===========================

    dashboard = db.query(Dashboard).filter(
        Dashboard.user_id == current_user.id
    ).first()

    ats_score = analysis.get("ats_score", 0)
    skills = analysis.get("skills", [])
    profile_strength = analysis.get("profile_strength", ats_score)
    job_matches = len(matches)

    if dashboard:
        dashboard.resume_name = file.filename
        dashboard.ats_score = ats_score
        dashboard.skills_count = len(skills)
        dashboard.profile_strength = profile_strength
        dashboard.resume_health = ats_score
        dashboard.job_matches = job_matches
    else:
        dashboard = Dashboard(
            user_id=current_user.id,
            resume_name=file.filename,
            ats_score=ats_score,
            skills_count=len(skills),
            profile_strength=profile_strength,
            resume_health=ats_score,
            job_matches=job_matches
        )
        db.add(dashboard)

    db.commit()

    # ===========================
    # Response
    # ===========================

    return {
        "success": True,
        "message": "Resume analyzed successfully.",
         "analysis_id": analysis_record.id,
        "analysis": analysis,
        "jobs_found": len(jobs),
        "matched_jobs": len(matches),
        "jobs": matches
    }


# =====================================
# ATS Job Matching
# =====================================
@app.post("/job-matches")
async def job_matches(
    file: UploadFile = File(...)
):

    try:
        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text_from_pdf(file_path)
        analysis = analyze_resume(text)

        jobs = search_jobs(analysis["job_search_queries"])
        jobs = jobs[:5]

        matches = match_jobs(
            analysis=analysis,
            jobs=jobs,
            resume_length=len(text)
        )

        return {
            "resume_skills": analysis["skills"],
            "resume_length": len(text),
            "matches": matches
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# =====================================
# AI Resume Review
# =====================================
@app.post("/ai-review")
async def ai_review(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)
    review = review_resume(text)

    return {
        "review": review
    }


# =====================================
# Keyword Optimizer
# =====================================
@app.post("/optimize-keywords")
async def optimize_resume_keywords(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)
    keywords = optimize_keywords(text)

    return {
        "keywords": keywords
    }


# =====================================
# JD Match
# =====================================
@app.post("/jd-match")
async def jd_match(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text_from_pdf(file_path)
    result = match_resume_with_jd(resume_text, job_description)

    return result


# =====================================
# Live Jobs (Adzuna API)
# =====================================
@app.post("/live-jobs")
async def live_jobs(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)
    analysis = analyze_resume(text)
    jobs = search_jobs(analysis["job_search_queries"])

    return {
        "skills": analysis["skills"],
        "jobs": jobs
    }


@app.get("/my-resumes")
def my_resumes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).all()

    return resumes


@app.get("/analysis-history")
def analysis_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    history = (
        db.query(ResumeAnalysis)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .all()
    )

    return history