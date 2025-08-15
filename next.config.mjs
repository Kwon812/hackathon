/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode:false
// };
//
// export default nextConfig;

import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
};

export default withPWA({
    dest: "public",
    skipWaiting: true,
})(nextConfig);