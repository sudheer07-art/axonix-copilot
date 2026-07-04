def match_jobs(analysis, jobs, resume_length):

    matches = []

    resume_skills = [
        skill.lower()
        for skill in analysis.get("skills", [])
    ]

    resume = set(resume_skills)

    for job in jobs:

        job_title = str(job.get("title", "")).lower()
        job_description = str(job.get("description", "")).lower()

        job_keywords = job_title + " " + job_description

        matched = []
        skill_score = 0

        for skill in resume:
            if skill in job_keywords:
                matched.append(skill)
                skill_score += 1

        total_skills = max(len(resume), 1)

        skill_percentage = round(
            (skill_score / total_skills) * 100,
            2
        )

        missing = list(resume - set(matched))

        weighted_skill_score = skill_percentage * 0.40

        match_score = round(weighted_skill_score, 2)

        ats_score = min(
            100,
            round(match_score * 0.9 + resume_length / 50)
        )

        recommendations = [
            f"Improve your {skill} skills"
            for skill in missing
        ]

        matches.append({
            "title": job.get("title"),
            "company": job.get("company"),
            "location": job.get("location"),
            "salary": f"{job.get('salary_min')} - {job.get('salary_max')}",
            "match_score": match_score,
            "ats_score": ats_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "recommendations": recommendations,
            "apply_link": job.get("apply_link")
        })

    matches.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    print("=" * 60)
    print("MATCHING COMPLETED")
    print("Total Matches:", len(matches))
    print("=" * 60)

    return matches