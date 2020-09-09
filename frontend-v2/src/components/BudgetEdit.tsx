import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";

import { Budget } from "../store/Budget";
import { Category } from "../store/Category";
import { Input } from "./Input";
import { Button } from "./Button";

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

interface TagProps {
  transparent: boolean;
}
const CategoryTagContainer = styled.p<TagProps>`
  background: #eee;
  cursor: pointer;
  min-width: 4rem;
  margin: 1rem 0.5rem 0 0;
  padding: 0.5rem;
  border-radius: 4px;

  ${(props) => (props.transparent ? "opacity: 0;" : "")}
`;

interface BudgetProps {
  budget: Budget;
  onDrop: (budget: Budget, id: string) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetEdit: React.FC<BudgetProps> = observer((props) => {
  const { budget, onDrop, onDelete } = props;

  const handleDrop = useCallback(
    (id: string) => {
      if (onDrop) {
        onDrop(budget, id);
      }
    },
    [budget, onDrop]
  );

  const handleRemove = useCallback(() => {
    onDelete(budget);
  }, [budget]);

  // @ts-ignore
  const categories: Category[] = budget.categories?.models || [];

  return (
    <BudgetContainer categories={categories} onDrop={handleDrop}>
      <InputRow>
        <Input type="text" value={budget.name} onChange={() => {}} />
        <Input type="number" value={budget.amount} onChange={() => {}} />
        <Button onClick={handleRemove}>X</Button>
      </InputRow>
    </BudgetContainer>
  );
});

interface CategoryTagProps {
  id: string;
}
export const CategoryTag: React.FC<CategoryTagProps> = (props) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: "category", id: props.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <CategoryTagContainer ref={drag} transparent={isDragging}>
      {props.children}
    </CategoryTagContainer>
  );
};

interface BudgetContainerProps {
  categories: Category[];
  onDrop?: (id: string) => void;
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
            <CategoryTag key={category.id} id={category.id}>
              {category.name}
            </CategoryTag>
          ))}
        </CategoryContainer>
      </Container>
    );
  }
);
