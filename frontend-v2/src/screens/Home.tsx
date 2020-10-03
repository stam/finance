import React, { useEffect, useState, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { Budget } from "../components/Budget";
import { Header, Button, Nav, Background, Modal } from "../components/ui";
import { BudgetSummaryStore } from "../store/BudgetSummary";
import { Balance } from "../store/Balance";
import { MonthSelect, SelectedMonthContext } from "../components/MonthSelect";
import { DataImportStore } from "../store/DataImport";

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

const SettingsContainer = styled.div`
  padding: 0 1rem;
  text-align: right;
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
          end_date: end,
        },
      });

      balance.fetchLatest();
    },
    [summaryStore, balance]
  );

  const refresh = useCallback(async () => {
    await dataImportStore.scrape();
    fetchData(selectedMonthStore.startOfPeriod, selectedMonthStore.endOfPeriod);
  }, [
    dataImportStore,
    fetchData,
    selectedMonthStore.startOfPeriod,
    selectedMonthStore.endOfPeriod,
  ]);

  useEffect(() => {
    fetchData(selectedMonthStore.startOfPeriod, selectedMonthStore.endOfPeriod);
  }, [
    fetchData,
    selectedMonthStore.startOfPeriod,
    selectedMonthStore.endOfPeriod,
  ]);

  return (
    <Background>
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
        <SettingsContainer>
          <Link to="/settings">Manage budgets</Link>
        </SettingsContainer>
      </BudgetOverview>
      {dataImportStore.loading && (
        <Modal>
          Fetching data...
          <br />
          Remember to check your ING app
        </Modal>
      )}
      <Nav />
    </Background>
  );
});
