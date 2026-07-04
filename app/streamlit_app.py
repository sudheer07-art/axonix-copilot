
# import streamlit as st
# import requests
# import plotly.express as px
# import json

# API_URL = "http://127.0.0.1:8000"

# st.set_page_config(
#     page_title="AI Job Search Copilot",
#     page_icon="🚀",
#     layout="wide"
# )

# st.title("🚀 AI Job Search Copilot")

# uploaded_file = st.file_uploader(
#     "Upload Resume",
#     type=["pdf"]
# )

# if uploaded_file:

#     st.success("Resume uploaded successfully")

#     files = {
#         "file": (
#             uploaded_file.name,
#             uploaded_file,
#             "application/pdf"
#         )
#     }
# st.subheader(
#     "📄 Job Description Match"
# )

# job_description = st.text_area(
#     "Paste Job Description"
# )
#     # ==================================
#     # Optimize Resume Keywords
#     # ==================================
# if st.button("Optimize Resume Keywords"):
#     response = requests.post(
#             f"{API_URL}/optimize-keywords",
#             files=files
#         )

#     if response.status_code == 200:

#             result = response.json()

#             st.subheader("🔑 ATS Keyword Suggestions")

#             st.write(
#                 result["keywords"]
#             )

#         else:

#             st.error(
#                 f"Backend Error: {response.status_code}"
#             )

#             st.code(response.text)

#     # ==================================
#     # AI Resume Review
#     # ==================================
#     if st.button("AI Resume Review"):

#         response = requests.post(
#             f"{API_URL}/ai-review",
#             files=files
#         )

#         if response.status_code == 200:

#             review = response.json()

#             st.subheader("🤖 AI Resume Review")

#             st.write(
#                 review["review"]
#             )

#         else:

#             st.error(
#                 f"Backend Error: {response.status_code}"
#             )

#             st.code(response.text)

#     # ==================================
#     # Analyze Resume
#     # ==================================
#     # ==================================
# # Analyze Resume
# # ==================================
# if st.button("Analyze Resume"):

#     response = requests.post(
#         f"{API_URL}/job-matches",
#         files=files
#     )

#     if response.status_code == 200:

#         data = response.json()

#         st.subheader("📌 Detected Skills")
#         st.write(data["resume_skills"])

#         # Download Report
#         report_data = {
#             "skills": data["resume_skills"],
#             "matches": data["matches"]
#         }

#         st.download_button(
#             label="⬇ Download ATS Report",
#             data=json.dumps(
#                 report_data,
#                 indent=4
#             ),
#             file_name="ATS_Report.json",
#             mime="application/json"
#         )

#         st.subheader("💼 Matching Jobs")

#         # ATS Score Chart
#         job_titles = [
#             job["title"]
#             for job in data["matches"]
#         ]

#         ats_scores = [
#             job["ats_score"]
#             for job in data["matches"]
#         ]

#         fig = px.bar(
#             x=job_titles,
#             y=ats_scores,
#             title="ATS Score Comparison",
#             labels={
#                 "x": "Job Role",
#                 "y": "ATS Score"
#             }
#         )

#         st.plotly_chart(
#             fig,
#             use_container_width=True
#         )

#         # Job Results
#         for job in data["matches"]:

#             st.subheader(job["title"])

#             st.write(
#                 f"🏢 Company: {job['company']}"
#             )

#             st.progress(
#                 int(job["match_score"])
#             )

#             st.metric(
#                 "ATS Score",
#                 f"{job['ats_score']}%"
#             )

#             st.write(
#                 f"Match Score: {job['match_score']}%"
#             )

#             st.write(
#                 f"Matched Skills: {', '.join(job['matched_skills'])}"
#             )

#             st.write("### Missing Skills")

#             if job["missing_skills"]:

#                 for skill in job["missing_skills"]:
#                     st.warning(skill)

#             else:
#                 st.success(
#                     "No missing skills found"
#                 )

#             if "suggestions" in job:

#                 st.write(
#                     "### 📋 Resume Suggestions"
#                 )

#                 for suggestion in job["suggestions"]:
#                     st.write(
#                         f"• {suggestion}"
#                     )

#             st.divider()

#     else:

#         st.error(
#             f"Backend Error: {response.status_code}"
#         )

#         st.code(
#             response.text
#         )
import streamlit as st
import requests
import plotly.express as px
import json

API_URL = "https://axonix-copilot.onrender.com"

st.set_page_config(
page_title="AI Job Search Copilot",
page_icon="🚀",
layout="wide"
)

st.title("🚀 AI Job Search Copilot")

uploaded_file = st.file_uploader(
    "Upload Resume",
    type=["pdf"]
)

if not uploaded_file:
    st.stop()

st.success("Resume uploaded successfully")

files = {
    "file": (
        uploaded_file.name,
        uploaded_file.getvalue(),
        "application/pdf"
    )
}
# ==========================
# JD Match Section
# ==========================
st.subheader("📄 Job Description Match")

job_description = st.text_area(
    "Paste Job Description"
)

