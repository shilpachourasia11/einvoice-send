import React from 'react';
import { Containers } from '@opuscapita/service-base-ui';
import { Route } from 'react-router';
import Frame from './Frame.react';

class Main extends React.Component
{
    render()
    {
        return(
            <Containers.ServiceLayout serviceName="einvoice-send">
                <Route path="*" component={Frame} />
            </Containers.ServiceLayout>
        );
    }
}

export default Main;
