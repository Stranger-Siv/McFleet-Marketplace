# Complete End-to-End Test Plan
## McFleet Marketplace System

**Test Date:** Generated  
**System Version:** Current  
**Test Environment:** Production-ready verification

---

## ✅ AUTHENTICATION TESTS

### Test 1.1: Homepage Access
- [ ] Visit `/` (homepage)
- [ ] Verify landing page displays correctly
- [ ] Verify "Login with Discord" button is visible
- [ ] Verify no authentication required for homepage

### Test 1.2: Discord Login Flow
- [ ] Click "Login with Discord"
- [ ] Redirected to Discord OAuth
- [ ] Authorize application
- [ ] Redirected to `/auth/success?token=...`
- [ ] Token extracted from URL
- [ ] User data decoded from JWT
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage
- [ ] Redirected to role-specific dashboard

### Test 1.3: Token Persistence
- [ ] Refresh page after login
- [ ] Verify user remains logged in
- [ ] Verify token loaded from localStorage
- [ ] Verify user data loaded from localStorage
- [ ] No redirect to login page

### Test 1.4: Logout and Re-login
- [ ] Click logout button
- [ ] Verify token removed from localStorage
- [ ] Verify user data removed from localStorage
- [ ] Redirected to login/homepage
- [ ] Re-login with Discord
- [ ] Verify new session works correctly

### Test 1.5: Invalid Token Handling
- [ ] Manually corrupt token in localStorage
- [ ] Refresh page
- [ ] Verify redirect to login
- [ ] Verify corrupted data cleared

---

## ✅ ROLE & ACCESS CONTROL TESTS

### Test 2.1: Buyer Access
- [ ] Buyer can access:
  - [ ] `/marketplace`
  - [ ] `/listings/:listingId`
  - [ ] `/buyer/orders`
  - [ ] `/become-seller`
- [ ] Buyer CANNOT access:
  - [ ] `/seller/*` (403 Forbidden)
  - [ ] `/admin/*` (403 Forbidden)
  - [ ] `/middleman/*` (403 Forbidden)

### Test 2.2: Seller Access
- [ ] Seller can access:
  - [ ] `/seller/dashboard`
  - [ ] `/seller/create-listing`
  - [ ] `/seller/listings`
  - [ ] `/seller/orders`
  - [ ] `/seller/transactions`
- [ ] Seller CANNOT access:
  - [ ] `/admin/*` (403 Forbidden)
  - [ ] `/middleman/*` (403 Forbidden)

### Test 2.3: Middleman Access
- [ ] Middleman can access:
  - [ ] `/middleman/orders`
  - [ ] `/middleman/orders/:orderId`
- [ ] Middleman sees ONLY assigned orders
- [ ] Middleman CANNOT access:
  - [ ] `/seller/*` (403 Forbidden)
  - [ ] `/admin/*` (403 Forbidden)

### Test 2.4: Admin Access
- [ ] Admin can access:
  - [ ] `/admin/dashboard`
  - [ ] `/admin/seller-requests`
  - [ ] `/admin/users`
  - [ ] `/admin/listings`
  - [ ] `/admin/orders`
  - [ ] `/admin/transactions`
  - [ ] `/admin/disputes`
  - [ ] `/admin/audit-logs`
  - [ ] `/admin/settings`
- [ ] Admin can access all routes

### Test 2.5: Unauthenticated Access
- [ ] Logout
- [ ] Try accessing protected route
- [ ] Verify redirect to `/login`
- [ ] Verify 401 Unauthorized on API calls

---

## ✅ SELLER TESTS

### Test 3.1: Seller Request Flow
- [ ] Buyer visits `/become-seller`
- [ ] Submit seller request
- [ ] Verify request created in database
- [ ] Admin views `/admin/seller-requests`
- [ ] Admin approves request
- [ ] User role updated to `seller`
- [ ] User can now access seller routes

### Test 3.2: Create Listing
- [ ] Seller navigates to `/seller/create-listing`
- [ ] Fill form:
  - [ ] Title: "Diamond Sword"
  - [ ] Category: "Weapon"
  - [ ] Survival/World: Select from dropdown
  - [ ] Price per unit: 100
  - [ ] Stock: 100
  - [ ] Description: "Sharp and powerful"
- [ ] Submit listing
- [ ] Verify listing created
- [ ] Verify listing appears in `/seller/listings`
- [ ] Verify listing appears in marketplace (`/marketplace`)

