const path = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
        .set("@css", resolve("src/assets/css"))
        .set("@img", resolve("src/assets/img"))
        .set("@font", resolve("src/assets/font"))
        .set("@home", resolve("src/views/home"))
        .set("@cart", resolve("src/views/cart"))
        .set("@profile", resolve("src/views/profile"))
        .set("@category", resolve("src/views/category"))
        .set("@common", resolve("src/components/common"))
        .set("@content", resolve("src/components/content"))
  }
};
