import React, { Component, PropTypes } from 'react';
import { SidebarMenu, HeaderMenu } from 'ocbesbn-react-components';
import ajax from 'superagent-bluebird-promise';
import I18nManager from 'opuscapita-i18n/lib/utils/I18nManager';
import translations from './i18n';

class Layout extends Component
{
    static contextTypes = {
      locale: PropTypes.string
    };

    static childContextTypes = {
        i18n: PropTypes.object.isRequired,
        locale: React.PropTypes.string,
        setLocale: React.PropTypes.func
    };

    constructor(props)
    {
        super(props);

        this.state = {
            i18n : new I18nManager('en', [ ]),
            locale : 'en',
            currentUserData : { },
            dataLoaded : false
        };

        this.state.i18n.register('ServiceConfigFlow', translations);
    }

    getChildContext()
    {
        return {
            i18n: this.state.i18n,
            locale: this.state.locale,
            setLocale: this.setLocale
        };
    }

    setLocale = (locale) =>
    {
        var i18n = new I18nManager(locale, []);
        i18n.register('ServiceConfigFlow', translations);

        var currentUserData = this.state.currentUserData;
        currentUserData.languageId = locale;

        this.setState({
            i18n : i18n,
            locale : locale,
            currentUserData : currentUserData
        });

        return ajax.put('/user/users/current/profile')
            .set('Content-Type', 'application/json')
            .send({ languageId : locale })
            .then(data => ajax.post('/refreshIdToken').set('Content-Type', 'application/json').promise());
    }

    loadUserData()
    {
        return ajax.get('api/userdata').then(res => JSON.parse(res.text));
    }

    render()
    {
        if(this.state.dataLoaded)
        {
            return (
                <span>
                    <SidebarMenu isBuyer={ this.state.currentUserData.customerid } />
                    <section className="content">
                        <HeaderMenu currentUserData={ this.state.currentUserData } />
                        <div className="container-fluid" style={{ paddingLeft: '250px' }}>
                            <div>
                                { this.props.children }
                            </div>
                        </div>
                    </section>
                </span>
            );
        }
        else
        {
            this.loadUserData().then(userData =>
            {
                this.setState({ currentUserData : userData, dataLoaded : true });
                this.setLocale(userData.languageId);
            });

            return(<span></span>);
        }
    }
}

export default Layout;
