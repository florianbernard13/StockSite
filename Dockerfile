FROM python:3.11-slim

ARG DEBIAN_FRONTEND=noninteractive

# Installer Java, outils système et Node.js LTS
RUN apt-get update && apt-get install -y \
    default-jdk \
    ca-certificates \
    openssl \
    libssl-dev \
    curl \
    jq \
    wget \
    unzip \
    curl gnupg lsb-release ca-certificates build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Installer SonarScanner
RUN SONAR_SCANNER_VERSION=$(curl -s https://api.github.com/repos/SonarSource/sonar-scanner-cli/releases/latest | jq -r .tag_name) && \
    wget -O sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip && \
    unzip sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip -d /opt && \
    ln -s /opt/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip

# Répertoire de travail
WORKDIR /app

# Copier dépendances Python et installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier package.json et installer dépendances npm
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Build front avec Vite pour production
# RUN npm run build

# Exposer port Flask
EXPOSE 5000
EXPOSE 5173

ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Lancer Flask
CMD ["sh", "-c", "npm run dev & flask run --host=0.0.0.0 --reload --debugger"]
