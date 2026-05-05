// Curated property data for Felister Stays
// Photos are tasteful Unsplash placeholders matching each property's vibe.
// Owner can replace photos via /admin/properties — gallery is fully data-driven.

export type AmenityKey =
  | "wifi" | "pool" | "ac" | "kitchen" | "parking" | "beach"
  | "tv" | "washer" | "workspace" | "garden" | "bbq" | "security"
  | "cleaning" | "breakfast" | "transport" | "balcony" | "linen"
  | "safe" | "iron" | "hairdryer" | "coffee" | "babycot" | "petfriendly"
  | "concierge" | "luggage" | "terrace" | "nonsmoking"
  | "fireplace" | "patio";

export interface PropertySeed {
  slug: string;
  name: string;
  type: "villa" | "apartment";
  shortDescription: string;
  description: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  maxGuests: number;
  sizeM2?: number;
  basePriceKes: number;
  cleaningFeeKes: number;
  rating: number;
  reviewCount: number;
  amenities: AmenityKey[];
  images: string[];
  highlights: { icon: string; title: string; text: string }[];
  airbnbUrl?: string;
  bookingUrl?: string;
}

export const PROPERTIES: PropertySeed[] = [
  {
    slug: "villa-by-the-beach",
    name: "Villa by the Beach Mombasa",
    type: "villa",
    shortDescription:
      "A 3-bedroom air-conditioned villa with patio, garden, BBQ and fireplace — set in Mtwapa, 2.7 km from Jumba la Mtwana.",
    description:
      "Boasting air-conditioned accommodation with a patio, Villa by the Beach Mombasa is set in Mtwapa. The property offers access to a terrace, free private parking and free WiFi, and is non-smoking throughout.\n\nThe villa has 3 bedrooms with 5 beds in total, a kitchen with an oven, microwave, stovetop, refrigerator and full kitchenware, a flat-screen TV, a seating area and 2 bathrooms with showers. Take in the surroundings from the outdoor dining area, or warm up by the fireplace on cooler evenings. Bed linen, towels and housekeeping are included.\n\nDistances: Jumba la Mtwana 2.7 km · Haller Park 10 km · Nyali Golf Course 14 km · Moi International Airport 30 km.",
    location: "Mtwapa, Kilifi County",
    address: "Mtwapa, Kilifi County, Kenya",
    latitude: -3.950065,
    longitude: 39.753344,
    bedrooms: 3,
    bathrooms: 2,
    beds: 5,
    maxGuests: 6,
    sizeM2: 180,
    basePriceKes: 10,
    cleaningFeeKes: 0,
    rating: 4.9,
    reviewCount: 3,
    amenities: [
      "wifi", "ac", "kitchen", "parking", "tv", "garden", "bbq",
      "patio", "terrace", "fireplace", "nonsmoking", "cleaning",
      "linen", "coffee",
    ],
    images: Array.from({ length: 10 }, (_, i) =>
      `/properties/villa-by-the-beach/photo-${String(i + 1).padStart(2, "0")}.jpg`
    ),
    highlights: [
      { icon: "leaf", title: "Patio + garden", text: "Outdoor dining area in own garden" },
      { icon: "flame", title: "Fireplace", text: "For cooler coastal evenings" },
      { icon: "users", title: "Sleeps 6", text: "3 bedrooms · 5 beds" },
      { icon: "compass", title: "Near Jumba ruins", text: "2.7 km to the historic site" },
    ],
    airbnbUrl: undefined,
    bookingUrl:
      "https://www.booking.com/hotel/ke/villa-by-the-beach-mtwapa.en-gb.html?aid=356980",
  },
  {
    slug: "sunny-sands-beach-apartment-3",
    name: "Mombasa Sunny Beach Apartment 3",
    type: "apartment",
    shortDescription:
      "A peaceful 1-bedroom apartment in the Sunny Sands compound — 7 minutes walk to the beach, close to Mtwapa centre.",
    description:
      "A bright, freshly finished one-bedroom apartment in the Sunny Sands compound, just outside the centre of Mtwapa. Seven minutes on foot brings you to the beach. The bedroom sleeps three (one double, one single, plus a baby cot on request), the kitchen is fully kitted out for self-catering, and there's a dedicated workspace if you need to get a few hours of work done. On-site security and free parking — daily cleaning available on request. Relax with the whole family in this peaceful accommodation.",
    location: "Mtwapa, Kilifi County",
    address: "Sunny Sands compound, Mtwapa, Kilifi County, Kenya",
    latitude: -3.9461,
    longitude: 39.7438,
    bedrooms: 1,
    bathrooms: 1,
    beds: 2,
    maxGuests: 4,
    sizeM2: 55,
    basePriceKes: 10,
    cleaningFeeKes: 0,
    rating: 4.67,
    reviewCount: 9,
    amenities: [
      "wifi", "ac", "kitchen", "parking", "beach", "tv", "washer",
      "workspace", "security", "cleaning", "linen", "safe", "babycot",
    ],
    images: Array.from({ length: 26 }, (_, i) =>
      `/properties/sunny-sands-beach-apartment-3/photo-${String(i + 1).padStart(2, "0")}.jpg`
    ),
    highlights: [
      { icon: "waves", title: "7 min to beach", text: "Short walk through the compound" },
      { icon: "wifi", title: "Work-ready", text: "WiFi + dedicated workspace" },
      { icon: "leaf", title: "Family-friendly", text: "Baby cot available on request" },
      { icon: "key", title: "On-site security", text: "Gated, 24/7 security" },
    ],
    airbnbUrl: "https://www.airbnb.co.uk/rooms/1528967424600058733",
  },
  {
    slug: "sunny-sands-beach-apartment-5",
    name: "Mombasa Sunny Beach Apartment 5",
    type: "apartment",
    shortDescription:
      "Quiet apartment on Mtwapa Avenue with terrace, garden and concierge service — 10 km from Haller Park.",
    description:
      "Mombasa Sunny Beach Apartment 5 sits on Mtwapa Avenue, surrounded by a tropical garden. The apartment opens onto a private terrace and comes with free WiFi, on-site concierge, luggage storage, laundry service and free parking. The historic Jumba la Mtwana ruins are minutes away, and Haller Park (a popular wildlife reserve) is 10 km down the coast road. Best for travellers who want quiet, a base for exploring the coast, and Felister's local know-how on call.",
    location: "Mtwapa, Kilifi County",
    address: "Mtwapa Avenue, Mtwapa, Kilifi County, Kenya",
    latitude: -3.9352,
    longitude: 39.7493,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    maxGuests: 2,
    sizeM2: 45,
    basePriceKes: 10,
    cleaningFeeKes: 0,
    rating: 0,
    reviewCount: 0,
    amenities: [
      "wifi", "parking", "garden", "terrace", "concierge", "luggage",
      "washer", "security", "nonsmoking", "linen",
    ],
    images: [
      "/properties/sunny-sands-beach-apartment-5/photo-01.jpg",
      "/properties/sunny-sands-beach-apartment-5/photo-02.jpg",
      "/properties/sunny-sands-beach-apartment-5/photo-03.jpg",
      "/properties/sunny-sands-beach-apartment-5/photo-04.jpg",
      "/properties/sunny-sands-beach-apartment-5/photo-05.jpg",
    ],
    highlights: [
      { icon: "leaf", title: "Tropical garden", text: "Set inside its own garden" },
      { icon: "compass", title: "Near Jumba ruins", text: "Minutes from the historic site" },
      { icon: "key", title: "Concierge on-site", text: "Felister's team for what you need" },
      { icon: "users", title: "Sleeps 2", text: "Cosy couples retreat" },
    ],
    // Skyscanner aggregates this listing from Booking.com — confirmed via canonical URL.
    bookingUrl:
      "https://www.booking.com/hotel/ke/sunny-sands-beach-apartment-5.en-gb.html",
  },
  {
    slug: "tiny-house-on-a-farm",
    name: "Tiny House on a Farm",
    type: "apartment",
    shortDescription:
      "An off-grid stone tiny-house on a working farm — surrounded by nature, 25 minutes from the sea.",
    description:
      "An oasis of silence where you can really unplug. A mini-house surrounded by nature where you can hear the chirping of birds and where you can spend time with farmyard animals. Just 25 minutes from the sea and 45 minutes from the mountains, close to places of historical and natural interest and a starting point for hiking trails.\n\nOne bright bedroom, a private patio with garden views, a fully equipped kitchen and a rooftop terrace for sunsets. Sleeps up to 4.",
    location: "Abruzzo, Italy",
    address: "Rural farm property, Abruzzo, Italy",
    latitude: 42.0693,
    longitude: 14.419,
    bedrooms: 1,
    bathrooms: 1,
    beds: 2,
    maxGuests: 4,
    sizeM2: 35,
    basePriceKes: 10,
    cleaningFeeKes: 0,
    rating: 5.0,
    reviewCount: 65,
    amenities: [
      "wifi", "kitchen", "parking", "tv", "washer", "garden", "bbq",
      "patio", "terrace", "nonsmoking", "linen", "safe", "coffee",
    ],
    images: Array.from({ length: 26 }, (_, i) =>
      `/properties/tiny-house-on-a-farm/photo-${String(i + 1).padStart(2, "0")}.jpg`
    ),
    highlights: [
      { icon: "leaf", title: "Off-grid retreat", text: "Surrounded by farmland & nature" },
      { icon: "waves", title: "25 min to the sea", text: "Adriatic coast within easy reach" },
      { icon: "compass", title: "Hiking trails", text: "Trailheads at the doorstep" },
      { icon: "users", title: "Sleeps 4", text: "1 bedroom + sofa bed" },
    ],
    airbnbUrl: "https://www.airbnb.co.uk/rooms/639599869026350715",
  },
];

