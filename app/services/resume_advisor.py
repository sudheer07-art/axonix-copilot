def generate_suggestions(
    ats_score,
    missing_skills
):

    suggestions = []

    if ats_score < 70:
        suggestions.append(
            "Add more relevant skills and projects."
        )

    if missing_skills:
        suggestions.append(
            f"Learn or highlight: {', '.join(missing_skills)}"
        )

    suggestions.append(
        "Add measurable achievements."
    )

    suggestions.append(
        "Quantify business impact."
    )

    return suggestions