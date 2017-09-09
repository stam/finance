import PropTypes from 'prop-types';
import React from 'react';

const Form = ({ children, onSubmit, ...props }) => (
    <form
        onSubmit={e => {
            e.preventDefault();
            onSubmit();
        }}
        {...props}
    >
        {children}
    </form>
);

Form.propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func.isRequired,
};

export default Form;
