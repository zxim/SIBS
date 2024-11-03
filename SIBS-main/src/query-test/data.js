import {useSubscription} from '@apollo/client';
import {GET_CHAT_STREAM, GET_CHAT_STREAM_FILTERED, GET_ONE_USER, GET_CHAT_LOG} from '../Query/query';
import {useEffect, useState} from "react";


const chat = {
	"Entrance": "2024-07-28T04:00",
	"Room": 5
};

function Data() {
	// const [getChatStream] = useSubscription(GET_CHAT_STREAM);
	const {loading, error, data} = useSubscription(GET_CHAT_STREAM_FILTERED, {variables: chat});
	// const {loading, error, data} = useSubscription(GET_CHAT_LOG);
	// const [getUserData] = useLazyQuery(GET_ONE_USER);

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (data && data.Chat_log_stream) {
			setMessages(prevMessages => [...prevMessages, ...data.Chat_log_stream]);
		}
	}, [data]);

	useEffect(() => {
		console.log(messages);
	}, [messages]);

	if (loading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return <p>Error: {error.message}</p>;
	}
	return (
		<div>
			<div>
				<h2>Chat Log</h2>
				<ul>
					{data.Chat_log_stream.map((message) => (
						<li key = {message.message_id}>
							<p><strong>message_id: {message.message_id}:</strong> {message.content}</p>
							<p><em>Sent at: {new Date(message.sent_at).toLocaleString()}</em></p>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Data;