export const SAMPLE_REVIEWS: { propertySlug: string; authorName: string; authorCountry: string; rating: number; title: string; body: string; stayMonth: string }[] = [
  // Villa rating 4.9/5 (3 reviews). Real review texts to be supplied by Felister
  // from her Booking host dashboard — these are illustrative until then.
  { propertySlug: "villa-by-the-beach", authorName: "Marieke", authorCountry: "Netherlands", rating: 5, title: "Pure paradise", body: "Three bedrooms, big patio, working AC and a fully equipped kitchen. The BBQ in the garden was a highlight every evening. Felister was a wonderful host — answered every message within minutes.", stayMonth: "December 2025" },
  { propertySlug: "villa-by-the-beach", authorName: "James", authorCountry: "United Kingdom", rating: 5, title: "Better than the photos", body: "Quiet plot, beautiful garden, the fireplace on cooler evenings was such a surprise. Felt at home from the moment we arrived. Would book again in a heartbeat.", stayMonth: "November 2025" },
  { propertySlug: "villa-by-the-beach", authorName: "Aisha", authorCountry: "Kenya", rating: 5, title: "Perfect family weekend", body: "Booked it for a family celebration and everything was spotless. Plenty of space, fantastic location near Jumba la Mtwana. Felister even arranged a fresh-fish dinner for us.", stayMonth: "October 2025" },
  { propertySlug: "sunny-sands-beach-apartment-3", authorName: "Sophie", authorCountry: "France", rating: 5, title: "New, clean, peaceful", body: "Exactly as described — a brand-new apartment, very quiet, walking distance to the beach. Felister was responsive on WhatsApp and arranged a taxi for us.", stayMonth: "January 2026" },
  { propertySlug: "sunny-sands-beach-apartment-3", authorName: "David", authorCountry: "South Africa", rating: 5, title: "Easy work-from-paradise", body: "WiFi was solid and the workspace was great for a few days of remote work. Security at the gate gave us peace of mind.", stayMonth: "November 2025" },
  { propertySlug: "sunny-sands-beach-apartment-3", authorName: "Linda", authorCountry: "Germany", rating: 4, title: "Lovely little apartment", body: "Spotless, fresh and very welcoming. The walk to the beach is a bit longer than 7 minutes but that's a minor thing.", stayMonth: "September 2025" },
  // Apt 5 has no public reviews on Skyscanner yet — leaving empty until real ones come in.
];
