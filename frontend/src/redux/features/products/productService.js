import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/products/`;

// CREATE A NEW PRODUCT
const createProduct = async (formData) => {
  //we don't use try catch (we will use createAsyncThunk)
  const response = await axios.post(API_URL, formData);
  return response.data;
};

//GET ALL PRODUCTS
const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

//DELETE A PRODUCT
const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}${id}`);
  return response.data;
};

//GET A PRODUCT
const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}${id}`);
  return response.data;
};

//UPDATE A PRODUCT
const updateProduct = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  deleteProduct,
  getProduct,
  updateProduct,
};
export default productService;
