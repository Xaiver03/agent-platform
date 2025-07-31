'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

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
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showMessage = (message: string, type: 'success' | 'error') => {
    // 简单的消息提示，你可以后续替换为更好的toast组件
    const messageDiv = document.createElement('div')
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      background-color: ${type === 'error' ? '#ff4d4f' : '#52c41a'};
      color: white;
      border-radius: 4px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `
    messageDiv.textContent = message
    document.body.appendChild(messageDiv)
    
    setTimeout(() => {
      messageDiv.remove()
    }, 3000)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showMessage('只能上传图片文件！', 'error')
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      showMessage(`图片大小不能超过${maxSize}MB！`, 'error')
      return
    }

    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        showMessage('上传成功！', 'success')
        if (onChange) onChange(data.url)
        if (onUpload) onUpload(data.url)
      } else {
        showMessage(data.error || '上传失败', 'error')
      }
    } catch (error) {
      showMessage('上传失败', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleClear = () => {
    if (onChange) onChange('')
    showMessage('已清除图片', 'success')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ marginBottom: 12 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={handleButtonClick}
          disabled={loading}
          style={{
            width: '100%',
            height: '50px',
            fontSize: '16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#40a9ff'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1890ff'
          }}
        >
          {loading ? (
            <>
              <span>⏳</span>
              <span>上传中...</span>
            </>
          ) : (
            <>
              <span>📤</span>
              <span>点击选择二维码图片</span>
            </>
          )}
        </button>
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
          <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
            <Image
              src={value}
              alt="二维码预览"
              fill
              style={{ 
                objectFit: 'contain',
                borderRadius: 6,
                border: '1px solid #d9d9d9'
              }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleClear}
              style={{
                padding: '4px 16px',
                fontSize: '12px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ff7875'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff4d4f'
              }}
            >
              清除图片
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
