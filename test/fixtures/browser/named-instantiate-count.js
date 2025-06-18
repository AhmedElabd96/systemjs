let instantiateCount = 0;

PentaSystem.register("named-instantiate-count", [], function (_export) {
  instantiateCount++;
  return {
    execute: function () {
      _export('getInstantiateCount', function () {
        return instantiateCount;
      });
    }
  };
});