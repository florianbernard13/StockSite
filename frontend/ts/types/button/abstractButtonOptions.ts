import MutuallyExclusiveButtonGroup from "../../components/mutuallyExclusiveButtonGroup";
import AbstractButton from "../../components/buttons/abstractButton";

export interface AbstractButtonOptions {
    mutuallyExclusive?: boolean;
    mutuallyExclusiveGroup?: MutuallyExclusiveButtonGroup | null;
    delegateActivation?: ((button: AbstractButton) => void) | null;
}