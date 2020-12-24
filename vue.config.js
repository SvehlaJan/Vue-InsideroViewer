// module.exports = {
//     devServer: {
//         proxy: {
//             '/offers': {
//                 target: 'http://localhost:9000',
//                 changeOrigin: false,
//                 logLevel: 'debug'
//             },
//         }
//     }
// }

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/Vue-InsideroViewer/'
        : '/'
}