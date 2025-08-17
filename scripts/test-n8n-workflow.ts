// Test script for n8n workflow
import fetch from "node-fetch"

interface TestPayload {
  input: {
    chat_id: string
    message: string
  }
}

interface TestHeaders {
  [key: string]: string;
  "x-hasura-user-id": string
  "x-hasura-role": string
  "x-hasura-webhook-secret": string
  "content-type": string
}

async function testN8nWorkflow() {
  const webhookUrl = process.env.N8N_WEBHOOK_URL || "https://your-n8n-instance.com/webhook/chatbot-message"

  const payload: TestPayload = {
    input: {
      chat_id: "test-chat-id-123",
      message: "Hello, this is a test message for the chatbot!",
    },
  }

  const headers: TestHeaders = {
    "x-hasura-user-id": "test-user-id-456",
    "x-hasura-role": "user",
    "x-hasura-webhook-secret": process.env.N8N_WEBHOOK_SECRET || "",
    "content-type": "application/json",
  }

  try {
    console.log("Testing n8n workflow...")
    console.log("Webhook URL:", webhookUrl)
    console.log("Payload:", JSON.stringify(payload, null, 2))

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    console.log("Response Status:", response.status)
    console.log("Response:", JSON.stringify(result, null, 2))

    if (response.ok && result.success) {
      console.log("✅ Workflow test successful!")
    } else {
      console.log("❌ Workflow test failed!")
    }
  } catch (error) {
    console.error("Error testing workflow:", error)
  }
}

// Run the test
if (require.main === module) {
  testN8nWorkflow()
}

export { testN8nWorkflow }