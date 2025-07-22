'use client'

import React, { useState, useEffect, useRef } from 'react'

interface DanmakuItem {
  id: string
  text: string
  color: string
  createdAt: string
  x?: number
  y?: number
  speed?: number
  timestamp?: number
}

interface DanmakuProps {
  enabled?: boolean
  showInput?: boolean
  isPlaying?: boolean
  onShowInputChange?: (show: boolean) => void
  onPlayingChange?: (playing: boolean) => void
}

export const Danmaku: React.FC<DanmakuProps> = ({ 
  enabled = true, 
  showInput = false, 
  isPlaying = false,
  onShowInputChange,
  onPlayingChange 
}) => {
  const [danmakus, setDanmakus] = useState<DanmakuItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedColor, setSelectedColor] = useState('#FFFFFF')
  const [displayedDanmakus, setDisplayedDanmakus] = useState<DanmakuItem[]>([])
  const [configEnabled, setConfigEnabled] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const counterRef = useRef<number>(0) // 添加计数器确保唯一性

  // 获取弹幕列表（优化版）
  const fetchDanmakus = async () => {
    try {
      const response = await fetch('/api/danmaku?type=playback&limit=100')
      const data = await response.json()
      if (data.success) {
        setDanmakus(data.danmakus)
      }
    } catch (error) {
      console.error('获取弹幕失败:', error)
    }
  }

  // 获取弹幕配置
  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/danmaku/config')
      const data = await response.json()
      if (data.success) {
        setConfigEnabled(data.config.enabled)
      }
    } catch (error) {
      console.error('获取弹幕配置失败:', error)
    }
  }

  // 动画更新弹幕位置
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      setDisplayedDanmakus(prev => {
        // 如果不在播放状态，清空所有弹幕
        if (!isPlaying) {
          return []
        }
        
        return prev
          .map(danmaku => ({
            ...danmaku,
            x: (danmaku.x || 0) - (danmaku.speed || 2)
          }))
          .filter(danmaku => {
            // 计算弹幕文本的大概宽度（每个字符约16px）
            const textWidth = (danmaku.text?.length || 0) * 16
            // 弹幕完全移出屏幕左侧后才移除（包括文本宽度）
            return (danmaku.x || 0) > -(textWidth + 100)
          })
      })
    }, 16) // 60fps

    return () => clearInterval(interval)
  }, [enabled, isPlaying])

  useEffect(() => {
    if (enabled) {
      fetchConfig()
      fetchDanmakus()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled])

  // 发送弹幕到服务器
  const sendDanmaku = async () => {
    console.log('发送弹幕被点击', { inputValue, selectedColor })
    
    if (!inputValue.trim() || inputValue.length > 20) {
      console.log('弹幕发送被阻止：', { 
        isEmpty: !inputValue.trim(), 
        tooLong: inputValue.length > 20,
        length: inputValue.length 
      })
      return
    }

    try {
      console.log('正在发送弹幕到API...')
      const response = await fetch('/api/danmaku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputValue.trim(),
          color: selectedColor
        })
      })

      const data = await response.json()
      console.log('API响应:', data)
      
      if (data.success) {
        console.log('弹幕发送成功')
        setInputValue('')
        onShowInputChange?.(false)
        fetchDanmakus() // 刷新弹幕列表
      } else {
        console.error('弹幕发送失败:', data.message)
        alert('发送失败: ' + data.message)
      }
    } catch (error) {
      console.error('发送弹幕失败:', error)
      alert('发送失败: ' + (error as Error).message)
    }
  }

  // 记录已播放的弹幕，避免重复
  const playedDanmakusRef = useRef<Set<string>>(new Set())
  const lastPlayTimeRef = useRef<number>(0)

  // 处理播放状态变化
  useEffect(() => {
    if (isPlaying) {
      // 开始播放
      let index = 0
      const batchSize = 3 // 减少批次大小
      
      // 重置已播放记录
      playedDanmakusRef.current.clear()

      const playBatch = () => {
        // 如果没有弹幕数据，等待10秒后重试
        if (danmakus.length === 0) {
          setTimeout(playBatch, 10000)
          return
        }

        // 过滤掉最近已播放的弹幕
        const availableDanmakus = danmakus.filter(danmaku => {
          const key = `${danmaku.text}_${danmaku.color}`
          const wasRecentlyPlayed = playedDanmakusRef.current.has(key)
          return !wasRecentlyPlayed
        })

        // 如果所有弹幕都播放过了，清空记录重新开始，但要等待足够长的时间
        if (availableDanmakus.length === 0) {
          const timeSinceLastPlay = Date.now() - lastPlayTimeRef.current
          if (timeSinceLastPlay > 30000) { // 30秒后才允许重复播放
            playedDanmakusRef.current.clear()
            setTimeout(playBatch, 3000)
          } else {
            setTimeout(playBatch, 10000) // 等待更长时间
          }
          return
        }

        // 随机选择弹幕而不是按顺序，避免重复模式
        const shuffled = [...availableDanmakus].sort(() => Math.random() - 0.5)
        const batch = shuffled.slice(0, Math.min(batchSize, shuffled.length))
        
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth
        const containerHeight = containerRef.current?.offsetHeight || window.innerHeight
        
        batch.forEach((danmaku, i) => {
          setTimeout(() => {
            // 再次检查播放状态
            if (!isPlaying) return
            
            // 计算弹幕文本宽度，确保从屏幕外开始
            const textWidth = (danmaku.text?.length || 0) * 16
            // 生成绝对唯一ID
            counterRef.current += 1
            const uniqueId = `danmaku-${counterRef.current}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            
            // 计算Y轴位置，避免与现有弹幕重叠
            let yPosition: number = Math.random() * (containerHeight - 150) + 80
            let attempts = 0
            do {
              yPosition = Math.random() * (containerHeight - 150) + 80
              attempts++
              if (attempts > 15) break // 增加尝试次数
            } while (
              displayedDanmakus.some(existing => 
                Math.abs((existing.y || 0) - yPosition) < 50 && // 增加最小间距到50px
                (existing.x || 0) > containerWidth - 300 // 扩大检查范围
              )
            )
            
            const displayDanmaku = {
              ...danmaku,
              id: uniqueId,
              x: containerWidth + textWidth + 50,
              y: yPosition,
              speed: 1.2 + Math.random() * 0.8, // 减慢速度，增加观看时间
              timestamp: Date.now()
            }
            
            // 添加弹幕到显示列表
            setDisplayedDanmakus(prev => {
              if (!isPlaying) return prev
              
              // 更严格的去重检查：检查相同文本的弹幕
              const hasIdenticalText = prev.some(existing => 
                existing.text === displayDanmaku.text &&
                Date.now() - (existing.timestamp || 0) < 15000 // 15秒内不允许相同文本
              )
              
              if (hasIdenticalText) {
                console.log('检测到15秒内重复文本弹幕，跳过:', displayDanmaku.text)
                return prev
              }
              
              // 记录此弹幕已播放
              const key = `${danmaku.text}_${danmaku.color}`
              playedDanmakusRef.current.add(key)
              lastPlayTimeRef.current = Date.now()
              
              return [...prev, displayDanmaku]
            })
          }, i * 500) // 增加间隔时间
        })
      }

      playBatch()
      intervalRef.current = setInterval(playBatch, 12000) // 增加到12秒间隔
    } else {
      // 停止播放 - 立即清除所有显示的弹幕
      setDisplayedDanmakus([])
      playedDanmakusRef.current.clear()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, danmakus])

  // 键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendDanmaku()
    } else if (e.key === 'Escape') {
      onShowInputChange?.(false)
      setInputValue('')
    }
  }

  if (!enabled || !configEnabled) return null

  return (
    <>
      {/* 弹幕容器 */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 50, // 降低z-index，确保不会覆盖重要UI（如控制台、模态框等）
          overflow: 'hidden'
        }}
      >
        {displayedDanmakus.map(danmaku => (
          <div
            key={danmaku.id}
            style={{
              position: 'absolute',
              left: `${danmaku.x || 0}px`,
              top: `${danmaku.y || 0}px`,
              color: danmaku.color,
              fontSize: '16px',
              fontWeight: 'bold',
              textShadow: `
                2px 2px 4px rgba(0,0,0,0.9),
                -1px -1px 2px rgba(0,0,0,0.9),
                1px -1px 2px rgba(0,0,0,0.9),
                -1px 1px 2px rgba(0,0,0,0.9),
                0 0 8px rgba(0,0,0,0.6)
              `,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              animation: 'danmakuGlow 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 3px currentColor)',
              // 确保弹幕在各种背景下都清晰可见
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '2px',
              padding: '2px 4px',
              backdropFilter: 'blur(1px)'
            }}
          >
            {danmaku.text}
          </div>
        ))}
      </div>

      {/* 弹幕输入框 */}
      {showInput && (
        <div
          style={{
            position: 'fixed',
            bottom: '60px',
            left: '20px',
            zIndex: 300,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '280px'
          }}
        >
          {/* 输入框和颜色选择器 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入弹幕内容（最多20字）"
              maxLength={20}
              autoFocus
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                padding: '8px',
                color: 'white',
                fontSize: '14px',
                flex: 1
              }}
            />
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{
                width: '40px',
                height: '36px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                background: 'transparent',
                cursor: 'pointer'
              }}
              title="选择弹幕颜色"
            />
          </div>

          {/* 预览效果 */}
          <div style={{ 
            color: selectedColor, 
            fontSize: '14px', 
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            minHeight: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {inputValue || '预览效果'}
          </div>
          
          {/* 快速颜色选择 */}
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
              快速选色：
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                '#FFFFFF', '#FF0000', '#FF7F00', '#FFFF00', 
                '#00FF00', '#0000FF', '#4B0082', '#9400D3',
                '#FF1493', '#00CED1', '#FFD700', '#ADFF2F'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    border: selectedColor === color ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={(e) => {
                e.preventDefault()
                console.log('按钮被点击，当前状态:', {
                  inputValue,
                  trimmed: inputValue.trim(),
                  length: inputValue.length,
                  disabled: !inputValue.trim() || inputValue.length > 20
                })
                sendDanmaku()
              }}
              disabled={!inputValue.trim() || inputValue.length > 20}
              style={{
                background: inputValue.trim() && inputValue.length <= 20 
                  ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' 
                  : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: inputValue.trim() && inputValue.length <= 20 ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              发送 {inputValue.trim() && inputValue.length <= 20 ? '✓' : '✗'}
            </button>
            <button
              onClick={() => {
                onShowInputChange?.(false)
                setInputValue('')
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* CSS动画 */}
      <style jsx global>{`
        @keyframes danmakuGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 15px currentColor) drop-shadow(0 0 25px currentColor);
          }
        }
        
        @keyframes danmaku-flow {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  )
}

export default Danmaku