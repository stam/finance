import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Transaction } from "../components/Transaction";
import { Nav } from "../components/Nav";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const Header = styled.header`
  color: white;
  background: var(--main);
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 1rem;
`;

const Overview = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

export const Transactions: React.FC = observer(() => {
  return (
    <Container>
      <Header>Transactions</Header>
      <Overview>
        <Transaction amount={-392} title="DUO Hoofdrekening" category="care" />
        <Transaction amount={-999} title="SPOTIFY" category="fixed" />
        <Transaction amount={211142} title="VANBERLO BV" category="work" />
      </Overview>
      <Nav />
    </Container>
  );
});
