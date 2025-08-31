from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import tempfile
import csv
import time
import smtplib
from email.message import EmailMessage
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables from .env if present
load_dotenv()

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "rhms.admin@rajalakshmi.edu.in")
SENDER_PASS = os.getenv("SENDER_PASS", "wztn jrbh hpod aijh")
SENDER_NAME = os.getenv("SENDER_NAME", "Hostel Management Team")

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def build_message(to_email, name, lastname, subject, content, sender_name=None):
    msg = EmailMessage()
    msg["Subject"] = subject
    # Use custom sender name if provided, otherwise use default
    display_name = sender_name if sender_name else SENDER_NAME
    msg["From"] = f"{display_name} <{SENDER_EMAIL}>"
    msg["To"] = to_email

    # Create HTML content
    html_content = f"""
    <html>
      <body>
        <p>Dear {name} {lastname},</p>
        <div>{content}</div>
      </body>
    </html>
    """

    # Plain text fallback
    text_content = f"""Dear {name} {lastname},

{content}
"""

    msg.set_content(text_content)
    msg.add_alternative(html_content, subtype="html")

    return msg

@app.route('/api/send-emails', methods=['POST'])
def send_emails():
    try:
        data = request.json
        subject = data.get('subject', '')
        content = data.get('content', '')
        csv_data = data.get('csvData', [])
        sender_name = data.get('senderName', '')  # Get custom sender name
        
        if not subject or not content or not csv_data:
            return jsonify({'error': 'Missing required fields'}), 400

        # Validate CSV structure
        required_columns = ['email', 'name', 'lastname']
        if not all(col in csv_data[0].keys() for col in required_columns):
            return jsonify({'error': 'CSV must contain email, name, and lastname columns'}), 400

        # Send emails
        success_count = 0
        error_count = 0
        errors = []

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASS)

            for i, row in enumerate(csv_data, start=1):
                email = row.get('email', '').strip()
                name = row.get('name', '').strip()
                lastname = row.get('lastname', '').strip()

                if not email:
                    error_count += 1
                    errors.append(f"Row {i}: Missing email")
                    continue

                try:
                    msg = build_message(email, name, lastname, subject, content, sender_name)
                    server.send_message(msg)
                    success_count += 1
                    print(f"[{i}/{len(csv_data)}] Sent to {email}")
                except Exception as e:
                    error_count += 1
                    errors.append(f"Row {i} ({email}): {str(e)}")
                    print(f"Error sending to {email}: {e}")

                # Rate limiting
                time.sleep(2)

        return jsonify({
            'success': True,
            'message': f'Emails sent successfully! {success_count} sent, {error_count} failed',
            'success_count': success_count,
            'error_count': error_count,
            'errors': errors
        })

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
ye    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
