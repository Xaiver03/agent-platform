'use client'

import React, { useState, useEffect, useRef } from 'react'
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

interface SolarSystemOrbitProps {
  agents: Agent[]
  onPlanetHover?: (agent: Agent | null) => void
}

// 基于真实太阳系的轨道参数
const orbitParameters = [
  { distance: 150, period: 88, size: 25, name: '水星轨道' },     // 水星
  { distance: 200, period: 225, size: 28, name: '金星轨道' },    // 金星
  { distance: 260, period: 365, size: 30, name: '地球轨道' },    // 地球
  { distance: 320, period: 687, size: 27, name: '火星轨道' },    // 火星
  { distance: 420, period: 4333, size: 65, name: '木星轨道' },   // 木星
  { distance: 520, period: 10759, size: 58, name: '土星轨道' },  // 土星
  { distance: 620, period: 30687, size: 40, name: '天王星轨道' }, // 天王星
  { distance: 720, period: 60190, size: 38, name: '海王星轨道' }  // 海王星
]

export const SolarSystemOrbit: React.FC<SolarSystemOrbitProps> = ({
  agents,
  onPlanetHover
}) => {
  const [timeScale, setTimeScale] = useState(1) // 时间缩放因子
  const [showOrbits, setShowOrbits] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算每个行星的轨道参数
  const planetOrbits = agents.map((agent, index) => {
    const orbitIndex = index % orbitParameters.length
    const orbit = orbitParameters[orbitIndex]
    
    return {
      agent,
      orbitRadius: orbit.distance,
      orbitPeriod: orbit.period, // 实际周期（地球日）
      planetSize: orbit.size,
      orbitSpeed: 365 / orbit.period, // 相对于地球的速度
      orbitName: orbit.name,
      planetIndex: index
    }
  })

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* 轨道线显示 */}
      {showOrbits && planetOrbits.map((planet, index) => (
        <div
          key={`orbit-${index}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: planet.orbitRadius * 2,
            height: planet.orbitRadius * 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* 中央恒星（太阳） */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5
      }}>
        <CentralStar />
      </div>

      {/* 行星系统 */}
      {planetOrbits.map((planet, index) => (
        <RealisticTexturedPlanet
          key={planet.agent.id}
          agent={planet.agent}
          orbitRadius={planet.orbitRadius}
          orbitSpeed={planet.orbitSpeed * timeScale}
          planetSize={planet.planetSize}
          planetIndex={planet.planetIndex}
          onHover={(isHovered: boolean) => {
            if (onPlanetHover) {
              onPlanetHover(isHovered ? planet.agent : null)
            }
          }}
        />
      ))}

      {/* 太阳系控制面板 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        color: 'white',
        fontSize: '14px',
        zIndex: 100,
        minWidth: '250px'
      }}>
        <div style={{ 
          marginBottom: '12px', 
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px'
        }}>
          ☀️ 太阳系控制台
        </div>

        {/* 时间缩放控制 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '6px' }}>
            🕐 时间流速: {timeScale}x
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              outline: 'none'
            }}
          />
        </div>

        {/* 轨道显示控制 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            🔭 显示轨道线
          </label>
        </div>

        {/* 快捷预设 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '6px', fontSize: '12px', opacity: 0.8 }}>
            ⚡ 快捷设置:
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setTimeScale(0.5)}
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
              慢速
            </button>
            <button
              onClick={() => setTimeScale(1)}
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
              正常
            </button>
            <button
              onClick={() => setTimeScale(3)}
              style={{
                background: 'rgba(231, 76, 60, 0.3)',
                border: '1px solid rgba(231, 76, 60, 0.5)',
                color: '#e74c3c',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              快速
            </button>
          </div>
        </div>

        {/* 行星信息 */}
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.7,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '8px'
        }}>
          🪐 {agents.length} 颗AI行星正在运行
          <br />
          🌌 遵循开普勒运动定律
        </div>
      </div>

      {/* 行星信息提示 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '12px',
        color: 'white',
        fontSize: '12px',
        zIndex: 100,
        maxWidth: '300px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
          🔬 太阳系科学模拟
        </div>
        <div style={{ opacity: 0.8, lineHeight: '1.4' }}>
          • 内侧行星运行更快（开普勒第三定律）<br />
          • 行星大小基于真实比例<br />
          • 轨道距离符合太阳系结构<br />
          • 悬停查看行星详细信息
        </div>
      </div>
    </div>
  )
}