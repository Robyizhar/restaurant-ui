import * as React from 'react';

import { Link } from 'react-router-dom';
// (3) import `config`
import { config } from '../config';
export default function StoreLogo(){
    return (
        <Link to="/">
            <div className="text-blue-600 font-bold text-4xl">
                {config.site_title}
            </div>
        </Link>
    )
}
