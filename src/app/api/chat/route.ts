import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { getProviderConfig } from '@/lib/ai-providers'

const DEFAULT_SYSTEM = `你是博主的AI助手。博主是一名前端工程师，擅长 React、Next.js、TypeScript。你可以回答技术问题、介绍博主的项目，以及提供前端开发建议。回答简洁专业，中文为主。`

export async function POST(req: NextRequest) {
  try {
    const { messages, provider, model, systemPrompt } = await req.json()
    const system = systemPrompt || DEFAULT_SYSTEM

    // Claude uses native SDK
    if (provider === 'claude') {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        return Response.json(
          { error: 'Claude API Key 未配置，请在 .env.local 中添加 ANTHROPIC_API_KEY' },
          { status: 400 }
        )
      }

      const client = new Anthropic({ apiKey })

      const stream = await client.messages.stream({
        model,
        max_tokens: 2048,
        system,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta'
              ) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`)
                )
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (err) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: String(err) })}\n\n`
              )
            )
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // All other providers use OpenAI-compatible interface
    const providerConfig = getProviderConfig(provider)
    if (!providerConfig) {
      return Response.json({ error: `未知的模型提供商: ${provider}` }, { status: 400 })
    }

    const apiKey = process.env[providerConfig.envKey]
    if (!apiKey) {
      return Response.json(
        {
          error: `${providerConfig.name} API Key 未配置，请在 .env.local 中添加 ${providerConfig.envKey}`,
        },
        { status: 400 }
      )
    }

    const client = new OpenAI({
      baseURL: providerConfig.baseURL,
      apiKey,
    })

    const stream = await client.chat.completions.create({
      model,
      messages: [{ role: 'system', content: system }, ...messages],
      stream: true,
      max_tokens: 2048,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: String(err) })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    return Response.json(
      { error: `请求处理失败: ${String(error)}` },
      { status: 500 }
    )
  }
}
