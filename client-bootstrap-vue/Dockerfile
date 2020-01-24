FROM node:12.14.1-alpine3.9

EXPOSE 3000
WORKDIR /var/node

RUN npm install -g @vue/cli serve

#COPY application /var/node
#RUN npm install --production && npm run build
#CMD ["serve", "/var/node/dist", "-l", "3000"]

CMD ["npm","run","serve", "--", "--port", "3000"]