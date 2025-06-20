suite('Transform Loader', function() {
  let translateCnt = 0;

  suiteSetup(function() {
    return PentaSystem.import('../../dist/extras/transform.js').then(function() {
      PentaSystem = new PentaSystem.constructor();
      PentaSystem.transform = function (url, source) {
        translateCnt++;
        return source;
      };
    });
  });

  const supportsWebAssembly = typeof WebAssembly !== 'undefined' && typeof process === 'undefined';

  suite('SystemJS standard tests', function () {

    test('String encoding', function () {
      return PentaSystem.import('./fixtures/browser/string-encoding.js').then(function (m) {
        assert.equal(m.pi, decodeURI('%CF%80'));
        assert.equal(m.emoji, decodeURI('%F0%9F%90%B6'));
      });
    });

    test('Package maps', function () {
      return Promise.all([
        PentaSystem.resolve('a'),
        PentaSystem.resolve('f'),
        PentaSystem.resolve('a/b'),
        PentaSystem.resolve('b/c'),
        PentaSystem.resolve('b.js'),
        PentaSystem.resolve('b.js/c'),
        PentaSystem.resolve('g/x')
      ]).then(function (a) {
        assert.equal(a[0], rootURL + 'b');
        assert.equal(a[1], 'a:');
        assert.equal(a[2], baseURL + 'fixtures/browser/a/b');
        assert.equal(a[3], rootURL + 'd/c');
        assert.equal(a[4], 'http://jquery.com/jquery.js');
        assert.equal(a[5], 'http://jquery.com/c');
        assert.equal(a[6], 'https://site.com/x');
      });
    });

    test('Contextual package maps', function () {
      return PentaSystem.import('fixtures/scope-test/index.js')
      .then(function (m) {
        assert.equal(m.mapdep, 'mapdep');
      });
    });

    test('Loading named PentaSystem.register fails', function () {
      return PentaSystem.import('fixtures/named-register.js')
      .then(function () {
        assert.fail('Should fail');
      })
      .catch(function (err) {
        assert.ok(err);
      });
    });

    test('Global script loading', function () {
      return PentaSystem.import('fixtures/global4.js').then(function (m) {
        assert.equal(m.default, 'global4');
      });
    });

    test('Contextual dynamic import', function () {
      return PentaSystem.import('fixtures/dynamic-import-register.js').then(function (m) {
        return m.lazy();
      })
      .then(function (lazyValue) {
        assert.equal(lazyValue, 5);
      });
    });

    if (supportsWebAssembly)
    test('Loading WASM', function () {
      return PentaSystem.import('fixtures/wasm/example.wasm')
      .then(function (m) {
        assert.equal(m.exampleExport(1), 2);
      });
    });

    test('Verification', function () {
      const expected = supportsWebAssembly ? 8 : 7;
      assert.equal(translateCnt, expected);
    });
  });
});
