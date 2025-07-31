'use client'

import React, { useState, useEffect } from 'react'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  style?: React.CSSProperties
  height?: number
  className?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = "请输入内容...",
  style,
  height = 200,
  className
}) => {
  // 使用本地状态管理值，确保空值可以正确处理
  const [localValue, setLocalValue] = useState(value || '')

  // 当外部value改变时，更新本地值
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    // 触发onChange回调
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    handleChange('')
  }

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        style={{
          width: '100%',
          minHeight: height,
          padding: '8px 12px',
          paddingBottom: '30px', // 为清除按钮留出空间
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '14px',
          lineHeight: '1.5',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.3s',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#40a9ff'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d9d9d9'
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        <span>支持Markdown格式</span>
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '2px 8px',
              fontSize: '12px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff7875'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ff4d4f'
            }}
          >
            清空内容
          </button>
        )}
      </div>
    </div>
  )
}
