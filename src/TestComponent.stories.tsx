import type { Meta, StoryObj } from '@storybook/react-vite'
import { HttpResponse, http } from 'msw'
import { Provider } from 'react-redux'
import { expect, userEvent, within } from 'storybook/test'
import { createStore } from './store'
import { TestComponent } from './TestComponent'

const meta: Meta<typeof TestComponent> = {
  title: 'TestComponent',
  component: TestComponent,
  decorators: [
    (Story) => (
      <Provider store={createStore()}>
        <Story />
      </Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof TestComponent>

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/test-connection/:id', () => {
          return HttpResponse.json({ success: true })
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Click test button and expect success', async () => {
      await userEvent.click(canvas.getByTestId('test-btn'))
      await expect(canvas.getByTestId('result')).toHaveTextContent('success')
    })
  },
}

export const Failure: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/test-connection/:id', () => {
          return new HttpResponse(null, {
            status: 400,
            statusText: 'Bad Request',
          })
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Click test button and expect failure', async () => {
      await userEvent.click(canvas.getByTestId('test-btn'))
      // This test causes Symbol error in vitest 4.0.16 because
      // RTK Query error object contains Symbol properties and
      // console.error tries to serialize them
      await expect(canvas.getByTestId('result')).toHaveTextContent('failed')
    })
  },
}
