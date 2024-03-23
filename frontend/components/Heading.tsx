import React from 'react';

const Heading = ({ title, className }: any) => {
    // Combine the provided className with any existing classes
    const combinedClassName = `text-base md:text-2xl font-semibold ${className}`;

    return <h1 className={combinedClassName}>{title}</h1>;
};

export default Heading;
