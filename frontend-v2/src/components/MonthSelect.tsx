import React, { useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react-lite";

const Container = styled.div`
  display: flex;
  margin-left: auto;

  p {
    width: 80px;
    text-align: center;
    font-size: 1rem;
    font-weight: normal;
    margin: 0;
  }
`;

const InlineButton = styled.button`
  cursor: pointer;
  color: inherit;
  font-weight: bold;
  background: none;
  border: none;
  outline: none;
`;

export class SelectedMonthStore {
  @observable date: string = moment().format("YYYY-MM-DD");
  @observable foo = 1;

  @computed get readableMonth() {
    const d = moment(this.date);
    if (d.year() === moment().year()) {
      return d.format("MMMM");
    }
    return d.format("MMM YYYY");
  }

  @computed get startOfMonth(): string {
    const d = moment(this.date);
    return d.startOf("month").format("YYYY-MM-DD");
  }

  @computed get endOfMonth(): string {
    const d = moment(this.date);
    return d.endOf("month").format("YYYY-MM-DD");
  }

  @action.bound previous() {
    const d = moment(this.date);

    this.date = d.subtract(1, "month").format("YYYY-MM-DD");
  }

  @action.bound next() {
    const d = moment(this.date);
    this.date = d.add(1, "month").format("YYYY-MM-DD");
  }
}

export const SelectedMonthContext = React.createContext(
  new SelectedMonthStore()
);

export const MonthSelect = observer(() => {
  const selectedMonthStore = useContext(SelectedMonthContext);

  return (
    <Container>
      <InlineButton type="button" onClick={selectedMonthStore.previous}>
        &lt;
      </InlineButton>
      <p>{selectedMonthStore.readableMonth}</p>
      <InlineButton type="button" onClick={selectedMonthStore.next}>
        &gt;
      </InlineButton>
    </Container>
  );
});
