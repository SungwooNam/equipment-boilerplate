var request = require('request');

module.exports = {
    calculate: function( subtotal, state, done ) {
      request.post( {
        url : "https://some-tax-services.com/request",
        method : 'POST',
        json : {
          subtotal : subtotal
        }
      }, function( error, response, body) {
        done(body);
      });
    }
  };