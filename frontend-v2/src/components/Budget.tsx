import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { sortBy } from "lodash";

import { BudgetSummary } from "../store/BudgetSummary";
import { CategoryIcon } from "./CategoryTag";
import { Amount } from "./Amount";

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

const Bar = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 2rem;
  border-radius: 4px;
  overflow: hidden;
  background: lightgrey;
`;

interface ProgressProps {
  background: string;
}
const Progress = styled.div<ProgressProps>`
  position: relative;
  background: ${(props) => props.background};
  height: 100%;
  color: white;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 6px;
    width: 18px;
  }

  > p {
    position: absolute;
    right: 6px;
  }
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
  budget: BudgetSummary;
}

export const GroupedBudget: React.FC<BudgetProps> = observer((props) => {
  const { budget } = props;
  const width = Math.min((budget.current * 100) / budget.total, 100);
  const overspent = budget.current > budget.total;
  return (
    <Container>
      <p>{budget.name}</p>
      <Bar>
        <Progress
          background={overspent ? "var(--error)" : "var(--main)"}
          style={{ width: `${width}%` }}
        />
        <ProgressText>
          <Amount>{budget.current}</Amount> / <Amount>{budget.total}</Amount>
        </ProgressText>
      </Bar>
    </Container>
  );
});

export const SplitBudget: React.FC<BudgetProps> = observer((props) => {
  const { budget } = props;

  const total = Math.max(budget.current, budget.total);
  const sortedCategories = sortBy(
    Object.values(budget.categories),
    (c) => -c.current
  );

  return (
    <Container>
      <p>{budget.name}</p>
      <Bar>
        {sortedCategories.map((part) => {
          const partOfTotal = part.current / total;
          const categoryType = part.icon || part.name;

          if (Number.isNaN(partOfTotal) || partOfTotal === 0) {
            return null;
          }
          return (
            <Progress
              key={part.id}
              background={part.color}
              style={{ width: `${partOfTotal * 100}%` }}
            >
              {partOfTotal > 0.1 && <CategoryIcon type={categoryType} />}
              {partOfTotal > 0.13 && <Amount>{part.current}</Amount>}
            </Progress>
          );
        })}
      </Bar>
    </Container>
  );
});
