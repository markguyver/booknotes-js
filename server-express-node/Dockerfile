FROM node:12.14.1-alpine3.9

WORKDIR /var/node

RUN npm install -g typescript nodemon pm2

#COPY application /var/node
#RUN npm install --production

CMD ["npm", "start"]