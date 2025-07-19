'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { RealisticTexturedPlanet } from './RealisticTexturedPlanet'
import { CentralStar } from './CentralStar'

interface Agent {
  id: string
  name: string
  description: string
  tags: string
  manager: string
  homepage?: string
  icon?: string
  enabled: boolean
}

interface SolarSystem3DProps {
  agents: Agent[]
  onPlanetHover?: (agent: Agent | null) => void
}

// 真实太阳系轨道参数（减慢速度）
const orbitParameters = [
  { distance: 120, period: 88, size: 20, name: '水星轨道', speed: 0.008 },     
  { distance: 160, period: 225, size: 22, name: '金星轨道', speed: 0.006 },    
  { distance: 200, period: 365, size: 24, name: '地球轨道', speed: 0.005 },    
  { distance: 250, period: 687, size: 21, name: '火星轨道', speed: 0.004 },    
  { distance: 320, period: 4333, size: 45, name: '木星轨道', speed: 0.002 },   
  { distance: 400, period: 10759, size: 40, name: '土星轨道', speed: 0.0015 }, 
  { distance: 480, period: 30687, size: 28, name: '天王星轨道', speed: 0.001 }, 
  { distance: 560, period: 60190, size: 26, name: '海王星轨道', speed: 0.0008 }  
]

interface Planet3D {
  agent: Agent
  orbitRadius: number
  orbitAngle: number
  orbitSpeed: number
  planetSize: number
  planetIndex: number
  x: number
  y: number
  z: number
}

