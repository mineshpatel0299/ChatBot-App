import { gql } from "@apollo/client";

// Real-time subscriptions for messages
export const SUBSCRIBE_TO_CHAT_MESSAGES = gql`
  subscription SubscribeToChatMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender_type
      created_at
    }
  }
`;

// Real-time subscriptions for chats
export const SUBSCRIBE_TO_USER_CHATS = gql`
  subscription SubscribeToUserChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
      messages_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;