/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Agregar reglas para manejar archivos CSS
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isServer
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      });
  
      // Agregar reglas para manejar archivos Less
      config.module.rules.push({
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isServer
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          'less-loader',
        ],
      });
  
      return config;
    },
  };
  
  export default nextConfig;