FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN apt-get update
RUN apt-get install lsb-release
RUN  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

RUN apt-get update && apt-get install -y mongodb-org
RUN apt-get install -y clamav clamav-daemon
RUN dpkg-reconfigure clamav-daemon
RUN apt-get clean all

RUN mkdir -p  /data/db
COPY ./clamd.conf /etc/clamav/clamd.conf
RUN dpkg-reconfigure clamav-daemon
RUN freshclam

COPY . .
EXPOSE 5000
RUN npm run build
CMD mongod --fork --logpath /var/log/mongod.log; clamd; mongorestore --db CodeCloak CodeCloakDB;npm start