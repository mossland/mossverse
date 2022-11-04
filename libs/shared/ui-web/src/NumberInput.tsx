import { Types } from "libs/shared/ui-web/src";
import { StyledNumberInput } from "./styles";

export const NumberInput = <T,>(props: Types.UiWebNumberInputProps & T) => {
  return (
    <StyledNumberInput.Container
      {...props}
      onChange={(e) => props.onChangeCallback(parseInt(e.target.value))}
      ref={null}
    >
      {props.children}
    </StyledNumberInput.Container>
  );
};
