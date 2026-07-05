import os
import json
import time
import re

from dotenv import load_dotenv
import google.generativeai as genai

# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

API_KEY = os.getenv("GEMINI_JOB_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_JOB_API_KEY not found in .env"
    )

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

# ==========================================
# Utility Functions
# ==========================================

def safe_int(value):

    try:

        if isinstance(value, str):

            value = (
                value
                .replace("%", "")
                .replace("/100", "")
                .strip()
            )

        return int(float(value))

    except Exception:

        return 0


def clean_response(text):

    if not text:
        return ""

    text = text.replace("```json", "")
    text = text.replace("```", "")

    return text.strip()


def extract_json(text):

    try:

        return json.loads(text)

    except Exception:

        match = re.search(
            r"\{.*\}",
            text,
            re.DOTALL
        )

        if match:

            try:

                return json.loads(
                    match.group()
                )

            except Exception:

                return None

    return None


# ==========================================
# Default Match Result
# ==========================================

def default_match(job):

    return {

        "title": job.get(
            "title",
            ""
        ),

        "company": job.get(
            "company",
            ""
        ),

        "location": job.get(
            "location",
            ""
        ),

        "salary": (
            f"{job.get('salary_min', 'N/A')} - "
            f"{job.get('salary_max', 'N/A')}"
        ),

        "match_score": 0,

        "ats_score": 0,

        "matched_skills": [],

        "missing_skills": [],

        "why_match": "Unable to analyze this job.",

        "recommendations": [],

        "apply_link": job.get(
            "apply_link",
            ""
        )

    }
# ==========================================
# Build Gemini Prompt
# ==========================================

def build_prompt(
    analysis,
    job
):

    return f"""
You are an expert Technical Recruiter, ATS Expert and Career Coach.

Your task is to compare ONE resume with ONE live job.

Return ONLY valid JSON.

Do NOT return markdown.

--------------------------------------------------

RESUME

Skills:
{analysis.get("skills", [])}

Projects:
{analysis.get("projects", [])}

Experience:
{analysis.get("experience_level", "")}

Education:
{analysis.get("education", "")}

Career Domains:
{analysis.get("career_domains", [])}

Summary:
{analysis.get("summary", "")}

--------------------------------------------------

JOB

Title:
{job.get("title", "")}

Company:
{job.get("company", "")}

Location:
{job.get("location", "")}

Description:
{job.get("description", "")}

--------------------------------------------------

Evaluate the candidate.

Consider:

1. Skills

2. Projects

3. Experience

4. Education

5. ATS Compatibility

6. Job Relevance

--------------------------------------------------

Return ONLY this JSON:

{{
    "match_score":92,
    "ats_score":87,
    "matched_skills":[
        "Python",
        "SQL"
    ],
    "missing_skills":[
        "Docker",
        "AWS"
    ],
    "why_match":"Candidate has strong backend skills and relevant projects.",
    "recommendations":[
        "Learn Docker",
        "Build one AWS project",
        "Improve ATS keywords"
    ]
}}

No explanation.

No markdown.

Only JSON.
"""


# ==========================================
# Gemini Job Analysis
# ==========================================

def analyze_job(
    analysis,
    job,
    retries=3
):

    prompt = build_prompt(
        analysis,
        job
    )

    for attempt in range(retries):

        try:

            print(
                f"AI Matching -> {job.get('title')}"
            )

            response = model.generate_content(
                prompt
            )

            text = clean_response(
                getattr(
                    response,
                    "text",
                    ""
                )
            )

            result = extract_json(
                text
            )

            if result:

                return result

            print(
                "Invalid JSON received."
            )

        except Exception as e:

            print("=" * 60)
            print("Gemini Error")
            print(job.get("title"))
            print(e)
            print("=" * 60)

        time.sleep(2)

    return None
# ==========================================
# AI Job Matching
# ==========================================

def match_jobs(
    analysis,
    jobs,
    resume_length
):

    print("=" * 60)
    print("STARTING AI JOB MATCHING")
    print("Jobs Found:", len(jobs))
    print("=" * 60)

    matches = []

    if not jobs:
        print("No jobs received from Adzuna.")
        return matches

    for index, job in enumerate(jobs, start=1):

        print(
            f"\n[{index}/{len(jobs)}] {job.get('title')}"
        )

        ai = analyze_job(
            analysis,
            job
        )

        if ai is None:

            print("AI failed. Using default result.")

            matches.append(
                default_match(job)
            )

            continue

        match = {

            "title": job.get(
                "title",
                ""
            ),

            "company": job.get(
                "company",
                ""
            ),

            "location": job.get(
                "location",
                "Not Specified"
            ),

            "salary": (
                f"{job.get('salary_min', 'N/A')} - "
                f"{job.get('salary_max', 'N/A')}"
            ),

            "match_score": safe_int(
                ai.get(
                    "match_score",
                    0
                )
            ),

            "ats_score": safe_int(
                ai.get(
                    "ats_score",
                    0
                )
            ),

            "matched_skills": ai.get(
                "matched_skills",
                []
            ),

            "missing_skills": ai.get(
                "missing_skills",
                []
            ),

            "why_match": ai.get(
                "why_match",
                ""
            ),

            "recommendations": ai.get(
                "recommendations",
                []
            ),

            "apply_link": (
                job.get("redirect_url")
                or job.get("apply_link")
                or job.get("url")
                or ""
            )

        }

        matches.append(match)

        print(
            f"✓ Match Score: {match['match_score']}%"
        )

        # Helps avoid Gemini rate limits
        time.sleep(1)

    matches.sort(

        key=lambda x: (

            x["match_score"],

            x["ats_score"]

        ),

        reverse=True

    )

    print("=" * 60)
    print("AI MATCHING COMPLETED")
    print("Total Matches:", len(matches))
    print("=" * 60)

    return matches