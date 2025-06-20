const appendImportMap = function (moduleId, src) {
  const script = document.createElement('script');
  script.type = 'pentasystemjs-importmap';

  if (src) {
    script.async = true; // avoid theoretical timing issues
    script.src = src;
  }

  if (moduleId) {
    var map = { imports: {} };
    map.imports[moduleId] = 'fixtures/esm.js';
    script.textContent = JSON.stringify(map);
  }

  container.appendChild(script);
  return script;
};

const importAfterImportMap = function (id) {
  return new Promise(function (resolve) { setTimeout(resolve, 10); }).then(function () {
    return PentaSystem.import(id);
  });
};

const importNonExistent = function (id) {
  return PentaSystem.import(id)
  .catch(function (err) { return err })
  .then(function (result) {
    if (!(result instanceof Error)) {
      throw new Error('Unexpected mapping found for module "' + id + '"');
    }
  });
}

let container;

suite('Dynamic import maps', function () {
  suiteSetup(function () {
    return PentaSystem.import('../../dist/extras/dynamic-import-maps.js')
  });

  setup(function () {
    container = document.createElement('div');
    container.id = 'importmap-container';
    document.body.appendChild(container);
  });

  teardown(function () {
    container.parentNode.removeChild(container);
  });

  test('Loading newly added elements (inline)', function () {
    const moduleId = 'dynamic-inline-map-1';
    return importNonExistent(moduleId)
    .then(function () {
      appendImportMap(moduleId);
      return importAfterImportMap(moduleId);
    });
  });

  test('Loading newly added elements (external)', function () {
    const moduleId = 'dynamic-external-map-1';
    return importNonExistent(moduleId)
    .then(function () {
      appendImportMap(null, 'fixtures/browser/dynamic-importmap1.json');
      return importAfterImportMap(moduleId);
    });
  });

  test('Loading manually added import map', function () {
    const moduleId = 'manual-map-1';
    return importNonExistent(moduleId)
    .then(function () {
      PentaSystem.addImportMap({
        "imports": {
          [moduleId]: "./fixtures/browser/esm.js"
        }
      })
      return importAfterImportMap(moduleId);
    });
  });
});
