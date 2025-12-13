# API Reference

Base URL: `https://mcfleet-marketplace.onrender.com/api/auth`

All endpoints are prefixed with the base URL above.

---

## AUTHENTICATION

### GET `/discord`
- **Purpose:** Initiate Discord OAuth login
- **Auth:** Public (no authentication required)
- **Response:** Redirects to Discord OAuth page

### GET `/discord/callback`
- **Purpose:** Discord OAuth callback handler
- **Auth:** Public (handled by backend)
- **Response:** Redirects to frontend with token query param

### GET `/me`
- **Purpose:** Get current authenticated user info
- **Auth:** Protected (JWT required)
- **Response:** `{ success: true, user: { userId, role } }`

---

## BUYER (role: user)

### GET `/listings`
- **Purpose:** Fetch active marketplace listings
- **Auth:** Public (no authentication required)
- **Query Params:** 
  - `survival` (optional)
  - `category` (optional)
  - `itemName` (optional)
- **Response:** `{ success: true, listings: [...] }`

### GET `/listings/:listingId`
- **Purpose:** Get single listing details
- **Auth:** Public (no authentication required)
- **Response:** `{ success: true, listing: {...} }`

### POST `/orders`
- **Purpose:** Create new order from listing
- **Auth:** Protected (JWT required, role: user or seller)
- **Body:** `{ listingId }`
- **Response:** `{ success: true, order: {...} }`

### GET `/orders`
- **Purpose:** Get buyer's orders
- **Auth:** Protected (JWT required, role: user)
- **Response:** `{ success: true, orders: [...] }`

### GET `/orders/:orderId`
- **Purpose:** Get single order details
- **Auth:** Protected (JWT required, role: user)
- **Response:** `{ success: true, order: {...} }`

### POST `/orders/:orderId/dispute`
- **Purpose:** Raise dispute for an order
- **Auth:** Protected (JWT required, role: user or seller)
- **Body:** `{ reason }`
- **Response:** `{ success: true, dispute: {...} }`

---

## SELLER (role: seller)

### POST `/listings`
- **Purpose:** Create new item listing
- **Auth:** Protected (JWT required, role: seller)
- **Body:** `{ title, itemName, category, survival, price }`
- **Response:** `{ success: true, listing: {...} }`

### GET `/seller/listings`
- **Purpose:** Get seller's own listings
- **Auth:** Protected (JWT required, role: seller)
- **Response:** `{ success: true, listings: [...] }`

### GET `/seller/transactions`
- **Purpose:** Get seller's transaction history
- **Auth:** Protected (JWT required, role: seller)
- **Response:** `{ success: true, transactions: [...] }`

### GET `/seller/earnings`
- **Purpose:** Get seller earnings summary
- **Auth:** Protected (JWT required, role: seller)
- **Response:** `{ success: true, summary: { totalOrders, totalEarned, paidOut, pendingPayout } }`

---

## MIDDLEMAN (role: middleman)

### GET `/middleman/orders`
- **Purpose:** Get orders assigned to middleman
- **Auth:** Protected (JWT required, role: middleman)
- **Response:** `{ success: true, orders: [...] }`

### POST `/orders/:orderId/mark-paid`
- **Purpose:** Mark order as paid by buyer
- **Auth:** Protected (JWT required, role: middleman)
- **Response:** `{ success: true, message: "Order marked as paid" }`

### POST `/orders/:orderId/collect`
- **Purpose:** Mark item as collected from seller
- **Auth:** Protected (JWT required, role: middleman)
- **Response:** `{ success: true, message: "Item collected" }`

### POST `/orders/:orderId/deliver`
- **Purpose:** Mark item as delivered to buyer
- **Auth:** Protected (JWT required, role: middleman)
- **Response:** `{ success: true, message: "Item delivered" }`

---

## ADMIN (role: admin)

### GET `/transactions/summary`
- **Purpose:** Get platform transaction summary
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, summary: { totalTransactions, totalRevenue, totalCommission, totalSellerPayout } }`

### GET `/transactions`
- **Purpose:** Get all transaction records
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, transactions: [...] }`

### POST `/transactions/:transactionId/mark-paid`
- **Purpose:** Mark seller payout as completed
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Seller payout marked as paid" }`

### POST `/orders/:orderId/assign-middleman`
- **Purpose:** Assign middleman to order
- **Auth:** Protected (JWT required, role: admin)
- **Body:** `{ middlemanId }`
- **Response:** `{ success: true, message: "Middleman assigned" }`

### POST `/orders/:orderId/complete`
- **Purpose:** Complete order and create transaction
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, transaction: {...} }`

### POST `/users/:userId/ban`
- **Purpose:** Ban a user
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "User banned" }`

### POST `/users/:userId/unban`
- **Purpose:** Unban a user
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "User unbanned" }`

### POST `/listings/:listingId/disable`
- **Purpose:** Disable a listing (set status to removed)
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Listing disabled" }`

### POST `/listings/:listingId/remove`
- **Purpose:** Permanently delete a listing
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Listing removed permanently" }`

### PUT `/settings/commission`
- **Purpose:** Update platform commission percentage
- **Auth:** Protected (JWT required, role: admin)
- **Body:** `{ commissionPercent }`
- **Response:** `{ success: true, commissionPercent: 25 }`

### GET `/audit-logs`
- **Purpose:** Get admin action audit logs
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, logs: [...] }`

---

## SELLER REQUESTS

### POST `/seller-request`
- **Purpose:** Submit seller role request
- **Auth:** Protected (JWT required)
- **Response:** `{ success: true, message: "Seller request submitted" }`

### GET `/seller-requests`
- **Purpose:** Get all seller requests (admin view)
- **Auth:** Protected (JWT required, role: admin)
- **Response:** Array of seller requests

### POST `/seller-requests/:id/approve`
- **Purpose:** Approve seller request
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Seller request approved" }`

### POST `/seller-requests/:id/reject`
- **Purpose:** Reject seller request
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Seller request rejected" }`

---

## PRICE RANGES

### GET `/price-ranges`
- **Purpose:** Get active price ranges
- **Auth:** Public (no authentication required)
- **Response:** Array of price ranges

### POST `/price-ranges`
- **Purpose:** Create new price range
- **Auth:** Protected (JWT required, role: admin)
- **Body:** `{ itemName, category, survival, minPrice, maxPrice }`
- **Response:** Created price range object

---

## MIDDLEMAN MANAGEMENT

### GET `/users/middlemen`
- **Purpose:** Get all middlemen users
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, middlemen: [...] }`

### POST `/users/:userId/make-middleman`
- **Purpose:** Assign middleman role to user
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Middleman added" }`

### POST `/users/:userId/remove-middleman`
- **Purpose:** Remove middleman role from user
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, message: "Middleman removed" }`

---

## DISPUTES

### GET `/disputes`
- **Purpose:** Get all disputes (admin view)
- **Auth:** Protected (JWT required, role: admin)
- **Response:** `{ success: true, disputes: [...] }`

### POST `/disputes/:disputeId/resolve`
- **Purpose:** Resolve a dispute
- **Auth:** Protected (JWT required, role: admin)
- **Body:** `{ resolutionNote }`
- **Response:** `{ success: true, message: "Dispute resolved" }`

---

## NOTES

- All protected routes require JWT token in `Authorization: Bearer <token>` header
- Token is automatically attached by Axios interceptor from localStorage
- 401 responses clear auth state and redirect to login
- Role-based access is enforced on backend
- All timestamps are in ISO format

