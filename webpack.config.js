const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');
const devMode = process.env.NODE_ENV === 'development'
const SRC_DIR = __dirname + '/src';
const DIST_DIR = __dirname + '/dist';
const PUBLIC_DIR = __dirname + '/public';
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: [
        SRC_DIR + '/index.js',
    ],
    output: {
        path: path.resolve(DIST_DIR),
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'html-loader',
                    options: { minimize: true }
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
              },
            {
                test: /\.scss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: devMode
                        },
                    },
                ],
            },
            {
                test: /\.(png|jp(e*)g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8000,
                            name: 'images/[name].[ext]',
                            publicPath: '/'
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx','.scss']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv({
            systemvars: true,
            path: `./.env`
        }),
        new HtmlWebpackPlugin({
            template: PUBLIC_DIR + '/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
             filename: devMode ? 'styles/[name].css' : 'styles/[name].[hash].css',
             chunkFilename: devMode ? 'styles/[id].css' : 'styles/[id].[hash].css'
        })
    ],
    devServer: {
        static: DIST_DIR,
        port: 5001,
        historyApiFallback: true,
    }
};