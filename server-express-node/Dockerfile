# Image Configuration
FROM node:14.17.4-alpine3.14

# Environment Provisioning
EXPOSE 5000/tcp
WORKDIR /var/node
CMD ["npm", "start"]

# Application Provisioning
COPY application /var/node
RUN npm install --omit=dev && \
    npm run compile && \
    rm -r src