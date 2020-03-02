import React, { useEffect, useState, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Budget } from "../components/Budget";
import { Nav } from "../components/Nav";
import { BudgetSummaryStore } from "../store/BudgetSummary";
import { Balance } from "../store/Balance";
import { MonthSelect, SelectedMonthContext } from "../components/MonthSelect";
import { DataImportStore } from "../store/DataImport";

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
  display: flex;
  justify-content: space-between;
`;

export const Home: React.FC = observer(() => {
  const [dataImportStore] = useState(new DataImportStore());
  const [summaryStore] = useState(new BudgetSummaryStore());
  const [balance] = useState(new Balance());
  const selectedMonthStore = useContext(SelectedMonthContext);

  const fetchData = useCallback(
    (start: string, end: string) => {
      summaryStore.fetch({
        data: {
          start_date: start,
          end_date: end
        }
      });

      balance.fetchLatest();
    },
    [summaryStore, balance]
  );

  const refresh = useCallback(() => {
    dataImportStore.scrape();
  }, [dataImportStore]);

  useEffect(() => {
    fetchData(selectedMonthStore.startOfPeriod, selectedMonthStore.endOfPeriod);
  }, [
    fetchData,
    selectedMonthStore.startOfPeriod,
    selectedMonthStore.endOfPeriod
  ]);

  return (
    <Container>
      <Header>
        Home
        <MonthSelect />
      </Header>
      <Fund>
        {balance.displayAmount}
        <Button onClick={refresh}>Refresh</Button>
      </Fund>
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
