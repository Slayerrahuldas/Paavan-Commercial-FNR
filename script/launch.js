let filterButtonActive = false;
let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("launch.json");
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach((item) => {
        const row = document.createElement("tr");
        for (const key of ["HUL Code", "HUL Outlet Name", "ME Name", "DETS Beat", "BasePack Code", "BasePack Desc", "Target (VMQ)", "Achv Qty", "Status"]) {
            const cell = document.createElement("td");
            cell.textContent = item[key];
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    let filteredData = [...jsonData];

    const filterMeName = document.getElementById("filter-me-name").value;
    const filterDetsBeat = document.getElementById("filter-dets-beat").value;
    const filterBasePackDesc = document.getElementById("filter-basepack-desc").value;
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    if (filterMeName) {
        filteredData = filteredData.filter(row => row["ME Name"] === filterMeName);
    }
    if (filterDetsBeat) {
        filteredData = filteredData.filter(row => row["DETS Beat"] === filterDetsBeat);
    }
    if (filterBasePackDesc) {
        filteredData = filteredData.filter(row => row["BasePack Desc"] === filterBasePackDesc);
    }
    if (searchQuery) {
        filteredData = filteredData.filter(row => 
            row["HUL Code"].toLowerCase().includes(searchQuery) ||
            row["HUL Outlet Name"].toLowerCase().includes(searchQuery)
        );
    }
    if (filterButtonActive) {
        filteredData = filteredData.filter(row => row["Status"] === "Pending");
    }

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

function updateDropdowns(filteredData) {
    const meNames = new Set(), detsBeats = new Set(), basePackDescs = new Set();
    
    filteredData.forEach(row => {
        if (row["ME Name"]) meNames.add(row["ME Name"]);
        if (row["DETS Beat"]) detsBeats.add(row["DETS Beat"]);
        if (row["BasePack Desc"]) basePackDescs.add(row["BasePack Desc"]);
    });

    populateSelectDropdown("filter-me-name", meNames, "ME Name");
    populateSelectDropdown("filter-dets-beat", detsBeats, "DETS Beat");
    populateSelectDropdown("filter-basepack-desc", basePackDescs, "BasePack Desc");
}

function populateSelectDropdown(id, optionsSet, columnName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = columnName;
    defaultOption.value = "";
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    optionsSet.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option;
        if (option === selectedValue) optionElement.selected = true;
        dropdown.appendChild(optionElement);
    });
}

document.getElementById("reset-button").addEventListener("click", () => {
    filterButtonActive = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("search-bar").value = "";
    document.getElementById("filter-me-name").selectedIndex = 0;
    document.getElementById("filter-dets-beat").selectedIndex = 0;
    document.getElementById("filter-basepack-desc").selectedIndex = 0;
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-dets-beat").addEventListener("change", applyFilters);
document.getElementById("filter-basepack-desc").addEventListener("change", applyFilters);

document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButtonActive = !filterButtonActive;
    document.getElementById("filter-button-1").style.backgroundColor = filterButtonActive ? "green" : "blue";
    applyFilters();
});

function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();