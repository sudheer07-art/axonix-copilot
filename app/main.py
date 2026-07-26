
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    Depends
)
import traceback
from app.services.resume_pipeline import process_resume
from fastapi.middleware.cors import CORSMiddleware
from app.services.file_service import extract_resume
from sqlalchemy.orm import Session

import os
import shutil
import json

# ==========================================
# DATABASE
# ==========================================

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

# ==========================================
# MODELS
# ==========================================

from app.models.resume_analysis import (
    ResumeAnalysis
)

from app.models.dashboard_model import (
    Dashboard
)

# ==========================================
# AUTHENTICATION
# ==========================================

from app.auth.auth import (
    router as auth_router
)

from app.auth.dependencies import (
    get_current_user
)

# ==========================================
# ROUTERS
# ==========================================

from app.routers.dashboard_routers import (
    router as dashboard_router
)

# ==========================================
# SERVICES
# ==========================================

from app.services.resume_parser import (
    extract_text_from_pdf
)

from app.services.resume_analyzer import (
    analyze_resume
)

from app.services.skill_extractor import (
    extract_skills
)

from app.services.ats_scorer import (
    calculate_ats_score
)

from app.services.resume_rules import (
    generate_resume_suggestions
)

from app.services.job_keyword_ai import (
    generate_job_keywords
)

from app.services.job_search import (
    search_jobs
)

from app.services.job_matcher import (
    match_jobs
)

from app.services.keyword_optimizer import (
    optimize_keywords
)

from app.services.jd_matcher import (
    match_resume_with_jd
)

# ==========================================
# FASTAPI
# ==========================================

app = FastAPI(

    title="AXONIX AI Job Search Copilot",

    version="2.0.0"

)

# ==========================================
# DATABASE INITIALIZATION
# ==========================================

Base.metadata.create_all(
    bind=engine
)

# ==========================================
# ROUTERS
# ==========================================

app.include_router(
    auth_router
)

app.include_router(
    dashboard_router
)
# ==========================================
# CORS
# ==========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5500",

        "http://127.0.0.1:5500",

        "https://axonix-copilot.vercel.app",

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)

# ==========================================
# UPLOAD DIRECTORY
# ==========================================

UPLOAD_DIR = "uploads"

os.makedirs(

    UPLOAD_DIR,

    exist_ok=True

)

# ==========================================
# APPLICATION INFORMATION
# ==========================================

PROJECT_INFO = {

    "project": "AXONIX AI Job Search Copilot",

    "version": "2.0.0",

    "ai_usage": "AI used only for Job Search",

    "status": "Running"

}

# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {

        "success": True,

        "project": PROJECT_INFO["project"],

        "version": PROJECT_INFO["version"],

        "status": PROJECT_INFO["status"]

    }

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {

        "status": "healthy",

        "database": "connected",

        "service": "running"

    }
# ==========================================
# UPLOAD RESUME
# ==========================================

@app.post("/upload-resume")
async def upload_resume(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    try:

        # ----------------------------------
        # Validate File
        # ----------------------------------

        # ----------------------------------
# Validate → Save → Extract
# ----------------------------------

        file_path, resume_text = extract_resume(file)

        # ----------------------------------
        # Save Resume
        # ----------------------------------

        resume = Resume(

            filename=file.filename,

            filepath=file_path,

            resume_text=resume_text,

            user_id=current_user.id

        )

        db.add(resume)

        db.commit()

        db.refresh(resume)

        # ----------------------------------
        # Response
        # ----------------------------------

        return {

            "success": True,

            "message": "Resume uploaded successfully.",

            "resume_id": resume.id,

            "filename": resume.filename,

            "characters": len(resume_text)

        }

    except Exception as e:

        db.rollback()

        return {

            "success": False,

            "message": str(e)

        }
# ==========================================
# ANALYZE RESUME
# ==========================================

@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return process_resume(
            file=file,
            current_user=current_user,
            db=db,
        )

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return {
            "success": False,
            "message": str(e),
        }
# ==========================================
# JOB MATCHES
# ==========================================

@app.get("/job-matches")
def get_job_matches(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    matches = (

        db.query(JobMatch)

        .filter(

            JobMatch.user_id == current_user.id

        )

        .order_by(

            JobMatch.match_score.desc()

        )

        .all()

    )

    results = []

    for match in matches:

        results.append(

            {

                "job_title": match.job_title,

                "company": match.company,

                "match_score": match.match_score,

                "matched_skills": json.loads(

                    match.matched_skills

                )

                if match.matched_skills

                else [],

                "missing_skills": json.loads(

                    match.missing_skills

                )

                if match.missing_skills

                else []

            }

        )

    return {

        "success": True,

        "count": len(results),

        "matches": results

    }


# ==========================================
# LIVE JOBS
# ==========================================

@app.get("/live-jobs")
def live_jobs(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    jobs = (

        db.query(Job)

        .all()

    )

    return {

        "success": True,

        "count": len(jobs),

        "jobs": jobs

    }
# ==========================================
# OPTIMIZE RESUME KEYWORDS
# ==========================================

@app.post("/optimize-keywords")
async def optimize_resume_keywords(

    file: UploadFile = File(...)

):

    try:

        if not file.filename.lower().endswith(".pdf"):

            return {

                "success": False,

                "message": "Please upload a PDF resume."

            }

        file_path = os.path.join(

            UPLOAD_DIR,

            file.filename

        )

        file_path, resume_text = extract_resume(file)
        

        optimized = optimize_keywords(

            resume_text

        )

        return {

            "success": True,

            "optimized_keywords": optimized

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

        }


# ==========================================
# JD MATCH
# ==========================================

@app.post("/jd-match")
async def jd_match(

    file: UploadFile = File(...),

    job_description: str = Form(...)

):

    try:

        file_path = os.path.join(

            UPLOAD_DIR,

            file.filename

        )

        file_path, resume_text = extract_resume(file)
        result = match_resume_with_jd(

            resume_text,

            job_description

        )

        return {

            "success": True,

            "result": result

        }

    except Exception as e:
        

        traceback.print_exc()

        return {
        "success": False,
        "message": str(e),
    }


# ==========================================
# MY RESUMES
# ==========================================

@app.get("/my-resumes")
def my_resumes(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    resumes = (

        db.query(Resume)

        .filter(

            Resume.user_id == current_user.id

        )

        .order_by(

            Resume.id.desc()

        )

        .all()

    )

    return {

        "success": True,

        "count": len(resumes),

        "resumes": resumes

    }


# ==========================================
# ANALYSIS HISTORY
# ==========================================

@app.get("/analysis-history")
def analysis_history(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    history = (
    db.query(ResumeAnalysis)
    .join(Resume)
    .filter(
        Resume.user_id == current_user.id
    )
    .order_by(ResumeAnalysis.id.desc())
    .all()
)

    return {

        "success": True,

        "count": len(history),

        "history": history

    }
    