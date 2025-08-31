FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration files first
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./

# Copy package.json files for all apps and packages
COPY apps/docs/package.json ./apps/docs/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies (this will resolve workspace dependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/docs ./apps/docs

# Copy shared packages
COPY packages ./packages

# Verify the build environment
RUN ls -la apps/docs/
RUN ls -la packages/

# Build the Next.js application directly from the docs directory
RUN cd apps/docs && pnpm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
# USER nodejs

EXPOSE 3000

ENV NODE_ENV production

# Change to the docs app directory for runtime
WORKDIR /app/apps/docs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["pnpm", "start"]
