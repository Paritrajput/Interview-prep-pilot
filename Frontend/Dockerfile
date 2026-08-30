# Frontend/Dockerfile

# Base image (Node.js ka light version)
FROM node:20

# Container ke andar folder set karein
WORKDIR /app

# Dependencies install karne ke liye package.json copy karein
COPY package*.json ./
RUN npm install

# Baaki saara code copy karein
COPY . .

# Vite ka default port
EXPOSE 5173

# App start karne ka command
CMD ["npm", "run", "dev", "--", "--host"]