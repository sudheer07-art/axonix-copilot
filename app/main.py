from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    Depends,
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import os
import json
import traceback

from app.models.contact_model import Contact
# ==========================================
# DATABASE
# ==========================================

from app.database.database import (
    Base,
    engine,
    get_db,
)

from app.database.models import (
    User,
    Resume,
    Job,
    JobMatch,
)

from app.models.resume_analysis import ResumeAnalysis
from app.models.dashboard_model import Dashboard

# ==========================================
# AUTH
# ==========================================

from app.auth.auth import router as auth_router
from app.api.contact_router import router as contact_router
from app.auth.dependencies import get_current_user

# ==========================================
# ROUTERS
# ==========================================

from app.routers.dashboard_routers import (
    router as dashboard_router,
)

# ==========================================
# SERVICES
# ==========================================

from app.services.resume_pipeline import process_resume
from app.services.file_service import extract_resume
from app.services.keyword_optimizer import optimize_keywords
from app.services.jd_matcher import match_resume_with_jd

# ==========================================
# FASTAPI
# ==========================================

app = FastAPI(

    title="AXONIX AI Job Search Copilot",

    version="2.0.0",

    docs_url="/docs",

    redoc_url="/redoc",

)

# ==========================================
# DATABASE
# ==========================================

Base.metadata.create_all(bind=engine)

# ==========================================
# ROUTERS
# ==========================================

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(contact_router)

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

    allow_headers=["*"],

)

# ==========================================
# CONSTANTS
# ==========================================

UPLOAD_DIR = "uploads"

os.makedirs(

    UPLOAD_DIR,

    exist_ok=True,

)

PROJECT_INFO = {

    "project": "AXONIX AI Job Search Copilot",

    "version": "2.0.0",

    "status": "Running",

    "ai_usage": "AI used only for Resume Analysis and Job Search",

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

        "status": PROJECT_INFO["status"],

    }

# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():

    return {

        "success": True,

        "status": "healthy",

        "database": "connected",

    }

# ==========================================
# UPLOAD RESUME
# ==========================================

@app.post("/upload-resume")
async def upload_resume(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user),

):

    try:

        file_path, resume_text = extract_resume(file)

        resume = Resume(

            filename=file.filename,

            filepath=file_path,

            resume_text=resume_text,

            user_id=current_user.id,

        )

        db.add(resume)

        db.commit()

        db.refresh(resume)

        return {

            "success": True,

            "message": "Resume uploaded successfully.",

            "resume_id": resume.id,

            "filename": resume.filename,

            "characters": len(resume_text),

        }

    except Exception as e:

        db.rollback()

        traceback.print_exc()

        return {

            "success": False,

            "message": str(e),

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

        result = process_resume(

            file=file,

            db=db,

            current_user=current_user,

        )

        return result

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

    current_user: User = Depends(get_current_user),

):

    try:

        matches = (

            db.query(JobMatch)

            .join(
                ResumeAnalysis,
                JobMatch.resume_analysis_id == ResumeAnalysis.id
            )

            .join(
                Resume,
                ResumeAnalysis.resume_id == Resume.id
            )

            .filter(
                Resume.user_id == current_user.id
            )

            .order_by(
                JobMatch.match_score.desc()
            )

            .all()

        )

        results = []

        for match in matches:

            job = db.query(Job).filter(

                Job.id == match.job_id

            ).first()

            results.append({

                "job_id": match.job_id,

                "title": job.title if job else "",

                "company": job.company if job else "",

                "location": job.location if job else "",

                "salary": job.salary if job else "",

                "apply_link": job.apply_link if job else "",

                "match_score": match.match_score,

                "ats_score": match.ats_score,

                "matched_skills": json.loads(

                    match.matched_skills

                ) if match.matched_skills else [],

                "missing_skills": json.loads(

                    match.missing_skills

                ) if match.missing_skills else [],

                "recommendations": json.loads(

                    match.recommendations

                ) if match.recommendations else [],

            })

        return {

            "success": True,

            "count": len(results),

            "matches": results,

        }

    except Exception as e:

        traceback.print_exc()

        return {

            "success": False,

            "message": str(e),

        }


