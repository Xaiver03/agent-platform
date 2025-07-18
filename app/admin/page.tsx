'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, Switch, message, Typography, Row, Col, Statistic, Upload, Image, Tabs, Rate } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, ToolOutlined, MessageOutlined, StarOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { ImageUpload } from '@/components/ImageUpload'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

interface Agent {
  id: string
  name: string
  description: string
  tags: string
  manager: string
  homepage?: string
  icon?: string
  coverImage?: string
  guideContent?: string
  enabled: boolean
  createdAt: string
  applications: any[]
  feedback: any[]
}

interface Application {
  id: string
  agentId: string
  agentName: string
  applicantName: string
  email: string
  reason: string
  status: string
  createdAt: string
}

interface Feedback {
  id: string
  agentId: string
  agentName: string
  userName: string
  email?: string
  score: number
  comment: string
  createdAt: string
}

interface FeedbackButton {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  color?: string
  order: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [feedbackButtons, setFeedbackButtons] = useState<FeedbackButton[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [form] = Form.useForm()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [feedbackConfig, setFeedbackConfig] = useState<any>(null)
  const [configModalVisible, setConfigModalVisible] = useState(false)
  const [configForm] = Form.useForm()
  const [buttonModalVisible, setButtonModalVisible] = useState(false)
  const [editingButton, setEditingButton] = useState<FeedbackButton | null>(null)
  const [buttonForm] = Form.useForm()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('agents')

  useEffect(() => {
    checkAuth()
    fetchData()
    fetchFeedbackConfig()
    fetchFeedbackButtons()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/login')
      const data = await response.json()
      if (!data.isAuthenticated) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchFeedbackConfig = async () => {
    try {
      const response = await fetch('/api/feedback-config')
      const data = await response.json()
      setFeedbackConfig(data.config)
      if (data.config) {
        configForm.setFieldsValue(data.config)
      }
    } catch (error) {
      message.error('获取反馈配置失败')
    }
  }

  const fetchFeedbackButtons = async () => {
    try {
      const response = await fetch('/api/feedback-buttons')
      const data = await response.json()
      setFeedbackButtons(data.buttons || [])
    } catch (error) {
      message.error('获取反馈按钮失败')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [agentsRes, applicationsRes, feedbackRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/applications'),
        fetch('/api/feedback')
      ])

      const agentsData = await agentsRes.json()
      const applicationsData = await applicationsRes.json()
      const feedbackData = await feedbackRes.json()

      setAgents(agentsData.agents || [])
      setApplications(applicationsData.applications || [])
      setFeedback(feedbackData.feedback || [])
    } catch (error) {
      message.error('数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const url = editingAgent ? `/api/agents/${editingAgent.id}` : '/api/agents'
      const method = editingAgent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('操作失败')

      message.success(editingAgent ? '更新成功' : '创建成功')
      setModalVisible(false)
      form.resetFields()
      setEditingAgent(null)
      fetchData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除失败')
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleStatusUpdate = async (id: string, status: string, type: 'application' | 'feedback') => {
    try {
      const url = type === 'application' 
        ? `/api/applications/${id}`
        : `/api/feedback/${id}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('更新失败')
      message.success('状态更新成功')
      fetchData()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleButtonSubmit = async (values: any) => {
    try {
      const url = editingButton ? `/api/feedback-buttons/${editingButton.id}` : '/api/feedback-buttons'
      const method = editingButton ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('操作失败')

      message.success(editingButton ? '更新成功' : '创建成功')
      setButtonModalVisible(false)
      buttonForm.resetFields()
      setEditingButton(null)
      fetchFeedbackButtons()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleButtonDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/feedback-buttons/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除失败')
      message.success('删除成功')
      fetchFeedbackButtons()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleFeedbackConfigUpdate = async (values: any) => {
    try {
      const response = await fetch('/api/feedback-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('更新失败')
      message.success('反馈配置更新成功')
      setConfigModalVisible(false)
      fetchFeedbackConfig()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      message.error('登出失败')
    }
  }

  const agentColumns = [
    {
      title: '工具信息',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Agent) => (
        <Space>
          {record.coverImage ? (
            <Image
              src={record.coverImage}
              alt={record.name}
              width={50}
              height={50}
              style={{ borderRadius: 8, objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24
            }}>
              {record.icon || '🤖'}
            </div>
          )}
          <div>
            <Link href={`/agents/${record.id}`}>{text}</Link>
            <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '配置',
      key: 'config',
      render: (_, record: Agent) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>链接: {record.homepage || '未设置'}</Text>
          <Text style={{ fontSize: 12 }}>图标: {record.icon || '默认'}</Text>
          <Text style={{ fontSize: 12 }}>主理人: {record.manager}</Text>
        </Space>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string) => (
        <Space wrap>
          {tags.split(',').map(tag => (
            <Tag key={tag.trim()} color="blue">{tag.trim()}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>{enabled ? '启用' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Agent) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingAgent(record)
              form.setFieldsValue(record)
              setModalVisible(true)
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  const applicationColumns = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '工具',
      dataIndex: 'agentName',
      key: 'agentName',
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Application) => (
        <Select
          value={status}
          onChange={(value) => handleStatusUpdate(record.id, value, 'application')}
          style={{ width: 100 }}
          size="small"
        >
          <Option value="PENDING">待审核</Option>
          <Option value="APPROVED">已批准</Option>
          <Option value="REJECTED">已拒绝</Option>
        </Select>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  const feedbackColumns = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '工具',
      dataIndex: 'agentName',
      key: 'agentName',
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <Rate disabled defaultValue={score} />,
    },
    {
      title: '反馈',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  const buttonColumns = [
    {
      title: '按钮标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: color, borderRadius: 4 }} />
          {color}
        </div>
      ),
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: FeedbackButton) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingButton(record)
              buttonForm.setFieldsValue(record)
              setButtonModalVisible(true)
            }}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这个反馈按钮吗？',
                onOk: () => handleButtonDelete(record.id),
              })
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.enabled).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'PENDING').length,
    totalFeedback: feedback.length,
    averageRating: feedback.length > 0 
      ? (feedback.reduce((sum, f) => sum + f.score, 0) / feedback.length).toFixed(1)
      : 0,
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          <ToolOutlined /> 管理后台
        </Title>

        {/* Stats */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="总工具数" value={stats.totalAgents} prefix={<ToolOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="活跃工具" value={stats.activeAgents} prefix={<ToolOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="申请数" value={stats.totalApplications} prefix={<UserOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="平均分" value={stats.averageRating} prefix={<StarOutlined />} />
            </Card>
          </Col>
        </Row>

        {/* Add Tool Button */}
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingAgent(null)
              form.resetFields()
              setModalVisible(true)
            }}
          >
            添加新工具
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setConfigModalVisible(true)}
          >
            反馈配置
          </Button>
          <Button
            onClick={handleLogout}
          >
            登出
          </Button>
          <Link href="/" legacyBehavior>
            <Button>返回前台</Button>
          </Link>
        </Space>

        {/* Tabs */}
        <Card loading={loading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`工具管理 (${agents.length})`} key="agents">
              <Table
                columns={agentColumns}
                dataSource={agents}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab={`申请审核 (${applications.filter(a => a.status === 'PENDING').length})`} key="applications">
              <Table
                columns={applicationColumns}
                dataSource={applications}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab={`用户反馈 (${feedback.length})`} key="feedback">
              <Table
                columns={feedbackColumns}
                dataSource={feedback}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab={`反馈按钮 (${feedbackButtons.length})`} key="buttons">
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingButton(null)
                    buttonForm.resetFields()
                    setButtonModalVisible(true)
                  }}
                >
                  添加反馈按钮
                </Button>
              </Space>
              <Table
                columns={buttonColumns}
                dataSource={feedbackButtons}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingAgent ? '编辑工具' : '添加新工具'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false)
            form.resetFields()
          }}
          onOk={() => form.submit()}
          okText={editingAgent ? '更新' : '添加'}
          cancelText="取消"
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="工具名称" name="name" rules={[{ required: true }]} >
                  <Input placeholder="例如：Claude Code" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="主理人" name="manager" rules={[{ required: true }]} >
                  <Input placeholder="张三" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item label="描述" name="description" rules={[{ required: true }]} >
              <TextArea rows={3} placeholder="工具的简要描述" />
            </Form.Item>

            <Form.Item label="详细介绍" name="guideContent" >
              <TextArea rows={6} placeholder="详细的使用指南和介绍内容" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="标签" name="tags" rules={[{ required: true }]} >
                  <Input placeholder="编程,调试,AI助手" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="图标" name="icon" >
                  <Input placeholder="🤖" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="官网链接" name="homepage" >
                  <Input placeholder="https://example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="封面图片" name="coverImage" >
                  <ImageUpload
                    value={form.getFieldValue('coverImage')}
                    onChange={(url) => form.setFieldsValue({ coverImage: url })}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="启用状态" name="enabled" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Feedback Config Modal */}
        <Modal
          title="反馈配置"
          open={configModalVisible}
          onCancel={() => setConfigModalVisible(false)}
          onOk={() => configForm.submit()}
          okText="保存"
          cancelText="取消"
          width={600}
        >
          <Form
            form={configForm}
            layout="vertical"
            onFinish={handleFeedbackConfigUpdate}
          >
            <Form.Item
              label="AI产品使用感受问卷链接"
              name="productFeedbackUrl"
              rules={[{ required: true, message: '请输入问卷链接' }]}
            >
              <Input placeholder="https://docs.google.com/forms/d/e/xxx/viewform" />
            </Form.Item>
            <Form.Item
              label="体验台使用感受问卷链接"
              name="platformFeedbackUrl"
              rules={[{ required: true, message: '请输入问卷链接' }]}
            >
              <Input placeholder="https://docs.google.com/forms/d/e/xxx/viewform" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Feedback Button Modal */}
        <Modal
          title={editingButton ? '编辑反馈按钮' : '添加反馈按钮'}
          open={buttonModalVisible}
          onCancel={() => {
            setButtonModalVisible(false)
            buttonForm.resetFields()
            setEditingButton(null)
          }}
          onOk={() => buttonForm.submit()}
          okText={editingButton ? '更新' : '添加'}
          cancelText="取消"
          width={600}
        >
          <Form
            form={buttonForm}
            layout="vertical"
            onFinish={handleButtonSubmit}
          >
            <Form.Item
              label="按钮标题"
              name="title"
              rules={[{ required: true, message: '请输入按钮标题' }]}
            >
              <Input placeholder="例如：AI产品反馈" />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
            >
              <TextArea rows={2} placeholder="按钮的描述信息（鼠标悬停时显示）" />
            </Form.Item>
            <Form.Item
              label="链接地址"
              name="url"
              rules={[{ required: true, message: '请输入链接地址' }]}
            >
              <Input placeholder="https://forms.gle/xxx" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="图标"
                  name="icon"
                  initialValue="message"
                >
                  <Select>
                    <Option value="message">message（消息）</Option>
                    <Option value="form">form（表单）</Option>
                    <Option value="file">file（文件）</Option>
                    <Option value="bulb">bulb（灯泡）</Option>
                    <Option value="comment">comment（评论）</Option>
                    <Option value="question">question（问题）</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="颜色"
                  name="color"
                  initialValue="#1890ff"
                >
                  <Input type="color" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="排序"
                  name="order"
                  initialValue={0}
                >
                  <Input type="number" placeholder="数字越小越靠前" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="启用状态"
              name="enabled"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}