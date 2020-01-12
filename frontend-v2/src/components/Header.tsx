import styled from "styled-components";

export const Header = styled.header`
  color: white;
  position: relative;
  background: var(--main);
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 1rem;

  &:after {
    content: " ";
    position: absolute;
    height: 10rem;
    top: 1rem;
    width: 200%;
    left: -50%;
    z-index: -1;
    display: block;
    background: var(--main);
    transform: rotate(-5deg);
  }
`;
