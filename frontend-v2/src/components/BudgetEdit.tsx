import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Budget } from "../store/Budget";
import { Category } from "../store/Category";
import { Input } from "./Input";

const Container = styled.div`
  padding: 1.5rem 1rem;
  margin: 0.5rem 1rem;
  background: white;
  border-radius: 8px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
`;

const CategoryContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
`;

const CategoryTag = styled.p`
  background: #eee;
  cursor: pointer;
  min-width: 4rem;
  margin: 1rem 0.5rem 0 0;
  padding: 0.5rem;
  border-radius: 4px;
`;

interface ProgressProps {
  overspent: boolean;
}

interface BudgetProps {
  budget: Budget;
}

export const BudgetEdit: React.FC<BudgetProps> = observer((props) => {
  const { budget } = props;

  // @ts-ignore
  const categories: Category[] = budget.categories?.models || [];

  return (
    <BudgetContainer categories={categories}>
      <Input type="text" value={budget.name} onChange={() => {}} />
      <Input type="number" value={budget.amount} onChange={() => {}} />
    </BudgetContainer>
  );
});

interface BudgetContainerProps {
  categories: Category[];
}

export const BudgetContainer: React.FC<BudgetContainerProps> = observer(
  (props) => {
    const { categories, children } = props;
    return (
      <Container>
        {children}
        {!categories.length && <p>No categories</p>}
        <CategoryContainer>
          {categories.map((category) => (
            <CategoryTag key={category.id}>{category.name}</CategoryTag>
          ))}
        </CategoryContainer>
      </Container>
    );
  }
);
