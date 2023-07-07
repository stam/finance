import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { DataImportStore } from "../store/DataImport";
import { Modal } from "./ui";

const Container = styled(Modal)`
  h2 {
    margin-top: -0.5rem;
  }

  ul {
    padding-left: 1rem;
  }

  li.error {
    list-style: none;

    span {
      position: absolute;
      margin-left: -1.75rem;
    }
  }

  div.close {
    cursor: pointer;
    font-weight: bold;
    padding: 0.5rem;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`;

interface Props {
  store: DataImportStore;
}

export const DataImportStatus: React.FC<Props> = observer((props) => {
  const { store } = props;

  const handleClick = () => {
    store.error = undefined;
  };

  if (!store.loading && !store.error) {
    return null;
  }

  return (
    <Container>
      <div className="close" onClick={handleClick}>
        x
      </div>
      <h2>Fetching data</h2>
      {store.scraperLog.length > 0 && (
        <ol>
          {store.scraperLog.map((logItem, i) => (
            <li key={i}>{logItem}</li>
          ))}
          {store.error && (
            <li className="error">
              <span role="img" aria-label="error">
                ❌
              </span>{" "}
              {store.error}
            </li>
          )}
        </ol>
      )}
    </Container>
  );
});
