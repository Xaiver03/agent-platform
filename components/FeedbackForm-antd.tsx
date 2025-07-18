'use client'

import { useState } from 'react'
import { Modal, Form, Input, Rate, Button, message, Typography, Space } from 'antd'
import { SendOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title } = Typography

interface FeedbackFormProps {
  agentId: string
  agentName: string
  onClose: () => void
}

export function FeedbackForm({ agentId, agentName, onClose }: FeedbackFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          ...values,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit feedback')

      message.success('反馈提交成功！感谢您的评价。')
      form.resetFields()
      onClose()
    } catch (error) {
      message.error('反馈提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={`评价 ${agentName}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Form.Item
          label="姓名"
          name="userName"
          rules={[{ required: true, message: '请输入您的姓名' }]}
        >
          <Input placeholder="请输入您的姓名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入您的邮箱（选填）" />
        </Form.Item>

        <Form.Item
          label="评分"
          name="score"
          rules={[{ required: true, message: '请为工具打分' }]}
        >
          <Rate allowHalf style={{ fontSize: 24 }} />
        </Form.Item>

        <Form.Item
          label="使用体验"
          name="comment"
          rules={[{ required: true, message: '请分享您的使用体验' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细分享您的使用体验、遇到的问题或改进建议..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
            >
              提交反馈
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}