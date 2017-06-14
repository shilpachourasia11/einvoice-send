import React, { Component, PropTypes } from 'react';
import HeaderMenu from './components/HeaderMenu';
import { SidebarMenu } from 'ocbesbn-react-components';

class Layout extends Component
{
    render()
    {
        return (
            <span>
                <SidebarMenu />
                <section className="content">
                    <HeaderMenu/>
                    <div className="container-fluid" style={{ paddingLeft: '250px' }}>
                        <div>
                            { this.props.children }
                        </div>
                    </div>
                </section>
            </span>
        );
    }
}

export default Layout;
