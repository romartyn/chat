const mix = require('laravel-mix');

mix.disableNotifications();

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
	.js('resources/js/chat/index.js', 'public/js/chat/index.js')
	.sourceMaps(true, 'eval-source-map')
    .sass('resources/sass/app.scss', 'public/css');
