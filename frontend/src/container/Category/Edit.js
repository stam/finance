import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Category } from '../../store/Category';
import { Form, Row, FormField, TextInput, Col } from 're-cy-cle';
import { CirclePicker } from 'react-color';
import Button from '../../component/Button';
import PropTypes from 'prop-types';

@observer
export default class CategoryEditContainer extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Category).isRequired,
        onCreate: PropTypes.func.isRequired,
    };

    handleChange = (name, value) => {
        this.props.model[name] = value;
    };

    handleSubmit = () => {
        const model = this.props.model;
        const isNew = model.isNew;

        model.save().then(() => {
            if (isNew) {
                this.props.onCreate(model);
            }
        });
    };

    render() {
        const category = this.props.model;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Col>
                    <Row>
                        <FormField label="Name">
                            <TextInput
                                name="name"
                                value={category.name}
                                onChange={this.handleChange}
                            />
                        </FormField>
                    </Row>
                    <Row>
                        <FormField label="Color">
                            <CirclePicker
                                onChangeComplete={color => {
                                    this.handleChange('color', color.hex);
                                }}
                                color={category.color}
                            />
                        </FormField>
                    </Row>
                    <Row>
                        <Button type="submit">
                            Save
                        </Button>
                    </Row>
                </Col>
            </Form>
        );
    }
}
