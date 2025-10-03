
export interface ToggleButton {
    isActive(): boolean;
    toggleState(originalButton: ToggleButton): void;
}
