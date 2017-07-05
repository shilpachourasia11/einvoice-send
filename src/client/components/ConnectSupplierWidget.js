import React from 'react';
import { Line, LineChart, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';

export default class ConnectSupplierWidget extends React.Component
{
  getData()
  {
    return [{date: '01.07.2017', supplier_count: 3 }, {date: '03.07.2017', supplier_count: 6 }, {date: '04.07.2017', supplier_count: 2 }];
  }

  render()
  {
    return (
      <LineChart
        data={this.getData()}
        width={500}
        height={300}
        margin={{ top: 5, bottom: 5, left: 0, right: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <Legend />
        <XAxis label="Dates" dataKey="month"/>
        <YAxis />
        <Line type="stepAfter" dataKey="supplier_count" stroke="#5E9CD3" />
      </LineChart>
    )
  }
}
