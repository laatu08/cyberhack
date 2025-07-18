FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port (will be set by environment variable)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
