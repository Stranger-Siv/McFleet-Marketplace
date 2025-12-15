import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomeRedirect from './HomeRedirect';
import BuyerLayout from '../layouts/BuyerLayout';
import SellerLayout from '../layouts/SellerLayout';
import MiddlemanLayout from '../layouts/MiddlemanLayout';
import AdminLayout from '../layouts/AdminLayout';
import Marketplace from '../pages/buyer/Marketplace';
import ListingDetail from '../pages/buyer/ListingDetail';
import Orders from '../pages/buyer/Orders';
import OrderDetail from '../pages/buyer/OrderDetail';
import BecomeSeller from '../pages/buyer/BecomeSeller';
import SellerDashboard from '../pages/seller/SellerDashboard';
import CreateListing from '../pages/seller/CreateListing';
import MyListings from '../pages/seller/MyListings';
import SellerOrders from '../pages/seller/Orders';
import Transactions from '../pages/seller/Transactions';
import SellerOrderDetail from '../pages/seller/OrderDetail';
import MiddlemanOrders from '../pages/middleman/Orders';
import MiddlemanOrderDetail from '../pages/middleman/OrderDetail';
import AdminDashboard from '../pages/admin/Dashboard';
import SellerRequests from '../pages/admin/SellerRequests';
import Users from '../pages/admin/Users';
import AdminOrders from '../pages/admin/Orders';
import AdminTransactions from '../pages/admin/Transactions';
import Settings from '../pages/admin/Settings';
import Listings from '../pages/admin/Listings';
import AuditLogs from '../pages/admin/AuditLogs';
import Disputes from '../pages/admin/Disputes';
import AdminOrderDetail from '../pages/admin/OrderDetail';
import FAQ from '../pages/FAQ';
import Login from '../pages/Login';
import AuthSuccess from '../pages/AuthSuccess';
import Forbidden from '../pages/Forbidden';
import NotFound from '../pages/NotFound';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/success" element={<AuthSuccess />} />

      <Route
        path="/marketplace"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <BuyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Marketplace />} />
      </Route>

      <Route
        path="/listings/:listingId"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <BuyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ListingDetail />} />
      </Route>

      <Route
        path="/buyer/orders"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <BuyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Orders />} />
        <Route path=":orderId" element={<OrderDetail />} />
      </Route>

      <Route
        path="/buyer/faq"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <BuyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FAQ />} />
      </Route>

      <Route
        path="/become-seller"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <BuyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BecomeSeller />} />
      </Route>

      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="create-listing" element={<CreateListing />} />
        <Route path="listings" element={<MyListings />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="orders/:orderId" element={<SellerOrderDetail />} />
      </Route>

      <Route
        path="/seller/faq"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FAQ />} />
      </Route>

      <Route
        path="/middleman"
        element={
          <ProtectedRoute allowedRoles={['middleman']}>
            <MiddlemanLayout />
          </ProtectedRoute>
        }
      >
        <Route path="orders" element={<MiddlemanOrders />} />
        <Route path="orders/:orderId" element={<MiddlemanOrderDetail />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="seller-requests" element={<SellerRequests />} />
        <Route path="users" element={<Users />} />
        <Route path="listings" element={<Listings />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:orderId" element={<AdminOrderDetail />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

