import ajax from 'superagent-bluebird-promise';

class SalesInvoices
{
    getSalesInvoices(supplierId)
    {
        return ajax.get('/sales-invoice/api/salesinvoices').then(res => res && res.body)
            .catch(res => { throw new Error((res.body && res.body.message) || res.body || res.message) })
    }
}

export default SalesInvoices;
