export interface Business {
  id: string | number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  isOpen: boolean;
  image: string;
  description: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  features?: string[];
  gallery?: string[];
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

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  isOwn?: boolean;
}

export interface BusinessHours {
  day: string;
  hours: string;
  isToday: boolean;
}



export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface NewReview {
  rating: number;
  comment: string;
  images: string[];
}