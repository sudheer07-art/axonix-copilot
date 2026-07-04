import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def match_resume_with_jd(resume_text, job_description):

    prompt = f"""
You are an ATS and HR recruiter.

Compare the following resume with the job description.

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY valid JSON.

{{
    "match_score": 0,
    "matched_skills": [],
    "missing_skills": [],
    "strengths": [],
    "suggestions": [],
    "summary": ""
}}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown if Gemini returns ```json
    text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)