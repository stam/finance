import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { CategoryIcon, CategoryType } from "./CategoryIcon";

const Container = styled.div`
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 3rem auto 4rem;
`;

const Amount = styled.p`
  text-align: right;
`;

// const CategoryIcon = styled.span``;

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
