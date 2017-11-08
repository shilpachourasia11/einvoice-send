import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import SalesInvoiceList from '../components/SalesInvoiceList';

class SalesInvoiceSearch extends Components.ContextComponent
{
    render()
    {
        return(
            <div className="row">
                <div className="col-xs-12">
                    <SalesInvoiceList />
                </div>
            </div>
        )
    }
}

export default SalesInvoiceSearch;
