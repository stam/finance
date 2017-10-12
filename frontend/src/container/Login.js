import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Button from '../component/Button';
import View from '../store/View';
import { Form, FormField, TextInput, ContentContainer } from 're-cy-cle';
import Content from '../component/Content';

@observer
export default class Login extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View),
    };

    handleSubmit() {
        console.log('todo handleSubmit');
    }

    @observable
    input = {
        username: '',
        password: '',
    };

    handleSubmit = () => {
        this.errorMsg = '';
        this.props.viewStore.performLogin(
            this.input.username,
            this.input.password
        );
    };

    handleChangeInput = (name, value) => {
        this.input[name] = value;
    };

    render() {
        return (
            <Form noValidate onSubmit={this.handleSubmit}>
                <FormField label="email">
                    <TextInput
                        name="username"
                        type="email"
                        onChange={this.handleChangeInput}
                        value={this.input.username}
                        autoFocus
                    />
                </FormField>
                <FormField label="password">
                    <TextInput
                        name="password"
                        type="password"
                        onChange={this.handleChangeInput}
                        value={this.input.password}
                    />
                </FormField>
                <FormField error={this.errorMsg ? [this.errorMsg] : null}>
                    <Button type="submit" fullWidth>
                        Login
                    </Button>
                </FormField>
            </Form>
        );
    }
}
