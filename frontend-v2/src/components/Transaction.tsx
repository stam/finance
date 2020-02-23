import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { CategoryIcon } from "./CategoryIcon";
import { Amount } from "./Amount";
import { Transaction } from "../store/Transaction";

const Container = styled.div`
  padding: 0.5rem 1rem;
  background: white;
  margin: 0.5rem 1rem;
  border-radius: 8px;
  display: grid;
  align-items: center;
  grid-column-gap: 0.5rem;
  grid-template-columns: 2.5rem auto 4rem;
`;

const Title = styled.p``;

interface TransactionProps {
  model: Transaction;
}

export const TransactionItem: React.FC<TransactionProps> = observer(props => {
  const { model } = props;

  return (
    <Container>
      <CategoryIcon type={model.categoryName} />
      <Title>{model.summary}</Title>
      <Amount>{model.amount}</Amount>
    </Container>
  );
});
