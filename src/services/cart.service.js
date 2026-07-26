const CartModel = require('../models/cart.model');
const ProdukModel = require('../models/produk.model');
const ApiError = require('../utils/ApiError');

const getCart = async (userId) => {
  const cartItems = await CartModel.findByUserId(userId);
  
  let total = 0;
  const items = cartItems.map(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    return {
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      subtotal
    };
  });

  return { items, total };
};

const addItem = async (userId, productId, quantity) => {
  const product = await ProdukModel.findById(productId);
  
  if (!product) {
    throw new ApiError(404, 'Produk tidak ditemukan');
  }

  if (product.stok < quantity) {
    throw new ApiError(400, 'Stok produk tidak mencukupi');
  }

  const existingItem = await CartModel.findByUserAndProduct(userId, productId);
  
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    
    if (product.stok < newQuantity) {
      throw new ApiError(400, 'Stok produk tidak mencukupi');
    }
    
    return await CartModel.updateQuantity(existingItem.id, newQuantity);
  }

  return await CartModel.create(userId, productId, quantity);
};

const updateQuantity = async (userId, itemId, quantity) => {
  const cartItem = await CartModel.findById(itemId);
  
  if (!cartItem) {
    throw new ApiError(404, 'Item tidak ditemukan di cart');
  }

  if (cartItem.userId !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke item ini');
  }

  const product = await ProdukModel.findById(cartItem.productId);
  
  if (!product) {
    throw new ApiError(404, 'Produk tidak ditemukan');
  }

  if (product.stok < quantity) {
    throw new ApiError(400, 'Stok produk tidak mencukupi');
  }

  return await CartModel.updateQuantity(itemId, quantity);
};

const deleteItem = async (userId, itemId) => {
  const cartItem = await CartModel.findById(itemId);
  
  if (!cartItem) {
    throw new ApiError(404, 'Item tidak ditemukan di cart');
  }

  if (cartItem.userId !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke item ini');
  }

  await CartModel.deleteById(itemId);
};

const clearCart = async (userId) => {
  await CartModel.deleteByUserId(userId);
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  deleteItem,
  clearCart
};
