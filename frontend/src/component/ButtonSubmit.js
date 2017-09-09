import PropTypes from 'prop-types';
import React from 'react';

const ButtonSubmit = ({ value }) => <input type="submit" value={value} />;

ButtonSubmit.propTypes = {
    value: PropTypes.string.isRequired,
};

ButtonSubmit.defaultProps = {
    value: 'Save',
};

export default ButtonSubmit;
