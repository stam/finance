import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import View from '../store/View';
import styled from 'styled-components';

const Info = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 200px;
    background: #76251b;
    color: #fff;
    padding: 8px;
`;

@observer
export default class NetworkInfo extends React.Component {
    static propTypes = {
        store: PropTypes.instanceOf(View),
    };

    render() {
        if (this.props.store.online) {
            return null;
        }
        return <Info>No connection with backend.</Info>;
    }
}
