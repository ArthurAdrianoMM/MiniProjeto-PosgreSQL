FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache openssl libc6-compat \
    && npm install

COPY . .

# Generate Prisma client (if schema exists) and build
RUN rm -rf dist \
    && npx prisma generate || true \
    && npm run build

EXPOSE 3000

CMD ["npm", "start"]
