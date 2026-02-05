const GANACHE_URL = "http://127.0.0.1:7545";
const web3 = new Web3(GANACHE_URL);

const contractABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cattle",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "breed",
        type: "string",
      },
      {
        internalType: "address",
        name: "currentOwner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cattleIds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_breed",
        type: "string",
      },
      {
        internalType: "string",
        name: "_health",
        type: "string",
      },
      {
        internalType: "string",
        name: "_location",
        type: "string",
      },
    ],
    name: "registerAnimal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_health",
        type: "string",
      },
      {
        internalType: "string",
        name: "_location",
        type: "string",
      },
    ],
    name: "addUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getHistory",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "healthStatus",
            type: "string",
          },
          {
            internalType: "string",
            name: "location",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct CattleTracker.StatusUpdate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getCattleCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

const contractAddress = "0x2D8bF359bD2e783C9C21B3B00Fe2C4882E3806b5";

const cattleContract = new web3.eth.Contract(contractABI, contractAddress);
let account;

// Initialize Connection
async function init() {
  try {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    const statusEl = document.getElementById("status");
    statusEl.innerText = "Connected: " + account.substring(0, 15) + "...";
    statusEl.classList.add("connected");

    loadCattle();
  } catch (error) {
    console.error("Could not connect to Ganache", error);
  }
}

// Register New Cattle
async function registerCattle() {
  const id = document.getElementById("cattleId").value;
  const breed = document.getElementById("breed").value;
  const health = document.getElementById("health").value;
  const loc = document.getElementById("location").value;

  if (!id || !breed) return alert("ID and Breed are required!");

  await cattleContract.methods
    .registerAnimal(id, breed, health, loc)
    .send({ from: account, gas: 3000000 });

  alert("Cattle Registered Successfully!");
  loadCattle();
}

// Update Cattle Status
async function updateCattle() {
  const id = document.getElementById("updateId").value;
  const health = document.getElementById("updateHealth").value;
  const loc = document.getElementById("updateLocation").value;

  if (!id || !health || !loc) return alert("Please fill all fields");

  await cattleContract.methods
    .addUpdate(id, health, loc)
    .send({ from: account, gas: 3000000 });

  alert("Ledger Updated!");
  loadCattle();
}

// Load All Cattle to Table
async function loadCattle() {
  const count = await cattleContract.methods.getCattleCount().call();
  const table = document.getElementById("cattleTable");
  table.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const id = await cattleContract.methods.cattleIds(i).call();
    const animal = await cattleContract.methods.cattle(id).call();
    const history = await cattleContract.methods.getHistory(id).call();
    const latestStatus = history.length ? history[history.length - 1] : { healthStatus: "N/A", location: "N/A" };

    let row = `<tr>
        <td>${id}</td>
        <td>${animal.breed}</td>
        <td>${latestStatus.healthStatus}</td>
        <td>${latestStatus.location}</td>
        <td><button class="btn-info" onclick="viewHistory(${id})">View Logs</button></td>
      </tr>`;
    table.innerHTML += row;
  }
}

// View History in Modal
async function viewHistory(id) {
  const history = await cattleContract.methods.getHistory(id).call();
  const historyContent = document.getElementById("historyContent");
  historyContent.innerHTML = "";

  history.forEach((update) => {
    const date = new Date(update.timestamp * 1000).toLocaleString();
    historyContent.innerHTML += `
      <div class="timeline-item">
        <strong>${date}</strong><br>
        <span>Status: ${update.healthStatus}</span><br>
        <small>Location: ${update.location}</small>
      </div>
    `;
  });

  document.getElementById("historyModal").classList.add("show");
}

// Modal Close Logic
document.querySelector(".btn-close").onclick = function () {
  document.getElementById("historyModal").classList.remove("show");
};

window.onclick = function (event) {
  let modal = document.getElementById("historyModal");
  if (event.target == modal) {
    modal.classList.remove("show");
  }
};

init();