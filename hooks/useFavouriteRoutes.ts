import { useState, useEffect, useCallback } from 'react';

export const useFavouriteRoutes = () => {
    const [favourites, setFavourites] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem('favouriteRoutes');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('favouriteRoutes', JSON.stringify(favourites));
        } catch (error) {
            console.error("Could not save favourite routes state:", error);
        }
    }, [favourites]);

    const toggleFavourite = useCallback((routeId: string) => {
        setFavourites(prev => 
            prev.includes(routeId)
                ? prev.filter(id => id !== routeId)
                : [...prev, routeId]
        );
    }, []);
    
    const isFavourite = useCallback((routeId: string) => {
        return favourites.includes(routeId);
    }, [favourites]);

    return { favourites, toggleFavourite, isFavourite };
};
