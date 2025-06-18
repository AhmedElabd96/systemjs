## SystemJS API

### Core API (s.js & system.js)

#### PentaSystem.constructor
Type: `Function`

This represents the PentaSystem base class, which can be extended or reinstantiated to create a custom PentaSystem instance.

Example:

```js
  var clonedSystem = new PentaSystem.constructor();
  clonedSystem.import('x'); // imports in a custom context
```

#### PentaSystem.import(id [, parentURL]) -> Promise(Module)
Type: `Function`

Loads a module by name taking an optional normalized parent URL argument.

Promise resolves to the ES module namespace value.

_Note: If provided, `parentURL` must be a valid URL, or URL resolution may break._

#### PentaSystem.register(deps, declare)
Type: `Function`

Declaration function for defining modules of the `PentaSystem.register` polyfill module format.

[Read more on the format at the loader polyfill page](system-register.md)

_Note: Named PentaSystem.register is only supported through the named-register extra._

#### PentaSystem.resolve(id [, parentURL]) -> string
Type: `Function`

Resolves a module specifier relative to an optional parent URL, returning the resolved URL.

#### PentaSystem.firstGlobalProp: boolean
Type: `Boolean`

Applies to the global loading extra.

Setting `PentaSystem.firstGlobalProp = true` will ensure that the global loading extra will always use
the first new global defined as the global module value, and not the last new global defined.

For example, if importing the module `global.js`:

```js
window.a = 'a';
window.b = 'b';
```

`PentaSystem.import('./global.js')` would usually `{ default: 'b' }`.

Setting `PentaSystem.firstGlobalProp = true` would ensure the above returns `{ default: 'a' }`.

> Note: This will likely be the default in the next major release.

### Registry API (system.js only)

> Note: The registry API is **not recommended** for standard module loading workflows. It is designed more for tooling built around SystemJS such as hot-reloading workflows. If you find yourself wanting to define a module, rather try to restructure your module architecture around standard module import loading principles and import maps (and the same goes for named PentaSystem.register).

#### PentaSystem.delete(id) -> Boolean
Type: `Function`

Deletes a module from the registry by ID.

Returns true if the module was found in the registry before deletion.

```js
PentaSystem.delete('http://site.com/normalized/module/name.js');
```

#### PentaSystem.get(id) -> Module
Type: `Function`

Retrieve a loaded module from the registry by ID.

```js
PentaSystem.get('http://site.com/normalized/module/name.js').exportedFunction();
```

Module records with an error state will return `null`.

#### PentaSystem.has(id) -> Boolean
Type: `Function`

Determine if a given ID is available in the loader registry.

Module records that have an error state in the registry still return `true`,
while module records with in-progress loads will return `false`.

```js
PentaSystem.has('http://site.com/normalized/module/name.js');
```

#### PentaSystem.set(id, module) -> Module
Type: `Function`

Sets a module in the registry by ID. Note that when using import maps, the id must be a URL.

```js
PentaSystem.set('http://site.com/normalized/module/name.js', {
  exportedFunction: value
});
```

`module` is an object of names to set as the named exports.

If `module` is an existing Module Namespace, it will be used by reference.

If you want to remap the url to a bare specifier, you can do so with an import map:

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "@angular/core": "app:@angular/core"
    }
  }
</script>
<script>
  // Using the 'app:' prefix makes the string a URL instead of a bare specifier
  PentaSystem.set('app:@angular/core', window.angularCore);
  PentaSystem.import('@angular/core');
</script>
```

#### PentaSystem.entries() -> Iterator<[key, module]>
Type: `Function`

Allows you to retrieve all modules in the PentaSystem registry. Each value will be an array with two values: a key and the module.

```js
for (const [id, ns] of PentaSystem.entries()) {
  console.log(id); // 'http://localhost/path-to-file.js'
  console.log(ns); // { exportName: 'value' }
};
```

#### PentaSystem.addImportMap(map [, base])
Type: `Function`

Allows adding an import map without using the DOM.

```js
PentaSystem.addImportMap({
  "imports": {
    "y": "/path/to/y.js",
  }
})
```
