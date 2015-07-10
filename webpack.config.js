module.exports = {
    entry: "./src/es6/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "izi-ioc.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel"
            }
        ]
    }
};