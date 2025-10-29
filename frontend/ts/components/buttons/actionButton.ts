import AbstractButton from './buttons/abstractButton';
import { AbstractButtonOptions } from '../types';

type Callback = (button: AbstractButton) => void;

export class BaseButton extends AbstractButton {
  private activateCallbacks: Callback[] = [];
  private deactivateCallbacks: Callback[] = [];

  constructor(buttonId: string, options: AbstractButtonOptions = {}) {
    super(buttonId, options);
  }

  public onActivateDo(callback: Callback): this {
    this.activateCallbacks.push(callback);
    return this;
  }

  /** Ajouter un callback à la désactivation */
  public onDeactivateDo(callback: Callback): this {
    this.deactivateCallbacks.push(callback);
    return this;
  }

  /** Ajouter ou modifier dynamiquement des options */
  public withOptions(options: Partial<AbstractButtonOptions>): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  protected onActivate(): void {
    this.activateCallbacks.forEach(cb => cb(this));
  }

  protected onDeactivate(): void {
    this.deactivateCallbacks.forEach(cb => cb(this));
  }
}