### Test 3.3: Stock Management
- [ ] Seller views `/seller/listings`
- [ ] Find listing with stock 100
- [ ] Edit stock to 150
- [ ] Verify stock updated to 150
- [ ] Verify available stock = total stock - reserved stock
- [ ] Try to reduce stock below reserved quantity
- [ ] Verify error message
- [ ] Verify stock not reduced below reserved

### Test 3.4: Seller Orders View
- [ ] Seller navigates to `/seller/orders`
- [ ] Verify orders list displays:
  - [ ] Item title (not order ID)
  - [ ] Quantity ordered
  - [ ] Total amount
  - [ ] Status badge
  - [ ] Order date
  - [ ] Middleman assignment status
- [ ] Click on order
- [ ] Verify order detail page shows:
  - [ ] Item info
  - [ ] Quantity
  - [ ] Unit price
  - [ ] Total price
  - [ ] Commission percentage (from admin settings)
  - [ ] Commission amount deducted
  - [ ] Net amount seller will receive
  - [ ] Buyer info (masked - no Discord details)
  - [ ] Middleman info (if assigned)

### Test 3.5: Seller Dashboard
- [ ] Seller views `/seller/dashboard`
- [ ] Verify commission notice banner:
  - [ ] "Platform commission: X% per order"
  - [ ] Value matches admin settings
- [ ] Verify stats cards:
  - [ ] Total Earned
  - [ ] Paid Out
  - [ ] Pending Payout
  - [ ] Total Orders
  - [ ] Seller Rating (if applicable)

---

## ✅ BUYER TESTS

### Test 4.1: Browse Marketplace
- [ ] Buyer navigates to `/marketplace`
- [ ] Verify listings display in grid
- [ ] Verify each listing shows:
  - [ ] Item title
  - [ ] Category icon
  - [ ] Price per unit
  - [ ] Stock availability
  - [ ] Seller rating (if available)
  - [ ] "New Seller" badge (if no ratings)
- [ ] Verify filters work:
  - [ ] Category filter
  - [ ] Price range filter
  - [ ] Search by item name

### Test 4.2: View Listing Detail
- [ ] Click on a listing
- [ ] Navigate to `/listings/:listingId`
- [ ] Verify displays:
  - [ ] Large category icon
  - [ ] Item title
  - [ ] Category and survival info
  - [ ] Price per unit
  - [ ] Available stock
  - [ ] Description (if provided)
  - [ ] Seller rating:
    - [ ] Average rating (e.g., "⭐ 4.8 / 5.0")
    - [ ] Total ratings count
    - [ ] Total deals completed
    - [ ] "New Seller" if no ratings
  - [ ] Quantity selector
  - [ ] Real-time total price calculation
  - [ ] "Buy Now" button

### Test 4.3: Quantity Selection
- [ ] On listing detail page
- [ ] Verify quantity selector:
  - [ ] Default: 1
  - [ ] Increment button (+)
  - [ ] Decrement button (-)
  - [ ] Manual input allowed
  - [ ] Max = available stock
  - [ ] Cannot exceed stock
- [ ] Change quantity to 5
- [ ] Verify total price = unit price × 5
- [ ] Try to set quantity > stock
- [ ] Verify quantity clamped to max stock
- [ ] Verify "Out of stock" if stock = 0
- [ ] Verify "Buy Now" button disabled if out of stock

### Test 4.4: Create Order
- [ ] Select quantity (e.g., 10)
- [ ] Verify total price calculated correctly
- [ ] Click "Buy Now"
- [ ] Verify order created
- [ ] Verify stock reserved (not permanently reduced)
- [ ] Verify redirect to `/buyer/orders/:orderId`
- [ ] Verify order shows:
  - [ ] Correct quantity
  - [ ] Correct unit price
  - [ ] Correct total price
  - [ ] Status: "Pending Payment"
  - [ ] Seller info (masked - no Discord details)

### Test 4.5: Stock Reservation
- [ ] Listing has stock: 50
- [ ] Buyer A orders 30 units
- [ ] Verify stock: 50, reserved: 30, available: 20
- [ ] Buyer B tries to order 25 units
- [ ] Verify Buyer B can only order max 20 units
- [ ] Buyer B orders 20 units
- [ ] Verify stock: 50, reserved: 50, available: 0
- [ ] Verify listing shows "Out of stock"

### Test 4.6: Buyer Orders View
- [ ] Buyer navigates to `/buyer/orders`
- [ ] Verify orders list displays:
  - [ ] Item title
  - [ ] Quantity
  - [ ] Total price
  - [ ] Status badge
  - [ ] Order date
- [ ] Click on order
- [ ] Verify order detail shows all information
- [ ] Verify seller Discord details NOT visible

