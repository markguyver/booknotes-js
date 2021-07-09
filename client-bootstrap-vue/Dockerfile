# Image Configuration
FROM node:14.17.1-alpine3.13

# Environment Provisioning
EXPOSE 3000/tcp
WORKDIR /var/node
RUN npm install -g @vue/cli serve

# Application Environment Configuration
ARG API_HOST=localhost
ENV VUE_APP_API_HOST=$API_HOST

# Application Provisioning
COPY ./application /var/node
RUN npm install --omit=dev && npm run build
CMD ["serve", "/var/node/dist", "-l", "3000"]