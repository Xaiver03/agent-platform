import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    // 创建会话（简化版本，实际项目中应使用JWT）
    const response = NextResponse.json({ 
      success: true, 
      admin: { id: admin.id, email: admin.email, name: admin.name } 
    })

    // 设置cookie
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24小时
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-auth')
  return response
}

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('admin-auth')
  return NextResponse.json({ isAuthenticated: auth?.value === 'true' })
}