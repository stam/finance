import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Budget } from "../components/Budget";
import { BudgetSummaryStore } from "../store/BudgetSummary";

const Container = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

interface Props {
  store: BudgetSummaryStore;
}

export const Summary: React.FC<Props> = observer((props) => {
  const { store } = props;

  return (
    <Container>
      <p>Income: {store.income}</p>
      {store.budgetModels.map((budget, i) => (
        <Budget
          key={i}
          category={budget.name}
          total={budget.total}
          current={budget.current}
        />
      ))}
      <p>Total uncategorized: {store.uncategorisedCount}</p>
      <p>
        Remainder:
        {store.remainder}
      </p>
      <p>
        Of which already saved:
        {store.alreadySaved}
      </p>
    </Container>
  );
});
