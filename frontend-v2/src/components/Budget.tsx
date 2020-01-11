import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

const Container = styled.div`
  padding: 0.5rem 1.5rem;
  display: grid;

  grid-template-columns: 2rem 1fr;
  grid-row-gap: 1rem;
`;

const CategoryIcon = styled.span``;

const Bar = styled.div`
  height: 2rem;
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: lightgrey;
`;

interface ProgressProps {
  overspent: boolean;
}
const Progress = styled.div<ProgressProps>`
  position: absolute;
  background: ${props => (props.overspent ? "red" : "green")};
  left: 0;
  top: 0;
  height: 100%;
`;

interface BudgetProps {
  category: string;
  total: number;
  current: number;
}

export const Budget: React.FC<BudgetProps> = observer(props => {
  const { current, total } = props;
  const width = Math.min((current * 100) / total, 100);
  const overspent = current > total;
  return (
    <Container>
      <CategoryIcon>🕹</CategoryIcon>
      <Bar>
        <Progress overspent={overspent} style={{ width: `${width}%` }} />
      </Bar>
    </Container>
  );
});
