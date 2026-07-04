def recommend_learning(missing_skills):

    recommendations = []

    learning_map = {
        "python": "Complete Python Basics and OOP",
        "sql": "Practice SQL Joins and Queries",
        "power bi": "Build Power BI Dashboards",
        "fastapi": "Learn FastAPI REST APIs",
        "postgresql": "Learn PostgreSQL Database Design",
        "excel": "Master Excel Formulas and Pivot Tables",
        "mysql": "Learn MySQL CRUD Operations"
    }

    for skill in missing_skills:

        if skill.lower() in learning_map:
            recommendations.append(
                learning_map[skill.lower()]
            )
        else:
            recommendations.append(
                f"Learn {skill}"
            )

    return recommendations