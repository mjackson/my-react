myReact is React without ES6 classes or `this`.

In myReact, you don't create classes or extend `React.Component`. Instead, you
just export a bunch of functions from a JavaScript module.

Instead of using `this` to access the component instance in methods, _every
method_ receives the instance as the first argument, usually called `my`
(similar to how instance methods in Python always receive `self` as the initial
argument). This helps developers avoid many common mistakes including:

* forgetting to bind the appropriate `this` in event handler methods
* getting the correct `this` inside inline event handlers in the `render` method
* getting the correct `this` inside `forEach`/`map` in the `render` method

Other minor improvements to the ES6 class-based React component API include:

* `setupComponent` instead of `constructor`; avoids the `super` boilerplate
* `getNextState` instead of `componentWillReceiveProps`; automatically applies
  the return value to `my.state`
* `getElement` instead of `render`; it's more descriptive

Now, I know, that sounds like a lot. Let's see what it looks like!

Here's how you might create a simple `<TodoList>` component:

```js
import MyReact from "my-react"

const displayName = "TodoList"

const defaultProps = {
  title: "Todo List",
  initialItems: []
}

function setupComponent(my) {
  my.state = { items: my.props.initialItems }
}

function handleSubmit(my, event) {
  event.preventDefault()

  const todo = my.refs.todo

  my.setState({
    items: my.state.items.concat([todo.value])
  })

  todo.form.reset()
}

function getElement(my) {
  return (
    <div>
      <h1>{my.props.title}</h1>
      <ol>{my.state.items.map(item => <li>{item}</li>)}</ol>
      <form onSubmit={my.handleSubmit}>
        <input ref="todo" type="text" />
      </form>
    </div>
  )
}

export default {
  displayName,
  defaultProps,
  setupComponent,
  handleSubmit,
  getElement
}
```

Assuming the above code was saved in `TodoList.js`, you could use it just like
any other React component (see [#usage](Usage) below):

```js
import MyReact from "my-react"
import ReactDOM from "react-dom"
import TodoList from "./TodoList"

const node = document.getElementById("app")

ReactDOM.render(<TodoList />, node)
```

You can also put your own properties on the `my` object that aren't needed for
rendering, like timers and references to in-flight XHR objects. Each time a
lifecycle method is invoked for a given component, it receives the _same
instance_.

Note in the following example how `my.timer` is set in `componentDidMount` and
then cleaned up in `componentWillUnmount`.

```js
import MyReact from "my-react"

const displayName = "Counter"

function setupComponent(my) {
  my.state = { count: 0 }
}

function componentDidMount(my) {
  my.timer = setInterval(() => {
    my.setState({ count: my.state.count + 1 })
  }, 1000)
}

function componentWillUnmount(my) {
  clearInterval(my.timer)
}

function getElement(my) {
  return <p>The current count is {my.state.count}</p>
}

export default {
  displayName,
  setupComponent,
  componentDidMount,
  componentWillUnmount,
  getElement
}
```

## Installation

    yarn add @mjackson/my-react

## Usage

Assuming you're already using Babel for compiling JSX, you can just do:

```js
import MyReact from "@mjackson/my-react"

// Tell Babel to transform JSX into MyReact.createElement calls
/** @jsx MyReact.createElement */
```

If you'd rather not put that comment in every file where you're using JSX, you
can just put the following in your `.babelrc`:

```json
{
  "plugins": ["transform-react-jsx", { "pragma": "MyReact.createElement" }]
}
```

## Feedback

I'd love to get some feedback on this approach. Please feel free to reach out
[on Twitter](https://twitter.com/mjackson) or
[GitHub](https://github.com/mjackson/my-react').

Thanks!
