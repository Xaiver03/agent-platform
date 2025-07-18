'use client'

import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeedbackFormProps {
  agentId: string
  agentName: string
  onClose: () => void
}

export function FeedbackForm({ agentId, agentName, onClose }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    score: 5,
    comment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          userName: formData.userName,
          email: formData.email,
          score: formData.score,
          comment: formData.comment
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSubmitted(true)
      
      // 3秒后自动关闭
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('提交反馈失败，请稍后重试')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'score' ? parseInt(value) : value
    }))
  }

  const handleStarClick = (score: number) => {
    setFormData(prev => ({ ...prev, score }))
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <CardTitle className="text-green-600">反馈已提交！</CardTitle>
            <CardDescription>
              感谢您对 {agentName} 的反馈，这将帮助我们不断改进。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onClose} className="w-full">
              确定
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>反馈 {agentName}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            分享您的使用体验，帮助其他用户了解这个工具。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">姓名 *</Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="请输入您的姓名"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入您的邮箱地址（可选）"
              />
            </div>
            
            <div className="space-y-2">
              <Label>满意度评分 *</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= formData.score 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.score}/5
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">详细反馈</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="请分享您的使用体验、建议或遇到的问题..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.userName}
                className="flex-1"
              >
                {isSubmitting ? '提交中...' : '提交反馈'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}