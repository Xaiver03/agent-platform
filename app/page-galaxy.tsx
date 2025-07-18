'use client'

import { useState, useEffect } from 'react'
import { Spin, Empty, message } from 'antd'
import { StarField } from '@/components/StarField'
import { PlanetAgent } from '@/components/PlanetAgent'
import { GalaxyControls } from '@/components/GalaxyControls'
import { FeedbackButtons } from '@/components/FeedbackButtons'

interface Agent {
  id: string
  name: string
  description: string
  tags: string
  manager: string
  guideUrl?: string
  homepage?: string
  icon?: string
  enabled: boolean
}

export default function GalaxyHomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  useEffect(() => {
    let filtered = agents.filter(agent => agent.enabled)
    
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tags.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedTag !== 'all') {
      filtered = filtered.filter(agent => 
        agent.tags.split(',').map(t => t.trim()).includes(selectedTag)
      )
    }
    
    setFilteredAgents(filtered)
  }, [searchTerm, selectedTag, agents])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      setAgents(data.agents)
      
      const allTagsSet = new Set<string>()
      data.agents.forEach((agent: Agent) => {
        agent.tags.split(',').forEach(tag => allTagsSet.add(tag.trim()))
      })
      setAllTags(Array.from(allTagsSet))
    } catch (err) {
      console.error('Failed to load agents:', err)
      message.error('加载AI工具失败')
    } finally {
      setLoading(false)
    }
  }

  // 生成星球位置（螺旋星系布局）
  const generatePlanetPositions = (agents: Agent[]) => {
    const positions: Array<{ x: number; y: number }> = []
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 800
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 600
    
    agents.forEach((_, index) => {
      // 螺旋星系算法
      const angle = (index * 137.5) * (Math.PI / 180) // 黄金角度
      const radius = Math.sqrt(index + 1) * 80 + 200
      
      const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100
      const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100
      
      positions.push({ x, y })
    })
    
    return positions
  }

  const planetPositions = generatePlanetPositions(filteredAgents)

  return (
    <div style={{ 
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 星空背景 */}
      <StarField />

      {/* 主要内容 */}
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        {/* 顶部控制区域 */}
        <GalaxyControls
          searchTerm={searchTerm}
          selectedTag={selectedTag}
          allTags={allTags}
          agentCount={agents.length}
          enabledCount={agents.filter(a => a.enabled).length}
          onSearchChange={setSearchTerm}
          onTagChange={setSelectedTag}
        />

        {/* 加载状态 */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px',
            color: 'white'
          }}>
            <Spin size="large" />
            <div style={{ marginTop: 20, fontSize: '18px' }}>
              正在初始化银河系...
            </div>
          </div>
        )}

        {/* 星球区域 */}
        {!loading && (
          <div style={{ 
            position: 'relative',
            minHeight: '60vh',
            width: '100%'
          }}>
            {filteredAgents.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                paddingTop: '100px',
                color: 'white'
              }}>
                <Empty
                  description={
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      🌌 这片星域暂时没有发现AI星球
                    </span>
                  }
                  style={{ filter: 'invert(1)' }}
                />
              </div>
            ) : (
              <>
                {filteredAgents.map((agent, index) => (
                  <PlanetAgent
                    key={agent.id}
                    agent={agent}
                    initialPosition={planetPositions[index] || { x: 400, y: 300 }}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* 反馈区域 */}
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          marginTop: '100px'
        }}>
          <FeedbackButtons />
        </div>

        {/* 底部装饰 */}
        <div style={{
          textAlign: 'center',
          padding: '60px 20px 40px 20px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '14px'
        }}>
          <div style={{ marginBottom: 20 }}>
            ✨ 在这片AI星海中探索无限可能 ✨
          </div>
          <div>
            悬浮在星球上查看详情 • 让AI助力你的创造之旅
          </div>
        </div>
      </div>
    </div>
  )
}