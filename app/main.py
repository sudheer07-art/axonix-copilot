
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

        if not file.filename.lower().endswith(".pdf"):

            return {

                "success": False,

                "message": "Only PDF resumes are supported."

            }

        # ----------------------------------
        # Save PDF
        # ----------------------------------

        file_path = os.path.join(

            UPLOAD_DIR,

            file.filename

        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(

                file.file,

                buffer

            )

        # ----------------------------------
        # Extract Resume Text
        # ----------------------------------

        resume_text = extract_text_from_pdf(

            file_path

        )

        if not resume_text.strip():

            return {

                "success": False,

                "message": "Unable to extract text from the uploaded PDF."

            }

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

    current_user: User = Depends(get_current_user)

):

    try:

        # ----------------------------------
        # Validate PDF
        # ----------------------------------

        if not file.filename.lower().endswith(".pdf"):

            return {

                "success": False,

                "message": "Only PDF resumes are supported."

            }

        # ----------------------------------
        # Save Resume
        # ----------------------------------

        file_path = os.path.join(

            UPLOAD_DIR,

            file.filename

        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(

                file.file,

                buffer

            )

        # ----------------------------------
        # Extract Resume Text
        # ----------------------------------

        resume_text = extract_text_from_pdf(

            file_path

        )

        if not resume_text.strip():

            return {

                "success": False,

                "message": "Could not read resume."

            }

        # ----------------------------------
        # Resume Analysis
        # ----------------------------------

        analysis = analyze_resume(

            resume_text

        )

        # ----------------------------------
        # ATS Score
        # ----------------------------------

        ats = calculate_ats_score(

            analysis

        )

        # ----------------------------------
        # Resume Suggestions
        # ----------------------------------

        suggestions = generate_resume_suggestions(

            analysis

        )

        # ----------------------------------
        # AI Job Keywords
        # ----------------------------------

        ai_result = generate_job_keywords(

            analysis

        )

        job_titles = ai_result.get(

            "job_titles",

            []

        )

        search_keywords = ai_result.get(

            "keywords",

            []

        )

        # ----------------------------------
        # Live Jobs
        # ----------------------------------

        jobs = search_jobs(

            search_keywords

        )

        # ----------------------------------
        # Match Jobs
        # ----------------------------------

        matches = match_jobs(

            analysis=analysis,

            jobs=jobs,

            resume_length=len(

                resume_text

            )

        )
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
        # Save Analysis
        # ----------------------------------

        analysis_record = ResumeAnalysis(

            user_id=current_user.id,

            resume_id=resume.id,

            analysis_json=json.dumps(

                {

                    "analysis": analysis,

                    "ats": ats,

                    "suggestions": suggestions

                }

            ),

            ats_score=ats["ats_score"]

        )

        db.add(

            analysis_record

        )

        db.commit()

        db.refresh(

            analysis_record

        )

        # ----------------------------------
        # Save Jobs
        # ----------------------------------

        saved_jobs = []

        for job in jobs:

            db_job = Job(

                title=job.get("title"),

                company=job.get("company"),

                location=job.get("location"),

                description=job.get("description"),

                url=job.get("url"),

                salary=job.get("salary")

            )

            db.add(

                db_job

            )

            db.commit()

            db.refresh(

                db_job

            )

            saved_jobs.append(

                db_job

            )

        # ----------------------------------
        # Save Job Matches
        # ----------------------------------

        for match in matches:

            job_match = JobMatch(

                user_id=current_user.id,

                resume_id=resume.id,

                job_title=match.get("title"),

                company=match.get("company"),

                match_score=match.get("match_score"),

                matched_skills=json.dumps(

                    match.get(

                        "matched_skills",

                        []

                    )

                ),

                missing_skills=json.dumps(

                    match.get(

                        "missing_skills",

                        []

                    )

                )

            )

            db.add(

                job_match

            )

        db.commit()
                # ----------------------------------
        # Dashboard Statistics
        # ----------------------------------

        dashboard = Dashboard(

            user_id=current_user.id,

            resumes_uploaded=1,

            jobs_found=len(jobs),

            jobs_matched=len(matches),

            ats_score=ats["ats_score"]

        )

        db.add(dashboard)

        db.commit()

        db.refresh(dashboard)

        # ----------------------------------
        # Success Response
        # ----------------------------------

        return {

            "success": True,

            "resume_id": resume.id,

            "analysis": analysis,

            "ats": ats,

            "suggestions": suggestions,

            "job_titles": job_titles,

            "search_keywords": search_keywords,

            "recommended_jobs": jobs,

            "job_matches": matches,

            "dashboard": {

                "resumes_uploaded": dashboard.resumes_uploaded,

                "jobs_found": dashboard.jobs_found,

                "jobs_matched": dashboard.jobs_matched,

                "ats_score": dashboard.ats_score

            }

        }

    except Exception as e:

        db.rollback()

        return {

            "success": False,

            "message": str(e)

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

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(

                file.file,

                buffer

            )

        resume_text = extract_text_from_pdf(

            file_path

        )

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

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(

                file.file,

                buffer

            )

        resume_text = extract_text_from_pdf(

            file_path

        )

        result = match_resume_with_jd(

            resume_text,

            job_description

        )

        return {

            "success": True,

            "result": result

        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)

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

        .filter(

            ResumeAnalysis.user_id == current_user.id

        )

        .order_by(

            ResumeAnalysis.id.desc()

        )

        .all()

    )

    return {

        "success": True,

        "count": len(history),

        "history": history

    }
    