import {gql} from '@apollo/client';

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

const GET_ONE_USER = gql`
query getUserOne($user: User_bool_exp){
  User(where: $user){
    user_id,
    clientId,
    email,
    password,
    provider,
    birthday
  }
}
`;

const GET_CHAT_LOG = gql`
subscription MySubscription2 {
  Chat_log {
    sent_at
    sender_id
    message_id
    is_filtered
    content
    chat_room_id
  }
}
`;

export {GET_CHAT_STREAM, GET_CHAT_STREAM_FILTERED, GET_ONE_USER, GET_CHAT_LOG};