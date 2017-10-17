import React, { PropTypes } from 'react';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import ajax from 'superagent-bluebird-promise';

export default class KeyIn extends React.Component {

    static contextTypes = {
        currentUserData : React.PropTypes.object.isRequired,
        showNotification : React.PropTypes.func.isRequired
    };

    render() {
        const user = this.context.currentUserData;
        const propArray = Object.entries(user);

console.log("showNotification: ", this.context.showNotification);

        return (
            <div>
                <h1>eInvoice Test Component</h1>

                <h2>Hello {user.lastname || user.id}</h2>
                <br/>
                {this.context.showNotification("Hello, this is a notification Test!", "info")}
                <br/>
                <b>Your CurrentUserData (this.context.currentUserData):</b>
                <br/>
                <table>
                    {propArray.map(prop => {
                        return (
                            <tr><td>{prop[0]}</td><td>{prop[1]}</td></tr>
                        )
                    })}
                </table>
            </div>
        )
    }

}
