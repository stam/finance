import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Header } from "../components/Header";
import { TransactionItem } from "../components/Transaction";
import { Nav } from "../components/Nav";
import { TransactionStore } from "../store/Transaction";

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
  const [transactionStore] = useState(
    new TransactionStore({
      relations: ["category"]
    })
  );

  const fetchData = useCallback(() => {
    transactionStore.fetch();
  }, [transactionStore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      <Header>Transactions</Header>
      <Overview>
        {transactionStore.models.map(t => (
          <TransactionItem key={t.id} model={t} />
        ))}
      </Overview>
      <Nav />
    </Container>
  );
});
