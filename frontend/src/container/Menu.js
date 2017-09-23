import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Aside, Toggle, Menu } from '../component/SideMenu';
import View from 'store/View';

@observer
export default class MenuContainer extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    @observable open = false;

    toggle = () => {
        this.open = !this.open;
    }

    render() {
        return (
            <Aside>
                <Toggle open={this.open} onClick={this.toggle}><p>➤</p></Toggle>
                <Menu open={this.open}>
                    It's me
                </Menu>
            </Aside>
        );
    }
}
