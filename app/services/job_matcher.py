import re


# ==========================================
# Utility
# ==========================================

COMMON_SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "html",
    "css",
    "react",
    "angular",
    "vue",
    "node",
    "nodejs",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "spring boot",
    "git",
    "github",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "linux",
    "redis",
    "rest",
    "rest api",
    "api",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "power bi",
    "excel",
    "machine learning",
    "data analysis",
    "oop",
}


def normalize(text):
    return text.lower().strip()


def extract_job_skills(text):
    """
    Extract known skills from a job description.
    """

    if not text:
        return []

    text = normalize(text)

    found = []

    for skill in COMMON_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):
            found.append(skill)

    return sorted(set(found))


def safe_score(value):
    return max(0, min(100, int(value)))


# ==========================================
# Match One Job
# ==========================================

def score_job(analysis, job):

    resume_skills = {
        normalize(skill)
        for skill in analysis.get("skills", [])
    }

    job_skills = set(
        extract_job_skills(
            job.get("description", "")
        )
    )

    matched = sorted(
        resume_skills & job_skills
    )

    missing = sorted(
        job_skills - resume_skills
    )

    if len(job_skills) == 0:
        match_score = 50
    else:
        match_score = int(
            (len(matched) / len(job_skills)) * 100
        )

    # ATS score is slightly more generous
    ats_score = min(
        100,
        match_score + 10
    )

    recommendations = []

    if missing:
        recommendations.append(
            "Learn: " + ", ".join(missing[:5])
        )

    if ats_score < 80:
        recommendations.append(
            "Add missing keywords to improve ATS score."
        )

    if not recommendations:
        recommendations.append(
            "Excellent match. Apply immediately."
        )

    salary = (
        job.get("salary")
        or (
            f"{job.get('salary_min','N/A')} - "
            f"{job.get('salary_max','N/A')}"
        )
    )

    return {
        "title": job.get("title", ""),
        "company": job.get("company", ""),
        "location": job.get("location", ""),
        "salary": salary,
        "match_score": safe_score(match_score),
        "ats_score": safe_score(ats_score),
        "matched_skills": matched,
        "missing_skills": missing,
        "why_match": (
            f"Matched {len(matched)} "
            f"of {len(job_skills)} required skills."
        ),
        "recommendations": recommendations,
        "apply_link": (
            job.get("url")
            or job.get("redirect_url")
            or job.get("apply_link")
            or ""
        ),
    }


# ==========================================
# Match All Jobs
# ==========================================

def match_jobs(
    analysis,
    jobs,
    resume_length=None,
):
    """
    Match resume against all jobs.

    Returns jobs sorted by match score.
    """

    if not jobs:
        return []

    matches = []

    for job in jobs:
        matches.append(
            score_job(
                analysis,
                job,
            )
        )

    matches.sort(
        key=lambda x: (
            x["match_score"],
            x["ats_score"],
        ),
        reverse=True,
    )

    return matches