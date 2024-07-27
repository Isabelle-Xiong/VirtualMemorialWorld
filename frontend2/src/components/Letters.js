import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Letters.css'; // Adjust the path based on your project structure

function Letters() {
    const { id } = useParams();
    const [letters, setLetters] = useState([]);
    const [letterTitle, setLetterTitle] = useState('');
    const [letterContent, setLetterContent] = useState('');
    const [selectedBackground, setSelectedBackground] = useState('');
    const [avatarName, setAvatarName] = useState('');
    const [receivedLetters, setReceivedLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [showReceivedLetters, setShowReceivedLetters] = useState(false);

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
                title: letterTitle,
                content: letterContent,
                background: selectedBackground
            }, {
                headers: { 'x-auth-token': token },
            });
            setReceivedLetters([...receivedLetters, response.data]);
            setLetterTitle('');
            setLetterContent('');
            setSelectedBackground('');
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
                    <>
                        <div
                            className="letter-writing-area"
                            style={{ backgroundImage: `url(${selectedBackground})` }}
                        >
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
                        </div>
                        <div className="background-selection">
                            <label>Select Background:</label>
                            <div className="background-options">
                                <div
                                    className={`background-option ${selectedBackground === 'https://img.freepik.com/free-vector/watercolor-abstract-background_23-2148995294.jpg' ? 'selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://img.freepik.com/free-vector/watercolor-abstract-background_23-2148995294.jpg')}
                                >
                                    <img
                                        src="https://img.freepik.com/free-photo/wall-blank-paper-frame-with-acorn-decoration_53876-105706.jpghttps://img.freepik.com/free-vector/watercolor-abstract-background_23-2148995294.jpg"
                                        alt="Background 1"
                                    />
                                </div>
                                <div
                                    className={`background-option ${selectedBackground === 'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LXguanBn.jpg' ? 'selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LXguanBn.jpg')}
                                >
                                    <img
                                        src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LXguanBn.jpg"
                                        alt="Background 2"
                                    />
                                </div>
                                <div
                                    className={`background-option ${selectedBackground === 'https://slidescorner.com/wp-content/uploads/2024/01/Powerpoint-Background-Watercolor-Birthday-Party-or-Celebration-Balloons-by-SlidesCorner.com_.jpg' ? 'selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://slidescorner.com/wp-content/uploads/2024/01/Powerpoint-Background-Watercolor-Birthday-Party-or-Celebration-Balloons-by-SlidesCorner.com_.jpg')}
                                >
                                    <img
                                        src="https://slidescorner.com/wp-content/uploads/2024/01/Powerpoint-Background-Watercolor-Birthday-Party-or-Celebration-Balloons-by-SlidesCorner.com_.jpg"
                                        alt="Background 3"
                                    />
                                </div>
                                <div
                                    className={`background-option ${selectedBackground === 'https://c1.wallpaperflare.com/preview/258/359/614/596edafe6db62.jpg' ? 'selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://c1.wallpaperflare.com/preview/258/359/614/596edafe6db62.jpg')}
                                >
                                    <img
                                        src="https://c1.wallpaperflare.com/preview/258/359/614/596edafe6db62.jpg"
                                        alt="Background 4"
                                    />
                                </div>
                                <div
                                    className={`background-option ${selectedBackground === 'https://img.freepik.com/free-vector/watercolor-background-world-tourism-day_23-2149567156.jpg' ? 'selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://img.freepik.com/free-vector/watercolor-background-world-tourism-day_23-2149567156.jpg')}
                                >
                                    <img
                                        src="https://img.freepik.com/free-vector/watercolor-background-world-tourism-day_23-2149567156.jpg"
                                        alt="Background 5"
                                    />
                                </div>
                                <div
                                    className={`background-option ${selectedBackground === 'https://static.vecteezy.com/system/resources/previews/042/344/243/non_2x/watercolor-pastel-color-background-design-vector.jpg' ? 'selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://static.vecteezy.com/system/resources/previews/042/344/243/non_2x/watercolor-pastel-color-background-design-vector.jpg')}
                                >
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/042/344/243/non_2x/watercolor-pastel-color-background-design-vector.jpg"
                                        alt="Background 6"
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={sendLetter}>Send</button>
                    </>
                ) : null}
                <div className="response-area">
                    {selectedLetter ? (
                        <div className="letter-details" style={{ backgroundImage: `url(${selectedLetter.background})` }}>
                            <h4>{selectedLetter.title}</h4>
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