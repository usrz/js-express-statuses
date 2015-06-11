'use strict';

var byCode = {};
var byName = {};

// The status maker...
function maker(code, message) {
  function Status(object) {
    if (! (this instanceof Status)) return new Status(object);

    var msg = message, det, err, str = message;

    if (object) {
      if (typeof(object) === 'string') {
        msg = object;
        str += ': ' + msg;
      } else if (object instanceof Error) {
        err = object;
      } else {
        if (object.message) {
          msg = object.message;
          str += ': ' + msg;
        }
        if (object.details) det = object.details;
        if (object.error)   err = object.error;
      }
    }

    if (msg) this.message = msg;
    if (det) this.details = det;
    if (err) this.error   = err;

    Object.defineProperty(this, 'toString', {
      enumerable: false,
      configurable: false,
      value: function() {
        return '[Status ' + this.status + ' ' + str + ']';
      }
    });

    Error.captureStackTrace(this, Status);
    if (err) {
      var stack = this.stack || this.toString();
      if (err instanceof Error) {
        stack += '\n  Caused by ' + (err.stack || err.toString());
      } else {
        stack += '\n  Caused by [' + typeof (err) + '] ' + err.toString();
      }
      Object.defineProperty(this, 'stack', {
        enumerable:   false,
        configurable: false,
        value:        stack
      });
    }
  }

  Status.prototype = new Error();
  Status.prototype.name = 'Status ' + code;
  Status.prototype.status   = Status.status  = code;
  Status.prototype.message  = Status.message = message;
  Status.prototype.toString = Status.toString = function() {
    return '[Status ' + this.status + ' ' + this.message + ']';
  }
  Status.prototype.toJSON = Status.toJSON = function() {
    var json = { status: this.status, message: this.message }
    if (this.details) json.details = JSON.parse(JSON.stringify(this.details));
    return json;
  }
  return Status;
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
    return byCode[code] || maker(code, 'Unknown');
  }
};

/* Copy all our names */
for (var i in byName) exports[i] = byName[i];
