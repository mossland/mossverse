import { Types } from "libs/shared/ui-web/src";
import { StyledTextInput } from "./styles";

export const TextInput = <T,>(props: Types.UiWebTextInputProps & T) => {
  return (
    <StyledTextInput.Container {...props} onChange={(e) => props.onChangeCallback(e.target.value)} ref={null}>
      {props.children}
    </StyledTextInput.Container>
  );
};
