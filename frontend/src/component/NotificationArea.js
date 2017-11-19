import { NotificationStack } from 're-cy-cle';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

// TODO: I don't like this...
const StyledWrapper = styled.div`
    .notification-bar-active {
        font-size: 1.2em; /* FIXME rutger */
    }
`;

@observer
export default class NotificationArea extends React.Component {
    static propTypes = {
        store: PropTypes.object,
    };
    dismiss = notification => {
        this.props.store.notifications.remove(notification);
    };
    render() {
        return (
            <StyledWrapper>
                <NotificationStack
                    notifications={this.props.store.notifications.slice()}
                    onDismiss={this.dismiss}
                />
            </StyledWrapper>
        );
    }
}
