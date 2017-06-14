let settings = {};
settings.label = 'Settings';

let company = {};
company.label = 'Company';
company.profile = 'Profile';
company.serviceConfiguration = 'Service Configuration';
company.companyInformation = 'Company Information';

let rfg = {};
rfg.label = 'RfQ';
rfg.viewRfQs = 'View RfQs';

let products = {};
products.label = 'Products';

let otherDocs = {};
otherDocs.label = 'Other Docs';

let invoice = {};
invoice.label = 'Invoice';
invoice.inspect = 'Inspect';
invoice.createNew = 'Create New';

let orders = {};
orders.label = 'Orders';
orders.OrderConfirmation = 'Order Confirmation';
orders.OrderHistory = 'Order History';
orders.poDownload = 'PO Download';

export default {
  SidebarMenu: {
    home: 'Home',
    orders: orders,  
    invoice: invoice,
    otherDocs: otherDocs,
    products: products,
    rfg: rfg,
    company: company,
    settings: settings
  }
}

