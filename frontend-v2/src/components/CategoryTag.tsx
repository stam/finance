import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import * as Icon from "../icons";
import { Category } from "../store/Category";
const IconTypes = Object.keys(Icon);

interface ContainerProps {
  color?: string;
  compact?: boolean;
  active?: boolean;
}
const Container = styled.div<ContainerProps>`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  color: white;

  ${(props) =>
    props.compact
      ? `width: 2.5rem;`
      : `
      padding: 0 0.5rem;
      width: fit-content;
  `}
  height: 2.5rem;
  font-size: 1.2rem;
  background: ${(props) => props.color || "hotpink"};

  ${(props) => (props.active ? `font-weight: bold;` : "")}

  > svg {
    width: 24px;
    height: 24px;
  }

  > p {
    font-size: 1rem;
    margin-left: 0.5rem;
    padding-right: 0.25rem;
  }

  &:hover {
    font-weight: bold;
    opacity: 0.9;
  }
`;

export type CategoryType = keyof typeof Icon;

interface Props {
  category?: Category;
  compact?: boolean;
  active?: boolean;
  style?: any;
  onClick?: (e: React.MouseEvent) => void;
}

export const CategoryTag: React.FC<Props> = observer((props) => {
  const { category, ...otherProps } = props;

  const type = category?.type;
  if (!type || !IconTypes.includes(type)) {
    return (
      <Container color="#ccc" {...props}>
        ?
      </Container>
    );
  }
  const TargetIcon = Icon[type as CategoryType];

  return (
    <Container color={category?.color} {...otherProps}>
      <TargetIcon />
      {!otherProps.compact && <p>{category?.name}</p>}
    </Container>
  );
});
