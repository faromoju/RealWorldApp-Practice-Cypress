FROM cypress/base:latest

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

RUN [ "npm", "run", "articleSite:QArun"]