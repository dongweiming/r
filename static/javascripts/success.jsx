import React from 'react';
import {FileCard} from './card';


var r = window.file_json
React.render(<FileCard filename={r.filename} size={r.size}
                time={r.time} type={r.type}
                url_d={r.url_d} url_p={r.url_p}
                url_i={r.url_i} url_s={r.url_s}
                quoteurl={r.quoteurl} />,
                document.getElementById('main'));
