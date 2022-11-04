import { Types } from "libs/shared/ui-web/src";
import { StyledWrapper } from "./styles";

export const Wrapper = <T,>(props: Types.UiWebDivProps & T) => {
  return (
    <StyledWrapper.Container {...props} ref={null}>
      {props.children}
    </StyledWrapper.Container>
  );
};