---

## ✅ ORDER & STOCK TESTS

### Test 5.1: Concurrent Orders
- [ ] Listing with stock: 100
- [ ] Buyer A orders 60 units (in tab 1)
- [ ] Buyer B orders 50 units (in tab 2) - simultaneously
- [ ] Verify:
  - [ ] One order succeeds
  - [ ] One order fails with "Insufficient stock"
  - [ ] No overselling occurred
  - [ ] Stock correctly reflects one order

### Test 5.2: Order Completion - Stock Reduction
- [ ] Order created with quantity: 10
- [ ] Stock before: 100, reserved: 10, available: 90
- [ ] Admin completes order
- [ ] Verify:
  - [ ] Stock after: 90 (permanently reduced)
  - [ ] Reserved: 0
  - [ ] Available: 90
  - [ ] Order status: "completed"
  - [ ] Seller totalDeals incremented

### Test 5.3: Order Cancellation - Stock Restoration
- [ ] Order created with quantity: 5
- [ ] Stock: 50, reserved: 5, available: 45
- [ ] Order cancelled (or dispute favors buyer)
- [ ] Verify:
  - [ ] Stock: 55 (restored)
  - [ ] Reserved: 0
  - [ ] Available: 55
  - [ ] Order status: "cancelled"

### Test 5.4: Stock Reaches Zero
- [ ] Listing with stock: 1
- [ ] Buyer orders 1 unit
- [ ] Verify stock: 0
- [ ] Verify listing status: "sold"
- [ ] Verify listing hidden from marketplace
- [ ] Seller adds stock: 10
- [ ] Verify listing status: "active"
- [ ] Verify listing appears in marketplace

---

## ✅ MIDDLEMAN TESTS

### Test 6.1: Middleman Assignment
- [ ] Admin navigates to `/admin/orders/:orderId`
- [ ] Admin assigns middleman to order
- [ ] Verify middleman receives notification/order appears
- [ ] Middleman navigates to `/middleman/orders`
- [ ] Verify assigned order appears in list
- [ ] Verify middleman CANNOT see other unassigned orders

### Test 6.2: Middleman Actions
- [ ] Middleman views assigned order
- [ ] Verify can perform:
  - [ ] Mark as Paid
  - [ ] Collect Item
  - [ ] Deliver Item
- [ ] Verify CANNOT:
  - [ ] Edit prices
  - [ ] Change commission
  - [ ] Resolve disputes
  - [ ] Complete order (admin only)

### Test 6.3: Order Status Flow (Middleman)
- [ ] Order status: "pending_payment"
- [ ] Middleman marks as paid
- [ ] Verify status: "paid"
- [ ] Middleman collects item
- [ ] Verify status: "item_collected"
- [ ] Middleman delivers item
- [ ] Verify status: "item_delivered"
- [ ] Admin completes order
- [ ] Verify status: "completed"

### Test 6.4: Middleman Data Access
- [ ] Middleman views order
- [ ] Verify can see:
  - [ ] Buyer Discord details (username, ID)
  - [ ] Seller Discord details (username, ID)
  - [ ] Full order information
- [ ] Verify buyer/seller CANNOT see each other's Discord details

---

## ✅ ADMIN TESTS

### Test 7.1: Admin Dashboard
- [ ] Admin navigates to `/admin/dashboard`
- [ ] Verify displays:
  - [ ] Total users
  - [ ] Total listings
  - [ ] Total orders
  - [ ] Total transactions
  - [ ] Pending seller requests
  - [ ] Open disputes

### Test 7.2: Commission Management
- [ ] Admin navigates to `/admin/settings`
- [ ] Current commission: 20%
- [ ] Change commission to 25%
- [ ] Verify commission updated
- [ ] Seller views dashboard
- [ ] Verify commission notice shows 25%
- [ ] Seller views order
- [ ] Verify commission calculation uses 25%
- [ ] Old orders retain original commission

### Test 7.3: Seller Request Management
- [ ] Admin navigates to `/admin/seller-requests`
- [ ] View pending requests
- [ ] Approve request
- [ ] Verify user role updated to `seller`
- [ ] Verify user can access seller routes
- [ ] Reject request
- [ ] Verify request status: "rejected"
- [ ] Verify user role remains `user`

### Test 7.4: User Management
- [ ] Admin navigates to `/admin/users`
- [ ] View all users
- [ ] Ban user
- [ ] Verify user cannot login
- [ ] Verify banned user gets 403 on API calls
- [ ] Unban user
- [ ] Verify user can login again

