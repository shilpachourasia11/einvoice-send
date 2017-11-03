import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import { Route } from 'react-router';
import ajax from 'superagent-bluebird-promise';
import ServiceConfigFlowStart from '../components/ServiceConfigFlowStart.js';
import ServiceConfigFlowFramePdf from '../components/ServiceConfigFlowPdf/ServiceConfigFlow';
import ServiceConfigFlowFrameEinvoice from '../components/ServiceConfigFlowEinvoice/ServiceConfigFlow.js'
import ServiceConfigFlowFramePaper from '../components/ServiceConfigFlowPaper/ServiceConfigFlow.js'
import ServiceConfigFlowFrameKeyIn from '../components/ServiceConfigFlowKeyIn/ServiceConfigFlow.js'

class Frame extends Components.ContextComponent
{
    constructor(props, context)
    {
        super(props);

        context.router.listen(item => this.switchStepsByRoute(item.pathname));

        this.state = {
            wizardType : 'start',
            currentTab : 1,
            voucher : { }
        };
    }

    componentDidMount()
    {
        return Promise.all([
            this.loadUser(),
            this.loadInChannelConfig(),
            this.loadVoucher()
        ])
        .then(() => this.switchStepsByRoute(this.context.router.location.pathname));
    }

    switchStepsByRoute(pathname)
    {
        const parts = pathname.split('/');
        const path = `/${parts[1].toLowerCase()}`;
        const step = parseInt(parts[2] || 1);

        switch(path)
        {
            case '/':
                return this.setState({ wizardType : 'start', 'currentTab' : 1 });
            case '/pdf':
                return this.setState({ wizardType : 'pdf', 'currentTab' : step });
            case '/einvoice':
                return this.setState({ wizardType : 'einvoice', 'currentTab' : step });
            case '/paper':
                return this.setState({ wizardType : 'paper', 'currentTab' : step });
            case '/keyin':
                return this.setState({ wizardType : 'keyin', 'currentTab' : step });
        }
    }

    loadUser()
    {
        return ajax.get('/auth/me').then(res => res.body)
            .then(user => this.setState({ user }))
            .catch(e => this.context.showNotification(e.message, 'error', 10));
    }

