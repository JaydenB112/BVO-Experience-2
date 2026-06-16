import { useMemo } from 'react'
import { manifest } from '../canvas.manifest.js'

/**
 * useScreenInit
 * Reads the ?mp_screen= query parameter on mount and returns the
 * initial state object for that screen from the canvas manifest.
 *
 * @returns {Record<string, unknown>} Initial state slice, or {} if no match.
 */
export function useScreenInit() {
  return useMemo(() => {
    if (typeof window === 'undefined') return {}
    const screenId = new URLSearchParams(window.location.search).get('mp_screen')
    if (!screenId) return {}
    return manifest?.screens?.[screenId]?.state ?? {}
  }, [])
}
