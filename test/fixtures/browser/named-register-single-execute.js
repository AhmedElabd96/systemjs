window.namedRegisterExecutes = 0;

PentaSystem.register('named-register-single-execute', [], function(_export) {
  return {
    execute: function() {
      window.namedRegisterExecutes++;
      _export('bonjour', 'bonjour');
    }
  };
});