    loadInChannelConfig()
    {
        const supplierId = this.context.userData.supplierid;

        return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId).then(res => res.body)
            .then(inChannelConfig => inChannelConfig && this.setState({ inChannelConfig }))
            .catch(e => e.status !== 404 && this.context.showNotification(e.message, 'error', 10));
    }

    loadVoucher()
    {
        const supplierId = this.context.userData.supplierid;

        return ajax.get('/einvoice-send/api/config/vouchers/' + supplierId).then(res => res.body)
        .then(voucher =>
        {
            // How will evaluation of allowed input types and billings be determined???
            // Convention for now: Use boolen to enable or disable the different input types:
            voucher.eInvoiceEnabled = true; // !!! only for the supplier to confirm their intention
            voucher.pdfEnabled = true;
            voucher.keyInEnabled = true;
            voucher.paperEnabled = false;

            return ajax.get('/einvoice-send/api/customers/' + voucher.customerId).then(res => res.body)
            .then(customer =>
            {
                voucher.customer = customer
                voucher.customerName = (customer && customer.customerName) || voucher.customerId;

                return voucher;
            });
        })
        .then(voucher =>
        {
            const locale = this.context.locale;
            const localizedFile = '/blob/public/api/c_' + voucher.customerId + '/files/public/einvoice-send/TermsAndConditions_' + locale + '.html';
            const defaultFile = '/blob/public/api/c_' + voucher.customerId +  '/files/public/einvoice-send/TermsAndConditions.html';

            return ajax.get(localizedFile).catch(e => ajax.get(defaultFile)).then(res => res.body)
                .then(customerTermsAndConditions => ({ voucher, customerTermsAndConditions }))
                .catch(e => ({ voucher }));
        })
        .then(({ voucher, customerTermsAndConditions }) =>
        {
            this.setState({ voucher, customerTermsAndConditions })
        })
        .catch(e =>
        {
            this.context.showNotification(e.message, 'warning', 10);

            this.setState({
                voucher : {
                    eInvoiceEnabled : false,
                    pdfEnabled : false,
                    keyInEnabled : false,
                    paperEnabled : false
                },
                customerTermsAndConditions : null
            });
        })
    }

    navigate2Flow(inputType)
    {
        const supplierId = this.context.userData.supplierid;
        const { router, showNotification } = this.context;

        return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId).then(res => res.body)
            .then(inChannelConfig => this.setState({ inChannelConfig }))
            .then(() => router.push(`/einvoice-send/${inputType}`))
            .catch(e => showNotification(e.message, 'error', 10));
    }

    navigate2Start()
    {
        this.context.router.push('/einvoice-send');
    }

    updateEinvoiceAndGotoStart(intention = null)
    {
        if(intention != null)
        {
            const config = this.state.inChannelConfig;

            if(config)
            {
                config.EInvoiceChannelConfig = config.EInvoiceChannelConfig || { };
                config.EInvoiceChannelConfig.intention = intention;

                this.setState({ inChannelConfig : config });

                this.context.router.push('/einvoice-send');
            }
            else
            {
                return this.loadInChannelConfig().then(() => this.context.router.push('/einvoice-send'))
            }
        }

        return Promise.resolve();
    }

    updateKeyInAndGotoStart(intention = null)
    {
        if(intention != null)
        {
            const config = this.state.inChannelConfig;

            if(config)
            {
                config.KeyInChannelConfig = config.KeyInChannelConfig || { };
                config.KeyInChannelConfig.intention = intention;

                this.setState({ inChannelConfig : config });
                this.context.router.push('/einvoice-send');
            }
            else
            {
                return this.loadInChannelConfig().then(() => this.context.router.push('/einvoice-send'))
            }
        }

        return Promise.resolve();
    }

    finalizeFlow()
    {
        this.context.router.push('/bnp/dashboard');
    }

    render()
    {
        const { user, voucher, inChannelConfig, wizardType, currentTab, customerTermsAndConditions } = this.state;
        const { router } = this.context;

        if(!user || !currentTab)
            return null;

        return(
            <div>
                {
                    wizardType === 'start' ?
                        <ServiceConfigFlowStart
                            openFlow={this.navigate2Flow.bind(this)}
                            user={user}
                            voucher={voucher}
                            inChannelConfig={inChannelConfig || { }}
                            loadVoucher={this.loadVoucher.bind(this)} />
                    : null
                }
                {
                    wizardType === 'pdf' ?
                        <ServiceConfigFlowFramePdf
                            currentTab={currentTab}
                            gotoStart={this.navigate2Start.bind(this)}
                            finalizeFlow={this.finalizeFlow.bind(this)}
                            voucher={voucher}
                            inChannelConfig={inChannelConfig}
                            customerTermsAndConditions={customerTermsAndConditions} />
                    : null
                }
                {
                    wizardType === 'einvoice' ?
                        <ServiceConfigFlowFrameEinvoice
                            currentTab={currentTab}
                            gotoStart={currentTab === 1 ? this.updateEinvoiceAndGotoStart.bind(this) : this.navigate2Start.bind(this)}
                            finalizeFlow={this.finalizeFlow.bind(this)}
                            voucher={voucher}
                            inChannelConfig={inChannelConfig}
                            customerTermsAndConditions={customerTermsAndConditions} />
                    : null
                }
                {
                    wizardType === 'paper' ?
                        <ServiceConfigFlowFramePaper
                            currentTab={currentTab}
                            gotoStart={this.navigate2Start.bind(this)}
                            finalizeFlow={this.finalizeFlow.bind(this)}
                            voucher={voucher}
                            customerTermsAndConditions={customerTermsAndConditions} />
                    : null
                }
                {
                    wizardType === 'keyin' ?
                        <ServiceConfigFlowFrameKeyIn
                            currentTab={currentTab}
                            gotoStart={this.navigate2Start.bind(this)}
                            finalizeFlow={this.finalizeFlow.bind(this)}
                            voucher={voucher}
                            inChannelConfig={inChannelConfig}
                            customerTermsAndConditions={customerTermsAndConditions} />
                    : null
                }
            </div>
        )
    }
}

export default Frame;
