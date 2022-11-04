import { Types } from "libs/shared/ui-web/src";
import { StyledText } from "./styles";

export const Text = <T,>(props: Types.UiWebTextProps & T) => {
  return (
    <StyledText.Container {...props} ref={null}>
      {props.children}
    </StyledText.Container>
  );
};
