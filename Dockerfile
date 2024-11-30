# Use the official Node.js 14 image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Ensure wait-for-it.sh is executable (if it's part of your source code)
RUN chmod +x ./wait-for-it.sh

# Build the application
RUN npm run build

# Expose the port your app runs on (if not already exposed)
EXPOSE 3000

# Use wait-for-it.sh to wait for the database before starting the app
CMD ["./wait-for-it.sh", "db_container:3306", "--", "npm", "start"]
