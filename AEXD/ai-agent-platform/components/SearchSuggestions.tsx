'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchSuggestionsProps {
  value: string
  onValueChange: (value: string) => void
  onTagSelect?: (tag: string) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

interface TagSuggestion {
  tag: string
  count: number
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  value,
  onValueChange,
  onTagSelect,
  placeholder = "搜索星星...",
  className,
  style
}) => {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
  // 防抖搜索
  const debouncedSearchTerm = useDebounce(value, 300)

  // 获取标签建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchTerm.trim()) {
        // 如果没有搜索词，获取热门标签
        try {
          setLoading(true)
          const response = await fetch('/api/agents/tags?limit=10')
          const data = await response.json()
          if (data.success) {
            setSuggestions(data.tags)
          }
        } catch (error) {
          console.error('获取热门标签失败:', error)
        } finally {
          setLoading(false)
        }
        return
      }

      // 有搜索词时，获取匹配的标签
      try {
        setLoading(true)
        const response = await fetch(`/api/agents/tags?search=${encodeURIComponent(debouncedSearchTerm)}&limit=8`)
        const data = await response.json()
        if (data.success) {
          setSuggestions(data.tags)
        }
      } catch (error) {
        console.error('获取标签建议失败:', error)
      } finally {
        setLoading(false)
      }
    }

    if (showSuggestions) {
      fetchSuggestions()
    }
  }, [debouncedSearchTerm, showSuggestions])

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex].tag)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (tag: string) => {
    // 只调用 onTagSelect，避免重复触发
    onTagSelect?.(tag)
    // 清空搜索框
    onValueChange('')
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onValueChange(newValue)
    setShowSuggestions(true)
    setSelectedIndex(-1)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    // 延迟隐藏，允许点击建议
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <div style={{ position: 'relative', width: '100%', ...style }} className={className}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: 'calc(100% - 24px)',
          maxWidth: '180px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          ...(showSuggestions && suggestions.length > 0 ? {
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            borderBottom: 'none'
          } : {})
        }}
      />

      {/* 搜索建议下拉框 */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          {loading ? (
            <div style={{
              padding: '12px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px'
            }}>
              搜索中...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {!value.trim() && (
                <div style={{
                  padding: '8px 12px',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  🔥 热门标签
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.tag}
                  onClick={() => handleSuggestionClick(suggestion.tag)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '13px',
                    background: selectedIndex === index 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'transparent',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span>{suggestion.tag}</span>
                  <span style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {suggestion.count}
                  </span>
                </div>
              ))}
            </>
          ) : value.trim() ? (
            <div style={{
              padding: '12px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px'
            }}>
              没有找到相关标签
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchSuggestions