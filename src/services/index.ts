// services/index.ts
// Exportar todos los servicios desde un solo lugar

import type { Zone } from './zones.service';
import { ZonesService } from './zones.service';

import type { Category, CategoryInsert, CategoryUpdate } from './categories.service';
import { CategoriesService } from './categories.service';

import type {
    Business,
    BusinessFull,
    BusinessInsert,
    BusinessUpdate
} from './businesses.service';
import { BusinessesService } from './businesses.service';

import type {
    Review,
    ReviewInsert,
    ReviewUpdate,
    ReviewWithBusiness,
    ReviewWithUser
} from './reviews.service';
import { ReviewsService } from './reviews.service';

import type {
    Favorite,
    FavoriteInsert,
    FavoriteWithBusiness
} from './favorites.service';
import { FavoritesService } from './favorites.service';

import { StorageService } from './storage.service';

// Re-exportar servicios
export {
    BusinessesService, CategoriesService, FavoritesService, ReviewsService, StorageService, ZonesService
};

// Re-exportar tipos
    export type {
        Business, BusinessFull, BusinessInsert,
        BusinessUpdate, Category,
        CategoryInsert,
        CategoryUpdate, Favorite,
        FavoriteInsert,
        FavoriteWithBusiness, Review,
        ReviewInsert,
        ReviewUpdate, ReviewWithBusiness, ReviewWithUser, Zone
    };
