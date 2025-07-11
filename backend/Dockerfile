FROM python:3.11-slim

WORKDIR /app

# 1) copy only the requirements file and install it
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2) copy the rest of the backend code
COPY backend ./

# 3) run your app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]