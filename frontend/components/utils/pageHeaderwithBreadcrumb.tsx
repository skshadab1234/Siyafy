import { Breadcrumb } from 'antd';
import React, { FC } from 'react';

interface Crumb {
    title: string;
    href?: string;
}

interface Props {
    crumbs: Crumb[];
    title: string;
    description: string;
}

const PageHeaderWithBreadcrumb: FC<Props> = ({ crumbs, title, description }) => {
    return (
        <header>
            <Breadcrumb>
                {crumbs.map((crumb, index) => (
                    <Breadcrumb.Item key={index} href={crumb.href}>
                        {crumb.title}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div className="py-4">
                <h1 className="text-lg sm:text-2xl">{title}</h1>
                <p className="text-sm tracking-wider text-gray-500">{description}</p>
            </div>
        </header>
    );
};

export default PageHeaderWithBreadcrumb;
