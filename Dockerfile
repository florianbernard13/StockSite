# Dockerfile
FROM python:3.11-slim

# Installer OpenJDK 17
RUN echo "deb http://deb.debian.org/debian buster main" >> /etc/apt/sources.list

# Mise à jour des paquets système (ca-certificates, openssl, libssl-dev)
RUN apt-get clean && apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    ca-certificates \
    openssl \
    libssl-dev \
    ca-certificates-java \
    openjdk-17-jdk \
    curl \
    jq \
    wget \
    unzip && \
    rm -rf /var/lib/apt/lists/*

# Télécharger et installer la dernière version stable de SonarScanner
RUN SONAR_SCANNER_VERSION=$(curl -s https://api.github.com/repos/SonarSource/sonar-scanner-cli/releases/latest | jq -r .tag_name) \
    && wget -O sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip \
    && unzip sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip -d /opt \
    && ln -s /opt/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner \
    && rm sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers utiles
COPY requirements.txt requirements.txt

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code
COPY . .

# Exposer le port Flask
EXPOSE 5000

# Lancer l'application Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1
CMD ["flask", "run", "--host=0.0.0.0", "--reload"]
