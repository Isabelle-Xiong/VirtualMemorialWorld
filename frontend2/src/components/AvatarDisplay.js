import React from 'react';
import Avatar from 'avataaars';

const AvatarDisplay = ({ avatarProps }) => {
    return (
        <Avatar
            avatarStyle='Circle'
            topType={avatarProps.topType}
            accessoriesType={avatarProps.accessoriesType}
            hairColor={avatarProps.hairColor}
            facialHairType={avatarProps.facialHairType}
            clotheType={avatarProps.clotheType}
            eyeType={avatarProps.eyeType}
            eyebrowType={avatarProps.eyebrowType}
            mouthType={avatarProps.mouthType}
            skinColor={avatarProps.skinColor}
        />
    );
};

export default AvatarDisplay;