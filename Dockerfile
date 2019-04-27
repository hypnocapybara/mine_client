FROM node:8-alpine
ADD package.json /package.json
ADD yarn.lock /yarn.lock

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

RUN yarn
RUN mkdir -p /app
ADD . /app
WORKDIR /app
ENTRYPOINT ["yarn"]
