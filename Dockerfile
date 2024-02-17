FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN cat /proc/cpuinfo | grep avx
RUN npm install
RUN apt-get update
RUN apt-get install lsb-release
RUN  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

RUN apt-get update && apt-get install -y mongodb-org
RUN apt-get install -y clamav clamav-daemon
RUN apt-get clean all
RUN freshclam
COPY . .

EXPOSE 5000
RUN npm run build
RUN mongod --fork
CMD ["npm", "start"]