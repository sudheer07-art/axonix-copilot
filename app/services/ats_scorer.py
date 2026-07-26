
import re


def calculate_ats_score(resume_data: dict):

    score = 0

    suggestions = []

    skills = resume_data.get("skills", [])
    projects = resume_data.get("projects", [])
    education = resume_data.get("education", "")
    experience = resume_data.get("experience_level", "")

    text = resume_data.get("text", "").lower()

    # -------------------------------
    # Skills (40 Points)
    # -------------------------------
    skill_score = min(len(skills) * 4, 40)
    score += skill_score

    if len(skills) < 8:
        suggestions.append(
            "Add more technical skills relevant to your target job."
        )

    # -------------------------------
    # Projects (20 Points)
    # -------------------------------
    if len(projects) >= 2:
        score += 20
    elif len(projects) == 1:
        score += 10
        suggestions.append(
            "Include one more project to strengthen your resume."
        )
    else:
        suggestions.append(
            "Add academic or personal projects."
        )

    # -------------------------------
    # Education (15 Points)
    # -------------------------------
    if education:
        score += 15
    else:
        suggestions.append(
            "Add your education details."
        )

    # -------------------------------
    # Experience (10 Points)
    # -------------------------------
    if experience == "Experienced":
        score += 10
    elif experience == "Junior":
        score += 8
    else:
        score += 5

    # -------------------------------
    # GitHub (5 Points)
    # -------------------------------
    if "github.com" in text:
        score += 5
    else:
        suggestions.append(
            "Add your GitHub profile."
        )

    # -------------------------------
    # LinkedIn (5 Points)
    # -------------------------------
    if "linkedin.com" in text:
        score += 5
    else:
        suggestions.append(
            "Add your LinkedIn profile."
        )

    # -------------------------------
    # Email (3 Points)
    # -------------------------------
    if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text):
        score += 3

    # -------------------------------
    # Phone (2 Points)
    # -----------------------------x--
    if re.search(r"\d{10}", text):
        score += 2

    score = min(score, 100)

    profile_strength = round(score * 0.9, 2)
    resume_health = round(score * 0.95, 2)

    return {
    "ats_score": score,
    "profile_strength": profile_strength,
    "resume_health": resume_health,
    "suggestions": suggestions
}