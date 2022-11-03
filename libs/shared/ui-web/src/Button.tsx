import { Types } from "libs/shared/ui-web/src";
import { StyledButton } from "./styles";

export const Button = <T,>(props: Types.UiWebButtonProps & T) => {
  return (
    <StyledButton.Container {...props} ref={null}>
      {props.children}
    </StyledButton.Container>
  );
};
