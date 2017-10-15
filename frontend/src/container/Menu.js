import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Menu } from '../component/SideMenu';
import { Query } from '../store/Query';

import FilterCreate from './Transaction/Filter/Create';

@observer
export default class MenuContainer extends Component {
    static propTypes = {
        applyFilter: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.query = new Query();
    }

    handleFilter = () => {
        console.log('handleFilter');
        this.props.applyFilter(this.query.matcher.toStoreParams());
    };

    render() {
        return (
            <Menu>
                <FilterCreate
                    rule={this.query.matcher.rules[0]}
                    applyFilter={this.handleFilter}
                />
            </Menu>
        );
    }
}
