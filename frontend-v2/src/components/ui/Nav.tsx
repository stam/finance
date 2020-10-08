import React from "react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

import viewStore from "../../store/View";

const Container = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  justify-content: space-between;
  background: white;
  border-radius: 4px 4px 0 0;

  > * {
    border-right: 1px solid #ddd;
    flex: 1;
    text-align: center;
    color: #999;

    &.active {
      color: var(--main);
    }

    &:hover {
      color: #666;
    }
  }
`;

const LinkButton = styled.button`
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
      <NavLink to="/" activeClassName="active" exact>
        <i className="material-icons">home</i>
      </NavLink>
      <NavLink to="/list" activeClassName="active">
        <i className="material-icons">view_list</i>
      </NavLink>
      <LinkButton type="button" onClick={viewStore.performLogout}>
        <i className="material-icons">exit_to_app</i>
      </LinkButton>
    </Container>
  );
});
