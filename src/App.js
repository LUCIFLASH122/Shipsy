import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

function App() {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Sign out the user on every reload
    signOut(auth).then(() => {
      setUser(null); // Clear user state after sign out
    });

    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!user) return <Login onLogin={() => {}} />;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Product Manager</h1>
      <ProductForm
        selectedProduct={selectedProduct}
        clearEdit={() => setSelectedProduct(null)}
      />
      <ProductList onEdit={setSelectedProduct} />
    </div>
  );
}

export default App;
