#!/usr/bin/env bash
# Salir en caso de error
set -o errexit

echo "Instalando dependencias..."
pip install -r requirements.txt

echo "Recolectando archivos estáticos..."
python manage.py collectstatic --no-input

echo "Aplicando migraciones..."
python manage.py migrate

echo "Build completado!"