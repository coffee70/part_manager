# Move package dependencies to root of the project
FROM node:18-alpine as base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package.json ./
EXPOSE 3000

# Development
# Copy the rest of the files and run the development server
FROM base as dev
ENV NODE_ENV=development
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]