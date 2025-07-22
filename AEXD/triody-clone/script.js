// 全局变量
let searchModal = null;
let searchInput = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeAnimations();
});

// 初始化DOM元素
function initializeElements() {
    searchModal = document.getElementById('searchModal');
    searchInput = document.querySelector('.search-input');
}

// 初始化事件监听器
function initializeEventListeners() {
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 点击外部关闭弹窗
    searchModal?.addEventListener('click', handleModalClick);
    
    // 搜索输入
    searchInput?.addEventListener('input', handleSearchInput);
    
    // 平滑滚动
    initializeSmoothScroll();
    
    // 工具卡片点击事件
    initializeToolCardEvents();
}

// 键盘快捷键处理
function handleKeyboardShortcuts(e) {
    // Command/Ctrl + K 打开搜索
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
    
    // ESC 关闭弹窗
    if (e.key === 'Escape') {
        closeSearch();
    }
}

// 打开搜索弹窗
function openSearch() {
    if (searchModal) {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 聚焦搜索框
        setTimeout(() => {
            searchInput?.focus();
        }, 100);
    }
}

// 关闭搜索弹窗
function closeSearch() {
    if (searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
    }
}

// 弹窗点击处理
function handleModalClick(e) {
    if (e.target === searchModal) {
        closeSearch();
    }
}

// 搜索输入处理
function handleSearchInput(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.querySelector('.search-results');
    
    if (query.length > 0) {
        // 模拟搜索结果
        const mockResults = [
            { icon: '🧠', name: 'ChatGPT', rating: '9.8' },
            { icon: '🎨', name: 'Midjourney', rating: '9.5' },
            { icon: '⚡', name: 'Claude', rating: '9.2' },
            { icon: '🎵', name: 'Suno AI', rating: '8.9' }
        ].filter(item => item.name.toLowerCase().includes(query));
        
        displaySearchResults(mockResults);
    } else {
        displayDefaultResults();
    }
}

// 显示搜索结果
function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-item">
                <span class="search-icon">🔍</span>
                <span class="search-name">未找到相关工具</span>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = results.map(item => `
        <div class="search-item" onclick="selectTool('${item.name}')">
            <span class="search-icon">${item.icon}</span>
            <span class="search-name">${item.name}</span>
            <span class="search-rating">${item.rating}</span>
        </div>
    `).join('');
}

// 显示默认结果
function displayDefaultResults() {
    const searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = `
        <div class="search-item" onclick="selectTool('ChatGPT')">
            <span class="search-icon">🧠</span>
            <span class="search-name">ChatGPT</span>
            <span class="search-rating">9.8</span>
        </div>
        <div class="search-item" onclick="selectTool('Midjourney')">
            <span class="search-icon">🎨</span>
            <span class="search-name">Midjourney</span>
            <span class="search-rating">9.5</span>
        </div>
    `;
}

// 选择工具
function selectTool(toolName) {
    console.log('选择工具:', toolName);
    // 这里可以跳转到工具详情页
    showNotification(`已选择: ${toolName}`, 'success');
    closeSearch();
}

// 平滑滚动初始化
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 工具卡片事件初始化
function initializeToolCardEvents() {
    // 试用按钮
    document.querySelectorAll('.tool-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
            handleToolTrial(toolName);
        });
    });
    
    // 详情按钮
    document.querySelectorAll('.tool-card .btn-ghost').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
            handleToolDetails(toolName);
        });
    });
    
    // 避雷按钮
    document.querySelectorAll('.tool-card .btn-danger').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
            handleToolWarning(toolName);
        });
    });
}

// 处理工具试用
function handleToolTrial(toolName) {
    showNotification(`正在跳转到 ${toolName}...`, 'info');
    
    // 模拟跳转延迟
    setTimeout(() => {
        console.log('跳转到工具:', toolName);
        // 这里可以实际跳转到工具网站
    }, 1000);
}

// 处理工具详情
function handleToolDetails(toolName) {
    showModal('工具详情', `
        <div class="tool-detail">
            <h3>${toolName}</h3>
            <p>这里是 ${toolName} 的详细信息...</p>
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="handleToolTrial('${toolName}')">立即试用</button>
                <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
            </div>
        </div>
    `);
}

