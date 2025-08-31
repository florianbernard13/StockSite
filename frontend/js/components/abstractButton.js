export default class AbstractButton {
    constructor(buttonId, options = {}) {
        this.button = document.getElementById(buttonId);
        if (!this.button) return;

        this.options = {
            mutuallyExclusive: false,
            mutuallyExclusiveGroup: null,
            delegateActivation: null, // Fonction optionnelle
            ...options,
        };

        if (this.options.mutuallyExclusive) {
            this.setupMutuallyExclusive();
        }

        // Vérification de la délégation : Si non nul et non fonction, on lance une erreur
        if (this.options.delegateActivation !== null && typeof this.options.delegateActivation !== 'function') {
            throw new Error("delegateActivation doit être une fonction si elle est définie.");
        }
        
        this.button.addEventListener("click", () => {
            this.onClick(this);
        });
    }

    setupMutuallyExclusive() {
        if (!this.options.mutuallyExclusiveGroup) {
            throw new Error("Un bouton mutuellement exclusif doit avoir un groupe.");
        }
        this.options.delegateActivation = (button) => {
            this.options.mutuallyExclusiveGroup.activateButton(button);
        };
        this.options.mutuallyExclusiveGroup.registerButton(this);
    }

    onClick() {
        // Si delegateActivation est une fonction, on l'appelle
        if (typeof this.options.delegateActivation === 'function') {
            this.options.delegateActivation(this); 
        } else {
            this.toggleState(); // Sinon, on fait simplement un toggle
        }
    }

    toggleState() {
        if (this.isActive()) {
            this.onDeactivate();
        } else {
            this.onActivate();
        }
        this.button.classList.toggle("active");
        this.button.classList.toggle("inactive");
    }

    isActive() {
        return this.button.classList.contains("active");
    }

    onActivate() {
        throw new Error("La méthode 'onActivate' doit être implémentée.");
    }

    onDeactivate() {
        throw new Error("La méthode 'onDeactivate' doit être implémentée.");
    }
}