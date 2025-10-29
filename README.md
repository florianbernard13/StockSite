<header>
  <h1>Projet de Récupération et d'Analyse des Données Boursières</h1>
</header>

<section>
  <img src="https://img.shields.io/static/v1?label=&message=CODING%20PRACTICE&color=blue&logo=warning&style=for-the-badge" alt="Warning">
  <p><strong>ATTENTION :</strong> Les bonnes pratiques communes à tous mes projets Flask sont centralisées dans le fichier dédié :</p>
  <p><a href="https://github.com/florianbernard13/StockSite/blob/main/Good_Practices_Flask.md">Good Practices Flask</a></p>
</section>

---

<section>
  <h2>🧭 Description</h2>
  <p>
    Ce projet a pour objectif de récupérer et d'analyser des données boursières en temps réel.
    Il combine un backend Flask, un environnement Node.js pour la partie front (Vite + SCSS), et une analyse de la qualité du code via SonarQube.
  </p>
  <p>
    Les principales fonctionnalités incluent :
    <ul>
      <li>Récupération dynamique des données financières (ex. : <code>yFinance</code>).</li>
      <li>Analyse statistique et visualisation interactive.</li>
      <li>Simulation et rendu animé via <code>Chart.js</code>.</li>
      <li>Suivi qualité et couverture du code avec <strong>SonarQube</strong>.</li>
    </ul>
  </p>
</section>

---

<section>
  <h2>⚙️ Stack Technique</h2>
  <ul>
    <li><strong>Backend :</strong> Flask (Python 3.11)</li>
    <li><strong>Frontend :</strong> Vite + Node.js 20 + SCSS</li>
    <li><strong>Qualité du code :</strong> SonarQube + SonarScanner</li>
    <li><strong>Base de données :</strong> PostgreSQL (service SonarQube)</li>
    <li><strong>Containerisation :</strong> Docker & Docker Compose</li>
  </ul>
</section>

---

<section>
  <h2>📦 Installation (via Docker)</h2>

  <p>Clonez le dépôt :</p>
  <pre><code>git clone https://github.com/florianbernard13/StockSite.git
cd StockSite</code></pre>

  <p>Lancez l'environnement complet :</p>
  <pre><code>docker compose up --build</code></pre>

  <p>Les services suivants seront accessibles :</p>
  <ul>
    <li>🌐 Application Flask : <a href="http://localhost:5000">http://localhost:5000</a></li>
    <li>⚡ Interface Vite (frontend) : <a href="http://localhost:5173">http://localhost:5173</a></li>
    <li>📊 SonarQube : <a href="http://localhost:9000">http://localhost:9000</a> (login par défaut : <code>admin / admin</code>)</li>
  </ul>
</section>

---

<section>
  <h2>🧩 Structure du Projet</h2>
  <pre><code>.
├── app.py                # Point d’entrée Flask
├── entrypoint.sh         # Script de démarrage des services
├── Dockerfile
├── docker-compose.yml
├── requirements.txt       # Dépendances Python
├── package.json           # Dépendances Node.js
├── assets/
│   └── scss/              # Fichiers SCSS
├── components/
│   └── dataTools/
│       ├── DataAnalysisTools/
│       └── TimesTools/
└── Good_Practices_Flask.md
</code></pre>
</section>

---

<section>
  <h2>🚀 Commandes Utiles</h2>
  <ul>
    <li><code>docker compose build</code> — Reconstruit les images Docker.</li>
    <li><code>docker compose up</code> — Lance les services.</li>
    <li><code>docker compose down</code> — Stoppe et supprime les conteneurs.</li>
    <li><code>docker exec -it flask-app bash</code> — Ouvre un shell dans le conteneur Flask.</li>
    <li><code>sonar-scanner</code> — Analyse du code via SonarScanner (dans le conteneur).</li>
  </ul>
</section>

---

<section>
  <h2>📘 Bonnes Pratiques Flask</h2>
  <p>
    Les conventions de structure, d’organisation des blueprints, de gestion des tests et de configuration
    sont détaillées dans le fichier suivant :
  </p>
  <p><a href="Good_Practices_Flask.md">Good Practices Flask</a></p>
</section>

---

<footer>
  <p>&copy; 2025 Florian Bernard — Tous droits réservés.</p>
</footer>
