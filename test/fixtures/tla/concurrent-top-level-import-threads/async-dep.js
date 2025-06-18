// Equivalent to:
// await Promise.resolve();
PentaSystem.register([], function (_export, _context) {
    return {
        execute: async function () {
            await Promise.resolve();
        },
    };
});