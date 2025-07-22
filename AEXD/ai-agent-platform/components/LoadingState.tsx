'use client'

import React from 'react'

interface LoadingStateProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  style?: React.CSSProperties
}

export const LoadingSpinner: React.FC<LoadingStateProps> = ({
  text = "加载中...",
  size = 'medium',
  variant = 'spinner',
  className,
  style
}) => {
  const sizeMap = {
    small: { width: '16px', height: '16px', fontSize: '12px' },
    medium: { width: '24px', height: '24px', fontSize: '14px' },
    large: { width: '32px', height: '32px', fontSize: '16px' }
  }

  const currentSize = sizeMap[size]

  const spinnerStyle = {
    width: currentSize.width,
    height: currentSize.height,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }

  const dotsStyle = {
    display: 'flex',
    gap: '4px'
  }

  const dotStyle = {
    width: '6px',
    height: '6px',
    background: 'white',
    borderRadius: '50%',
    animation: 'bounce 1.4s ease-in-out both infinite'
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: 'white',
        ...style
      }}
    >
      {variant === 'spinner' && <div style={spinnerStyle} />}
      
      {variant === 'dots' && (
        <div style={dotsStyle}>
          <div style={{ ...dotStyle, animationDelay: '-0.32s' }} />
          <div style={{ ...dotStyle, animationDelay: '-0.16s' }} />
          <div style={dotStyle} />
        </div>
      )}
      
      {variant === 'pulse' && (
        <div style={{
          width: currentSize.width,
          height: currentSize.height,
          background: 'white',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
      )}
      
      {text && (
        <span style={{ 
          fontSize: currentSize.fontSize,
          opacity: 0.8 
        }}>
          {text}
        </span>
      )}
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

// 骨架屏组件
interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className,
  style
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear',
        ...style
      }}
    >
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

// 卡片骨架屏
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div
          key={index}
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <div style={{ flex: 1 }}>
              <Skeleton height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton height="12px" width="60%" />
            </div>
          </div>
          <Skeleton height="12px" style={{ marginBottom: '6px' }} />
          <Skeleton height="12px" width="80%" />
        </div>
      ))}
    </>
  )
}

export default LoadingSpinner