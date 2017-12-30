FROM python:3.5-alpine
ENV PYTHONUNBUFFERED 1
RUN mkdir /backend
WORKDIR /backend
ADD packages.pip /backend/
# Alpine builds are super small. As a meh side-effect,
# we'll need to manually install some packages
RUN apk add --update bash git gcc jpeg-dev musl-dev postgresql-dev && rm -rf /var/cache/apk/*
RUN pip install -r packages.pip
ADD . /backend/
