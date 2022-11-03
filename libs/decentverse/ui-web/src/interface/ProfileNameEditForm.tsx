import { useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import styled, { keyframes } from "styled-components";
import { Field } from "@shared/ui-web";
import { BiSubdirectoryLeft, BiX } from "react-icons/bi";

export const ProfileNameEditForm = () => {
  const self = store.user.use.self();
  const user = store.user.use.user();
  const me = store.world.use.me();
  const nickname = store.user.use.nickname();
  const updateUser = store.user.use.update();

  useEffect(() => {
    store.user.setState({ nickname: me?.nickname });
  }, []);

  const submit = () => {
    if (!nickname) return;
    updateUser();
    store.user.setState({ nickname: nickname });
    store.world.setState({ me: { ...me, nickname: nickname } });
    cloaseForm();
  };
  const cloaseForm = () => store.user.setState({ isProfileNameEdit: false });
  if (!user) return <></>;

  return (
    <StyledProfileNameEditForm>
      <Field.Text value={nickname} onChange={(nickname) => store.user.setState({ nickname })} />
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
