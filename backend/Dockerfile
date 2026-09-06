# Order.pk API — build with tsc, run the compiled output.
#
# Written for a long-running container (Dokploy/VPS). The Vercel deployment
# imports `app` and owns the HTTP layer instead; server.ts only calls listen
# when VERCEL !== '1', so the same source serves both.

FROM node:22-slim AS build
WORKDIR /app

# Prisma's engines are linked against OpenSSL. node:*-slim does not ship it, and
# the failure surfaces late — as a runtime error about a missing engine, not as
# a build error — so install it in both stages.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# schema.prisma has to be present before npm ci: `postinstall` runs
# `prisma generate`, which reads it.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production \
    PORT=5000

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# node_modules is copied rather than reinstalled so the Prisma client generated
# during the build — the one matching this schema — is the one that ships.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./

EXPOSE 5000
CMD ["node", "dist/src/server.js"]
