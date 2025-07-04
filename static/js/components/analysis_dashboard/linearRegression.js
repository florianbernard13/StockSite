export default class AnalysisDashboardLinearRegression {
    constructor(endpoint = "/data_analyzers/lr_with_std_dev_analyzer/linear_regression_with_std_dev_batch") {
        this.endpoint = endpoint;
        this.bindEvents();
    }

    bindEvents() {
        const analyzeAllBtn = document.getElementById("analyze-all-btn");
        if (analyzeAllBtn) {
            analyzeAllBtn.addEventListener("click", () => this.analyzeAll());
        }
    }

    slugify(text) {
        return text.toLowerCase().replace(/[\.\/]/g, "-");
    }

    getBandColorClass(band) {
        switch (band) {
            case "between +2σ and +∞": return "sigma--green-dark";
            case "between +1σ and +2σ": return "sigma--green";
            case "between -1σ and +1σ": return "sigma--neutral";
            case "between -2σ and -1σ": return "sigma--red";
            case "between -∞ and -2σ": return "sigma--red-dark";
            default: return "sigma--unknown";
        }
    }

    async analyzeAll() {
        const tbody = document.querySelector(".stock-table tbody");
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="2" style="padding: 1rem;">Chargement des données…</td></tr>`;

        try {
            const response = await fetch(this.endpoint);
            const results = await response.json();

            // Trier : erreurs à la fin
            results.sort((a, b) => {
                const aErr = !!a.analysis?.error;
                const bErr = !!b.analysis?.error;
                return aErr === bErr ? 0 : aErr ? 1 : -1;
            });

            tbody.innerHTML = "";

            results.forEach(item => {
                const htmlId = this.slugify(item.symbol);
                const tr = document.createElement("tr");
                tr.id = `item-${htmlId}`;

                if (item.analysis?.error) {
                    tr.classList.add("error");
                    tr.innerHTML = `
                        <td><strong>${item.symbol}</strong> – ${item.name}</td>
                        <td class="sigma--error">Erreur : ${item.analysis.error}</td>
                    `;
                } else {
                    const { actual, predicted, last_date, band } = item.analysis;
                    const pctDiff = predicted !== 0 ? ((actual - predicted) / predicted) * 100 : null;
                    const pctText = pctDiff !== null ? `${pctDiff.toFixed(2)} %` : "n/a";

                    const colorClass = this.getBandColorClass(band);

                    tr.innerHTML = `
                        <td><strong>${item.symbol}</strong> – ${item.name}</td>
                        <td class="${colorClass}">
                          <span class="pct">${pctText}</span><br>
                        </td>
                    `;
                }

                tbody.appendChild(tr);
            });

        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="2" class="sigma--error">Erreur réseau lors du chargement.</td></tr>`;
        }
    }
}
