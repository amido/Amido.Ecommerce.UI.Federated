import {render, screen, waitFor} from '@testing-library/react'

import App from './App'

test('renders external components', async () => {
  render(<App />)
  await waitFor(() => {
    const sharedTextComponent = screen.getByText(/Error getting product/)
    expect(sharedTextComponent).toBeInTheDocument()
  })
})
