import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  background: var(--shade);
  padding: 1rem;
  justify-content: space-between;
`;

interface NavProps {
  // category: string;
  // total: number;
  // current: number;
}

export const Nav: React.FC<NavProps> = observer(props => {
  return (
    <Container>
      <Link to="/">home</Link>
      <Link to="/list">list</Link>
    </Container>
  );
});