// 处理避雷警告
function handleToolWarning(toolName) {
    showModal('避雷警告', `
        <div class="warning-content">
            <div class="warning-icon">⚠️</div>
            <h3>谨慎使用 ${toolName}</h3>
            <p>根据用户反馈，该工具存在以下问题：</p>
            <ul>
                <li>功能与宣传不符</li>
                <li>收费过高，性价比低</li>
                <li>用户体验差</li>
            </ul>
            <div class="warning-actions">
                <button class="btn btn-danger" onclick="closeModal()">我知道了</button>
            </div>
        </div>
    `, 'warning');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    return icons[type] || icons.info;
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    return colors[type] || colors.info;
}

// 显示模态框
function showModal(title, content, type = 'default') {
    // 移除已存在的模态框
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = `custom-modal modal-${type}`;
    modal.innerHTML = `
        <div class="custom-modal-overlay">
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h3>${title}</h3>
                    <button class="custom-modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="custom-modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        }
        
        .custom-modal-content {
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: var(--shadow-xl);
        }
        
        .custom-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--border-color);
        }
        
        .custom-modal-header h3 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .custom-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s ease;
        }
        
        .custom-modal-close:hover {
            background: var(--bg-secondary);
        }
        
        .custom-modal-body {
            padding: var(--spacing-lg);
        }
        
        .tool-detail h3 {
            margin-bottom: var(--spacing-md);
            color: var(--text-primary);
        }
        
        .tool-detail p {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-lg);
        }
        
        .detail-actions {
            display: flex;
            gap: var(--spacing-sm);
        }
        
        .warning-content {
            text-align: center;
        }
        
        .warning-icon {
            font-size: 48px;
            margin-bottom: var(--spacing-md);
        }
        
        .warning-content h3 {
            color: var(--danger-color);
            margin-bottom: var(--spacing-md);
        }
        
        .warning-content ul {
            text-align: left;
            margin: var(--spacing-lg) 0;
            padding-left: var(--spacing-lg);
        }
        
        .warning-content li {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-sm);
        }
        
        .warning-actions {
            margin-top: var(--spacing-lg);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 点击外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('custom-modal-overlay')) {
            closeModal();
        }
    });
}

// 关闭模态框
function closeModal() {
    const modal = document.querySelector('.custom-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// 打开提交模态框
function openSubmitModal() {
    showModal('提交AI工具', `
        <form class="submit-form" onsubmit="handleSubmit(event)">
            <div class="form-group">
                <label for="toolName">工具名称</label>
                <input type="text" id="toolName" required placeholder="请输入AI工具名称">
            </div>
            <div class="form-group">
                <label for="toolUrl">工具网址</label>
                <input type="url" id="toolUrl" required placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label for="toolDescription">工具描述</label>
                <textarea id="toolDescription" required placeholder="简单描述这个工具的功能和特点"></textarea>
            </div>
            <div class="form-group">
                <label for="toolCategory">工具类别</label>
                <select id="toolCategory" required>
                    <option value="">请选择类别</option>
                    <option value="chat">对话助手</option>
                    <option value="image">图像生成</option>
                    <option value="text">文本生成</option>
                    <option value="code">代码生成</option>
                    <option value="audio">音频处理</option>
                    <option value="video">视频处理</option>
                    <option value="other">其他</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">提交</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">取消</button>
            </div>
        </form>
    `);
    
    // 添加表单样式
    const formStyle = document.createElement('style');
    formStyle.textContent = `
        .submit-form .form-group {
            margin-bottom: var(--spacing-lg);
        }
        
        .submit-form label {
            display: block;
            margin-bottom: var(--spacing-xs);
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .submit-form input,
        .submit-form textarea,
        .submit-form select {
            width: 100%;
            padding: var(--spacing-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: var(--font-base);
            transition: border-color 0.2s ease;
        }
        
        .submit-form input:focus,
        .submit-form textarea:focus,
        .submit-form select:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .submit-form textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .form-actions {
            display: flex;
            gap: var(--spacing-sm);
            justify-content: flex-end;
        }
    `;
    document.head.appendChild(formStyle);
}

// 处理表单提交
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('toolName').value,
        url: document.getElementById('toolUrl').value,
        description: document.getElementById('toolDescription').value,
        category: document.getElementById('toolCategory').value
    };
    
    console.log('提交的工具信息:', formData);
    
    // 模拟提交
    showNotification('提交成功，感谢您的分享！', 'success');
    closeModal();
}

// 初始化动画
function initializeAnimations() {
    // 观察器选项
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.tool-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 页面加载完成后的额外初始化
window.addEventListener('load', function() {
    // 添加加载完成的类
    document.body.classList.add('loaded');
    
    // 预加载一些资源
    preloadResources();
});

// 预加载资源
function preloadResources() {
    // 这里可以预加载一些图片或其他资源
    console.log('资源预加载完成');
}