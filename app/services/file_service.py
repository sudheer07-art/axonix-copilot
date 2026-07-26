import os
import shutil
from fastapi import UploadFile

from app.services.resume_parser import extract_text_from_pdf

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def validate_pdf(file: UploadFile):
    """
    Validate uploaded resume.
    """

    if not file.filename:
        raise ValueError("No file uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF resumes are supported.")


def save_uploaded_file(file: UploadFile):
    """
    Save uploaded PDF to uploads folder.

    Returns:
        file_path
    """

    validate_pdf(file)

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    return file_path


def extract_resume(file: UploadFile):
    """
    Validate → Save → Extract Resume Text

    Returns:
        (file_path, resume_text)
    """

    file_path = save_uploaded_file(file)

    resume_text = extract_text_from_pdf(
        file_path
    )

    if not resume_text.strip():
        raise ValueError(
            "Unable to extract text from the uploaded PDF."
        )

    return file_path, resume_text