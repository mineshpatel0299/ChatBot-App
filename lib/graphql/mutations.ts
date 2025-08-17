import { gql } from "@apollo/client"

// Chat mutations
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title}) {
      id
      title
      created_at
    }
  }
`

export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
    }
  }
`

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`

// Message mutations
export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, content: $content, sender_type: "user" }) {
      id
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: uuid!) {
    delete_messages_by_pk(id: $messageId) {
      id
    }
  }
`