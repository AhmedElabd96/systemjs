PentaSystem.register('a', ['b'], function (exports) {
  var b;
  return {
    setters: [function (m) {
      b = m.b;
    }],
    execute: function () {
      exports({
        a: b
      });
    }
  };
});

PentaSystem.register('b', [], function (exports) {
  return {
    execute: function () {
      exports({
        b: 'b'
      });
    }
  };
});