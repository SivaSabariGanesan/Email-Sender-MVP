# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend ./backend

# Expose Railway's default port
EXPOSE 8080

# Set PYTHONPATH so Gunicorn can find backend module
ENV PYTHONPATH=/app

# Start the app with Gunicorn
CMD ["gunicorn", "backend.app:app", "-b", "0.0.0.0:${PORT:-8080}"]
