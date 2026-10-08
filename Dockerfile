# Author: Meet Rajesh Popat
# Purpose: Containerizes the SWE 645 static web application and serves it using Nginx.

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY index.html survey.html error.html styles.css survey.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]