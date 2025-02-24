"use client";

import React, { useState, useEffect } from "react";
import { MineralDeposit } from "@/types/Items";
import { ActiveAutomatonForMining } from "@/app/components/(vehicles)/(automatons)/ActiveAutomaton";
import MineralDeposits from "./AvailableDeposits";
import MineralsInventoryGrid from "../../(inventory)/mineralsPanel";

interface CollectMineralPanelProps {
  deposit: MineralDeposit;
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
}

export const SelectMineralPanel: React.FC<CollectMineralPanelProps> = ({ deposit }) => {
  const [showAutomatonPanel, setShowAutomatonPanel] = useState(false);
  const [mineralName, setMineralName] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('/api/gameplay/inventory');
        const inventoryItems: InventoryItem[] = await response.json();

        // Find the item corresponding to the deposit
        const item = inventoryItems.find(
          (i) => i.id === parseInt(deposit.mineralconfiguration.mineral, 10)
        );

        if (item) {
          setMineralName(item.name);
          setIconUrl(item.icon_url);
        }
      } catch (error) {
        console.error("Failed to fetch inventory data:", error);
      }
    };

    fetchInventoryData();
  }, [deposit]);

  const handleNextStep = () => {
    setShowAutomatonPanel(true);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Mineral Details</h1>
      <div className="p-4 border rounded-lg shadow-md bg-opacity-90">
        <div className="mb-4 flex items-center">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={mineralName ?? "Mineral"}
              className="w-16 h-16 mr-4"
            />
          ) : (
            <div className="w-16 h-16 mr-4 bg-gray-200"></div>
          )}
          <div>
            <h3 className="text-lg font-bold">
              Collect {mineralName ?? deposit.mineralconfiguration.mineral} from this deposit
            </h3>
            <p className="text-sm">
              {deposit.mineralconfiguration.quantity} {mineralName ?? deposit.mineralconfiguration.mineral} remaining
            </p>
            <p className="text-sm text-gray-600">Cargo Space: 1</p>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleNextStep}
        >
          Next step
        </button>

        {showAutomatonPanel && (
          <div className="mt-4">
            <ActiveAutomatonForMining deposit={deposit} />
          </div>
        )}
      </div>
    </div>
  );
};

export const MiningScene: React.FC = () => {
  const [selectedDeposit, setSelectedDeposit] = useState<null | MineralDeposit>(null);
  const handleSelectDeposit = (deposit: MineralDeposit) => {
    setSelectedDeposit(deposit);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 md:w-3/5 p-4 px-12 rounded-r-lg shadow-lg md:rounded-r-lg border-r border-red-300">
        <MineralDeposits onSelectDeposit={handleSelectDeposit} />
        <MineralsInventoryGrid />
      </div>
      <div className="flex-1 md:w-2/5 p-4 rounded-l-lg shadow-lg md:rounded-l-lg border-l border-red-300">
        {selectedDeposit ? (
          <SelectMineralPanel deposit={selectedDeposit} />
        ) : (
          <p>Select a mineral deposit to see details.</p>
        )}
      </div>
    </div>
  );
};