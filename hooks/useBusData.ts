import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Route, Bus, Stop } from '../types';
import type { Language } from './useLanguage';

// Master list of all stops with bilingual names and accurate map coordinates
const ALL_STOPS = {
  // Sangrur Area
  'sangrur': { en: 'Sangrur', pa: 'ਸੰਗਰੂਰ', position: { x: 48, y: 65 } },
  'patrana': { en: 'Patrana', pa: 'ਪਾਤੜਾਂ', position: { x: 68, y: 70 } },
  'bhawanigarh': { en: 'Bhawanigarh', pa: 'ਭਵਾਨੀਗੜ੍ਹ', position: { x: 60, y: 64 } },
  'dhuri': { en: 'Dhuri', pa: 'ਧੂਰੀ', position: { x: 55, y: 58 } },
  'jakhal': { en: 'Jakhal', pa: 'ਜਾਖਲ', position: { x: 45, y: 75 } },
  'sunam': { en: 'Sunam', pa: 'ਸੁਨਾਮ', position: { x: 42, y: 70 } },
  'lehra': { en: 'Lehra', pa: 'ਲਹਿਰਾ', position: { x: 40, y: 78 } },
  'lehra_mohabbat': { en: 'Lehra Mohabbat', pa: 'ਲਹਿਰਾ ਮੁਹੱਬਤ', position: { x: 38, y: 76 } },
  'arakwas': { en: 'Arakwas', pa: 'ਅਰਕਵਾਸ', position: { x: 45, y: 68 } },
  'nabha': { en: 'Nabha', pa: 'ਨਾਭਾ', position: { x: 65, y: 62 } },
  'samana': { en: 'Samana', pa: 'ਸਮਾਣਾ', position: { x: 72, y: 68 } },
  'sherpur': { en: 'Sherpur', pa: 'ਸ਼ੇਰਪੁਰ', position: { x: 58, y: 52 } },
  'molowal': { en: 'Molowal', pa: 'ਮੋਲੋਵਾਲ', position: { x: 60, y: 55 } },
  'malerkotla': { en: 'Malerkotla', pa: 'ਮਲੇਰਕੋਟਲਾ', position: { x: 59, y: 50 } },
  'khanna': { en: 'Khanna', pa: 'ਖੰਨਾ', position: { x: 62, y: 46 } },
  
  // Patiala & Bathinda Area
  'patiala': { en: 'Patiala', pa: 'ਪਟਿਆਲਾ', position: { x: 75, y: 60 } },
  'bathinda': { en: 'Bathinda', pa: 'ਬਠਿੰਡਾ', position: { x: 32, y: 80 } },
  'abohar': { en: 'Abohar', pa: 'ਅਬੋਹਰ', position: { x: 18, y: 82 } },
  'malout': { en: 'Malout', pa: 'ਮਲੋਟ', position: { x: 22, y: 75 } },
  'fazilka': { en: 'Fazilka', pa: 'ਫਾਜ਼ਿਲਕਾ', position: { x: 12, y: 68 } },

  // Ludhiana Area
  'ludhiana': { en: 'Ludhiana', pa: 'ਲੁਧਿਆਣਾ', position: { x: 55, y: 45 } },
  'raikot': { en: 'Raikot', pa: 'ਰਾਏਕੋਟ', position: { x: 48, y: 52 } },
  'samrala': { en: 'Samrala', pa: 'ਸਮਰਾਲਾ', position: { x: 65, y: 44 } },

  // Jalandhar & Amritsar Area
  'amritsar': { en: 'Amritsar', pa: 'ਅੰਮ੍ਰਿਤਸਰ', position: { x: 30, y: 25 } },
  'tarn_taran': { en: 'Tarn Taran', pa: 'ਤਰਨ ਤਾਰਨ', position: { x: 28, y: 35 } },
  'goindwal': { en: 'Goindwal', pa: 'ਗੋਇੰਦਵਾਲ', position: { x: 35, y: 38 } },
  'khadoor_sahib': { en: 'Khadoor Sahib', pa: 'ਖਡੂਰ ਸਾਹਿਬ', position: { x: 32, y: 37 } },
  'jalandhar': { en: 'Jalandhar', pa: 'ਜਲੰਧਰ', position: { x: 45, y: 40 } },
  'hoshiarpur': { en: 'Hoshiarpur', pa: 'ਹੁਸ਼ਿਆਰਪੁਰ', position: { x: 60, y: 30 } },
  'dasuya': { en: 'Dasuya', pa: 'ਦਸੂਹਾ', position: { x: 55, y: 25 } },
  'mukerian': { en: 'Mukerian', pa: 'ਮੁਕੇਰੀਆਂ', position: { x: 52, y: 22 } },

  // Chandigarh Area
  'chandigarh': { en: 'Chandigarh', pa: 'ਚੰਡੀਗੜ੍ਹ', position: { x: 82, y: 38 } },
  'derabassi': { en: 'Derabassi', pa: 'ਡੇਰਾਬੱਸੀ', position: { x: 70, y: 56 } },
  'zirakpur': { en: 'Zirakpur', pa: 'ਜ਼ੀਰਕਪੁਰ', position: { x: 78, y: 48 } },
  'singhpura': { en: 'Singhpura', pa: 'ਸਿੰਘਪੁਰਾ', position: { x: 74, y: 53 } },
  'bhankharpur': { en: 'Bhankharpur', pa: 'ਭੰਖਰਪੁਰ', position: { x: 72, y: 54 } },
  'kharar': { en: 'Kharar', pa: 'ਖਰੜ', position: { x: 77, y: 42 } },
  'balongi': { en: 'Balongi', pa: 'ਬਲੌਂਗੀ', position: { x: 79, y: 41 } },
  'daun': { en: 'Daun', pa: 'ਦਾਊਂ', position: { x: 78, y: 41.5 } },
  'khizrabad': { en: 'Khizrabad', pa: 'ਖਿਜ਼ਰਾਬਾਦ', position: { x: 75, y: 35 } },
  'mullanpur': { en: 'Mullanpur', pa: 'ਮੁੱਲਾਂਪੁਰ', position: { x: 78, y: 36 } },
  'saketri': { en: 'Saketri', pa: 'ਸਕੇਤੜੀ', position: { x: 85, y: 42 } },
  'manimajra': { en: 'Manimajra', pa: 'ਮਨੀਮਾਜਰਾ', position: { x: 84, y: 40 } },
  'nada_sahib': { en: 'Nada Sahib', pa: 'ਨਾਡਾ ਸਾਹਿਬ', position: { x: 88, y: 45 } },
};

