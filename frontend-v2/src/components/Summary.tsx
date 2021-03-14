import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Budget } from "../components/Budget";
import { BudgetSummaryStore } from "../store/BudgetSummary";

const Container = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const Number = styled.div`
  &:first-of-type {
    margin-top: 2rem;
  }
  color: #737373;
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 2rem;
  width: fit-content;
  margin-left: auto;

  span {
    font-weight: normal;
    font-size: 1rem;
    margin-right: 0.5rem;
  }
`;

const WarningContainer = styled.div`
  text-align: right;
`;

const Warning = styled.div`
  display: inline-flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  margin: 0 1rem;
  margin-left: auto;
  margin-right: 1rem;
  padding: 0.5rem 1rem 1rem;

  i {
    margin-right: 0.5rem;
    color: red;
  }
`;

const toReadable = (amount: number) => `€${(amount / 100).toLocaleString()}`;

interface Props {
  store: BudgetSummaryStore;
}

export const Summary: React.FC<Props> = observer((props) => {
  const { store } = props;

  return (
    <Container>
      <Number>
        <span>Total earned: </span>
        {toReadable(store.income)}
      </Number>
      {store.uncategorisedCount > 0 && (
        <WarningContainer>
          <Warning>
            <i className="material-icons">warning</i>
            You have {store.uncategorisedCount} uncategorized transactions
          </Warning>
        </WarningContainer>
      )}
      {store.budgetModels.map((budget, i) => (
        <Budget
          key={i}
          category={budget.name}
          total={budget.total}
          current={budget.current}
        />
      ))}
      <Number>
        <span>Remainder: </span>
        {toReadable(store.remainder)}
      </Number>
      <Number>
        <span>Already saved: </span>
        {toReadable(store.alreadySaved)}
      </Number>
    </Container>
  );
});
