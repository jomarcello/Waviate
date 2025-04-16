FROM node:18-slim
WORKDIR /app
RUN npm init -y && npm install express
COPY server.js /app/
EXPOSE 3000
CMD [ "node", "server.js" ]
