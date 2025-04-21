const baseUrl = "https://api.stg.2025.dwash.cood2.dussur.sa/api";
export const apiEndpoints = {
  LoginInitiate: (number: string | null, language: string | null) =>
    `${baseUrl}/auth/login/initiate?number=${number}&language=${language}`,
  LoginFinalize: (confirmationCode: string | null, number: string | null) =>
    `${baseUrl}/auth/login/finalize?confirmationCode=${confirmationCode}&number=${number}`,
  RegisterInitiate: (number: string | null, language: string | null) =>
    `${baseUrl}/auth/signUp/initiate?number=${number}&language=${language}`,
  RegisterFinalize: (confirmationCode: string | null, number: string | null) =>
    `${baseUrl}/auth/signUp/finalize?confirmationCode=${confirmationCode}&number=${number}`,
  getFreelancers: (size: number) =>
    `${baseUrl}/public/getFreelancers?page=0&size=${size}&type=1`,
  getServices: `${baseUrl}/public/getServices`,
  getProfile: `${baseUrl}/consumer/getProfile`,
  editProfile: `${baseUrl}/consumer/editProfile`,
  getCart: `${baseUrl}/consumer/getCartItems`,
  addToCart: `${baseUrl}/consumer/addToCart`,
  deleteFromCart: `${baseUrl}/consumer/deleteItem`,
  getSlots: `${baseUrl}/consumer/getSlot`,
  validateDiscount: `${baseUrl}/consumer/validateDiscount`,
  makePayment: `${baseUrl}/payment/consumer/card/payment/initiate`,
  getCities: `${baseUrl}/public/cities`,
  getBrandReviews: (id: string | undefined) =>
    `${baseUrl}/public/getReviewsBrand?page=0&size=8&brandId=${id}`,
  getDistrict: (selectedCityId: number) =>
    `${baseUrl}/public/districts?cityId=${selectedCityId}`,
  getOrders: (page: number, pageSize: number) =>
    `${baseUrl}/consumer/getOrders?page=${page - 1}&size=${pageSize}`,
  cancelOrder: (id: number) =>
    `${baseUrl}/consumer/cancelOrder?requestId=${id}`,
  addReview: (id: number) => `${baseUrl}/consumer/addReview?requestId=${id}`,

  //Address Management
  getAddresses: `${baseUrl}/consumer/allAddresses`,
  addAddress: `${baseUrl}/consumer/addAddress`,
  editAddress: (addressId: number) =>
    `${baseUrl}/consumer/editAddress/${addressId}`,
  deleteAddress: (addressId: number) =>
    `${baseUrl}/consumer/deleteAddress/${addressId}`,

  // Car management endpoints
  getAllCars: `${baseUrl}/consumer/allCars`,
  addCar: `${baseUrl}/consumer/addCar`,
  editCar: (carId: number) => `${baseUrl}/consumer/editCar/${carId}`,
  deleteCar: (carId: number) => `${baseUrl}/consumer/deleteCar/${carId}`,

  // Car data endpoints
  getCarBrands: `${baseUrl}/public/carBrand`,
  getCarModels: (brandId: number) =>
    `${baseUrl}/public/carModel?brandId=${brandId}`,

  getCarColor: `${baseUrl}/public/getCarColor`,
};
