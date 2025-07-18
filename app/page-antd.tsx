'use client'

import { useState, useEffect } from 'react'
import { Card, Input, Select, Button, Space, Tag, Typography, Spin, Empty, Row, Col, Statistic } from 'antd'
import { SearchOutlined, ToolOutlined, UserOutlined, StarOutlined, AppstoreOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

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

export default function HomePage() {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1} style={{ marginBottom: 8 }}>
          <ToolOutlined style={{ marginRight: 8 }} />
          AI Agent 体验台
        </Title>
        <Text type="secondary" style={{ fontSize: 18 }}>
          团队AI工具统一管理与体验平台
        </Text>
      </div>

      {/* Search and Filter */}
      <Space size="large" style={{ marginBottom: 32, width: '100%', justifyContent: 'center' }}>
        <Search
          placeholder="搜索AI工具名称或功能..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          size="large"
          style={{ width: 200 }}
          value={selectedTag}
          onChange={setSelectedTag}
          placeholder="选择标签"
        >
          <Option value="all">全部标签</Option>
          {allTags.map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </Space>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总工具数"
              value={agents.length}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="可用标签"
              value={allTags.length}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活跃工具"
              value={agents.filter(a => a.enabled).length}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      )}

      {/* Agents Grid */}
      {!loading && (
        <>
          {filteredAgents.length === 0 ? (
            <Empty
              description="没有找到匹配的AI工具"
              style={{ marginTop: 60 }}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {filteredAgents.map((agent) => (
                <Col xs={24} sm={12} lg={8} key={agent.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ 
                        height: 120, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: 48,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}>
                        {agent.icon || '🤖'}
                      </div>
                    }
                    actions={[
                      <Link key="guide" href={`/agents/${agent.id}`}>
                        <Button type="text" icon={<ToolOutlined />}>使用指南</Button>
                      </Link>,
                      <a key="homepage" href={agent.homepage} target="_blank" rel="noopener noreferrer">
                        <Button type="text">访问官网</Button>
                      </a>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Link href={`/agents/${agent.id}`}>
                          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                            {agent.name}
                          </Title>
                        </Link>
                      }
                      description={
                        <>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 16 }}>
                            {agent.description}
                          </Paragraph>
                          <Space>
                            <UserOutlined />
                            <Text type="secondary">{agent.manager}</Text>
                          </Space>
                          <div style={{ marginTop: 12 }}>
                            {agent.tags.split(',').map(tag => (
                              <Tag key={tag.trim()} color="blue" style={{ margin: 2 }}>
                                {tag.trim()}
                              </Tag>
                            ))}
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Quick Actions */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Title level={3}>快速入口</Title>
            <Space size="large">
              <Button type="primary" size="large" icon={<ToolOutlined />}>
                申请新工具
              </Button>
              <Button size="large" icon={<StarOutlined />}>
                提交反馈
              </Button>
              <Button size="large" icon={<UserOutlined />}>
                成为主理人
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  )
}