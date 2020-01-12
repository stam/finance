import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { CategoryIcon, CategoryType } from "./CategoryIcon";
import { Amount } from "./Amount";

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
  category: CategoryType;
  amount: number;
  title: string;
}

export const Transaction: React.FC<TransactionProps> = observer(props => {
  const { category, amount, title } = props;
  return (
    <Container>
      <CategoryIcon type={category} />
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
});
