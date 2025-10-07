import {AbstractButtonOptions} from "../types"

export default abstract class AbstractButton {

    protected button: HTMLElement | null;
    protected options: AbstractButtonOptions = {};

    constructor(buttonId: string, options: AbstractButtonOptions = {}) {
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

    private setupMutuallyExclusive(): void {
        if (!this.options.mutuallyExclusiveGroup) {
            throw new Error("Un bouton mutuellement exclusif doit avoir un groupe.");
        }
        this.options.delegateActivation = (button: AbstractButton) => {
            this.options.mutuallyExclusiveGroup!.activateButton(button);
        };
        this.options.mutuallyExclusiveGroup.registerButton(this);
    }

    protected onClick(_button: AbstractButton): void {
        // Si delegateActivation est une fonction, on l'appelle
        if (typeof this.options.delegateActivation === 'function') {
            this.options.delegateActivation(this); 
        } else {
            this.toggleState(); // Sinon, on fait simplement un toggle
        }
    }

    toggleState(_originallyClickedButton?: AbstractButton): void {
        if (!this.button) return;

        if (this.isActive()) {
            this.onDeactivate();
        } else {
            this.onActivate();
        }
        this.button.classList.toggle("active");
        this.button.classList.toggle("inactive");
    }

    isActive(): boolean {
        return this.button?.classList.contains("active") ?? false;
    }

    onActivate() {
        throw new Error("La méthode 'onActivate' doit être implémentée.");
    }

    onDeactivate() {
        throw new Error("La méthode 'onDeactivate' doit être implémentée.");
    }
}