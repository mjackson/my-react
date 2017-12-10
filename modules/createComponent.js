import React from "react"
import invariant from "invariant"

/**
 * React class properties we support.
 */
const ReactStatics = {
  displayName: true,
  defaultProps: true,
  propTypes: true,
  contextTypes: true,
  childContextTypes: true
}

/**
 * React lifecycle methods we support.
 */
const ReactLifecycle = {
  getChildContext: true,
  componentWillMount: true,
  componentDidMount: true,
  shouldComponentUpdate: true,
  componentWillUpdate: true,
  componentDidUpdate: true,
  componentWillUnmount: true
}

/**
 * Custom lifecycle methods.
 */
const AddedLifecycle = {
  setupComponent: true,
  getElement: true,
  getNextState: true
}

function isFunction(obj) {
  return typeof obj === "function"
}

/**
 * Creates a new myReact component. The argument is the "component definition"
 * object and must contain at least the following property:
 *
 * - getElement(my)
 *
 * The component definition may also contain any of the following properties:
 *
 * - displayName
 * - defaultProps
 * - propTypes
 * - contextTypes
 * - childContextTypes
 * - getChildContext(my)
 * - setupComponent(my)
 * - componentWillMount(my)
 * - componentDidMount(my)
 * - getNextState(my, nextProps)
 * - shouldComponentUpdate(my, nextProps, nextState)
 * - componentWillUpdate(my, nextProps, nextState)
 * - componentDidUpdate(my, prevProps, prevState)
 * - componentWillUnmount(my)
 *
 * Additionally, the component definition may just be a function (instead of an
 * object), in which case that function will be used as the `getElement` value.
 */
function createComponent(def) {
  invariant(def, "createComponent is missing the component definition")

  // Support plain functions as well as objects.
  const getElement = def.getElement || def

  invariant(getElement, "getElement is missing from the component definition")

  invariant(isFunction(getElement), "getElement must be a function")

  const setupComponent = def.setupComponent

  invariant(
    !setupComponent || isFunction(setupComponent),
    "setupComponent must be a function"
  )

  function Component(props) {
    React.Component.call(this, props)

    // Auto-bind instance methods.
    Object.keys(instanceMethods).forEach(function(key) {
      this[key] = instanceMethods[key].bind(undefined, this)
    }, this)

    if (setupComponent) setupComponent(this)
  }

  const proto = Component.prototype

  Object.setPrototypeOf(proto, React.Component.prototype)

  proto.render = function() {
    return getElement(this)
  }

  const getNextState = def.getNextState

  if (getNextState) {
    invariant(isFunction(getNextState), "getNextState must be a function")

    proto.componentWillReceiveProps = function(nextProps) {
      const nextState = getNextState(this, nextProps)

      if (nextState) this.setState(nextState)
    }
  }

  const instanceMethods = {}

  Object.keys(def).forEach(function(key) {
    const value = def[key]

    if (ReactStatics[key]) {
      Component[key] = value
    } else if (ReactLifecycle[key]) {
      invariant(
        isFunction(value),
        'Lifecycle method "%s" must be a function',
        key
      )

      // Keep React lifecycle methods on the prototype, for efficiency.
      proto[key] = function(a, b) {
        return value(this, a, b)
      }
    } else if (!AddedLifecycle[key]) {
      invariant(
        isFunction(value),
        'Unable to bind property "%s"; it must be a function',
        key
      )

      // Save this method to be bound directly to the object at creation.
      instanceMethods[key] = value
    }
  })

  // Use the names of functions as the displayName.
  if (!Component.displayName && isFunction(def)) {
    Component.displayName = def.name
  }

  return Component
}

export default createComponent
