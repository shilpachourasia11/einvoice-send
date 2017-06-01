import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import request from 'superagent-bluebird-promise';

export default class ServiceConfigFlow3 extends React.Component {

    static propTypes = {
        hasValidFile : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
        eInvoiceTypes : React.PropTypes.array
    };

    static defaultProps = {
        hasValidFile : false,
    };

    constructor(props)
    {
        super(props);

        this.state = {
            hasValidFile : this.props.hasValidFile,
            eInvoiceTypes: [] // "Svefaktura 1.0", "Svefaktura BIS 5A", "Svekatalog 2.0", "Sveorder BIS 28A", "Sveorder (ordersvar)", "Sveleveransavisering BIS 30A", "PEPPOL Message Envelope 1.0", "SFTI Tekniska kuvert (SBDH)", "SFTI ObjectEnvelope"]
        };
    }

    componentDidMount() {
        // console.log(">> componentDidMount is called.");
        this.loadInvoiceTypesPromise = request.
            get('http://localhost:8080/einvoice-send/api/eInvoiceTypes').
            set('Accept', 'application/json').
            promise();

        Promise.all([this.loadInvoiceTypesPromise])
        .then(([invoiceTypes]) => {
            var eInvoiceTypesArray = JSON.parse(invoiceTypes.text).map((item) => {return item.formatName;});
            this.setState({eInvoiceTypes: eInvoiceTypesArray.sort()});
        })
        .catch(errors => {
            if (errors.status === 401) {
                // TODO: Add proper error handling
                this.setState({eInvoiceTypes: []});
                return;
            }
        });
        return;
    }


    onFileDrop = function(e)
    {
        e.preventDefault();

        var files = e.dataTransfer.files;
        var formData = new FormData();

        formData.append('file', files[0]);
        this.setState({ hasValidFile : true });
    }

    render()
    {
        return (
            <div>
                <h3>eInvoice Validation</h3>

                <div className="bs-callout bs-callout-info">
                    <h4 id="callout-progress-csp">Type of Validation</h4>
                    <p>
                        You can change your type of validation here if neccessary, which you selected one step earlier.
                        <br/>
                        Please upload a test file for validation in the Drag &#39;n&#39; Drop section below.
                    </p>
                </div>

                <form className="form-horizontal">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Validation Type</label>
                                <div className="col-sm-9">
                                    <FormControl componentClass="select">
                                        {this.state.eInvoiceTypes.map((type, index) => {
                                          return (<option key={index} value={type}>{type}</option>);
                                        })}
                                     </FormControl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="oc-drag-and-drop">
                        <div className="drag-and-drop-canvas text-center" id="file-upload" onDragOver={ e => e.preventDefault() } onDrop={ e => this.onFileDrop(e) }>
                            <h2>Drag a file here</h2>
                            <h4>or <a href="#">browse</a> for a file to upload.</h4>
                        </div>
                    </section>

                </form>

                <br/>

                <div className="form-submit text-right">
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Previous</Button>
                    <Button bsStyle="primary" disabled={ !this.state.hasValidFile } onClick={ () => this.props.onNext() }>
                        Save &amp; Continue
                    </Button>
                </div>
            </div>
        )
    }
}
