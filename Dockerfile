FROM python:3.11-slim

ARG DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20

# Installer outils système et Node.js
RUN apt-get update && apt-get install -y \
    default-jdk \
    ca-certificates \
    openssl \
    libssl-dev \
    curl \
    jq \
    wget \
    unzip \
    gnupg lsb-release build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Installer SonarScanner (inchangé)
RUN SONAR_SCANNER_VERSION=$(curl -s https://api.github.com/repos/SonarSource/sonar-scanner-cli/releases/latest | jq -r .tag_name) && \
    wget -O sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip && \
    unzip sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip -d /opt && \
    ln -s /opt/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip

# Répertoire cache node_modules
RUN mkdir -p /usr/src/cache
WORKDIR /usr/src/cache

COPY package.json package-lock.json* ./
RUN npm install

# Répertoire de travail réel
RUN mkdir -p /app
WORKDIR /app

# Installer Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le reste du code
COPY . .

# Ajouter entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 5000 5173
