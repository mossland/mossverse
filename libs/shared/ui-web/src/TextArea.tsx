import { Types } from "libs/shared/ui-web/src";
import { StyledTextArea } from "./styles";

export const TextArea = <T,>(props: Types.UiWebTextAreaProps & T) => {
  return (
    <StyledTextArea.Container {...props} onChange={(e) => props.onChangeCallback(e.target.value)} ref={null}>
      {props.children}
    </StyledTextArea.Container>
  );
};
