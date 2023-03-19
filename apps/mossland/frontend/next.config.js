// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require("@nrwl/next/plugins/with-nx");

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
  env: {
    CLIENT_ENV: process.env.CLIENT_ENV ?? "debug",
  },
  images: {
    domains: [
      "akamir-develop.seon.workers.dev",
      "akamirdebug.s3.ap-northeast-2.amazonaws.com",
      "dg0upmqpby0hs.cloudfront.net",
      "d3tieydwttx8dr.cloudfront.net",
      "dev-metaverse.moss.land.s3.ap-northeast-2.amazonaws.com",
      "metaverse.moss.land.s3.ap-northeast-2.amazonaws.com",
      "s3.ap-northeast-2.amazonaws.com",
      "cdnb.artstation.com",
      "www.kindpng.com",
      "img.danawa.com",
      "127.0.0.1:8388",
      "127.0.0.1",
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withNx(withBundleAnalyzer(nextConfig));
