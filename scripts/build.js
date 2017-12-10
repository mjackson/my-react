const fs = require("fs")
const execSync = require("child_process").execSync
const prettyBytes = require("pretty-bytes")
const gzipSize = require("gzip-size")

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  })

console.log("\nBuilding ES modules ...")

exec("rollup -c -i modules/index.js -f es -o esm/my-react.development.js")
exec("rollup -c -i modules/index.js -f es -o esm/my-react.production.min.js", {
  NODE_ENV: "production"
})

console.log("Building CommonJS modules ...")

exec(
  "rollup -c -i modules/index.common.js -f cjs -o cjs/my-react.development.js"
)
exec(
  "rollup -c -i modules/index.common.js -f cjs -o cjs/my-react.production.min.js",
  {
    NODE_ENV: "production"
  }
)

console.log("\nBuilding UMD modules ...")

exec(
  "rollup -c -i modules/index.common.js -f umd -o umd/my-react.development.js"
)
exec(
  "rollup -c -i modules/index.common.js -f umd -o umd/my-react.production.min.js",
  {
    NODE_ENV: "production"
  }
)

const size = gzipSize.sync(fs.readFileSync("umd/my-react.production.min.js"))

console.log("\ngzipped, the UMD build is %s", prettyBytes(size))
