import { Types } from "libs/shared/ui-web/src";
import { StyledTitle } from "./styles";

export const Title = <T,>(props: Types.UiWebTextProps & T) => {
  return (
    <StyledTitle.Container {...props} ref={null}>
      {props.children}
    </StyledTitle.Container>
  );
};
