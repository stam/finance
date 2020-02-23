import React, { useState, useCallback, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { map } from "lodash";

import { Header } from "../components/Header";
import { TransactionItem } from "../components/Transaction";
import { Nav } from "../components/Nav";
import { TransactionStore } from "../store/Transaction";
import moment from "moment";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

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
      relations: ["category"]
    })
  );
  const [currentYear] = useState(moment().year());

  const fetchData = useCallback(() => {
    transactionStore.fetch();
  }, [transactionStore]);

  const formatDate = (date: moment.Moment) => {
    if (date.year() < currentYear) {
      return date.format("dddd DD MMM YYYY");
    } else {
      return date.calendar(undefined, {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "[Last] dddd",
        sameElse: "dddd DD MMM"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      <Header>Transactions</Header>
      <Overview>
        {map(transactionStore.groupByDate, (val, date) => (
          <Fragment>
            <DateHeader>{formatDate(val[0].date)}</DateHeader>
            {val.map(t => (
              <TransactionItem key={t.id} model={t} />
            ))}
          </Fragment>
        ))}
      </Overview>
      <Nav />
    </Container>
  );
});
