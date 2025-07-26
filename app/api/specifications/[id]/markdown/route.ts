import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/api/api-errors'
import { SpecificationMarkdownService } from '@/lib/services/specification-markdown-service'

interface RouteParams {
  id: string
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const params = await context.params
    const id = parseInt(params.id, 10)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid specification ID' }, 
        { status: 400 }
      )
    }

    const userId = request.nextUrl.searchParams.get('userId')
    const markdown = await SpecificationMarkdownService.generateMarkdown(
      id, 
      userId || undefined
    )

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `inline; filename="specification-${id}.md"`
      }
    })
  })
}
