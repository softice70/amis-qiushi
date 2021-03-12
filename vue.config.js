module.exports = {
    devServer: {
        port: 8080,
        proxy: {
            "/api/role": {
                target: 'http://localhost:8088/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/role': ''
                }
            },
            '/api': {
                target: 'http://localhost:8098/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}