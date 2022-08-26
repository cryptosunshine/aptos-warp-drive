import React, { useState, useEffect, useCallback } from 'react'
import { useGlobal } from '../state/provider'

const App: React.FC<any> = () => {
  const { state, dispatch } = useGlobal()
  const [autoConnectStatus, setAutoConnect] = useState(true)

  const first = useCallback(async () => {
    
  }, [])
  useEffect(() => {
    const timeout = setTimeout(() =>
      first(), 300);
    return () => clearTimeout(timeout);
  }, [first])

  return (
    <>
      <div>header</div>
    </>
  )
};

export default App;
