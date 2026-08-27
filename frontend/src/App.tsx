import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import AuctionsPage from "./pages/AuctionsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
