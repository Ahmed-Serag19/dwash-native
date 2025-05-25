// Interface for Freelancer (Service Provider)
export interface Freelancer {
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  brandDescriptionsAr: string | null;
  brandDescriptionsEn: string | null;
  brandLogo: string | null;
  brandBackgroundImage: string | null;
  avgAppraisal: number;
  available: boolean;
}

// Interface for Service
export interface Service {
  avgAppraisal: number;
  serviceId: number;
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  servicesNameAr: string;
  servicesNameEn: string;
  servicesDescriptionsAr: string;
  servicesDescriptionsEn: string;
  servicesPrice: number;
  servicesTypeId: number;
  serviceTypeNameAr: string;
  serviceTypeNameEn: string;
  servicesStatus: number;
  serviceImages: { id: number; imagePath: string }[];
  extraServices: ExtraService[] | null;
}

// Interface for Extra Service
export interface ExtraService {
  id: number;
  extraNameAr: string;
  extraNameEn: string;
  extraDescriptionsAr: string;
  extraDescriptionsEn: string;
  extraPrice: number;
}

export interface UserAddress {
  userAddressId: number;
  cityAr: string;
  cityEn: string;
  districtAr: string;
  districtEn: string;
  latitude: string;
  longitude: string;
}

export interface UserContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  cart: CartItem[] | null;
  getUser: () => Promise<void>;
  logout: () => void;
  getCart: () => Promise<void>;
  getCars: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  cars: Car[];
  loading: boolean;
}

export interface CartItem {
  itemDto: any;
  invoiceId: number;
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  status: string;
  totalAmount: number;
  reviewed: boolean;
  item: {
    invoiceItemId: number;
    invoiceId: number;
    itemNameAr: string;
    itemNameEn: string;
    serviceTypeAr: string;
    serviceTypeEn: string;
    itemPrice: number;
    extras: {
      itemExtraId: number;
      itemExtraNameAr: string;
      itemExtraNameEn: string;
      invoiceItemId: number;
      itemExtraPrice: number;
    }[];
  };
}

export interface City {
  cityId: number;
  cityNameAr: string;
  cityNameEn: string;
}

export interface District {
  districtId: number;
  districtNameAr: string;
  districtNameEn: string;
}

export interface UserAddress {
  userAddressId: number;
  addressTitle: string;
  cityId: number;
  districtId: number;
  latitude: string;
  longitude: string;
  cityAr: string;
  cityEn: string;
  districtAr: string;
  districtEn: string;
}

export interface AddressFormData {
  addressTitle: string;
  cityId: number;
  districtId: number;
  latitude: string;
  longitude: string;
}

interface UserCar {
  carId: number;
  carModelAr: string;
  carModelEn: string;
  carBrandAr: string;
  carBrandEn: string;
  carPlateNo: string;
  color?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  nameAr: string;
  nameEn: string;
  userType: string;
  status: number;
  agreementAccept: number;
  userAddressDto: UserAddress[];
  userCarDto: UserCar[];
}

export interface CarBrand {
  carBrandId: number;
  brandAr: string;
  brandEn: string;
}

export interface CarModel {
  carModelId: number;
  modelAr: string;
  modelEn: string;
}

export interface Car {
  carColorId: number;
  carId: number;
  carBrandId?: number;
  carModelId?: number;
  carBrandAr?: string;
  carBrandEn?: string;
  carModelAr?: string;
  carModelEn?: string;
  carModel: string;
  carColorAr: string;
  carColorEn: string;
  carPlateNo: string;
}

export interface CarFormData {
  carId?: number;
  carBrandId?: number;
  carModelId?: number;
  carModel: string;
  carColor: string;
  carPlateNo: string;
}
export interface Advertisement {
  advertisementId: number;
  advertisementTitle: string;
  advertisementDescription: string;
  advertisementStartDate: string;
  advertisementEndDate: string;
  advertisementImages: AdvertisementImage[] | null;
}
export interface AdvertisementImage {
  imageId: number;
  imagePath: string;
}
export interface OrderData {
  invoiceId: number;
  brandNameAr: string;
  brandNameEn: string;
  userPhoneNumber: string | null;
  fromTime: string | null;
  timeTo: string | null;
  statusName: string;
  reviewed: boolean;
  reservationDate: string;
  itemDto: {
    itemNameAr: string;
    itemNameEn: string;
    serviceTypeAr: string;
    serviceTypeEn: string;
    itemPrice: number;
    itemExtraDtos: Array<{
      itemExtraNameAr: string;
      itemExtraNameEn: string;
      itemExtraPrice: number;
    }>;
  };
  totalAmount: number;
  request: {
    id: number;
    statusName: string;
  };
}
