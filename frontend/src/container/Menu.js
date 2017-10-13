import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Menu } from '../component/SideMenu';
import View from 'store/View';

@observer
export default class MenuContainer extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    render() {
        return (
            <Menu>
                Filters
            </Menu>
        );
    }
}
