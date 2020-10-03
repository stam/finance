import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import styled from "styled-components";

import viewStore from "../../store/View";

const Container = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
`;

const LinkButton = styled.button`
  color: black;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  text-decoration: underline;
  font-size: 1rem;
`;

interface NavProps {
  // category: string;
  // total: number;
  // current: number;
}

export const Nav: React.FC<NavProps> = observer((props) => {
  return (
    <Container>
      <Link to="/">home</Link>
      <Link to="/list">list</Link>
      <LinkButton type="button" onClick={viewStore.performLogout}>
        logout
      </LinkButton>
    </Container>
  );
});
