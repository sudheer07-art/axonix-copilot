import os
import json
import shutil

from sqlalchemy.orm import Session

from app.database.models import (
    Resume,
    Job,
    JobMatch,
)
from app.services.file_service import extract_resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.dashboard_model import Dashboard

from app.services.resume_parser import extract_text_from_pdf
from app.services.resume_analyzer import analyze_resume
from app.services.ats_scorer import calculate_ats_score
from app.services.resume_rules import generate_resume_suggestions
from app.services.job_keyword_ai import generate_job_keywords
from app.services.job_search import search_jobs
from app.services.job_matcher import match_jobs


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def process_resume(file, current_user, db: Session):
    """
    Complete Resume Processing Pipeline

    Upload
        ↓
    Parse PDF
        ↓
    Resume Analysis
        ↓
    ATS Score
        ↓
    Suggestions
        ↓
    Gemini Keywords
        ↓
    Adzuna Jobs
        ↓
    Python Job Matching
        ↓
    Save Database
        ↓
    Return Result
    """

    # ------------------------------------
    # Validate
    # ------------------------------------

    if not file.filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF resumes are supported.")

    # ------------------------------------
    # Save File
    # ------------------------------------

    file_path, resume_text = extract_resume(file)

    # ------------------------------------
    # Resume Analysis
    # ------------------------------------

    analysis = analyze_resume(resume_text)

    ats = calculate_ats_score(analysis)

    rule_suggestions = generate_resume_suggestions(
    analysis
)

    suggestions = rule_suggestions + ats.get("suggestions", [])

    # ------------------------------------
    # AI Keywords
    # ------------------------------------

    ai = generate_job_keywords(analysis)

    job_titles = ai.get(
        "job_titles",
        [],
    )

    keywords = ai.get(
        "keywords",
        [],
    )

    # ------------------------------------
    # Search Jobs
    # ------------------------------------

    jobs = search_jobs(keywords)

    # ------------------------------------
    # Match Jobs
    # ------------------------------------

    matches = match_jobs(
        analysis,
        jobs,
        len(resume_text),
    )

    # ------------------------------------
    # Save Resume
    # ------------------------------------

    resume = Resume(
        filename=file.filename,
        filepath=file_path,
        resume_text=resume_text,
        user_id=current_user.id,
    )

    db.add(resume)
    db.flush()

    # ------------------------------------
    # Save Analysis
    # ------------------------------------

    analysis_record = ResumeAnalysis(
    resume_id=resume.id,

    ats_score=ats.get("ats_score", 0),

    profile_strength=ats.get("profile_strength", 0),

    resume_health=ats.get("resume_health", 0),

    skills=json.dumps(
        analysis.get("skills", [])
    ),

    suggestions=json.dumps(
        suggestions
    ),

    summary=analysis.get(
        "summary",
        ""
    ),

    analysis_json=json.dumps(
        {
            "analysis": analysis,
            "ats": ats,
            "suggestions": suggestions,
        }
    ),
)

    db.add(analysis_record)
    db.flush()

    # ------------------------------------
    # Save Jobs
    # ------------------------------------

    job_objects = []

    for job in jobs:

        job_objects.append(

            Job(
    title=job.get("title"),
    company=job.get("company"),
    location=job.get("location"),
    description=job.get("description"),
    salary=job.get("salary"),
    skills=json.dumps(
        job.get("skills", [])
    ),
    apply_link=job.get("url", ""),
)

        )

    db.add_all(job_objects)
    db.flush()

    # ------------------------------------
    # Save Job Matches
    # ------------------------------------

    match_objects = []

    for index, match in enumerate(matches):

        if index >= len(job_objects):
            break

        match_objects.append(

        JobMatch(

            resume_analysis_id=analysis_record.id,

            job_id=job_objects[index].id,

            match_score=match.get("match_score", 0),

            ats_score=ats.get("ats_score", 0),

            matched_skills=json.dumps(
                match.get("matched_skills", [])
            ),

            missing_skills=json.dumps(
                match.get("missing_skills", [])
            ),

            recommendations=json.dumps(
                match.get("recommendations", [])
            )

        )

    )

        db.add_all(match_objects)

    # ------------------------------------
    # Dashboard
    # ------------------------------------

    dashboard = Dashboard(
        user_id=current_user.id,
        resumes_uploaded=1,
        jobs_found=len(jobs),
        jobs_matched=len(matches),
        ats_score=ats["ats_score"],
    )

    db.add(dashboard)

    # ------------------------------------
    # Single Commit
    # ------------------------------------

    db.commit()

    db.refresh(resume)
    db.refresh(analysis_record)
    db.refresh(dashboard)

    # ------------------------------------
    # Response
    # ------------------------------------

    return {
        "success": True,
        "resume_id": resume.id,
        "analysis": analysis,
        "ats": ats,
        "suggestions": suggestions,
        "job_titles": job_titles,
        "search_keywords": keywords,
        "recommended_jobs": jobs,
        "job_matches": matches,
        "dashboard": {
            "resumes_uploaded": dashboard.resumes_uploaded,
            "jobs_found": dashboard.jobs_found,
            "jobs_matched": dashboard.jobs_matched,
            "ats_score": dashboard.ats_score,
        },
    }