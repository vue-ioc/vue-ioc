const path = require("path");
const webpack = require("webpack");

const ROOT = path.resolve( __dirname, "src" );
const DESTINATION = path.resolve( __dirname, "dist" );

module.exports = {
    context: ROOT,

    entry: {
        "vue-ioc-core": "./index.ts",
    },

    output: {
        filename: "[name].js",
        library: 'VueIoc',
        libraryTarget: 'umd',
        path: DESTINATION,

    },

    resolve: {
        extensions: [".ts", ".js"],
        modules: [
            ROOT,
            "node_modules",
        ]
    },

    externals: {
        'vue': 'vue',
        'vue-class-component': 'vue-class-component',
        'inversify': 'inversify',
        'reflect-metadata': 'reflect-metadata'
    },

    module: {
        rules: [
            /****************
             * PRE-LOADERS
             *****************/
            {
                enforce: "pre",
                test: /\.js$/,
                use: "source-map-loader",
            },
            // {
            //     enforce: "pre",
            //     test: /\.ts$/,
            //     exclude: /node_modules/,
            //     use: "tslint-loader",
            // },

            /****************
             * LOADERS
             *****************/
            {
                exclude: [ /node_modules/ ],
                test: /\.ts$/,
                use: "awesome-typescript-loader",
            },
        ],
    },

    devtool: "source-map",
    devServer: {},
};
