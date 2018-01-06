import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransactionStore } from '../store/Transaction';
import TransactionOverview from './Transaction/Overview';
import { Balance } from '../store/Balance';
import { observer } from 'mobx-react';
import {
    Modal,
    Form,
    Body,
    ContentContainer,
    Content,
    Toolbar,
    Button,
    Heading,
    FormField,
    NumberInput,
} from 're-cy-cle';
import SaveButton from 'component/form/SaveButton';
// import { StatusUpdate } from 'store/StatusUpdate';
// import { ContactStore } from 'store/Contact';

@observer
export default class ModalSetBalance extends Component {
    static propTypes = {
        viewStore: PropTypes.object.isRequired,
    };

    componentWillMount() {
        // Get latest transaction to double check with user
        // if transactions are up to date.
        //
        // If the user submits a new balance while the system only knows
        // old transactions shit breaks.
        this.balance = new Balance(null, {
            relations: ['afterImport'],
        });
        this.transactionStore = new TransactionStore({
            relations: ['category', 'dataImport'],
        });
        this.transactionStore.params = {
            order_by: '-date',
            limit: 6,
        };
    }

    componentDidMount() {
        this.transactionStore.fetch().then(() => {
            if (this.transactionStore.length) {
                this.balance.afterImport = this.transactionStore.at(
                    0
                ).dataImport;
            }
        });
    }

    save = () => {
        // Only enable this when the dataImport has finished fetching
        if (!this.balance.afterImport.id) {
            return;
        }
        this.balance.save();
        this.handleClose();
    };

    handleClose = () => {
        this.props.viewStore.setModal(null);
    };

    handleChange = (name, amount) => {
        this.balance.amount = amount;
    };

    render() {
        return (
            <Modal onClose={this.handleClose}>
                <Form onSubmit={this.save}>
                    <Body>
                        <ContentContainer>
                            <Content>
                                <Heading>{t('balance.create.title')}</Heading>
                                <FormField
                                    label={t('balance.field.value.label')}
                                    required
                                >
                                    <NumberInput
                                        name="balance"
                                        onChange={this.handleChange}
                                        value={this.balance.amount}
                                        allowDecimal
                                        autoFocus
                                    />
                                </FormField>
                                <p>{t('balance.create.label')}</p>
                                <TransactionOverview
                                    store={this.transactionStore}
                                />
                            </Content>
                        </ContentContainer>
                        <Toolbar>
                            <SaveButton loading={false} />
                            <Button tone="light" onClick={this.handleClose}>
                                {t('form.cancelButton')}
                            </Button>
                        </Toolbar>
                    </Body>
                </Form>
            </Modal>
        );
    }
}
