import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function usePath() {
  const [path, setPath] = useState('')

  const { pathname } = useLocation()
  useEffect(() => {
    try {
      const paths = pathname.split('/')
      setPath(paths[1])
    } catch(e) {
      setPath('')
    }
  }, [pathname])

  return '/' + path
}