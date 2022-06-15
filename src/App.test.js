import React from 'react'
import { render } from "react-dom"
import { Router } from "react-router-dom"
import { createMemoryHistory } from "history"
import App from './App'

test("redirects all to swap", () => {
  const history = createMemoryHistory()

  const root = document.createElement('div')
  document.body.appendChild(root)

  render(
    <Router history={history}>
      <App />
    </Router>,
    root
  )
  expect(history.location.pathname).toBe("/")
})
