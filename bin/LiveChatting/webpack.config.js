const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: {
        roomSearch: "./public/modules/roomSearchModule.js",
        friendSearch: "./public/modules/friendSearchModule.js",
        friendRequest: "./public/modules/friendRequestModule.js",
        chatRoom: "./public/modules/chatRoomModule.js",
        roomRevise: "./public/modules/roomReviseModule.js",
        myPage: "./public/modules/myPageModule.js",
        home: "./public/modules/homeModule.js",
        joinPage: "./public/modules/joinPageModule.js"
    },
    output: {
        path: path.resolve(__dirname, 'public/bundles'),
        filename: "[name]_bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(png|gif)$/,
                use: [
                    'file-loader'
                ],
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery'
        })
    ]
}