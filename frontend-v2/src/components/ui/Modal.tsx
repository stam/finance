import React from "react";
import styled from "styled-components";

const ModalBackground = styled.div`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  z-index: 999;
  display: flex;
  justify-content: center;
`;

const ModalWindow = styled.div`
  position: absolute;
  width: 350px;
  top: 140px;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  margin: auto;
`;
interface Props {
  className?: string;
}
export const Modal: React.FC<Props> = (props) => {
  return (
    <ModalBackground className={props.className}>
      <ModalWindow>{props.children}</ModalWindow>
    </ModalBackground>
  );
};
