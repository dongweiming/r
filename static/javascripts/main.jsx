import React from 'react';
import DragAndDrop from './upload';

import "../stylesheets/main";


main();

function main() {
    React.render(<DragAndDrop/>, document.getElementById('main'));
}
