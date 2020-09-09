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

  const handleDrop = useCallback(
    (budget: Budget, categoryId: string) => {
      const targetCategory = categoryStore.get(categoryId) as Category;

      // @ts-ignore
      budget.categories.add(targetCategory.toJS());
    },
    [categoryStore]
  );

  const handleRemove = useCallback(
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
            <BudgetEdit key={budget.id} budget={budget} onDrop={handleDrop} />
          ))}
          <BudgetContainer
            categories={availableCategories}
            onDrop={handleRemove}
          >
            Uncategorized
          </BudgetContainer>
          <Button>Save</Button>
        </Overview>
      </DndProvider>
      <Nav />
    </Container>
  );
});
