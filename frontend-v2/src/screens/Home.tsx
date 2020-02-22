import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import styled from "styled-components";

import { Header } from "../components/Header";
import { Budget } from "../components/Budget";
import { Nav } from "../components/Nav";
import { BudgetSummaryStore } from "../store/BudgetSummary";
import { Balance } from "../store/Balance";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const BudgetOverview = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const Fund = styled.div`
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 2rem;
`;

export const Home: React.FC = observer(() => {
  const [date] = useState(moment());
  const [summaryStore] = useState(new BudgetSummaryStore());
  const [balance] = useState(new Balance());

  const fetchData = useCallback(() => {
    const startDate = date
      .clone()
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = date
      .clone()
      .endOf("month")
      .format("YYYY-MM-DD");
    summaryStore.fetch({
      data: {
        start_date: startDate,
        end_date: endDate
      }
    });

    balance.fetchLatest();
  }, [date, summaryStore, balance]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      <Header>Green sofa</Header>
      <Fund>{balance.displayAmount}</Fund>
      <BudgetOverview>
        {summaryStore.models.map((budget, i) => (
          <Budget
            key={i}
            category={budget.name}
            total={budget.total}
            current={budget.current}
          />
        ))}
      </BudgetOverview>
      <Nav />
    </Container>
  );
});
