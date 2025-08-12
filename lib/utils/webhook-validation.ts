// Utility for validating webhook requests from n8n
import crypto from "crypto"

export function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

export function validateChatOwnership(userId: string, chatId: string, userChats: string[]): boolean {
  return userChats.includes(chatId)
}
