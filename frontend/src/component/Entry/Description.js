import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { EntryItemDescription } from 'component/EntryList';
import { Entry } from 'store/Entry';
import InputText from 'component/InputText';
import Form from '../Form';

@observer
export default class EntryDescription extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        allowEdit: PropTypes.bool,
    };

    @observable editing = false;

    handleBlur = () => {
        this.editing = false;
        this.props.entry.save();
    };

    handleClick = () => {
        if (this.props.allowEdit) {
            this.editing = true;
        }
    };

    handleChange = (name, value) => {
        this.props.entry.description = value;
    };

    render() {
        const { entry, allowEdit } = this.props;
        if (this.editing) {
            return (
                <EntryItemDescription>
                    <Form onSubmit={this.handleBlur}>
                        <InputText
                            onChange={this.handleChange}
                            name="description"
                            value={entry.description}
                            onBlur={this.handleBlur}
                            autoFocus
                            small
                        />
                    </Form>
                </EntryItemDescription>
            );
        }
        return (
            <EntryItemDescription
                onClick={this.handleClick}
                allowEdit={allowEdit}
            >
                {entry.description || <i>No description</i>}
            </EntryItemDescription>
        );
    }
}
