// FS Module Example
const fs = require("fs");

// Write a file
fs.writeFileSync("example-output.txt", "Hello from the fs module!");
console.log("File created: example-output.txt");

// Read the file
const data = fs.readFileSync("example-output.txt", "utf-8");
console.log("File content:", data);
