import styled from "styled-components";

export const Header = styled.header`
  color: white;
  position: relative;
  display: flex;
  align-items: center;
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

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    &:after {
      transform: rotate(-4deg);
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    &:after {
      transform: rotate(-2deg);
    }
  }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    &:after {
      transform: rotate(-1deg);
    }
  }
`;
