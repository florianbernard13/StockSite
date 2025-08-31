export default class MutuallyExclusiveGroup {
    constructor() {
        this.buttons = new Set(); // Stocke les boutons du groupe
    }

    registerButton(button) {
        this.buttons.add(button);
    }

    activateButton(originallyClickedButton) {
        for (const button of this.buttons) {
            if (button !== originallyClickedButton && button.isActive()) {
                button.toggleState(originallyClickedButton);
            }
        }
        originallyClickedButton.toggleState(originallyClickedButton);
    }
}