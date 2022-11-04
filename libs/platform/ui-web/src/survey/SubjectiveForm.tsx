import React from "react";
import styled from "styled-components";

type SubjectiveFormProps = {
  isVoted: boolean;
  answer: string | null;
  onChange: (value: string) => void | undefined;
};

export const SubjectiveForm = ({ answer, isVoted, onChange }: SubjectiveFormProps) => {
  return (
    <StyledSubjectiveForm>
      <textarea
        value={answer ?? ""}
        disabled={isVoted}
        placeholder="답변을 달아주세요."
        onChange={(e) => onChange(e.target.value as string)}
        className="subject-input"
      ></textarea>
    </StyledSubjectiveForm>
  );
};

const StyledSubjectiveForm = styled.div`
  margin-bottom: 30px;
  .subject-input {
    outline: none;
    width: 100%;
    resize: none;
    height: 369px;
    border-width: 0;
    border-width: 1px;
    border-radius: 6px;
    padding: 14px 13px;
    font-size: 16px;
    :disabled {
      background-color: #b8b8b8;
    }
  }
`;
