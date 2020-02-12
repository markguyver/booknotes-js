# Image Configuration
FROM node:12.16.0-alpine3.9

# Environment Provisioning
EXPOSE 5000/tcp
WORKDIR /var/node
RUN npm install -g typescript nodemon pm2
CMD ["npm", "start"]

# Application Provisioning
COPY application /var/node
RUN npm install && npm run compile