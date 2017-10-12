import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataImport, DataImportStore } from '../store/DataImport';
import ImportOverview from '../component/Import/Overview';
import { ContentContainer, FormField } from 're-cy-cle';
import View from '../store/View';
import Content from '../component/Content';

@observer
export default class ImportScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.importStore = new DataImportStore();
    }

    componentDidMount() {
        this.importStore.fetch();
    }

    handleFile(e) {
        const dataImport = new DataImport();
        const input = e.target;
        const file = input.files[0];

        dataImport.save(file).then(
            res => {
                this.importStore.add(res.data);
            },
            () => {
                // Hack to reset the input
                input.value = null;
            }
        );
    }

    render() {
        return (
            <ContentContainer>
                <Content>
                    <form>
                        <FormField label="ING File">
                            <input
                                type="file"
                                onChange={e => this.handleFile(e)}
                            />
                        </FormField>
                    </form>
                    <ImportOverview imports={this.importStore} />
                </Content>
            </ContentContainer>
        );
    }
}
