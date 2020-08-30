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

const PERIOD_START_DATE = 1;

export class SelectedMonthStore {
  @observable date: string = moment().format("YYYY-MM-DD");

  @computed get readableMonth() {
    const d = moment(this.date);
    if (d.year() === moment().year()) {
      return d.format("MMMM");
    }
    return d.format("MMM YYYY");
  }

  @computed get monthOfPeriodStart(): number {
    const d = moment(this.date);
    if (d.get("date") >= PERIOD_START_DATE) {
      return d.get("month");
    }
    return d.subtract(1, "months").get("month");
  }

  @computed get startOfPeriod(): string {
    const d = moment(this.date);
    return d
      .set("date", PERIOD_START_DATE)
      .set("months", this.monthOfPeriodStart)
      .format("YYYY-MM-DD");
  }

  @computed get endOfPeriod(): string {
    const d = moment(this.date);
    return d
      .set("date", PERIOD_START_DATE)
      .set("months", this.monthOfPeriodStart)
      .add(1, "months")
      .format("YYYY-MM-DD");
  }

  @action.bound previous() {
    const d = moment(this.date);

    this.date = d.subtract("months", 1).format("YYYY-MM-DD");
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
