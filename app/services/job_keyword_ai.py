import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_job_keywords(resume_data):

    skills = ", ".join(resume_data.get("skills", []))
    experience = resume_data.get("experience_level", "Fresher")
    education = resume_data.get("education", "")

    prompt = f"""
You are an expert technical recruiter.

Candidate Profile:

Skills:
{skills}

Experience:
{experience}

Education:
{education}

Generate ONLY valid JSON.

Return this format:

{{
    "job_titles":[
        "...",
        "...",
        "..."
    ],
    "keywords":[
        "...",
        "...",
        "..."
    ]
}}

Rules:

- Recommend entry-level jobs if experience is Fresher.
- Recommend realistic job titles.
- Include ATS-friendly search keywords.
- No explanation.
- JSON only.
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown if Gemini wraps the JSON
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)
    except Exception:
        return {
            "job_titles": [],
            "keywords": []
        }