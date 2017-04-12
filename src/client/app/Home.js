import React from 'react';
import styles from './Home.css';
import { Button } from 'react-bootstrap';
import request from 'superagent';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';
import Iframe from 'react-iframe';


let LoadableCountries = Loadable({
  loader: () => import('./Countries'),
  LoadingComponent: () => null
});

export default class Home extends React.Component
{
    constructor(props)
    {
        super(props);
        this.fetchHelloWorld = this.fetchHelloWorld.bind(this);
        this.state = {
            showComponent: false
        };
    }

    fetchHelloWorld() {
      this.setState({ showComponent: true })
    }

    render()
    {
        return (
            <div>
                <div className={styles.app}>
                    bar
                </div>
                <Button bsStyle="success" bsSize="small" onClick={this.fetchHelloWorld}>
                  Click here
                </Button>
                {this.state.showComponent && <LoadableCountries/>}
                <ul role="nav">
                  <li><Link to="/countries">Countries Link</Link></li>
                </ul>
                <Iframe url="/"
                    width="450px"
                    height="450px"
                    display="initial"
                    position="relative"/>
            </div>
        );
    }
}
