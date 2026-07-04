import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_resume(text):

    prompt = f"""
You are an expert ATS Resume Analyzer and AI Career Advisor.

Analyze the resume thoroughly.

Return ONLY valid JSON.

Required JSON format:

{{
    "ats_score": 0,

    "profile_strength": 0,

    "resume_health": 0,

    "experience_level": "",

    "education": "",

    "career_domains": [],

    "skills": [],

    "projects": [],

    "job_search_queries": [],
    "priority_job_roles": [],

    "strengths": [],

    "weaknesses": [],

    "suggestions": [],

    "summary": ""
}}

Rules:

1. ATS Score should be between 0 and 100.
2. Profile Strength should be between 0 and 100.
3. Resume Health should be between 0 and 100.
4. Extract ALL technical skills.
5. Extract ALL project names.
6. Detect experience level (Fresher, Junior, Mid, Senior).
7. Extract highest education.
8. Detect career domains.
9. Generate 5–8 realistic job search queries.
10. List resume strengths.
11. List resume weaknesses.
12. Give exactly 5 personalized suggestions.
13. Summary should be 3–4 professional sentences.
14. Return ONLY JSON.
15. Do NOT use markdown.
16. Do NOT use ```json.
17. Return only the 5 BEST job roles.
18. Rank them from most suitable to least suitable.
19. Avoid duplicate or similar job roles.
20. Use common job titles found on LinkedIn, Indeed and Adzuna.

Example job_search_queries:

[
"Python Developer",
"Backend Developer",
"Software Engineer",
"FastAPI Developer",
"Full Stack Developer"
]

Resume:

{text}
"""

    try:

        response = model.generate_content(prompt)

        answer = response.text.strip()

        if answer.startswith("```json"):
            answer = answer.replace("```json", "").replace("```", "").strip()

        elif answer.startswith("```"):
            answer = answer.replace("```", "").strip()

        data = json.loads(answer)
        print(json.dumps(data, indent=4))

        return {

    "ats_score": data.get("ats_score", 0),

    "profile_strength": data.get("profile_strength", 0),

    "resume_health": data.get("resume_health", 0),

    "experience_level": data.get("experience_level", "Fresher"),

    "education": data.get("education", ""),

    "career_domains": data.get("career_domains", []),

    "skills": data.get("skills", []),

    "projects": data.get("projects", []),

    "job_search_queries": data.get("job_search_queries", []),

    "strengths": data.get("strengths", []),

    "weaknesses": data.get("weaknesses", []),

    "suggestions": data.get("suggestions", []),

    "summary": data.get("summary", "")
}

    except Exception as e:

        print("Gemini Error:", e)

        return {

    "ats_score": 75,

    "profile_strength": 70,

    "resume_health": 72,

    "experience_level": "Fresher",

    "education": "Bachelor of Technology",

    "career_domains": [

        "Backend Development"

    ],

    "skills": [

        "Python",

        "FastAPI",

        "SQL"

    ],

    "projects": [],

    "job_search_queries": [

        "Python Developer",

        "Backend Developer",

        "Software Engineer",

        "FastAPI Developer"

    ],

    "strengths": [

        "Good Python Knowledge"

    ],

    "weaknesses": [

        "Cloud Technologies Missing"

    ],

    "suggestions": [

        "Add measurable achievements.",

        "Improve ATS keywords.",

        "Add GitHub profile.",

        "Include deployed projects.",

        "Mention cloud technologies."

    ],

    "summary": "AI analysis is temporarily unavailable because the Gemini API could not process the request."

}