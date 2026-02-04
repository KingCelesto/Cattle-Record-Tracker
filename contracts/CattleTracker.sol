// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CattleTracker {
    struct StatusUpdate {
        string healthStatus;
        string location;
        uint256 timestamp;
    }

    struct Animal {
        uint256 id;
        string breed;
        address currentOwner;
        StatusUpdate[] history; // Array to track timeline
    }

    mapping(uint256 => Animal) public cattle;
    uint256[] public cattleIds;

    // Register animal for the first time
    function registerAnimal(uint256 _id, string memory _breed, string memory _health, string memory _location) public {
        require(cattle[_id].id == 0, "Animal ID already exists");
        
        Animal storage newAnimal = cattle[_id];
        newAnimal.id = _id;
        newAnimal.breed = _breed;
        newAnimal.currentOwner = msg.sender;
        
        // Push the initial status to history
        newAnimal.history.push(StatusUpdate(_health, _location, block.timestamp));
        cattleIds.push(_id);
    }

    // Add a new update (e.g., vet visit or relocation)
    function addUpdate(uint256 _id, string memory _health, string memory _location) public {
        require(cattle[_id].id != 0, "Animal does not exist");
        cattle[_id].history.push(StatusUpdate(_health, _location, block.timestamp));
    }

    // Get the full history of a specific cow
    function getHistory(uint256 _id) public view returns (StatusUpdate[] memory) {
        return cattle[_id].history;
    }

    function getCattleCount() public view returns (uint256) {
        return cattleIds.length;
    }
}