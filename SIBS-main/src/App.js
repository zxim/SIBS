import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import Home from './Home';
import LoginSignUp from './Components/LoginSignup/LoginSignup';
import LoginKakao from './Components/LoginSignup/LoginKakao';
import LoginNaver from './Components/LoginSignup/LoginNaver';
import ChatRoom from './Components/ChatRoom/ChatRoom';
import Query from './query-test/data';
import OverlayPoll from './Components/Poll/OverlayPoll'
import WheelSpinner from './Components/WheelSpinner/WheelSpinner'

import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {WebSocketLink} from 'apollo-link-ws';
import {ModalProvider} from './ModalContext';

const wsLink = new WebSocketLink({
	uri: "http://3.27.63.83:8080/v1/graphql", options: {
		reconnect: true
	}
});

const createApolloClient = () => {
	return new ApolloClient({
		link: wsLink, cache: new InMemoryCache()
	});
};

function App() {
	return (
		<ModalProvider>
			<ApolloProvider client = {createApolloClient()}>
				<Router>
					<Routes>
						<Route path = "/" element = {<Home/>}/>
						<Route path = "/login" element = {<LoginSignUp/>}/>
						<Route path = "/auth/kakao/callback" element = {<LoginKakao/>}/>
						<Route path = "/auth/naver/callback" element = {<LoginNaver/>}/>
						<Route path = "chatroom" element = {<ChatRoom/>}/>
						<Route path = "/query" element = {<Query/>}/>
						<Route path="/wheelspinner" element={<WheelSpinner />}/>
						<Route path="/overlaypoll" element={<OverlayPoll />}/>
					</Routes>
				</Router>
			</ApolloProvider>
		</ModalProvider>
	);
}

export default App;