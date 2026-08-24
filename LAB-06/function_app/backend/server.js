// ============================================================
// server.js — Node.js Backend API Server (using built-in http module)
// Uses require() to import reusable modules
// Run with: node backend/server.js
// ============================================================

const http = require("http");
const url = require("url");

// Import reusable modules using require()
const functions = require("./functions");
const Stack = require("./stack");
const Queue = require("./queue");

const PORT = 5000;

// Create shared Stack and Queue instances for the API
const stack = new Stack();
const queue = new Queue();

// Helper: parse JSON body from a request
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

// Helper: send a JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  try {
    // ===================== CALCULATOR ENDPOINTS =====================

    if (path === "/api/calculate" && method === "POST") {
      const { operation, a, b } = await parseBody(req);
      const numA = parseFloat(a);
      const numB = parseFloat(b);

      // Validate inputs
      if (isNaN(numA) || (operation !== "isEvenOrOdd" && isNaN(numB))) {
        sendJSON(res, 400, { error: "Please provide valid numbers" });
        return;
      }

      let result;
      switch (operation) {
        case "add":
          result = functions.add(numA, numB);
          console.log(`API: add(${numA}, ${numB}) = ${result}`);
          break;
        case "subtract":
          result = functions.subtract(numA, numB);
          console.log(`API: subtract(${numA}, ${numB}) = ${result}`);
          break;
        case "multiply":
          result = functions.multiply(numA, numB);
          console.log(`API: multiply(${numA}, ${numB}) = ${result}`);
          break;
        case "divide":
          result = functions.divide(numA, numB);
          console.log(`API: divide(${numA}, ${numB}) = ${result}`);
          break;
        case "findLargest":
          result = functions.findLargest(numA, numB);
          console.log(`API: findLargest(${numA}, ${numB}) = ${result}`);
          break;
        case "isEvenOrOdd":
          result = functions.isEvenOrOdd(numA);
          console.log(`API: isEvenOrOdd(${numA}) = ${result}`);
          break;
        default:
          sendJSON(res, 400, { error: "Unknown operation: " + operation });
          return;
      }

      sendJSON(res, 200, { operation, a: numA, b: numB, result });
      return;
    }

    // ===================== STACK ENDPOINTS =====================

    if (path === "/api/stack" && method === "POST") {
      const { action, value } = await parseBody(req);

      let result;
      switch (action) {
        case "push":
          if (value === undefined || value === "") {
            sendJSON(res, 400, { error: "Please provide a value to push" });
            return;
          }
          stack.push(value);
          result = `Pushed "${value}" onto the stack`;
          console.log(`API Stack: push(${value}) | Stack: [${stack.display()}]`);
          break;
        case "pop":
          result = stack.pop();
          console.log(`API Stack: pop() => ${result} | Stack: [${stack.display()}]`);
          break;
        case "peek":
          result = stack.peek();
          console.log(`API Stack: peek() => ${result}`);
          break;
        case "isEmpty":
          result = stack.isEmpty();
          console.log(`API Stack: isEmpty() => ${result}`);
          break;
        default:
          sendJSON(res, 400, { error: "Unknown stack action: " + action });
          return;
      }

      sendJSON(res, 200, {
        action,
        result,
        stack: stack.display(),
        size: stack.size(),
      });
      return;
    }

    if (path === "/api/stack" && method === "GET") {
      sendJSON(res, 200, {
        stack: stack.display(),
        size: stack.size(),
        isEmpty: stack.isEmpty(),
      });
      return;
    }

    // ===================== QUEUE ENDPOINTS =====================

    if (path === "/api/queue" && method === "POST") {
      const { action, value } = await parseBody(req);

      let result;
      switch (action) {
        case "enqueue":
          if (value === undefined || value === "") {
            sendJSON(res, 400, { error: "Please provide a value to enqueue" });
            return;
          }
          queue.enqueue(value);
          result = `Enqueued "${value}" into the queue`;
          console.log(`API Queue: enqueue(${value}) | Queue: [${queue.display()}]`);
          break;
        case "dequeue":
          result = queue.dequeue();
          console.log(`API Queue: dequeue() => ${result} | Queue: [${queue.display()}]`);
          break;
        case "front":
          result = queue.front();
          console.log(`API Queue: front() => ${result}`);
          break;
        case "isEmpty":
          result = queue.isEmpty();
          console.log(`API Queue: isEmpty() => ${result}`);
          break;
        default:
          sendJSON(res, 400, { error: "Unknown queue action: " + action });
          return;
      }

      sendJSON(res, 200, {
        action,
        result,
        queue: queue.display(),
        size: queue.size(),
      });
      return;
    }

    if (path === "/api/queue" && method === "GET") {
      sendJSON(res, 200, {
        queue: queue.display(),
        size: queue.size(),
        isEmpty: queue.isEmpty(),
      });
      return;
    }

    // ===================== 404 =====================
    sendJSON(res, 404, { error: "Endpoint not found" });
  } catch (err) {
    console.error("Server error:", err.message);
    sendJSON(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`\nBackend API server running at http://localhost:${PORT}`);
  console.log("Endpoints:");
  console.log("  POST /api/calculate  — Fundamental functions");
  console.log("  GET  /api/stack      — View stack");
  console.log("  POST /api/stack      — Stack operations");
  console.log("  GET  /api/queue      — View queue");
  console.log("  POST /api/queue      — Queue operations\n");
});
