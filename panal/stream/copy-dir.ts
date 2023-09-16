import copy from "./copy-stream";

const fs = require('fs');
const path = require('path');

function copyDirectory(src: string, dest: string) {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  // Read the contents of the source directory
  const files = fs.readdirSync(src);

  files.forEach((file: any) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      // If it's a directory, recursively copy it
      copyDirectory(srcPath, destPath);
    } else {
      // If it's a file, copy it
      copy(srcPath, destPath)
    }
  });
  
}

export default copyDirectory;
