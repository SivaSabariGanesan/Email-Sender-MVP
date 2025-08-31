# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Expose port (default Flask/Gunicorn port)
EXPOSE 8000

# Start the app with Gunicorn
CMD ["gunicorn", "backend.app:app", "-b", "0.0.0.0:8000"]
