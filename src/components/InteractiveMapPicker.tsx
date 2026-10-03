import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  LocateFixed, 
  ExternalLink, 
  Loader2, 
  Check, 
  Search,
  Layers, 
  Info,
  Maximize2,
  Compass,
  Copy,
  Navigation2,
  Crosshair,
  Sparkles,
  Map as MapIcon
} from 'lucide-react';

interface InteractiveMapPickerProps {
  initialLat?: string | number;
  initialLng?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  onLocationChange?: (lat: string, lng: string) => void;
  onLocationSelect?: (lat: number | string, lng: number | string, address?: string) => void;
  readOnly?: boolean;
}

// Default center: Tangerang Aetra Operating Area (Curug / Cikupa)
const DEFAULT_LAT = -6.2366;
const DEFAULT_LNG = 106.5621;

const QUICK_AREAS = [
  { name: 'Cikupa', lat: -6.2238, lng: 106.5284 },
  { name: 'Pasar Kemis', lat: -6.1558, lng: 106.5369 },
  { name: 'Sepatan', lat: -6.1158, lng: 106.5742 },
  { name: 'Balaraja', lat: -6.1963, lng: 106.4578 },
  { name: 'Curug (Pusat Aetra)', lat: -6.2625, lng: 106.5647 },
  { name: 'Sindang Jaya', lat: -6.1772, lng: 106.5186 },
  { name: 'Jayanti', lat: -6.1945, lng: 106.4112 },
  { name: 'Rajeg', lat: -6.1342, lng: 106.5076 },
];

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  initialLat,
  initialLng,
  latitude,
  longitude,
  onLocationChange,
  onLocationSelect,
  readOnly = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const effectiveLat = latitude ?? initialLat;
  const effectiveLng = longitude ?? initialLng;
  const parsedLat = effectiveLat ? parseFloat(String(effectiveLat)) : DEFAULT_LAT;
  const parsedLng = effectiveLng ? parseFloat(String(effectiveLng)) : DEFAULT_LNG;

  const [currentLat, setCurrentLat] = useState<number>(!isNaN(parsedLat) && parsedLat !== 0 ? parsedLat : DEFAULT_LAT);
  const [currentLng, setCurrentLng] = useState<number>(!isNaN(parsedLng) && parsedLng !== 0 ? parsedLng : DEFAULT_LNG);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const [statusNote, setStatusNote] = useState<string>('Geser pin merah atau klik pada peta untuk menentukan posisi meter air');
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Modern Precision Google Maps Pin Marker
  const createGooglePinIcon = () => {
    return L.divIcon({
      className: 'custom-modern-google-pin',
      html: `
        <div style="position: relative; width: 48px; height: 58px; display: flex; align-items: center; justify-content: center; cursor: grab;">
          <!-- Precision Ground Radar Target -->
          <div style="position: absolute; bottom: 1px; width: 24px; height: 10px; background: rgba(0, 93, 170, 0.45); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; bottom: 2px; width: 14px; height: 6px; background: rgba(15, 23, 42, 0.5); border-radius: 50%; filter: blur(1px);"></div>
          
          <!-- Modern Google Maps 3D Pin -->
          <svg viewBox="0 0 384 512" width="40" height="50" style="filter: drop-shadow(0 8px 12px rgba(0,0,0,0.35)); transform: translateY(-4px);">
            <defs>
              <linearGradient id="pinRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#EA4335" />
                <stop offset="70%" stop-color="#D93025" />
                <stop offset="100%" stop-color="#B31412" />
              </linearGradient>
              <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
              </filter>
            </defs>
            <path fill="url(#pinRedGrad)" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            <circle cx="192" cy="192" r="76" fill="#FFFFFF"/>
            <circle cx="192" cy="192" r="50" fill="#005DAA"/>
            <circle cx="192" cy="192" r="22" fill="#FFFFFF"/>
            <circle cx="192" cy="192" r="10" fill="#F37021"/>
          </svg>
        </div>
      `,
      iconSize: [48, 58],
      iconAnchor: [24, 56],
      popupAnchor: [0, -52],
    });
  };

  // Initialize Map with Google Map-like smooth behavior
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const lat = !isNaN(parsedLat) && parsedLat !== 0 ? parsedLat : DEFAULT_LAT;
    const lng = !isNaN(parsedLng) && parsedLng !== 0 ? parsedLng : DEFAULT_LNG;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false, // Custom placed zoom controls
      attributionControl: false,
    });

    // Modern Crisp Tile Layers (CartoDB Voyager: modern Apple Maps / Google Maps look)
    const voyagerLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    });

    voyagerLayer.addTo(map);

    // Add Draggable Marker
    const marker = L.marker([lat, lng], {
      icon: createGooglePinIcon(),
      draggable: !readOnly,
      title: 'Titik Pemasangan Water Meter Aetra',
    }).addTo(map);

    // Dragend Handler
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const newLat = parseFloat(position.lat.toFixed(6));
      const newLng = parseFloat(position.lng.toFixed(6));
      setCurrentLat(newLat);
      setCurrentLng(newLng);
      if (onLocationChange) onLocationChange(String(newLat), String(newLng));
      if (onLocationSelect) onLocationSelect(newLat, newLng);
      setStatusNote(`Titik koordinat: ${newLat}, ${newLng}`);
    });

    // Map Click Handler
    if (!readOnly) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(6));
        const newLng = parseFloat(e.latlng.lng.toFixed(6));
        marker.setLatLng([newLat, newLng]);
        setCurrentLat(newLat);
        setCurrentLng(newLng);
        if (onLocationChange) onLocationChange(String(newLat), String(newLng));
        if (onLocationSelect) onLocationSelect(newLat, newLng);
        setStatusNote(`Pin dipindahkan: ${newLat}, ${newLng}`);
      });
    }

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync external prop updates
  useEffect(() => {
    if (initialLat && initialLng && markerRef.current && mapInstanceRef.current) {
      const pLat = parseFloat(String(initialLat));
      const pLng = parseFloat(String(initialLng));
      if (!isNaN(pLat) && !isNaN(pLng) && pLat !== 0 && pLng !== 0) {
        if (Math.abs(pLat - currentLat) > 0.0001 || Math.abs(pLng - currentLng) > 0.0001) {
          setCurrentLat(pLat);
          setCurrentLng(pLng);
          markerRef.current.setLatLng([pLat, pLng]);
          mapInstanceRef.current.panTo([pLat, pLng]);
        }
      }
    }
  }, [initialLat, initialLng]);

  // Handle Layer Toggle
  const toggleLayer = (layer: 'streets' | 'satellite') => {
    if (!mapInstanceRef.current) return;
    setMapLayer(layer);

    mapInstanceRef.current.eachLayer((l) => {
      if (l instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(l);
      }
    });

    if (layer === 'streets') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
      }).addTo(mapInstanceRef.current);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }
  };

  // Jump to specific area
  const jumpTo = (lat: number, lng: number, label: string) => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
    markerRef.current.setLatLng([lat, lng]);
    setCurrentLat(lat);
    setCurrentLng(lng);
    if (onLocationChange) onLocationChange(String(lat), String(lng));
    if (onLocationSelect) onLocationSelect(lat, lng, label);
    setStatusNote(`Peta diarahkan ke wilayah ${label}`);
  };

  // Search Address / Landmark via Geocoding
  const handleSearchAddress = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusNote(`Mencari lokasi "${searchQuery}"...`);

    try {
      const query = encodeURIComponent(`${searchQuery}, Tangerang, Banten, Indonesia`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        const found = data[0];
        const lat = parseFloat(found.lat);
        const lng = parseFloat(found.lon);
        jumpTo(lat, lng, found.display_name.split(',')[0]);
        setStatusNote(`Lokasi ditemukan: ${found.display_name.split(',')[0]}`);
      } else {
        setStatusNote(`Lokasi "${searchQuery}" tidak ditemukan. Coba geser pin manual pada peta.`);
      }
    } catch {
      setStatusNote('Pencarian online sedang sibuk. Silakan geser pin langsung pada peta.');
    } finally {
      setIsSearching(false);
    }
  };

  // Detect GPS Location
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setStatusNote('Browser tidak mendukung deteksi GPS otomatis.');
      return;
    }
    setIsLocating(true);
    setStatusNote('Mendeteksi sinyal GPS perangkat Anda...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        jumpTo(lat, lng, 'Lokasi GPS Anda');
        setStatusNote(`Berhasil mendeteksi GPS: ${lat}, ${lng}`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS error:', err);
        setStatusNote('GPS tidak dapat diakses. Silakan geser pin manual pada peta.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCopyCoordinates = () => {
    const text = `${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`;
    navigator.clipboard?.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm transition hover:shadow-md">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#005DAA] to-[#003868] text-white flex items-center justify-center shadow-md shrink-0">
            <Compass className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Peta Interaktif Google Maps (Titik Pasang)</span>
              <span className="text-[10px] bg-blue-100 text-[#005DAA] font-bold px-2 py-0.2 rounded-full">
                GPS Akurat
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Klik peta atau geser pin merah tepat di gerbang/halaman lokasi pipa meter air dipasang.
            </p>
          </div>
        </div>

        {/* Layer Switcher & GPS Detector */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => toggleLayer('streets')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                mapLayer === 'streets'
                  ? 'bg-white text-[#005DAA] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta Jalan</span>
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('satellite')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                mapLayer === 'satellite'
                  ? 'bg-white text-[#005DAA] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Satelit</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isLocating || readOnly}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#005DAA] hover:bg-[#004A88] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/15 transition disabled:opacity-50 cursor-pointer"
            title="Deteksi posisi GPS perangkat saya saat ini"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mencari GPS...</span>
              </>
            ) : (
              <>
                <LocateFixed className="w-3.5 h-3.5 text-cyan-200" />
                <span>GPS Saya</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Address Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchAddress(e);
              }
            }}
            placeholder="Cari jalan, nama perumahan, kelurahan, atau patokan di Tangerang..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden transition"
          />
        </div>
        <button
          type="button"
          onClick={(e) => handleSearchAddress(e)}
          disabled={isSearching}
          className="px-5 py-2.5 bg-slate-100 hover:bg-blue-50 hover:text-[#005DAA] hover:border-blue-300 border border-slate-300 text-slate-800 text-xs font-bold rounded-2xl transition cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#005DAA]" />
          ) : (
            <Search className="w-4 h-4 text-slate-600" />
          )}
          <span>Cari Titik</span>
        </button>
      </div>

      {/* Quick Jump Badges for Aetra Service Areas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold text-slate-600 no-scrollbar">
        <span className="text-slate-400 shrink-0 text-[10px] uppercase font-bold tracking-wider">Wilayah Cepat:</span>
        {QUICK_AREAS.map((a) => (
          <button
            key={a.name}
            type="button"
            onClick={() => jumpTo(a.lat, a.lng, a.name)}
            className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-blue-50 hover:text-[#005DAA] hover:border-blue-300 border border-slate-200 shrink-0 transition cursor-pointer shadow-2xs text-[11px]"
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Instruction / Status Banner */}
        <div className="absolute top-3 left-3 right-3 z-500 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl flex items-center justify-between gap-3 max-w-lg mx-auto border border-white/10">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate font-medium">{statusNote}</span>
            </div>
            <span className="text-[11px] text-amber-300 font-mono font-bold shrink-0">
              {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Zoom Controls Custom Overlay */}
        <div className="absolute bottom-4 left-3 z-500 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-base border border-slate-200 transition cursor-pointer"
            title="Perbesar Peta"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-base border border-slate-200 transition cursor-pointer"
            title="Perkecil Peta"
          >
            &minus;
          </button>
        </div>

        {/* External Google Maps Button */}
        <div className="absolute bottom-4 right-3 z-500">
          <a
            href={`https://www.google.com/maps?q=${currentLat},${currentLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/95 hover:bg-white text-[#005DAA] hover:text-blue-900 rounded-2xl text-xs font-bold shadow-lg border border-slate-200 transition backdrop-blur-xs"
            title="Buka titik koordinat ini langsung di Google Maps"
          >
            <span>Buka Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Synchronized Latitude & Longitude Precision Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Garis Lintang (Latitude):
            </span>
            <span className="font-mono font-black text-sm text-slate-900 block mt-0.5">
              {currentLat.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terhubung ke Formulir</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Garis Bujur (Longitude):
            </span>
            <span className="font-mono font-black text-sm text-slate-900 block mt-0.5">
              {currentLng.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terhubung ke Formulir</span>
          </div>
        </div>
      </div>
    </div>
  );
};
