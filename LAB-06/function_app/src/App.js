import React, { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>JavaScript Fundamentals</h1>
        <p>
          Demonstrating module.exports, require(), Stack (LIFO), Queue (FIFO),
          and reusable functions
        </p>
      </header>

      <CalculatorSection />
      <StackSection />
      <QueueSection />
    </div>
  );
}

// ==================== Calculator Section ====================

function CalculatorSection() {
  const [numA, setNumA] = useState("");
  const [numB, setNumB] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleOperation = async (operation) => {
    setError("");
    setResult(null);

    // Client-side validation
    if (numA === "") {
      setError("Please enter Number A");
      return;
    }
    if (operation !== "isEvenOrOdd" && numB === "") {
      setError("Please enter Number B");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, a: numA, b: numB }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const labels = {
          add: `${data.a} + ${data.b} = ${data.result}`,
          subtract: `${data.a} - ${data.b} = ${data.result}`,
          multiply: `${data.a} × ${data.b} = ${data.result}`,
          divide: `${data.a} ÷ ${data.b} = ${data.result}`,
          findLargest: `Largest of (${data.a}, ${data.b}) = ${data.result}`,
          isEvenOrOdd: `${data.a} is ${data.result}`,
        };
        setResult(labels[operation] || `Result: ${data.result}`);
      }
    } catch (err) {
      setError("Could not connect to backend. Is the server running?");
    }
  };

  return (
    <div className="section-card">
      <h2>JavaScript Fundamentals</h2>
      <p className="subtitle">Basic arithmetic, comparison, and even/odd check</p>
      <span className="info-tag">Reusable functions from functions.js</span>

      <div className="input-row">
        <input
          type="number"
          placeholder="Number A"
          value={numA}
          onChange={(e) => setNumA(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number B"
          value={numB}
          onChange={(e) => setNumB(e.target.value)}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-blue" onClick={() => handleOperation("add")}>
          Add
        </button>
        <button className="btn btn-blue" onClick={() => handleOperation("subtract")}>
          Subtract
        </button>
        <button className="btn btn-blue" onClick={() => handleOperation("multiply")}>
          Multiply
        </button>
        <button className="btn btn-blue" onClick={() => handleOperation("divide")}>
          Divide
        </button>
        <button className="btn btn-purple" onClick={() => handleOperation("findLargest")}>
          Largest
        </button>
        <button className="btn btn-teal" onClick={() => handleOperation("isEvenOrOdd")}>
          Even / Odd
        </button>
      </div>

      <div className={`result-box ${error ? "error" : ""}`}>
        <span className="result-label">Result:</span>
        {error || result || "Perform an operation to see the result"}
      </div>
    </div>
  );
}

// ==================== Stack Section ====================

function StackSection() {
  const [input, setInput] = useState("");
  const [stack, setStack] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAction = async (action) => {
    setError("");
    setResult(null);

    if (action === "push" && input.trim() === "") {
      setError("Please enter a value to push");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value: input.trim() }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setStack(data.stack);
        const messages = {
          push: `Pushed "${input.trim()}" onto the stack`,
          pop: `Popped: ${data.result}`,
          peek: `Top element: ${data.result}`,
          isEmpty: `Stack is empty: ${data.result}`,
        };
        setResult(messages[action]);
        if (action === "push") setInput("");
      }
    } catch (err) {
      setError("Could not connect to backend. Is the server running?");
    }
  };

  return (
    <div className="section-card">
      <h2>Stack — FILO / LIFO</h2>
      <p className="subtitle">
        Last In First Out — the last element pushed is the first one popped
      </p>
      <span className="info-tag">Stack class from stack.js</span>

      <div className="input-row">
        <input
          type="text"
          placeholder="Value to push"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAction("push")}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-green" onClick={() => handleAction("push")}>
          Push
        </button>
        <button className="btn btn-red" onClick={() => handleAction("pop")}>
          Pop
        </button>
        <button className="btn btn-orange" onClick={() => handleAction("peek")}>
          Peek
        </button>
        <button className="btn btn-teal" onClick={() => handleAction("isEmpty")}>
          isEmpty
        </button>
      </div>

      {/* Visual Stack — vertical, top element highlighted */}
      <div className="stack-visual">
        {stack.length === 0 ? (
          <p className="empty-msg">Stack is empty — push an element to begin</p>
        ) : (
          stack.map((item, index) => (
            <div
              key={index}
              className={`stack-item ${index === stack.length - 1 ? "top" : ""}`}
            >
              {item}
              {index === stack.length - 1 && (
                <span className="item-label">← TOP (removed first)</span>
              )}
              {index === 0 && stack.length > 1 && (
                <span className="item-label">← BOTTOM</span>
              )}
            </div>
          ))
        )}
      </div>

      <div className={`result-box ${error ? "error" : ""}`}>
        <span className="result-label">Output:</span>
        {error || result || "Perform a stack operation"}
      </div>
    </div>
  );
}

// ==================== Queue Section ====================

function QueueSection() {
  const [input, setInput] = useState("");
  const [queue, setQueue] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAction = async (action) => {
    setError("");
    setResult(null);

    if (action === "enqueue" && input.trim() === "") {
      setError("Please enter a value to enqueue");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value: input.trim() }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setQueue(data.queue);
        const messages = {
          enqueue: `Enqueued "${input.trim()}" into the queue`,
          dequeue: `Dequeued: ${data.result}`,
          front: `Front element: ${data.result}`,
          isEmpty: `Queue is empty: ${data.result}`,
        };
        setResult(messages[action]);
        if (action === "enqueue") setInput("");
      }
    } catch (err) {
      setError("Could not connect to backend. Is the server running?");
    }
  };

  return (
    <div className="section-card">
      <h2>Queue — FIFO</h2>
      <p className="subtitle">
        First In First Out — the first element enqueued is the first one dequeued
      </p>
      <span className="info-tag">Queue class from queue.js</span>

      <div className="input-row">
        <input
          type="text"
          placeholder="Value to enqueue"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAction("enqueue")}
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-green" onClick={() => handleAction("enqueue")}>
          Enqueue
        </button>
        <button className="btn btn-red" onClick={() => handleAction("dequeue")}>
          Dequeue
        </button>
        <button className="btn btn-orange" onClick={() => handleAction("front")}>
          Front
        </button>
        <button className="btn btn-teal" onClick={() => handleAction("isEmpty")}>
          isEmpty
        </button>
      </div>

      {/* Visual Queue — horizontal, front element highlighted */}
      <div className="queue-visual">
        {queue.length === 0 ? (
          <p className="empty-msg">Queue is empty — enqueue an element to begin</p>
        ) : (
          queue.map((item, index) => (
            <React.Fragment key={index}>
              <div className={`queue-item ${index === 0 ? "front-item" : ""}`}>
                {item}
                {index === 0 && (
                  <span className="item-label">FRONT (removed first)</span>
                )}
                {index === queue.length - 1 && queue.length > 1 && (
                  <span className="item-label">REAR</span>
                )}
              </div>
              {index < queue.length - 1 && <span className="arrow">→</span>}
            </React.Fragment>
          ))
        )}
      </div>

      <div className={`result-box ${error ? "error" : ""}`}>
        <span className="result-label">Output:</span>
        {error || result || "Perform a queue operation"}
      </div>
    </div>
  );
}

export default App;
