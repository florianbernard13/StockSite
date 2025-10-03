import AbstractButton from "./abstractButton";

export default class MutuallyExclusiveButtonGroup {
    private buttons: Set<AbstractButton> = new Set();

    registerButton(button: AbstractButton) {
        this.buttons.add(button);
    }

    activateButton(clickedButton: AbstractButton) {
        for (const button of this.buttons) {
            if (button !== clickedButton && button.isActive()) {
                button.toggleState();
            }
        }
        clickedButton.toggleState();
    }
}
