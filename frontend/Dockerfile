# Use a lightweight Node.js image
FROM node:alpine AS builder

# Set working directory inside container
WORKDIR /app

# Set environment variables during the build process
ENV VITE_API_URL=http://localhost:8081

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx server to serve the built files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




# # this is for dev
# # Use a lightweight Node.js image
# FROM node:alpine AS builder

# # Set working directory inside container
# WORKDIR /app

# # Set environment variables during the build process
# ENV VITE_BACKEND_URL=https://localhost:8080


# # Copy package.json and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# EXPOSE 5173

# # Build the React app
# CMD ["npm", "run", "dev", "--", "--host"]
