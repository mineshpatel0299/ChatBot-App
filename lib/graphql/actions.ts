import { gql } from "@apollo/client"

// Hasura Action for sending messages to chatbot
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      success
      message
      response_id
    }
  }
`

// Types for the action
export interface SendMessageInput {
  chat_id: string
  message: string
}

export interface SendMessageOutput {
  success: boolean
  message: string
  response_id?: string
}
