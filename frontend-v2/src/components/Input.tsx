import React from "react";
import styled from "styled-components";

export const Input = styled.input`
  background: var(--shade);
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;

  label {
    font-size: 0.75rem;
    color: var(--main);
  }
`;
interface LabeledInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = (props) => {
  const { label, ...otherProps } = props;
  return (
    <Container>
      <label>{props.label}</label>
      <Input {...otherProps} />
    </Container>
  );
};
