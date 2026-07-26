import os
import requests
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")

BASE_URL = "https://api.adzuna.com/v1/api/jobs"


def search_jobs(keywords, country="in", results_per_keyword=5):
    """
    Search Adzuna using AI-generated keywords.

    Returns:
        [
            {
                "id": "...",
                "title": "...",
                "company": "...",
                "location": "...",
                "salary": "...",
                "description": "...",
                "url": "..."
            }
        ]
    """

    if not APP_ID or not APP_KEY:
        print("Adzuna API credentials are missing.")
        return []

    jobs = []
    seen_jobs = set()

    session = requests.Session()

    for keyword in keywords:

        keyword = keyword.strip()

        if not keyword:
            continue

        try:

            response = session.get(
                f"{BASE_URL}/{country}/search/1",
                params={
                    "app_id": APP_ID,
                    "app_key": APP_KEY,
                    "results_per_page": results_per_keyword,
                    "what": keyword,
                },
                timeout=10,
            )

            response.raise_for_status()

            data = response.json()

            for item in data.get("results", []):

                job_id = item.get("id")

                if not job_id or job_id in seen_jobs:
                    continue

                seen_jobs.add(job_id)

                salary_min = item.get("salary_min")
                salary_max = item.get("salary_max")

                if salary_min and salary_max:
                    salary = f"{salary_min:,.0f} - {salary_max:,.0f}"
                elif salary_min:
                    salary = f"{salary_min:,.0f}+"
                else:
                    salary = "Not disclosed"

                jobs.append(
                    {
                        "id": job_id,
                        "title": item.get("title", ""),
                        "company": item.get("company", {}).get("display_name", ""),
                        "location": item.get("location", {}).get("display_name", ""),
                        "salary": salary,
                        "description": item.get("description", ""),
                        "url": item.get("redirect_url", ""),
                    }
                )

        except requests.RequestException as e:
            print(f"Error searching '{keyword}': {e}")

    session.close()

    return jobs