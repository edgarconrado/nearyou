// services/index.ts
// Exportar todos los servicios desde un solo lugar

export { ZonesService } from './zones.service';
export type { Zone } from './zones.service';

export { CategoriesService } from './categories.service';
export type { Category, CategoryInsert, CategoryUpdate } from './categories.service';

export { BusinessesService } from './businesses.service';
export type {
    Business, BusinessFull, BusinessInsert,
    BusinessUpdate
} from './businesses.service';

export { BusinessHoursService } from './business-hours.service';
export type { BusinessHour, BusinessHourInsert, BusinessHourUpdate } from './business-hours.service';

export { ReviewsService } from './reviews.service';
export type {
    Review,
    ReviewInsert,
    ReviewUpdate, ReviewWithBusiness, ReviewWithUser
} from './reviews.service';

export { FavoritesService } from './favorites.service';
export type {
    Favorite,
    FavoriteInsert,
    FavoriteWithBusiness
} from './favorites.service';

export { OffersService } from './offers.service';
export type {
    Offer,
    OfferInsert,
    OfferUpdate,
    OfferWithBusiness
} from './offers.service';

export { StorageService } from './storage.service';

