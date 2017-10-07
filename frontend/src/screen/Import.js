import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FormField from '../component/FormField';
import { DataImport, DataImportStore } from '../store/DataImport';
import ImportOverview from '../component/Import/Overview';
import View from '../store/View';

@observer
export default class ImportScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.importStore = new DataImportStore();
    }

    componentDidMount() {
    }


    handleFile(e) {
        const dataImport = new DataImport();
        const input = e.target;
        const file = input.files[0];

        dataImport.save(file).then(
            () => {
                console.log('file saved');
            },
            () => {
                // Hack to reset the input
                input.value = null;
            }
        );
    }

    render() {
        return (
            <div>
                <form>
                    <FormField label="ING File">
                        <input type="file" onChange={e => this.handleFile(e)} />
                    </FormField>
                </form>
                <ImportOverview imports={this.importStore} />
            </div>
        );
    }
}
