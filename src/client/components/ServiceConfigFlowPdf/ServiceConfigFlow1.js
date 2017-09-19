import React from 'react';
import { Button,Col } from 'react-bootstrap';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';
import ajax from 'superagent-bluebird-promise';


export default class ServiceConfigFlow1 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        inChannelConfig : React.PropTypes.object,
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted,
            rejection:false,
            email:'',
            validate:null,
            termsAndConditions:null
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
        locale: React.PropTypes.string
    };


    componentWillMount() {
        if (this.props.inChannelConfig && this.props.inChannelConfig.PdfChannelConfig)
        this.setState({
            accepted : this.props.inChannelConfig.status == 'new' ? false : true,
            email: this.props.inChannelConfig.PdfChannelConfig.rejectionEmail,
            rejection: this.props.inChannelConfig.PdfChannelConfig.rejectionEmail ? true : false,
            validat:'success'
        });
    }

    componentDidMount() {
        this.setTermsAndConditions(this.context.locale);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.locale != this.context.locale) {
            this.setTermsAndConditions(nextContext.locale);
        }
    }

    setTermsAndConditions(locale) {
        this.getTermsAndConditions(locale)
        .then ((termsAndConditions) => {
            this.setState({ termsAndConditions: termsAndConditions.text });
        })
        .catch((e) => {
            this.setState({ termsAndConditions: <h3>Error while loading the Terms and Conditions. If the problem appears repeatedly, please contact the Support.</h3> });
        });
    }
    getTermsAndConditions(locale) {
        // blob/publicc/api/opuscapita/files/public/docs/einvoice-send/pdf/TermsAndConditions[_<locale>].html
        let path = "/blob/public/api/opuscapita/files/public/docs/einvoice-send/pdf/";
        let filename = "OpusCapitaTermsAndConditions";
        return ajax.get(path + filename + '_' + locale + '.html')
        .catch((e) => {
            return ajax.get(path + filename + '.html');
        })
    }


    // This function handles the text change event for the new text box added
    // For now a regex validation is added.
    // TODO: Integration of validate.js
    handleChange = (e)=>{
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.setState({
            email:e.target.value
        },()=>{
            if(this.state.email === "")
                this.setState({rejection:false,validation:'null'})
            else {
                if(regex.test(this.state.email)) {
                    this.setState({validate:'success',rejection:true})
                }
                else {
                    this.setState({validate:'error',rejection:false})
                }
            }
        })
    }

    callNext=()=>{
        this.props.onNext(this.state.email)
    }

    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('congratulations')}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.subheader', {customerName : this.props.voucher.customerName})}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <div>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.intro', {customerName : this.props.voucher.customerName, customerId : this.props.voucher.customerId})}
                    </div>
                    <br/>
                    <div dangerouslySetInnerHTML={{__html: this.state.termsAndConditions}} />
                 </div>

                <hr/>

                <div className="col-md-12">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted }
                            onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            {this.context.i18n.getMessage('ServiceConfigFlow.readOCTaC')}
                        </a>
                    </label>
                </div>

                <div>
                    <br/><br/>
                    <div>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.additionalHelp')}
                    </div>
                    <Form horizontal>
                        <FormGroup
                            controlId="rejection email"
                            validationState={this.state.validate}>
                            <div className="col-md-12">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <ControlLabel>{this.context.i18n.getMessage('ServiceConfigFlow.Pdf.rejection')}*</ControlLabel>
                                </Col>
                                <Col sm={4}>
                                    <FormControl
                                        name="email"
                                        type="text"
                                        placeholder={this.context.i18n.getMessage('ServiceConfigFlow.enterEmail')}
                                        onChange = {this.handleChange}
                                        value={this.state.email}/>
                                    <FormControl.Feedback />
                                </Col>
                            </div>
                        </FormGroup>
                    </Form>
                </div>


                <div className="form-submit text-right">
                    <Button bsStyle="primary" disabled={ !this.state.accepted || !this.state.rejection } onClick={ () => this.props.onNext(this.state.email) }>
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}
