import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';

export default class ServiceConfigFlow3 extends React.Component {

    static propTypes = {
        hasValidFile : React.PropTypes.bool,
        filename : React.PropTypes.string,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
        hasValidFile : false,
        filename : null
    };

    constructor(props)
    {
        super(props);

        this.state = {
            hasValidFile : this.props.hasValidFile,
            filename : this.props.filename
        };
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };


    onFileDrop = function(e)
    {
        e.preventDefault();

        // see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
        // see https://developer.mozilla.org/en-US/docs/Web/API/FileList
        // see https://developer.mozilla.org/en-US/docs/Web/API/File
        // see https://developer.mozilla.org/en-US/docs/Web/API/FileReader

        var files = e.dataTransfer.files;
        var ok2proceed = true;

        if (files.length != 1) {
            ok2proceed = false;
            alert("Please provide exactly one PDF example file.");
        }
        var file = files[0];

        var extension = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (extension.toLowerCase() != 'pdf') {
            ok2proceed = false;
            alert("Please provide a PDF example file.");
        }
        // see https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
        // var imageType = /^image\//;
        // if (!imageType.test(file.type)) {

        // var reader = new FileReader();
        // reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        // reader.readAsDataURL(file);

        if (ok2proceed) {

            var formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);

            // console.log("formData ", formData);
            // for(var pair of formData.entries()) {
            //     console.log(">> entries: " + pair[0]+ ', '+ pair[1]);
            //}

            console.log("Pushing file " + file.name + "to blob service for tenant " + this.props.voucher.supplierId + ".");

            ajax.put('/blob/api/s_' + this.props.voucher.supplierId + '/files/private/einvoice-send/InvoiceTemplate.pdf')
                .query({
                    createMissing: true
                })
                .send(formData)
            .then(() => {
                this.setState({ hasValidFile : true, filename : file.name });
            })
            .catch((e) => {
                console.log("Document upload error: ", e);
                alert("The upload did not succeed. Please try again.");
            });
        }
    }

    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Upload.header')}</h3>

                <div className="bs-callout bs-callout-info">
                    <h4 id="callout-progress-csp">{this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Upload.subheader')}</h4>

                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Upload.intro')}
                </div>

                <form className="form-horizontal">
                    <section className="oc-drag-and-drop">
                        <div className="drag-and-drop-canvas text-center" id="file-upload" onDragOver={ e => e.preventDefault() } onDrop={ e => this.onFileDrop(e) }>
                            <h2>{this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Upload.dropHere')}</h2>
                            {this.state.filename &&
                                <h4>{this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Upload.uploaded')} {this.state.filename} </h4>
                            }
                        </div>
                    </section>

                </form>

                <br/>

                <div className="form-submit text-right">
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>
                        {this.context.i18n.getMessage('previous')}
                    </Button>
                    <Button bsStyle="primary" disabled={ !this.state.hasValidFile } onClick={ () => this.props.onNext() }>
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}
