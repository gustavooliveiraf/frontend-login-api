FROM node:10 AS app
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
ENV VUE_APP_HOST "http://54.173.27.60:8000"
RUN npm run build

FROM nginx
COPY --from=app /app/dist /usr/share/nginx/html
COPY --from=app /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
