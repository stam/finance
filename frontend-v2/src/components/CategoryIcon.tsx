import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import * as Icon from "../icons";

const Container = styled.div`
  display: flex;
  align-items: center;
  color: #bbb;

  > svg {
    width: 2rem;
    height: 2rem;
  }
`;

export type CategoryType = keyof typeof Icon;

interface Props {
  type: CategoryType;
}

export const CategoryIcon: React.FC<Props> = observer(props => {
  const TargetIcon = Icon[props.type];
  return (
    <Container>
      <TargetIcon />
    </Container>
  );
});
