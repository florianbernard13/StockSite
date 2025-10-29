import AbstractButton from "../buttons/abstractButton";

export class InfiniteBarLoader {
  private buttonObj: AbstractButton;
  private buttonElement: HTMLElement;

  constructor(buttonObj: AbstractButton) {
    if (!buttonObj) {
      throw new Error("InfiniteBarLoader: buttonObj cannot be null or undefined.");
    }

    if (!buttonObj.button) {
      throw new Error("InfiniteBarLoader: buttonObj.button is missing or invalid.");
    }

    this.buttonObj = buttonObj;
    this.buttonElement = buttonObj.button;

    this.init();
  }

  private init(): void {
    this.buttonElement.addEventListener("click", (e) => this.handleClick(e));
  }

  private async handleClick(e: Event): Promise<void> {
    // const button = this.buttonElement;

    // if (button.classList.contains("btn-lock")) return;

    // try {
    //   button.classList.add("btn-lock");

    //   if (!button.querySelector(".bar-infinite-loader")) {
    //     const loader = document.createElement("div");
    //     loader.classList.add("bar-infinite-loader");
    //     button.appendChild(loader);
    //   }

    //   // Action réelle du bouton (abstraite)
    //   await this.buttonObj.handleAction();

    // } catch (err) {
    //   console.error("Erreur dans InfiniteBarLoader:", err);
    // } finally {
    //   button.classList.remove("btn-lock");
    //   const loader = button.querySelector(".bar-infinite-loader");
    //   if (loader) loader.remove();
    // }
  }
}
