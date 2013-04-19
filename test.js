var child_process  = require('child_process')
  , events         = require('events')
  , chai           = require('chai')
  , expect         = chai.expect
;

chai.use(require('sinon-chai'));
require('mocha-sinon');

describe("connect git-sha", function() {
  beforeEach(function() {
    this.fakeChild = {
      stdout:   new events.EventEmitter()
    };

    this.sinon.stub(child_process, 'spawn', function(){
      return this.fakeChild;
    }.bind(this));
  });

  describe("module", function() {
    it("returns a middlware handler generator", function() {
      var module = require('./index.js');
      expect(module).to.be.a('function');

      var middleware = module();

      expect(middleware).to.be.a('function');
      expect(middleware.length).to.equal(3);
    });

    it("gets the current git SHA", function() {
      var module = require('./index.js');

      module();

      expect(child_process.spawn).to.have.been.calledWith('/usr/bin/env', ['git', 'rev-parse', 'HEAD']);
    });
  });

  describe("middleware", function() {
    beforeEach(function() {
      this.middleware = require('./index.js')();

      this.fakeRes = {
        setHeader: this.sinon.spy()
      };
    });

    describe("when the call to get has not yet returned", function() {
      it("does not annotate the request", function(done) {
        this.middleware({}, this.fakeRes, function(err){
          expect(err).to.not.exist;
          expect(this.fakeRes.setHeader).to.not.have.been.called;

          done();
        }.bind(this));
      });
    });

    describe("once the call to git has returned", function() {
      beforeEach(function() {
        this.fakeChild.stdout.emit('data', 'a git sha\n');
      });

      it("annotates each request with the current git-sha", function(done) {
        this.middleware({}, this.fakeRes, function(err){
          expect(this.fakeRes.setHeader).to.have.been.calledWith('X-Git-SHA', 'a git sha');

          done();
        }.bind(this));
      });
    });

    describe("when not faking things", function() {
      beforeEach(function() {
        child_process.spawn.restore();
        this.middleware = require('./index.js')();
      });

      it("works IRL", function(done) {
        var timeToWaitForGit = 500;

        setTimeout(function(){
          this.middleware({}, this.fakeRes, function(err){
            expect(this.fakeRes.setHeader).to.have.been.calledWithMatch('X-Git-SHA', /^[0-9a-f]+$/);

            done();
          }.bind(this));
        }.bind(this), timeToWaitForGit);
      });
    });
  });
});
