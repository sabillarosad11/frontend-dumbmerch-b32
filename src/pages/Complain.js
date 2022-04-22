import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from 'react-bootstrap'

import Navbar from '../components/Navbar'
import Contact from '../components/complain/Contact'
import Chat from '../components/complain/Chat'

import { UserContext } from "../context/userContext";

import { io } from "socket.io-client";

let socket;

export default function Complain() {
    const [contact, setContact] = useState(null);
    const [contacts, setContacts] = useState([]);

    const [messages, setMessages] = useState([]);

    const title = "Complain"
    document.title = 'DumbMerch | ' + title

    const [state] = useContext(UserContext);

    useEffect(() => {
      socket = io( process.env.SERVER_URL || "http://localhost:5003", {
        auth: {
          token: localStorage.getItem("token"),
        },
        query: {
                id: state.user.id
        }
      });

      socket.on("new message", () => {
        socket.emit("load messages", contact?.id);
      });

      socket.on("connect_error", (err) => {
        console.error(err.message);
      });
      loadContact();
      loadMessages();

      return () => {
        socket.disconnect();
      };
    }, [messages]);

    const loadContact = () => {
      socket.emit("load admin contact");

      socket.on("admin contact", (data) => {

        console.log(data);

        const dataContact = {
          ...data,
          message:
            messages.length > 0
              ? messages[messages.length - 1].message
              : "Click here to start message",
        };
        setContacts([dataContact]);
      });
    };

    const onClickContact = (data) => {
      setContact(data);
        socket.emit("load messages", data.id);
    };

    const loadMessages = () => {
      socket.on("messages", async (data) => {
        if (data.length > 0) {
          const dataMessages = data.map((item) => ({
            idSender: item.sender.id,
            message: item.message,
          }));

          setMessages(dataMessages);
        }
      });
    };

    const onSendMessage = (e) => {
      if (e.key === "Enter") {
        const data = {
          idRecipient: contact.id,
          message: e.target.value,
        };
      
        socket.emit("send message", data);
        e.target.value = "";
        console.log(data);
      }
    };



    // const dataContact = [
    //     {
    //         id: 1,
    //         name: 'Admin',
    //         chat: 'Yes, Is there anything I can help',
    //         img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
    //     }, 
    //     {
    //         id: 2,
    //         name: 'Admin 2',
    //         chat: 'Hello World',
    //         img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
    //     }
    // ]

    return (
      <>
        <Navbar title={title} />
        <Container fluid style={{ height: "89.5vh" }}>
          <Row>
            <Col
              md={3}
              style={{ height: "89.5vh" }}
              className="px-3 border-end border-dark overflow-auto"
            >
              <Contact
                clickContact={onClickContact}
                dataContact={contacts}
                contact={contact}
              />
            </Col>
            <Col md={9} style={{ maxHeight: "89.5vh" }} className="px-0">
              <Chat
                contact={contact}
                messages={messages}
                user={state.user}
                sendMessage={onSendMessage}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
}
