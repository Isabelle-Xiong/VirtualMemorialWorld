import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Letters.css'; // Adjust the path based on your project structure

function Letters() {
    const { id } = useParams();
    const [letters, setLetters] = useState([]);
    const [letterTitle, setLetterTitle] = useState(''); // State for letter title
    const [letterContent, setLetterContent] = useState('');
    const [avatarName, setAvatarName] = useState('');
    const [receivedLetters, setReceivedLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [showReceivedLetters, setShowReceivedLetters] = useState(false); // State for toggling received letters

    useEffect(() => {
        fetchAvatarDetails();
        fetchLetters();
    }, []);

    const fetchAvatarDetails = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                headers: { 'x-auth-token': token },
            });
            setAvatarName(response.data.name);
        } catch (error) {
            console.error('Error fetching avatar details:', error);
        }
    };

    const fetchLetters = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5001/api/avatars/${id}/letters`, {
                headers: { 'x-auth-token': token },
            });
            setLetters(response.data);
        } catch (error) {
            console.error('Error fetching letters:', error);
        }
    };

    const sendLetter = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:5001/api/avatars/${id}/letters`, {
                title: letterTitle, // Include title in the request
                content: letterContent
            }, {
                headers: { 'x-auth-token': token },
            });
            setReceivedLetters([...receivedLetters, response.data]);
            setLetterTitle(''); // Clear title input after sending
            setLetterContent('');
        } catch (error) {
            console.error('Error sending letter:', error);
        }
    };

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
    };

    const toggleReceivedLetters = () => {
        setShowReceivedLetters(!showReceivedLetters);
    };

    return (
        <div className="letters-page-background">
            <div className="letters-container">
                <div className="header-container">
                    <h2>
                        {!selectedLetter ? `Letters to ${avatarName}` : `Letter Title: ${selectedLetter.title}`}
                    </h2>
                    <div className="mailbox-toggle" onClick={toggleReceivedLetters}>
                        {showReceivedLetters ? (
                            <img
                                src="https://cdn.iconscout.com/icon/free/png-256/free-mail-mailbox-open-postbox-38048.png"
                                alt="Open Mailbox"
                                className="mailbox-icon"
                            />
                        ) : (
                            <img
                                src="https://www.svgrepo.com/show/404987/closed-mailbox-with-raised-flag.svg"
                                alt="Closed Mailbox"
                                className="mailbox-icon"
                            />
                        )}
                    </div>
                </div>
                {!selectedLetter ? (
                    <div className="letter-writing-area">
                        <input
                            type="text"
                            placeholder="Enter letter title..."
                            value={letterTitle}
                            onChange={(e) => setLetterTitle(e.target.value)}
                        />
                        <textarea
                            placeholder={`Write your letter to ${avatarName} here...`}
                            value={letterContent}
                            onChange={(e) => setLetterContent(e.target.value)}
                        />
                        <button onClick={sendLetter}>Send</button>
                    </div>
                ) : null}
                <div className="response-area">
                    {selectedLetter ? (
                        <div className="letter-details">
                            <p><strong>You:</strong> {selectedLetter.content}</p>
                            <p><strong>Response:</strong> {selectedLetter.response}</p>
                            <button onClick={() => setSelectedLetter(null)}>Back to List</button>
                        </div>
                    ) : (
                        <div className={`letter-history ${showReceivedLetters ? 'visible' : 'hidden'}`}>
                            <h3>Letter History</h3>
                            {letters.map((letter, index) => (
                                <div key={index} className="letter-item" onClick={() => handleLetterClick(letter)}>
                                    <p>Letter Title: {letter.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Letters;