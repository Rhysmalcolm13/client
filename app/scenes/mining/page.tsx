"use client";

import React, { useState } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useActivePlanet } from "@/context/ActivePlanet";
import { SceneLayout } from "@/app/components/(scenes)/planetScene/layout";
import MineralDeposits from "@/app/components/(structures)/Mining/AvailableDeposits";
import { SelectMineralPanel } from "@/app/components/(structures)/Mining/MiningPanels";
import MineralsInventoryGrid from "@/app/components/(inventory)/mineralsPanel";

export default function MiningScene() {
    const supabase = useSupabaseClient();
    const session = useSession();
    const { activePlanet } = useActivePlanet();
    const [selectedDeposit, setSelectedDeposit] = useState<null | any>(null);

    const handleSelectDeposit = (deposit: any) => {
        setSelectedDeposit(deposit);
    };

    return (
        <SceneLayout>
            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="flex-1 md:w-3/5 p-4 px-12 rounded-r-lg shadow-lg md:rounded-r-lg border-r border-red-300">
                    <MineralDeposits onSelectDeposit={handleSelectDeposit} />
                    <MineralsInventoryGrid />
                </div>
                <div className="flex-1 md:w-2/5 p-4 rounded-l-lg shadow-lg md:rounded-l-lg border-l border-red-300">
                    {selectedDeposit ? (
                        <SelectMineralPanel deposit={selectedDeposit}  />
                    ) : (
                        <p>Select a mineral deposit to see details.</p>
                    )}
                </div>
            </div>
            <div></div>
        </SceneLayout>
    );
};