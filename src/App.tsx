import { StoreProvider } from './store'
import Auth from './pages/Auth'

export default function App() {
  return (
    <StoreProvider>
      <Auth />
    </StoreProvider>
  )
}
