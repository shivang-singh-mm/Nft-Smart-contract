FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 5899
CMD npm run dev