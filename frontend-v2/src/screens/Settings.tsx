import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { DndProvider } from "react-dnd";
import styled from "styled-components";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Header, Nav, Button, Background } from "../components/ui";
import { MonthSelect } from "../components/MonthSelect";
import { BudgetEdit, BudgetContainer } from "../components/BudgetEdit";
import { BudgetStore, Budget } from "../store/Budget";
import { CategoryStore, Category } from "../store/Category";

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

  const handleUnAssignCategory = useCallback(
    (categoryId: number) => {
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

  const handleCategoryAdd = useCallback(
    (budget: Budget, categoryId: number) => {
      const targetCategory = categoryStore.get(categoryId) as Category;

      handleUnAssignCategory(categoryId);

      // @ts-ignore
      budget.categories.add(targetCategory.toJS());
    },
    [categoryStore, handleUnAssignCategory]
  );

  const handleButtonAdd = useCallback(() => {
    budgetStore.add({ name: "New budget" });
  }, [budgetStore]);

  const handleSave = useCallback(() => {
    // save all models
    budgetStore.models.map((b) =>
      b.saveAll({
        relations: ["categories"],
      })
    );
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

  const usedCategoryIds: number[] = [];
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
    <Background>
      <Header>
        Settings
        <MonthSelect />
      </Header>
      <DndProvider backend={HTML5Backend}>
        <Overview>
          {budgetStore.models.map((budget) => (
            <BudgetEdit
              key={budget.cid}
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
    </Background>
  );
});
