export interface Neighborhood {
  id: string;
  name: string;
  ntaName: string;
  nta: string;
  borough: string;
  boroughId: string;
  type: "neighborhood" | "park";
  pricePerBlock: number;
  blockCount: number;
  center: [number, number];
}

export interface BlockProperties {
  id: string;
  block: number;
  part: number;
  boro: string;
  borough: string;
  nta: string;
  ntaName: string;
  neighborhood: string;
  neighborhoodId: string;
  type: "neighborhood" | "park";
  price: number;
}

export interface OwnedBlock {
  id: string;
  taxBlock: number;
  neighborhoodId: string;
  neighborhoodName: string;
  ownerName: string;
  ownerUrl: string;
  ownerImage: string;
  ownerColor: string;
  price: number;
  purchasedAt: string;
}
