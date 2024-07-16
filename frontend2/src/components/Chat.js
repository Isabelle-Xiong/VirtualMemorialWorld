import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rnd } from 'react-rnd';
import '../Chat.css';

const Chat = ({ recipientId, recipientUsername, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Fetch messages whenever recipientId changes
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/messages/${recipientId}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') },
                });
                setMessages(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [recipientId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/messages', {
                recipientId,
                content: newMessage,
            }, {
                headers: { 'x-auth-token': token },
            });
            setMessages((prevMessages) => [...prevMessages, response.data].slice(-20));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Rnd default={{ x: 100, y: 100, width: 300, height: 400 }} minWidth={300} minHeight={400}>
            <div className="chat-window">
                <div className="chat-header">
                    <h4>Chat with {recipientUsername}</h4>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="chat-body">
                    {Array.isArray(messages) && messages.map((message) => (
                        <div key={message._id} className={`chat-message ${message.sender === recipientId ? 'received' : 'sent'}`}>
                            {message.content}
                        </div>
                    ))}
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </Rnd>
    );
};

export default Chat;