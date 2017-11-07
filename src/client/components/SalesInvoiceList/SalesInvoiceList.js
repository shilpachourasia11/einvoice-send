import React from 'react';
import PropTypes from 'prop-types';
import { Components } from '@opuscapita/service-base-ui';
import SalesInvoices from '../../api/SalesInvoices.js';
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
            key : 'campaignId',
            name : 'SalesInvoiceList.header.campaignId'
        }, {
            key : 'startsOn',
            name : 'SalesInvoiceList.header.startsOn'
        }, {
            key : 'endsOn',
            name : 'SalesInvoiceList.header.endsOn'
        }, {
            key : 'status',
            name : 'SalesInvoiceList.header.status'
        }, {
            key : 'campaignType',
            name : 'SalesInvoiceList.header.campaignType'
        }
    ];

    static itemButtons = [{
        key : 'edit',
        label : 'System.edit',
        icon : 'edit'
    }, {
        key : 'delete',
        label : 'System.delete',
        icon : 'trash'
    }];

    constructor(props, context)
    {
        super(props);

        context.i18n.register('SalesInvoiceList', translations);

        this.state = {
            columns : [ ],
            items : [ ],
            origItems : [ ],
            supplierId : props.supplierId
        }

        this.salesInvoiceApi = new SalesInvoices();
    }

    componentDidMount()
    {
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
        const { itemButtons, columns, items, origItems } = this.state;
        const localItems = items || origItems;

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
