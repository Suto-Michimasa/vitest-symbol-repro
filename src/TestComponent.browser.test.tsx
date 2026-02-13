import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { Provider } from 'react-redux'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createStore } from './store'
import { TestComponent } from './TestComponent'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TestComponent', () => {
  it('handles successful connection', async () => {
    server.use(
      http.get('/api/test-connection/:id', () => {
        return HttpResponse.json({ success: true })
      }),
    )

    const store = createStore()
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>,
    )

    await userEvent.click(screen.getByTestId('test-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('success')
    })
  })

  it('handles failed connection', async () => {
    server.use(
      http.get('/api/test-connection/:id', () => {
        return new HttpResponse(null, {
          status: 400,
          statusText: 'Bad Request',
        })
      }),
    )

    const store = createStore()
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>,
    )

    await userEvent.click(screen.getByTestId('test-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('failed')
    })
  })
})
