/* eslint-env mocha */
/* eslint import/no-extraneous-dependencies:0 */

const assert = require('assert');
const equal = require('assert-dir-equal');
const exec = require('child_process').exec;
const path = require('path');

const fixture = path.resolve.bind(path, __dirname, 'fixtures');


describe('Metalsmith CLI', () => {
  const bin = `node ${path.resolve(__dirname, '../bin/metalsmith')}`;

  describe('build', () => {
    it('should error without a metalsmith.json', (done) => {
      exec(bin, { cwd: fixture('cli-no-config') }, (err) => {
        assert(err);
        assert(~err.message.indexOf('could not find a metalsmith.json configuration file.'));
        done();
      });
    });

    it('should grab config from metalsmith.json', (done) => {
      exec(bin, { cwd: fixture('cli-json') }, (err, stdout) => {
        if (err) {
          return done(err);
        }
        equal(fixture('cli-json/destination'), fixture('cli-json/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-json/destination')));
        return done();
      });
    });

    it('should grab config from a config.json', (done) => {
      exec(`${bin} -c config.json`, { cwd: fixture('cli-other-config') }, (err, stdout) => {
        if (err) {
          return done(err);
        }
        equal(fixture('cli-other-config/destination'), fixture('cli-other-config/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-other-config/destination')));
        return done();
      });
    });

    it('should require a plugin', (done) => {
      exec(bin, { cwd: fixture('cli-plugin-object') }, (err, stdout) => {
        if (err) {
          return done(err);
        }
        equal(fixture('cli-plugin-object/build'), fixture('cli-plugin-object/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-plugin-object/build')));
        return done();
      });
    });

    it('should require plugins as an array', (done) => {
      exec(bin, { cwd: fixture('cli-plugin-array') }, (err, stdout) => {
        if (err) {
          return done(err);
        }
        equal(fixture('cli-plugin-array/build'), fixture('cli-plugin-array/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-plugin-array/build')));
        return done();
      });
    });

    it('should error when failing to require a plugin', (done) => {
      exec(bin, { cwd: fixture('cli-no-plugin') }, (err) => {
        assert(err);
        assert(~err.message.indexOf('failed to require plugin "metalsmith-non-existant".'));
        done();
      });
    });

    it('should error when failing to use a plugin', (done) => {
      exec(bin, { cwd: fixture('cli-broken-plugin') }, (err) => {
        assert(err);
        assert(~err.message.indexOf('error using plugin "./plugin"...'));
        assert(~err.message.indexOf('Break!'));
        assert(~err.message.indexOf('at module.exports'));
        done();
      });
    });

    it('should allow requiring a local plugin', (done) => {
      exec(bin, { cwd: fixture('cli-plugin-local') }, (err, stdout) => {
        equal(fixture('cli-plugin-local/build'), fixture('cli-plugin-local/expected'));
        assert(~stdout.indexOf('successfully built to '));
        assert(~stdout.indexOf(fixture('cli-plugin-local/build')));
        done();
      });
    });
  });
});
