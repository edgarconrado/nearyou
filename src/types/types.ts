export interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  isOpen: boolean;
  image: string;
  description: string;
}

export interface Offer {
  id: number;
  businessName: string;
  title: string;
  discount: string;
  image: string;
  validUntil: string;
  category: string;
}