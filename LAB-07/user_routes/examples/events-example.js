// Events Module Example
const EventEmitter = require("events");

const emitter = new EventEmitter();

// Register an event listener
emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

// Emit the event
emitter.emit("greet", "Node.js Learner");
