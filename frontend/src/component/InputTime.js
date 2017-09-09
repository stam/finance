import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import TimeInput from '../patch/react-time-input';
import Button from './Button';

const Container = styled.div`
    position: relative;
`;

export const InputTimeButton = styled(Button)`
    width: 100%;
    font-size: 20px;
    height: 48px;

    ${props => (props.flex ? `
        flex: ${props.flex}
    ` : null)};

    ${props => (props.showOverlay ? `
        border-radius: 8px 8px 0 0;
        background: #ddd;
    ` : `
        border-radius: 8px;
    `)};

    ${props => {
        if (!props.variation) return null;

        switch (props.variation) {
            case 'warning':
                return `color: #ec4849;`;
            default:
                return null;
        }
    }}
`;

const Overlay = styled.div`
    background: white;
    border-radius: 0 0 8px 8px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 2;
    ${props => (props.hide ? `display: none;` : null)};
`;

const ActionContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledInput = styled.input`
    margin: 0 8px 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;
    height: 40px;
    outline: none;

    &::-webkit-clear-button {
        -webkit-appearance: none;
    }
`;

const StyledTime = styled(TimeInput)`
    margin: 0 8px 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;
    height: 40px;
    outline: none;
`;

export default onClickOutside(
    @observer class InputTime extends Component {
        static propTypes = {
            onChange: PropTypes.func.isRequired,
            name: PropTypes.string.isRequired,
            value: PropTypes.object,
            disableClear: PropTypes.bool,
            disableNow: PropTypes.bool,
            showDash: PropTypes.bool,
        };

        static defaultProps = {
            value: null,
            disableClear: false,
            disableNow: false,
            showDash: false,
        };

        @observable showOverlay = false;
        @observable shouldFocusTime = false;

        @observable date = moment().format('YYYY-MM-DD');
        @observable time = moment().format('HH:mm');

        toggleOverlay = () => {
            const showOverlay = !this.showOverlay;
            this.showOverlay = showOverlay;
            this.shouldFocusTime = showOverlay;
        };

        changeValue = () => {
            const datetime = moment(`${this.date} ${this.time}`);
            this.props.onChange(this.props.name, datetime);
        };

        handleChangeDate = value => {
            this.date = value;
            this.changeValue();
        };

        handleChangeTime = value => {
            this.time = value;
            this.changeValue();
        };

        handleClickOutside() {
            this.showOverlay = false;
        }

        componentDidUpdate() {
            if (this.shouldFocusTime) {
                this.inputTime.focus();
                this.shouldFocusTime = false;
            }
        }

        handleReset = () => {
            this.props.onChange(this.props.name, null);
        };

        renderClear() {
            if (this.props.disableClear) {
                return null;
            }

            return (
                <InputTimeButton
                    type="button"
                    variation="warning"
                    onClick={this.handleReset}
                >
                    Clear
                </InputTimeButton>
            );
        }

        renderNow() {
            if (this.props.disableNow) {
                return null;
            }

            return (
                <InputTimeButton type="button" onClick={this.handleReset}>
                    Now
                </InputTimeButton>
            );
        }

        render() {
            const now = moment();
            return (
                <Container>
                    <InputTimeButton
                        type="button"
                        flex={1}
                        onClick={this.toggleOverlay}
                        showOverlay={this.showOverlay}
                    >
                        {this.props.value
                            ? this.props.value.format('H:mm')
                            : this.props.showDash ? '—' : 'Now'}
                    </InputTimeButton>
                    <Overlay hide={!this.showOverlay}>
                        <ActionContainer>
                            {this.renderNow()}
                            {this.renderClear()}
                        </ActionContainer>
                        <StyledTime
                            inputRef={input => {
                                this.inputTime = input;
                            }}
                            name={this.props.name}
                            placeholder="13:37"
                            value={
                                this.props.value
                                    ? this.props.value.format('HH:mm')
                                    : this.time
                            }
                            onTimeChange={val => {
                                this.handleChangeTime(val);
                            }}
                        />
                        <StyledInput
                            type="date"
                            max={now.format('YYYY-MM-DD')}
                            onChange={e => {
                                this.handleChangeDate(e.target.value);
                            }}
                            value={
                                this.props.value
                                    ? this.props.value.format('YYYY-MM-DD')
                                    : this.date
                            }
                        />
                    </Overlay>
                </Container>
            );
        }
    }
);
