# Eventify — Event Discovery & Booking Platform

Eventify is a full-stack event discovery and simulated ticket-booking application. Visitors can search and filter events, inspect event details, reserve tickets, and look up or cancel bookings with their email address. The admin workspace provides event CRUD and booking summaries. Event and booking records are stored in MongoDB through a REST API; the React client does not use a frontend event dataset as its source of truth.

## Problem statement

Event information is often spread across disconnected pages and informal booking flows. Eventify demonstrates a single responsive application where people can discover local experiences and reserve seats while event managers maintain the catalog through a backend service.

## Objectives

- Build reusable React components and demonstrate props, state, effects, controlled inputs, event handlers, and route navigation.
- Implement RESTful CRUD endpoints with Express and Mongoose persistence.
- Validate event and booking input, prevent overselling, and return consistent error responses.
- Provide an academic-ready setup, seed data, and API testing guide.

## Technology and architecture

- **Frontend:** React 18, Vite, JavaScript/JSX, React Router DOM, Lucide React, Fetch API, CSS3.
- **Backend:** Node.js (ES modules), Express, Mongoose, MongoDB, CORS.
- **Development:** npm, Postman, Git.

```text
React pages/components ── Fetch API ── Express routes/controllers ── Mongoose ── MongoDB
       Vite :5173                         API :5000
```

## Project structure

```text
Eventify/
├── frontend/
│   ├── src/components/       # Layout, reusable UI, event form
│   ├── src/pages/            # Home, explore, event detail, bookings, admin
│   ├── src/services/api.js   # Shared fetch wrapper and API methods
│   ├── src/styles.css
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── config/db.js
│   ├── controllers/          # Event and booking operations
│   ├── middleware/           # Validation, 404, centralized error handling
│   ├── models/               # Mongoose Event and Booking schemas
│   ├── routes/
│   ├── seed/seed.js
│   ├── .env.example
│   └── server.js
├── package.json              # Root convenience scripts
└── README.md
```

## Frontend components and learning outcomes

`App.jsx` declares React Router routes. `SiteLayout`, `Navbar`, and `Footer` compose public pages. `EventGrid` and `EventCard` receive event data by props and render reusable event summaries. `SearchBar`, `Field`, `LoadingSpinner`, and `ErrorMessage` provide shared controls and request states. The admin uses a reusable `EventForm` for create and edit modes.

Pages use `useState` for filters, form values, ticket quantity, loading/error feedback, and results. `useEffect` loads API data when a page mounts or its filters change. Controlled `onChange`, `onClick`, and `onSubmit` handlers update state and submit operations. React Router handles navigation and route parameters. API calls are centralized in `src/services/api.js`.

### Task 5 — modular frontend, state and event management

The UI is divided into focused reusable components and page modules. Props pass event data and callbacks; state and effects manage API results and interaction lifecycle; controlled fields handle user input; conditional rendering displays loading, error, empty, confirmed, and cancelled states. Search/category/location filters are reflected in the URL and request the backend.

## Backend, REST API and CRUD

All successful responses use `{ "success": true, "data": ... }` with a message/count when useful. Errors use `{ "success": false, "message": "..." }`. Common codes are 200 (read/update/delete), 201 (create), 400 (invalid input or unavailable quantity), 404 (missing resource/route), 409 (duplicate conflict or event with confirmed bookings), and 500 (unexpected server error).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API health |
| GET | `/api/events?search=&category=&location=` | List/filter events |
| GET | `/api/events/:id` | Get event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event (blocked while confirmed bookings exist) |
| GET | `/api/bookings?email=` | List bookings; optional customer email filter |
| GET | `/api/bookings/:id` | Get booking |
| POST | `/api/bookings` | Reserve tickets |
| PUT | `/api/bookings/:id` | Update customer details on confirmed booking |
| DELETE | `/api/bookings/:id` | Cancel once and return ticket inventory |

### Task 6 — backend services, REST, CRUD and middleware

Express routes delegate work to controllers. Mongoose persists event and booking documents and validates their fields. `express.json()` parses request bodies; CORS allows the configured client origin; a custom logger records method/path; route validators reject malformed event and booking input; the 404 middleware handles unknown routes; the final centralized error handler maps schema, ID, and duplicate errors into JSON. The booking controller atomically decrements inventory only when enough tickets remain and restores inventory when a booking is cancelled.

## Database structure

