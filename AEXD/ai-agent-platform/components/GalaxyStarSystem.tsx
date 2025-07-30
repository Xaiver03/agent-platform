'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  description: string
  tags: string
  manager: string
  homepage?: string
  icon?: string
  enabled: boolean
  themeColor?: string
  clickCount?: number
}

interface GalaxyStarSystemProps {
  agents: Agent[]
  onPlanetHover?: (agent: Agent) => void
}

// 根据标签获取星星颜色 - 彩虹色系
const getStarColor = (tags: string): string => {
  const tagLower = tags.toLowerCase()
  if (tagLower.includes('编程') || tagLower.includes('代码')) return '#FF0000' // 红色
  if (tagLower.includes('设计') || tagLower.includes('图像')) return '#FF7F00' // 橙色
  if (tagLower.includes('写作') || tagLower.includes('文档')) return '#FFFF00' // 黄色
  if (tagLower.includes('搜索') || tagLower.includes('研究')) return '#00FF00' // 绿色
  if (tagLower.includes('对话') || tagLower.includes('助手')) return '#0000FF' // 蓝色
  if (tagLower.includes('分析') || tagLower.includes('数据')) return '#4B0082' // 靛色
  return '#9400D3' // 紫色（默认）
}

// 根据点击次数计算星等 - 使用缓存优化
const starMagnitudeCache = new Map<number, any>()
const getStarMagnitude = (clickCount: number = 0) => {
  if (starMagnitudeCache.has(clickCount)) {
    return starMagnitudeCache.get(clickCount)
  }
  
  let result
  if (clickCount >= 1000) result = { magnitude: 1, size: 8, brightness: 1.0, glow: 20, label: '超亮星' }
  else if (clickCount >= 500) result = { magnitude: 2, size: 6, brightness: 0.9, glow: 16, label: '一等星' }
  else if (clickCount >= 200) result = { magnitude: 3, size: 5, brightness: 0.8, glow: 12, label: '二等星' }
  else if (clickCount >= 100) result = { magnitude: 4, size: 4, brightness: 0.7, glow: 10, label: '三等星' }
  else if (clickCount >= 50) result = { magnitude: 5, size: 3.5, brightness: 0.6, glow: 8, label: '四等星' }
  else if (clickCount >= 20) result = { magnitude: 6, size: 3, brightness: 0.5, glow: 6, label: '五等星' }
  else result = { magnitude: 7, size: 2.5, brightness: 0.4, glow: 4, label: '暗星' }
  
  starMagnitudeCache.set(clickCount, result)
  return result
}

