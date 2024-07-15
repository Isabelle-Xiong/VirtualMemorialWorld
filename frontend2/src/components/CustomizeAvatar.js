import React, { useState } from 'react';
import Avatar from 'avataaars';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../Avatar.css';

const CustomizeAvatar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [avatarProps, setAvatarProps] = useState({
        topType: "ShortHairShortFlat",
        accessoriesType: "Blank",
        hairColor: "BrownDark",
        facialHairType: "Blank",
        clotheType: "BlazerSweater",
        eyeType: "Default",
        eyebrowType: "Default",
        mouthType: "Smile",
        skinColor: "Light"
    });

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5001/api/save-avatar-customization',
                { avatarId: id, avatarProps },
                { headers: { 'x-auth-token': token } }
            );
            console.log('Avatar customization saved:', response.data);
            navigate('/avatar');
        } catch (error) {
            console.error('Error saving avatar customization:', error);
        }
    };

    const updateAvatarProps = (key, value) => {
        setAvatarProps(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    return (
        <div className="container">
            <h2 className="auth-title">Customize Avatar</h2>
            <Avatar
                style={{ width: '100px', height: '100px' }}
                avatarStyle='Circle'
                {...avatarProps}
            />
            <div className="mb-3">
                <label>Skin Color:</label>
                <select
                    className="form-control"
                    value={avatarProps.skinColor}
                    onChange={(e) => updateAvatarProps('skinColor', e.target.value)}
                >
                    <option value="Pale">Pale</option>
                    <option value="Light">Light</option>
                    <option value="Brown">Brown</option>
                    <option value="DarkBrown">Dark Brown</option>
                    <option value="Black">Black</option>
                </select>
            </div>
            <div className="mb-3">
                <label>Hair Style:</label>
                <select
                    className="form-control"
                    value={avatarProps.topType}
                    onChange={(e) => updateAvatarProps('topType', e.target.value)}
                >
                    <option value="NoHair">No Hair</option>
                    <option value="ShortHairShortFlat">Short Flat</option>
                    <option value="ShortHairTheCaesar">The Caesar</option>
                    <option value="LongHairStraight">Long Straight</option>
                    <option value="LongHairCurly">Long Curly</option>
                    <option value="ShortHairDreads01">Dreads</option>
                    <option value="Hat">Hat</option>
                </select>
            </div>
            <div className="mb-3">
                <label>Hair Color:</label>
                <select
                    className="form-control"
                    value={avatarProps.hairColor}
                    onChange={(e) => updateAvatarProps('hairColor', e.target.value)}
                >
                    <option value="Auburn">Auburn</option>
                    <option value="Black">Black</option>
                    <option value="Blonde">Blonde</option>
                    <option value="BrownDark">Brown Dark</option>
                    <option value="Brown">Brown</option>
                    <option value="PastelPink">Pastel Pink</option>
                    <option value="Red">Red</option>
                    <option value="SilverGray">Silver Gray</option>
                </select>
            </div>
            <div className="mb-3">
                <label>Eye Type:</label>
                <select
                    className="form-control"
                    value={avatarProps.eyeType}
                    onChange={(e) => updateAvatarProps('eyeType', e.target.value)}
                >
                    <option value="Default">Default</option>
                    <option value="Happy">Happy</option>
                    <option value="Squint">Squint</option>
                    <option value="Surprised">Surprised</option>
                    <option value="Wink">Wink</option>
                </select>
            </div>
            <div className="mb-3">
                <label>Mouth Type:</label>
                <select
                    className="form-control"
                    value={avatarProps.mouthType}
                    onChange={(e) => updateAvatarProps('mouthType', e.target.value)}
                >
                    <option value="Default">Default</option>
                    <option value="Smile">Smile</option>
                    <option value="Serious">Serious</option>
                    <option value="Tongue">Tongue</option>
                    <option value="Vomit">Vomit</option>
                </select>
            </div>
            <div className="mb-3">
                <label>Clothe Type:</label>
                <select
                    className="form-control"
                    value={avatarProps.clotheType}
                    onChange={(e) => updateAvatarProps('clotheType', e.target.value)}
                >
                    <option value="BlazerSweater">Blazer Sweater</option>
                    <option value="CollarSweater">Collar Sweater</option>
                    <option value="GraphicShirt">Graphic Shirt</option>
                    <option value="Hoodie">Hoodie</option>
                    <option value="ShirtCrewNeck">Shirt Crew Neck</option>
                    <option value="ShirtScoopNeck">Shirt Scoop Neck</option>
                    <option value="ShirtVNeck">Shirt V Neck</option>
                </select>
            </div>
            <button className="btn btn-primary" onClick={handleSave}>Save Avatar</button>
        </div>
    );
};

export default CustomizeAvatar;