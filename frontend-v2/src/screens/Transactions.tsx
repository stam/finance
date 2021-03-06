import React, {
  useState,
  useCallback,
  useEffect,
  Fragment,
  useContext,
} from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { map } from "lodash";
import moment from "moment";

import { Header, Nav, Background } from "../components/ui";
import { TransactionItem } from "../components/Transaction";
import { MonthSelect, SelectedMonthContext } from "../components/MonthSelect";
import { TransactionStore } from "../store/Transaction";

const DateHeader = styled.p`
  margin-left: 1rem;
  color: black;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
`;

const Overview = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

export const Transactions: React.FC = observer(() => {
  const [transactionStore] = useState(
    new TransactionStore({
      relations: ["category"],
      limit: 9999,
    })
  );
  const selectedMonthStore = useContext(SelectedMonthContext);
  const [currentDate] = useState(moment());

  const fetchData = useCallback(
    (start: string, end: string) => {
      transactionStore.fetch({
        data: {
          ".date:gte": start,
          ".date:lte": end,
        },
      });
    },
    [transactionStore]
  );

  const formatDate = (date: moment.Moment) => {
    if (date.year() < currentDate.year()) {
      return date.format("dddd DD MMM YYYY");
    } else {
      return date.calendar(undefined, {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "[Last] dddd",
        sameElse: "dddd DD MMM",
      });
    }
  };

  useEffect(() => {
    fetchData(selectedMonthStore.startOfPeriod, selectedMonthStore.endOfPeriod);
  }, [
    fetchData,
    selectedMonthStore.startOfPeriod,
    selectedMonthStore.endOfPeriod,
  ]);

  return (
    <Background>
      <Header>
        Transactions
        <MonthSelect />
      </Header>
      <Overview>
        {map(transactionStore.groupByDate, (val, date) => (
          <Fragment key={date}>
            <DateHeader>{formatDate(val[0].date)}</DateHeader>
            {val.map((t) => (
              <TransactionItem key={t.id} model={t} />
            ))}
          </Fragment>
        ))}
      </Overview>
      <Nav />
    </Background>
  );
});
