import React from "react";
import styled from "styled-components";
import { Transaction } from "../store/Transaction";
import viewStore from "../store/View";
import { Category } from "../store/Category";
import { CategoryTag } from "./CategoryTag";

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: brightness(80%) blur(2px);
`;

const Dialog = styled.div`
  position: absolute;
  width: 90%;
  max-width: 770px;
  padding: 1rem;
  border-radius: 8px;
  background: white;

  h3 {
    margin-top: 0;
  }
`;

const CategoryGrid = styled.div`
  > div {
    margin-bottom: 2px;

    &.active:after {
      content: "<"
      position: absolute;
    }
  }
`;

interface CategorySelectProps {
  model: Transaction;
  close: () => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = (props) => {
  const { close, model } = props;

  const selectCategory = (category: Category) => {
    // @ts-ignore
    model.category = category;
    model.save();
    close();
  };
  return (
    <Background
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <Dialog onClick={(e) => e.stopPropagation()}>
        <h3>Select category</h3>
        <p>{model.summary}</p>
        <CategoryGrid>
          {viewStore.categories.sortBy("name").map((category: Category) => (
            //    <CategoryIcon
            //    key={category.id}
            //    type={category.name as CategoryType}
            //  />

            <CategoryTag
              category={category}
              active={model.rCategory?.id === category.id}
              onClick={() => selectCategory(category)}
            />
            // <GridItem
            //   key={category.id}
            //   style={{ background: category.color }}
            // >
            //   {category.name}
            // </GridItem>
          ))}
        </CategoryGrid>
      </Dialog>
    </Background>
  );
};