// Master list of all routes, referencing stop IDs
const ALL_ROUTES_DATA = [
  { id: 'route-sr-1', name: { en: 'Sangrur-Patrana', pa: 'ਸੰਗਰੂਰ-ਪਾਤੜਾਂ' }, color: '#fca5a5', stops: ['sangrur', 'bhawanigarh', 'dhuri', 'patrana'] },
  { id: 'route-sr-2', name: { en: 'Sangrur-Jakhal', pa: 'ਸੰਗਰੂਰ-ਜਾਖਲ' }, color: '#93c5fd', stops: ['sangrur', 'sunam', 'lehra', 'jakhal'] },
  { id: 'route-sr-3', name: { en: 'Sangrur-Lehra', pa: 'ਸੰਗਰੂਰ-ਲਹਿਰਾ' }, color: '#86efac', stops: ['sangrur', 'sunam', 'lehra_mohabbat', 'lehra'] },
  { id: 'route-sr-4', name: { en: 'Sangrur-Sunam', pa: 'ਸੰਗਰੂਰ-ਸੁਨਾਮ' }, color: '#fcd34d', stops: ['sangrur', 'dhuri', 'arakwas', 'sunam'] },
  { id: 'route-sr-5', name: { en: 'Sangrur-Nabha', pa: 'ਸੰਗਰੂਰ-ਨਾਭਾ' }, color: '#d8b4fe', stops: ['sangrur', 'samana', 'nabha'] },
  { id: 'route-sr-7', name: { en: 'Malerkotla-Patiala', pa: 'ਮਲੇਰਕੋਟਲਾ-ਪਟਿਆਲਾ' }, color: '#a7f3d0', stops: ['malerkotla', 'khanna', 'nabha', 'patiala'] },
  { id: 'route-chd-2', name: { en: 'Chandigarh-Derabassi', pa: 'ਚੰਡੀਗੜ੍ਹ-ਡੇਰਾਬੱਸੀ' }, color: '#bae6fd', stops: ['chandigarh', 'zirakpur', 'bhankharpur', 'derabassi'] },
  { id: 'route-chd-3', name: { en: 'Chandigarh-Kharar', pa: 'ਚੰਡੀਗੜ੍ਹ-ਖਰੜ' }, color: '#fecaca', stops: ['chandigarh', 'balongi', 'daun', 'kharar'] },
  { id: 'route-pat-2', name: { en: 'Patiala-Bathinda', pa: 'ਪਟਿਆਲਾ-ਬਠਿੰਡਾ' }, color: '#fed7aa', stops: ['patiala', 'sangrur', 'sunam', 'bathinda'] },
  { id: 'route-bat-2', name: { en: 'Bathinda-Abohar', pa: 'ਬਠਿੰਡਾ-ਅਬੋਹਰ' }, color: '#bbf7d0', stops: ['bathinda', 'malout', 'fazilka', 'abohar'] },
  { id: 'route-lud-2', name: { en: 'Ludhiana-Raikot', pa: 'ਲੁਧਿਆਣਾ-ਰਾਏਕੋਟ' }, color: '#e9d5ff', stops: ['ludhiana', 'samrala', 'khanna', 'raikot'] },
  { id: 'route-amr-2', name: { en: 'Amritsar-Tarn Taran', pa: 'ਅੰਮ੍ਰਿਤਸਰ-ਤਰਨ ਤਾਰਨ' }, color: '#fde68a', stops: ['amritsar', 'goindwal', 'khadoor_sahib', 'tarn_taran'] },
  { id: 'route-jal-2', name: { en: 'Jalandhar-Hoshiarpur', pa: 'ਜਲੰਧਰ-ਹੁਸ਼ਿਆਰਪੁਰ' }, color: '#a5f3fc', stops: ['jalandhar', 'dasuya', 'mukerian', 'hoshiarpur'] },
];

