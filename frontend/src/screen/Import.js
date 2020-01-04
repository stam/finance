import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataImport, DataImportStore } from '../store/DataImport';
import { Balance } from '../store/Balance';
import ImportOverview from '../component/Import/Overview';
import ModalSetBalance from '../container/ModalSetBalance';
import { FormField, Button } from 're-cy-cle';
import View from '../store/View';
import Content from '../component/Content';

@observer
export default class ImportScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.importStore = new DataImportStore();

        // Get latest transaction to double check with user
        // if transactions are up to date.
        //
        // If the user submits a new balance while the system only knows
        // old transactions shit breaks.
        this.balance = new Balance();
    }

    componentDidMount() {
        this.balance.fetchLatest();
        this.importStore.fetch();
    }

    handleFile(e) {
        const dataImport = new DataImport();
        const input = e.target;
        const file = input.files[0];

        dataImport.save(file).then(res => {
            this.importStore.add(res.data);
            this.promptForBalance();
        });
    }

    // If we have no record of the balance for the user,
    // prompt for it
    promptForBalance() {
        if (this.balance.id) {
            return;
        }
        this.props.viewStore.setModal({
            render: ModalSetBalance,
        });
    }

    async handleScrape() {
        await this.importStore.scrape();
    }

    render() {
        return (
            <Content>
                <Button onClick={e => this.handleScrape()}>Scrape</Button>
                <form>
                    <FormField label="ING File">
                        <input type="file" onChange={e => this.handleFile(e)} />
                    </FormField>
                </form>
                <ImportOverview imports={this.importStore} />
            </Content>
        );
    }
}