- **Event:** `title`, `description`, `category`, `location`, `date`, `time`, `price`, `totalTickets`, `availableTickets`, `image`, `createdAt`. Ticket values and prices are validated; availability cannot exceed capacity.
- **Booking:** unique `bookingReference`, `eventId` (ObjectId reference to Event), `customerName`, validated/lowercased `customerEmail`, positive whole-number `ticketQuantity`, `totalAmount`, `bookingStatus` (`confirmed` / `cancelled`), `bookingDate`.

Payments are not collected. Booking total is a simulated confirmation amount only. No authentication/authorization is included; the admin route is intended for local academic demonstration and must be protected before public deployment.

## Installation and run

Requirements: Node.js 18+ and a reachable MongoDB instance (local MongoDB or MongoDB Atlas). From the project root:

```bash
npm install
npm run install:all
```

Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` to the local or Atlas connection URI. Set `CLIENT_URL` to the frontend origin (default `http://localhost:5173`). Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` (default `http://localhost:5000/api`). Never commit `.env` files or credentials.

Seed at least eight sample events (the seed script replaces the current event collection):

```bash
npm run seed
```

Start both apps from the root:

```bash
npm run dev
```

Or run in separate terminals: `npm run dev --prefix backend` and `npm run dev --prefix frontend`. Open `http://localhost:5173`; the API listens on `http://localhost:5000`. For a frontend production build, run `npm run build`.

## Postman API testing guide

Set `baseUrl` to `http://localhost:5000` and start MongoDB/API first. Use JSON bodies and save IDs returned in `data._id` for follow-up requests. Seed events before testing bookings.

### Events

1. `GET {{baseUrl}}/api/events` — expect 200 and event array. Try `?search=jazz`, `?category=Music`, or `?location=Mumbai`.
2. `GET {{baseUrl}}/api/events/{{eventId}}` — expect 200; unknown valid ID returns 404.
3. `POST {{baseUrl}}/api/events` — expect 201:

```json
{
  "title": "Postman Demo Night",
  "description": "A live demo event created from Postman.",
  "category": "Technology",
  "location": "Pune",
  "date": "2027-08-14",
  "time": "18:30",
  "price": 500,
  "totalTickets": 40,
  "image": "https://example.com/event.jpg"
}
```

4. `PUT {{baseUrl}}/api/events/{{eventId}}` — send the same required fields with a changed title/price; expect 200. Capacity cannot drop below the tickets already sold.
5. `DELETE {{baseUrl}}/api/events/{{eventId}}` — expect 200 when no confirmed booking exists; expect 409 if a confirmed booking exists. A missing event returns 404.

### Bookings

1. `POST {{baseUrl}}/api/bookings` — use a seeded/created event `_id`; expect 201 and a unique reference:

```json
{
  "eventId": "<event ObjectId>",
  "customerName": "Alex Morgan",
  "customerEmail": "alex@example.com",
  "ticketQuantity": 2
}
```

2. `GET {{baseUrl}}/api/bookings` or `GET {{baseUrl}}/api/bookings?email=alex@example.com` — expect 200 and populated event details.
3. `GET {{baseUrl}}/api/bookings/{{bookingId}}` — expect 200.
4. `PUT {{baseUrl}}/api/bookings/{{bookingId}}` with `{ "customerName": "Alex M." }` — expect 200 while confirmed.
5. `DELETE {{baseUrl}}/api/bookings/{{bookingId}}` — expect 200, status becomes cancelled and inventory is restored. Repeating cancellation returns 400. More tickets than available returns 400; a nonexistent event returns 404.

## Demonstration checklist

- [ ] MongoDB connected and seeded with sample events.
- [ ] Home, Explore and event-detail pages load database events.
- [ ] Search, category and location filters update displayed results.
- [ ] Booking validates name/email/quantity and reduces available inventory.
- [ ] Booking lookup by email works; cancellation restores inventory once.
- [ ] Admin creates, edits and deletes events through API calls.
- [ ] Admin dashboard totals and recent bookings reflect persisted records.
- [ ] Invalid input, no matches, API unavailable, and not-found states are visible.
- [ ] Responsive layout checked at desktop, tablet and mobile widths.

Screenshots for the report can be captured from the Home hero, Explore filters, Event details/booking panel, My bookings, and Admin overview in the running app.

## Conclusion

Eventify demonstrates the complete path from React interaction through REST controllers and Mongoose persistence. The project separates client and server code, includes seed data and repeatable API documentation, and provides visible feedback throughout discovery and booking workflows.
