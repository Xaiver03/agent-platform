// Galaxy Animation Web Worker
// 处理星系动画计算，避免阻塞主线程

let animationFrame
let isRunning = false
let stars = []
let config = {
  containerWidth: 1200,
  containerHeight: 800,
  centerX: 600,
  centerY: 400,
  boundaryThreshold: 50,
  attractionForce: 0.0001,
  maxSpeed: 2,
  enablePhysics: true
}

// 物理计算函数
function updateStarPosition(star, deltaTime) {
  if (!config.enablePhysics) return star

  const dt = Math.min(deltaTime, 16) // 限制最大时间步长
  
  // 计算到中心的距离和方向
  const dx = config.centerX - star.x
  const dy = config.centerY - star.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance > 0) {
    // 向心力计算
    const force = config.attractionForce * distance
    const forceX = (dx / distance) * force
    const forceY = (dy / distance) * force
    
    // 更新速度
    star.vx = (star.vx || 0) + forceX * dt
    star.vy = (star.vy || 0) + forceY * dt
    
    // 速度限制
    const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy)
    if (speed > config.maxSpeed) {
      star.vx = (star.vx / speed) * config.maxSpeed
      star.vy = (star.vy / speed) * config.maxSpeed
    }
    
    // 更新位置
    star.x += star.vx * dt * 0.01
    star.y += star.vy * dt * 0.01
  }
  
  // 边界检测和回弹
  const margin = config.boundaryThreshold
  if (star.x < margin) {
    star.x = margin
    star.vx = Math.abs(star.vx || 0) * 0.8
  } else if (star.x > config.containerWidth - margin) {
    star.x = config.containerWidth - margin
    star.vx = -Math.abs(star.vx || 0) * 0.8
  }
  
  if (star.y < margin) {
    star.y = margin
    star.vy = Math.abs(star.vy || 0) * 0.8
  } else if (star.y > config.containerHeight - margin) {
    star.y = config.containerHeight - margin
    star.vy = -Math.abs(star.vy || 0) * 0.8
  }
  
  return star
}

// 动画循环
function animate(currentTime) {
  if (!isRunning) return
  
  const deltaTime = currentTime - (animate.lastTime || currentTime)
  animate.lastTime = currentTime
  
  // 批量更新所有星星位置
  const updatedStars = stars.map(star => updateStarPosition({ ...star }, deltaTime))
  
  // 发送更新后的位置给主线程
  self.postMessage({
    type: 'animation-frame',
    stars: updatedStars,
    timestamp: currentTime
  })
  
  // 请求下一帧
  animationFrame = setTimeout(() => animate(performance.now()), 16) // ~60fps
}

// 碰撞检测优化函数
function checkCollisions(stars, uiElements) {
  const collisions = []
  
  stars.forEach((star, index) => {
    uiElements.forEach(element => {
      const dx = star.x - element.x
      const dy = star.y - element.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < element.radius + star.size) {
        collisions.push({
          starIndex: index,
          elementId: element.id,
          distance
        })
      }
    })
  })
  
  return collisions
}

// 性能监控
let frameCount = 0
let lastFpsTime = 0
function updateFPS(currentTime) {
  frameCount++
  if (currentTime - lastFpsTime >= 1000) {
    const fps = frameCount
    frameCount = 0
    lastFpsTime = currentTime
    
    self.postMessage({
      type: 'performance-update',
      fps,
      starCount: stars.length
    })
  }
}

// 消息处理
self.onmessage = function(e) {
  const { type, data } = e.data
  
  switch (type) {
    case 'init':
      config = { ...config, ...data.config }
      stars = data.stars || []
      break
      
    case 'start':
      if (!isRunning) {
        isRunning = true
        animate(performance.now())
      }
      break
      
    case 'stop':
      isRunning = false
      if (animationFrame) {
        clearTimeout(animationFrame)
      }
      break
      
    case 'update-stars':
      stars = data.stars || []
      break
      
    case 'update-config':
      config = { ...config, ...data.config }
      break
      
    case 'check-collisions':
      const collisions = checkCollisions(data.stars, data.uiElements)
      self.postMessage({
        type: 'collision-results',
        collisions
      })
      break
      
    case 'resize':
      config.containerWidth = data.width
      config.containerHeight = data.height
      config.centerX = data.width / 2
      config.centerY = data.height / 2
      break
      
    default:
      console.warn('Unknown message type:', type)
  }
}

// 错误处理
self.onerror = function(error) {
  self.postMessage({
    type: 'error',
    message: error.message,
    stack: error.stack
  })
}

// 初始化完成通知
self.postMessage({
  type: 'worker-ready'
})