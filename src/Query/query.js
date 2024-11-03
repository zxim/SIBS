import {gql} from '@apollo/client';

const INSERT_USER_INFO = gql`
mutation insertUser($user: User_insert_input!){
    insert_User_one(object: $user){
        email,
        provider,
        clientId,
        password,
        birthday,
        name
    }
}
`;

const GET_ONE_USER = gql`
query getUserOne($user: User_bool_exp){
  User(where: $user){
    user_id,
    clientId,
    email,
    password,
    provider,
    birthday,
    name
  }
}
`;

const GET_CHAT_STREAM = gql`
subscription MySubscription($Entrance: timestamptz, $Room: Int) {
  Chat_log_stream(batch_size: 10, cursor: {initial_value: {sent_at: $Entrance}, ordering: ASC}, where: {chat_room_id: {_eq: $Room}}) {
    chat_room_id
    content
    message_id
    sender_id
    sent_at
    is_filtered
  }
}
`;

const GET_CHAT_STREAM_FILTERED = gql`
subscription MySubscription($Entrance: timestamptz, $Room: Int) {
  Chat_log_stream(batch_size: 10, cursor: {initial_value: {sent_at: $Entrance}, ordering: ASC}, where: {chat_room_id: {_eq: $Room}, is_filtered: {_eq: true}}) {
    chat_room_id
    content
    message_id
    sender_id
    sent_at
    is_filtered
  }
}
`;

const INSERT_CHAT = gql`
mutation MyMutation($chat: Chat_log_insert_input!) {
  insert_Chat_log_one(object: $chat) {
    chat_room_id
    content
    message_id
    sender_id
    sent_at
  }
}
`;

export {INSERT_USER_INFO, GET_ONE_USER, GET_CHAT_STREAM, GET_CHAT_STREAM_FILTERED, INSERT_CHAT};