# ==========================================
# LIVE JOBS
# ==========================================

@app.get("/live-jobs")
def get_live_jobs(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user),

):

    try:

        jobs = (

            db.query(Job)

            .order_by(

                Job.id.desc()

            )

            .all()

        )

        return {

            "success": True,

            "count": len(jobs),

            "jobs": [

                {

                    "id": job.id,

                    "title": job.title,

                    "company": job.company,

                    "location": job.location,

                    "description": job.description,

                    "salary": job.salary,

                    "skills": job.skills,

                    "apply_link": job.apply_link,

                }

                for job in jobs

            ]

        }

    except Exception as e:

        traceback.print_exc()

        return {

            "success": False,

            "message": str(e),

        }


# ==========================================
# OPTIMIZE RESUME KEYWORDS
# ==========================================

@app.post("/optimize-keywords")
async def optimize_resume_keywords(

    file: UploadFile = File(...),

):

    try:

        if not file.filename.lower().endswith(".pdf"):

            return {

                "success": False,

                "message": "Please upload a PDF resume."

            }

        file_path, resume_text = extract_resume(file)

        optimized_keywords = optimize_keywords(

            resume_text

        )

        return {

            "success": True,

            "optimized_keywords": optimized_keywords,

        }

    except Exception as e:

        traceback.print_exc()

        return {

            "success": False,

            "message": str(e),

        }


# ==========================================
# JD MATCH
# ==========================================

@app.post("/jd-match")
async def jd_match(

    file: UploadFile = File(...),

    job_description: str = Form(...),

):

    try:

        file_path, resume_text = extract_resume(file)

        result = match_resume_with_jd(

            resume_text,

            job_description,

        )

        return {

            "success": True,

            "result": result,

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

    current_user: User = Depends(get_current_user),

):

    try:

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

        data = []

        for resume in resumes:

            data.append({

                "id": resume.id,

                "filename": resume.filename,

                "filepath": resume.filepath,

                "uploaded_at": str(resume.created_at)

                if hasattr(resume, "created_at")

                else None,

            })

        return {

            "success": True,

            "count": len(data),

            "resumes": data,

        }

    except Exception as e:

        traceback.print_exc()

        return {

            "success": False,

            "message": str(e),

        }


# ==========================================
# ANALYSIS HISTORY
# ==========================================

@app.get("/analysis-history")
def analysis_history(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user),

):

    try:

        history = (

            db.query(ResumeAnalysis)

            .join(

                Resume,

                Resume.id == ResumeAnalysis.resume_id,

            )

            .filter(

                Resume.user_id == current_user.id

            )

            .order_by(

                ResumeAnalysis.id.desc()

            )

            .all()

        )

        result = []

        for item in history:

            result.append({

                "id": item.id,

                "resume_id": item.resume_id,

                "ats_score": item.ats_score,

                "profile_strength": item.profile_strength,

                "resume_health": item.resume_health,

                "skills": json.loads(item.skills)

                if item.skills

                else [],

                "suggestions": json.loads(item.suggestions)

                if item.suggestions

                else [],

                "summary": item.summary,

                "created_at": str(item.created_at),

            })

        return {

            "success": True,

            "count": len(result),

            "history": result,

        }

    except Exception as e:

        traceback.print_exc()

        return {

            "success": False,

            "message": str(e),

        }


# ==========================================
# APPLICATION INFO
# ==========================================

@app.get("/info")
def app_info():

    return {

        "success": True,

        "application": PROJECT_INFO,

    }


# ==========================================
# VERSION
# ==========================================

@app.get("/version")
def version():

    return {

        "success": True,

        "version": PROJECT_INFO["version"],

    }