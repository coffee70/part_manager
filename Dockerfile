# Move package dependencies to root of the project
FROM node:18-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
ENV NODE_ENV development

COPY package.json ./

RUN npm install

RUN mkdir -p .next
RUN chown -R node:node . node_modules .next

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]