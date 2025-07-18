'use client'

import { useState } from 'react'
import { Modal, Form, Input, Select, Button, message, Typography, Space } from 'antd'
import { SendOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

interface ApplicationFormProps {
  agentId: string
  agentName: string
  onClose: () => void
}

export function ApplicationForm({ agentId, agentName, onClose }: ApplicationFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          ...values,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit application')

      message.success('申请提交成功！我们会尽快审核。')
      form.resetFields()
      onClose()
    } catch (error) {
      message.error('申请提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={`申请使用 ${agentName}`}
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
          name="applicantName"
          rules={[{ required: true, message: '请输入您的姓名' }]}
        >
          <Input placeholder="请输入您的姓名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入您的邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入您的邮箱" />
        </Form.Item>

        <Form.Item
          label="申请原因"
          name="reason"
          rules={[{ required: true, message: '请说明申请原因' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细说明您需要使用这个AI工具的原因和用途..."
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
              提交申请
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}