import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";

import { Budget } from "../store/Budget";
import { Category } from "../store/Category";
import { CategoryTag } from "./CategoryTag";
import { Button, LabeledInput } from "./ui";

const Container = styled.div`
  padding: 1.5rem 1rem;
  margin: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const InputRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  button {
    max-width: 10rem;
  }
`;

interface BudgetProps {
  budget: Budget;
  onDrop: (budget: Budget, id: number) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetEdit: React.FC<BudgetProps> = observer((props) => {
  const { budget, onDrop, onDelete } = props;

  const handleDrop = useCallback(
    (id: number) => {
      if (onDrop) {
        onDrop(budget, id);
      }
    },
    [budget, onDrop]
  );

  const handleRemove = useCallback(() => {
    if (
      budget.id > 0 &&
      window.confirm("Are you sure you want to delete this budget?")
    ) {
      budget.delete();
    }
    onDelete(budget);
  }, [onDelete, budget]);

  // @ts-ignore
  const categories: Category[] = budget.categories?.models || [];

  return (
    <BudgetContainer categories={categories} onDrop={handleDrop}>
      <InputRow>
        <LabeledInput
          label="Budget name"
          type="text"
          value={budget.name}
          onChange={(e) => {
            budget.name = e.target.value;
          }}
        />
        <LabeledInput
          label="Budget amount (€)"
          type="number"
          value={budget.amount / 100}
          onChange={(e) => {
            budget.amount = parseInt(e.target.value) * 100;
          }}
        />
        <Button inline onClick={handleRemove}>
          X
        </Button>
      </InputRow>
    </BudgetContainer>
  );
});

interface CategoryTagProps {
  category: Category;
}
export const DraggableCategoryTag: React.FC<CategoryTagProps> = (props) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: "category", id: props.category.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div ref={drag}>
      <CategoryTag
        category={props.category}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      />
    </div>
  );
};

interface BudgetContainerProps {
  categories: Category[];
  onDrop?: (id: number) => void;
}

export const BudgetContainer: React.FC<BudgetContainerProps> = observer(
  (props) => {
    const dropProps = useDrop({
      accept: "category",
      drop: (droppedItem: any) => {
        if (props.onDrop) {
          props.onDrop(droppedItem.id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });
    const { categories, children } = props;
    return (
      <Container ref={dropProps[1]}>
        {children}
        {!categories.length && <p>No categories</p>}
        <CategoryContainer>
          {categories.map((category) => (
            <DraggableCategoryTag key={category.id} category={category} />
          ))}
        </CategoryContainer>
      </Container>
    );
  }
);
