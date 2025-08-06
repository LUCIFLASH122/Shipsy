import { useEffect, useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export default function ProductForm({ selectedProduct, clearEdit }) {
  const isEditing = !!selectedProduct;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Electronics",
    price: "",
    inStock: false,
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        price: selectedProduct.price,
        inStock: selectedProduct.inStock,
      });
    }
  }, [selectedProduct]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, category, price, inStock } = formData;
    setLoading(true);

    try {
      if (isEditing) {
        await updateDoc(doc(db, "products", selectedProduct.id), {
          name,
          description,
          category,
          price: parseFloat(price),
          inStock,
        });
        clearEdit();
      } else {
        await addDoc(collection(db, "products"), {
          name,
          description,
          category,
          price: parseFloat(price),
          inStock,
          createdAt: new Date(),
        });
      }

      setFormData({
        name: "",
        description: "",
        category: "Electronics",
        price: "",
        inStock: false,
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option>Electronics</option>
        <option>Clothing</option>
        <option>Grocery</option>
      </select>

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />

      <div className="checkbox-group">
        <label htmlFor="inStock">InStock?</label>
        <input
          type="checkbox"
          id="inStock"
          checked={formData.inStock}
          onChange={(e) =>
            setFormData({ ...formData, inStock: e.target.checked })
          }
        />
      </div>

      <button type="submit" disabled={loading}>
        {isEditing ? "Update Product" : "Add Product"}
      </button>
      {isEditing && (
        <button type="button" onClick={clearEdit} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      )}
    </form>
  );
}
