import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 're-cy-cle';

export default class SaveButton extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
        children: PropTypes.node,
    };

    render() {
        const { children, loading, disabled, ...props } = this.props;
        return (
            <Button type="submit" disabled={disabled || loading} {...props}>
                {loading
                    ? t('form.saveLoadingButton')
                    : children || t('form.saveButton')}
            </Button>
        );
    }
}