const GalaxyStarSystem: React.FC<GalaxyStarSystemProps> = ({
  agents,
  onPlanetHover
}) => {
  // 3D控制状态
  const [rotateX, setRotateX] = useState(-20)
  const [rotateY, setRotateY] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showStarNames, setShowStarNames] = useState(false)
  
  // 星星运动速度控制
  const [starSpeed, setStarSpeed] = useState(1.0) // 1.0为正常速度，范围0.1-3.0
  const [isPaused, setIsPaused] = useState(false)
  
  // 交互状态
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [cardVisible, setCardVisible] = useState<string | null>(null) // 显示卡片的agent ID
  const [cardHovered, setCardHovered] = useState(false) // 卡片是否被悬停
  const [pausedStars, setPausedStars] = useState<Set<string>>(new Set()) // 暂停运动的星星

  // 响应式背景星空 - 根据屏幕尺寸自动生成
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    if (typeof window !== 'undefined') {
      updateWindowSize()
      window.addEventListener('resize', updateWindowSize)
      return () => window.removeEventListener('resize', updateWindowSize)
    }
  }, [])

  // 使用useMemo优化背景星空生成，避免不必要的重新计算
  const backgroundStars = useMemo(() => {
    const baseStars = 40 // 减少基础星星数量
    const extraStars = Math.min(20, Math.floor(windowSize.width / 120)) // 进一步优化
    const starCount = baseStars + extraStars
    
    const stars = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        size: Math.random() < 0.1 ? 2 : 1,
        brightness: Math.random() * 0.4 + 0.3,
        twinkleDelay: Math.random() * 2
      })
    }
    return stars
  }, [windowSize.width, windowSize.height])

  // AI产品星星 - 带物理运动和碰撞回弹，包含尾迹系统
  const [agentStars, setAgentStars] = useState<Array<{
    agent: Agent,
    x: number,
    y: number,
    vx: number, // x方向速度
    vy: number, // y方向速度
    color: string,
    magnitude: any,
    trail: Array<{x: number, y: number, age: number}> // 尾迹点数组
  }>>([])

  // 初始化AI产品星星位置和速度
  useEffect(() => {
    const stars = agents.map((agent, index) => {
      const hash = agent.id.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      
      // 让星星更集中在中心区域分布
      const centerX = windowSize.width / 2
      const centerY = windowSize.height / 2
      const maxDistance = Math.min(windowSize.width, windowSize.height) * 0.3 // 中心区域半径
      
      // 使用正态分布让星星更集中在中心
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * maxDistance
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      
      return {
        agent,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5, // 稍微降低初始速度
        vy: (Math.random() - 0.5) * 1.5,
        color: agent.themeColor || getStarColor(agent.tags),
        magnitude: getStarMagnitude(agent.clickCount || 0),
        trail: [] // 初始化空尾迹
      }
    })
    setAgentStars(stars)
  }, [agents, windowSize])

  // 卡片显示控制 - 精确的3秒计时
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    
    if (hoveredAgent) {
      // 悬停星星时立即显示卡片并暂停星星运动
      setCardVisible(hoveredAgent.id)
      setPausedStars(prev => new Set(prev).add(hoveredAgent.id))
      
      // 清除之前的计时器
      if (timer) clearTimeout(timer)
    } else if (!hoveredAgent && !cardHovered && cardVisible) {
      // 离开星星且没有悬停卡片时，立即启动3秒倒计时
      timer = setTimeout(() => {
        if (!hoveredAgent && !cardHovered) {
          setCardVisible(null)
          setPausedStars(prev => {
            const newSet = new Set(prev)
            newSet.delete(cardVisible)
            return newSet
          })
        }
      }, 3000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [hoveredAgent, cardHovered, cardVisible])

  // 卡片悬停状态变化处理
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (!cardHovered && !hoveredAgent && cardVisible) {
      // 既没有悬停星星也没有悬停卡片时，启动3秒倒计时
      timer = setTimeout(() => {
        if (!cardHovered && !hoveredAgent) {
          setCardVisible(null)
          setPausedStars(prev => {
            const newSet = new Set(prev)
            newSet.delete(cardVisible)
            return newSet
          })
        }
      }, 3000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [cardHovered, hoveredAgent, cardVisible])

  // 物理运动和碰撞检测 - 优化性能，减少频闪
  useEffect(() => {
    let animationFrame: number
    let lastTime = 0
    const targetFPS = 30 // 提升帧率以改善尾迹流畅度
    const frameInterval = 1000 / targetFPS
    let frameCount = 0
    let lastUpdateTime = 0

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        lastTime = currentTime
        frameCount++
        
        // 尾迹每帧更新，物理计算每2帧更新一次（平衡性能和流畅度）
        const shouldUpdatePhysics = frameCount % 2 === 0
        
        // 防抖机制：调整为30ms以配合新帧率
        const shouldUpdateState = currentTime - lastUpdateTime > 30
        
        if (shouldUpdateState) {
          lastUpdateTime = currentTime
          
          setAgentStars(prevStars => {
            return prevStars.map(star => {
            // 如果星星被暂停或整体暂停，只更新尾迹老化，不更新位置
            if (pausedStars.has(star.agent.id) || isPaused) {
              return {
                ...star,
                trail: star.trail
                  .map(point => ({ ...point, age: point.age + 1 }))
                  .filter(point => point.age < 20) // 尾迹每帧更新，保持更长
              }
            }

            let newX = star.x + (star.vx * starSpeed)
            let newY = star.y + (star.vy * starSpeed)
            let newVx = star.vx
            let newVy = star.vy

            // 向心力 - 让星星倾向于聚集在中心
            const centerX = windowSize.width / 2
            const centerY = windowSize.height / 2
            const distanceFromCenter = Math.sqrt((star.x - centerX) ** 2 + (star.y - centerY) ** 2)
            const maxCenterDistance = Math.min(windowSize.width, windowSize.height) * 0.4
            
            // 如果离中心太远，施加向心力
            if (distanceFromCenter > maxCenterDistance) {
              const centerForce = 0.02 // 向心力强度
              const directionX = (centerX - star.x) / distanceFromCenter
              const directionY = (centerY - star.y) / distanceFromCenter
              
              newVx += directionX * centerForce
              newVy += directionY * centerForce
            }

            // 优化尾迹更新 - 每帧更新尾迹，保持流畅度
            const newTrail = [
              { x: star.x, y: star.y, age: 0 },
              ...star.trail
                .map(point => ({ ...point, age: point.age + 1 }))
                .filter(point => point.age < 15) // 保持适中的尾迹长度
            ]

            // 边界碰撞检测 - 概率性逃逸机制
            const starSize = star.magnitude.size * 5
            const escapeChance = 0.2 // 20%逃逸概率
            
            // X轴边界检测
            if (newX <= starSize || newX >= windowSize.width - starSize) {
              if (Math.random() > escapeChance) {
                // 80%概率反弹
                newVx = -newVx * 0.8
                newX = Math.max(starSize, Math.min(windowSize.width - starSize, newX))
              } else {
                // 20%概率逃逸 - 从对面重新进入
                if (newX <= starSize) {
                  newX = windowSize.width - starSize - 5
                } else {
                  newX = starSize + 5
                }
                // 轻微改变速度方向，让重新进入更自然
                newVx = newVx * 0.9 + (Math.random() - 0.5) * 0.2
                newVy = newVy + (Math.random() - 0.5) * 0.3
              }
            }
            
            // Y轴边界检测
            if (newY <= starSize || newY >= windowSize.height - starSize) {
              if (Math.random() > escapeChance) {
                // 80%概率反弹
                newVy = -newVy * 0.8
                newY = Math.max(starSize, Math.min(windowSize.height - starSize, newY))
              } else {
                // 20%概率逃逸 - 从对面重新进入
                if (newY <= starSize) {
                  newY = windowSize.height - starSize - 5
                } else {
                  newY = starSize + 5
                }
                // 轻微改变速度方向
                newVy = newVy * 0.9 + (Math.random() - 0.5) * 0.2
                newVx = newVx + (Math.random() - 0.5) * 0.3
              }
            }

            // 优化UI碰撞检测 - 保持功能性但减少执行频率
            const elements = shouldUpdatePhysics ? [
              // 右侧控制面板 - 整个面板区域
              { x: windowSize.width - 180, y: 20, width: 160, height: 450, type: 'panel' },
              
              // 左侧搜索面板 - 整个面板区域
              { x: 20, y: 20, width: 220, height: 120, type: 'panel' },
              
              // 主标题文字区域 "MiraclePlus AI Galaxy"
              { x: windowSize.width / 2 - 200, y: 80, width: 400, height: 50, type: 'text' },
              
              // 副标题文字区域 "探索奇绩AI的星海"
              { x: windowSize.width / 2 - 100, y: 130, width: 200, height: 20, type: 'text' },
              
              // 左侧奇绩AI星图文字
              { x: 20, y: 140, width: 180, height: 20, type: 'text' },
              
              // 星星数量显示文字
              { x: 20, y: 220, width: 180, height: 15, type: 'text' },
              
              // 右侧控制面板文字区域
              { x: windowSize.width - 160, y: 30, width: 140, height: 20, type: 'text' },
              
              // 控制面板各个控件
              { x: windowSize.width - 160, y: 50, width: 140, height: 30, type: 'control' }, // 俯仰控制
              { x: windowSize.width - 160, y: 90, width: 140, height: 30, type: 'control' }, // 方位控制
              { x: windowSize.width - 160, y: 130, width: 140, height: 30, type: 'control' }, // 缩放控制
              { x: windowSize.width - 160, y: 170, width: 140, height: 20, type: 'control' }, // 自动旋转
              { x: windowSize.width - 160, y: 200, width: 140, height: 20, type: 'control' }, // 显示星名
              { x: windowSize.width - 160, y: 230, width: 140, height: 80, type: 'text' }, // 星等说明
              
              // 底部反馈按钮区域
              { x: windowSize.width / 2 - 100, y: windowSize.height - 100, width: 200, height: 60, type: 'button' },
              
              // 左下角作者信息区域
              { x: 20, y: windowSize.height - 60, width: 180, height: 40, type: 'text' },
              
              // 底部版权信息文字
              { x: windowSize.width - 300, y: windowSize.height - 30, width: 280, height: 20, type: 'text' },
              
              // 选中星星信息卡片区域（如果显示）
              ...(selectedAgent ? [{ 
                x: windowSize.width / 2 - 200, 
                y: windowSize.height - 160, 
                width: 400, 
                height: 80, 
                type: 'card' 
              }] : []),
              
              // 悬停卡片区域（如果显示）- 简化检测
              ...(cardVisible ? agentStars
                .filter(s => s.agent.id === cardVisible)
                .slice(0, 1) // 只检测第一个匹配的星星
                .map(s => ({
                  x: s.x + 30,
                  y: s.y - 80,
                  width: 280,
                  height: 160,
                  type: 'card'
                })) : [])
            ] : []

            // 简化的碰撞检测
            for (const element of elements) {
              if (newX + starSize > element.x && newX - starSize < element.x + element.width &&
                  newY + starSize > element.y && newY - starSize < element.y + element.height) {
                
                // 简化的碰撞反弹
                const centerX = element.x + element.width / 2
                const centerY = element.y + element.height / 2
                const deltaX = newX - centerX
                const deltaY = newY - centerY
                
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                  newVx = -newVx * 0.8
                  newX = deltaX > 0 ? element.x + element.width + starSize + 2 : element.x - starSize - 2
                } else {
                  newVy = -newVy * 0.8
                  newY = deltaY > 0 ? element.y + element.height + starSize + 2 : element.y - starSize - 2
                }
                break
              }
            }

            return {
              ...star,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              trail: newTrail
            }
            })
          })
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [windowSize, pausedStars, starSpeed, isPaused])

  // 自动旋转
  useEffect(() => {
    if (!autoRotate) return
    
    const interval = setInterval(() => {
      setRotateY(prev => (prev + 0.1) % 360)
    }, 64) // 降低自动旋转频率
    
    return () => clearInterval(interval)
  }, [autoRotate])

  // 使用useCallback优化鼠标拖拽控制，避免不必要的重新创建
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMouse.x
    const deltaY = e.clientY - lastMouse.y
    
    setRotateY(prev => prev + deltaX * 0.5)
    setRotateX(prev => Math.max(-90, Math.min(90, prev - deltaY * 0.5)))
    
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastMouse.x, lastMouse.y])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 使用useCallback优化点击星星处理函数
  const handleStarClick = useCallback(async (agentId: string) => {
    try {
      await fetch(`/api/agents/${agentId}/click`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('记录点击失败:', error)
    }
  }, [])

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%, #000000 100%)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 响应式背景星空 */}
        {backgroundStars.map((star, index) => (
          <div
            key={index}
            style={{
              position: 'fixed',
              left: `${star.x}px`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              backgroundColor: `rgba(255, 255, 255, ${star.brightness})`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.5})`,
              animation: `twinkle ${2 + star.twinkleDelay}s infinite`,
              zIndex: 1
            }}
          />
        ))}

        {/* AI产品星星 - 流星效果，带尾迹 */}
        {agentStars.map((star) => {
          const magnitude = star.magnitude
          const isHovered = hoveredAgent?.id === star.agent.id
          const isSelected = selectedAgent?.id === star.agent.id
          const isCardVisible = cardVisible === star.agent.id
          
          return (
            <div key={star.agent.id} style={{ position: 'relative' }}>
              {/* 流星尾迹 */}
              {star.trail.map((trailPoint, index) => {
                const opacity = Math.max(0, (15 - trailPoint.age) / 15) * 0.8
                const size = Math.max(1, (magnitude.size * 4 * (15 - trailPoint.age)) / 15)
                
                return (
                  <div
                    key={`trail-${index}`}
                    style={{
                      position: 'fixed',
                      left: `${trailPoint.x}px`,
                      top: `${trailPoint.y}px`,
                      transform: 'translate(-50%, -50%)',
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${star.color} 0%, ${star.color}88 50%, transparent 100%)`,
                      boxShadow: `0 0 ${size * 2}px ${star.color}66`,
                      opacity: opacity,
                      zIndex: 15,
                      pointerEvents: 'none'
                    }}
                  />
                )
              })}
              
              {/* 流星主体 - 更大的星星 */}
              <div
                style={{
                  position: 'fixed',
                  left: `${star.x}px`,
                  top: `${star.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: `${magnitude.size * 5}px`, // 增大到5倍
                  height: `${magnitude.size * 5}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${star.color} 0%, ${star.color}dd 20%, ${star.color}aa 40%, ${star.color}66 70%, transparent 100%)`,
                  boxShadow: `
                    0 0 ${magnitude.glow * 4}px ${star.color}ff,
                    0 0 ${magnitude.glow * 8}px ${star.color}cc,
                    0 0 ${magnitude.glow * 15}px ${star.color}88,
                    0 0 ${magnitude.glow * 25}px ${star.color}44,
                    inset 0 0 ${magnitude.size * 3}px ${star.color}ff
                  `,
                  cursor: 'pointer',
                  transition: 'filter 0.3s ease, transform 0.3s ease',
                  opacity: magnitude.brightness,
                  zIndex: 25,
                  ...(isHovered && {
                    transform: 'translate(-50%, -50%) scale(1.3)',
                    filter: 'brightness(1.8) saturate(1.5)'
                  }),
                  ...(isSelected && {
                    animation: 'meteorPulse 2s infinite'
                  })
                }}
                onMouseEnter={() => setHoveredAgent(star.agent)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedAgent(star.agent)
                  handleStarClick(star.agent.id)
                }}
              />
              
              {/* 悬停介绍卡片 */}
              {isCardVisible && (
                <div
                  style={{
                    position: 'fixed',
                    left: `${star.x + 30}px`,
                    top: `${star.y - 80}px`,
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: `2px solid ${star.color}66`,
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    minWidth: '240px',
                    maxWidth: '320px',
                    zIndex: 50,
                    boxShadow: `
                      0 0 20px rgba(0, 0, 0, 0.8),
                      0 0 30px ${star.color}33,
                      inset 0 0 20px rgba(255, 255, 255, 0.05)
                    `,
                    animation: 'fadeInUp 0.3s ease-out',
                    pointerEvents: 'auto'
                  }}
                  onMouseEnter={() => setCardHovered(true)}
                  onMouseLeave={() => setCardHovered(false)}
                >
                  {/* 卡片头部 */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      marginRight: '8px',
                      filter: `drop-shadow(0 0 5px ${star.color})`
                    }}>
                      {star.agent.icon || '🤖'}
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '14px',
                        color: star.color,
                        textShadow: `0 0 5px ${star.color}66`
                      }}>
                        {star.agent.name}
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.7 }}>
                        {magnitude.label} | 管理员: {star.agent.manager}
                      </div>
                    </div>
                  </div>
                  
                  {/* 描述 */}
                  <div style={{ 
                    fontSize: '12px', 
                    marginBottom: '8px', 
                    opacity: 0.9,
                    lineHeight: '1.4'
                  }}>
                    {star.agent.description}
                  </div>
                  
                  {/* 标签 */}
                  <div style={{ 
                    fontSize: '10px', 
                    marginBottom: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    {star.agent.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        style={{
                          background: `${star.color}22`,
                          border: `1px solid ${star.color}44`,
                          color: star.color,
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '9px'
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  
                  {/* 统计信息 */}
                  <div style={{ 
                    fontSize: '10px', 
                    opacity: 0.6,
                    borderTop: `1px solid ${star.color}33`,
                    paddingTop: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>点击次数: {star.agent.clickCount || 0}</span>
                    <span>星等: {magnitude.magnitude}等</span>
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                    justifyContent: 'space-between'
                  }}>
                    {/* 访问官网按钮 */}
                    {star.agent.homepage && (
                      <button
                        style={{
                          background: `linear-gradient(135deg, ${star.color}aa, ${star.color}88)`,
                          border: `1px solid ${star.color}`,
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(star.agent.homepage, '_blank')
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${star.color}, ${star.color}cc)`
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${star.color}aa, ${star.color}88)`
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        🌐 官网
                      </button>
                    )}
                    
                    {/* 使用指南按钮 */}
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${star.color}66`,
                        color: star.color,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        // 跳转到详情页
                        window.open(`/agents/${star.agent.id}`, '_blank')
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${star.color}22`
                        e.currentTarget.style.borderColor = star.color
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        e.currentTarget.style.borderColor = `${star.color}66`
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      📖 指南
                    </button>
                  </div>
                  
                  {/* 小箭头指向星星 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderRight: `8px solid ${star.color}66`
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}

        {/* 星星名称标签 */}
        {showStarNames && agentStars.map((star) => (
          <div
            key={`label-${star.agent.id}`}
            style={{
              position: 'fixed',
              left: `${star.x + 15}px`,
              top: `${star.y - 10}px`,
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              textShadow: '0 0 6px rgba(0,0,0,0.9)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              background: 'rgba(0,0,0,0.7)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.3)',
              zIndex: 25
            }}
          >
            {star.agent.name}
          </div>
        ))}

        {/* 选中星星的信息卡片 */}
        {selectedAgent && (
          <div
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
              maxWidth: '400px',
              zIndex: 1000
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>{selectedAgent.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{selectedAgent.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>管理员: {selectedAgent.manager}</div>
              </div>
            </div>
            
            <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.9 }}>
              {selectedAgent.description}
            </div>
            
            <div style={{ fontSize: '10px', marginBottom: '12px', opacity: 0.7 }}>
              🏷️ {selectedAgent.tags}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/agents/${selectedAgent.id}`}>
                <button style={{
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  🔍 查看详情
                </button>
              </Link>
              {selectedAgent.homepage && (
                <a href={selectedAgent.homepage} target="_blank" rel="noopener noreferrer">
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    🌐 访问官网
                  </button>
                </a>
              )}
              <button
                onClick={() => setSelectedAgent(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                ✕ 关闭
              </button>
            </div>
          </div>
        )}

        {/* 控制面板 */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          fontSize: '11px',
          zIndex: 1000,
          minWidth: '160px'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold', textAlign: 'center' }}>
            🌌 星系控制
          </div>

          {/* 3D控制 */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ marginBottom: '4px', fontSize: '10px' }}>↕ 俯仰: {rotateX.toFixed(0)}°</div>
            <input
              type="range"
              min="-90"
              max="90"
              value={rotateX}
              onChange={(e) => setRotateX(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '6px' }}
            />
            
            <div style={{ marginBottom: '4px', fontSize: '10px' }}>🔄 方位: {rotateY.toFixed(0)}°</div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotateY}
              onChange={(e) => setRotateY(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '6px' }}
            />
            
            <div style={{ marginBottom: '4px', fontSize: '10px' }}>🔍 缩放: {zoom.toFixed(1)}x</div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* 自动旋转 */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '10px' }}>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                style={{ marginRight: '6px' }}
              />
              🔄 自动旋转
            </label>
          </div>

          {/* 显示星名 */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '10px' }}>
              <input
                type="checkbox"
                checked={showStarNames}
                onChange={(e) => setShowStarNames(e.target.checked)}
                style={{ marginRight: '6px' }}
              />
              🔤 显示星名
            </label>
          </div>

          {/* 星等说明 */}
          <div style={{ 
            fontSize: '8px', 
            opacity: 0.8,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '6px'
          }}>
            ⭐ 星等:<br />
            1-2等: 1000+ (超亮)<br />
            3-4等: 100-999<br />
            5-7等: &lt;100 (暗星)
          </div>

          {/* 星星速度控制 */}
          <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '6px' }}>
            <div style={{ fontSize: '10px', marginBottom: '4px' }}>
              ⚡ 星星速度: {isPaused ? '已暂停' : starSpeed.toFixed(1)}x
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={starSpeed}
              onChange={(e) => {
                setStarSpeed(Number(e.target.value))
                setIsPaused(false) // 调整速度时自动取消暂停
              }}
              style={{ width: '100%', marginBottom: '4px' }}
            />
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '10px' }}>
              <input
                type="checkbox"
                checked={isPaused}
                onChange={(e) => setIsPaused(e.target.checked)}
                style={{ marginRight: '6px' }}
              />
              ⏸️ 暂停运动
            </label>
          </div>
        </div>
      </div>

      {/* CSS动画 */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          25% { 
            opacity: 1;
            transform: scale(1.2);
          }
          50% { 
            opacity: 0.5;
            transform: scale(0.9);
          }
          75% { 
            opacity: 0.8;
            transform: scale(1.1);
          }
          100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
        }
        
        @keyframes starPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.3);
            filter: brightness(1.8);
          }
        }
        
        @keyframes meteorPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1) saturate(1);
            box-shadow: 
              0 0 calc(var(--glow) * 4px) currentColor,
              0 0 calc(var(--glow) * 8px) currentColor,
              0 0 calc(var(--glow) * 15px) currentColor,
              0 0 calc(var(--glow) * 25px) currentColor;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            filter: brightness(2) saturate(1.8);
            box-shadow: 
              0 0 calc(var(--glow) * 6px) currentColor,
              0 0 calc(var(--glow) * 12px) currentColor,
              0 0 calc(var(--glow) * 25px) currentColor,
              0 0 calc(var(--glow) * 40px) currentColor;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  )
}

// 使用React.memo优化组件重渲染
export default React.memo(GalaxyStarSystem, (prevProps, nextProps) => {
  // 只有agents数组真正改变时才重新渲染
  return prevProps.agents.length === nextProps.agents.length && 
         prevProps.agents.every((agent, index) => 
           agent.id === nextProps.agents[index]?.id && 
           agent.clickCount === nextProps.agents[index]?.clickCount
         )
})