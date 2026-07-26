# import os
# import json
# import google.generativeai as genai

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("gemini-2.5-flash")


# def match_resume_with_jd(resume_text, job_description):

#     prompt = f"""
# You are an ATS and HR recruiter.

# Compare the following resume with the job description.

# Resume:
# {resume_text}

# Job Description:
# {job_description}

# Return ONLY valid JSON.

# {{
#     "match_score": 0,
#     "matched_skills": [],
#     "missing_skills": [],
#     "strengths": [],
#     "suggestions": [],
#     "summary": ""
# }}
# """

#     response = model.generate_content(prompt)

#     text = response.text.strip()

#     # Remove markdown if Gemini returns ```json
#     text = text.replace("```json", "").replace("```", "").strip()

#     return json.loads(text)
import re


def normalize(skill):
    return skill.lower().strip()


def extract_job_skills(description):

    if not description:
        return []

    keywords = [

        "python",
        "java",
        "fastapi",
        "django",
        "flask",
        "spring",
        "react",
        "angular",
        "vue",
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "git",
        "github",
        "linux",
        "rest api",
        "javascript",
        "typescript",
        "html",
        "css"

    ]

    description = description.lower()

    found = []

    for skill in keywords:

        if skill in description:
            found.append(skill.title())

    return found


def match_jobs(
    analysis,
    jobs,
    resume_length
):

    resume_skills = {

        normalize(skill)

        for skill in analysis.get(
            "skills",
            []
        )

    }

    results = []

    for job in jobs:

        description = job.get(
            "description",
            ""
        )

        job_skills = extract_job_skills(
            description
        )

        job_skill_set = {

            normalize(skill)

            for skill in job_skills

        }

        matched = sorted(

            resume_skills &
            job_skill_set

        )

        missing = sorted(

            job_skill_set -
            resume_skills

        )

        if len(job_skill_set) == 0:

            match_score = 50

        else:

            match_score = int(

                len(matched) /
                len(job_skill_set) * 100

            )

        ats_score = min(
            match_score + 10,
            100
        )

        recommendations = []

        if missing:

            recommendations.append(

                "Learn: " +
                ", ".join(missing[:5])

            )

        if match_score >= 80:

            recommendations.append(
                "Excellent Match"
            )

        elif match_score >= 60:

            recommendations.append(
                "Good Match"
            )

        else:

            recommendations.append(
                "Needs Skill Improvement"
            )

        results.append({

            "title":
            job.get("title"),

            "company":
            job.get("company"),

            "location":
            job.get("location"),

            "apply_link":
            job.get("redirect_url"),

            "match_score":
            match_score,

            "ats_score":
            ats_score,

            "matched_skills":
            matched,

            "missing_skills":
            missing,

            "recommendations":
            recommendations

        })

    results.sort(

        key=lambda x: x["match_score"],

        reverse=True

    )

    return results
def match_resume_with_jd(resume_text: str, job_description: str):

    resume_skills = set(normalize(s) for s in extract_job_skills(resume_text))
    jd_skills = set(normalize(s) for s in extract_job_skills(job_description))

    matched = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)

    if jd_skills:
        match_score = int((len(matched) / len(jd_skills)) * 100)
    else:
        match_score = 0

    return {
        "match_score": match_score,
        "matched_skills": matched,
        "missing_skills": missing,
        "strengths": matched,
        "suggestions": [
            f"Learn: {', '.join(missing[:5])}"
        ] if missing else ["Your resume matches the job description well."],
        "summary": (
            "Excellent match."
            if match_score >= 80
            else "Good match."
            if match_score >= 60
            else "Needs improvement."
        ),
    }