const DELAY_REASONS = {
    en: ["Heavy Traffic", "Roadblock", "Mechanical Issue"],
    pa: ["ਭਾਰੀ ਆਵਾਜਾਈ", "ਸੜਕ ਰੋਕ", "ਮਕੈਨੀਕਲ ਸਮੱਸਿਆ"]
};

// Generates the initial state for all buses, one for each route
const generateInitialBuses = (): Bus[] => {
    return ALL_ROUTES_DATA.map((route, index) => ({
        id: `bus-${route.id.split('-')[1]}-${index + 1}`,
        routeId: route.id,
        currentStopIndex: Math.floor(Math.random() * (route.stops.length -1)),
        progressToNextStop: Math.floor(Math.random() * 100),
        direction: Math.random() > 0.5 ? 1 : -1,
    }));
};


export const useBusData = (language: Language) => {
  const routes: Route[] = useMemo(() => {
    return ALL_ROUTES_DATA.map(routeData => ({
        id: routeData.id,
        name: routeData.name[language] || routeData.name['en'],
        color: routeData.color,
        stops: routeData.stops.map(stopId => {
            const stopData = ALL_STOPS[stopId];
            return {
                id: stopId,
                name: stopData[language] || stopData['en'],
                position: stopData.position
            } as Stop
        })
    }))
  }, [language]);
  
  const [buses, setBuses] = useState<Bus[]>(generateInitialBuses());
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const updateBusPositions = useCallback(() => {
    setBuses(prevBuses =>
      prevBuses.map(bus => {
        const route = routes.find(r => r.id === bus.routeId);
        if (!route) return bus;

        let { progressToNextStop, currentStopIndex, direction, delay } = bus;

        if (delay && delay.minutes > 0) {
            progressToNextStop += 1; // Half speed
            if (Math.random() < 0.02) {
                delay.minutes -= 1;
                if (delay.minutes <= 0) delay = undefined;
            }
        } else {
            progressToNextStop += 2; // Normal speed
            if (!delay && Math.random() < 0.005) {
                const reasons = DELAY_REASONS[language] || DELAY_REASONS.en;
                delay = {
                    minutes: Math.floor(Math.random() * 5) + 3, // 3-7 mins
                    reason: reasons[Math.floor(Math.random() * reasons.length)],
                };
            }
        }

        if (progressToNextStop >= 100) {
          progressToNextStop = 0;
          currentStopIndex += direction;

          if (currentStopIndex >= route.stops.length - 1) {
            currentStopIndex = route.stops.length -1;
            direction = -1;
          } else if (currentStopIndex <= 0) {
            currentStopIndex = 0;
            direction = 1;
          }
        }
        return { ...bus, progressToNextStop, currentStopIndex, direction, delay };
      })
    );
    setLastUpdated(Date.now());
  }, [routes, language]);

  useEffect(() => {
    const interval = setInterval(updateBusPositions, 1000);
    return () => clearInterval(interval);
  }, [updateBusPositions]);
  
  const getBusPosition = useCallback((bus: Bus): { x: number; y: number; angle: number } => {
      const route = routes.find(r => r.id === bus.routeId);
      if (!route || !route.stops[bus.currentStopIndex]) return { x: 0, y: 0, angle: 0 };

      const startStop = route.stops[bus.currentStopIndex];
      const nextStopIndex = bus.currentStopIndex + bus.direction;
      const endStop = route.stops[nextStopIndex] || startStop;

      const x = startStop.position.x + (endStop.position.x - startStop.position.x) * (bus.progressToNextStop / 100);
      const y = startStop.position.y + (endStop.position.y - startStop.position.y) * (bus.progressToNextStop / 100);

      const dx = endStop.position.x - startStop.position.x;
      const dy = endStop.position.y - startStop.position.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      return { x, y, angle };
  }, [routes]);

  const getEtaMinutes = useCallback((bus: Bus, stopIndex: number): number => {
    const route = routes.find(r => r.id === bus.routeId);
    if (!route) return 99;

    let eta = 0;
    if (bus.direction === 1) {
      if (stopIndex < bus.currentStopIndex) return -1; // Passed
      if (stopIndex === bus.currentStopIndex && bus.progressToNextStop > 10) return -1; // Essentially passed
      const stopsToGo = stopIndex - bus.currentStopIndex;
      const progressFactor = (100 - bus.progressToNextStop) / 100;
      eta = Math.round(stopsToGo * 5 + progressFactor * 5); // 5 mins per stop
    } else {
      if (stopIndex > bus.currentStopIndex) return -1; // Passed
       if (stopIndex === bus.currentStopIndex && bus.progressToNextStop > 10) return -1; // Essentially passed
      const stopsToGo = bus.currentStopIndex - stopIndex;
      const progressFactor = (100 - bus.progressToNextStop) / 100;
      eta = Math.round(stopsToGo * 5 + progressFactor * 5); // 5 mins per stop
    }
    return eta + (bus.delay?.minutes || 0);
  }, [routes]);
  
  const getTicketPrice = useCallback((route: Route, startStop: Stop, endStop: Stop): number => {
      const BASE_FARE = 10;
      const PRICE_PER_STOP = 5;

      const startIndex = route.stops.findIndex(s => s.id === startStop.id);
      const endIndex = route.stops.findIndex(s => s.id === endStop.id);

      if (startIndex === -1 || endIndex === -1) return 0;

      const stopsTravelled = Math.abs(endIndex - startIndex);
      return BASE_FARE + stopsTravelled * PRICE_PER_STOP;
  }, []);


  return { routes, buses, lastUpdated, getBusPosition, getEtaMinutes, getTicketPrice };
};