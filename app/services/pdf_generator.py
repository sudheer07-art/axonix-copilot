from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet


def generate_report(
    filename,
    skills,
    matches
):

    pdf = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "AI Job Search Copilot Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Detected Skills: {', '.join(skills)}",
            styles["BodyText"]
        )
    )

    content.append(Spacer(1, 12))

    for job in matches:

        content.append(
            Paragraph(
                f"<b>{job['title']}</b>",
                styles["Heading2"]
            )
        )

        content.append(
            Paragraph(
                f"Company: {job['company']}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"ATS Score: {job['ats_score']}%",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"Matched Skills: {', '.join(job['matched_skills'])}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"Missing Skills: {', '.join(job['missing_skills'])}",
                styles["BodyText"]
            )
        )

        content.append(
            Spacer(1, 10)
        )

    pdf.build(content)

    return filename