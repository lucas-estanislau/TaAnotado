import { useContext } from 'react'
import { AppDataContext } from './contextInstance'

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData deve ser usado dentro de um AppDataProvider')
  }
  return context
}
