# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install build dependencies first
COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Expose port (Render will set $PORT)
EXPOSE 8080

# Set environment variable for Python path
ENV PYTHONPATH=/app

# Start the app with Gunicorn, using $PORT if set
CMD gunicorn app:app --bind 0.0.0.0:${PORT:-8080}
