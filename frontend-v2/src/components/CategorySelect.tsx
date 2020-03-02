import React from "react";
import styled from "styled-components";
import { Transaction } from "../store/Transaction";
import viewStore from "../store/View";
import { Category } from "../store/Category";

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
`;

const Dialog = styled.div`
  position: absolute;
  width: 80%;
  padding: 1rem;
  left: 10%;
  top: 20%;
  border-radius: 8px;
  background: white;

  h3 {
    margin-top: 0;
  }
`;

const CategoryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const GridItem = styled.p`
  cursor: pointer;
  margin: 0;
  padding: 0.5rem;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

interface CategorySelectProps {
  model: Transaction;
  close: () => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = props => {
  const { close, model } = props;

  const selectCategory = (category: Category) => {
    // @ts-ignore
    model.category = category;
    model.save();
    close();
  };
  return (
    <Background onClick={close}>
      <Dialog onClick={e => e.stopPropagation()}>
        <h3>Select category</h3>
        <p>{model.summary}</p>
        <CategoryGrid>
          {viewStore.categories.models.map(category => (
            //    <CategoryIcon
            //    key={category.id}
            //    type={category.name as CategoryType}
            //  />
            <GridItem
              key={category.id}
              onClick={() => selectCategory(category)}
            >
              {category.name}
            </GridItem>
          ))}
        </CategoryGrid>
      </Dialog>
    </Background>
  );
};
