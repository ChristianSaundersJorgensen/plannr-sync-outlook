// Decides which client address to chase and builds the Plannr Sync link.
// Kept free of Office.js so it can be tested in Node (see tests/).
(function (root) {
  'use strict';

  // The PC app's address. It must match the port Plannr Sync is installed on.
  var APP = 'http://127.0.0.1:8773';

  function norm(address) {
    return typeof address === 'string' ? address.trim() : '';
  }

  // from: the sender's address; me: the mailbox owner's address;
  // to: the recipients' addresses, in order. Returns '' when there is no
  // client to chase (never the owner's own address).
  function pickChaseAddress(from, me, to) {
    var sender = norm(from);
    var owner = norm(me).toLowerCase();
    if (sender && sender.toLowerCase() !== owner) return sender;
    // An email you sent (e.g. in Sent Items): chase its first recipient
    // who is not you.
    var list = Array.isArray(to) ? to : [];
    for (var i = 0; i < list.length; i++) {
      var r = norm(list[i]);
      if (r && r.toLowerCase() !== owner) return r;
    }
    return '';
  }

  function buildChaseUrl(address) {
    return APP + '/chase?email=' + encodeURIComponent(address);
  }

  var api = { APP: APP, pickChaseAddress: pickChaseAddress, buildChaseUrl: buildChaseUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PlannrChase = api;
})(this);
