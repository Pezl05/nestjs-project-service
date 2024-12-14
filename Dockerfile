# Build Stage
FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production && npm install -g @nestjs/cli
COPY . ./
RUN npm run build

# Final Stage (Production)
FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
