#!/bin/sh

echo "Waiting for mongodb..."

while ! nc -z api_climate_db 27017; do
  sleep 0.1
done

echo "MONGODB started"

python manage.py run -h 0.0.0.0