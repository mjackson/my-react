import React from "react"
import invariant from "invariant"
import createComponent from "./createComponent"

/**
 * A cache of dynamically-created components.
 */
const cache = new Map()

/**
 * Creates a new React element using a component definition. New components
 * are automatically created from definitions on-the-fly as needed.
 */
function createElement(...args) {
  const def = args[0]

  invariant(def, "createElement needs a component definition")

  if (typeof def !== "string" && typeof def !== "function") {
    let component = cache.get(def)

    if (component == null) {
      component = createComponent(def)
      cache.set(def, component)
    }

    args[0] = component
  }

  return React.createElement(...args)
}

export default createElement
