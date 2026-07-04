import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def optimize_keywords(text):

    prompt = f"""
    You are an ATS Resume Expert.

    Analyze the resume and provide:

    1. Missing ATS keywords
    2. Important technical skills to add
    3. Suggested certifications
    4. Suggested project keywords

    Resume:

    {text[:5000]}
    """

    response = model.generate_content(prompt)

    return response.text