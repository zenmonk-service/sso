FROM node:18.12-alpine3.16
ARG user=www-data
ARG group=www-data
ENV PROJECT_DIR=/app

# Set the working directory
WORKDIR $PROJECT_DIR

# Copy package.json and package-lock.json
COPY ./package*.json ./
# Install dependencies
RUN npm install ci --only=prod

# Copy the rest of the application code
COPY --chown=${group}:${user} . .

CMD ["npm", "run", "start"]
