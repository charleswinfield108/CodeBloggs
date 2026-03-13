const sharp = require('sharp');
const path = require('path');

const sourceImage = path.join(__dirname, 'Wireframe assets/CodeBloggs graphic.png');
const faviconPath = path.join(__dirname, 'client/public/favicon.png');

sharp(sourceImage)
  .resize(64, 64, {
    fit: 'contain',
    background: { r: 251, g: 252, b: 253 } // #FBFCFD background
  })
  .toFormat('png')
  .toFile(faviconPath, (err, info) => {
    if (err) {
      console.error('Error creating favicon:', err);
      process.exit(1);
    }
    console.log('Favicon created successfully:', faviconPath);
    console.log('File info:', info);
  });
