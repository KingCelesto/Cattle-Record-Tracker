const GANACHE_URL = "http://127.0.0.1:7545";
const web3 = new Web3(GANACHE_URL);

const contractABI = [ /* ABI definition here */ ];
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

init();