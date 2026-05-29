const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Zustand ships ESM (.mjs) with import.meta.env which Metro can't handle.
// Force Metro to resolve zustand to its CJS build instead.
const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
      const subpath = moduleName.startsWith('zustand/')
        ? moduleName.slice('zustand/'.length)
        : 'index';
      const cjsPath = path.resolve(
        __dirname,
        'node_modules/zustand',
        subpath === 'index' ? 'index.js' : `${subpath}.js`
      );
      try {
        require.resolve(cjsPath);
        return { filePath: cjsPath, type: 'sourceFile' };
      } catch {
        // fall through to default
      }
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
