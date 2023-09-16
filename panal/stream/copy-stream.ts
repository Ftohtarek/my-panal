const fs = require('fs');
function copy(sourcePath: string, destinationPath: string) {
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationPath);

  readStream.on('error', (err: any) => {
    console.error('Error reading the file:', err);
  });

  writeStream.on('error', (err: any) => {
    console.error('Error writing the file:', err);
  });

  writeStream.on('finish', () => {
    console.log('File successfully copied.');
  });

  readStream.pipe(writeStream);
}
export default copy;
