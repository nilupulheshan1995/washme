export type StoreService = {
  name: string;
  description: string;
  durationMinutes: number;
  priceLkr: number;
};

export type Store = {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  address: string;
  hours: string;
  instantBookingEnabled: boolean;
  heroImageUrl: string;
  galleryImageUrls: string[];
  googleMapsUrl: string;
  slotWindow: {
    startHour: number;
    endHour: number;
  };
  closedWeekdays: number[];
  location: {
    lat: number;
    lng: number;
  };
  services: StoreService[];
};

const stores: Store[] = [
  {
    id: "store_1",
    slug: "speed-jet-nugegoda",
    name: "Speed Jet Car Spa",
    city: "Nugegoda",
    district: "Colombo",
    address: "102 High Level Rd, Nugegoda",
    hours: "Daily 7:00 AM - 8:00 PM",
    instantBookingEnabled: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=1800&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    ],
    googleMapsUrl: "https://maps.google.com/?q=102+High+Level+Rd,+Nugegoda",
    slotWindow: { startHour: 7, endHour: 20 },
    closedWeekdays: [],
    location: { lat: 6.8649, lng: 79.8997 },
    services: [
      {
        name: "Express Exterior Wash",
        description: "Foam wash, pressure rinse, and microfiber dry.",
        durationMinutes: 25,
        priceLkr: 2800,
      },
      {
        name: "Interior + Exterior Detail",
        description: "Deep vacuum, dashboard clean, glass polish, and tire shine.",
        durationMinutes: 55,
        priceLkr: 5200,
      },
      {
        name: "SUV Premium Treatment",
        description: "Wheel arch clean, wax coat, and odor neutralization.",
        durationMinutes: 75,
        priceLkr: 6800,
      },
    ],
  },
  {
    id: "store_2",
    slug: "aqua-shine-kottawa",
    name: "Aqua Shine Auto Wash",
    city: "Kottawa",
    district: "Colombo",
    address: "189 Kottawa Rd, Pannipitiya",
    hours: "Daily 8:00 AM - 9:00 PM",
    instantBookingEnabled: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80",
    ],
    googleMapsUrl: "https://maps.google.com/?q=189+Kottawa+Rd,+Pannipitiya",
    slotWindow: { startHour: 8, endHour: 21 },
    closedWeekdays: [],
    location: { lat: 6.8392, lng: 79.9675 },
    services: [
      {
        name: "Quick Wash",
        description: "Fast wash for busy weekday schedules.",
        durationMinutes: 20,
        priceLkr: 2400,
      },
      {
        name: "Family Sedan Full Clean",
        description: "Exterior foam, interior wipe-down, and mat wash.",
        durationMinutes: 50,
        priceLkr: 4600,
      },
      {
        name: "Wax Protection Pack",
        description: "Hand wax finish for longer paint protection.",
        durationMinutes: 65,
        priceLkr: 6200,
      },
    ],
  },
  {
    id: "store_3",
    slug: "city-suds-galle-face",
    name: "City Suds Garage",
    city: "Colombo 03",
    district: "Colombo",
    address: "27 Marine Dr, Galle Face",
    hours: "Mon-Sat 6:30 AM - 10:00 PM",
    instantBookingEnabled: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1800&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1200&q=80",
    ],
    googleMapsUrl: "https://maps.google.com/?q=27+Marine+Dr,+Galle+Face,+Colombo",
    slotWindow: { startHour: 7, endHour: 22 },
    closedWeekdays: [0],
    location: { lat: 6.9155, lng: 79.8467 },
    services: [
      {
        name: "City Express Wash",
        description: "Urban quick clean with touch-free rinse.",
        durationMinutes: 18,
        priceLkr: 2600,
      },
      {
        name: "Business Class Detail",
        description: "Perfect for office commuters and ride-share vehicles.",
        durationMinutes: 45,
        priceLkr: 5100,
      },
      {
        name: "Ceramic Top-Up",
        description: "Maintenance layer for coated vehicles.",
        durationMinutes: 70,
        priceLkr: 8500,
      },
    ],
  },
  {
    id: "store_4",
    slug: "hill-spark-kandy",
    name: "Hill Spark Car Studio",
    city: "Kandy",
    district: "Kandy",
    address: "14 Peradeniya Rd, Kandy",
    hours: "Daily 7:30 AM - 7:00 PM",
    instantBookingEnabled: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
    ],
    googleMapsUrl: "https://maps.google.com/?q=14+Peradeniya+Rd,+Kandy",
    slotWindow: { startHour: 8, endHour: 19 },
    closedWeekdays: [],
    location: { lat: 7.2906, lng: 80.6337 },
    services: [
      {
        name: "Mountain Dust Clean",
        description: "Specialized cleanup for hill-country road dust.",
        durationMinutes: 35,
        priceLkr: 3200,
      },
      {
        name: "Complete Cabin Refresh",
        description: "Fabric treatment and anti-fog interior wipe.",
        durationMinutes: 60,
        priceLkr: 5600,
      },
      {
        name: "Weekend Shine Package",
        description: "Exterior polish and gloss sealant.",
        durationMinutes: 80,
        priceLkr: 7100,
      },
    ],
  },
  {
    id: "store_5",
    slug: "south-bay-shine-galle",
    name: "South Bay Shine Hub",
    city: "Galle",
    district: "Galle",
    address: "88 Matara Rd, Galle",
    hours: "Daily 8:00 AM - 8:00 PM",
    instantBookingEnabled: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1800&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223523-491a9b903fa1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    ],
    googleMapsUrl: "https://maps.google.com/?q=88+Matara+Rd,+Galle",
    slotWindow: { startHour: 8, endHour: 20 },
    closedWeekdays: [],
    location: { lat: 6.0535, lng: 80.221 },
    services: [
      {
        name: "Sea Salt Exterior Rinse",
        description: "Removes coastal residue and protects paint.",
        durationMinutes: 30,
        priceLkr: 3000,
      },
      {
        name: "Tourist Rental Cleanup",
        description: "Fast-turnaround clean for rental handovers.",
        durationMinutes: 48,
        priceLkr: 4900,
      },
      {
        name: "Premium Foam + Wax",
        description: "Beach-safe detailing with UV guard.",
        durationMinutes: 70,
        priceLkr: 6700,
      },
    ],
  },
];

const kmBetween = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
) => {
  const earthRadiusKm = 6371;
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getAllStores = () => stores;

export const getStoreBySlug = (slug: string) =>
  stores.find((store) => store.slug === slug);

export const sortStoresByDistance = (
  location: { lat: number; lng: number },
  sourceStores: Store[]
) =>
  [...sourceStores].sort(
    (first, second) =>
      kmBetween(location, first.location) - kmBetween(location, second.location)
  );

export const distanceFrom = (
  location: { lat: number; lng: number },
  store: Store
) => kmBetween(location, store.location);

export const getMinimumPackagePrice = (store: Store) =>
  Math.min(...store.services.map((service) => service.priceLkr));
