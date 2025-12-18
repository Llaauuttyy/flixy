FROM python:3.9

WORKDIR /code

# Copia y instala las dependencias primero
COPY requirements.txt .
RUN python -m pip install --no-cache-dir --upgrade -r requirements.txt

# Luego copia el resto del código
COPY . .

EXPOSE 8088

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8088", "--reload"]
