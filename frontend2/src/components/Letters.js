
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
    const MAX_CHAR_COUNT = 400;
    const [charCount, setCharCount] = useState(0);

    const handleLetterContentChange = (e) => {
        const content = e.target.value;
        if (content.length <= MAX_CHAR_COUNT) {
            setLetterContent(content);
            setCharCount(content.length);
        }
    };

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
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
    
            const newLetterResponse = await axios.post(`http://localhost:5001/api/avatars/${id}/letters`, {
                title: letterTitle,
                content: letterContent,
                background: selectedBackground || 'https://img.freepik.com/free-photo/beige-aged-background_53876-90777.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721952000&semt=ais_user',
            }, {
                headers: { 'x-auth-token': token },
            });
    
            setReceivedLetters([...receivedLetters, newLetterResponse.data]);
            setLetterTitle('');
            setLetterContent('');
            setSelectedBackground('');
            setCharCount(0);
        } catch (error) {
            console.error('Error sending letter:', error);
        }
    };

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
    };

    const toggleReceivedLetters = () => {
        setShowReceivedLetters(!showReceivedLetters);
        const historyElement = document.querySelector('.letters-page-letter-history');
        if (historyElement) {
            historyElement.classList.toggle('letters-page-visible');
        }
    };

    return (
        <div className="letters-page-background">
            <div className="letters-page-container">
                <div className="letters-page-header-container">
                    <h2>
                        {!selectedLetter ? `Letters to ${avatarName}` : `Letter: ${selectedLetter.title}`}
                    </h2>
                    {!selectedLetter && (
                        <div className="letters-page-mailbox-toggle" onClick={toggleReceivedLetters}>
                            {showReceivedLetters ? (
                                <img
                                    src="https://cdn.iconscout.com/icon/free/png-256/free-mail-mailbox-open-postbox-38048.png"
                                    alt="Open Mailbox"
                                    className="letters-page-mailbox-icon"
                                />
                            ) : (
                                <img
                                    src="https://www.svgrepo.com/show/404987/closed-mailbox-with-raised-flag.svg"
                                    alt="Closed Mailbox"
                                    className="letters-page-mailbox-icon"
                                />
                            )}
                        </div>
                    )}
                </div>
                {!selectedLetter ? (
                    <>
                        <div
                            className="letters-page-letter-writing-area"
                            style={{ backgroundImage: `url(${selectedBackground || 'https://img.freepik.com/free-photo/beige-aged-background_53876-90777.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721952000&semt=ais_user'})` }}
                        >
                            <input
                                type="text"
                                placeholder="Enter letter title"
                                value={letterTitle}
                                onChange={(e) => setLetterTitle(e.target.value)}
                                className="letters-page-letter-title"
                            />
                            <textarea
                                placeholder={`Write your letter to ${avatarName} here...`}
                                value={letterContent}
                                onChange={handleLetterContentChange}
                            />
                            <p className="char-count">Characters remaining: {MAX_CHAR_COUNT - charCount}</p>

                        </div>
                        <div className="letters-page-background-selection">
                            <label>Select Background:</label>
                            <div className="letters-page-background-options">
                                <div
                                    className={`letters-page-background-option ${selectedBackground === 'https://img.freepik.com/free-vector/watercolor-abstract-background_23-2148995294.jpg' ? 'letters-page-selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://img.freepik.com/free-vector/watercolor-abstract-background_23-2148995294.jpg')}
                                >
                                    <img
                                        src="https://img.freepik.com/free-vector/watercolor-abstract-background_23-2148995294.jpg"
                                        alt="Background 1"
                                    />
                                </div>
                                <div
                                    className={`letters-page-background-option ${selectedBackground === 'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LXguanBn.jpg' ? 'letters-page-selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LXguanBn.jpg')}
                                >
                                    <img
                                        src="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LXguanBn.jpg"
                                        alt="Background 2"
                                    />
                                </div>
                                <div
                                    className={`letters-page-background-option ${selectedBackground === 'https://slidescorner.com/wp-content/uploads/2024/01/Powerpoint-Background-Watercolor-Birthday-Party-or-Celebration-Balloons-by-SlidesCorner.com_.jpg' ? 'letters-page-selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://slidescorner.com/wp-content/uploads/2024/01/Powerpoint-Background-Watercolor-Birthday-Party-or-Celebration-Balloons-by-SlidesCorner.com_.jpg')}
                                >
                                    <img
                                        src="https://slidescorner.com/wp-content/uploads/2024/01/Powerpoint-Background-Watercolor-Birthday-Party-or-Celebration-Balloons-by-SlidesCorner.com_.jpg"
                                        alt="Background 3"
                                    />
                                </div>
                                <div
                                    className={`letters-page-background-option ${selectedBackground === 'https://c1.wallpaperflare.com/preview/258/359/614/596edafe6db62.jpg' ? 'letters-page-selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://c1.wallpaperflare.com/preview/258/359/614/596edafe6db62.jpg')}
                                >
                                    <img
                                        src="https://c1.wallpaperflare.com/preview/258/359/614/596edafe6db62.jpg"
                                        alt="Background 4"
                                    />
                                </div>
                                <div
                                    className={`letters-page-background-option ${selectedBackground === 'https://img.freepik.com/premium-photo/happy-teachers-day-frame-flowers-boder-background_916191-80403.jpg?w=1480' ? 'letters-page-selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://img.freepik.com/premium-photo/happy-teachers-day-frame-flowers-boder-background_916191-80403.jpg?w=1480')}
                                >
                                    <img
                                        src="https://img.freepik.com/premium-photo/happy-teachers-day-frame-flowers-boder-background_916191-80403.jpg?w=1480"
                                        alt="Background 5"
                                    />
                                </div>
                                <div
                                    className={`letters-page-background-option ${selectedBackground === 'https://static.vecteezy.com/system/resources/previews/042/344/243/non_2x/watercolor-pastel-color-background-design-vector.jpg' ? 'letters-page-selected' : ''}`}
                                    onClick={() => setSelectedBackground('https://static.vecteezy.com/system/resources/previews/042/344/243/non_2x/watercolor-pastel-color-background-design-vector.jpg')}
                                >
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/042/344/243/non_2x/watercolor-pastel-color-background-design-vector.jpg"
                                        alt="Background 6"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="letters-page-send-button" onClick={sendLetter}>Send</button>
                    </>
                ) : (
                    <div className="letters-page-letter-details-container">
                        <div
                            className="letters-page-letter-details-sent"
                            style={{ backgroundImage: `url(${selectedLetter.background})` }}
                        >
                            <h4 className="letters-page-letter-title">{selectedLetter.title}</h4>
                            <p>{selectedLetter.content}</p>
                        </div>
                        <div
                            className="letters-page-letter-details-received"
                            style={{ backgroundImage: `url('https://media.istockphoto.com/id/182154211/photo/old-paper-textere.webp?b=1&s=170667a&w=0&k=20&c=ym_eO6PKLl6itLgksTBO-ykUVtQwYabUfWXYyuL2iCU=')` }}
                        >
                            <h4>Response:</h4>
                            <p>{selectedLetter.response}</p>
                        </div>
                        <button className="letters-page-back-button" onClick={() => setSelectedLetter(null)}>Back to List</button>
                    </div>
                )}
                <div className="letters-page-response-area">
                    {!selectedLetter && (
                        <div className={`letters-page-letter-history ${showReceivedLetters ? 'letters-page-visible' : 'letters-page-hidden'}`}>
                            <h3>Letter History</h3>
                            {letters.map((letter, index) => (
                                <div key={index} className="letters-page-letter-item" onClick={() => handleLetterClick(letter)}>
                                    <p>Title: {letter.title}</p>
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