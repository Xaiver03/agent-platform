import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件类型，只支持 JPG、PNG、WebP、GIF 格式' }, { status: 400 })
    }

    // 验证文件大小 (最大2MB，因为base64会增大约33%)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '文件过大，请压缩后上传（最大2MB）' }, { status: 400 })
    }

    // 转换为base64格式存储（Vercel友好的方案）
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // 返回base64 data URL
    return NextResponse.json({ 
      url: dataUrl,
      size: file.size,
      type: file.type,
      name: file.name
    })
  } catch (error) {
    console.error('上传失败:', error)
    return NextResponse.json({ error: '上传失败: ' + (error instanceof Error ? error.message : '未知错误') }, { status: 500 })
  }
}