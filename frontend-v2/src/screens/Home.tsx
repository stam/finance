import React, { useEffect, useState, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { Summary } from "../components/Summary";
import { Header, Button, Nav, Background, Modal } from "../components/ui";
import { BudgetSummaryStore } from "../store/BudgetSummary";
import { Balance } from "../store/Balance";
import { MonthSelect, SelectedMonthContext } from "../components/MonthSelect";
import { DataImportStore } from "../store/DataImport";

const Fund = styled.div`
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 2rem;
  display: flex;
  justify-content: space-between;
`;

const SettingsContainer = styled.div`
  padding: 1.5rem 1rem;
  text-align: right;
`;

const SyncButton = styled(Button)`
  transition: all 0.3s ease-out;
  i {
    font-size: 2rem;
  }
  &:hover {
    transform: rotate(180deg) translateY(3px);
  }
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
        {selectedMonthStore.isCurrent ? balance.displayAmount : <span />}
        <SyncButton onClick={refresh}>
          <i className="material-icons">refresh</i>
        </SyncButton>
      </Fund>
      <Summary store={summaryStore} />
      <SettingsContainer>
        <Link to="/settings">Manage budgets</Link>
      </SettingsContainer>
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
