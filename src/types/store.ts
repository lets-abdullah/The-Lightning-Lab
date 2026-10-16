export interface StoreInfo {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  announcements: string[];
}

export interface ValueProposition {
  id: number;
  title: string;
  subtitle: string;
  icon: 'Truck' | 'BadgePercent' | 'RotateCcw' | 'ShieldCheck';
}

export interface HeroGridItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  link: string;
}

export interface HeroData {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryLink: string;
  secondaryCta: string;
  secondaryLink: string;
  stats: { label: string; value: string }[];
  gridBanners: {
    large: {
      title: string;
      subtitle: string;
      tag: string;
      image: string;
      link: string;
    };
    items: HeroGridItem[];
  };
}

export interface Category {
  id: number;
  name: string;
  itemCount: string;
  image: string;
  badge: string;
  link: string;
}

export interface SpaceShowcase {
  id: number;
  title: string;
  desc: string;
  image: string;
  tag: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tab: 'commercial' | 'outdoor' | 'sheets' | 'bestsellers';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge: string;
  specs: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedCct?: string;
  selectedWattage?: string;
}

export interface Review {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  title: string;
  quote: string;
  verified: boolean;
  product: string;
}
