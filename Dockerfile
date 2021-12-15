FROM node:17
COPY ./ /app
WORKDIR /app
RUN export NODE_OPTIONS=--openssl-legacy-provider && npm install && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
