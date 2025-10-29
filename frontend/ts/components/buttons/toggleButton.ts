import AbstractButton from "./abstractButton";

export default class ToggleButton extends AbstractButton{
        constructor(buttonId: string) {
            super(buttonId);
        }

        protected onClick(_button: AbstractButton): void {
        if (typeof this.options.delegateActivation === 'function') {
            this.options.delegateActivation(this); 
        } else {
            this.toggleState();
        }
    }
}