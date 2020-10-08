import styled from "styled-components";

interface ButtonProps {
  secondary?: boolean;
  inline?: boolean;
}
export const Button = styled.button<ButtonProps>`
  background: var(--main);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  display: flex;
  cursor: pointer;
  outline: none;
  color: white;
  font-size: 1rem;

  ${(props) => (props.secondary ? "background: var(--secondary);" : "")}
  ${(props) =>
    props.inline
      ? `
    background: none;
    color: inherit;
  `
      : ""}
`;
