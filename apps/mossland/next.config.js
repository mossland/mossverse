//@ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nx/next/plugins/with-nx");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: { svgr: false },
  experimental: { appDir: true },
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
    ],
  },
};

module.exports = withNx(process.env.ANALYZE === "true" ? require("@next/bundle-analyzer")({enabled: true})(nextConfig) : nextConfig);
