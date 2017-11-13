import React from 'react';
import PropTypes from 'prop-types';
import { Components } from '@opuscapita/service-base-ui';
import ajax from 'superagent-bluebird-promise';
import SalesInvoices from '../../api/SalesInvoices.js';
import extend from 'extend';
import translations from './i18n';

class SalesInvoiceList extends Components.ContextComponent
{
    static propTypes = {
        supplierId : PropTypes.string,
        onFilter : PropTypes.func.isRequired
    }

    static defaultProps = {
        onFilter : (items) => items
    }

    static columns = [{
            key : 'invoiceNumber',
            name : 'SalesInvoiceList.header.invoiceNumber'
        }, {
            key : 'customerName',
            name : 'SalesInvoiceList.header.customer'
        }, {
            key : 'invoiceDateLabel',
            name : 'SalesInvoiceList.header.invoiceDate'
        }, {
            key : 'orderNumber',
            name : 'SalesInvoiceList.header.orderNumber'
        }, {
            key : 'totalNetPriceLabel',
            name : 'SalesInvoiceList.header.totalNetPrice'
        }, {
            key : 'status',
            name : 'SalesInvoiceList.header.status'
        }
    ];

    /*static itemButtons = [{
        key : 'edit',
        label : 'System.edit',
        icon : 'edit'
    }, {
        key : 'delete',
        label : 'System.delete',
        icon : 'trash'
    }];*/
    static itemButtons = [ ];

    constructor(props, context)
    {
        super(props);

        context.i18n.register('SalesInvoiceList', translations);

        this.state = {
            columns : [ ],
            items : [ ],
            origItems : [ ],
            customerMap : null,
            supplierId : props.supplierId
        }

        this.salesInvoiceApi = new SalesInvoices();
    }

    componentDidMount()
    {
        this.loadCustomerData();

        this.setState({
            itemButtons : this.getTranslatedButtons(),
            columns : this.getTranslatedColumns()
        });

        this.reload();
    }

    componentWillReceiveProps(nextPops, nextContext)
    {
        this.context = nextContext;
        this.setState({
            itemButtons : this.getTranslatedButtons(),
            columns : this.getTranslatedColumns(),
            supplierId : nextPops.supplierId
        });
    }

    loadCustomerData()
    {
        const mapCusomters = (customers) =>
        {
            const results = { };
            customers.forEach(c => results[c.id] = c);

            return results;
        }

        return ajax.get('/customer/api/customers').then(res => res && res.body)
            .catch(res => { throw new Error((res.body && res.body.message) || res.body || res.message) })
            .then(customers => this.setState({ customerMap : mapCusomters(customers) }))
            .catch(e => this.context.showNotification(e.message, 'error', 10));
    }

    getTranslatedColumns()
    {
        const { i18n } = this.context;

        return SalesInvoiceList.columns.map(col => ({ key : col.key, name : i18n.getMessage(col.name) }))
    }

    getTranslatedButtons()
    {
        const { i18n } = this.context;

        return SalesInvoiceList.itemButtons.map(btn => ({ key : btn.key, label : i18n.getMessage(btn.label), icon : btn.icon }));
    }

    loadSalesInvoices()
    {
        const { supplierId } = this.state;
        const { i18n, showNotification, hideNotification } = this.context;

        const loadingMessage = showNotification(i18n.getMessage('SalesInvoiceList.notification.loading'));

        return this.salesInvoiceApi.getSalesInvoices(supplierId).then(this.props.onFilter).then(items =>
        {
            this.setState({ items, origItems : items });
            hideNotification(loadingMessage);
        })
        .catch(e =>
        {
            hideNotification(loadingMessage, 0);
            showNotification(e.message, 'error', 10);
        });
    }

    reload()
    {
        return this.loadSalesInvoices();
    }

    reset()
    {
        this.setState({ items : null });
    }

    filterItems(filterCallback)
    {
        const items = filterCallback(extend(true, [ ], this.state.origItems));
        this.setState({ items });
    }

    handleOnButtonClick(type, item)
    {}

    render()
    {
        const { customerMap, itemButtons, columns, items, origItems } = this.state;
        const { i18n } = this.context;
        const localItems = extend(true, [ ], items || origItems);
        const getCustomerName = (customerId) => customerId && customerMap[customerId] && customerMap[customerId].customerName;

        if(!customerMap)
            return null;

        localItems.forEach(item =>
        {
            item.customerName = getCustomerName(item.customerId);
            item.invoiceDateLabel = i18n.formatDate(item.invoiceDate);
            item.totalNetPriceLabel = i18n.formatDecimalNumber(item.totalNetPrice) + ' ' + item.currencyId;
        });

        return(
            <Components.ListTable
                columns={columns}
                items={localItems}
                itemButtons={itemButtons}
                onButtonClick={(...args) => this.handleOnButtonClick(...args)} />
        )
    }
}

export default SalesInvoiceList;
