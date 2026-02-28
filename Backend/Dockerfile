FROM python:3.13-slim

# Variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app
 
# Copia el archivo de dependencias primero (para aprovechar caché de Docker)
COPY requirements.txt .

# Instala dependencias del sistema necesarias para psycopg2
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev curl && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copia todo el proyecto al contenedor
COPY . .

# Expone el puerto que usará Django
EXPOSE $PORT

# Comando para ejecutar la aplicación con Gunicorn
CMD ["sh", "-c", "gunicorn Backend.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]