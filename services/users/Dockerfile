FROM python:3.9

ENV DEBIAN_FRONTEND noninteractive
ENV GECKODRIVER_VER v0.29.0
ENV FIREFOX_VER 87.0

# Setting working directory
WORKDIR /usr/src/app

# Environmental variables related to python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update \
   && apt upgrade -y \
   && apt install -y \
       firefox-esr \
   && apt-get -y install netcat gcc postgresql

RUN curl -sSLO https://github.com/mozilla/geckodriver/releases/download/${GECKODRIVER_VER}/geckodriver-${GECKODRIVER_VER}-linux64.tar.gz \
   && tar zxf geckodriver-*.tar.gz \
   && mv geckodriver /usr/bin/

# Installing dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD python manage.py run -h 0.0.0.0
RUN chmod +x /usr/src/app/entrypoint.sh
