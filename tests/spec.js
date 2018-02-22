const Application = require('spectron').Application
const assert = require('assert')
const electron = require('electron')
const path = require( 'path')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect; // we are using the "expect" style of Chai


var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var appPath = path.join(__dirname, '..');

var app = new Application( {
    path : electronPath,
    args : [appPath]
});

console.log(electronPath)
console.log(appPath)

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe( 'Application launch', function() {
    this.timeout(10000);

    beforeEach( function(){
        return app.start();
    })

    afterEach( function(){
        return app.stop();
    });


    it('opens a window', function () {
        return app.client.waitUntilWindowLoaded()
          .getWindowCount().should.eventually.equal(1);
      });
    
      it('tests the title', function () {
        return app.client.waitUntilWindowLoaded()
          .getTitle().should.eventually.equal('Hello World!');
      });
});