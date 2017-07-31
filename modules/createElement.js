import React from 'react'
import invariant from 'invariant'
import createComponent from './createComponent'

/**
 * A cache of dynamically-created components.
 */
const cache = new Map

/**
 * Creates a new React element using a component definition. New components
 * are automatically created from definitions on-the-fly as needed.
 */
function createElement() {
  var args = Array.prototype.slice.call(arguments, 0)
  var def = args.shift()

  invariant(
    def,
    'createElement needs a component definition'
  )

  var component = typeof def === 'string' || typeof def === 'function'
    ? def
    : cache.get(def)

  if (component == null) {
    component = createComponent(def)
    cache.set(def, component)
  }

  args.unshift(component)

  return React.createElement.apply(React, args)
}

export default createElement
