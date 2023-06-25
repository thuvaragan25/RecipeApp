const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ "recipes.eerieemu.com"]
  },
  env: {
    DEPLOYMENT: process.env.DEPLOYMENT,
  }
}

module.exports = nextConfig