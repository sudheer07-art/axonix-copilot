def calculate_ats_score(
    matched_skills,
    total_job_skills,
    resume_length
):

    skill_score = (
        len(matched_skills)
        / total_job_skills
    ) * 80

    if resume_length < 1000:
        length_score = 5
    elif resume_length < 2000:
        length_score = 10
    elif resume_length < 3000:
        length_score = 15
    else:
        length_score = 20

    return round(
        skill_score + length_score,
        2
    )