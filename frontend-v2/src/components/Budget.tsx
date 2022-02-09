import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Amount } from "./Amount";
import { BudgetSummary } from "../store/BudgetSummary";

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
  display: flex;
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: lightgrey;
`;

interface ProgressProps {
  background: string;
}
const Progress = styled.div<ProgressProps>`
  background: ${(props) => props.background};
  height: 100%;
  color: white;
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
  // const totalWidth = Math.min((budget.current * 100) / budget.total, 100);
  // const overspent = budget.current > budget.total;

  const overspentRatio = budget.current / budget.total;

  return (
    <Container>
      <p>{budget.name}</p>
      <Bar>
        {Object.values(budget.categories).map((categoryPart) => {
          const partOfTotal = categoryPart.current / budget.current;
          const normalizedPart = partOfTotal * overspentRatio;
          return (
            <Progress
              key={categoryPart.id}
              background={categoryPart.color}
              style={{ width: `${normalizedPart * 100}%` }}
            ></Progress>
          );
        })}
      </Bar>
    </Container>
  );
});
