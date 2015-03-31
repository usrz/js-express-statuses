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
    var status = statuses(404);
    expect(status).to.be.a('function');
    expect(status.status).to.equal(404);
    expect(status.message).to.equal('Not Found');

    expect(status('Override')).to.eql({ status: 404, message: 'Override' });
  })

  it('should create with an unknown status number', function() {
    var status = statuses(543);
    expect(status).to.be.a('function');
    expect(status.status).to.equal(543);
    expect(status.message).to.equal('Unknown');

    expect(status('Override')).to.eql({ status: 543, message: 'Override' });
  })

  it('should create with an out-of-range status number', function() {
    var status = statuses(999);
    expect(status).to.be.a('function');
    expect(status.status).to.equal(500);
    expect(status.message).to.equal('Invalid status code (999)');

    expect(status('Override')).to.eql({ status: 500, message: 'Override' });
  })

  it('should create with a bogus status (not a number)', function() {
    var status = statuses("foobar");
    expect(status).to.be.a('function');
    expect(status.status).to.equal(500);
    expect(status.message).to.equal('Status not numeric ("foobar")');

    expect(status('Override')).to.eql({ status: 500, message: 'Override' });
  })

  it('should incorporate an error', function() {
    var error = new Error("The error message");
    expect(statuses.INTERNAL_SERVER_ERROR(error)).to.eql({
      status: 500,
      message: 'Internal Server Error',
      error: error
    });
  })

  it('should incorporate an object', function() {
    var error = new Error("The error message");
    var details = { key: 'Some random details' };
    expect(statuses.INTERNAL_SERVER_ERROR({
      status: 200, // This will be ignored!
      message: 'Override message',
      details: details,
      error: error,
      junk: 12345
    })).to.eql({
      status: 500, // This can not be overridden
      message: 'Override message',
      details: details,
      error: error
    });
  })

})
