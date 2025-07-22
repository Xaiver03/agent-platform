'use client'

import { useState, useEffect } from 'react'

export interface BreakpointConfig {
  xs: number  // extra small devices
  sm: number  // small devices
  md: number  // medium devices
  lg: number  // large devices
  xl: number  // extra large devices
}

export interface ResponsiveInfo {
  width: number
  height: number
  breakpoint: keyof BreakpointConfig
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
  isHighDPI: boolean
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
}

export function useResponsive(customBreakpoints?: Partial<BreakpointConfig>) {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints }
  
  const [responsiveInfo, setResponsiveInfo] = useState<ResponsiveInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1200,
        height: 800,
        breakpoint: 'lg' as keyof BreakpointConfig,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        orientation: 'landscape',
        pixelRatio: 1,
        isHighDPI: false
      }
    }

    return getResponsiveInfo()
  })

  function getResponsiveInfo(): ResponsiveInfo {
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = window.devicePixelRatio || 1
    
    // 确定断点
    let breakpoint: keyof BreakpointConfig = 'xs'
    if (width >= breakpoints.xl) breakpoint = 'xl'
    else if (width >= breakpoints.lg) breakpoint = 'lg'
    else if (width >= breakpoints.md) breakpoint = 'md'
    else if (width >= breakpoints.sm) breakpoint = 'sm'
    
    // 设备类型判断
    const isMobile = width < breakpoints.md
    const isTablet = width >= breakpoints.md && width < breakpoints.lg
    const isDesktop = width >= breakpoints.lg
    
    // 方向判断
    const orientation = width > height ? 'landscape' : 'portrait'
    
    // 高DPI检测
    const isHighDPI = pixelRatio > 1.5

    return {
      width,
      height,
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      orientation,
      pixelRatio,
      isHighDPI
    }
  }

  useEffect(() => {
    function handleResize() {
      setResponsiveInfo(getResponsiveInfo())
    }

    // 防抖处理
    let timeoutId: NodeJS.Timeout
    function debouncedResize() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)
    window.addEventListener('orientationchange', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return responsiveInfo
}

// 响应式CSS工具函数
export function getResponsiveValue<T>(
  value: T | Partial<Record<keyof BreakpointConfig, T>>,
  currentBreakpoint: keyof BreakpointConfig
): T {
  if (typeof value !== 'object' || value === null) {
    return value as T
  }

  const responsiveValue = value as Partial<Record<keyof BreakpointConfig, T>>
  const breakpointOrder: (keyof BreakpointConfig)[] = ['xs', 'sm', 'md', 'lg', 'xl']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)
  
  // 从当前断点向下查找最近的定义值
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (bp in responsiveValue && responsiveValue[bp] !== undefined) {
      return responsiveValue[bp] as T
    }
  }
  
  // 如果没找到，返回第一个定义的值
  for (const bp of breakpointOrder) {
    if (bp in responsiveValue && responsiveValue[bp] !== undefined) {
      return responsiveValue[bp] as T
    }
  }
  
  return value as T
}

// 触摸设备检测
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }

    checkTouch()
    
    // 监听触摸事件来确认设备支持触摸
    const handleFirstTouch = () => {
      setIsTouchDevice(true)
      document.removeEventListener('touchstart', handleFirstTouch)
    }

    document.addEventListener('touchstart', handleFirstTouch, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleFirstTouch)
    }
  }, [])

  return isTouchDevice
}

// 网络状态检测
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState(() => {
    if (typeof window === 'undefined') {
      return { online: true, effectiveType: '4g' as string }
    }
    
    return {
      online: navigator.onLine,
      effectiveType: (navigator as any).connection?.effectiveType || 'unknown'
    }
  })

  useEffect(() => {
    function updateNetworkStatus() {
      setNetworkStatus({
        online: navigator.onLine,
        effectiveType: (navigator as any).connection?.effectiveType || 'unknown'
      })
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Network Information API
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus)
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [])

  return networkStatus
}