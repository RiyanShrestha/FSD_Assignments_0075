// ============================================================
// console.js — Demonstrates all modules via the terminal
// Run with: node backend/console.js
// Uses require() to import reusable modules
// ============================================================

// Import reusable modules using require()
const functions = require("./functions");
const Stack = require("./stack");
const Queue = require("./queue");

console.log("=".repeat(60));
console.log("  JavaScript Fundamentals — Console Demonstration");
console.log("=".repeat(60));

// --- Fundamental Functions ---
console.log("\n--- Basic Arithmetic ---");
console.log("add(10, 5)       =", functions.add(10, 5));
console.log("subtract(10, 5)  =", functions.subtract(10, 5));
console.log("multiply(10, 5)  =", functions.multiply(10, 5));
console.log("divide(10, 5)    =", functions.divide(10, 5));
console.log("divide(10, 0)    =", functions.divide(10, 0));

console.log("\n--- Largest Number ---");
console.log("findLargest(15, 25) =", functions.findLargest(15, 25));
console.log("findLargest(99, 42) =", functions.findLargest(99, 42));

console.log("\n--- Even or Odd ---");
console.log("isEvenOrOdd(4)  =", functions.isEvenOrOdd(4));
console.log("isEvenOrOdd(7)  =", functions.isEvenOrOdd(7));

// --- Stack (FILO / LIFO) ---
console.log("\n" + "=".repeat(60));
console.log("  Stack — FILO / LIFO (Last In First Out)");
console.log("=".repeat(60));

const stack = new Stack();

console.log("\nPushing: 10, 20, 30");
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Stack contents:", stack.display());
console.log("Peek (top element):", stack.peek());

console.log("\nPopping...");
console.log("Popped:", stack.pop(), "(last inserted is removed first)");
console.log("Stack after pop:", stack.display());

console.log("Popping again...");
console.log("Popped:", stack.pop());
console.log("Stack after pop:", stack.display());

console.log("isEmpty:", stack.isEmpty());
console.log("Popping last element:", stack.pop());
console.log("isEmpty:", stack.isEmpty());
console.log("Pop on empty stack:", stack.pop());

// --- Queue (FIFO) ---
console.log("\n" + "=".repeat(60));
console.log("  Queue — FIFO (First In First Out)");
console.log("=".repeat(60));

const queue = new Queue();

console.log("\nEnqueueing: A, B, C");
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
console.log("Queue contents:", queue.display());
console.log("Front element:", queue.front());

console.log("\nDequeueing...");
console.log("Dequeued:", queue.dequeue(), "(first inserted is removed first)");
console.log("Queue after dequeue:", queue.display());

console.log("Dequeueing again...");
console.log("Dequeued:", queue.dequeue());
console.log("Queue after dequeue:", queue.display());

console.log("isEmpty:", queue.isEmpty());
console.log("Dequeueing last element:", queue.dequeue());
console.log("isEmpty:", queue.isEmpty());
console.log("Dequeue on empty queue:", queue.dequeue());

console.log("\n" + "=".repeat(60));
console.log("  Demonstrating Code Reusability");
console.log("=".repeat(60));
console.log("\nThe same functions.add() used by the API server is used here:");
console.log("add(100, 200) =", functions.add(100, 200));
console.log("The same Stack class used by the API is used here.");
console.log("The same Queue class used by the API is used here.");
console.log("\n" + "=".repeat(60));
console.log("  Console demonstration complete!");
console.log("=".repeat(60));
