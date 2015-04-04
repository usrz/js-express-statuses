'use strict';

var byCode = {};
var byName = {};

// The status maker...
function maker(code, message) {
  var made = function(object) {
    var status = { status: code, message: message };
    var string = '';


    if (object) {
      if (typeof(object) === 'string') {
        status.message = object;
        string = ': ' + object;
      } else if (object instanceof Error) {
        status.error = object;
      } else {
        if (object.message) {
          status.message = object.message;
          string = ': ' + object;
        }
        if (object.details) status.details = object.details;
        if (object.error)   status.error   = object.error;
      }
    }

    status.toString = function() {
      return this.status + " " + message + string;
    }

    return status;
  }

  made.status = code;
  made.message = message;
  made.toString = function() {
    return this.status + " " + this.message;
  }
  return made;
};

// Loop through all known statuses
var statuses = require('statuses');
for (var i = 0; i < statuses.codes.length; i ++) {
  var code = statuses.codes[i];
  var message = statuses[code];
  var name = message.replace(/'m/ig, ' am') // I'm a teapot :)
                    .replace(/[- \(\)]+/ig, '_')
                    .toUpperCase();

  // Make our new status function
  byCode[code] = byName[name] = maker(code, message);
}

/* Our exports */
exports = module.exports = function get(status) {
  var code = Number.parseInt(status);
  if (Number.isNaN(code)) {
    return maker(500, 'Status not numeric (' + JSON.stringify(status) + ')');
  } else if ((code < 100) || (code > 599)) {
    return maker(500, 'Invalid status code (' + code + ')');
  } else {
    return byCode[code] || maker(code, "Unknown");
  }
};

/* Copy all our names */
for (var i in byName) exports[i] = byName[i];
