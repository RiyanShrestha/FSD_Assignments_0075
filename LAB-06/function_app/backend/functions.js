// ============================================================
// functions.js — Reusable Fundamental JavaScript Functions
// This module is imported using require() wherever needed.
// ============================================================

// Basic Arithmetic Functions

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error: Division by zero";
  }
  return a / b;
}

// Finding the largest of two numbers
function findLargest(a, b) {
  if (a > b) return a;
  if (b > a) return b;
  return a; // equal
}

// Check if a number is even or odd
function isEvenOrOdd(num) {
  if (num % 2 === 0) {
    return "Even";
  }
  return "Odd";
}

// Export all functions using module.exports (CommonJS)
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  findLargest,
  isEvenOrOdd,
};
