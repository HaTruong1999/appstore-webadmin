FROM node:14-alpine as builder
WORKDIR /app
COPY package.json ./
#RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
#RUN npm i && mkdir /app && cp -R ./node_modules ./app
RUN npm install
COPY . .
RUN $(npm bin)/ng build --prod --build-optimizer
#RUN npm run build --prod --configuration="production" --build-optimizer --nomaps

FROM nginx:1.19.2-alpine
## Removes the default nginx html files
RUN rm -rf /usr/share/nginx/html/*
RUN rm -f /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/default.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html
RUN /bin/sh -c "apk add --no-cache bash"
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
