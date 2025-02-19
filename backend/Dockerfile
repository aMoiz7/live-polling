# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /dist

# Copy package.json and package-lock.json first (optimizes caching)
COPY package*.json ./

# Install dependencies (only production dependencies if needed)
RUN npm install --only=production

# Copy the entire application code
COPY . .

# Set environment variables
ENV DATABASE_URL="postgresql://neondb_owner:npg_iVJYQjDf1Bc2@ep-little-base-a8o3m5rl-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"

# Generate Prisma Client
RUN npx prisma generate

# Run Prisma Migrations
RUN npx prisma migrate deploy

# Expose the port your app runs on
EXPOSE 8000

# Start the application (Fix: Corrected npm command)
CMD ["npm", "run", "dev"]
