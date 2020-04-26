FROM node:latest

WORKDIR /app

COPY . /app

RUN npm install -g @vue/cli
RUN npm install vue-apexcharts
PUN npm install axios

CMD ["npm", "run", "serve"]