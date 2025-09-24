import React, { useState, useMemo, FC, useEffect } from 'react';
import type { Screen, Route, Bus, Stop } from './types';
import { useBusData } from './hooks/useBusData';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import { useLanguage, Language } from './hooks/useLanguage';
import { useFavouriteRoutes } from './hooks/useFavouriteRoutes';
import { useTheme, Theme } from './hooks/useTheme';
import { HomeIcon, RouteIcon, UserIcon, SmsIcon, LocationMarkerIcon, SignalIcon, SearchIcon, BusIcon, StarIcon, PunjabMapIcon, BellIcon, GlobeAltIcon, WifiOffIcon, MoonIcon } from './components/Icons';

// Helper Components defined outside the main App to prevent re-renders

// Generates a smooth curve (cardinal spline) through a set of points for the SVG path
const generateCurvePath = (points: { x: number; y: number }[], tension = 0.4): string => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i > 0 ? i - 1 : 0];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i + 2 < points.length ? points[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
};


// Map Components
const BusOnMap: FC<{
    bus: Bus;
    route?: Route;
    position: { x: number; y: number; angle: number };
    isOffline: boolean;
    getEtaMinutes: (bus: Bus, stopIndex: number) => number;
    selectedRouteId: string | null;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}> = ({ bus, route, position, isOffline, getEtaMinutes, selectedRouteId, t }) => {
    
    const eta = useMemo(() => {
        if (!route) return null;
        const finalStopIndex = bus.direction === 1 ? route.stops.length - 1 : 0;
        const etaMinutes = getEtaMinutes(bus, finalStopIndex);
        return etaMinutes >= 0 ? etaMinutes : null;
    }, [bus, route, getEtaMinutes]);

    const isSelected = selectedRouteId === bus.routeId;
    const busNumber = bus.id.split('-')[1].toUpperCase();

    return (
        <div
            className="absolute transition-all duration-1000 linear"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: isSelected ? 10 : 1
            }}
        >
            <div className={`relative flex flex-col items-center group transition-opacity duration-300 ${isOffline ? 'opacity-50' : ''}`}
                style={{ opacity: selectedRouteId && !isSelected ? 0.4 : 1 }}
            >
                <div 
                    className="relative w-8 h-8 transition-transform duration-500"
                    style={{ 
                        transform: ` translate(-50%, -50%) rotate(${position.angle + 90}deg)`,
                    }}
                 >
                    <BusIcon 
                        className="w-full h-full text-white drop-shadow-lg"
                        style={{ 
                            backgroundColor: route?.color || '#888',
                            padding: '4px',
                            borderRadius: '9999px',
                            border: '2px solid white',
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ transform: `rotate(${-position.angle - 90}deg)` }}>
                        {busNumber}
                    </div>
                </div>
                <div className={`absolute bottom-full mb-2 w-max bg-white text-gray-800 dark:bg-gray-800 dark:text-stone-200 text-xs rounded py-1 px-2 shadow-md transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <p className="font-bold">{route?.name}</p>
                    {bus.delay && <p className="text-red-500 font-semibold">{t('delay_info', { reason: bus.delay.reason })}</p>}
                    {eta !== null ? (
                        <p>{t('map_eta_terminus', { eta })}</p>
                    ) : (
                        <p>{t('map_at_terminus')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StopMarkerOnMap: FC<{ stop: Stop }> = ({ stop }) => (
    <div
        className="absolute"
        style={{
            left: `${stop.position.x}%`,
            top: `${stop.position.y}%`,
            zIndex: 2
        }}
    >
        <div
            className="w-1.5 h-1.5 bg-stone-500 dark:bg-stone-400 rounded-full border border-white dark:border-gray-800"
            style={{ transform: 'translate(-50%, -50%)' }}
        ></div>
        <div
            className="absolute text-stone-600 dark:text-stone-300 text-[8px] font-semibold whitespace-nowrap"
            style={{
                transform: 'translate(4px, -4px)',
                textShadow: '0px 0px 3px white, 0px 0px 3px white, 0px 0px 3px #1c1917, 0px 0px 3px #1c1917',
            }}
        >
            {stop.name}
        </div>
    </div>
);


const BusMap: FC<{
    routes: Route[];
    buses: Bus[];
    getBusPosition: (bus: Bus) => { x: number; y: number; angle: number };
    selectedRouteId: string | null;
    isOffline: boolean;
    getEtaMinutes: (bus: Bus, stopIndex: number) => number;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    theme: Theme;
}> = ({ routes, buses, getBusPosition, selectedRouteId, isOffline, getEtaMinutes, t, theme }) => {
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const allStops = useMemo(() => {
        const stopsMap = new Map<string, Stop>();
        routes.forEach(route => {
            route.stops.forEach(stop => {
                if (!stopsMap.has(stop.name)) {
                    stopsMap.set(stop.name, stop);
                }
            });
        });
        return Array.from(stopsMap.values());
    }, [routes]);

    const CityLabel: FC<{x: number, y: number, name: string}> = ({x, y, name}) => (
         <div className="absolute font-bold text-emerald-900/50 dark:text-emerald-200/50 text-sm" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 0 }}>
            {name}
        </div>
    );
    
    const RoadLabel: FC<{x: number, y: number, name: string, angle?: number}> = ({x, y, name, angle = 0}) => (
         <div className="absolute text-[8px] font-semibold text-emerald-900/40 dark:text-emerald-200/40 tracking-widest uppercase" style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${angle}deg)`, zIndex: 0 }}>
            {name}
        </div>
    );

    return (
        <div className="relative w-full h-full bg-stone-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
             <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}>
                <PunjabMapIcon className="absolute inset-0 w-full h-full object-cover" theme={theme} />
                
                {/* City and Road Labels */}
                <CityLabel x={82} y={38} name="Chandigarh" />
                <CityLabel x={55} y={45} name="Ludhiana" />
                <CityLabel x={48} y={65} name="Sangrur" />
                <CityLabel x={32} y={80} name="Bathinda" />
                <CityLabel x={75} y={60} name="Patiala" />
                <CityLabel x={12} y={68} name="Fazilka" />
                
                <RoadLabel x={68} y={50} name="Chandigarh-Patiala Rd" angle={-30} />
                <RoadLabel x={55} y={55} name="Ludhiana-Sangrur Rd" angle={-15} />
                <RoadLabel x={25} y={78} name="Bathinda-Fazilka Rd" angle={25} />
                <RoadLabel x={68} y={42} name="Ludhiana-Chandigarh Hwy" angle={-10} />


                {allStops.map(stop => <StopMarkerOnMap key={stop.id} stop={stop} />)}

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" >
                    {routes.map(route => {
                        const isSelected = selectedRouteId === route.id;
                        const isAnyRouteSelected = !!selectedRouteId;
                        const pathPoints = route.stops.map(s => s.position);
                        return (
                             <path
                                key={route.id}
                                d={generateCurvePath(pathPoints)}
                                stroke={route.color}
                                strokeWidth={isSelected ? "0.8" : "0.5"}
                                fill="none"
                                className="transition-all duration-300"
                                style={{ opacity: isAnyRouteSelected && !isSelected ? 0.3 : 0.9, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                            />
                        )
                    })}
                </svg>
                {buses.map(bus => {
                    const route = routes.find(r => r.id === bus.routeId);
                    const position = getBusPosition(bus);
                    return <BusOnMap
                                key={bus.id}
                                bus={bus}
                                route={route}
                                position={position}
                                isOffline={isOffline}
                                getEtaMinutes={getEtaMinutes}
                                selectedRouteId={selectedRouteId}
                                t={t}
                            />;
                })}
            </div>
        </div>
    );
};


