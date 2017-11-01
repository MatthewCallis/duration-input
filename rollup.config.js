/* eslint no-console: 0, import/no-extraneous-dependencies: 0 */
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const eslint = require('rollup-plugin-eslint');

rollup({
  input: 'src/duration-input.js',
  plugins: [
    eslint(),
    json({
      exclude: ['node_modules/**'],
    }),
    babel({
      babelrc: false,
      presets: ['es2015-rollup'],
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
  ],
}).then(bundle => (
  bundle.write({
    format: 'iife', // amd, cjs, es, iife, umd
    name: 'DurationInput',
    file: 'lib/duration-input.js',
  })
)).then(() => {
  console.log('Bundle Created');
}).catch((e) => {
  console.error('Error:', e);
});
