import csv
import time
import smtplib
from email.message import EmailMessage

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

# Direct credentials
SENDER_EMAIL = "rhms.admin@rajalakshmi.edu.in"
SENDER_PASS = "wztn jrbh hpod aijh"
SENDER_NAME = "Hostel Management Team"

SUBJECT = "Immediate Meeting Required – Hostel Information"
RECIPIENTS_CSV = r"D:\Webapp\webp\34 not check-in hostel list(Sheet1).csv"

# HTML Template with dark red phrase
HTML_TEMPLATE = """
<html>
  <body>
    <p>Dear {name} {lastname},</p>

    <p>
      You are 
      <span style="color:red; font-weight:bold;">
        instructed to meet Ms. P. Magila (SAO Admin) immediately on Monday
      </span>
      regarding hostel Enquiry.
    </p>

    <p>
      Kindly report to the Admin office without delay .
    </p>

    <p>
      Regards,<br>
      Admin Office<br>
      Rajalakshmi Engineering College
    </p>
  </body>
</html>
"""

PER_EMAIL_SLEEP = 2

def build_message(to_email, name, lastname):
    msg = EmailMessage()
    msg["Subject"] = SUBJECT
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["To"] = to_email

    # Plain text fallback (no color)
    text_fallback = f"""Dear {name} {lastname},

You are instructed to meet Ms. P. Magila (SAO Admin) immediately on Monday regarding hostel information.
Kindly report to the Admin office without delay.

Regards,
Admin Office
Rajalakshmi Engineering College
"""
    html_body = HTML_TEMPLATE.format(name=name, lastname=lastname)

    msg.set_content(text_fallback)
    msg.add_alternative(html_body, subtype="html")

    return msg

def main():
    with open(RECIPIENTS_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        recipients = [row for row in reader]

    print(f"Loaded {len(recipients)} recipients.")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASS)

        for i, r in enumerate(recipients, start=1):
            email = r.get("email")
            name = r.get("name", "")
            lastname = r.get("lastname", "")
            if not email:
                continue
            msg = build_message(email, name, lastname)
            try:
                server.send_message(msg)
                print(f"[{i}/{len(recipients)}] Sent to {email}")
            except Exception as e:
                print(f"Error sending to {email}: {e}")
            time.sleep(PER_EMAIL_SLEEP)

    print("Done.")

if __name__ == "__main__":
    main()
