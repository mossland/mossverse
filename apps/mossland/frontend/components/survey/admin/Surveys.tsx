import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, List, Card, Popconfirm } from "antd";
import { Utils } from "@shared/util";
import { types } from "../../../store";
import { mocSurveyStore } from "../../../store/stores";

export const Surveys = () => {
  const adminInit = mocSurveyStore.use.adminInit();
  const mocSurveys = mocSurveyStore.use.mocSurveys();
  useEffect(() => {
    adminInit();
  }, []);

  return (
    <div>
      <Header>
        <h2>Surveys</h2>
        {/* <Button
          onClick={() => mocSurveyStore.setState({ ...types.defaultSurvey, modalOpen: true })}
          icon={<PlusOutlined />}
        >
          Add
        </Button> */}
      </Header>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={mocSurveys}
        renderItem={(survey) => <Survey key={survey.id} survey={survey} />}
      ></List>
      {/* <SurveyEdit /> */}
    </div>
  );
};

interface SurveyProps {
  survey: types.MocSurvey;
}

export const Survey = React.memo(({ survey }: SurveyProps) => {
  const openMocSurvey = mocSurveyStore.use.openMocSurvey();

  return (
    <Card hoverable title={survey.title} actions={[]}>
      <div>type: {survey.type}</div>
      {survey.type === "objective" ? (
        <div>
          {survey.selections.map((selection, index) => (
            <div key={index}>
              {index + 1}. {selection}
            </div>
          ))}
        </div>
      ) : (
        <div>{survey.description}</div>
      )}
      <hr />
      <div>openAt: {Utils.toIsoString(survey.openAt, true)}</div>
      <div>closeAt: {Utils.toIsoString(survey.closeAt, true)}</div>
      <div>createdAt: {Utils.toIsoString(survey.createdAt, true)}</div>
      <hr />
      <div>status: {survey.status}</div>
      {survey.status === "active" && (
        <Popconfirm
          title="Are you sure to open this survey?"
          onConfirm={() => openMocSurvey(survey.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button block>Open</Button>
        </Popconfirm>
      )}
    </Card>
  );
});

Survey.displayName = "Survey";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 60px 0 10px 0;
  h2 {
    font-size: 20px;
  }
`;
