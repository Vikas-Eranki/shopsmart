# Stage 1: install all deps, prune to production-only, then copy into the runtime stage
FROM node:20-alpine AS builder

WORKDIR /build

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY src/ ./src/

# Remove dev dependencies before copying to the final image
RUN npm prune --production

# Stage 2: minimal runtime image running as a non-root user
FROM node:20-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /build/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /build/src        ./src
COPY --from=builder --chown=appuser:appgroup /build/package*.json ./

USER appuser

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "src/index.js"]