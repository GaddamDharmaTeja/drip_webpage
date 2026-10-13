import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { ProductProvider } from './context/ProductContext'
import { About } from './pages/About'
import { Calculator } from './pages/Calculator'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Orders } from './pages/Orders'
import { ProductDetail } from './pages/ProductDetail'
import { Projects } from './pages/Projects'
import { Resources } from './pages/Resources'
import { Shop } from './pages/Shop'
import { Solutions } from './pages/Solutions'

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <OrdersProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="projects" element={<Projects />} />
                <Route path="resources" element={<Resources />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrdersProvider>
      </CartProvider>
    </ProductProvider>
  )
}
