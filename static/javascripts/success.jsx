import React from 'react';
import {ImageCard} from './card';
import $ from 'jquery';

const url_i = $('meta[name="url_i"]').attr('content');
const url_s = $('meta[name="url_s"]').attr('content');
const quoteurl = $('meta[name="quoteurl"]').attr('content');
const image_type = $('meta[name="image_type"]').attr('content');

main(url_i, url_s, quoteurl, image_type)

function main(url_i, url_s, quoteurl, image_type) {
    var image_link_input = '';
    var show_image_card = '';
    if ( image_type === "image" ) {
        image_link_input = url_s;
        show_image_card = 'show-card'
    }
    React.render(<ImageCard show_image_card={show_image_card} url_i={url_i}
                  image_link_input={image_link_input} quoteurl={quoteurl}/>,
                 document.getElementById('main'));
}
