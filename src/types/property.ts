export interface Property {
  id: string;
  dealName: string;
  source: 'DL' | 'Securities' | 'Equity';
  propertyType: string;
  class: 'A' | 'B' | 'C';
  propertySubType: string;
  vintage: number;
  avgUnitSize: number;
  occupancyPrevQ: number;
  occupancyInPlace: number;
  occupancyStabilized: number;
  rent: number;
  egi: number;
  reTax: number;
  insurance: number;
  otherOpEx: number;
  totalOpEx: number;
  noi: number;
  country: string;
  state: string;
  msa: string;
  fund: string;
  assetType: string;
  yearBuilt: number;
}

export interface FilterOptions {
  months: string[];
  years: number[];
  countries: string[];
  states: string[];
  msas: string[];
  funds: string[];
  assetTypes: string[];
  classes: ('A' | 'B' | 'C')[];
  propertyTypes: string[];
}

export interface PropertyFilters {
  month?: string;
  year?: number;
  country?: string;
  state?: string;
  msa?: string;
  fund?: string;
  assetType?: string;
  class?: 'A' | 'B' | 'C';
  propertyType?: string;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  search?: string;
}