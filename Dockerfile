FROM node:18

WORKDIR /app

COPY . .

RUN apt update && \
    apt install -y docker.io && \
    npm install

CMD ["node", "app.js"]
