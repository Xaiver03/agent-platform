'use client'

import { useState, useEffect } from 'react'
import { Button, Space, message, Tooltip } from 'antd'
import { 
  MessageOutlined, 
  FormOutlined, 
  FileTextOutlined,
  BulbOutlined,
  CommentOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons'

interface FeedbackButton {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  color?: string
  order: number
  enabled: boolean
}

const iconMap: { [key: string]: any } = {
  'message': MessageOutlined,
  'form': FormOutlined,
  'file': FileTextOutlined,
  'bulb': BulbOutlined,
  'comment': CommentOutlined,
  'question': QuestionCircleOutlined
}

export function FeedbackButtons() {
  const [buttons, setButtons] = useState<FeedbackButton[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedbackButtons()
  }, [])

  const fetchFeedbackButtons = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/feedback-buttons')
      const data = await response.json()
      
      // 只显示启用的按钮
      const enabledButtons = data.buttons.filter((btn: FeedbackButton) => btn.enabled)
      setButtons(enabledButtons)
    } catch (error) {
      console.error('Failed to fetch feedback buttons:', error)
      message.error('获取反馈按钮配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = (button: FeedbackButton) => {
    if (button.url) {
      window.open(button.url, '_blank')
    } else {
      message.warning('反馈链接未配置')
    }
  }

  const getIcon = (iconName?: string) => {
    if (!iconName) return <MessageOutlined />
    const IconComponent = iconMap[iconName] || MessageOutlined
    return <IconComponent />
  }

  if (loading) {
    return null
  }

  if (buttons.length === 0) {
    return null
  }

  return (
    <Space size="large" style={{ marginTop: 32 }}>
      {buttons.map((button, index) => (
        <Tooltip key={button.id} title={button.description}>
          <Button
            type={index === 0 ? 'primary' : 'default'}
            size="large"
            icon={getIcon(button.icon)}
            onClick={() => handleButtonClick(button)}
            style={{
              backgroundColor: index === 0 ? button.color : undefined,
              borderColor: index === 0 ? button.color : button.color,
              color: index === 0 ? '#fff' : button.color
            }}
          >
            {button.title}
          </Button>
        </Tooltip>
      ))}
    </Space>
  )
}