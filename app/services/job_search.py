
import os
import requests
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")
print("=" * 60)
print("ADZUNA APP ID:", APP_ID)

if APP_KEY:
    print("ADZUNA APP KEY:", APP_KEY[:6] + "******")
else:
    print("ADZUNA APP KEY: None")

print("=" * 60)

def fetch_jobs(query):

    print("=" * 60)
    print("Searching Adzuna for:", query)
    print("=" * 60)

    url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"

    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "results_per_page": 10,
        "what": query
    }

    response = requests.get(url,
                            params=params,
                            timeout=15)

    print("=" * 60)
    print("Status:", response.status_code)
    print("=" * 60)
    print("FINAL URL")
    print(response.request.url)
    print("=" * 60)
    print("Response:")
    print(response.text[:1000])
    print("=" * 60)

    print("Status Code:", response.status_code)

    if response.status_code != 200:
        print(response.text)
        return []

    data = response.json()

    print("Jobs Returned:", len(data.get("results", [])))

    jobs = []

    for item in data.get("results", []):

        jobs.append({

            "title": item.get("title"),

            "company": item.get(
                "company",
                {}
            ).get(
                "display_name",
                ""
            ),

            "location": item.get(
                "location",
                {}
            ).get(
                "display_name",
                ""
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