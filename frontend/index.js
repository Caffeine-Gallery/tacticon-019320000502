import { backend } from "declarations/backend";

class Game {
    constructor() {
        this.selectedBuilding = null;
        this.init();
    }

    async init() {
        await this.refreshGameState();
        setInterval(() => this.refreshGameState(), 5000);
    }

    showLoading() {
        document.getElementById('loading').classList.remove('d-none');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('d-none');
    }

    async refreshGameState() {
        try {
            const gameState = await backend.getGameState();
            this.updateResources(gameState.resources);
            this.updateBuildings(gameState.buildings);
        } catch (error) {
            console.error("Error refreshing game state:", error);
        }
    }

    updateResources(resources) {
        document.getElementById('gold').textContent = resources.gold;
        document.getElementById('wood').textContent = resources.wood;
        document.getElementById('stone').textContent = resources.stone;
    }

    updateBuildings(buildings) {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        buildings.forEach((building, index) => {
            const buildingElement = document.createElement('div');
            buildingElement.className = `building ${building.buildingType}`;
            buildingElement.onclick = () => this.selectBuilding(index, building);
            buildingElement.innerHTML = `
                <div class="building-content">
                    <div class="building-type">${building.buildingType}</div>
                    <div class="building-level">Level ${building.level}</div>
                </div>
            `;
            gameBoard.appendChild(buildingElement);
        });
    }

    async build(buildingType) {
        try {
            this.showLoading();
            await backend.buildStructure(buildingType);
            await this.refreshGameState();
        } catch (error) {
            console.error("Error building structure:", error);
            alert("Cannot build structure. Check resources!");
        } finally {
            this.hideLoading();
        }
    }

    async selectBuilding(index, building) {
        this.selectedBuilding = index;
        const buildingInfo = document.getElementById('buildingInfo');
        buildingInfo.innerHTML = `
            <h5>${building.buildingType} (Level ${building.level})</h5>
            <p>Production per cycle:</p>
            <ul>
                <li>Gold: ${building.production.gold}</li>
                <li>Wood: ${building.production.wood}</li>
                <li>Stone: ${building.production.stone}</li>
            </ul>
            <button class="btn btn-success w-100" onclick="game.upgradeBuilding(${index})">
                Upgrade (50 gold)
            </button>
        `;
    }

    async upgradeBuilding(index) {
        try {
            this.showLoading();
            await backend.upgradeBuilding(index);
            await this.refreshGameState();
        } catch (error) {
            console.error("Error upgrading building:", error);
            alert("Cannot upgrade building. Check resources!");
        } finally {
            this.hideLoading();
        }
    }
}

window.game = new Game();
