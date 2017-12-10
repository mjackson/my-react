import babel from "rollup-plugin-babel"
import replace from "rollup-plugin-replace"
import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"

const config = {
  name: "MyReact",
  globals: {
    react: "React"
  },
  external: ["react"],
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
}

export default config
