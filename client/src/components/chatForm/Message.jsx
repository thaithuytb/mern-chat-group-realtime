import React, { useContext, useState, useRef, useEffect } from "react";
import { chatContext } from "../../contexts/chatContext";
import { format } from "timeago.js";
import noAvt from "../../assets/noAvt.png";
import { io } from "socket.io-client";
import { REACT_APP } from "../../config/constants";

let chatSocket;

const Message = ({ user }) => {
  const deSocket = `${REACT_APP}/chat-namespace`;

  const [message, setMessage] = useState("");
  const [addMessageFromSoket, setAddMessageFromSoket] = useState(null);
  const scrollRef = useRef();
  // const chatSocket = useRef();

  const {
    messages,
    postMessageInConversation,
    setMessages,
    currentConversationId,
    conversations: { dataConversation },
  } = useContext(chatContext);

  useEffect(() => {
    chatSocket = io(deSocket, { transports: ["websocket"] });
    dataConversation &&
    dataConversation.forEach((con) => {
      chatSocket.emit("join-room", con._id);
    });
  }, [deSocket, dataConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    chatSocket.on("get-message", (data) => {
        setAddMessageFromSoket({
          convId: data.room,
          newMessage: data.message
        });
    }); 
  },[]);

  useEffect(() => {
    if (addMessageFromSoket !== null) {
      const { convId, newMessage } = addMessageFromSoket;
      if (convId === currentConversationId ) {
        setMessages([...messages, newMessage]);
      }
    }
  }, [currentConversationId, addMessageFromSoket]);

  const changeForm = (e) => {
    setMessage(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const conversationId = currentConversationId;
    const dataPushToSocketServer = {
      message,
      updatedAt: Date.now(),
      _id: Math.random(),
      senderId: user._id,
    };

    chatSocket.emit("push-message", {
      message: dataPushToSocketServer,
      room: conversationId,
    });
    setMessage("");


    try {
      await postMessageInConversation({message, conversationId});
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="message-content">
        <div className="message-list">
          {messages?.length === 0 && (
            <h4>Hãy bắt đầu cuộc hội thoại với họ.</h4>
          )}
          {messages?.length!==0 && messages?.map((mes) => {
            return (
              <div
                className={
                  mes.senderId === user._id
                    ? "message-item own"
                    : "message-item"
                }
                key={mes._id}
                ref={scrollRef}
              >
                <div className="messageImg">
                  <img alt="noAvt" src={noAvt} />
                </div>
                <div className="messageInfo">
                  <div className="messageText">{mes.message}</div>
                  <div className="messageTime">
                    {format(mes.updatedAt, "en_US")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <form className="message-form" onSubmit={submitForm}>
        <textarea
          placeholder="   Abc"
          name="message"
          value={message}
          onChange={changeForm}
        />
        <button type="submit">chat</button>
      </form>
    </>
  );
};

export default Message;
