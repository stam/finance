import React from "react";
import styled from "styled-components";

const BackgroundWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Background: React.FC = (props) => (
  <BackgroundWrapper>
    <Container>{props.children}</Container>
  </BackgroundWrapper>
);
