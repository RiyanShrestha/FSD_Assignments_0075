// ============================================================
// queue.js — Queue Data Structure (FIFO)
// First In First Out
// Exported using module.exports for reuse with require()
// ============================================================

class Queue {
  constructor() {
    this.items = [];
  }

  // Add an element to the back of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove the front element (first inserted is removed first — FIFO)
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  // View the front element without removing it
  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return all items (front is at index 0)
  display() {
    return [...this.items];
  }

  // Return the number of elements
  size() {
    return this.items.length;
  }
}

// Export the Queue class using module.exports
module.exports = Queue;
