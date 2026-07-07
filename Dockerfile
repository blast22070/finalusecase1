# Build Stage
FROM node:20-alpine AS build
 
WORKDIR /app
 
# Copy dependency configs
COPY package.json package-lock.json ./
 
# Install dependencies
RUN npm install
 
# Copy application source code
COPY . .
 
# Build production distribution
RUN npm run build
 
# Runner Stage
FROM nginx:alpine
 
# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html
 
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 8080
 
CMD ["nginx", "-g", "daemon off;"]
