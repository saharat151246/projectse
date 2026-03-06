import { useState } from "react"

const ProductForm = ({ onSubmit }) => {

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  })

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (

    <form onSubmit={handleSubmit}>

      <input
        name="name"
        placeholder="Product name"
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        type="number"
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        onChange={handleChange}
      />

      <input
        name="stock"
        placeholder="Stock"
        type="number"
        onChange={handleChange}
      />

      <input
        name="image"
        placeholder="Image URL"
        onChange={handleChange}
      />

      <button>Add Product</button>

    </form>

  )

}

export default ProductForm