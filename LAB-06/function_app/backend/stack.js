// ============================================================
// stack.js — Stack Data Structure (FILO / LIFO)
// First In Last Out / Last In First Out
// Exported using module.exports for reuse with require()
// ============================================================

class Stack {
  constructor() {
    this.items = [];
  }

  // Push an element onto the top of the stack
  push(element) {
    this.items.push(element);
  }

  // Pop the top element (last inserted is removed first — LIFO)
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  // Peek at the top element without removing it
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return all items (top element is last in the array)
  display() {
    return [...this.items];
  }

  // Return the number of elements
  size() {
    return this.items.length;
  }
}

// Export the Stack class using module.exports
module.exports = Stack;
