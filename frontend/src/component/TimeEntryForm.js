import Form from './Form';
import FormField from './FormField';
import styled from 'styled-components';
import { mobile } from '../styles';

export const TimeEntryForm = styled(Form)`
    display: flex;
    margin-bottom: 32px;
    align-items: flex-end;

    ${mobile`
        flex-direction: column;
        align-items: stretch;
    `}
`;

export const TimeEntryFormField = styled(FormField)`
    flex: ${props => props.size || 0};
    margin: 0 8px 8px 8px;

    ${mobile`
        ${props => props.center && `align-self: center`}
    `}
`;
