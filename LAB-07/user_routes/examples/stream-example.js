// Stream Module Example
const fs = require("fs");

// Create a sample file to read
fs.writeFileSync("stream-sample.txt", "This is sample data for the stream example.");

// Read file using a readable stream
const readStream = fs.createReadStream("stream-sample.txt", "utf-8");

readStream.on("data", (chunk) => {
  console.log("Received chunk:", chunk);
});

readStream.on("end", () => {
  console.log("Stream reading completed.");
});
