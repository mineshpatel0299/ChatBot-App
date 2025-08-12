import { gql } from "@apollo/client"

// Chat mutations
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $userId: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $userId }) {
      id
      title
      created_at
      updated_at
    }
  }
`

export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
      updated_at
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
  mutation InsertMessage(
    $chatId: uuid!
    $userId: uuid!
    $content: String!
    $role: String!
  ) {
    insert_messages_one(
      object: {
        chat_id: $chatId
        user_id: $userId
        content: $content
        role: $role
      }
    ) {
      id
      content
      role
      created_at
    }
  }
`

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: uuid!) {
    delete_messages_by_pk(id: $messageId) {
      id
    }
  }
`
