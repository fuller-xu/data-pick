if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/data-pick.min.js");
} else {
  module.exports = require("./dist/data-pick.js");
}
