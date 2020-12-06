module.exports = {
    devServer: {
        proxy: {
            '/offers': {
                target: 'http://localhost:9000',
                changeOrigin: false,
                logLevel: 'debug'
            },
            '/countries': {
                target: 'http://localhost:9000',
                changeOrigin: false,
                logLevel: 'debug'
            },
            '/regions': {
                target: 'http://localhost:9000',
                changeOrigin: false,
                logLevel: 'debug'
            },
            '/cities': {
                target: 'http://localhost:9000',
                changeOrigin: false,
                logLevel: 'debug'
            },
        }
    }
}