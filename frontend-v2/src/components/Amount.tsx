import React from "react";
import styled from "styled-components";

const Container = styled.p`
  text-align: right;

  > span {
    font-size: 0.7rem;
  }
`;

interface Props {
  children: number;
}

export const Amount: React.FC<Props> = props => {
  const { children: value } = props;
  const [amount, cents] = (value / 100).toFixed(2).split(".");
  return (
    <Container>
      {amount}.<span>{cents}</span>
    </Container>
  );
};
