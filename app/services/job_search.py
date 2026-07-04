
import os
import requests
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")
def fetch_jobs(query):

    print(f"\nSearching Jobs For: {query}")

    url = (
        f"https://api.adzuna.com/v1/api/jobs/in/search/1"
        f"?app_id={APP_ID}"
        f"&app_key={APP_KEY}"
        f"&results_per_page=10"
        f"&what={query}"
    )

    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        return []

    data = response.json()

    jobs = []

    for item in data.get("results", []):

        jobs.append({

            "title": item.get("title", "N/A"),

            "company": item.get("company", {}).get(
                "display_name",
                "Unknown Company"
            ),

            "location": item.get("location", {}).get(
                "display_name",
                "Unknown Location"
            ),

            "salary_min": item.get("salary_min"),

            "salary_max": item.get("salary_max"),

            "description": item.get("description", ""),

            "apply_link": item.get("redirect_url")

        })

    return jobs

def search_jobs(job_queries):

    all_jobs = []

    seen_links = set()

    with ThreadPoolExecutor(max_workers=5) as executor:

        futures = [

        executor.submit(fetch_jobs, query)

        for query in job_queries

    ]

    for future in as_completed(futures):

        for job in future.result():

            if job["apply_link"] in seen_links:
                continue

            seen_links.add(job["apply_link"])

            all_jobs.append(job)

    print("=" * 60)

    print("TOTAL UNIQUE JOBS FOUND:", len(all_jobs))

    print("=" * 60)

    return all_jobs