const webpack = require('webpack');
const helpers = require('./helpers');

/*
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
        'polyfills': './public/src/polyfills.ts',
        'main': './public/src/main.ts'
    },

    /*
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

        /*
         * An array of extensions that should be used to resolve modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
         */
        extensions: ['', '.ts', '.js', '.json'],

        // Make sure root is src
        root: helpers.root('public/src'),

        // remove other default values
        modulesDirectories: ['node_modules'],

    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

        /*
         * An array of applied pre and post loaders.
         *
         * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
         */
        preLoaders: [],

        /*
         * An array of automatically applied loaders.
         *
         * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
         * This means they are not resolved relative to the configuration file.
         *
         * See: http://webpack.github.io/docs/configuration.html#module-loaders
         */
        loaders: [

            /*
             * Typescript loader support for .ts and Angular 2 async routes via .async.ts
             * Replace templateUrl and stylesUrl with require()
             *
             * See: https://github.com/s-panferov/awesome-typescript-loader
             * See: https://github.com/TheLarkInn/angular2-template-loader
             */
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader',
                    'angular2-template-loader'
                ],
                exclude: [/\.(spec|e2e)\.ts$/]
            },

            /*
             * to string and css loader support for *.css files
             * Returns file content as string
             *
             */
            {
                test: /\.css$/,
                loaders: ['to-string-loader', 'css-loader']
            },

            /* Raw loader support for *.html
             * Returns file content as string
             *
             * See: https://github.com/webpack/raw-loader
             */
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [helpers.root('public/index.html')]
            },

            /*
             * File loader for supporting images, for example, in CSS files.
             */
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'file'
            }
        ]
    },

    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

    ],

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
        global: 'window',
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};