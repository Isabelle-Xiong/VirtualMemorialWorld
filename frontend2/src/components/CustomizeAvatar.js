import React, { useEffect, useState } from 'react';
import Avatar from 'avataaars';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../CustomizeAvatar.css'; // Ensure the correct path

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

    useEffect(() => {
        document.body.classList.add('customize-avatar-page');
        return () => {
            document.body.classList.remove('customize-avatar-page');
        };
    }, []);

    useEffect(() => {
        const fetchAvatarCustomization = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/avatars/${id}/customization`,
                    { headers: { 'x-auth-token': token } }
                );
                setAvatarProps(response.data);
            } catch (error) {
                console.error('Error fetching avatar customization:', error);
            }
        };

        fetchAvatarCustomization();
    }, [id]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                `http://localhost:5001/api/save-avatar-customization/${id}`,
                { avatarProps },
                { headers: { 'x-auth-token': token } }
            );
            console.log('Avatar customization saved:', response.data);
            navigate(`/avatar-home/${id}`);
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
        <div className="customize-avatar-container">
            <h2 className="customize-avatar-title">Customize Avatar</h2>
            <div className="customize-avatar-avatar-container">
                <Avatar
                    style={{ width: '100px', height: '100px' }}
                    avatarStyle='Circle'
                    {...avatarProps}
                />
            </div>
            <div className="customize-avatar-row">
                <div className="customize-avatar-col">
                    <label>Skin Color:</label>
                    <select
                        className="customize-avatar-form-control"
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
                <div className="customize-avatar-col">
                    <label>Hair Style:</label>
                    <select
                        className="customize-avatar-form-control"
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
                <div className="customize-avatar-col">
                    <label>Hair Color:</label>
                    <select
                        className="customize-avatar-form-control"
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
                <div className="customize-avatar-col">
                    <label>Eye Type:</label>
                    <select
                        className="customize-avatar-form-control"
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
                <div className="customize-avatar-col">
                    <label>Mouth Type:</label>
                    <select
                        className="customize-avatar-form-control"
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
                <div className="customize-avatar-col">
                    <label>Clothe Type:</label>
                    <select
                        className="customize-avatar-form-control"
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
                <div className="customize-avatar-col">
                    <label>Accessories Type:</label>
                    <select
                        className="customize-avatar-form-control"
                        value={avatarProps.accessoriesType}
                        onChange={(e) => updateAvatarProps('accessoriesType', e.target.value)}
                    >
                        <option value="Blank">Blank</option>
                        <option value="Kurt">Kurt</option>
                        <option value="Prescription01">Prescription 01</option>
                        <option value="Prescription02">Prescription 02</option>
                        <option value="Round">Round</option>
                        <option value="Sunglasses">Sunglasses</option>
                        <option value="Wayfarers">Wayfarers</option>
                    </select>
                </div>
                <div className="customize-avatar-col">
                    <label>Facial Hair Type:</label>
                    <select
                        className="customize-avatar-form-control"
                        value={avatarProps.facialHairType}
                        onChange={(e) => updateAvatarProps('facialHairType', e.target.value)}
                    >
                        <option value="Blank">Blank</option>
                        <option value="BeardMedium">Beard Medium</option>
                        <option value="BeardLight">Beard Light</option>
                        <option value="BeardMajestic">Beard Majestic</option>
                        <option value="MoustacheFancy">Moustache Fancy</option>
                        <option value="MoustacheMagnum">Moustache Magnum</option>
                    </select>
                </div>
            </div>
            <button className="customize-avatar-btn" onClick={handleSave}>Save Avatar</button>
        </div>
    );
};

export default CustomizeAvatar;