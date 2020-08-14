# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM node:lts-alpine as build

ARG CYPRESS_CACHE_FOLDER
RUN mkdir -p /app/cypress/cache
COPY $CYPRESS_CACHE_FOLDER /app/cypress/cache
ENV CYPRESS_CACHE_FOLDER=/app/cypress/cache


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm config set registry http://host.docker.internal:8081/repository/npm-group/
RUN npm config set cache-min 86400
RUN npm config set fetch-retries 3
RUN npm config set fetch-retry-maxtimeout 90000
RUN npm config set fetch-retry-mintimeout 15000
RUN npm config set loglevel "warn"
RUN npm config set timeout "60000"
RUN npm config set strict-ssl false
RUN npm config list

RUN npm install -g @angular/cli@8.2.2

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli

# add app
COPY . /app

# run tests


# generate build
RUN ng build --output-path=dist --prod

############
### prod ###
############

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:stable-alpine

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# a custom NGINX configuration is needed in our setup to ensure that the built-in Angular routing module can be activated
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.template

# expose port 80
EXPOSE 80

# run nginx
CMD sh -c "envsubst \"`env | awk -F = '{printf \" \\\\$%s\", $1}'`\" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
