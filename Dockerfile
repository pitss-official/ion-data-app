FROM node:14
WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN l
RUN npm run start
FROM node:14
WORKDIR /usr/src/app/
COPY --from=client /usr/app/client/build/ ./client/build/
RUN ls
WORKDIR /usr/src/app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "start"]
