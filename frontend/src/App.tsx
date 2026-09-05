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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/products/:productId" element={<ProductPage />} />

          <Route path="/sellers/:sellerName" element={<SellerPage />} />

          <Route path="/categories" element={<CategoriesPage />} />

          <Route path="/auctions" element={<AuctionsPage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/favorites" element={<FavoritesPage />} />

          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
