'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { SearchSuggestions } from '../components/SearchSuggestions'
import { LoadingSpinner } from '../components/LoadingState'
import { useDebounce } from '../hooks/useDebounce'

const GalaxyStarSystem = dynamic(() => import('../components/GalaxyStarSystem').then(mod => ({ default: mod.default })), {
  loading: () => <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: 'white'
  }}>🌌 加载星系中...</div>,
  ssr: false
})

const FeedbackButtons = dynamic(() => import('../components/FeedbackButtons').then(mod => ({ default: mod.FeedbackButtons })), {
  loading: () => null,
  ssr: false
})

const Danmaku = dynamic(() => import('../components/Danmaku').then(mod => ({ default: mod.Danmaku })), {
  loading: () => null,
  ssr: false
})

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
  clickCount?: number
}

export default function Galaxy3DPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [agents, setAgents] = useState<Agent[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [danmakuInputVisible, setDanmakuInputVisible] = useState(false)
  const [danmakuPlaying, setDanmakuPlaying] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50, // 初始加载更多数据
    total: 0,
    pages: 0
  })
  const [hasMore, setHasMore] = useState(true)
  
  // 防抖搜索
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // 初始加载
  useEffect(() => {
    fetchAgents(true)
  }, [])
  
  // 搜索和筛选变化时重新加载 - 优化防止闪烁
  useEffect(() => {
    // 添加延迟防止连续触发
    const timer = setTimeout(() => {
      fetchAgents(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [debouncedSearchTerm, selectedTag])

  const fetchAgents = useCallback(async (reset: boolean = false) => {
    try {
      if (reset) {
        // 只在首次加载时显示全屏加载
        if (agents.length === 0) {
          setLoading(true)
        } else {
          // 已有数据时，不显示全屏加载，减少闪烁
          setLoadingMore(true)
        }
      } else {
        setLoadingMore(true)
      }
      
      let responseAgents: Agent[] = []
      let responsePagination = {
        page: reset ? 1 : pagination.page + 1,
        limit: pagination.limit,
        total: 0,
        pages: 1
      }
      
      try {
        // 优先尝试动态API（连接数据库）
          const currentPage: number = reset ? 1 : pagination.page + 1
          const limit: number = pagination.limit
          
          const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: limit.toString()
          })
          
          if (debouncedSearchTerm) {
            params.append('search', debouncedSearchTerm)
          }
          if (selectedTag !== 'all') {
            params.append('tag', selectedTag)
          }
          
          const response = await fetch(`/api/agents?${params}`)
          console.log('API响应状态:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API错误响应:', errorText)
          throw new Error(`API failed with status ${response.status}: ${errorText}`)
        }
        
        const data = await response.json()
        console.log('API响应数据:', data)
        
        if (data.success && data.agents) {
          responseAgents = data.agents
          responsePagination = data.pagination || responsePagination
        } else {
          throw new Error('Invalid response format')
        }
      } catch (newApiError) {
        console.log('动态API失败，尝试静态API作为备用:', newApiError)
        
        // 备用：使用静态API
        try {
          const staticResponse = await fetch('/api/agents/static')
          if (staticResponse.ok) {
            const staticData = await staticResponse.json()
            console.log('使用静态API数据:', staticData)
            responseAgents = staticData.agents || []
            responsePagination = staticData.pagination || responsePagination
          } else {
            throw new Error('Static API also failed')
          }
        } catch (staticErr) {
          console.error('静态API也失败了，尝试旧版API:', staticErr)
          
          // 备用API（旧格式）
          const params = new URLSearchParams()
          if (debouncedSearchTerm) {
            params.append('search', debouncedSearchTerm)
          }
          if (selectedTag !== 'all') {
            params.append('tag', selectedTag)
          }
          
          const legacyResponse = await fetch(`/api/agents/legacy?${params}`)
          if (!legacyResponse.ok) throw new Error('Both APIs failed')
          const legacyData = await legacyResponse.json()
          
          console.log('备用API响应数据:', legacyData)
          
          responseAgents = legacyData.agents || []
          responsePagination = {
            page: 1,
            limit: responseAgents.length,
            total: responseAgents.length,
            pages: 1
          }
        }
      }
      
      if (responseAgents && Array.isArray(responseAgents)) {
        if (reset) {
          setAgents(responseAgents)
        } else {
          setAgents(prev => [...prev, ...responseAgents])
        }
        
        setPagination(responsePagination)
        setHasMore(responsePagination.page < responsePagination.pages)
        
        // 获取所有标签（只在初始加载时）
        if (reset) {
          fetchTags()
        }
      } else {
        console.error('无效的agents数据:', responseAgents)
        if (reset) {
          setAgents([])
        }
        setPagination({
          page: 1,
          limit: pagination.limit,
          total: 0,
          pages: 0
        })
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load agents:', err)
      // 显示错误信息给用户
      if (err instanceof Error) {
        alert(`加载数据失败: ${err.message}`)
      }
      if (reset) {
        setAgents([])
      }
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [debouncedSearchTerm, selectedTag, pagination.page, pagination.limit])
  
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/agents/tags?limit=50')
      const data = await response.json()
      if (data.success) {
        setAllTags(data.tags.map((item: any) => item.tag))
      }
    } catch (err) {
      console.error('Failed to load tags:', err)
    }
  }
  
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchAgents(false)
    }
  }
  
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? 'all' : tag)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'rotate 2s linear infinite'
          }}>
            🌌
          </div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            正在初始化奇绩AI星系...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            准备观测星海中的奇绩AI智慧
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 银河系AI星图标题 */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001,
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <h1 className="galaxy-title" style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#e5e5e5',
          textShadow: `
            0 0 10px rgba(192, 192, 192, 0.8),
            0 0 20px rgba(192, 192, 192, 0.6),
            0 0 30px rgba(192, 192, 192, 0.4),
            0 0 40px rgba(192, 192, 192, 0.2)
          `,
          animation: 'glow 2s ease-in-out infinite alternate',
          letterSpacing: '2px',
          margin: 0,
          padding: 0
        }}>
          MiraclePlus AI Galaxy
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'rgba(192, 192, 192, 0.8)',
          margin: '8px 0 0 0',
          textShadow: '0 0 5px rgba(192, 192, 192, 0.5)'
        }}>
          探索奇绩AI的星海
        </p>
      </div>

      {/* CSS动画 */}
      <style jsx global>{`
        @keyframes glow {
          from {
            text-shadow: 
              0 0 10px rgba(192, 192, 192, 0.8),
              0 0 20px rgba(192, 192, 192, 0.6),
              0 0 30px rgba(192, 192, 192, 0.4),
              0 0 40px rgba(192, 192, 192, 0.2);
          }
          to {
            text-shadow: 
              0 0 20px rgba(192, 192, 192, 1),
              0 0 30px rgba(192, 192, 192, 0.8),
              0 0 50px rgba(192, 192, 192, 0.6),
              0 0 70px rgba(192, 192, 192, 0.4);
          }
        }
        
        /* 响应式优化 */
        @media (max-width: 768px) {
          .galaxy-title {
            font-size: 28px !important;
          }
          .control-panel {
            min-width: 180px !important;
            max-width: 200px !important;
          }
        }
      `}</style>

      {/* 银河系AI星图 - 基于点击次数的星等系统 */}
      {loading ? (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999
        }}>
          <LoadingSpinner 
            text="初始化星系中..." 
            size="large" 
            variant="spinner"
          />
        </div>
      ) : (
        <GalaxyStarSystem 
          agents={agents}
        />
      )}
      
      {/* 加载更多指示器 */}
      {loadingMore && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          zIndex: 999
        }}>
          <LoadingSpinner 
            text="加载更多星星..." 
            size="small" 
            variant="dots"
          />
        </div>
      )}

      {/* 搜索和筛选控制 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        color: 'white',
        fontSize: '14px',
        zIndex: 1000,
        minWidth: '200px',
        maxWidth: '220px'
      }}>
        <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>
          🌌 奇绩AI星图
        </div>
        <SearchSuggestions
          value={searchTerm}
          onValueChange={setSearchTerm}
          onTagSelect={handleTagSelect}
          placeholder="搜索星星..."
          style={{ marginBottom: '8px' }}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white'
          }}
        >
          <option value="all">全部分类</option>
          {allTags.map(tag => (
            <option key={tag} value={tag} style={{ color: 'black' }}>{tag}</option>
          ))}
        </select>
        
        {/* 使用指南 - 合并到左侧面板 */}
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '8px',
            fontSize: '12px',
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✨ 星图导航
          </div>
          
          <div style={{ 
            fontSize: '10px', 
            lineHeight: '1.4', 
            opacity: 0.8 
          }}>
            🔍 <strong>搜索星星</strong> - 输入关键词查找AI工具<br/>
            🏷️ <strong>星图分类</strong> - 按标签筛选星星类型<br/>
            ⭐ <strong>星等系统</strong> - 星星大小=使用频率<br/>
            🖱️ <strong>星际探索</strong> - 悬停查看星星详情<br/>
            🎯 <strong>精准定位</strong> - 点击星星直达详情页
          </div>
        </div>
        
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
          ⭐ {agents.length} 颗AI星星
          {pagination.total > 0 && (
            <div style={{ fontSize: '10px', marginTop: '2px', color: 'rgba(255, 255, 255, 0.6)' }}>
              共 {pagination.total} 颗，已显示 {agents.length} 颗
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    marginLeft: '8px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '3px',
                    color: 'white',
                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                    opacity: loadingMore ? 0.5 : 1
                  }}
                >
                  {loadingMore ? '加载中...' : '加载更多'}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* 弹幕控制区域 */}
        <div style={{ 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)' 
        }}>
          <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
            💬 弹幕系统
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <button
              onClick={() => setDanmakuInputVisible(!danmakuInputVisible)}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: danmakuInputVisible 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = danmakuInputVisible 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {danmakuInputVisible ? '关闭输入' : '发送弹幕'}
            </button>
            {/* 滑动开关样式的弹幕播放按钮 */}
            <div style={{ 
              flex: 1,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '6px 8px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
            }}>
              <span style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}>
                播放弹幕
              </span>
              <div
                onClick={() => setDanmakuPlaying(!danmakuPlaying)}
                style={{
                  width: '36px',
                  height: '18px',
                  borderRadius: '9px',
                  background: danmakuPlaying 
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                    : 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '1px',
                    left: danmakuPlaying ? '19px' : '1px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 反馈按钮 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150
      }}>
        <FeedbackButtons />
      </div>

      {/* 作者信息 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        zIndex: 100,
        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <div style={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          创新活动产品组
        </div>
        <div style={{ 
          fontSize: '11px',
          opacity: 0.8
        }}>
          Made by Xaiver / 邓湘雷
        </div>
      </div>

      {/* 底部版权信息 */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '20px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '12px',
        zIndex: 100
      }}>
        ⭐ MiraclePlus AI Galaxy Star System
      </div>

      {/* 弹幕系统 */}
      <Danmaku 
        enabled={true} 
        showInput={danmakuInputVisible}
        isPlaying={danmakuPlaying}
        onShowInputChange={setDanmakuInputVisible}
        onPlayingChange={setDanmakuPlaying}
      />
      
      {/* 无限滚动加载更多内容 - 修复闪烁问题 */}
      {hasMore && !loading && !loadingMore && (
        <div 
          style={{
            position: 'fixed',
            bottom: '50px', // 稍微上移避免与底部元素重叠
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '20px',
            pointerEvents: 'none',
            zIndex: 1
          }}
          ref={(el) => {
            if (el && hasMore && !loadingMore) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
                    console.log('触发无限滚动加载')
                    loadMore()
                  }
                },
                { 
                  threshold: 0.5,
                  rootMargin: '100px'
                }
              )
              observer.observe(el)
              return () => observer.disconnect()
            }
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: '10px',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center'
          }}>
            滚动到底部加载更多
          </div>
        </div>
      )}
    </div>
  )
}