# Image Configuration
FROM node:12.16.0-alpine3.9

# Environment Provisioning
EXPOSE 3000/tcp
WORKDIR /var/node
RUN npm install -g @vue/cli serve

# Application Provisioning
COPY ./application /var/node
RUN npm install && npm run build
CMD ["serve", "/var/node/dist", "-l", "3000"]