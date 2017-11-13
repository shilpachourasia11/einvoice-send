import React, { PropTypes, Component } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import _ from 'underscore';
import request from 'superagent-bluebird-promise';
import { Line, LineChart, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import i18n from './i18n'

export default class ConnectSupplierWidget extends Components.ContextComponent
{
  static propTypes = {
    actionUrl: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired
  };

  constructor(props, context)
  {
    super(props);

    this.state = {
      inChannelContracts: []
    }

    context.i18n.register('CSWTranslations', i18n);
  };

  componentDidMount()
  {
    const { actionUrl, customerId } = this.props;
    request.get(`${actionUrl}/einvoice-send/api/config/inchannelcontracts/c_${customerId}`).
      set('Content-Type', 'application/json').
      then(response => {
        this.setState({ inChannelContracts: response.body });
        return Promise.resolve(null);
      }).
      catch(error => Promise.resolve(null));
  }

  getData()
  {
    if (_.isEmpty(this.state.inChannelContracts)) return [];

    const groupedContracts = _.groupBy(this.state.inChannelContracts, contract => {
      return new Date(contract.createdOn);
    });

    const mapped = _.map(groupedContracts, (contracts, date) => {
      return { date: date, "supplier count": contracts.length };
    });

    const sorted = _.sortBy(mapped, function(key_date) {
      return new Date(key_date.date);
    });

    return _.map(sorted, obj1 => {
      obj1.date = new Date(obj1.date).toLocaleDateString(this.props.locale || 'en');
      return obj1;
    });
  }

  render()
  {
    const i18n = this.context.i18n;

    return (
      <LineChart
        data={this.getData()}
        width={500}
        height={300}
        margin={{ top: 5, bottom: 5, left: 0, right: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <Legend />
        <XAxis label="Dates" dataKey="date" padding={{left: 20, right: 20}}/>
        <YAxis padding={{top: 20}}/>
        <Line type="stepAfter" dataKey='supplier count' name={i18n.getMessage('CSWTranslations.supplierCount')} stroke="#5E9CD3" />
      </LineChart>
    )
  }
}
