import React from 'react';
import { Business } from '../../types/types';
import { BusinessCard } from './BusinessCard';

interface BusinessListProps {
    businesses: Business[];
    onBusinessPress: (business: Business) => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({
    businesses,
    onBusinessPress,
}) => {
    return (
        <>
            {businesses.map((business) => (
                <BusinessCard
                    key={business.id}
                    business={business}
                    onPress={() => onBusinessPress(business)}
                />
            ))}
        </>
    );
};