if st.button("Match Resume With JD"):

    response = requests.post(
        f"{API_URL}/jd-match",
        files=files,
        data={
            "job_description": job_description
        }
    )

    if response.status_code == 200:

        result = response.json()

        st.metric(
            "JD Match Score",
            f"{result['match_score']}%"
        )

        st.write("Matched Keywords")

        st.write(
            result["matched_keywords"]
        )

    else:

        st.error(
            f"Backend Error: {response.status_code}"
        )

        st.code(response.text)

# ==========================
# Keyword Optimizer
# ==========================
if st.button("Optimize Resume Keywords"):

    response = requests.post(
        f"{API_URL}/optimize-keywords",
        files=files
    )

    if response.status_code == 200:

        result = response.json()

        st.subheader(
            "🔑 ATS Keyword Suggestions"
        )

        st.write(
            result["keywords"]
        )

    else:

        st.error(
            f"Backend Error: {response.status_code}"
        )

        st.code(response.text)

# ==========================
# AI Resume Review
# ==========================
if st.button("AI Resume Review"):

    response = requests.post(
        f"{API_URL}/ai-review",
        files=files
    )

    if response.status_code == 200:

        review = response.json()

        st.subheader(
            "🤖 AI Resume Review"
        )

        st.write(
            review["review"]
        )

    else:

        st.error(
            f"Backend Error: {response.status_code}"
        )

        st.code(response.text)
# if st.button("Find Live Jobs"):

#     response = requests.post(
#         f"{API_URL}/live-jobs",
#         files=files
#     )

#     if response.status_code == 200:

#         data = response.json()

#         st.subheader("💼 Available Jobs")

#         for job in data["jobs"]:

#             st.write(
#                 f"💼 {job['title']}"
#             )

#             st.write(
#                 f"🏢 {job['company']}"
#             )

#             if "location" in job:
                
#                 st.write(
#               f"📍 {job['location']}"
#     )

#             if "salary" in job:
#                 st.write(
#         f"💰 {job['salary']}"
#     )
#             st.divider()

#     else:

#         st.error(response.text)
# ==========================
# Analyze Resume
# ==========================
if st.button("Analyze Resume"):

    response = requests.post(
        f"{API_URL}/job-matches",
        files=files
    )

    if response.status_code == 200:

        data = response.json()

        st.subheader(
            "📌 Detected Skills"
        )

        st.write(
            data["resume_skills"]
        )

        report_data = {
            "skills": data["resume_skills"],
            "matches": data["matches"]
        }

        st.download_button(
            label="⬇ Download ATS Report",
            data=json.dumps(
                report_data,
                indent=4
            ),
            file_name="ATS_Report.json",
            mime="application/json"
        )

        st.subheader(
            "💼 Matching Jobs"
        )

        job_titles = [
            job["title"]
            for job in data["matches"]
        ]

        ats_scores = [
            job["ats_score"]
            for job in data["matches"]
        ]

        fig = px.bar(
            x=job_titles,
            y=ats_scores,
            title="ATS Score Comparison"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

        for job in data["matches"]:

            st.subheader(
                job["title"]
            )

            st.write(
    f"🏢 Company: {job['company']}"
)

            st.write(
    f"📍 Location: {job.get('location', 'Not Available')}"
)

            st.write(
    f"💰 Salary: {job.get('salary', 'Not Available')}"
)

            st.progress(
                int(job["match_score"])
            )

            st.metric(
                "ATS Score",
                f"{job['ats_score']}%"
            )

            st.write(
                f"Match Score: {job['match_score']}%"
            )

            st.write(
                f"Matched Skills: {', '.join(job['matched_skills'])}"
            )

            st.write(
                "### Missing Skills"
            )

            if job["missing_skills"]:

                for skill in job["missing_skills"]:
                    st.warning(skill)

            else:

                st.success(
                    "No missing skills found"
                )

            if "suggestions" in job:

                st.write(
                    "### 📋 Resume Suggestions"
                )

                for suggestion in job["suggestions"]:

                    st.write(
                        f"• {suggestion}"
                    )

            st.divider()

# ==========================
# Live Jobs Search
# ==========================
if st.button("Find Live Jobs"):

    response = requests.post(
        f"{API_URL}/live-jobs",
        files=files
    )

    if response.status_code == 200:

        data = response.json()

        st.subheader("💼 Live Jobs")

        for job in data["jobs"]:

            st.subheader(
                job.get("title", "N/A")
            )

            st.write(
                f"🏢 {job.get('company', 'Unknown Company')}"
            )

            st.write(
                f"📍 {job.get('location', 'Unknown Location')}"
            )

            if job.get("salary_min"):
                st.write(
                    f"💰 Min Salary: ₹{job['salary_min']:,.0f}"
                )

            if job.get("salary_max"):
                st.write(
                    f"💰 Max Salary: ₹{job['salary_max']:,.0f}"
                )

            st.write(
                job.get(
                    "description",
                    "No description available"
                )
            )

            if job.get("apply_link"):

                st.link_button(
                    "🚀 Apply Now",
                    job["apply_link"]
                )

            st.divider()

    else:

        st.error(
            f"Backend Error: {response.status_code}"
        )

        st.code(response.text)