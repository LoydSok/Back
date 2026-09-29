export const isEmailValid = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPasswordValid = (password) => {
  if (typeof password !== 'string') return false;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUserData = (data, isUpdate = false) => {
  const { name, email, password } = data;

  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return 'Имя обязательно и должно быть строкой';
    }
  }

  if (!isUpdate || email !== undefined) {
    if (!isEmailValid(email)) {
      return 'Некорректный формат email';
    }
  }

  if (!isUpdate || password !== undefined) {
    if (!isPasswordValid(password)) {
      return 'Пароль должен содержать минимум 8 символов, хотя бы одну букву и цифру';
    }
  }

  return null;
};

export const validateProductData = (data) => {
  const { title, price } = data;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return 'Название товара обязательно и должно быть строкой';
  }
  if (typeof price !== 'number' || price <= 0) {
    return 'Цена должна быть положительным числом';
  }
  return null;
};

export const validateOrderData = (data) => {
  const { userId, productIds, totalPrice } = data;

  if (typeof userId !== 'number') {
    return 'userId обязателен и должен быть числом';
  }
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return 'productIds должен быть непустым массивом';
  }
  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return 'totalPrice должна быть положительным числом';
  }
  return null;
};