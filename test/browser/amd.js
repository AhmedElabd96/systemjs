suite('AMD tests', function () {
  suiteSetup(function() {
    return PentaSystem.import('../../dist/extras/amd.js').then(function() {});
  });

  test('Multiple Errors', function () {
    window.onerror = undefined;
    return PentaSystem.import('fixtures/amd-error.js').then(function (m) {
      assert.fail('Should fail');
    }, function (err) {
      assert.ok(err);
      return PentaSystem.import('fixtures/amd-ok.js')
      .then(function (m) {
        assert.ok(m);
      });
    });
  });

  test('Loading an AMD module', function () {
    return PentaSystem.import('fixtures/amd-module.js').then(function (m) {
      assert.ok(m.default);
      assert.equal(m.default.amd, true);
      assert.equal(m.default.dep.amd, 'dep');
    });
  });

  test('Loading an AMD module with ES module dep', function () {
    return PentaSystem.import('fixtures/amd-module-esm-dep.js').then(function (m) {
      assert.ok(m.default);
      assert.equal(m.default.esm, 'export');
      assert.equal('default' in m.default, false);
    });
  });

  test('Loading AMD exports dependency', function () {
    return PentaSystem.import('fixtures/amd-exports.js').then(function (m) {
      assert.ok(m.default);
      assert.equal(m.default.test, 'hi');
      assert.equal(m.default.dep.amd, 'dep');
      assert.equal(m.default.mod.amd, true);
    });
  });

  test('AMD Circular', function () {
    return PentaSystem.import('fixtures/amd-circular1.js').then(function (m) {
      assert.ok(m.default);
      assert.equal(m.default.outFunc(), 5);
    });
  });

  test('Loading an AMD named define', function () {
    return PentaSystem.import('fixtures/nameddefine.js').then(function (m1) {
      assert.ok(m1.default);
      assert.equal(m1.default.another, 'define');
    });
  });

  test('Loading an AMD bundle with multiple anonymous defines', function () {
    return PentaSystem.import('fixtures/multiple-anonymous.js').then(function (m) {
      assert.ok(m.default);
      assert.equal(m.default.anon, true);
    });
  });

  test('AMD falls back to global support', function () {
    return PentaSystem.import('fixtures/global2.js').then(function (m) {
      assert.equal(m.default, 'hi');
    });
  });

  test('loading single named AMD module after manually calling define. See https://github.com/systemjs/systemjs/issues/2026#issuecomment-532022465', function () {
    define('inline-define', [], function () {
      return "inline define value";
    });
    return PentaSystem.import('fixtures/amd-named-simple.js').then(function (m) {
      assert.equal(m.default, "AMD Simple");
    });
  });

  test('Loading an AMD module which returns a false value', function () {
    return PentaSystem.import('fixtures/amd-false-module.js').then(function (m) {
      assert.equal(m.default, false);
    });
  });

  // https://github.com/systemjs/systemjs/issues/2332
  test('loading an AMD module that sets module.exports to null', function () {
    return PentaSystem.import('fixtures/amd-null-module.js').then(function (m) {
      assert.equal(m.default, null);
    });
  });

  test('Has access to module.uri (context meta)', function () {
    return PentaSystem.import('fixtures/amd-module-meta.js').then(function (m) {
      assert.ok(m.default);
      assert.equal(m.default.uri, baseURL+'fixtures/browser/amd-module-meta.js');
    });
  });

  test('Throws an error when define() is called incorrectly', () => {
    try {
      define("strings are invalid amd modules");
      assert.fail("define(str) should throw");
    } catch (err) {
      assert.equal(err.message.indexOf('Invalid call to AMD define') >= 0, true);
    }

    try {
      define(1234);
      assert.fail("define(num) should throw");
    } catch (err) {
      assert.equal(err.message.indexOf('Invalid call to AMD define') >= 0, true);
    }
  });
});