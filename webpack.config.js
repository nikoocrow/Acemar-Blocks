const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'hero-slider/index': path.resolve(process.cwd(), 'src/hero-slider', 'index.js'),
        'hero-slider/frontend': path.resolve(process.cwd(), 'src/hero-slider', 'frontend.js'),
        // 'hero-slide/index': path.resolve(process.cwd(), 'src/hero-slide', 'index.js'), // ❌ ELIMINAR ESTA LÍNEA
    },
};