FROM node:lts-alpine

WORKDIR /var/node

RUN npm install -g typescript nodemon pm2

#COPY application /var/node
#RUN npm install --production

CMD ["npm", "start"]