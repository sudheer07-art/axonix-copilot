import re

# Common technical skills
SKILLS = {
    "python", "java", "c", "c++", "c#", "javascript", "typescript",
    "html", "css", "react", "angular", "vue",
    "fastapi", "flask", "django", "spring", "spring boot",
    "sql", "mysql", "postgresql", "mongodb", "sqlite",
    "git", "github", "docker", "kubernetes",
    "aws", "azure", "gcp",
    "rest api", "api", "json",
    "linux", "unix",
    "machine learning", "deep learning",
    "pandas", "numpy", "power bi",
    "excel", "figma"
}


def extract_skills(text: str):
    """
    Extract technical skills from resume text.
    """

    text = text.lower()

    found = set()

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):
            found.add(skill.title())

    return sorted(found)