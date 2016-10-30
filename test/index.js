/* eslint-env mocha */
/* eslint no-var:0, no-bitwise:0, prefer-arrow-callback:0, prefer-template:0, func-names: 0, space-before-function-paren:0, space-before-blocks:0 */

var assert = require('assert');
var equal = require('assert-dir-equal');
var exec = require('child_process').exec;
var path = require('path');
var fixture = path.resolve.bind(path, __dirname, 'fixtures');


describe('Metalsmith CLI', function(){
  var bin = 'node ' + path.resolve(__dirname, '../bin/metalsmith');

  describe('build', function(){
    it('should error without a metalsmith.json', function(done){
      exec(bin, { cwd: fixture('cli-no-config') }, function(err, stdout){
        assert(err);
        assert(~err.message.indexOf('could not find a metalsmith.json configuration file.'));
        done();
      });
    });

    it('should grab config from metalsmith.json', function(done){
      exec(bin, { cwd: fixture('cli-json') }, function(err, stdout){
        if (err) return done(err);
        equal(fixture('cli-json/destination'), fixture('cli-json/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-json/destination')));
        done();
      });
    });

    it('should grab config from a config.json', function(done){
      exec(bin + ' -c config.json', { cwd: fixture('cli-other-config') }, function(err, stdout){
        if (err) return done(err);
        equal(fixture('cli-other-config/destination'), fixture('cli-other-config/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-other-config/destination')));
        done();
      });
    });

    it('should require a plugin', function(done){
      exec(bin, { cwd: fixture('cli-plugin-object') }, function(err, stdout, stderr){
        if (err) return done(err);
        equal(fixture('cli-plugin-object/build'), fixture('cli-plugin-object/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-plugin-object/build')));
        done();
      });
    });

    it('should require plugins as an array', function(done){
      exec(bin, { cwd: fixture('cli-plugin-array') }, function(err, stdout){
        if (err) return done(err);
        equal(fixture('cli-plugin-array/build'), fixture('cli-plugin-array/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-plugin-array/build')));
        done();
      });
    });

    it('should error when failing to require a plugin', function(done){
      exec(bin, { cwd: fixture('cli-no-plugin') }, function(err){
        assert(err);
        assert(~err.message.indexOf('failed to require plugin "metalsmith-non-existant".'));
        done();
      });
    });

    it('should error when failing to use a plugin', function(done){
      exec(bin, { cwd: fixture('cli-broken-plugin') }, function(err){
        assert(err);
        assert(~err.message.indexOf('error using plugin "./plugin"...'));
        assert(~err.message.indexOf('Break!'));
        assert(~err.message.indexOf('at module.exports'));
        done();
      });
    });

    it('should allow requiring a local plugin', function(done){
      exec(bin, { cwd: fixture('cli-plugin-local') }, function(err, stdout, stderr){
        equal(fixture('cli-plugin-local/build'), fixture('cli-plugin-local/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-plugin-local/build')));
        done();
      });
    });
  });
});
