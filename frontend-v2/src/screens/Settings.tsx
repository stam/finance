import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { DndProvider } from "react-dnd";
import styled from "styled-components";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Header } from "../components/Header";
import { MonthSelect } from "../components/MonthSelect";
import { Nav } from "../components/Nav";
import { BudgetEdit, BudgetContainer } from "../components/BudgetEdit";
import { BudgetStore, Budget } from "../store/Budget";
import { CategoryStore, Category } from "../store/Category";
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

const ButtonContainer = styled.div`
  padding: 0 1rem;
  text-align: right;

  > button {
    margin-left: 1rem;
  }
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

  const handleCategoryAdd = useCallback(
    (budget: Budget, categoryId: string) => {
      const targetCategory = categoryStore.get(categoryId) as Category;

      // @ts-ignore
      budget.categories.add(targetCategory.toJS());
    },
    [categoryStore]
  );

  const handleUnAssignCategory = useCallback(
    (categoryId: string) => {
      let targetBudget: Budget | undefined;

      budgetStore.models.forEach((b) => {
        // @ts-ignore
        const categories = b.categories;
        categories.forEach((c: Category) => {
          if (c.id === categoryId) {
            targetBudget = b;
          }
        });
      });
      if (targetBudget) {
        // @ts-ignore
        targetBudget.categories.removeById(categoryId);
      }
    },
    [budgetStore]
  );

  const handleButtonAdd = useCallback(() => {
    console.log("add budget");
    budgetStore.add({ name: "New budget" });
  }, [budgetStore]);

  const handleSave = useCallback(() => {
    console.log("save");
  }, [budgetStore]);

  const handleBudgetDelete = useCallback(
    (budget: Budget) => {
      budgetStore.remove(budget);
    },
    [budgetStore]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const usedCategoryIds: string[] = [];
  budgetStore.models.forEach((b) => {
    // @ts-ignore
    const categories = b.categories;
    categories.forEach((c: Category) => {
      usedCategoryIds.push(c.id);
    });
  });

  const availableCategories = categoryStore.models.filter(
    (c) => !usedCategoryIds.includes(c.id)
  );

  return (
    <Container>
      <Header>
        Settings
        <MonthSelect />
      </Header>
      <DndProvider backend={HTML5Backend}>
        <Overview>
          {budgetStore.models.map((budget) => (
            <BudgetEdit
              key={budget.id}
              budget={budget}
              onDrop={handleCategoryAdd}
              onDelete={handleBudgetDelete}
            />
          ))}
          <BudgetContainer
            categories={availableCategories}
            onDrop={handleUnAssignCategory}
          >
            Uncategorized
          </BudgetContainer>
          <ButtonContainer>
            <Button onClick={handleButtonAdd}>Add budget</Button>
            <Button onClick={handleSave}>Save</Button>
          </ButtonContainer>
        </Overview>
      </DndProvider>
      <Nav />
    </Container>
  );
});
