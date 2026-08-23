import { Neighborhood } from "@/types";

export const BOROUGHS = [
  { id: "manhattan", name: "Manhattan", center: [40.783, -73.971] as [number, number], zoom: 12 },
  { id: "brooklyn", name: "Brooklyn", center: [40.65, -73.95] as [number, number], zoom: 12 },
  { id: "queens", name: "Queens", center: [40.72, -73.82] as [number, number], zoom: 11 },
  { id: "bronx", name: "Bronx", center: [40.85, -73.866] as [number, number], zoom: 12 },
  { id: "staten-island", name: "Staten Island", center: [40.58, -74.15] as [number, number], zoom: 11 },
] as const;

export type BoroughId = (typeof BOROUGHS)[number]["id"];

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    "id": "bronx-riverdale",
    "name": "Riverdale",
    "ntaName": "Riverdale-Spuyten Duyvil",
    "nta": "BX0803",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 14,
    "blockCount": 191,
    "center": [
      40.895148,
      -73.906948
    ]
  },
  {
    "id": "bronx-mott-haven",
    "name": "Mott Haven",
    "ntaName": "Mott Haven-Port Morris",
    "nta": "BX0101",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 172,
    "center": [
      40.808454,
      -73.917386
    ]
  },
  {
    "id": "bronx-allerton",
    "name": "Allerton",
    "ntaName": "Allerton",
    "nta": "BX1104",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 91,
    "center": [
      40.864591,
      -73.864285
    ]
  },
  {
    "id": "bronx-bedford-park",
    "name": "Bedford Park",
    "ntaName": "Bedford Park",
    "nta": "BX0702",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 83,
    "center": [
      40.871054,
      -73.888043
    ]
  },
  {
    "id": "bronx-belmont",
    "name": "Belmont",
    "ntaName": "Belmont",
    "nta": "BX0603",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 102,
    "center": [
      40.855907,
      -73.888435
    ]
  },
  {
    "id": "bronx-bronx-park",
    "name": "Bronx Park",
    "ntaName": "Bronx Park",
    "nta": "BX2791",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 8,
    "center": [
      40.862684,
      -73.874484
    ]
  },
  {
    "id": "bronx-castle-hill",
    "name": "Castle Hill",
    "ntaName": "Castle Hill-Unionport",
    "nta": "BX0903",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 116,
    "center": [
      40.825198,
      -73.850137
    ]
  },
  {
    "id": "bronx-claremont-park",
    "name": "Claremont Park",
    "ntaName": "Claremont Park",
    "nta": "BX0492",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 2,
    "center": [
      40.841664,
      -73.908257
    ]
  },
  {
    "id": "bronx-claremont-village",
    "name": "Claremont Village",
    "ntaName": "Claremont Village-Claremont (East)",
    "nta": "BX0302",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 50,
    "center": [
      40.838288,
      -73.903232
    ]
  },
  {
    "id": "bronx-co",
    "name": "Co",
    "ntaName": "Co-op City",
    "nta": "BX1004",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 34,
    "center": [
      40.872695,
      -73.824872
    ]
  },
  {
    "id": "bronx-concourse",
    "name": "Concourse",
    "ntaName": "Concourse-Concourse Village",
    "nta": "BX0401",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 133,
    "center": [
      40.827791,
      -73.920285
    ]
  },
  {
    "id": "bronx-crotona-park",
    "name": "Crotona Park",
    "ntaName": "Crotona Park",
    "nta": "BX0391",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 4,
    "center": [
      40.837536,
      -73.896471
    ]
  },
  {
    "id": "bronx-crotona-park-east",
    "name": "Crotona Park East",
    "ntaName": "Crotona Park East",
    "nta": "BX0303",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 85,
    "center": [
      40.832116,
      -73.889801
    ]
  },
  {
    "id": "bronx-eastchester",
    "name": "Eastchester",
    "ntaName": "Eastchester-Edenwald-Baychester",
    "nta": "BX1202",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 269,
    "center": [
      40.881197,
      -73.837091
    ]
  },
  {
    "id": "bronx-ferry-point-park",
    "name": "Ferry Point Park",
    "ntaName": "Ferry Point Park-St. Raymond Cemetery",
    "nta": "BX1091",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 9,
    "center": [
      40.816482,
      -73.830926
    ]
  },
  {
    "id": "bronx-fordham-heights",
    "name": "Fordham Heights",
    "ntaName": "Fordham Heights",
    "nta": "BX0503",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 52,
    "center": [
      40.858829,
      -73.89943
    ]
  },
  {
    "id": "bronx-hart-island",
    "name": "Hart Island",
    "ntaName": "Hart Island",
    "nta": "BX1071",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 11,
    "center": [
      40.856461,
      -73.785506
    ]
  },
  {
    "id": "bronx-highbridge",
    "name": "Highbridge",
    "ntaName": "Highbridge",
    "nta": "BX0402",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 65,
    "center": [
      40.837283,
      -73.926432
    ]
  },
  {
    "id": "bronx-hunts-point",
    "name": "Hunts Point",
    "ntaName": "Hunts Point",
    "nta": "BX0201",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 122,
    "center": [
      40.813347,
      -73.88765
    ]
  },
  {
    "id": "bronx-hutchinson-metro-center",
    "name": "Hutchinson Metro Center",
    "ntaName": "Hutchinson Metro Center",
    "nta": "BX1161",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 16,
    "center": [
      40.845197,
      -73.840562
    ]
  },
  {
    "id": "bronx-kingsbridge",
    "name": "Kingsbridge",
    "ntaName": "Kingsbridge-Marble Hill",
    "nta": "BX0802",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 50,
    "center": [
      40.88243,
      -73.904589
    ]
  },
  {
    "id": "bronx-kingsbridge-heights",
    "name": "Kingsbridge Heights",
    "ntaName": "Kingsbridge Heights-Van Cortlandt Village",
    "nta": "BX0801",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 52,
    "center": [
      40.877433,
      -73.899298
    ]
  },
  {
    "id": "bronx-longwood",
    "name": "Longwood",
    "ntaName": "Longwood",
    "nta": "BX0202",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 94,
    "center": [
      40.821056,
      -73.896316
    ]
  },
  {
    "id": "bronx-melrose",
    "name": "Melrose",
    "ntaName": "Melrose",
    "nta": "BX0102",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 104,
    "center": [
      40.818374,
      -73.911807
    ]
  },
  {
    "id": "bronx-morris-park",
    "name": "Morris Park",
    "ntaName": "Morris Park",
    "nta": "BX1102",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 127,
    "center": [
      40.850815,
      -73.85336
    ]
  },
  {
    "id": "bronx-morrisania",
    "name": "Morrisania",
    "ntaName": "Morrisania",
    "nta": "BX0301",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 79,
    "center": [
      40.827379,
      -73.905103
    ]
  },
  {
    "id": "bronx-mount-eden",
    "name": "Mount Eden",
    "ntaName": "Mount Eden-Claremont (West)",
    "nta": "BX0403",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 89,
    "center": [
      40.84096,
      -73.914373
    ]
  },
  {
    "id": "bronx-mount-hope",
    "name": "Mount Hope",
    "ntaName": "Mount Hope",
    "nta": "BX0502",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 91,
    "center": [
      40.849576,
      -73.904979
    ]
  },
  {
    "id": "bronx-north-and-south-brother-islands",
    "name": "North & South Brother Islands",
    "ntaName": "North & South Brother Islands",
    "nta": "BX0291",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 3,
    "center": [
      40.797798,
      -73.901995
    ]
  },
  {
    "id": "bronx-norwood",
    "name": "Norwood",
    "ntaName": "Norwood",
    "nta": "BX0703",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 65,
    "center": [
      40.877385,
      -73.878157
    ]
  },
  {
    "id": "bronx-parkchester",
    "name": "Parkchester",
    "ntaName": "Parkchester",
    "nta": "BX0904",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 28,
    "center": [
      40.83695,
      -73.857123
    ]
  },
  {
    "id": "bronx-pelham-bay",
    "name": "Pelham Bay",
    "ntaName": "Pelham Bay-Country Club-City Island",
    "nta": "BX1003",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 167,
    "center": [
      40.845784,
      -73.816395
    ]
  },
  {
    "id": "bronx-pelham-bay-park",
    "name": "Pelham Bay Park",
    "ntaName": "Pelham Bay Park",
    "nta": "BX2891",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 11,
    "center": [
      40.861715,
      -73.818505
    ]
  },
  {
    "id": "bronx-pelham-gardens",
    "name": "Pelham Gardens",
    "ntaName": "Pelham Gardens",
    "nta": "BX1103",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 175,
    "center": [
      40.864139,
      -73.847029
    ]
  },
  {
    "id": "bronx-pelham-parkway",
    "name": "Pelham Parkway",
    "ntaName": "Pelham Parkway-Van Nest",
    "nta": "BX1101",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 82,
    "center": [
      40.847492,
      -73.865776
    ]
  },
  {
    "id": "bronx-rikers-island",
    "name": "Rikers Island",
    "ntaName": "Rikers Island",
    "nta": "QN0151",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 1,
    "center": [
      40.791133,
      -73.882645
    ]
  },
  {
    "id": "bronx-soundview",
    "name": "Soundview",
    "ntaName": "Soundview-Bruckner-Bronx River",
    "nta": "BX0901",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 266,
    "center": [
      40.823812,
      -73.866335
    ]
  },
  {
    "id": "bronx-soundview-park",
    "name": "Soundview Park",
    "ntaName": "Soundview Park",
    "nta": "BX0991",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 4,
    "center": [
      40.816348,
      -73.869513
    ]
  },
  {
    "id": "bronx-throgs-neck",
    "name": "Throgs Neck",
    "ntaName": "Throgs Neck-Schuylerville",
    "nta": "BX1002",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 281,
    "center": [
      40.827286,
      -73.822008
    ]
  },
  {
    "id": "bronx-tremont",
    "name": "Tremont",
    "ntaName": "Tremont",
    "nta": "BX0602",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 110,
    "center": [
      40.846701,
      -73.891959
    ]
  },
  {
    "id": "bronx-university-heights-north",
    "name": "University Heights (North)",
    "ntaName": "University Heights (North)-Fordham",
    "nta": "BX0701",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 72,
    "center": [
      40.863999,
      -73.902977
    ]
  },
  {
    "id": "bronx-university-heights-south",
    "name": "University Heights (South)",
    "ntaName": "University Heights (South)-Morris Heights",
    "nta": "BX0501",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 89,
    "center": [
      40.851544,
      -73.915181
    ]
  },
  {
    "id": "bronx-van-cortlandt-park",
    "name": "Van Cortlandt Park",
    "ntaName": "Van Cortlandt Park",
    "nta": "BX2691",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 2,
    "center": [
      40.898807,
      -73.88167
    ]
  },
  {
    "id": "bronx-wakefield",
    "name": "Wakefield",
    "ntaName": "Wakefield-Woodlawn",
    "nta": "BX1203",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 220,
    "center": [
      40.898297,
      -73.854175
    ]
  },
  {
    "id": "bronx-west-farms",
    "name": "West Farms",
    "ntaName": "West Farms",
    "nta": "BX0601",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 59,
    "center": [
      40.842301,
      -73.879631
    ]
  },
  {
    "id": "bronx-westchester-square",
    "name": "Westchester Square",
    "ntaName": "Westchester Square",
    "nta": "BX1001",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 97,
    "center": [
      40.838433,
      -73.846499
    ]
  },
  {
    "id": "bronx-williamsbridge",
    "name": "Williamsbridge",
    "ntaName": "Williamsbridge-Olinville",
    "nta": "BX1201",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 175,
    "center": [
      40.879605,
      -73.860382
    ]
  },
  {
    "id": "bronx-woodlawn-cemetery",
    "name": "Woodlawn Cemetery",
    "ntaName": "Woodlawn Cemetery",
    "nta": "BX1271",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 1,
    "center": [
      40.889576,
      -73.872504
    ]
  },
  {
    "id": "bronx-yankee-stadium",
    "name": "Yankee Stadium",
    "ntaName": "Yankee Stadium-Macombs Dam Park",
    "nta": "BX0491",
    "borough": "Bronx",
    "boroughId": "bronx",
    "type": "park",
    "pricePerBlock": 8,
    "blockCount": 5,
    "center": [
      40.830087,
      -73.926475
    ]
  },
  {
    "id": "brooklyn-brooklyn-heights",
    "name": "Brooklyn Heights",
    "ntaName": "Brooklyn Heights",
    "nta": "BK0201",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 45,
    "blockCount": 67,
    "center": [
      40.699651,
      -74.001217
    ]
  },
  {
    "id": "brooklyn-downtown-brooklyn",
    "name": "Downtown Brooklyn",
    "ntaName": "Downtown Brooklyn-DUMBO-Boerum Hill",
    "nta": "BK0202",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 45,
    "blockCount": 155,
    "center": [
      40.695138,
      -73.985911
    ]
  },
  {
    "id": "brooklyn-east-williamsburg",
    "name": "East Williamsburg",
    "ntaName": "East Williamsburg",
    "nta": "BK0104",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 32,
    "blockCount": 277,
    "center": [
      40.712759,
      -73.938007
    ]
  },
  {
    "id": "brooklyn-greenpoint",
    "name": "Greenpoint",
    "ntaName": "Greenpoint",
    "nta": "BK0101",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 32,
    "blockCount": 182,
    "center": [
      40.728256,
      -73.950312
    ]
  },
  {
    "id": "brooklyn-south-williamsburg",
    "name": "South Williamsburg",
    "ntaName": "South Williamsburg",
    "nta": "BK0103",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 32,
    "blockCount": 107,
    "center": [
      40.703379,
      -73.956152
    ]
  },
  {
    "id": "brooklyn-williamsburg",
    "name": "Williamsburg",
    "ntaName": "Williamsburg",
    "nta": "BK0102",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 32,
    "blockCount": 221,
    "center": [
      40.714237,
      -73.958649
    ]
  },
  {
    "id": "brooklyn-carroll-gardens",
    "name": "Carroll Gardens",
    "ntaName": "Carroll Gardens-Cobble Hill-Gowanus-Red Hook",
    "nta": "BK0601",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 28,
    "blockCount": 316,
    "center": [
      40.678626,
      -73.998937
    ]
  },
  {
    "id": "brooklyn-park-slope",
    "name": "Park Slope",
    "ntaName": "Park Slope",
    "nta": "BK0602",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 28,
    "blockCount": 132,
    "center": [
      40.672093,
      -73.979495
    ]
  },
  {
    "id": "brooklyn-prospect-park",
    "name": "Prospect Park",
    "ntaName": "Prospect Park",
    "nta": "BK5591",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 20,
    "blockCount": 3,
    "center": [
      40.660308,
      -73.967504
    ]
  },
  {
    "id": "brooklyn-bedford",
    "name": "Bedford",
    "ntaName": "Bedford-Stuyvesant (West)",
    "nta": "BK0301",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 361,
    "center": [
      40.687459,
      -73.940697
    ]
  },
  {
    "id": "brooklyn-bushwick-east",
    "name": "Bushwick (East)",
    "ntaName": "Bushwick (East)",
    "nta": "BK0402",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 167,
    "center": [
      40.691272,
      -73.913056
    ]
  },
  {
    "id": "brooklyn-bushwick-west",
    "name": "Bushwick (West)",
    "ntaName": "Bushwick (West)",
    "nta": "BK0401",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 155,
    "center": [
      40.701078,
      -73.925296
    ]
  },
  {
    "id": "brooklyn-barren-island",
    "name": "Barren Island",
    "ntaName": "Barren Island-Floyd Bennett Field",
    "nta": "BK5691",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 3,
    "center": [
      40.592999,
      -73.894289
    ]
  },
  {
    "id": "brooklyn-bath-beach",
    "name": "Bath Beach",
    "ntaName": "Bath Beach",
    "nta": "BK1102",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 99,
    "center": [
      40.604775,
      -74.007078
    ]
  },
  {
    "id": "brooklyn-bay-ridge",
    "name": "Bay Ridge",
    "ntaName": "Bay Ridge",
    "nta": "BK1001",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 260,
    "center": [
      40.626754,
      -74.029182
    ]
  },
  {
    "id": "brooklyn-bensonhurst",
    "name": "Bensonhurst",
    "ntaName": "Bensonhurst",
    "nta": "BK1101",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 253,
    "center": [
      40.613637,
      -73.993597
    ]
  },
  {
    "id": "brooklyn-borough-park",
    "name": "Borough Park",
    "ntaName": "Borough Park",
    "nta": "BK1202",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 229,
    "center": [
      40.633154,
      -73.989915
    ]
  },
  {
    "id": "brooklyn-brighton-beach",
    "name": "Brighton Beach",
    "ntaName": "Brighton Beach",
    "nta": "BK1303",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 98,
    "center": [
      40.579187,
      -73.961839
    ]
  },
  {
    "id": "brooklyn-brooklyn-navy-yard",
    "name": "Brooklyn Navy Yard",
    "ntaName": "Brooklyn Navy Yard",
    "nta": "BK0261",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 2,
    "center": [
      40.706782,
      -73.970813
    ]
  },
  {
    "id": "brooklyn-brownsville",
    "name": "Brownsville",
    "ntaName": "Brownsville",
    "nta": "BK1602",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 174,
    "center": [
      40.663636,
      -73.909604
    ]
  },
  {
    "id": "brooklyn-calvert-vaux-park",
    "name": "Calvert Vaux Park",
    "ntaName": "Calvert Vaux Park",
    "nta": "BK1391",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 8,
    "center": [
      40.57813,
      -74.003036
    ]
  },
  {
    "id": "brooklyn-canarsie",
    "name": "Canarsie",
    "ntaName": "Canarsie",
    "nta": "BK1803",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 327,
    "center": [
      40.639031,
      -73.901682
    ]
  },
  {
    "id": "brooklyn-canarsie-park-and-pier",
    "name": "Canarsie Park & Pier",
    "ntaName": "Canarsie Park & Pier",
    "nta": "BK1893",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 3,
    "center": [
      40.631189,
      -73.887389
    ]
  },
  {
    "id": "brooklyn-clinton-hill",
    "name": "Clinton Hill",
    "ntaName": "Clinton Hill",
    "nta": "BK0204",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 71,
    "center": [
      40.68847,
      -73.964682
    ]
  },
  {
    "id": "brooklyn-coney-island",
    "name": "Coney Island",
    "ntaName": "Coney Island-Sea Gate",
    "nta": "BK1302",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 140,
    "center": [
      40.576835,
      -73.993472
    ]
  },
  {
    "id": "brooklyn-crown-heights-north",
    "name": "Crown Heights (North)",
    "ntaName": "Crown Heights (North)",
    "nta": "BK0802",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 146,
    "center": [
      40.673799,
      -73.942471
    ]
  },
  {
    "id": "brooklyn-crown-heights-south",
    "name": "Crown Heights (South)",
    "ntaName": "Crown Heights (South)",
    "nta": "BK0901",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 89,
    "center": [
      40.666574,
      -73.945984
    ]
  },
  {
    "id": "brooklyn-cypress-hills",
    "name": "Cypress Hills",
    "ntaName": "Cypress Hills",
    "nta": "BK0501",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 148,
    "center": [
      40.682536,
      -73.881467
    ]
  },
  {
    "id": "brooklyn-dyker-beach-park",
    "name": "Dyker Beach Park",
    "ntaName": "Dyker Beach Park",
    "nta": "BK1091",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 1,
    "center": [
      40.609851,
      -74.019566
    ]
  },
  {
    "id": "brooklyn-dyker-heights",
    "name": "Dyker Heights",
    "ntaName": "Dyker Heights",
    "nta": "BK1002",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 156,
    "center": [
      40.624318,
      -74.011073
    ]
  },
  {
    "id": "brooklyn-east-flatbush",
    "name": "East Flatbush",
    "ntaName": "East Flatbush-Remsen Village",
    "nta": "BK1704",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 501,
    "center": [
      40.648692,
      -73.934303
    ]
  },
  {
    "id": "brooklyn-east-new-york",
    "name": "East New York",
    "ntaName": "East New York-New Lots",
    "nta": "BK0503",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 430,
    "center": [
      40.66541,
      -73.878412
    ]
  },
  {
    "id": "brooklyn-east-new-york-north",
    "name": "East New York (North)",
    "ntaName": "East New York (North)",
    "nta": "BK0502",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 213,
    "center": [
      40.672549,
      -73.889519
    ]
  },
  {
    "id": "brooklyn-flatbush",
    "name": "Flatbush",
    "ntaName": "Flatbush",
    "nta": "BK1401",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 126,
    "center": [
      40.640234,
      -73.95601
    ]
  },
  {
    "id": "brooklyn-flatbush-west",
    "name": "Flatbush (West)",
    "ntaName": "Flatbush (West)-Ditmas Park-Parkville",
    "nta": "BK1402",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 117,
    "center": [
      40.636936,
      -73.966544
    ]
  },
  {
    "id": "brooklyn-flatlands",
    "name": "Flatlands",
    "ntaName": "Flatlands",
    "nta": "BK1801",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 279,
    "center": [
      40.625699,
      -73.930821
    ]
  },
  {
    "id": "brooklyn-fort-greene",
    "name": "Fort Greene",
    "ntaName": "Fort Greene",
    "nta": "BK0203",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 83,
    "center": [
      40.690401,
      -73.974108
    ]
  },
  {
    "id": "brooklyn-fort-hamilton",
    "name": "Fort Hamilton",
    "ntaName": "Fort Hamilton",
    "nta": "BK1061",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 2,
    "center": [
      40.611164,
      -74.028214
    ]
  },
  {
    "id": "brooklyn-gravesend-east",
    "name": "Gravesend (East)",
    "ntaName": "Gravesend (East)-Homecrest",
    "nta": "BK1501",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 184,
    "center": [
      40.598441,
      -73.966405
    ]
  },
  {
    "id": "brooklyn-gravesend-south",
    "name": "Gravesend (South)",
    "ntaName": "Gravesend (South)",
    "nta": "BK1301",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 97,
    "center": [
      40.588093,
      -73.97595
    ]
  },
  {
    "id": "brooklyn-gravesend-west",
    "name": "Gravesend (West)",
    "ntaName": "Gravesend (West)",
    "nta": "BK1103",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 170,
    "center": [
      40.599806,
      -73.984671
    ]
  },
  {
    "id": "brooklyn-green",
    "name": "Green",
    "ntaName": "Green-Wood Cemetery",
    "nta": "BK0771",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 1,
    "center": [
      40.652147,
      -73.990254
    ]
  },
  {
    "id": "brooklyn-highland-park",
    "name": "Highland Park",
    "ntaName": "Highland Park-Cypress Hills Cemeteries (South)",
    "nta": "BK0571",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 7,
    "center": [
      40.689952,
      -73.876035
    ]
  },
  {
    "id": "brooklyn-holy-cross-cemetery",
    "name": "Holy Cross Cemetery",
    "ntaName": "Holy Cross Cemetery",
    "nta": "BK1771",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 1,
    "center": [
      40.647009,
      -73.938183
    ]
  },
  {
    "id": "brooklyn-jamaica-bay-west",
    "name": "Jamaica Bay (West)",
    "ntaName": "Jamaica Bay (West)",
    "nta": "BK5692",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 3,
    "center": [
      39.633284,
      -72.099972
    ]
  },
  {
    "id": "brooklyn-kensington",
    "name": "Kensington",
    "ntaName": "Kensington",
    "nta": "BK1203",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 82,
    "center": [
      40.641606,
      -73.976391
    ]
  },
  {
    "id": "brooklyn-lincoln-terrace-park",
    "name": "Lincoln Terrace Park",
    "ntaName": "Lincoln Terrace Park",
    "nta": "BK0891",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 2,
    "center": [
      40.666878,
      -73.926207
    ]
  },
  {
    "id": "brooklyn-madison",
    "name": "Madison",
    "ntaName": "Madison",
    "nta": "BK1502",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 135,
    "center": [
      40.604716,
      -73.947733
    ]
  },
  {
    "id": "brooklyn-mapleton",
    "name": "Mapleton",
    "ntaName": "Mapleton-Midwood (West)",
    "nta": "BK1204",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 127,
    "center": [
      40.618884,
      -73.973238
    ]
  },
  {
    "id": "brooklyn-marine-park",
    "name": "Marine Park",
    "ntaName": "Marine Park-Plumb Island",
    "nta": "BK1891",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 272,
    "center": [
      40.614028,
      -73.918854
    ]
  },
  {
    "id": "brooklyn-mcguire-fields",
    "name": "McGuire Fields",
    "ntaName": "McGuire Fields",
    "nta": "BK1892",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 3,
    "center": [
      40.610351,
      -73.900957
    ]
  },
  {
    "id": "brooklyn-midwood",
    "name": "Midwood",
    "ntaName": "Midwood",
    "nta": "BK1403",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 151,
    "center": [
      40.620102,
      -73.955904
    ]
  },
  {
    "id": "brooklyn-ocean-hill",
    "name": "Ocean Hill",
    "ntaName": "Ocean Hill",
    "nta": "BK1601",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 126,
    "center": [
      40.676565,
      -73.913102
    ]
  },
  {
    "id": "brooklyn-prospect-heights",
    "name": "Prospect Heights",
    "ntaName": "Prospect Heights",
    "nta": "BK0801",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 49,
    "center": [
      40.677826,
      -73.967378
    ]
  },
  {
    "id": "brooklyn-prospect-lefferts-gardens",
    "name": "Prospect Lefferts Gardens",
    "ntaName": "Prospect Lefferts Gardens-Wingate",
    "nta": "BK0902",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 91,
    "center": [
      40.660355,
      -73.947948
    ]
  },
  {
    "id": "brooklyn-sheepshead-bay",
    "name": "Sheepshead Bay",
    "ntaName": "Sheepshead Bay-Manhattan Beach-Gerritsen Beach",
    "nta": "BK1503",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 343,
    "center": [
      40.589514,
      -73.939728
    ]
  },
  {
    "id": "brooklyn-shirley-chisholm-state-park",
    "name": "Shirley Chisholm State Park",
    "ntaName": "Shirley Chisholm State Park",
    "nta": "BK5693",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 1,
    "center": [
      40.644243,
      -73.866332
    ]
  },
  {
    "id": "brooklyn-spring-creek",
    "name": "Spring Creek",
    "ntaName": "Spring Creek-Starrett City",
    "nta": "BK0504",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 52,
    "center": [
      40.652822,
      -73.876418
    ]
  },
  {
    "id": "brooklyn-sunset-park-central",
    "name": "Sunset Park (Central)",
    "ntaName": "Sunset Park (Central)",
    "nta": "BK0703",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 76,
    "center": [
      40.641674,
      -74.00844
    ]
  },
  {
    "id": "brooklyn-sunset-park-east",
    "name": "Sunset Park (East)",
    "ntaName": "Sunset Park (East)-Borough Park (West)",
    "nta": "BK1201",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 66,
    "center": [
      40.6409,
      -73.998912
    ]
  },
  {
    "id": "brooklyn-sunset-park-west",
    "name": "Sunset Park (West)",
    "ntaName": "Sunset Park (West)",
    "nta": "BK0702",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 177,
    "center": [
      40.65311,
      -74.007962
    ]
  },
  {
    "id": "brooklyn-the-evergreens-cemetery",
    "name": "The Evergreens Cemetery",
    "ntaName": "The Evergreens Cemetery",
    "nta": "BK0471",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 1,
    "center": [
      40.684506,
      -73.901329
    ]
  },
  {
    "id": "brooklyn-windsor-terrace",
    "name": "Windsor Terrace",
    "ntaName": "Windsor Terrace-South Slope",
    "nta": "BK0701",
    "borough": "Brooklyn",
    "boroughId": "brooklyn",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 87,
    "center": [
      40.655579,
      -73.979535
    ]
  },
  {
    "id": "manhattan-central-park",
    "name": "Central Park",
    "ntaName": "Central Park",
    "nta": "MN6491",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "park",
    "pricePerBlock": 150,
    "blockCount": 1,
    "center": [
      40.782503,
      -73.965546
    ]
  },
  {
    "id": "manhattan-times-square",
    "name": "Times Square",
    "ntaName": "Midtown-Times Square",
    "nta": "MN0502",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 100,
    "blockCount": 145,
    "center": [
      40.757733,
      -73.981378
    ]
  },
  {
    "id": "manhattan-midtown-east",
    "name": "Midtown East",
    "ntaName": "East Midtown-Turtle Bay",
    "nta": "MN0604",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 85,
    "blockCount": 81,
    "center": [
      40.756342,
      -73.968163
    ]
  },
  {
    "id": "manhattan-financial-district",
    "name": "Financial District",
    "ntaName": "Financial District-Battery Park City",
    "nta": "MN0101",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 80,
    "blockCount": 137,
    "center": [
      40.707116,
      -74.009207
    ]
  },
  {
    "id": "manhattan-united-nations",
    "name": "United Nations",
    "ntaName": "United Nations",
    "nta": "MN0661",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "park",
    "pricePerBlock": 80,
    "blockCount": 9,
    "center": [
      40.749368,
      -73.966282
    ]
  },
  {
    "id": "manhattan-soho",
    "name": "SoHo",
    "ntaName": "SoHo-Little Italy-Hudson Square",
    "nta": "MN0201",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 75,
    "blockCount": 112,
    "center": [
      40.723112,
      -74.000988
    ]
  },
  {
    "id": "manhattan-tribeca",
    "name": "Tribeca",
    "ntaName": "Tribeca-Civic Center",
    "nta": "MN0102",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 70,
    "blockCount": 123,
    "center": [
      40.717808,
      -74.006894
    ]
  },
  {
    "id": "manhattan-west-village",
    "name": "West Village",
    "ntaName": "West Village",
    "nta": "MN0203",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 70,
    "blockCount": 135,
    "center": [
      40.734824,
      -74.005374
    ]
  },
  {
    "id": "manhattan-greenwich-village",
    "name": "Greenwich Village",
    "ntaName": "Greenwich Village",
    "nta": "MN0202",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 65,
    "blockCount": 73,
    "center": [
      40.730291,
      -73.995645
    ]
  },
  {
    "id": "manhattan-chelsea",
    "name": "Chelsea",
    "ntaName": "Chelsea-Hudson Yards",
    "nta": "MN0401",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 60,
    "blockCount": 115,
    "center": [
      40.748842,
      -74.000888
    ]
  },
  {
    "id": "manhattan-flatiron",
    "name": "Flatiron",
    "ntaName": "Midtown South-Flatiron-Union Square",
    "nta": "MN0501",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 60,
    "blockCount": 84,
    "center": [
      40.743816,
      -73.98911
    ]
  },
  {
    "id": "manhattan-gramercy",
    "name": "Gramercy",
    "ntaName": "Gramercy",
    "nta": "MN0602",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 50,
    "blockCount": 51,
    "center": [
      40.737004,
      -73.984404
    ]
  },
  {
    "id": "manhattan-carnegie-hill",
    "name": "Carnegie Hill",
    "ntaName": "Upper East Side-Carnegie Hill",
    "nta": "MN0802",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 45,
    "blockCount": 153,
    "center": [
      40.774458,
      -73.961191
    ]
  },
  {
    "id": "manhattan-east-village",
    "name": "East Village",
    "ntaName": "East Village",
    "nta": "MN0303",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 45,
    "blockCount": 91,
    "center": [
      40.726593,
      -73.983793
    ]
  },
  {
    "id": "manhattan-hells-kitchen",
    "name": "Hell's Kitchen",
    "ntaName": "Hell's Kitchen",
    "nta": "MN0402",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 45,
    "blockCount": 72,
    "center": [
      40.763965,
      -73.99209
    ]
  },
  {
    "id": "manhattan-battery-park",
    "name": "Battery Park",
    "ntaName": "The Battery-Governors Island-Ellis Island-Liberty Island",
    "nta": "MN0191",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "park",
    "pricePerBlock": 40,
    "blockCount": 4,
    "center": [
      40.698048,
      -74.029082
    ]
  },
  {
    "id": "manhattan-lenox-hill",
    "name": "Lenox Hill",
    "ntaName": "Upper East Side-Lenox Hill-Roosevelt Island",
    "nta": "MN0801",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 40,
    "blockCount": 92,
    "center": [
      40.765507,
      -73.956663
    ]
  },
  {
    "id": "manhattan-lincoln-square",
    "name": "Lincoln Square",
    "ntaName": "Upper West Side-Lincoln Square",
    "nta": "MN0701",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 40,
    "blockCount": 60,
    "center": [
      40.775404,
      -73.983722
    ]
  },
  {
    "id": "manhattan-murray-hill",
    "name": "Murray Hill",
    "ntaName": "Murray Hill-Kips Bay",
    "nta": "MN0603",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 40,
    "blockCount": 83,
    "center": [
      40.745436,
      -73.976217
    ]
  },
  {
    "id": "manhattan-yorkville",
    "name": "Yorkville",
    "ntaName": "Upper East Side-Yorkville",
    "nta": "MN0803",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 35,
    "blockCount": 79,
    "center": [
      40.778325,
      -73.947557
    ]
  },
  {
    "id": "manhattan-upper-west-side",
    "name": "Upper West Side",
    "ntaName": "Upper West Side (Central)",
    "nta": "MN0702",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 30,
    "blockCount": 118,
    "center": [
      40.78775,
      -73.975622
    ]
  },
  {
    "id": "manhattan-chinatown",
    "name": "Chinatown",
    "ntaName": "Chinatown-Two Bridges",
    "nta": "MN0301",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 28,
    "blockCount": 71,
    "center": [
      40.713533,
      -73.99385
    ]
  },
  {
    "id": "manhattan-lower-east-side",
    "name": "Lower East Side",
    "ntaName": "Lower East Side",
    "nta": "MN0302",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 25,
    "blockCount": 94,
    "center": [
      40.717759,
      -73.98571
    ]
  },
  {
    "id": "manhattan-manhattan-valley",
    "name": "Manhattan Valley",
    "ntaName": "Upper West Side-Manhattan Valley",
    "nta": "MN0703",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 22,
    "blockCount": 60,
    "center": [
      40.799244,
      -73.966372
    ]
  },
  {
    "id": "manhattan-stuyvesant-town",
    "name": "Stuyvesant Town",
    "ntaName": "Stuyvesant Town-Peter Cooper Village",
    "nta": "MN0601",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 22,
    "blockCount": 7,
    "center": [
      40.731508,
      -73.973456
    ]
  },
  {
    "id": "manhattan-morningside-heights",
    "name": "Morningside Heights",
    "ntaName": "Morningside Heights",
    "nta": "MN0901",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 18,
    "blockCount": 46,
    "center": [
      40.809019,
      -73.961272
    ]
  },
  {
    "id": "manhattan-randalls-island",
    "name": "Randall's Island",
    "ntaName": "Randall's Island",
    "nta": "MN1191",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "park",
    "pricePerBlock": 15,
    "blockCount": 10,
    "center": [
      40.79415,
      -73.926532
    ]
  },
  {
    "id": "manhattan-highbridge-park",
    "name": "Highbridge Park",
    "ntaName": "Highbridge Park",
    "nta": "MN1291",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 3,
    "center": [
      40.84532,
      -73.930264
    ]
  },
  {
    "id": "manhattan-inwood-hill-park",
    "name": "Inwood Hill Park",
    "ntaName": "Inwood Hill Park",
    "nta": "MN1292",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "park",
    "pricePerBlock": 12,
    "blockCount": 13,
    "center": [
      40.875562,
      -73.911607
    ]
  },
  {
    "id": "manhattan-south-harlem",
    "name": "South Harlem",
    "ntaName": "Harlem (South)",
    "nta": "MN1001",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 12,
    "blockCount": 82,
    "center": [
      40.804821,
      -73.952189
    ]
  },
  {
    "id": "manhattan-east-harlem",
    "name": "East Harlem",
    "ntaName": "East Harlem (South)",
    "nta": "MN1101",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 86,
    "center": [
      40.790581,
      -73.946558
    ]
  },
  {
    "id": "manhattan-hamilton-heights",
    "name": "Hamilton Heights",
    "ntaName": "Hamilton Heights-Sugar Hill",
    "nta": "MN0903",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 72,
    "center": [
      40.826565,
      -73.947483
    ]
  },
  {
    "id": "manhattan-harlem",
    "name": "Harlem",
    "ntaName": "Harlem (North)",
    "nta": "MN1002",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 105,
    "center": [
      40.818733,
      -73.941775
    ]
  },
  {
    "id": "manhattan-manhattanville",
    "name": "Manhattanville",
    "ntaName": "Manhattanville-West Harlem",
    "nta": "MN0902",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 42,
    "center": [
      40.817492,
      -73.955285
    ]
  },
  {
    "id": "manhattan-east-harlem-north",
    "name": "East Harlem North",
    "ntaName": "East Harlem (North)",
    "nta": "MN1102",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 9,
    "blockCount": 127,
    "center": [
      40.80209,
      -73.937571
    ]
  },
  {
    "id": "manhattan-hudson-heights",
    "name": "Hudson Heights",
    "ntaName": "Washington Heights (North)",
    "nta": "MN1202",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 109,
    "center": [
      40.854325,
      -73.932999
    ]
  },
  {
    "id": "manhattan-washington-heights",
    "name": "Washington Heights",
    "ntaName": "Washington Heights (South)",
    "nta": "MN1201",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 8,
    "blockCount": 124,
    "center": [
      40.840727,
      -73.939731
    ]
  },
  {
    "id": "manhattan-inwood",
    "name": "Inwood",
    "ntaName": "Inwood",
    "nta": "MN1203",
    "borough": "Manhattan",
    "boroughId": "manhattan",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 73,
    "center": [
      40.866337,
      -73.919369
    ]
  },
  {
    "id": "queens-long-island-city",
    "name": "Long Island City",
    "ntaName": "Long Island City-Hunters Point",
    "nta": "QN0201",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 28,
    "blockCount": 148,
    "center": [
      40.74657,
      -73.949021
    ]
  },
  {
    "id": "queens-astoria-central",
    "name": "Astoria (Central)",
    "ntaName": "Astoria (Central)",
    "nta": "QN0103",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 105,
    "center": [
      40.764503,
      -73.923389
    ]
  },
  {
    "id": "queens-astoria-east",
    "name": "Astoria (East)",
    "ntaName": "Astoria (East)-Woodside (North)",
    "nta": "QN0104",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 126,
    "center": [
      40.759413,
      -73.911002
    ]
  },
  {
    "id": "queens-astoria-north",
    "name": "Astoria (North)",
    "ntaName": "Astoria (North)-Ditmars-Steinway",
    "nta": "QN0101",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 221,
    "center": [
      40.774361,
      -73.906523
    ]
  },
  {
    "id": "queens-astoria-park",
    "name": "Astoria Park",
    "ntaName": "Astoria Park",
    "nta": "QN0191",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 16,
    "blockCount": 3,
    "center": [
      40.779698,
      -73.921548
    ]
  },
  {
    "id": "queens-old-astoria",
    "name": "Old Astoria",
    "ntaName": "Old Astoria-Hallets Point",
    "nta": "QN0102",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 63,
    "center": [
      40.771968,
      -73.930778
    ]
  },
  {
    "id": "queens-sunnyside",
    "name": "Sunnyside",
    "ntaName": "Sunnyside",
    "nta": "QN0202",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 16,
    "blockCount": 224,
    "center": [
      40.740043,
      -73.925269
    ]
  },
  {
    "id": "queens-sunnyside-yards-north",
    "name": "Sunnyside Yards (North)",
    "ntaName": "Sunnyside Yards (North)",
    "nta": "QN0161",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 16,
    "blockCount": 2,
    "center": [
      40.752232,
      -73.915171
    ]
  },
  {
    "id": "queens-sunnyside-yards-south",
    "name": "Sunnyside Yards (South)",
    "ntaName": "Sunnyside Yards (South)",
    "nta": "QN0261",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 16,
    "blockCount": 6,
    "center": [
      40.749376,
      -73.925106
    ]
  },
  {
    "id": "queens-forest-hills",
    "name": "Forest Hills",
    "ntaName": "Forest Hills",
    "nta": "QN0602",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 14,
    "blockCount": 330,
    "center": [
      40.721169,
      -73.847259
    ]
  },
  {
    "id": "queens-jackson-heights",
    "name": "Jackson Heights",
    "ntaName": "Jackson Heights",
    "nta": "QN0301",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 14,
    "blockCount": 215,
    "center": [
      40.755107,
      -73.88608
    ]
  },
  {
    "id": "queens-alley-pond-park",
    "name": "Alley Pond Park",
    "ntaName": "Alley Pond Park",
    "nta": "QN1191",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 17,
    "center": [
      40.757943,
      -73.747274
    ]
  },
  {
    "id": "queens-auburndale",
    "name": "Auburndale",
    "ntaName": "Auburndale",
    "nta": "QN1101",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 349,
    "center": [
      40.755255,
      -73.786047
    ]
  },
  {
    "id": "queens-baisley-park",
    "name": "Baisley Park",
    "ntaName": "Baisley Park",
    "nta": "QN1203",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 263,
    "center": [
      40.679336,
      -73.790102
    ]
  },
  {
    "id": "queens-bay-terrace",
    "name": "Bay Terrace",
    "ntaName": "Bay Terrace-Clearview",
    "nta": "QN0703",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 119,
    "center": [
      40.780676,
      -73.791328
    ]
  },
  {
    "id": "queens-bayside",
    "name": "Bayside",
    "ntaName": "Bayside",
    "nta": "QN1102",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 381,
    "center": [
      40.761646,
      -73.768437
    ]
  },
  {
    "id": "queens-bellerose",
    "name": "Bellerose",
    "ntaName": "Bellerose",
    "nta": "QN1302",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 218,
    "center": [
      40.733238,
      -73.724
    ]
  },
  {
    "id": "queens-breezy-point",
    "name": "Breezy Point",
    "ntaName": "Breezy Point-Belle Harbor-Rockaway Park-Broad Channel",
    "nta": "QN1403",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 207,
    "center": [
      40.584653,
      -73.841225
    ]
  },
  {
    "id": "queens-calvary-and-mount-zion-cemeteries",
    "name": "Calvary & Mount Zion Cemeteries",
    "ntaName": "Calvary & Mount Zion Cemeteries",
    "nta": "QN0271",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 5,
    "center": [
      40.732569,
      -73.911229
    ]
  },
  {
    "id": "queens-cambria-heights",
    "name": "Cambria Heights",
    "ntaName": "Cambria Heights",
    "nta": "QN1304",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 185,
    "center": [
      40.69457,
      -73.735906
    ]
  },
  {
    "id": "queens-college-point",
    "name": "College Point",
    "ntaName": "College Point",
    "nta": "QN0701",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 374,
    "center": [
      40.782603,
      -73.841124
    ]
  },
  {
    "id": "queens-corona",
    "name": "Corona",
    "ntaName": "Corona",
    "nta": "QN0402",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 158,
    "center": [
      40.743442,
      -73.85955
    ]
  },
  {
    "id": "queens-cunningham-park",
    "name": "Cunningham Park",
    "ntaName": "Cunningham Park",
    "nta": "QN0891",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 6,
    "center": [
      40.734089,
      -73.767881
    ]
  },
  {
    "id": "queens-douglaston",
    "name": "Douglaston",
    "ntaName": "Douglaston-Little Neck",
    "nta": "QN1103",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 302,
    "center": [
      40.766678,
      -73.739054
    ]
  },
  {
    "id": "queens-east-elmhurst",
    "name": "East Elmhurst",
    "ntaName": "East Elmhurst",
    "nta": "QN0302",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 157,
    "center": [
      40.763366,
      -73.872039
    ]
  },
  {
    "id": "queens-east-flushing",
    "name": "East Flushing",
    "ntaName": "East Flushing",
    "nta": "QN0705",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 166,
    "center": [
      40.753865,
      -73.809136
    ]
  },
  {
    "id": "queens-elmhurst",
    "name": "Elmhurst",
    "ntaName": "Elmhurst",
    "nta": "QN0401",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 256,
    "center": [
      40.740279,
      -73.878605
    ]
  },
  {
    "id": "queens-far-rockaway",
    "name": "Far Rockaway",
    "ntaName": "Far Rockaway-Bayswater",
    "nta": "QN1401",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 300,
    "center": [
      40.483586,
      -73.540399
    ]
  },
  {
    "id": "queens-flushing",
    "name": "Flushing",
    "ntaName": "Flushing-Willets Point",
    "nta": "QN0707",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 141,
    "center": [
      40.760733,
      -73.830437
    ]
  },
  {
    "id": "queens-flushing-meadows",
    "name": "Flushing Meadows",
    "ntaName": "Flushing Meadows-Corona Park",
    "nta": "QN8191",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 8,
    "center": [
      40.737119,
      -73.838637
    ]
  },
  {
    "id": "queens-forest-park",
    "name": "Forest Park",
    "ntaName": "Forest Park",
    "nta": "QN8291",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 3,
    "center": [
      40.701705,
      -73.852481
    ]
  },
  {
    "id": "queens-fort-totten",
    "name": "Fort Totten",
    "ntaName": "Fort Totten",
    "nta": "QN0761",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 5,
    "center": [
      40.791807,
      -73.776045
    ]
  },
  {
    "id": "queens-fresh-meadows",
    "name": "Fresh Meadows",
    "ntaName": "Fresh Meadows-Utopia",
    "nta": "QN0803",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 135,
    "center": [
      40.734094,
      -73.788891
    ]
  },
  {
    "id": "queens-glen-oaks",
    "name": "Glen Oaks",
    "ntaName": "Glen Oaks-Floral Park-New Hyde Park",
    "nta": "QN1301",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 205,
    "center": [
      40.742897,
      -73.708634
    ]
  },
  {
    "id": "queens-glendale",
    "name": "Glendale",
    "ntaName": "Glendale",
    "nta": "QN0503",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 182,
    "center": [
      40.702844,
      -73.878217
    ]
  },
  {
    "id": "queens-highland-park",
    "name": "Highland Park",
    "ntaName": "Highland Park-Cypress Hills Cemeteries (North)",
    "nta": "QN0574",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 5,
    "center": [
      40.692729,
      -73.885235
    ]
  },
  {
    "id": "queens-hollis",
    "name": "Hollis",
    "ntaName": "Hollis",
    "nta": "QN1206",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 153,
    "center": [
      40.711741,
      -73.762288
    ]
  },
  {
    "id": "queens-howard-beach",
    "name": "Howard Beach",
    "ntaName": "Howard Beach-Lindenwood",
    "nta": "QN1003",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 316,
    "center": [
      40.659146,
      -73.842901
    ]
  },
  {
    "id": "queens-jacob-riis-park",
    "name": "Jacob Riis Park",
    "ntaName": "Jacob Riis Park-Fort Tilden-Breezy Point Tip",
    "nta": "QN8492",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 4,
    "center": [
      40.567975,
      -73.87332
    ]
  },
  {
    "id": "queens-jamaica",
    "name": "Jamaica",
    "ntaName": "Jamaica",
    "nta": "QN1201",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 269,
    "center": [
      40.703589,
      -73.797644
    ]
  },
  {
    "id": "queens-jamaica-bay-east",
    "name": "Jamaica Bay (East)",
    "ntaName": "Jamaica Bay (East)",
    "nta": "QN8491",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 16,
    "center": [
      40.589506,
      -73.835077
    ]
  },
  {
    "id": "queens-jamaica-estates",
    "name": "Jamaica Estates",
    "ntaName": "Jamaica Estates-Holliswood",
    "nta": "QN0804",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 147,
    "center": [
      40.720788,
      -73.778792
    ]
  },
  {
    "id": "queens-jamaica-hills",
    "name": "Jamaica Hills",
    "ntaName": "Jamaica Hills-Briarwood",
    "nta": "QN0805",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 148,
    "center": [
      40.712045,
      -73.808486
    ]
  },
  {
    "id": "queens-john-f.-kennedy-international-airport",
    "name": "John F. Kennedy International Airport",
    "ntaName": "John F. Kennedy International Airport",
    "nta": "QN8381",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 4,
    "center": [
      40.648965,
      -73.769764
    ]
  },
  {
    "id": "queens-kew-gardens",
    "name": "Kew Gardens",
    "ntaName": "Kew Gardens",
    "nta": "QN0901",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 84,
    "center": [
      40.707005,
      -73.828945
    ]
  },
  {
    "id": "queens-kew-gardens-hills",
    "name": "Kew Gardens Hills",
    "ntaName": "Kew Gardens Hills",
    "nta": "QN0801",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 139,
    "center": [
      40.725082,
      -73.819595
    ]
  },
  {
    "id": "queens-kissena-park",
    "name": "Kissena Park",
    "ntaName": "Kissena Park",
    "nta": "QN0791",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 2,
    "center": [
      40.745245,
      -73.803674
    ]
  },
  {
    "id": "queens-laguardia-airport",
    "name": "LaGuardia Airport",
    "ntaName": "LaGuardia Airport",
    "nta": "QN8081",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 7,
    "center": [
      40.783239,
      -73.871698
    ]
  },
  {
    "id": "queens-laurelton",
    "name": "Laurelton",
    "ntaName": "Laurelton",
    "nta": "QN1305",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 243,
    "center": [
      40.675704,
      -73.744979
    ]
  },
  {
    "id": "queens-maspeth",
    "name": "Maspeth",
    "ntaName": "Maspeth",
    "nta": "QN0501",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 295,
    "center": [
      40.723576,
      -73.901331
    ]
  },
  {
    "id": "queens-middle-village",
    "name": "Middle Village",
    "ntaName": "Middle Village",
    "nta": "QN0504",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 222,
    "center": [
      40.719269,
      -73.878073
    ]
  },
  {
    "id": "queens-middle-village-cemetery",
    "name": "Middle Village Cemetery",
    "ntaName": "Middle Village Cemetery",
    "nta": "QN0572",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 1,
    "center": [
      40.708854,
      -73.88508
    ]
  },
  {
    "id": "queens-montefiore-cemetery",
    "name": "Montefiore Cemetery",
    "ntaName": "Montefiore Cemetery",
    "nta": "QN1371",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 1,
    "center": [
      40.685696,
      -73.742011
    ]
  },
  {
    "id": "queens-mount-hebron-and-cedar-grove-cemeteries",
    "name": "Mount Hebron & Cedar Grove Cemeteries",
    "ntaName": "Mount Hebron & Cedar Grove Cemeteries",
    "nta": "QN0871",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 2,
    "center": [
      40.736077,
      -73.833445
    ]
  },
  {
    "id": "queens-mount-olivet-and-all-faiths-cemeteries",
    "name": "Mount Olivet & All Faiths Cemeteries",
    "ntaName": "Mount Olivet & All Faiths Cemeteries",
    "nta": "QN0571",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 5,
    "center": [
      40.718233,
      -73.894575
    ]
  },
  {
    "id": "queens-murray-hill",
    "name": "Murray Hill",
    "ntaName": "Murray Hill-Broadway Flushing",
    "nta": "QN0704",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 328,
    "center": [
      40.768728,
      -73.809685
    ]
  },
  {
    "id": "queens-north-corona",
    "name": "North Corona",
    "ntaName": "North Corona",
    "nta": "QN0303",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 79,
    "center": [
      40.753978,
      -73.863456
    ]
  },
  {
    "id": "queens-oakland-gardens",
    "name": "Oakland Gardens",
    "ntaName": "Oakland Gardens-Hollis Hills",
    "nta": "QN1104",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 144,
    "center": [
      40.739166,
      -73.754884
    ]
  },
  {
    "id": "queens-ozone-park",
    "name": "Ozone Park",
    "ntaName": "Ozone Park",
    "nta": "QN1002",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 183,
    "center": [
      40.675349,
      -73.846502
    ]
  },
  {
    "id": "queens-ozone-park-north",
    "name": "Ozone Park (North)",
    "ntaName": "Ozone Park (North)",
    "nta": "QN0904",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 136,
    "center": [
      40.684727,
      -73.850058
    ]
  },
  {
    "id": "queens-pomonok",
    "name": "Pomonok",
    "ntaName": "Pomonok-Electchester-Hillcrest",
    "nta": "QN0802",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 184,
    "center": [
      40.727175,
      -73.803346
    ]
  },
  {
    "id": "queens-queens-village",
    "name": "Queens Village",
    "ntaName": "Queens Village",
    "nta": "QN1303",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 436,
    "center": [
      40.716015,
      -73.741654
    ]
  },
  {
    "id": "queens-queensboro-hill",
    "name": "Queensboro Hill",
    "ntaName": "Queensboro Hill",
    "nta": "QN0706",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 143,
    "center": [
      40.742963,
      -73.822436
    ]
  },
  {
    "id": "queens-queensbridge",
    "name": "Queensbridge",
    "ntaName": "Queensbridge-Ravenswood-Dutch Kills",
    "nta": "QN0105",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 136,
    "center": [
      40.757874,
      -73.936576
    ]
  },
  {
    "id": "queens-rego-park",
    "name": "Rego Park",
    "ntaName": "Rego Park",
    "nta": "QN0601",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 100,
    "center": [
      40.725539,
      -73.863347
    ]
  },
  {
    "id": "queens-richmond-hill",
    "name": "Richmond Hill",
    "ntaName": "Richmond Hill",
    "nta": "QN0902",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 175,
    "center": [
      40.697444,
      -73.834139
    ]
  },
  {
    "id": "queens-ridgewood",
    "name": "Ridgewood",
    "ntaName": "Ridgewood",
    "nta": "QN0502",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 255,
    "center": [
      40.705065,
      -73.904515
    ]
  },
  {
    "id": "queens-rockaway-beach",
    "name": "Rockaway Beach",
    "ntaName": "Rockaway Beach-Arverne-Edgemere",
    "nta": "QN1402",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 203,
    "center": [
      40.592634,
      -73.796559
    ]
  },
  {
    "id": "queens-rockaway-community-park",
    "name": "Rockaway Community Park",
    "ntaName": "Rockaway Community Park",
    "nta": "QN1491",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 13,
    "center": [
      40.60395,
      -73.775719
    ]
  },
  {
    "id": "queens-rosedale",
    "name": "Rosedale",
    "ntaName": "Rosedale",
    "nta": "QN1307",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 279,
    "center": [
      40.660228,
      -73.734339
    ]
  },
  {
    "id": "queens-south-jamaica",
    "name": "South Jamaica",
    "ntaName": "South Jamaica",
    "nta": "QN1202",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 247,
    "center": [
      40.694024,
      -73.792428
    ]
  },
  {
    "id": "queens-south-ozone-park",
    "name": "South Ozone Park",
    "ntaName": "South Ozone Park",
    "nta": "QN1001",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 443,
    "center": [
      40.676454,
      -73.818098
    ]
  },
  {
    "id": "queens-south-richmond-hill",
    "name": "South Richmond Hill",
    "ntaName": "South Richmond Hill",
    "nta": "QN0903",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 99,
    "center": [
      40.691745,
      -73.824147
    ]
  },
  {
    "id": "queens-spring-creek-park",
    "name": "Spring Creek Park",
    "ntaName": "Spring Creek Park",
    "nta": "QN1091",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "park",
    "pricePerBlock": 10,
    "blockCount": 3,
    "center": [
      40.648009,
      -73.840027
    ]
  },
  {
    "id": "queens-springfield-gardens-north",
    "name": "Springfield Gardens (North)",
    "ntaName": "Springfield Gardens (North)-Rochdale Village",
    "nta": "QN1204",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 169,
    "center": [
      40.672604,
      -73.771693
    ]
  },
  {
    "id": "queens-springfield-gardens-south",
    "name": "Springfield Gardens (South)",
    "ntaName": "Springfield Gardens (South)-Brookville",
    "nta": "QN1306",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 254,
    "center": [
      40.661919,
      -73.763695
    ]
  },
  {
    "id": "queens-st.-albans",
    "name": "St. Albans",
    "ntaName": "St. Albans",
    "nta": "QN1205",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 460,
    "center": [
      40.694092,
      -73.761665
    ]
  },
  {
    "id": "queens-st.-john-cemetery",
    "name": "St. John Cemetery",
    "ntaName": "St. John Cemetery",
    "nta": "QN0573",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 2,
    "center": [
      40.713685,
      -73.86709
    ]
  },
  {
    "id": "queens-st.-michaels-cemetery",
    "name": "St. Michael's Cemetery",
    "ntaName": "St. Michael's Cemetery",
    "nta": "QN0171",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 2,
    "center": [
      40.765027,
      -73.901259
    ]
  },
  {
    "id": "queens-whitestone",
    "name": "Whitestone",
    "ntaName": "Whitestone-Beechhurst",
    "nta": "QN0702",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 281,
    "center": [
      40.78784,
      -73.811489
    ]
  },
  {
    "id": "queens-woodhaven",
    "name": "Woodhaven",
    "ntaName": "Woodhaven",
    "nta": "QN0905",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 163,
    "center": [
      40.690908,
      -73.857542
    ]
  },
  {
    "id": "queens-woodside",
    "name": "Woodside",
    "ntaName": "Woodside",
    "nta": "QN0203",
    "borough": "Queens",
    "boroughId": "queens",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 221,
    "center": [
      40.743002,
      -73.901123
    ]
  },
  {
    "id": "staten-island-st.-george",
    "name": "St. George",
    "ntaName": "St. George-New Brighton",
    "nta": "SI0101",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 10,
    "blockCount": 110,
    "center": [
      40.641423,
      -74.086795
    ]
  },
  {
    "id": "staten-island-annadale",
    "name": "Annadale",
    "ntaName": "Annadale-Huguenot-Prince's Bay-Woodrow",
    "nta": "SI0304",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 584,
    "center": [
      40.532229,
      -74.19177
    ]
  },
  {
    "id": "staten-island-arden-heights",
    "name": "Arden Heights",
    "ntaName": "Arden Heights-Rossville",
    "nta": "SI0303",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 272,
    "center": [
      40.553004,
      -74.194903
    ]
  },
  {
    "id": "staten-island-fort-wadsworth",
    "name": "Fort Wadsworth",
    "ntaName": "Fort Wadsworth",
    "nta": "SI9561",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 3,
    "center": [
      40.600893,
      -74.059381
    ]
  },
  {
    "id": "staten-island-freshkills-park-north",
    "name": "Freshkills Park (North)",
    "ntaName": "Freshkills Park (North)",
    "nta": "SI0291",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 10,
    "center": [
      40.582253,
      -74.177922
    ]
  },
  {
    "id": "staten-island-freshkills-park-south",
    "name": "Freshkills Park (South)",
    "ntaName": "Freshkills Park (South)",
    "nta": "SI0391",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 7,
    "center": [
      40.566045,
      -74.199815
    ]
  },
  {
    "id": "staten-island-grasmere",
    "name": "Grasmere",
    "ntaName": "Grasmere-Arrochar-South Beach-Dongan Hills",
    "nta": "SI0201",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 362,
    "center": [
      40.594905,
      -74.08318
    ]
  },
  {
    "id": "staten-island-great-kills",
    "name": "Great Kills",
    "ntaName": "Great Kills-Eltingville",
    "nta": "SI0302",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 563,
    "center": [
      40.548286,
      -74.155971
    ]
  },
  {
    "id": "staten-island-great-kills-park",
    "name": "Great Kills Park",
    "ntaName": "Great Kills Park",
    "nta": "SI9593",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 8,
    "center": [
      40.5337,
      -74.126615
    ]
  },
  {
    "id": "staten-island-hoffman-and-swinburne-islands",
    "name": "Hoffman & Swinburne Islands",
    "ntaName": "Hoffman & Swinburne Islands",
    "nta": "SI9591",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 2,
    "center": [
      40.579799,
      -74.052536
    ]
  },
  {
    "id": "staten-island-mariners-harbor",
    "name": "Mariner's Harbor",
    "ntaName": "Mariner's Harbor-Arlington-Graniteville",
    "nta": "SI0107",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 197,
    "center": [
      40.629067,
      -74.159859
    ]
  },
  {
    "id": "staten-island-miller-field",
    "name": "Miller Field",
    "ntaName": "Miller Field",
    "nta": "SI9592",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 5,
    "center": [
      40.56685,
      -74.091057
    ]
  },
  {
    "id": "staten-island-new-dorp",
    "name": "New Dorp",
    "ntaName": "New Dorp-Midland Beach",
    "nta": "SI0202",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 425,
    "center": [
      40.57472,
      -74.101113
    ]
  },
  {
    "id": "staten-island-new-springville",
    "name": "New Springville",
    "ntaName": "New Springville-Willowbrook-Bulls Head-Travis",
    "nta": "SI0204",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 275,
    "center": [
      40.598887,
      -74.167782
    ]
  },
  {
    "id": "staten-island-oakwood",
    "name": "Oakwood",
    "ntaName": "Oakwood-Richmondtown",
    "nta": "SI0301",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 320,
    "center": [
      40.562635,
      -74.125058
    ]
  },
  {
    "id": "staten-island-port-richmond",
    "name": "Port Richmond",
    "ntaName": "Port Richmond",
    "nta": "SI0106",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 151,
    "center": [
      40.633582,
      -74.133577
    ]
  },
  {
    "id": "staten-island-rosebank",
    "name": "Rosebank",
    "ntaName": "Rosebank-Shore Acres-Park Hill",
    "nta": "SI0103",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 154,
    "center": [
      40.611315,
      -74.07365
    ]
  },
  {
    "id": "staten-island-snug-harbor",
    "name": "Snug Harbor",
    "ntaName": "Snug Harbor",
    "nta": "SI0191",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "park",
    "pricePerBlock": 6,
    "blockCount": 3,
    "center": [
      40.643095,
      -74.106104
    ]
  },
  {
    "id": "staten-island-todt-hill",
    "name": "Todt Hill",
    "ntaName": "Todt Hill-Emerson Hill-Lighthouse Hill-Manor Heights",
    "nta": "SI0203",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 468,
    "center": [
      40.595774,
      -74.121561
    ]
  },
  {
    "id": "staten-island-tompkinsville",
    "name": "Tompkinsville",
    "ntaName": "Tompkinsville-Stapleton-Clifton-Fox Hills",
    "nta": "SI0102",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 119,
    "center": [
      40.62552,
      -74.079689
    ]
  },
  {
    "id": "staten-island-tottenville",
    "name": "Tottenville",
    "ntaName": "Tottenville-Charleston",
    "nta": "SI0305",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 276,
    "center": [
      40.519031,
      -74.239162
    ]
  },
  {
    "id": "staten-island-west-new-brighton",
    "name": "West New Brighton",
    "ntaName": "West New Brighton-Silver Lake-Grymes Hill",
    "nta": "SI0104",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 289,
    "center": [
      40.628592,
      -74.102792
    ]
  },
  {
    "id": "staten-island-westerleigh",
    "name": "Westerleigh",
    "ntaName": "Westerleigh-Castleton Corners",
    "nta": "SI0105",
    "borough": "Staten Island",
    "boroughId": "staten-island",
    "type": "neighborhood",
    "pricePerBlock": 6,
    "blockCount": 410,
    "center": [
      40.617045,
      -74.131608
    ]
  }
];

export const BLOCKS_BY_BOROUGH: Record<BoroughId, number> = {
  "manhattan": 2942,
  "bronx": 4214,
  "brooklyn": 8405,
  "queens": 12786,
  "staten-island": 5013
};

export const TOTAL_BLOCKS = Object.values(BLOCKS_BY_BOROUGH).reduce((a, b) => a + b, 0);
export const NYC_TAX_BLOCKS = 28802;
