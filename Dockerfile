# Dockerfile
FROM python:3.11-slim

# Éviter les prompts interactifs
ARG DEBIAN_FRONTEND=noninteractive

# Installer Java, outils et dépendances système
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    ca-certificates \
    openssl \
    libssl-dev \
    curl \
    jq \
    wget \
    unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Télécharger et installer SonarScanner
RUN SONAR_SCANNER_VERSION=$(curl -s https://api.github.com/repos/SonarSource/sonar-scanner-cli/releases/latest | jq -r .tag_name) && \
    wget -O sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip && \
    unzip sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip -d /opt && \
    ln -s /opt/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip

# Définir le répertoire de travail
WORKDIR /app

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code
COPY . .

# Exposer le port Flask
EXPOSE 5000

# Config Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Lancer l’application Flask
CMD ["flask", "run", "--host=0.0.0.0", "--reload"]