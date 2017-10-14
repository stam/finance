import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Menu } from '../component/SideMenu';
import FilterInput from './Transaction/Filter/Input';

@observer
export default class MenuContainer extends Component {
    static propTypes = {
        applyFilter: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Menu>
                <FilterInput applyFilter={this.props.applyFilter} />
            </Menu>
        );
    }
}
