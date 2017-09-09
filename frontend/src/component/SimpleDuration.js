import React from 'react';

export default ({ minutes }) => {
    const hours = Math.floor(minutes / 60);

    if (hours) return <span>{`${hours}h ${minutes % 60}m`}</span>;

    return <span>{`${minutes % 60}m`}</span>;
};
