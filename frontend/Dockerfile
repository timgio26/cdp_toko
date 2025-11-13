FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ARG VITE_AI_KEY
# ARG VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
# EXPOSE 80 nginx automaticaly expose 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html