### Test 7.5: Order Management
- [ ] Admin navigates to `/admin/orders`
- [ ] View all orders
- [ ] Click on order
- [ ] Verify can:
  - [ ] Assign middleman
  - [ ] Complete order manually
  - [ ] View full order details
  - [ ] View dispute (if exists)
  - [ ] Resolve dispute

### Test 7.6: Audit Logging
- [ ] Admin performs action (e.g., approve seller, ban user)
- [ ] Admin navigates to `/admin/audit-logs`
- [ ] Verify action logged:
  - [ ] Admin ID
  - [ ] Action type
  - [ ] Target type
  - [ ] Target ID
  - [ ] Timestamp
  - [ ] Notes (if applicable)

---

## ✅ DISPUTE TESTS

### Test 8.1: Buyer Raises Dispute
- [ ] Buyer views order (not completed, not cancelled)
- [ ] Click "Raise Dispute"
- [ ] Fill dispute form:
  - [ ] Reason: "Item not delivered"
  - [ ] Description: "Ordered 3 days ago, still waiting"
- [ ] Submit dispute
- [ ] Verify:
  - [ ] Dispute created
  - [ ] Order status: "disputed"
  - [ ] Order actions locked
  - [ ] Dispute visible to buyer

### Test 8.2: Seller Sees Dispute
- [ ] Seller views disputed order
- [ ] Verify can see:
  - [ ] Dispute reason
  - [ ] Dispute description
  - [ ] Dispute status: "open"
  - [ ] Raised by: "Buyer"
  - [ ] Timestamp
- [ ] Verify CANNOT:
  - [ ] Edit dispute
  - [ ] Resolve dispute
  - [ ] Perform order actions

### Test 8.3: Middleman Sees Dispute
- [ ] Middleman views assigned disputed order
- [ ] Verify can see dispute (read-only)
- [ ] Verify all action buttons disabled
- [ ] Verify cannot perform order actions

### Test 8.4: Admin Resolves Dispute
- [ ] Admin navigates to `/admin/disputes`
- [ ] View open disputes
- [ ] Click on dispute
- [ ] Resolve dispute:
  - [ ] Resolution note: "Refunded buyer"
  - [ ] Restore order status: "cancelled"
- [ ] Submit resolution
- [ ] Verify:
  - [ ] Dispute status: "resolved"
  - [ ] Order status: "cancelled"
  - [ ] Stock restored (if order cancelled)
  - [ ] Resolution visible to buyer and seller

### Test 8.5: Dispute Prevents Rating
- [ ] Order has active dispute
- [ ] Buyer tries to rate seller
- [ ] Verify rating NOT allowed
- [ ] Admin resolves dispute
- [ ] Order status: "completed"
- [ ] Buyer can now rate seller

---

## ✅ RATING SYSTEM TESTS

### Test 9.1: Rate Seller (First Time)
- [ ] Order status: "completed"
- [ ] Buyer views order detail
- [ ] Verify "Rate Seller" section appears
- [ ] Select 5 stars
- [ ] Click "Submit Rating"
- [ ] Verify:
  - [ ] Rating submitted
  - [ ] Success message displayed
  - [ ] Rating section shows submitted rating
  - [ ] Rating date displayed
  - [ ] Cannot change rating

### Test 9.2: Rating Updates Seller Stats
- [ ] Seller has: totalDeals: 5, totalRatings: 4, averageRating: 4.5
- [ ] Buyer rates seller: 5 stars
- [ ] Verify:
  - [ ] totalRatings: 5
  - [ ] ratingSum: 22.5 + 5 = 27.5
  - [ ] averageRating: 27.5 / 5 = 5.5 → 5.5 (rounded to 1 decimal)

### Test 9.3: Rating Restrictions
- [ ] Order status: "pending_payment"
- [ ] Verify rating section NOT shown
- [ ] Order status: "cancelled"
- [ ] Verify rating NOT allowed
- [ ] Order status: "disputed"
- [ ] Verify rating NOT allowed
- [ ] Order already rated
- [ ] Verify rating section shows existing rating (read-only)

### Test 9.4: Rating Display
- [ ] Seller with rating: 4.8, 10 ratings, 15 deals
- [ ] Buyer views listing
- [ ] Verify displays: "⭐ 4.8 (10)"
- [ ] Seller with 0 ratings, 5 deals
- [ ] Verify displays: "5 deals completed" and "No ratings yet"
- [ ] Seller with 0 ratings, 0 deals
- [ ] Verify displays: "New Seller"