export const SolarSystem3D: React.FC<SolarSystem3DProps> = ({
  agents,
  onPlanetHover
}) => {
  // 3D视角控制
  const [rotation, setRotation] = useState({ x: -0.3, y: 0 }) // 默认斜视角度
  const [zoom, setZoom] = useState(1)
  const [timeScale, setTimeScale] = useState(0.5) // 默认慢速
  const [showOrbits, setShowOrbits] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  
  // 鼠标控制
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const planetsRef = useRef<Planet3D[]>([])
  const animationRef = useRef<number>()

  // 初始化行星数据
  const planets = useMemo(() => {
    return agents.map((agent, index) => {
      const orbitIndex = index % orbitParameters.length
      const orbit = orbitParameters[orbitIndex]
      
      return {
        agent,
        orbitRadius: orbit.distance,
        orbitAngle: Math.random() * 360, // 随机初始位置
        orbitSpeed: orbit.speed,
        planetSize: orbit.size,
        planetIndex: index,
        x: 0,
        y: 0,
        z: 0
      }
    })
  }, [agents])

  // 3D数学函数
  const rotateX = (point: { x: number; y: number; z: number }, angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos
    }
  }

  const rotateY = (point: { x: number; y: number; z: number }, angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: point.x * cos + point.z * sin,
      y: point.y,
      z: -point.x * sin + point.z * cos
    }
  }

  const project3D = (point: { x: number; y: number; z: number }) => {
    const distance = 800
    const adjustedZ = Math.max(point.z, -distance + 50)
    const scale = distance / (distance - adjustedZ)
    const finalScale = Math.max(0.1, scale * zoom)
    
    return {
      x: point.x * finalScale,
      y: point.y * finalScale,
      scale: finalScale,
      z: adjustedZ
    }
  }

  // 更新行星位置
  useEffect(() => {
    const animate = () => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      planetsRef.current = planets.map(planet => {
        // 更新轨道角度
        const newAngle = planet.orbitAngle + (planet.orbitSpeed * timeScale * 100)
        
        // 计算3D轨道位置
        let point = {
          x: Math.cos(newAngle * Math.PI / 180) * planet.orbitRadius,
          y: 0, // 轨道平面
          z: Math.sin(newAngle * Math.PI / 180) * planet.orbitRadius
        }

        // 应用3D旋转
        point = rotateX(point, rotation.x)
        point = rotateY(point, rotation.y)

        // 3D投影
        const projected = project3D(point)

        return {
          ...planet,
          orbitAngle: newAngle % 360,
          x: centerX + projected.x,
          y: centerY + projected.y,
          z: projected.z
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [planets, rotation, zoom, timeScale])

  // 自动旋转
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.002
      }))
    }, 16)

    return () => clearInterval(interval)
  }, [autoRotate])

  // 鼠标控制
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMouse.x
    const deltaY = e.clientY - lastMouse.y

    setRotation(prev => ({
      x: prev.x + deltaY * 0.005,
      y: prev.y + deltaX * 0.005
    }))

    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)))
  }

  // 渲染轨道线
  const renderOrbits = () => {
    if (!showOrbits) return null

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    return orbitParameters.slice(0, agents.length).map((orbit, index) => {
      const orbitPoints: { x: number; y: number }[] = []
      
      // 生成轨道圆上的点
      for (let angle = 0; angle < 360; angle += 5) {
        let point = {
          x: Math.cos(angle * Math.PI / 180) * orbit.distance,
          y: 0,
          z: Math.sin(angle * Math.PI / 180) * orbit.distance
        }

        // 应用3D旋转
        point = rotateX(point, rotation.x)
        point = rotateY(point, rotation.y)

        // 3D投影
        const projected = project3D(point)
        orbitPoints.push({
          x: centerX + projected.x,
          y: centerY + projected.y
        })
      }

      // 创建SVG路径
      const pathData = orbitPoints.reduce((acc, point, index) => {
        return acc + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
      }, '') + ' Z'

      return (
        <svg
          key={`orbit-${index}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          <path
            d={pathData}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        </svg>
      )
    })
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 轨道线 */}
      {renderOrbits()}

      {/* 中央太阳 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}>
        <CentralStar />
      </div>

      {/* 行星 */}
      {planetsRef.current.map((planet, index) => (
        <div
          key={planet.agent.id}
          style={{
            position: 'absolute',
            left: planet.x,
            top: planet.y,
            transform: 'translate(-50%, -50%)',
            zIndex: Math.round(100 + planet.z)
          }}
        >
          <RealisticTexturedPlanet
            agent={planet.agent}
            orbitRadius={planet.orbitRadius}
            orbitSpeed={0} // 轨道运动由外部控制
            planetSize={planet.planetSize}
            planetIndex={planet.planetIndex}
            onHover={(isHovered: boolean) => {
              if (onPlanetHover) {
                onPlanetHover(isHovered ? planet.agent : null)
              }
            }}
          />
        </div>
      ))}

      {/* 3D控制面板 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        color: 'white',
        fontSize: '14px',
        zIndex: 150,
        minWidth: '280px'
      }}>
        <div style={{ 
          marginBottom: '12px', 
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px'
        }}>
          🌌 3D太阳系控制台
        </div>

        {/* 时间流速控制 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '6px' }}>
            🕐 时间流速: {timeScale.toFixed(1)}x
          </div>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>

        {/* 视角控制 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '6px' }}>
            📐 视角控制
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <button
              onClick={() => setRotation({ x: 0, y: 0 })}
              style={{
                background: 'rgba(52, 152, 219, 0.3)',
                border: '1px solid rgba(52, 152, 219, 0.5)',
                color: '#3498db',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              正视
            </button>
            <button
              onClick={() => setRotation({ x: -0.5, y: 0.3 })}
              style={{
                background: 'rgba(46, 204, 113, 0.3)',
                border: '1px solid rgba(46, 204, 113, 0.5)',
                color: '#2ecc71',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              斜视
            </button>
            <button
              onClick={() => setRotation({ x: -1.2, y: 0 })}
              style={{
                background: 'rgba(155, 89, 182, 0.3)',
                border: '1px solid rgba(155, 89, 182, 0.5)',
                color: '#9b59b6',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              侧视
            </button>
          </div>
        </div>

        {/* 其他控制 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '6px' }}>
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            🔭 显示轨道线
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            🔄 自动旋转视角
          </label>
        </div>

        {/* 缩放控制 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '6px' }}>
            🔍 缩放: {zoom.toFixed(1)}x
          </div>
          <input
            type="range"
            min="0.3"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>

        {/* 操作提示 */}
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.7,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '8px'
        }}>
          🖱️ 拖拽旋转视角<br />
          🎯 滚轮缩放距离<br />
          🪐 {agents.length} 颗AI行星
        </div>
      </div>
    </div>
  )
}