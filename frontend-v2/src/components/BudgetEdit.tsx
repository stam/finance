import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Budget } from "../store/Budget";
import { CategoryStore } from "../store/Category";
import { Amount } from "./Amount";
import { Input } from "./Input";

const Container = styled.div`
  padding: 0.5rem 1rem 1rem;
  margin: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
  display: grid;

  grid-template-rows: auto auto;
  grid-row-gap: 0.25rem;

  > p {
    margin: 0;
    text-transform: capitalize;
  }
`;

// const CategoryIcon = styled.span``;

const Bar = styled.div`
  height: 2rem;
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: lightgrey;
`;

interface ProgressProps {
  overspent: boolean;
}
const Progress = styled.div<ProgressProps>`
  position: absolute;
  background: ${(props) => (props.overspent ? "var(--error)" : "var(--main)")};
  left: 0;
  top: 0;
  height: 100%;
`;

const ProgressText = styled.div`
  line-height: 2rem;
  position: absolute;
  display: flex;
  right: 1rem;
  margin: 0;
  color: white;

  > p {
    margin: 0;
  }
`;

interface BudgetProps {
  budget: Budget;
}

export const BudgetEdit: React.FC<BudgetProps> = observer((props) => {
  const { budget } = props;

  // @ts-ignore
  const categories: CategoryStore | undefined = budget.categories;

  // @ts-ignore
  console.log("budget cat", budget.categories.length);
  // const width = Math.min((current * 100) / total, 100);
  // const overspent = current > total;
  return (
    <Container>
      <p>{budget.name}</p>
      {!categories && <p>No categories</p>}
      {categories?.models.map((category) => (
        <p key={category.id}>{category.name}</p>
      ))}
      <Input type="number" value={budget.amount} onChange={() => {}} />
    </Container>
  );
});
