myReact is React without ES6 classes or `this`.

Instead of using `this` to access the component instance in methods, *every method* receives the instance as the first argument, usually called `my`. This helps developers avoid many common mistakes including forgetting to bind the appropriate `this` in event handler methods and preserving the meaning of `this` as context changes inside `forEach` invocations and inline event handlers in the `render` method.

Also, instead of modeling components using classes, components in myReact are simply modules or plain objects.

Other minor improvements to the ES6 class-based React component API include:

  - `setupComponent` instead of `constructor`; avoids the `super` boilerplate
  - `getNextState` instead of `componentWillReceiveProps`; automatically applies
    the return value to `my.state`
  - `getElement` instead of `render`; it's more descriptive

Now, I know, that sounds like a lot. Let's see what it looks like!

Here's how you might create a simple `<TodoList>` component:

```js
import MyReact from 'my-react'

export const displayName = 'TodoList'

export const defaultProps = {
  title: 'Todo List',
  initialItems: []
}

export function setupComponent(my) {
  my.state = { items: my.props.initialItems }
}

export function handleSubmit(my, event) {
  event.preventDefault()

  const todo = my.refs.todo

  my.setState({
    items: my.state.items.concat([ todo.value ])
  })

  todo.form.reset()
}

export function getElement(my) {
  const { title } = my.props
  const { items } = my.state

  return (
    <div>
      <h1>{title}</h1>
      <ol>
        {items.map(item => <li>{item}</li>)}
      </ol>
      <form onSubmit={my.handleSubmit}>
        <input ref="todo" type="text"/>
      </form>
    </div>
  )
}
```

Assuming the above code was saved in `TodoList.js`, you could use it just like any other React component:

```js
import MyReact from 'my-react'
import ReactDOM from 'react-dom'
import * as TodoList from './TodoList'

const node = document.getElementById('app')

ReactDOM.render(<TodoList/>, node)
```

You can also put your own properties on the `my` object that aren't needed for rendering, like timers and references to in-flight XHR objects. Each time a lifecycle method is invoked for a given component, it receives the *same instance*.

Note in the following example how `my.timer` is set in `componentDidMount` and then cleaned up in `componentWillUnmount`.

```js
import MyReact from 'my-react'

export displayName = 'Counter'

export function setupComponent(my) {
  my.state = { count: 0 }
}

export function componentDidMount(my) {
  my.timer = setInterval(function () {
    my.setState({ count: my.state.count + 1 })
  }, 1000)
}

export function componentWillUnmount(my) {
  clearInterval(my.timer)
}

export function getElement(my) {
  return <p>The current count is {my.state.count}</p>
}
```
