import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });

    return () => unsubscribe();
  }, []);

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  const filtered = products.filter((p) => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {/* Filter + Search */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // 👈 enables responsiveness
          justifyContent: "center",
          gap: "20px",
          marginBottom: "16px",
          width: "100%",
          maxWidth: "900px",
          marginInline: "auto",
        }}
      >

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          style={{
            flex: "1 1 300px", // 👈 responsive width
            padding: "10px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: "220px",
          }}
        >

          <option>All</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Grocery</option>
        </select>

        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          style={{
            flex: "1 1 300px", // 👈 responsive width
            padding: "10px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: "220px",
          }}
        />
      </div>

      {/* Product List */}
      <ul>
        {paginated.map((product) => (
          <li key={product.id}>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
              <button onClick={() => onEdit(product)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filtered.length / pageSize) },
          (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          )
        )}
      </div>
    </>
  );
}