// Screen Components

const HomeScreen: FC<{
    boardingStop: Stop | null;
    destinationStop: Stop | null;
    setStopSelectorVisible: (type: 'boarding' | 'destination') => void;
    setMapViewVisible: (visible: boolean) => void;
    foundTrip: { route: Route; bus: Bus; eta: number; price: number } | null;
    tripSearchState: 'idle' | 'success' | 'not_found';
    onSearch: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}> = ({ boardingStop, destinationStop, setStopSelectorVisible, setMapViewVisible, foundTrip, tripSearchState, onSearch, t }) => {
    return (
        <div className="p-4 flex flex-col h-full bg-stone-50 dark:bg-gray-800 relative">
            <header className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">{t('home_welcome')}</h1>
                <p className="text-stone-500 dark:text-stone-400 mb-6">{t('home_heading')}</p>
            </header>

            <main className="flex-grow">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-stone-200 dark:border-gray-600 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">{t('home_from')}</label>
                        <button onClick={() => setStopSelectorVisible('boarding')} className="w-full text-left p-3 bg-stone-100 dark:bg-gray-600 rounded-lg truncate hover:bg-stone-200 dark:hover:bg-gray-500 transition-colors text-lg font-semibold text-stone-700 dark:text-stone-300">
                            {boardingStop ? boardingStop.name : t('home_select_boarding')}
                        </button>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">{t('home_to')}</label>
                        <button onClick={() => setStopSelectorVisible('destination')} className="w-full text-left p-3 bg-stone-100 dark:bg-gray-600 rounded-lg truncate hover:bg-stone-200 dark:hover:bg-gray-500 transition-colors text-lg font-semibold text-stone-700 dark:text-stone-300">
                            {destinationStop ? destinationStop.name : t('home_select_destination')}
                        </button>
                    </div>
                </div>

                {tripSearchState === 'success' && foundTrip && (
                    <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/50 border-l-4 border-emerald-500 dark:border-emerald-700 p-4 rounded-r-lg shadow">
                         <div className="flex justify-between items-start">
                           <div>
                             <p className="font-bold text-emerald-800 dark:text-emerald-200">{foundTrip.route.name}</p>
                             <p className="text-emerald-700 dark:text-emerald-300">{t('home_next_bus_in', { stopName: boardingStop?.name })} <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{foundTrip.eta}</span> {t('min_short')}.</p>
                             {foundTrip.bus.delay && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{t('delay_info', { reason: foundTrip.bus.delay.reason })}</p>}
                           </div>
                            <div className="bg-emerald-200 text-emerald-800 dark:bg-emerald-400/30 dark:text-emerald-200 text-xs font-bold px-2 py-1 rounded-full">{foundTrip.route.id.split('-')[1].toUpperCase()}</div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                            <p className="font-semibold text-stone-600 dark:text-stone-300">{t('ticket_price')}:</p>
                            <p className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('rupee_symbol')}{foundTrip.price}</p>
                        </div>
                        <button 
                            onClick={onSearch}
                            className="mt-4 w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-emerald-700 transition-transform transform hover:scale-105"
                        >
                            {t('home_show_route')}
                        </button>
                    </div>
                )}
                 {tripSearchState === 'not_found' && (
                    <div className="mt-6 bg-rose-50 dark:bg-rose-900/50 border-l-4 border-rose-500 dark:border-rose-700 p-4 rounded-r-lg shadow">
                        <p className="font-bold text-rose-800 dark:text-rose-200">{t('home_no_route_found')}</p>
                        <p className="text-sm text-rose-700 dark:text-rose-300">{t('home_no_route_desc')}</p>
                    </div>
                )}
            </main>
            
            <button onClick={() => setMapViewVisible(true)} className="absolute bottom-4 right-4 bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
                <LocationMarkerIcon className="w-6 h-6" />
                <span>{t('home_view_map')}</span>
            </button>
        </div>
    );
};

