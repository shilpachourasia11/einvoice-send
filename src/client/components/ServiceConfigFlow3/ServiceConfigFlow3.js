import React from 'react';
import { Button, FormControl } from 'react-bootstrap';

export default class ServiceConfigFlow3 extends React.Component {

    static propTypes = {
        hasValidFile : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
        hasValidFile : false,
    };

    constructor(props)
    {
        super(props);

        this.state = {
            hasValidFile : this.props.hasValidFile
        };
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
                                        <option value="insert-update">Svefaktura 1.0</option>
                                        <option value="replace">Svefaktura BIS 5A</option>
                                        <option value="replace">Svekatalog 2.0</option>
                                        <option value="replace">Sveorder BIS 28A</option>
                                        <option value="replace">Sveorder (ordersvar)</option>
                                        <option value="replace">Sveleveransavisering BIS 30A</option>
                                        <option value="replace">PEPPOL Message Envelope 1.0</option>
                                        <option value="replace">SFTI Tekniska kuvert (SBDH)</option>
                                        <option value="replace">SFTI ObjectEnvelope</option>
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
