import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Col, TextInput } from 're-cy-cle';
import { DateHeader as Header } from '../../../component/Transaction/List';
import styled from 'styled-components';

const MarginBottom = styled.div`
    margin-bottom: 8px;
`;

@observer
export default class FilterInput extends Component {
    static propTypes = {
        // store: PropTypes.instanceOf(View).isRequired,
    };

    appleFilter = () => {
        console.log('todo apply filter');
    };

    render() {
        return (
            <Col>
                <Header>New filter</Header>
                <MarginBottom>
                    <TextInput />
                </MarginBottom>
                <MarginBottom>
                    <TextInput />
                </MarginBottom>
                <MarginBottom>
                    <TextInput />
                </MarginBottom>
                <Button onClick={this.applyFilter}>
                    Apply filter
                </Button>
            </Col>
        );
    }
}
