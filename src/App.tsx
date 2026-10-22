import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
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
import { Account } from './pages/Account'
import { Learn } from './pages/Learn'
import { Profile } from './pages/Profile'
import { SignIn } from './pages/SignIn'

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AuthProvider>
          <OrdersProvider>
            <BrowserRouter>
              <Routes>
                <Route path="sign-in" element={<SignIn />} />
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
                <Route path="my-farm" element={<Account />} />
                <Route path="profile" element={<Profile />} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="projects" element={<Projects />} />
                <Route path="resources" element={<Resources />} />
                <Route path="learn" element={<Learn />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              </Routes>
            </BrowserRouter>
          </OrdersProvider>
        </AuthProvider>
      </CartProvider>
    </ProductProvider>
  )
}
