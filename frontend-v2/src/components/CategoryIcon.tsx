import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import * as Icon from "../icons";
const IconTypes = Object.keys(Icon);

const Container = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.2rem;
  background: var(--main);

  > svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.9;
  }
`;

export type CategoryType = keyof typeof Icon;

interface Props {
  type: string | null;
  onClick?: (e: React.MouseEvent) => void;
}

export const CategoryIcon: React.FC<Props> = observer((props) => {
  if (!props.type || !IconTypes.includes(props.type)) {
    return <Container {...props}>?</Container>;
  }
  const TargetIcon = Icon[props.type as CategoryType];
  return (
    <Container {...props}>
      <TargetIcon />
    </Container>
  );
});
