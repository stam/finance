import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import View from '../store/View';
import Content from '../component/Content';
import { ContentContainer } from 're-cy-cle';

@observer
export default class DashboardScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    render() {
        return (
            <ContentContainer>
                <Content>
                    Dashboard
                </Content>
            </ContentContainer>
        );
    }
}
