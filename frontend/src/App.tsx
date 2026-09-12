import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import AuctionsPage from "./pages/AuctionsPage";
import SearchPage from "./pages/SearchPage";
import SellerPage from "./pages/SellerPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import SellerListingsPage from "./pages/SellerListingsPage";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/products/:productId" element={<ProductPage />} />

          <Route path="/sellers/:sellerName" element={<SellerPage />} />

          <Route path="/seller/listings" element={<SellerListingsPage />} />

          <Route path="/seller/listings/new" element={<CreateListingPage />} />

          <Route
            path="/seller/listings/:productId/edit"
            element={<EditListingPage />}
          />

          <Route path="/categories" element={<CategoriesPage />} />

          <Route path="/auctions" element={<AuctionsPage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/favorites" element={<FavoritesPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/account" element={<AccountPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/order-success" element={<OrderSuccessPage />} />

          <Route path="/orders" element={<OrdersPage />} />

          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
