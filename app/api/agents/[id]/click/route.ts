import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/agents/[id]/click - 增加Agent点击次数
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id

    // 增加点击次数
    const updatedAgent = await prisma.agent.update({
      where: { id: agentId },
      data: {
        clickCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      clickCount: updatedAgent.clickCount 
    })
  } catch (error) {
    console.error('Error updating click count:', error)
    return NextResponse.json(
      { error: 'Failed to update click count' },
      { status: 500 }
    )
  }
}