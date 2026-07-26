import os
import json
import google.generativeai as genai


def generate_job_keywords(resume_data: dict) -> dict:
    """
    Uses Gemini AI to generate realistic job titles and ATS-friendly
    search keywords based on the candidate's resume.

    Returns:
    {
        "job_titles": [...],
        "keywords": [...]
    }
    """

    try:
        # -------------------------------
        # Configure Gemini
        # -------------------------------
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found.")

        genai.configure(api_key=api_key)

        model = genai.GenerativeModel("gemini-2.5-flash")

        # -------------------------------
        # Resume Details
        # -------------------------------
        skills = ", ".join(resume_data.get("skills", []))

        experience = resume_data.get(
            "experience_level",
            "Fresher"
        )

        education = resume_data.get(
            "education",
            ""
        )

        # -------------------------------
        # Prompt
        # -------------------------------
        prompt = f"""
You are an expert Technical Recruiter.

Analyze the candidate profile and recommend realistic job titles.

Candidate Information

Skills:
{skills}

Experience:
{experience}

Education:
{education}

Return ONLY valid JSON.

Format:

{{
    "job_titles": [
        "...",
        "...",
        "..."
    ],
    "keywords": [
        "...",
        "...",
        "..."
    ]
}}

Rules:

- Recommend only realistic jobs.
- If experience is Fresher, recommend entry-level roles.
- Keywords should improve job search on LinkedIn, Naukri and Adzuna.
- Do not include explanations.
- Do not use markdown.
- Return JSON only.
"""

        # -------------------------------
        # Gemini Response
        # -------------------------------
        response = model.generate_content(prompt)

        text = response.text.strip()

        # Remove markdown if present
        text = (
            text.replace("```json", "")
                .replace("```", "")
                .strip()
        )

        data = json.loads(text)

        return {
            "job_titles": data.get("job_titles", []),
            "keywords": data.get("keywords", [])
        }

    except Exception as e:
        print(f"[Gemini Error] {e}")

        return {
            "job_titles": [],
            "keywords": []
        }