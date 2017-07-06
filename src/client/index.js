import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import ConnectSupplierWidget from './components/ConnectSupplierWidget.js';


ReactDOM.render(<ConnectSupplierWidget actionUrl='http://localhost:8080' customerId='4' locale='de' />, document.getElementById('root'));
