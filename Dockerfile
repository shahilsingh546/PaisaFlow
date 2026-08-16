FROM node:20.12.0

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json turbo.json tsconfig.json ./

COPY apps ./apps

COPY packages ./packages

RUN npm ci

RUN npm run db:generate

RUN npm run build

CMD ["npm", "run", "start-user-app"]
