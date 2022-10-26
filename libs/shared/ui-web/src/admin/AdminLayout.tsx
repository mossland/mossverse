import styled from "styled-components";

interface Props {
  children?: JSX.Element[] | JSX.Element;
  isWide: boolean;
}

export const AdminLayout = ({ children, isWide }: Props) => {
  return (
    <AppContainer>
      <div className={isWide ? "" : "container"}>{children}</div>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  background: #f2f2f2;
  min-height: 100vh;
  overflow: hidden;
  display: block;
  position: relative;
  margin: 0 auto;

  .container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 576px) {
      max-width: 576px;
    }

    @media (min-width: 768px) {
      max-width: 768px;
    }

    @media (min-width: 992px) {
      max-width: 992px;
    }

    @media (min-width: 1200px) {
      max-width: 1200px;
    }
  }
`;
