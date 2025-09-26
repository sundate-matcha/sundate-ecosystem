FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm@10.15.0

WORKDIR /app

# Copy root package files for workspace setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy packages directory
COPY packages/ ./packages/

# Copy API app
COPY apps/api/ ./apps/api/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build the API
RUN pnpm run build --filter=api

EXPOSE 5001

# Start the API
CMD ["pnpm", "run", "start", "--filter=api"]