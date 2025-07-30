'use client'

import { useState } from 'react'
import { Upload, Button, Image, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload'

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  onUpload?: (url: string) => void
  maxSize?: number // MB
  accept?: string
  className?: string
}

export function ImageUpload({ value, onChange, onUpload, maxSize = 5, accept = "image/*", className }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件！')
      return false
    }

    if (file.size > maxSize * 1024 * 1024) {
      message.error(`图片大小不能超过${maxSize}MB！`)
      return false
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        message.success('上传成功！')
        if (onChange) onChange(data.url)
        if (onUpload) onUpload(data.url)
      } else {
        message.error(data.error || '上传失败')
      }
    } catch (error) {
      message.error('上传失败')
    } finally {
      setLoading(false)
    }

    return false // 阻止自动上传
  }

  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ marginBottom: 12 }}>
        <Upload
          accept={accept}
          showUploadList={false}
          beforeUpload={handleUpload}
          style={{ display: 'block' }}
        >
          <Button 
            icon={<UploadOutlined />} 
            loading={loading}
            type="primary"
            size="large"
            style={{ width: '100%', height: '50px', fontSize: '16px' }}
          >
            {loading ? '⏳ 上传中...' : '📤 点击选择二维码图片'}
          </Button>
        </Upload>
      </div>
      
      {value && (
        <div style={{ 
          textAlign: 'center',
          padding: '8px',
          border: '1px solid #e8e8e8',
          borderRadius: '6px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
            预览图片:
          </div>
          <Image
            src={value}
            alt="二维码预览"
            style={{ 
              width: '100%', 
              maxWidth: '150px', 
              height: '150px', 
              objectFit: 'contain',
              borderRadius: 6,
              border: '1px solid #d9d9d9'
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button 
              size="small" 
              danger 
              onClick={() => {
                if (onChange) onChange('')
                message.success('已清除图片')
              }}
            >
              清除图片
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}