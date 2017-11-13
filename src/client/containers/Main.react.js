import React from 'react';
import { Containers } from '@opuscapita/service-base-ui';
import { Route } from 'react-router';
import KeyIn from './KeyIn';
import SalesInvoiceSearch from './SalesInvoiceSearch';
import Frame from './Frame.react';

class Main extends React.Component
{
    render()
    {
        return(
            <Containers.ServiceLayout serviceName="einvoice-send">
                <Route path="/key-in/:blobFolder/:pdfName" component={KeyIn} />
                <Route path="/key-in" component={KeyIn} />
                <Route path="/invoice-search" component={SalesInvoiceSearch} />
                <Route path="*" component={Frame} />
            </Containers.ServiceLayout>
        );
    }
}

export default Main;
