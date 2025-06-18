let instantiateCount = 0;

PentaSystem.register("named-self-import", ["named-self-import/dep"], function (_export) {
  instantiateCount++;
  var dep;

  return {
    setters: [
      function (d) {
        dep = d;
      }
    ],
    execute: function () {
      dep.method();

      _export('getInstantiateCount', function () {
        return instantiateCount;
      });
    }
  };
});

PentaSystem.register("named-self-import/dep", [], function (_export) {
  return {
    execute: function () {
      _export("method", function () {
        return 1;
      });
    }
  };
});
