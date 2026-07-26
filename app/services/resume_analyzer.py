import re
from app.services.skill_extractor import extract_skills


# ==========================================
# Helper Functions
# ==========================================

def detect_experience(text):
    text = text.lower()

    if re.search(r"\b([3-9]|10)\+?\s+years?\b", text):
        return "Experienced"

    if "intern" in text or "internship" in text:
        return "Junior"

    return "Fresher"


def detect_education(text):
    text = text.lower()

    if "m.tech" in text or "mtech" in text:
        return "Master of Technology"

    if "b.tech" in text or "btech" in text:
        return "Bachelor of Technology"

    if "b.e" in text:
        return "Bachelor of Engineering"

    if "bca" in text:
        return "Bachelor of Computer Applications"

    if "mca" in text:
        return "Master of Computer Applications"

    return ""


def extract_projects(text):

    projects = []

    for line in text.splitlines():

        line = line.strip()

        if (
            len(line) > 5
            and "project" in line.lower()
        ):
            projects.append(line)

    return list(dict.fromkeys(projects))


def detect_domains(skills):

    skills = [s.lower() for s in skills]

    domains = []

    if any(s in skills for s in ["python", "fastapi", "django", "flask"]):
        domains.append("Backend Development")

    if any(s in skills for s in ["react", "html", "css", "javascript"]):
        domains.append("Frontend Development")

    if any(s in skills for s in ["mysql", "postgresql", "sql"]):
        domains.append("Database")

    if any(s in skills for s in ["power bi", "excel"]):
        domains.append("Data Analytics")

    if any(s in skills for s in ["tensorflow", "pytorch", "machine learning"]):
        domains.append("Artificial Intelligence")

    return domains


def extract_name(text):

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return ""

    if len(lines[0].split()) <= 4:
        return lines[0]

    return ""


# ==========================================
# Resume Analysis
# ==========================================

def analyze_resume(text: str):

    skills = extract_skills(text)

    experience = detect_experience(text)

    education = detect_education(text)

    projects = extract_projects(text)

    domains = detect_domains(skills)

    summary = (
        f"{experience} candidate with "
        f"{len(skills)} identified technical skills "
        f"and {len(projects)} project(s)."
    )

    return {

        "text": text,

        "candidate_name": extract_name(text),

        "experience_level": experience,

        "education": education,

        "career_domains": domains,

        "skills": skills,

        "projects": projects,

        "summary": summary,

        "resume_length": len(text),

        "word_count": len(text.split())

    }