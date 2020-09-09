import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { Header } from "../components/Header";
import { MonthSelect } from "../components/MonthSelect";
import { Nav } from "../components/Nav";
import { BudgetEdit, BudgetContainer } from "../components/BudgetEdit";
import { BudgetStore } from "../store/Budget";
import { CategoryStore } from "../store/Category";
import { Button } from "../components/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Overview = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

export const Settings: React.FC = observer(() => {
  const [budgetStore] = useState(
    new BudgetStore({
      relations: ["categories"],
      limit: 9999,
    })
  );
  const [categoryStore] = useState(new CategoryStore({ limit: 9999 }));

  const fetchData = useCallback(() => {
    budgetStore.fetch();
    categoryStore.fetch();
  }, [budgetStore, categoryStore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      <Header>
        Settings
        <MonthSelect />
      </Header>
      <Overview>
        {budgetStore.models.map((budget) => (
          <BudgetEdit key={budget.id} budget={budget} />
        ))}
        <BudgetContainer categories={categoryStore.models}>
          Uncategorized
        </BudgetContainer>
        <Button>Save</Button>
      </Overview>
      <Nav />
    </Container>
  );
});
