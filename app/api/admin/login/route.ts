import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateAdminToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        canChangePassword: true,
        canManageAdmins: true
      }
    })

    if (!admin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    // 生成JWT Token
    const token = generateAdminToken(admin.id)
    
    const response = NextResponse.json({ 
      success: true, 
      admin: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role,
        canChangePassword: admin.canChangePassword,
        canManageAdmins: admin.canManageAdmins
      } 
    })

    // 设置cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    return response
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-token')
  return response
}

export async function GET(request: NextRequest) {
  try {
    const { getAdminFromToken } = await import('@/lib/auth')
    const admin = await getAdminFromToken(request)
    
    if (admin) {
      return NextResponse.json({ 
        isAuthenticated: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          canChangePassword: admin.canChangePassword,
          canManageAdmins: admin.canManageAdmins
        }
      })
    } else {
      return NextResponse.json({ isAuthenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false })
  }
}