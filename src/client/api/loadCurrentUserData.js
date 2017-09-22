import ajax from 'superagent-bluebird-promise';
module.exports.get = () => {
  return ajax.get(`/invoice/api/currentUserData`)
  	.set('Accept', 'application/json')
  	.promise()
};