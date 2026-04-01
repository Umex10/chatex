const fs = require('fs');
const sizeOf = require('image-size'); 
// wait image-size might not be installed. Let's just use raw width/height if we can, or just skip it.
