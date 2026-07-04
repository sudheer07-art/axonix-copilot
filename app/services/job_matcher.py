# # # from app.services.ats_scorer import calculate_ats_score


# # # def match_jobs(
# # #     resume_skills,
# # #     jobs,
# # #     resume_length
# # # ):

# # #     matches = []

# # #     for job in jobs:

# # #         matched_skills = list(
# # #             set(resume_skills) &
# # #             set(job["skills"])
# # #         )

# # #         missing_skills = list(
# # #             set(job["skills"]) -
# # #             set(resume_skills)
# # #         )

# # #         score = (
# # #             len(matched_skills)
# # #             / len(job["skills"])
# # #         ) * 100

# # #         ats_score = calculate_ats_score(
# # #             matched_skills,
# # #             len(job["skills"]),
# # #             resume_length
# # #         )

# # #         matches.append({
# # #             "title": job["title"],
# # #             "company": job["company"],
# # #             "match_score": round(score, 2),
# # #             "ats_score": ats_score,
# # #             "matched_skills": matched_skills,
# # #             "missing_skills": missing_skills
# # #         })

# # #     matches.sort(
# # #         key=lambda x: x["ats_score"],
# # #         reverse=True
# # #     )

# # #     return matches
# # from app.services.ats_scorer import calculate_ats_score
# # from app.services.resume_advisor import generate_suggestions
# # from app.services.resume_recommender import recommend_learning

# # def match_jobs(
# #     resume_skills,
# #     jobs,
# #     resume_length
# # ):

# #     matches = []

# #     for job in jobs:
        

# #         matched_skills = list(
# #             set(resume_skills) &
# #             set(job["skills"])
# #         )

# #         missing_skills = list(
# #             set(job["skills"]) -
# #             set(resume_skills)
# #         )

# #         score = (
# #             len(matched_skills)
# #             / len(job["skills"])
# #         ) * 100

# #         ats_score = calculate_ats_score(
# #             matched_skills,
# #             len(job["skills"]),
# #             resume_length
# #         )
# #         recommendations = recommend_learning(
# #     missing_skills
# # )
# #         suggestions = generate_suggestions(
# #     ats_score,
# #     missing_skills
# # )
# #         matches.append({
# #     "title": job["title"],
# #     "company": job["company"],
# #     "location": job.get("location", "Not Specified"),
# #     "salary": job.get("salary", "Not Specified"),
# #     "match_score": round(score, 2),
# #     "ats_score": ats_score,
# #     "matched_skills": matched_skills,
# #     "missing_skills": missing_skills,
# #     "recommendations": recommendations
# # })

# #     matches.sort(
# #         key=lambda x: x["ats_score"],
# #         reverse=True
# #     )

# #     return matches
# import os
# import json
# from dotenv import load_dotenv
# import google.generativeai as genai

# load_dotenv()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("gemini-2.5-flash")


# def match_jobs(resume_skills, jobs, resume_length):

#     matches = []

#     for job in jobs:

#         prompt = f"""
# You are an expert ATS and recruitment assistant.

# Resume Skills:
# {resume_skills}

# Job Details:

# Title: {job.get("title")}

# Company: {job.get("company")}

# Description:
# {job.get("description","")}

# Compare the resume with the job.

# Return ONLY valid JSON.

# {{
#     "match_score":85,
#     "ats_score":82,
#     "matched_skills":["Python","SQL"],
#     "missing_skills":["Docker","AWS"],
#     "recommendations":[
#         "Learn Docker",
#         "Add AWS project"
#     ]
# }}
# """

#         try:

#             response = model.generate_content(prompt)

#             text = (
#                 response.text
#                 .replace("```json", "")
#                 .replace("```", "")
#                 .strip()
#             )

#             result = json.loads(text)

#             matches.append({

#                 "title": job.get("title"),

#                 "company": job.get("company"),

#                 "location": job.get("location"),

#                 "salary": f"{job.get('salary_min')} - {job.get('salary_max')}",

#                 "match_score": result.get("match_score", 0),

#                 "ats_score": result.get("ats_score", 0),

#                 "matched_skills": result.get("matched_skills", []),

#                 "missing_skills": result.get("missing_skills", []),

#                 "recommendations": result.get("recommendations", []),

#                 "apply_link": job.get("apply_link")
#             })

#         except Exception as e:

#             print("=" * 60)
#             print("JOB MATCH ERROR")
#             print(job.get("title"))
#             print(e)
#             print("=" * 60)

#     matches.sort(
#         key=lambda x: x["match_score"],
#         reverse=True
#     )

#     return matches
def match_jobs(
    analysis,
    jobs,
    resume_length
):

    matches = []

    # -----------------------------
    # Resume Data
    # -----------------------------

    resume_skills = [

        skill.lower()

        for skill in analysis.get(

            "skills",

            []

        )

    ]

    resume_projects = [

        project.lower()

        for project in analysis.get(

            "projects",

            []

        )

    ]

    experience = (

        analysis.get(

            "experience_level",

            "Fresher"

        ).lower()

    )

    education = (

        analysis.get(

            "education",

            ""

        ).lower()

    )

    career_domains = [

        domain.lower()

        for domain in analysis.get(

            "career_domains",

            []

        )

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
        # --------------------------------
# Skill Weight (40%)
# --------------------------------

        weighted_skill_score = skill_percentage * 0.40

        match_score = round(
    weighted_skill_score,
    2
)

        ats_score = min(
            100,
            round(match_score * 0.9 + resume_length / 50)
        )

        recommendations = []

        for skill in missing:
            recommendations.append(
                f"Improve your {skill} skills"
            )

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