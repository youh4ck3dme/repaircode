FROM node:20-alpine
WORKDIR /app
# Copy package files
COPY server/package*.json ./server/
# Install dependencies in the server directory
WORKDIR /app/server
RUN npm install --omit=dev
# Copy the rest of the backend source code
COPY server/ .
EXPOSE 4000
# Run the entry point from the server directory
CMD ["node", "index.js"]
