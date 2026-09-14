import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/global.css";
import App from "./App.tsx";
import { CartProvider } from "./features/cart/CartProvider";
import { FavoritesProvider } from "./features/favorites/FavoritesProvider";
import { OrdersProvider } from "./features/orders/OrdersProvider";
import { ProductsProvider } from "./features/products/ProductsProvider";
import { AuthProvider } from "./features/auth/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <FavoritesProvider>
          <CartProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </CartProvider>
        </FavoritesProvider>
      </ProductsProvider>
    </AuthProvider>
  </StrictMode>,
);
