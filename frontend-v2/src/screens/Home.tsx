import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Budget } from "../components/Budget";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const Header = styled.header`
  color: white;
  background: green;
  font-size: 1.25rem;
  padding: 1rem 1rem;
`;

const BudgetOverview = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const Fund = styled.div`
  padding: 1rem;
  font-size: 2rem;
`;

const Footer = styled.footer``;

export const Home: React.FC = observer(() => {
  return (
    <Container>
      <Header>Green sofa</Header>
      <Fund>€1,065.26</Fund>
      <BudgetOverview>
        <Budget category="groceries" total={300} current={50} />
        <Budget category="car" total={300} current={150} />
        <Budget category="recurring" total={830} current={900} />
      </BudgetOverview>
      <Footer></Footer>
    </Container>
  );
});
