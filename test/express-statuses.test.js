var expect = require('chai').expect;
var statuses = require('../src/express-statuses');

describe('Express Statuses', function() {

  it('should be a function', function() {
    expect(statuses).to.be.a('function');
  });

  it('should have few random samples', function() {
    expect(statuses.OK).to.be.a('function');
    expect(statuses.OK.status).to.equal(200);
    expect(statuses.OK.message).to.equal('OK');
    expect(statuses.NOT_FOUND).to.be.a('function');
    expect(statuses.NOT_FOUND.status).to.equal(404);
    expect(statuses.NOT_FOUND.message).to.equal('Not Found');
    expect(statuses.INTERNAL_SERVER_ERROR).to.be.a('function');
    expect(statuses.INTERNAL_SERVER_ERROR.status).to.equal(500);
    expect(statuses.INTERNAL_SERVER_ERROR.message).to.equal('Internal Server Error');
  })

  it('should create with a status number', function() {
    var status = statuses(400);
    expect(status).to.be.a('function');
    expect(status.status).to.equal(400);
    expect(status.message).to.equal('Bad Request');
    expect(status.toString()).to.equal('[Status 400 Bad Request]');
    expect(status.toJSON()).to.eql({
      status: 400,
      message: 'Bad Request'
    })

    var override = new status('Override');
    expect(override).to.be.instanceof(Error);
    expect(override.stack).to.match(/^Status 400: Override$/m);
    expect(override.status).to.equal(400);
    expect(override.message).to.equal('Override');
    expect(override.toString()).to.equal('[Status 400 Bad Request: Override]');
    expect(override.toJSON()).to.eql({
      status: 400,
      message: 'Override'
    })
  })

  it('should create with an unknown status number', function() {
    var status = statuses(543);
    expect(status).to.be.a('function');
    expect(status.status).to.equal(543);
    expect(status.message).to.equal('Unknown');
    expect(status.toString()).to.equal('[Status 543 Unknown]');
    expect(status.toJSON()).to.eql({
      status: 543,
      message: 'Unknown'
    })

    var override = new status('Override');
    expect(override).to.be.instanceof(Error);
    expect(override.stack).to.match(/^Status 543: Override$/m);
    expect(override.status).to.equal(543);
    expect(override.message).to.equal('Override');
    expect(override.toString()).to.equal('[Status 543 Unknown: Override]');
    expect(override.toJSON()).to.eql({
      status: 543,
      message: 'Override'
    })
  })

  it('should create with an out-of-range status number', function() {
    var status = statuses(999);
    expect(status).to.be.a('function');
    expect(status.status).to.equal(500);
    expect(status.message).to.equal('Invalid status code (999)');
    expect(status.toString()).to.equal('[Status 500 Invalid status code (999)]');
    expect(status.toJSON()).to.eql({
      status: 500,
      message: 'Invalid status code (999)'
    })

    var override = new status('Override');
    expect(override).to.be.instanceof(Error);
    expect(override.stack).to.match(/^Status 500: Override$/m);
    expect(override.status).to.equal(500);
    expect(override.message).to.equal('Override');
    expect(override.toString()).to.equal('[Status 500 Invalid status code (999): Override]');
    expect(override.toJSON()).to.eql({
      status: 500,
      message: 'Override'
    })
  })

  it('should create with a bogus status (not a number)', function() {
    var status = statuses("foobar");
    expect(status).to.be.a('function');
    expect(status.status).to.equal(500);
    expect(status.message).to.equal('Status not numeric ("foobar")');
    expect(status.toString()).to.equal('[Status 500 Status not numeric ("foobar")]');
    expect(status.toJSON()).to.eql({
      status: 500,
      message: 'Status not numeric ("foobar")'
    })

    var override = new status('Override');
    expect(override).to.be.instanceof(Error);
    expect(override.stack).to.match(/^Status 500: Override$/m);
    expect(override.status).to.equal(500);
    expect(override.message).to.equal('Override');
    expect(override.toString()).to.equal('[Status 500 Status not numeric ("foobar"): Override]');
    expect(override.toJSON()).to.eql({
      status: 500,
      message: 'Override'
    })
  })

  it('should incorporate an error', function() {
    var error = new Error("The error message");

    var override = statuses.INTERNAL_SERVER_ERROR(error);
    expect(override).to.be.instanceof(Error);
    expect(override.stack).to.match(/^Status 500: Internal Server Error$/m);
    expect(override.stack).to.match(/^\s+Caused by Error: The error message$/m);
    expect(override.status).to.equal(500);
    expect(override.message).to.equal('Internal Server Error');
    expect(override.toString()).to.equal('[Status 500 Internal Server Error]');
    expect(override.toJSON()).to.eql({
      status: 500,
      message: 'Internal Server Error'
    })
  })

  it('should incorporate an object', function() {
    var error = new Error("The error message part deux");
    var details = { key: 'Some random details' };

    var override = statuses.INTERNAL_SERVER_ERROR({
      status: 200, // This will be ignored!
      message: 'Override message',
      details: details,
      error: error,
      junk: 12345
    });

    expect(override).to.be.instanceof(Error);
    expect(override.stack).to.match(/^Status 500: Override message$/m);
    expect(override.stack).to.match(/^\s+Caused by Error: The error message part deux$/m);
    expect(override.status).to.equal(500);
    expect(override.message).to.equal('Override message');
    expect(override.toString()).to.equal('[Status 500 Internal Server Error: Override message]');

    expect(override.toJSON()).to.eql({
      status: 500, // This can not be overridden
      message: 'Override message',
      details: details,
    });
  })

})
