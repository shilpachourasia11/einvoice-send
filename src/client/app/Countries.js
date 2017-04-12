import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';

export default class Countries extends Component {
  constructor(props)
  {
      super(props);
      this.changeButtonInput = this.changeButtonInput.bind(this);
      this.state = {
          countries_text: 'Initial state'
      };
  }

  changeButtonInput(e) {
    this.setState({ countries_text: 'State Changed!'});
  }

  render() {
    let countries = [{ name: 'Finland' }, { name: 'Germany' }];

    return (
      <div>
        <div className={`'col-sm-6 col-md-4'`}>
          {countries.map((country, index) =>
            <div key={index}>
              <span className="buttonCountry label label-danger">{ country.name }</span>
              <Button bsStyle="success" bsSize="small" onClick={this.changeButtonInput}>
                Click here again
              </Button>
              <div>{this.state.countries_text}</div>
            </div>
          )}
        </div>
        <br/>
      </div>
    );
  }
}
