'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface StarData {
  id: string
  x: number
  y: number
  vx?: number
  vy?: number
  size: number
  [key: string]: any
}

interface GalaxyConfig {
  containerWidth: number
  containerHeight: number
  centerX: number
  centerY: number
  boundaryThreshold: number
  attractionForce: number
  maxSpeed: number
  enablePhysics: boolean
}

interface UseGalaxyWorkerOptions {
  enabled?: boolean
  onAnimationFrame?: (stars: StarData[]) => void
  onPerformanceUpdate?: (fps: number, starCount: number) => void
  onError?: (error: string) => void
}

export function useGalaxyWorker(options: UseGalaxyWorkerOptions = {}) {
  const workerRef = useRef<Worker | null>(null)
  const [isWorkerReady, setIsWorkerReady] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [performance, setPerformance] = useState({ fps: 0, starCount: 0 })
  
  const {
    enabled = true,
    onAnimationFrame,
    onPerformanceUpdate,
    onError
  } = options

  // 初始化Worker
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    try {
      const worker = new Worker('/workers/galaxy-animation.js')
      workerRef.current = worker

      worker.onmessage = (e) => {
        const { type, ...data } = e.data

        switch (type) {
          case 'worker-ready':
            setIsWorkerReady(true)
            break

          case 'animation-frame':
            onAnimationFrame?.(data.stars)
            break

          case 'performance-update':
            setPerformance({ fps: data.fps, starCount: data.starCount })
            onPerformanceUpdate?.(data.fps, data.starCount)
            break

          case 'collision-results':
            // 可以在这里处理碰撞结果
            break

          case 'error':
            console.error('Galaxy Worker Error:', data.message)
            onError?.(data.message)
            break
        }
      }

      worker.onerror = (error) => {
        console.error('Galaxy Worker Error:', error)
        onError?.(error.message || 'Worker error')
      }

      return () => {
        worker.terminate()
        workerRef.current = null
        setIsWorkerReady(false)
        setIsAnimating(false)
      }
    } catch (error) {
      console.error('Failed to create Galaxy Worker:', error)
      onError?.(`Failed to create worker: ${(error as Error).message}`)
    }
  }, [enabled, onAnimationFrame, onPerformanceUpdate, onError])

  // 初始化配置
  const initializeWorker = useCallback((config: Partial<GalaxyConfig>, stars: StarData[]) => {
    if (!workerRef.current || !isWorkerReady) return

    workerRef.current.postMessage({
      type: 'init',
      data: { config, stars }
    })
  }, [isWorkerReady])

  // 开始动画
  const startAnimation = useCallback(() => {
    if (!workerRef.current || !isWorkerReady) return

    workerRef.current.postMessage({ type: 'start' })
    setIsAnimating(true)
  }, [isWorkerReady])

  // 停止动画
  const stopAnimation = useCallback(() => {
    if (!workerRef.current) return

    workerRef.current.postMessage({ type: 'stop' })
    setIsAnimating(false)
  }, [])

  // 更新星星数据
  const updateStars = useCallback((stars: StarData[]) => {
    if (!workerRef.current || !isWorkerReady) return

    workerRef.current.postMessage({
      type: 'update-stars',
      data: { stars }
    })
  }, [isWorkerReady])

  // 更新配置
  const updateConfig = useCallback((config: Partial<GalaxyConfig>) => {
    if (!workerRef.current || !isWorkerReady) return

    workerRef.current.postMessage({
      type: 'update-config',
      data: { config }
    })
  }, [isWorkerReady])

  // 处理容器大小变化
  const handleResize = useCallback((width: number, height: number) => {
    if (!workerRef.current || !isWorkerReady) return

    workerRef.current.postMessage({
      type: 'resize',
      data: { width, height }
    })
  }, [isWorkerReady])

  // 检查碰撞
  const checkCollisions = useCallback((stars: StarData[], uiElements: any[]) => {
    if (!workerRef.current || !isWorkerReady) return

    workerRef.current.postMessage({
      type: 'check-collisions',
      data: { stars, uiElements }
    })
  }, [isWorkerReady])

  return {
    isWorkerReady,
    isAnimating,
    performance,
    initializeWorker,
    startAnimation,
    stopAnimation,
    updateStars,
    updateConfig,
    handleResize,
    checkCollisions
  }
}