import React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import Countries from './Countries';

export default () => (
  <div>
    <Route path="/" component={Home}/>
    <Route path="/countries" component={Countries}/>
  </div>
)
