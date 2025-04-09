const esbuild = require('esbuild');


// For development, use context to enable watch mode
(async () => {
  // Create a context for incremental builds
  const context = await esbuild.context({
    entryPoints: ['frontend/stock_flow.tsx'],
    outfile: 'app/assets/builds/bundle.js',
    bundle: true,
    loader: {
      '.ts': 'tsx',
      '.tsx': 'tsx',
    },
    minify: false,
  });

  // Start watch mode
  await context.watch();
  console.log('Watching for changes...');
})();