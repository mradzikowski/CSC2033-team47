FROM python:3.9.5-slim-buster

# Setting working directory
WORKDIR /usr/src/app

# Environmental variables related to python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Installing system dependencies
RUN apt-get update \
  && apt-get -y install netcat gcc \
  && apt-get clean

# Installing dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD python manage.py run -h 0.0.0.0
RUN chmod +x /usr/src/app/entrypoint.sh
