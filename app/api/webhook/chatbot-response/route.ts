import { type NextRequest, NextResponse } from "next/server"
import { apolloClient } from "@/lib/graphql/client"
import { INSERT_MESSAGE } from "@/lib/graphql/mutations"
import { validateWebhookSignature } from "@/lib/utils/webhook-validation"

// This endpoint receives responses from n8n and saves them to the database
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-webhook-signature") || ""
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET || ""

    // Validate webhook signature
    if (!validateWebhookSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(body)
    const { chat_id, user_id, response_content, response_id } = data

    if (!chat_id || !user_id || !response_content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the chatbot response message
    await apolloClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chatId: chat_id,
        userId: user_id,
        content: response_content,
        role: "assistant",
      },
      context: {
        headers: {
          authorization: `Bearer ${process.env.NHOST_ADMIN_SECRET}`,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Response saved successfully",
      response_id,
    })
  } catch (error) {
    console.error("Error processing chatbot response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
