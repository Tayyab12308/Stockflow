const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  // Entry point from your frontend folder
  entryPoints: [path.join(__dirname, 'frontend', 'stock_flow.jsx')],
  // Bundle all dependencies into one file
  bundle: true,
  // Output file – similar to webpack's output.filename and output.path
  outfile: path.join(__dirname, 'app', 'assets', 'builds', 'bundle.js'),
  // Generate inline sourcemaps (similar to webpack's 'eval-source-map')
  sourcemap: 'inline',
  // output as a self-invoking function
  format: 'iife',
  // all exports will be attached to window.Stockflow
  globalName: 'Stockflow',
  // Automatically resolve .js and .jsx files
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx'
  },
  // Target a set of JavaScript versions (adjust if needed)
  target: ['es2015'],
}).catch(() => process.exit(1));