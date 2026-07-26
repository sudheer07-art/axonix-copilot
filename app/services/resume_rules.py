import re


def generate_resume_suggestions(resume_data: dict):

    suggestions = []

    text = resume_data.get("text", "").lower()
    skills = resume_data.get("skills", [])
    projects = resume_data.get("projects", [])

    # -------------------------------
    # Skills
    # -------------------------------
    if len(skills) < 8:
        suggestions.append({
            "title": "Add More Skills",
            "message": "Include more relevant technical skills for better ATS matching."
        })

    # -------------------------------
    # Projects
    # -------------------------------
    if len(projects) < 2:
        suggestions.append({
            "title": "Add Projects",
            "message": "Include at least two strong projects with measurable impact."
        })

    # -------------------------------
    # GitHub
    # -------------------------------
    if "github.com" not in text:
        suggestions.append({
            "title": "GitHub Missing",
            "message": "Add your GitHub profile to showcase your code."
        })

    # -------------------------------
    # LinkedIn
    # -------------------------------
    if "linkedin.com" not in text:
        suggestions.append({
            "title": "LinkedIn Missing",
            "message": "Add your LinkedIn profile to improve recruiter visibility."
        })

    # -------------------------------
    # Certifications
    # -------------------------------
    if "certification" not in text and "certificate" not in text:
        suggestions.append({
            "title": "Add Certifications",
            "message": "Relevant certifications strengthen your resume."
        })

    # -------------------------------
    # Resume Summary
    # -------------------------------
    if "summary" not in text and "objective" not in text:
        suggestions.append({
            "title": "Resume Summary",
            "message": "Add a professional summary at the beginning of your resume."
        })

    # -------------------------------
    # Achievements
    # -------------------------------
    if "achievement" not in text:
        suggestions.append({
            "title": "Achievements",
            "message": "Mention awards, hackathons, or academic achievements."
        })

    # -------------------------------
    # Internship
    # -------------------------------
    if "intern" not in text:
        suggestions.append({
            "title": "Internship",
            "message": "Consider adding internship or practical experience."
        })

    # -------------------------------
    # Action Verbs
    # -------------------------------
    action_words = [
        "developed",
        "built",
        "implemented",
        "designed",
        "optimized",
        "created"
    ]

    if not any(word in text for word in action_words):
        suggestions.append({
            "title": "Use Strong Action Words",
            "message": "Use words like Developed, Built, Designed, or Implemented."
        })

    return suggestions