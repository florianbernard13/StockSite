import AbstractButton from '../buttons/abstractButton';

export class AnalyzeButton extends AbstractButton {
  protected onActivate(): void {
    this.button.classList.add("btn-lock");
    console.log("Analyse lancée");
    this.button.disabled = true; // bloquer le clic
  }

  protected onDeactivate(): void {
    this.button.classList.remove("btn-lock");
    this.button.disabled = false;
  }
}