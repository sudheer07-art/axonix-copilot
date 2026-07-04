from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load .env file
load_dotenv()

# Configure Gemini
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Gemini Model
model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def review_resume(text):

    prompt = f"""
You are an expert ATS Resume Reviewer.

Analyze the following resume and provide:

1. ATS Score out of 100
2. Strengths
3. Weaknesses
4. Missing Keywords
5. ATS Improvements
6. Final Recommendations

Resume:

{text[:5000]}
"""

    try:

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        return f"""
❌ Gemini Error

{str(e)}

Please check:
1. Gemini API Key
2. Internet Connection
3. Gemini Model Name
"""