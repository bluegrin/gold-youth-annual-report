const path = require( 'path' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = ( env, args ) => {
    const mode = args.mode ?? 'production';

    const config = {
        entry: './src/main.js',
        output: {
            filename: 'main.js',
            path: path.resolve( __dirname, './assets' ),
            publicPath: '/',
        },
        mode,
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [ 'autoprefixer' ],
                                    ],
                                },
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin(),
        ],
    };

    if ( 'development' === mode ) {
        config.devtool = 'source-map';
    }

    return config;
};