### Test 9.5: Duplicate Rating Prevention
- [ ] Buyer rates order (5 stars)
- [ ] Buyer tries to rate same order again
- [ ] Verify error: "This order has already been rated"
- [ ] Verify rating unchanged

---

## ✅ SECURITY & EDGE CASES

### Test 10.1: Data Masking
- [ ] Buyer views order
- [ ] Verify seller Discord ID NOT visible
- [ ] Verify seller Discord username NOT visible
- [ ] Seller views order
- [ ] Verify buyer Discord ID NOT visible
- [ ] Verify buyer Discord username NOT visible
- [ ] Middleman views order
- [ ] Verify CAN see buyer and seller Discord details
- [ ] Admin views order
- [ ] Verify CAN see all Discord details

### Test 10.2: Listing Management
- [ ] Seller creates listing
- [ ] Verify seller CANNOT delete listing
- [ ] Verify seller CANNOT re-enable disabled listing
- [ ] Admin disables listing
- [ ] Verify listing hidden from marketplace
- [ ] Seller tries to edit disabled listing
- [ ] Verify appropriate restrictions

### Test 10.3: Invalid API Access
- [ ] Buyer tries to access `/api/auth/seller/orders`
- [ ] Verify 403 Forbidden
- [ ] Seller tries to access `/api/auth/admin/users`
- [ ] Verify 403 Forbidden
- [ ] Unauthenticated user tries API call
- [ ] Verify 401 Unauthorized

### Test 10.4: Input Validation
- [ ] Seller creates listing with:
  - [ ] Negative price → Error
  - [ ] Zero stock → Error (min: 1)
  - [ ] Empty title → Error
  - [ ] Invalid category → Error
- [ ] Buyer orders with:
  - [ ] Quantity > stock → Clamped to max
  - [ ] Quantity = 0 → Error
  - [ ] Negative quantity → Error

### Test 10.5: Stock Edge Cases
- [ ] Listing stock: 0
- [ ] Verify listing status: "sold"
- [ ] Verify listing hidden from marketplace
- [ ] Seller adds stock: 10
- [ ] Verify listing status: "active"
- [ ] Verify listing appears in marketplace
- [ ] Order with quantity: 5, stock: 3
- [ ] Verify order creation fails
- [ ] Verify stock unchanged

---

## ✅ UI & UX TESTS

### Test 11.1: Responsive Design
- [ ] Mobile (< 640px):
  - [ ] Navigation collapses to hamburger menu
  - [ ] Marketplace grid: 1 column
  - [ ] Forms stack vertically
  - [ ] Buttons full-width
- [ ] Tablet (640px - 1024px):
  - [ ] Marketplace grid: 2 columns
  - [ ] Navigation visible
- [ ] Desktop (> 1024px):
  - [ ] Marketplace grid: 3-4 columns
  - [ ] Sidebar navigation
  - [ ] Optimal spacing

### Test 11.2: Loading States
- [ ] Buyer dashboard loads
- [ ] Verify skeleton loaders display
- [ ] Verify smooth transition to content
- [ ] Seller dashboard loads
- [ ] Verify skeleton loaders display

### Test 11.3: Status Badges
- [ ] Verify status badges display correctly:
  - [ ] Pending Payment: Orange
  - [ ] Paid: Blue
  - [ ] Item Collected: Purple
  - [ ] Item Delivered: Green
  - [ ] Completed: Dark Green
  - [ ] Cancelled: Red
  - [ ] Disputed: Red

### Test 11.4: Error Handling
- [ ] Network error occurs
- [ ] Verify error message displayed
- [ ] Verify user-friendly error text
- [ ] Verify retry option (if applicable)
- [ ] Invalid route accessed
- [ ] Verify 404 page displayed

### Test 11.5: Navigation
- [ ] All navigation links work
- [ ] Breadcrumbs display correctly
- [ ] Back button works
- [ ] Role-specific navigation shows correct items

---

## 📊 TEST SUMMARY

### Total Test Cases: 100+
### Critical Path Tests: 50+
### Edge Case Tests: 20+
### Security Tests: 15+
### UI/UX Tests: 15+

---

## 🚨 KNOWN ISSUES / NOTES

- Document any issues found during testing
- Document any workarounds
- Document any limitations

---

## ✅ SIGN-OFF

**Tested By:** _______________  
**Date:** _______________  
**Status:** ⬜ Pass / ⬜ Fail / ⬜ Partial  
**Notes:** _______________

---

## 🔄 CONTINUOUS TESTING

- Run tests after each deployment
- Run tests after major feature additions
- Run tests before production releases
- Monitor error logs for regressions

