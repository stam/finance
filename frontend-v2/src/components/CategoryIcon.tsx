import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import * as Icon from "../icons";

const Container = styled.div`
  display: flex;
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
`;

export type CategoryType = keyof typeof Icon;

interface Props {
  type: CategoryType | null;
}

export const CategoryIcon: React.FC<Props> = observer(props => {
  if (!props.type) {
    return <Container>?</Container>;
  }
  const TargetIcon = Icon[props.type];
  return (
    <Container>
      <TargetIcon />
    </Container>
  );
});
