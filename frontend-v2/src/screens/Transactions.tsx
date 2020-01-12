import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Header } from "../components/Header";
import { Transaction } from "../components/Transaction";
import { Nav } from "../components/Nav";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
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
        <Transaction amount={-392} title="DUO Hoofdrekening" category="Bills" />
        <Transaction amount={-999} title="SPOTIFY" category="Bills" />
        <Transaction amount={211142} title="VANBERLO BV" category="Work" />
      </Overview>
      <Nav />
    </Container>
  );
});
