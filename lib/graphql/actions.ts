import { gql } from "@apollo/client";

// Hasura Action for sending messages to chatbot
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      success
      reply
    }
  }
`;

// Types for the action
export interface SendMessageInput {
  chat_id: string;
  content: string;
}

export interface SendMessageOutput {
  success: boolean;
  reply: string;
}