import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

actor {
    // Types
    public type Resources = {
        gold: Nat;
        wood: Nat;
        stone: Nat;
    };

    public type Production = {
        gold: Nat;
        wood: Nat;
        stone: Nat;
    };

    public type Building = {
        buildingType: Text;
        level: Nat;
        production: Production;
    };

    public type GameState = {
        resources: Resources;
        buildings: [Building];
    };

    // State variables
    private stable var resources : Resources = {
        gold = 100;
        wood = 50;
        stone = 30;
    };

    private stable var buildings : [Building] = [];
    private stable var lastUpdate = Time.now();

    // Helper functions
    private func getBaseProduction(buildingType: Text) : Production {
        switch (buildingType) {
            case "house" { { gold = 2; wood = 0; stone = 0 } };
            case "mine" { { gold = 0; wood = 0; stone = 1 } };
            case "lumbermill" { { gold = 0; wood = 1; stone = 0 } };
            case _ { { gold = 0; wood = 0; stone = 0 } };
        };
    };

    private func getBuildingCost(buildingType: Text) : Resources {
        switch (buildingType) {
            case "house" { { gold = 0; wood = 10; stone = 5 } };
            case "mine" { { gold = 0; wood = 15; stone = 10 } };
            case "lumbermill" { { gold = 0; wood = 5; stone = 15 } };
            case _ { { gold = 0; wood = 0; stone = 0 } };
        };
    };

    private func canAfford(cost: Resources) : Bool {
        resources.gold >= cost.gold and
        resources.wood >= cost.wood and
        resources.stone >= cost.stone
    };

    private func updateResources() {
        let now = Time.now();
        let timeDiff = now - lastUpdate;
        let cycles = Int.abs(timeDiff) / 1_000_000_000; // Convert nanoseconds to seconds
        let cyclesNat = Nat.fromInt(cycles);
        
        var totalGold = resources.gold;
        var totalWood = resources.wood;
        var totalStone = resources.stone;

        for (building in buildings.vals()) {
            totalGold += building.production.gold * cyclesNat;
            totalWood += building.production.wood * cyclesNat;
            totalStone += building.production.stone * cyclesNat;
        };

        resources := {
            gold = totalGold;
            wood = totalWood;
            stone = totalStone;
        };
        lastUpdate := now;
    };

    // Public functions
    public query func getGameState() : async GameState {
        {
            resources = resources;
            buildings = buildings;
        }
    };

    public shared func buildStructure(buildingType: Text) : async () {
        let cost = getBuildingCost(buildingType);
        
        assert(canAfford(cost));

        // Deduct resources
        resources := {
            gold = resources.gold - cost.gold;
            wood = resources.wood - cost.wood;
            stone = resources.stone - cost.stone;
        };

        // Create new building
        let baseProduction = getBaseProduction(buildingType);
        let newBuilding : Building = {
            buildingType = buildingType;
            level = 1;
            production = baseProduction;
        };

        // Add building to array
        buildings := Array.append(buildings, [newBuilding]);
    };

    public shared func upgradeBuilding(index: Nat) : async () {
        assert(index < buildings.size());
        assert(resources.gold >= 50); // Upgrade cost

        // Update resources
        resources := {
            gold = resources.gold - 50;
            wood = resources.wood;
            stone = resources.stone;
        };

        // Upgrade building
        let building = buildings[index];
        let upgradedBuilding : Building = {
            buildingType = building.buildingType;
            level = building.level + 1;
            production = {
                gold = building.production.gold * 2;
                wood = building.production.wood * 2;
                stone = building.production.stone * 2;
            };
        };

        buildings := Array.tabulate(buildings.size(), func(i: Nat) : Building {
            if (i == index) { upgradedBuilding } else { buildings[i] }
        });
    };

    // System functions
    system func preupgrade() {
        // Update resources before upgrade
        updateResources();
    };

    system func postupgrade() {
        // Reset lastUpdate after upgrade
        lastUpdate := Time.now();
    };
}
