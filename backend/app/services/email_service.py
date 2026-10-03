import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from uuid import UUID

import aiosmtplib

from app.config import settings


def parse_inbound_email(raw_data: dict) -> dict:
    return {
        "from_email": raw_data.get("from", ""),
        "subject": raw_data.get("subject", "No Subject"),
        "body": raw_data.get("body", raw_data.get("text", "")),
        "html": raw_data.get("html", ""),
        "headers": raw_data.get("headers", {}),
    }


async def send_email(to: str, subject: str, body: str, html: str | None = None) -> bool:
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))
    if html:
        msg.attach(MIMEText(html, "html"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        return True
    except Exception:
        return False
