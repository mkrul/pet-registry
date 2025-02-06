export interface NominatimAddress {
  city?: string;
  area?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  municipality?: string;
  hamlet?: string;
  isolated_dwelling?: string;
  county?: string;
  state?: string;
  country?: string;
  road?: string;
}

export interface LocationDetails {
  address: NominatimAddress;
  area: string;
  intersectionStr: string | null;
}
