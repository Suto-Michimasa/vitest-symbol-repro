import { useState } from 'react'
import { useLazyTestConnectionQuery } from './api'

export const TestComponent = () => {
  const [testConnection] = useLazyTestConnectionQuery()
  const [result, setResult] = useState<string>('')

  const handleTestConnection = async () => {
    try {
      const { error } = await testConnection({ id: '123' })
      if (error) {
        // This console.error with error object causes Symbol serialization issue in vitest 4.0.16
        console.error('Test connection error:', error)
        setResult('failed')
      } else {
        setResult('success')
      }
    } catch (e) {
      console.error('Unexpected error:', e)
      setResult('error')
    }
  }

  return (
    <div>
      <button onClick={handleTestConnection} data-testid="test-btn">
        Test Connection
      </button>
      <span data-testid="result">{result}</span>
    </div>
  )
}
