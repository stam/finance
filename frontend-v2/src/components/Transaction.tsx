import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { CategoryTag } from "./CategoryTag";
import { Amount } from "./Amount";
import { Transaction } from "../store/Transaction";
import { CategorySelect } from "./CategorySelect";

const Container = styled.div`
  padding: 0.5rem 1rem;
  background: white;
  margin: 0.5rem 1rem;
  border-radius: 8px;
  display: grid;
  align-items: center;
  grid-column-gap: 0.5rem;
  grid-template-columns: 2.5rem auto 4rem;
  border: 3px solid white;
  border-width: 1px 3px 3px 1px;
  cursor: ns-resize;

  &:hover {
    border-color: rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.p``;

const Description = styled.p`
  grid-column: 1 / -1;
`;

interface TransactionProps {
  model: Transaction;
}

export const TransactionItem: React.FC<TransactionProps> = observer((props) => {
  const { model } = props;
  const [active, setActive] = useState(false);
  const [expanded, expand] = useState(false);

  return (
    <Container onClick={() => expand(!expanded)}>
      <CategoryTag
        category={model.rCategory}
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
        }}
        compact
      />
      {active && (
        <CategorySelect model={model} close={() => setActive(false)} />
      )}
      <Title>{model.summary}</Title>
      <Amount>{model.amount}</Amount>
      {expanded && <Description>{model.details}</Description>}
    </Container>
  );
});
