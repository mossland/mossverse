import { useEffect } from "react";
import { userStore, worldStore } from "../../stores";
import styled, { keyframes } from "styled-components";
import { Field } from "@shared/ui-web";
import { BiSubdirectoryLeft, BiX } from "react-icons/bi";

export const ProfileNameEditForm = () => {
  const self = userStore.use.self();
  const user = userStore.use.user();
  const me = worldStore.use.me();
  const nickname = userStore.use.nickname();
  const updateUser = userStore.use.update();

  useEffect(() => {
    userStore.setState({ nickname: me?.nickname });
  }, []);

  const submit = () => {
    if (!nickname) return;
    updateUser();
    userStore.setState({ nickname: nickname });
    worldStore.setState({ me: { ...me, nickname: nickname } });
    cloaseForm();
  };
  const cloaseForm = () => userStore.setState({ isProfileNameEdit: false });
  if (!user) return <></>;

  return (
    <StyledProfileNameEditForm>
      <Field.Text value={nickname} onChange={(nickname) => userStore.setState({ nickname })} />
      <div className="button submit-button" onClick={submit}>
        <BiSubdirectoryLeft />
      </div>
      <div className="button close-button" onClick={cloaseForm}>
        <BiX />
      </div>
    </StyledProfileNameEditForm>
  );
};

const StyledProfileNameEditForm = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;

  .ant-space {
    margin-top: 0;
    gap: 0;
  }
  .ant-input {
    border: 2px solid #000;
    border-radius: 4px;
  }

  .button {
    margin-top: 10px;
    border-radius: 4px;
    border: 2px solid #000;
    width: 34px;
    height: 34px;
    /* display: inline-block; */
    margin-left: 4px;
    margin-bottom: -6px;
    cursor: pointer;
    transition: all 0.5s;
    padding: 3px;
    svg {
      font-size: 24px;
    }
    &:hover {
      opacity: 0.6;
    }
  }

  .close-button {
    margin-top: 12px;
    border-width: 0px;
  }
`;
