import React, { useState, useEffect } from 'react';
import chatApi from './../api/chatApi';
export const chatContext = React.createContext();
const ChatContextProvider = ({children}) => {
    const [ conversations ,setConversations ] = useState({
        isLoading: true,
        dataConversation: null
    });
    const [ messages ,setMessages ] = useState({
        isLoading: true,
        dataMessage: null
    });
    const [ currentConversationId , setCurrentConversationId ] = useState(null);

    const getAllConversations = async () => {
        const { getAllConversation } = chatApi;
        try {
            const response = await getAllConversation();
            if ( response.data.success ) {
                setConversations({
                    ...conversations,
                    isLoading: false,
                    dataConversation: response.data.conversations
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllMessage = async (conversationId) => {
        const { getAllMessageInConversation } = chatApi;
        try {
            const response = await getAllMessageInConversation(conversationId);
            if (response.data.success) {
                setMessages({
                    ...messages,
                    isLoading: false,
                    dataMessage: response.data.messages
                });
                setCurrentConversationId(conversationId);
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    const postMessageInConversation = async (dt) => {
        const { postMessage } = chatApi; 
        try {
            const response = await postMessage(dt);
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    const dataChat = { conversations,messages , setMessages ,getAllConversations, getAllMessage, postMessageInConversation, currentConversationId };
    return (
        <chatContext.Provider value={dataChat}>
            {children}
        </chatContext.Provider>
    )
}

export default ChatContextProvider;