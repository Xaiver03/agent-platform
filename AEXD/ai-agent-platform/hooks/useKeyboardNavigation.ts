'use client'

import { useEffect, useCallback, useRef } from 'react'

export interface KeyboardNavigationOptions {
  enabled?: boolean
  preventDefault?: boolean
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onEscape?: () => void
  onSpace?: () => void
  onTab?: (shift: boolean) => void
  onHome?: () => void
  onEnd?: () => void
  onPageUp?: () => void
  onPageDown?: () => void
  customKeys?: Record<string, () => void>
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enabled = true,
    preventDefault = true,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    onTab,
    onHome,
    onEnd,
    onPageUp,
    onPageDown,
    customKeys = {}
  } = options

  const optionsRef = useRef(options)
  optionsRef.current = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!optionsRef.current.enabled) return

    const { key, shiftKey, ctrlKey, altKey, metaKey } = event
    
    // 忽略修饰键组合（除了Shift+Tab）
    if ((ctrlKey || altKey || metaKey) && !(key === 'Tab' && shiftKey)) {
      return
    }

    // 忽略在输入元素中的键盘事件
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }

    let handled = false

    switch (key) {
      case 'ArrowUp':
        if (onArrowUp) {
          onArrowUp()
          handled = true
        }
        break
      case 'ArrowDown':
        if (onArrowDown) {
          onArrowDown()
          handled = true
        }
        break
      case 'ArrowLeft':
        if (onArrowLeft) {
          onArrowLeft()
          handled = true
        }
        break
      case 'ArrowRight':
        if (onArrowRight) {
          onArrowRight()
          handled = true
        }
        break
      case 'Enter':
        if (onEnter) {
          onEnter()
          handled = true
        }
        break
      case 'Escape':
        if (onEscape) {
          onEscape()
          handled = true
        }
        break
      case ' ':
        if (onSpace) {
          onSpace()
          handled = true
        }
        break
      case 'Tab':
        if (onTab) {
          onTab(shiftKey)
          handled = true
        }
        break
      case 'Home':
        if (onHome) {
          onHome()
          handled = true
        }
        break
      case 'End':
        if (onEnd) {
          onEnd()
          handled = true
        }
        break
      case 'PageUp':
        if (onPageUp) {
          onPageUp()
          handled = true
        }
        break
      case 'PageDown':
        if (onPageDown) {
          onPageDown()
          handled = true
        }
        break
      default:
        // 检查自定义键
        if (customKeys[key]) {
          customKeys[key]()
          handled = true
        }
    }

    if (handled && preventDefault) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown, { passive: false })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  return {
    isEnabled: enabled
  }
}

// 专门用于星系导航的hook
export function useGalaxyKeyboardNavigation(
  agents: any[],
  onAgentSelect: (agent: any) => void,
  onAgentActivate: (agent: any) => void
) {
  const currentIndexRef = useRef(0)
  const agentsRef = useRef(agents)
  agentsRef.current = agents

  const getCurrentAgent = useCallback(() => {
    return agentsRef.current[currentIndexRef.current]
  }, [])

  const moveToNext = useCallback(() => {
    if (agentsRef.current.length === 0) return
    currentIndexRef.current = (currentIndexRef.current + 1) % agentsRef.current.length
    const agent = getCurrentAgent()
    if (agent) onAgentSelect(agent)
  }, [getCurrentAgent, onAgentSelect])

  const moveToPrevious = useCallback(() => {
    if (agentsRef.current.length === 0) return
    currentIndexRef.current = currentIndexRef.current === 0 
      ? agentsRef.current.length - 1 
      : currentIndexRef.current - 1
    const agent = getCurrentAgent()
    if (agent) onAgentSelect(agent)
  }, [getCurrentAgent, onAgentSelect])

  const moveToFirst = useCallback(() => {
    if (agentsRef.current.length === 0) return
    currentIndexRef.current = 0
    const agent = getCurrentAgent()
    if (agent) onAgentSelect(agent)
  }, [getCurrentAgent, onAgentSelect])

  const moveToLast = useCallback(() => {
    if (agentsRef.current.length === 0) return
    currentIndexRef.current = agentsRef.current.length - 1
    const agent = getCurrentAgent()
    if (agent) onAgentSelect(agent)
  }, [getCurrentAgent, onAgentSelect])

  const activateCurrent = useCallback(() => {
    const agent = getCurrentAgent()
    if (agent) onAgentActivate(agent)
  }, [getCurrentAgent, onAgentActivate])

  useKeyboardNavigation({
    onArrowUp: moveToPrevious,
    onArrowDown: moveToNext,
    onArrowLeft: moveToPrevious,
    onArrowRight: moveToNext,
    onHome: moveToFirst,
    onEnd: moveToLast,
    onEnter: activateCurrent,
    onSpace: activateCurrent,
    customKeys: {
      'j': moveToNext,        // Vim风格导航
      'k': moveToPrevious,    // Vim风格导航
      'g': moveToFirst,       // 回到顶部
      'G': moveToLast,        // 到底部
    }
  })

  return {
    currentIndex: currentIndexRef.current,
    getCurrentAgent,
    moveToNext,
    moveToPrevious,
    moveToFirst,
    moveToLast,
    activateCurrent
  }
}