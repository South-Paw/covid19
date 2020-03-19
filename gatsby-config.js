module.exports = {
  siteMetadata: {
    siteUrl: '',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: '@south-paw/covid-19',
        short_name: '@south-paw/covid-19',
        start_url: '/',
        background_color: '#EBE0CD',
        theme_color: '#EA6F29',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: '',
        head: false,
        anonymize: false,
        respectDNT: false,
      },
    },
    'gatsby-plugin-sitemap',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
};
