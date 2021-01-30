import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/json-find.node.js',
            format: 'cjs',
            exports: 'auto'
        },
        {
            file: 'dist/json-find.node.min.js',
            format: 'cjs',
            plugins: [terser()],
            exports: 'auto'
        },
        {
            file: 'dist/json-find.browser.js',
            format: 'iife',
            name: 'JsonFind',
        },
        {
            file: 'dist/json-find.browser.min.js',
            format: 'iife',
            name: 'JsonFind',
            plugins: [terser()]
        }
    ]
};