const LowBandwidthScreen: FC<{
    routes: Route[];
    buses: Bus[];
    getEtaMinutes: (bus: Bus, stopIndex: number) => number;
}> = ({ routes, buses, getEtaMinutes }) => {
    const nextBuses = useMemo(() => {
        return buses.map(bus => {
            const route = routes.find(r => r.id === bus.routeId);
            if (!route) return null;
            const nextStopIndex = bus.currentStopIndex + (bus.direction === 1 && bus.progressToNextStop > 0 ? 1 : 0);
            const nextStop = route.stops[nextStopIndex];
            if (!nextStop) return null;
            const eta = getEtaMinutes(bus, nextStopIndex);
            return {
                busId: bus.id,
                routeName: route.name,
                nextStopName: nextStop.name,
                eta,
            };
        }).filter(Boolean).sort((a,b) => a!.eta - b!.eta);
    }, [buses, routes, getEtaMinutes]);

    return (
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-inner p-4 overflow-y-auto">
            <div className="bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-center font-semibold p-2 rounded-md mb-4">Low Data Mode On</div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-3">Next Arrivals</h2>
            <ul className="space-y-3">
                {nextBuses.map(bus => (
                    <li key={bus!.busId} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <p className="font-bold text-emerald-700 dark:text-emerald-400">{bus!.routeName}</p>
                            <p className="text-sm text-stone-600 dark:text-stone-300">to {bus!.nextStopName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{bus!.eta} min</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const RoutesScreen: FC<{ 
    routes: Route[]; 
    buses: Bus[];
    getEtaMinutes: (bus: Bus, stopIndex: number) => number;
    getTicketPrice: (route: Route, startStop: Stop, endStop: Stop) => number;
    selectedRouteId: string | null;
    setSelectedRouteId: (id: string | null) => void;
    setActiveScreen: (screen: Screen) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    toggleFavourite: (routeId: string) => void;
    isFavourite: (routeId: string) => boolean;
}> = ({ routes, buses, getEtaMinutes, getTicketPrice, selectedRouteId, setSelectedRouteId, setActiveScreen, t, toggleFavourite, isFavourite }) => {
    const [viewingRoute, setViewingRoute] = useState<Route | null>(() => {
        return selectedRouteId ? routes.find(r => r.id === selectedRouteId) || null : null;
    });
    const [boardingStop, setBoardingStop] = useState<Stop | null>(null);
    const [destinationStop, setDestinationStop] = useState<Stop | null>(null);
    const [isSelecting, setIsSelecting] = useState<'boarding' | 'destination' | null>(null);
    const [routeSearchTerm, setRouteSearchTerm] = useState('');

    useEffect(() => {
        if (selectedRouteId) {
            const newRoute = routes.find(r => r.id === selectedRouteId);
            if (newRoute?.id !== viewingRoute?.id) {
                setViewingRoute(newRoute || null);
                setBoardingStop(null);
                setDestinationStop(null);
            }
        } else {
            setViewingRoute(null);
        }
    }, [selectedRouteId, routes, viewingRoute]);


    const handleRouteSelect = (route: Route) => {
        setViewingRoute(route);
        setSelectedRouteId(route.id);
    };
    
    const handleBack = () => {
        setViewingRoute(null);
        setSelectedRouteId(null);
        setBoardingStop(null);
        setDestinationStop(null);
        setIsSelecting(null);
    }

    const handleStopClick = (stop: Stop) => {
        if (!isSelecting || !viewingRoute) return;

        const stopIndex = viewingRoute.stops.findIndex(s => s.id === stop.id);

        if (isSelecting === 'boarding') {
            setBoardingStop(stop);
            const destIndex = destinationStop ? viewingRoute.stops.findIndex(s => s.id === destinationStop.id) : -1;
             if (destinationStop && stopIndex > destIndex) {
                setDestinationStop(null);
            }
        } else { // destination
            setDestinationStop(stop);
            const boardIndex = boardingStop ? viewingRoute.stops.findIndex(s => s.id === boardingStop.id) : -1;
            if (boardingStop && stopIndex < boardIndex) {
                setBoardingStop(null);
            }
        }
        setIsSelecting(null);
    };

    const handleClearSelection = () => {
        setBoardingStop(null);
        setDestinationStop(null);
    };
    
    const filteredRoutes = useMemo(() => {
        const lowercasedTerm = routeSearchTerm.toLowerCase();
        const filtered = routeSearchTerm ? routes.filter(route => 
            route.name.toLowerCase().includes(lowercasedTerm) ||
            route.stops.some(stop => stop.name.toLowerCase().includes(lowercasedTerm))
        ) : routes;

        // Sort by favorite status
        return [...filtered].sort((a, b) => {
            const aIsFav = isFavourite(a.id);
            const bIsFav = isFavourite(b.id);
            if (aIsFav === bIsFav) return 0;
            return aIsFav ? -1 : 1;
        });
    }, [routes, routeSearchTerm, isFavourite]);

    const busOnRoute = useMemo(() =>
        viewingRoute ? buses.find(b => b.routeId === viewingRoute.id) : undefined,
    [buses, viewingRoute]);

    const stopsToDisplay = useMemo(() => {
        if (!viewingRoute) return [];
        if (busOnRoute?.direction === -1) {
            return [...viewingRoute.stops].reverse();
        }
        return viewingRoute.stops;
    }, [viewingRoute, busOnRoute]);
    
    const terminusName = useMemo(() => {
        if (!viewingRoute) return '';
        if (!busOnRoute) return viewingRoute.stops[viewingRoute.stops.length - 1]?.name || '';
        const finalStopIndex = busOnRoute.direction === 1 ? viewingRoute.stops.length - 1 : 0;
        return viewingRoute.stops[finalStopIndex]?.name || '';
    }, [viewingRoute, busOnRoute]);

    const tripPrice = useMemo(() => {
        if (viewingRoute && boardingStop && destinationStop) {
            return getTicketPrice(viewingRoute, boardingStop, destinationStop);
        }
        return null;
    }, [viewingRoute, boardingStop, destinationStop, getTicketPrice]);


    if (viewingRoute) {
        const boardIndex = boardingStop ? viewingRoute.stops.findIndex(s => s.id === boardingStop.id) : -1;
        const destIndex = destinationStop ? viewingRoute.stops.findIndex(s => s.id === destinationStop.id) : -1;

        return (
            <div className="p-4 flex flex-col h-full bg-stone-50 dark:bg-gray-800">
                <header className="mb-4 flex-shrink-0">
                    <button onClick={handleBack} className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">{t('routes_back')}</button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">{viewingRoute.name}</h1>
                            {busOnRoute && <p className="text-md text-stone-500 dark:text-stone-400 font-semibold -mt-1">{t('routes_direction_to', { terminusName })}</p>}
                        </div>
                        <button onClick={() => toggleFavourite(viewingRoute.id)} className="p-2 text-amber-400 hover:text-amber-500">
                             <StarIcon className="w-8 h-8" filled={isFavourite(viewingRoute.id)} />
                        </button>
                    </div>
                </header>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-4 shadow border border-stone-200 dark:border-gray-600 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-3 items-center">
                        <div>
                            <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">{t('routes_boarding')}</label>
                            <button onClick={() => setIsSelecting('boarding')} className="w-full text-left p-2 bg-stone-100 dark:bg-gray-600 rounded-md truncate hover:bg-stone-200 dark:hover:bg-gray-500">
                                {boardingStop ? boardingStop.name : t('routes_select_stop')}
                            </button>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-1">{t('routes_destination')}</label>
                             <button onClick={() => setIsSelecting('destination')} className="w-full text-left p-2 bg-stone-100 dark:bg-gray-600 rounded-md truncate hover:bg-stone-200 dark:hover:bg-gray-500">
                                {destinationStop ? destinationStop.name : t('routes_select_stop')}
                            </button>
                        </div>
                    </div>
                     {(boardingStop || destinationStop) && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-200 dark:border-gray-600">
                            {tripPrice !== null ? (
                                <>
                                    <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">{t('ticket_price')}:</span>
                                    <span className="text-lg font-bold text-stone-800 dark:text-stone-100">{t('rupee_symbol')}{tripPrice}</span>
                                </>
                            ) : <div />}
                            <button onClick={handleClearSelection} className="text-xs text-rose-500 hover:underline">{t('routes_clear_selection')}</button>
                        </div>
                    )}
                </div>
                 {isSelecting && (
                    <div className="bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-center font-semibold p-2 rounded-md mb-4 flex-shrink-0">
                        {t('routes_selecting_stop_banner', { selectionType: t(isSelecting === 'boarding' ? 'routes_boarding' : 'routes_destination') })}
                    </div>
                )}


                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="relative">
                       {stopsToDisplay.map((stop, index) => {
                            const originalIndex = viewingRoute.stops.findIndex(s => s.id === stop.id);
                            const eta = busOnRoute ? getEtaMinutes(busOnRoute, originalIndex) : -1;
                            const isPassed = eta === -1;

                            const tripDirectionIsForward = boardIndex < destIndex;
                            const isSelectedSegment = (boardIndex !== -1 && destIndex !== -1) ?
                                (tripDirectionIsForward ? originalIndex >= boardIndex && originalIndex <= destIndex : originalIndex >= destIndex && originalIndex <= boardIndex)
                                : (originalIndex === boardIndex || originalIndex === destIndex);

                            const isFaded = !isSelectedSegment && (boardIndex !== -1 || destinationStop !== null);
                            
                            const isFirst = index === 0;
                            const isLast = index === stopsToDisplay.length - 1;
                        
                            const busIsHere = busOnRoute && viewingRoute && viewingRoute.stops[busOnRoute.currentStopIndex]?.id === stop.id;

                            return (
                                <li key={stop.id} onClick={() => handleStopClick(stop)}
                                    className={`pl-10 relative flex items-center min-h-[4rem] transition-all duration-300 ${isSelecting ? 'cursor-pointer' : ''} ${isFaded ? 'opacity-40' : ''}`}>
                                    
                                    {!isFirst && <div className="absolute left-4 h-1/2 top-0 w-0.5 bg-stone-300 dark:bg-gray-600"></div>}
                                    {!isLast && <div className="absolute left-4 h-1/2 bottom-0 w-0.5 bg-stone-300 dark:bg-gray-600"></div>}

                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${isPassed ? 'bg-stone-200 dark:bg-gray-700 border-stone-400 dark:border-gray-500' : isSelectedSegment ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-600 dark:border-emerald-400' :'bg-white dark:bg-gray-800 border-stone-400 dark:border-gray-500'}`}>
                                        <div className={`w-2 h-2 rounded-full transition-colors ${isPassed ? 'bg-stone-500' : isSelectedSegment ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-stone-500'}`}></div>
                                    </div>
                                    
                                    {busIsHere && !isLast && busOnRoute && (
                                        <div 
                                            className="absolute left-4 -translate-x-1/2 z-20 transition-all duration-1000 linear" 
                                            style={{ top: `calc(50% + ${busOnRoute.progressToNextStop * 0.32}px)` }}
                                        >
                                            <BusIcon 
                                                className="w-6 h-6 text-white p-0.5 rounded-full shadow-lg"
                                                style={{ backgroundColor: viewingRoute?.color, transform: busOnRoute.direction === 1 ? '' : 'scaleX(-1)' }}
                                            />
                                        </div>
                                    )}

                                    <div className={`flex-grow py-3 transition-colors rounded-lg -ml-2 pl-2 ${isSelecting && 'hover:bg-emerald-50 dark:hover:bg-emerald-900/40'} ${isSelectedSegment ? 'bg-emerald-50 dark:bg-emerald-900/40' : ''}`}>
                                        <p className={`font-semibold ${isPassed ? 'text-stone-500 dark:text-stone-400' : 'text-stone-800 dark:text-stone-200'}`}>{stop.name}</p>
                                    </div>
                                    <div className="pr-2 text-right">
                                        {eta > 0 && <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{eta} {t('min_short')}</span>}
                                        {isPassed && <span className="text-xs text-stone-400 dark:text-stone-500">{t('routes_passed')}</span>}
                                        {eta === 0 && <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{t('routes_due')}</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <footer className="mt-4 flex-shrink-0">
                    <button onClick={() => setActiveScreen('SMS')} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                        {t('routes_subscribe_sms')}
                    </button>
                </footer>
            </div>
        )
    }

    return (
        <div className="p-4 h-full flex flex-col bg-stone-50 dark:bg-gray-800">
            <header className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200 mb-4">{t('routes_all')}</h1>
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder={t('routes_search_placeholder')}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-stone-200 dark:border-gray-600 text-stone-800 dark:text-stone-200 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={routeSearchTerm}
                        onChange={(e) => setRouteSearchTerm(e.target.value)}
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                </div>
            </header>
            <main className="flex-grow overflow-y-auto">
                 <ul className="space-y-4">
                    {filteredRoutes.map(route => (
                        <li key={route.id}>
                            <div className="w-full flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-emerald-900/20 transition-shadow border border-stone-100 dark:border-gray-600">
                                <button onClick={() => handleRouteSelect(route)} className="flex items-center flex-grow text-left">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0" style={{ backgroundColor: route.color }}>
                                        {route.id.split('-')[1].toUpperCase()}
                                    </div>
                                    <span className="text-lg font-semibold text-stone-700 dark:text-stone-300">{route.name}</span>
                                </button>
                                <button onClick={() => toggleFavourite(route.id)} className="p-2 text-amber-400 hover:text-amber-500 ml-2">
                                     <StarIcon className="w-6 h-6" filled={isFavourite(route.id)} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

const SmsFallbackScreen: FC<{t: (key: string) => string}> = ({ t }) => (
    <div className="p-6 text-center flex flex-col items-center justify-center h-full bg-stone-50 dark:bg-gray-800">
        <div className="flex items-center space-x-4 mb-6">
            <SignalIcon className="w-16 h-16 text-emerald-500 dark:text-emerald-400"/>
            <SmsIcon className="w-20 h-20 text-amber-500 dark:text-amber-400"/>
        </div>
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-4">{t('sms_title')}</h1>
        <p className="text-stone-600 dark:text-stone-300 mb-8 max-w-sm">
            {t('sms_description')}
        </p>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-stone-200 dark:border-gray-600">
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-2">{t('sms_send_to')}</p>
            <p className="text-2xl font-mono font-bold text-stone-800 dark:text-stone-200 mb-4">12345</p>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-2">{t('sms_with_message')}</p>
            <p className="text-xl font-mono text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-gray-600 p-3 rounded-md">
                BUS &lt;{t('sms_route_number')}&gt;
            </p>
        </div>
    </div>
);

const ToggleSwitch: FC<{ checked: boolean; onChange: () => void; ariaLabel: string }> = ({ checked, onChange, ariaLabel }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${checked ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-gray-600'}`}
        aria-pressed={checked}
    >
        <span className="sr-only">{ariaLabel}</span>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


const ProfileScreen: FC<{
  isLowBandwidthMode: boolean;
  onToggleLowBandwidthMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
}> = ({ isLowBandwidthMode, onToggleLowBandwidthMode, language, setLanguage, notificationsEnabled, toggleNotifications, theme, toggleTheme, t }) => {
    
    const SettingsRow: FC<{
        icon: React.ReactNode;
        title: string;
        description: string;
        control: React.ReactNode;
    }> = ({ icon, title, description, control }) => (
         <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
                <div className="bg-stone-100 dark:bg-gray-600 p-2 rounded-lg">{icon}</div>
                <div>
                    <h3 className="font-semibold text-stone-800 dark:text-stone-200">{title}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
                </div>
            </div>
            {control}
        </div>
    );

    return (
    <div className="p-4 bg-stone-50 dark:bg-gray-800 h-full overflow-y-auto">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200 mb-6">{t('profile_settings')}</h1>
        
        {/* Account Section */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-stone-200 dark:border-gray-600 mb-8 flex items-center space-x-4">
            <UserIcon className="w-16 h-16 text-stone-300 bg-stone-100 dark:bg-gray-600 dark:text-gray-500 rounded-full p-2"/>
            <div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">{t('profile_guest_user')}</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">{t('profile_account_desc')}</p>
            </div>
        </div>

        {/* Preferences Section */}
        <h2 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 px-2">{t('profile_preferences')}</h2>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-stone-200 dark:border-gray-600 divide-y divide-stone-200 dark:divide-gray-600">
            <SettingsRow 
                icon={<BellIcon className="w-6 h-6 text-stone-600 dark:text-stone-300" />}
                title={t('profile_notifications')}
                description={t('profile_notifications_desc')}
                control={<ToggleSwitch checked={notificationsEnabled} onChange={toggleNotifications} ariaLabel="Toggle Notifications" />}
            />
            <SettingsRow 
                icon={<MoonIcon className="w-6 h-6 text-stone-600 dark:text-stone-300" />}
                title={t('profile_dark_mode')}
                description={t('profile_dark_mode_desc')}
                control={<ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} ariaLabel="Toggle Dark Mode" />}
            />
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                    <div className="bg-stone-100 dark:bg-gray-600 p-2 rounded-lg">
                        <GlobeAltIcon className="w-6 h-6 text-stone-600 dark:text-stone-300" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-stone-800 dark:text-stone-200">{t('profile_language')}</h3>
                    </div>
                </div>
                 <div className="flex space-x-1 bg-stone-200 dark:bg-gray-600 p-1 rounded-full">
                   <button onClick={() => setLanguage('en')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${language === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-stone-600 dark:text-stone-300'}`}>English</button>
                   <button onClick={() => setLanguage('pa')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${language === 'pa' ? 'bg-emerald-600 text-white shadow' : 'text-stone-600 dark:text-stone-300'}`}>ਪੰਜਾਬੀ</button>
                </div>
            </div>
        </div>

        {/* Accessibility Section */}
         <h2 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-8 mb-2 px-2">{t('profile_accessibility')}</h2>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-stone-200 dark:border-gray-600">
             <SettingsRow 
                icon={<WifiOffIcon className="w-6 h-6 text-stone-600 dark:text-stone-300" />}
                title={t('profile_low_bw_mode')}
                description={t('profile_low_bw_desc')}
                control={<ToggleSwitch checked={isLowBandwidthMode} onChange={onToggleLowBandwidthMode} ariaLabel="Toggle Low Bandwidth Mode" />}
            />
        </div>
    </div>
    );
};

const MapScreen: FC<{
    onClose: () => void;
    routes: Route[];
    buses: Bus[];
    getBusPosition: (bus: Bus) => { x: number; y: number; angle: number };
    selectedRouteId: string | null;
    isOffline: boolean;
    getEtaMinutes: (bus: Bus, stopIndex: number) => number;
    lastUpdated: number;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    theme: Theme;
}> = ({ onClose, routes, buses, getBusPosition, selectedRouteId, isOffline, getEtaMinutes, lastUpdated, t, theme }) => {
    return (
        <div className="absolute inset-0 bg-stone-100 dark:bg-gray-900 z-50 flex flex-col">
            <header className="p-4 bg-white dark:bg-gray-700 shadow-md z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">{t('map_live')}</h2>
                 {isOffline && (
                    <div className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {t('map_offline', { time: new Date(lastUpdated).toLocaleTimeString() })}
                    </div>
                )}
                <button onClick={onClose} className="text-stone-500 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white font-bold text-2xl">&times;</button>
            </header>
            <main className="flex-grow p-4">
                 <BusMap 
                    routes={routes} 
                    buses={buses} 
                    getBusPosition={getBusPosition} 
                    selectedRouteId={selectedRouteId} 
                    isOffline={isOffline} 
                    getEtaMinutes={getEtaMinutes} 
                    t={t}
                    theme={theme}
                />
            </main>
        </div>
    );
};

const StopSelectionScreen: FC<{
    title: string;
    stops: Stop[];
    onSelect: (stop: Stop) => void;
    onClose: () => void;
    t: (key: string) => string;
}> = ({ title, stops, onSelect, onClose, t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredStops = useMemo(() => 
        stops.filter(stop => 
            stop.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [stops, searchTerm]);

    return (
        <div className="absolute inset-0 bg-stone-100 dark:bg-gray-900 z-50 flex flex-col">
            <header className="p-4 bg-white dark:bg-gray-700 shadow-md z-10 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">{title}</h2>
                    <button onClick={onClose} className="text-stone-500 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white font-bold text-2xl">&times;</button>
                </div>
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder={t('routes_search_placeholder')}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-stone-200 dark:border-gray-600 text-stone-800 dark:text-stone-200 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                </div>
            </header>
            <main className="flex-grow overflow-y-auto">
                <ul className="divide-y divide-stone-200 dark:divide-gray-700">
                    {filteredStops.map(stop => (
                        <li key={stop.id}>
                            <button onClick={() => onSelect(stop)} className="w-full text-left p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors">
                                <p className="font-semibold text-stone-800 dark:text-stone-200">{stop.name}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

const BottomNav: FC<{ activeScreen: Screen; setActiveScreen: (screen: Screen) => void; t: (key: string) => string }> = ({ activeScreen, setActiveScreen, t }) => {
  const navItems = [
    { id: 'HOME', icon: HomeIcon, label: t('nav_home') },
    { id: 'ROUTES', icon: RouteIcon, label: t('nav_routes') },
    { id: 'SMS', icon: SmsIcon, label: t('nav_sms') },
    { id: 'PROFILE', icon: UserIcon, label: t('nav_profile') },
  ];

  return (
    <nav className="flex justify-around items-center bg-white dark:bg-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)] h-20">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveScreen(item.id as Screen)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeScreen === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500 hover:text-emerald-500 dark:text-stone-400 dark:hover:text-emerald-400'}`}
        >
          <item.icon className="w-7 h-7 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const ScreenRenderer: FC<{
    activeScreen: Screen;
    boardingStop: Stop | null;
    destinationStop: Stop | null;
    setStopSelectorVisible: (type: 'boarding' | 'destination') => void;
    setMapViewVisible: (visible: boolean) => void;
    foundTrip: { route: Route; bus: Bus; eta: number; price: number } | null;
    tripSearchState: 'idle' | 'success' | 'not_found';
    onSearch: () => void;
    routes: Route[];
    buses: Bus[];
    getEtaMinutes: (bus: Bus, stopIndex: number) => number;
    getTicketPrice: (route: Route, startStop: Stop, endStop: Stop) => number;
    selectedRouteId: string | null;
    setSelectedRouteId: (id: string | null) => void;
    setActiveScreen: (screen: Screen) => void;
    isLowBandwidthMode: boolean;
    onToggleLowBandwidthMode: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    notificationsEnabled: boolean;
    toggleNotifications: () => void;
    theme: Theme;
    toggleTheme: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    toggleFavourite: (routeId: string) => void;
    isFavourite: (routeId: string) => boolean;
}> = (props) => {
    switch (props.activeScreen) {
        case 'HOME':
            return props.isLowBandwidthMode ? (
                <LowBandwidthScreen 
                    routes={props.routes} 
                    buses={props.buses} 
                    getEtaMinutes={props.getEtaMinutes} 
                />
            ) : (
                <HomeScreen
                    boardingStop={props.boardingStop}
                    destinationStop={props.destinationStop}
                    setStopSelectorVisible={props.setStopSelectorVisible}
                    setMapViewVisible={props.setMapViewVisible}
                    foundTrip={props.foundTrip}
                    tripSearchState={props.tripSearchState}
                    onSearch={props.onSearch}
                    t={props.t}
                />
            );
        case 'ROUTES':
            return <RoutesScreen 
                        routes={props.routes} 
                        buses={props.buses}
                        getEtaMinutes={props.getEtaMinutes}
                        getTicketPrice={props.getTicketPrice}
                        selectedRouteId={props.selectedRouteId}
                        setSelectedRouteId={props.setSelectedRouteId}
                        setActiveScreen={props.setActiveScreen}
                        t={props.t}
                        toggleFavourite={props.toggleFavourite}
                        isFavourite={props.isFavourite}
                    />;
        case 'SMS':
            return <SmsFallbackScreen t={props.t} />;
        case 'PROFILE':
            return <ProfileScreen 
                isLowBandwidthMode={props.isLowBandwidthMode}
                onToggleLowBandwidthMode={props.onToggleLowBandwidthMode}
                language={props.language}
                setLanguage={props.setLanguage}
                notificationsEnabled={props.notificationsEnabled}
                toggleNotifications={props.toggleNotifications}
                theme={props.theme}
                toggleTheme={props.toggleTheme}
                t={props.t}
            />;
        default:
            return <div>Not Found</div>;
    }
};

// Main App Component
const App: FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('HOME');
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { routes, buses, lastUpdated, getBusPosition, getEtaMinutes, getTicketPrice } = useBusData(language);
    const isOffline = useOfflineStatus();
    const { favourites, toggleFavourite, isFavourite } = useFavouriteRoutes();

    const [isLowBandwidthMode, setLowBandwidthMode] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem('lowBandwidthMode');
            return stored ? JSON.parse(stored) : false;
        } catch { return false; }
    });
    
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem('notificationsEnabled');
            return stored ? JSON.parse(stored) : true;
        } catch { return true; }
    });

    useEffect(() => {
        try {
            localStorage.setItem('lowBandwidthMode', JSON.stringify(isLowBandwidthMode));
        } catch (error) { console.error("Could not save low bandwidth mode state:", error); }
    }, [isLowBandwidthMode]);
    
    useEffect(() => {
        try {
            localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
        } catch (error) { console.error("Could not save notifications state:", error); }
    }, [notificationsEnabled]);
    
    const toggleLowBandwidthMode = () => setLowBandwidthMode(prev => !prev);
    const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

    const [isMapViewVisible, setMapViewVisible] = useState(false);
    const [stopSelector, setStopSelector] = useState<{ visible: boolean; type: 'boarding' | 'destination' }>({ visible: false, type: 'boarding' });
    const [boardingStop, setBoardingStop] = useState<Stop | null>(null);
    const [destinationStop, setDestinationStop] = useState<Stop | null>(null);
    const [foundTrip, setFoundTrip] = useState<{ route: Route, bus: Bus, eta: number, price: number } | null>(null);
    const [tripSearchState, setTripSearchState] = useState<'idle' | 'success' | 'not_found'>('idle');
    
    const allStops = useMemo(() => {
        const stopsMap = new Map<string, Stop>();
        routes.forEach(route => {
            route.stops.forEach(stop => {
                if (!stopsMap.has(stop.id)) {
                    stopsMap.set(stop.id, stop);
                }
            });
        });
        return Array.from(stopsMap.values()).sort((a, b) => a.name.localeCompare(b.name, language === 'pa' ? 'pa-IN' : 'en-US'));
    }, [routes, language]);

    const handleStopSelected = (stop: Stop) => {
        if (stopSelector.type === 'boarding') {
            setBoardingStop(stop);
             if (destinationStop && destinationStop.id === stop.id) setDestinationStop(null);
        } else {
            setDestinationStop(stop);
            if (boardingStop && boardingStop.id === stop.id) setBoardingStop(null);
        }
        setStopSelector({ visible: false, type: 'boarding' });
    };
    
    const handleSearchTrip = () => {
        if (foundTrip) {
            setSelectedRouteId(foundTrip.route.id);
            setActiveScreen('ROUTES');
        }
    };

    useEffect(() => {
        if (!boardingStop || !destinationStop) {
            setFoundTrip(null);
            setTripSearchState('idle');
            return;
        }

        const tripRoute = routes.find(route => 
            route.stops.some(s => s.id === boardingStop.id) && 
            route.stops.some(s => s.id === destinationStop.id)
        );

        if (!tripRoute) {
            setFoundTrip(null);
            setTripSearchState('not_found');
            return;
        }
        
        const boardIndex = tripRoute.stops.findIndex(s => s.id === boardingStop.id);
        const destIndex = tripRoute.stops.findIndex(s => s.id === destinationStop.id);

        if (boardIndex === -1 || destIndex === -1) {
            setFoundTrip(null);
            setTripSearchState('not_found');
            return;
        }

        const isForwardTrip = boardIndex < destIndex;

        const nextBus = buses
            .filter(b => {
                if (b.routeId !== tripRoute.id) return false;
                const busIsGoingCorrectDirection = (isForwardTrip && b.direction === 1) || (!isForwardTrip && b.direction === -1);
                if (!busIsGoingCorrectDirection) return false;
                
                const eta = getEtaMinutes(b, boardIndex);
                if (eta < 0) return false; // Already passed
                
                if (isForwardTrip) {
                    return b.currentStopIndex <= boardIndex;
                } else {
                    return b.currentStopIndex >= boardIndex;
                }
            })
            .sort((a, b) => getEtaMinutes(a, boardIndex) - getEtaMinutes(b, boardIndex))[0];

        if (nextBus) {
            const price = getTicketPrice(tripRoute, boardingStop, destinationStop);
            setFoundTrip({
                route: tripRoute,
                bus: nextBus,
                eta: getEtaMinutes(nextBus, boardIndex),
                price: price
            });
            setTripSearchState('success');
        } else {
            setFoundTrip(null);
            setTripSearchState('not_found');
        }

    }, [boardingStop, destinationStop, routes, buses, getEtaMinutes, getTicketPrice]);

    return (
        <div className="h-screen w-screen max-w-md mx-auto flex flex-col font-sans bg-stone-100 dark:bg-gray-800 shadow-2xl">
            <main className="flex-grow overflow-hidden relative">
                <ScreenRenderer
                    activeScreen={activeScreen}
                    boardingStop={boardingStop}
                    destinationStop={destinationStop}
                    setStopSelectorVisible={(type) => setStopSelector({ visible: true, type })}
                    setMapViewVisible={setMapViewVisible}
                    foundTrip={foundTrip}
                    tripSearchState={tripSearchState}
                    onSearch={handleSearchTrip}
                    routes={routes}
                    buses={buses}
                    getEtaMinutes={getEtaMinutes}
                    getTicketPrice={getTicketPrice}
                    selectedRouteId={selectedRouteId}
                    setSelectedRouteId={setSelectedRouteId}
                    setActiveScreen={setActiveScreen}
                    isLowBandwidthMode={isLowBandwidthMode}
                    onToggleLowBandwidthMode={toggleLowBandwidthMode}
                    language={language}
                    setLanguage={setLanguage}
                    notificationsEnabled={notificationsEnabled}
                    toggleNotifications={toggleNotifications}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    t={t}
                    toggleFavourite={toggleFavourite}
                    isFavourite={isFavourite}
                />
            </main>
            
            {!isMapViewVisible && !stopSelector.visible && (
                <footer className="flex-shrink-0">
                    <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} t={t} />
                </footer>
            )}

            {isMapViewVisible && (
                 <MapScreen 
                    onClose={() => setMapViewVisible(false)}
                    routes={routes}
                    buses={buses}
                    getBusPosition={getBusPosition}
                    selectedRouteId={selectedRouteId}
                    isOffline={isOffline}
                    getEtaMinutes={getEtaMinutes}
                    lastUpdated={lastUpdated}
                    t={t}
                    theme={theme}
                />
            )}

            {stopSelector.visible && (
                <StopSelectionScreen
                    title={stopSelector.type === 'boarding' ? t('home_select_boarding') : t('home_select_destination')}
                    stops={allStops}
                    onSelect={handleStopSelected}
                    onClose={() => setStopSelector({ visible: false, type: 'boarding' })}
                    t={t}
                 />
            )}
        </div>
    );
};

export default App;