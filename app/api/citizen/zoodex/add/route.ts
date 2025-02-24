import { NextRequest, NextResponse } from 'next/server';

interface Recipe {
  [key: string]: number;
}

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  icon_url: string;
  ItemCategory: string;
  parentItem: number | null;
  itemLevel: number;
  recipe?: Recipe; 
}

// Mock inventory items data
const inventoryItems: InventoryItem[] = [
  { id: 11, name: 'Coal', description: 'You can burn this to create power', cost: 1, icon_url: 'https://raw.githubusercontent.com/Signal-K/client/initialClassification/public/assets/Inventory/Items/Coal.png', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1 },
  { id: 12, name: 'Telescope Signal Receiver', description: 'This tool is used to receive transmissions from your transiting telescope and decode them into readable data. It is also the first component of your main telescope array', cost: 1, icon_url: 'https://github.com/Signal-K/client/blob/initialClassification/public/assets/Inventory/Structures/Telescope2.png?raw=true', ItemCategory: 'Structure', parentItem: null, itemLevel: 1, recipe: { '13': 3, '15': 2 } }, // Originally pointed towards 2 alloy
  { id: 13, name: 'Silicon', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 14, name: 'Transiting Telescope', description: '', cost: 1, icon_url: 'https://github.com/Signal-K/client/blob/initialClassification/public/assets/Inventory/Structures/TelescopeReceiver.png?raw=true', ItemCategory: 'Structure', parentItem: 12, itemLevel: 1, recipe: { '13': 2, '15': 1 } },
  { id: 15, name: 'Iron', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 16, name: 'Nickel', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 17, name: 'Alloy', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 18, name: 'Fuel', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 19, name: 'Copper', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 20, name: 'Chromium', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 21, name: 'Water', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 22, name: 'Vehicle Structure', description: '', cost: 1, icon_url: '/22.png', ItemCategory: 'Structure', parentItem: null, itemLevel: 1, recipe: { '17': 4, '18': 2 } },
  { id: 23, name: 'Rover 1', description: '', cost: 1, icon_url: '/roover.png', ItemCategory: 'Automaton', parentItem: 22, itemLevel: 1 }, 
  { id: 24, name: 'Surveyor', description: 'This tool clips onto your telescope receiver and allows you to unlock complex stats about your anomaly.', cost: 1, icon_url: 'https://cdn.cloud.scenario.com/assets/asset_eTRkeYatYQRQRwrjjAgYA2Pq?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4uY2xvdWQuc2NlbmFyaW8uY29tL2Fzc2V0cy9hc3NldF9lVFJrZVlhdFlRUlFSd3JqakFnWUEyUHE~KiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTcyMDM5Njc5OX19fV19&Key-Pair-Id=K36FIAB9LE2OLR&Signature=G5z~cUSlmAT2IT-qEQuZVOxQsRe-Q1le4erU8YfKnKe0hfsIq4fjmWArcgikYZLDKY8N0~kgPjf0hPQuHyxpYcDWlhmh1u7esBHffDf~5bR0tqjFcChfY6d1q-OCVvwkPxU9CMOOlxmwDYK3U6049ROnSXXZvmWDM7igl~CPaqILXt0bsNEtL4KWTDAfuBkfq7vDt1Jvy0h0k3z8dQ3XKdsFenqeQozdTp6B-y-7vxEbKcUMOqhEnOW0IXg1Z6egwHBD2dUD2fQhk-jAlQ7CbWeFQ~~h~emfyuFRYT7VMkiv2GICV12SENk2KkBnsB1t3kBONrJiUKlr~ekpsilerw__', ItemCategory: 'Structure', parentItem: 12, itemLevel: 1, recipe: { '13': 1, } },
  { id: 25, name: 'Empty', description: '', cost: 1, icon_url: '', ItemCategory: 'Minerals', parentItem: null, itemLevel: 1},
  { id: 29, name: "Starter Spaceship", description: 'You bravely piloted this spaceship down to your new home', cost: 0, icon_url: '', ItemCategory: 'Vehicles', parentItem: null, itemLevel: 1},
  { id: 30, name: 'Mining station', description: 'Used for mass-mining of resources; requires finding a mineral deposit', cost: 1, icon_url: '/miningstation.png', ItemCategory: 'Structure', parentItem: null, itemLevel: 1, recipe: { '11': 1 } },
  { id: 31, name: 'Automaton Upgrade Station', description: 'Add modules to your automatons!', cost: 1, icon_url: '/camerars.png', ItemCategory: 'Structure', parentItem: 22, itemLevel: 1, recipe: { '11': 1 } },
  { id: 28, name: 'Camera Module', description: 'Your automatons can now take photos!', cost: 1, icon_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIO24cgji4a0syb8AtE9A7cSEWBqCfVU89F5OJ9kcB4-WWVs68-sw-uyJg4vmNuzKTHE8&usqp=CAU', ItemCategory: 'AutomatonModule', parentItem: 23, itemLevel: 1, recipe: { '11': 1} },
  { id: 26, name: 'Meteorology Tool', description: 'Collect cloud info', cost: 1, icon_url: '/28.png', ItemCategory: 'Structure', parentItem: null, itemLevel: 1, recipe: { '11': 1} }, // Could be updated to be linked to 12?
  { id: 32, name: 'Camera Receiver', description: 'Keep track of all the photos your anomalies have taken', cost: 1, icon_url: '/camerars.png', ItemCategory: 'Structure', parentItem: null, itemLevel: 1, recipe: { '11': 1 } },
  { id: 33, name: 'Launchpad', description: 'You can now refuel and launch spacecraft from here!', cost: 1, icon_url: '', ItemCategory: 'Structure', parentItem: null, itemLevel: 1, recipe: { '15': 1 } }, // Update to be called "VehicleStructure"
];

export async function GET(req: NextRequest) {
  return NextResponse.json(inventoryItems);
};

/*

import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient( process.env.ASTRA_TOKEN )
const db = client.db('https://4504da32-0d63-499c-bdd3-5f74c8aa2512-us-east-2.apps.astra.datastax.com');

export async function GET(req: any) {
    const colls = await db.listCollections();
    console.log('Connected to astradb: ', colls);

    return NextResponse.json({
        success: true,
    });
};*/