let filterButtonActive = false;
let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("launch_fnr.json");
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

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Add row number dynamically
        const indexCell = document.createElement("td");
        indexCell.textContent = index + 1;
        row.appendChild(indexCell);

        for (const key of ["HUL Code", "HUL Outlet Name", "ME Name", "FNR Beat", "BasePack Code", "BasePack Desc", "Target (VMQ)", "Achv Qty", "Status"]) {
            const cell = document.createElement("td");
            cell.textContent = item[key] || "-";
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    let filteredData = [...jsonData];

    const filters = {
        "ME Name": document.getElementById("filter-me-name").value,
        "FNR Beat": document.getElementById("filter-fnr-beat").value,
        "BasePack Desc": document.getElementById("filter-basepack-desc").value
    };

    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            filteredData = filteredData.filter(row => row[key] === filters[key]);
        }
    });

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
    const dropdowns = {
        "filter-me-name": new Set(),
        "filter-fnr-beat": new Set(),
        "filter-basepack-desc": new Set()
    };

    filteredData.forEach(row => {
        if (row["ME Name"]) dropdowns["filter-me-name"].add(row["ME Name"]);
        if (row["FNR Beat"]) dropdowns["filter-fnr-beat"].add(row["FNR Beat"]);
        if (row["BasePack Desc"]) dropdowns["filter-basepack-desc"].add(row["BasePack Desc"]);
    });

    Object.keys(dropdowns).forEach(id => populateSelectDropdown(id, dropdowns[id], id.replace("filter-", "").replace("-", " ").toUpperCase()));
}

function populateSelectDropdown(id, optionsSet, columnName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = columnName;
    defaultOption.value = "";
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
    document.getElementById("filter-fnr-beat").selectedIndex = 0;
    document.getElementById("filter-basepack-desc").selectedIndex = 0;
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-fnr-beat").addEventListener("change", applyFilters);
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
