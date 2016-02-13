/*
  SSL Fingerprint Verifier - By Louis T. ( https://ltdev.im/ )
  
  Place this file in ./server_modules/
  Add fingerprints array to config.js under client.

  Example:
    conf.client = {
        server: 'irc.server.tld',
        port:    6697,
        ssl:     true,
        fingerprints: [
            'D1:AE:AC:98:35:...','...'
        ],
        .....
    };
*/
var util = require('util'),
    config = require('../config'),
    fingerprints = (config.production.client.fingerprints||[]),
    kiwiModules = require('../server/modules'),
    module = new kiwiModules.Module('sslfingerprints');

module.on('irc authorize', function (event, data) {
    if (data.connection.ssl) {
       event.wait = true;
       try {
          var ssldata = data.connection.socket.getPeerCertificate();
          if (ssldata.fingerprint && fingerprints.some(function (elm, idx, val) { return ssldata.fingerprint == val; })) {
             event.callback();
           } else {
             data.connection.requested_disconnect = true;
             var err = new Error('Invalid SSL Fingerprint (' + (ssldata.fingerprint||'UNKNOWN') + ')');
             err.code = 'InvalidFingerprint';
             event.preventDefault();
             event.callback();
             data.connection.emit('error', err);
          }
        } catch (err) {
          data.connection.requested_disconnect = true;
          event.preventDefault();
          event.callback();
          data.connection.emit('error', err);
       }
    }
});
