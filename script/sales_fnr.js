let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("sales_fnr.json");
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

    // Columns to total
    const totalColumns = ["LYRR", "JQRR", "LYTM", "MTD"];
    let totals = { "LYRR": 0, "JQRR": 0, "LYTM": 0, "MTD": 0 };

    // Get selected values from dropdowns
    const selectedMeName = document.getElementById("filter-me-name").value || "ALL ME";
    const selectedFnrBeat = document.getElementById("filter-fnr-beat").value || "ALL Beats";

    // Calculate totals
    data.forEach(item => {
        totalColumns.forEach(key => {
            totals[key] += parseFloat(item[key]) || 0;
        });
    });

    // Create Total Row
    const totalRow = document.createElement("tr");
    totalRow.style.fontWeight = "bold";
    totalRow.style.backgroundColor = "#f2f2f2";

    let totalIndexCell = document.createElement("td");
    totalIndexCell.textContent = "Total";
    totalRow.appendChild(totalIndexCell);

    ["HUL Code", "HUL Outlet Name"].forEach(() => {
        let emptyCell = document.createElement("td");
        emptyCell.textContent = "-";
        totalRow.appendChild(emptyCell);
    });

    // Set "ME Name" column as selected dropdown value
    let meNameCell = document.createElement("td");
    meNameCell.textContent = selectedMeName;
    totalRow.appendChild(meNameCell);

    // Set "FNR Beat" column as selected dropdown value
    let beatCell = document.createElement("td");
    beatCell.textContent = selectedFnrBeat;
    totalRow.appendChild(beatCell);

    totalColumns.forEach(key => {
        let totalCell = document.createElement("td");
        totalCell.textContent = totals[key]; // No decimal formatting
        totalRow.appendChild(totalCell);
    });

    tableBody.appendChild(totalRow);

    // Populate Data Rows
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        const cellIndex = document.createElement("td");
        cellIndex.textContent = index + 1;
        row.appendChild(cellIndex);

        ["HUL Code", "HUL Outlet Name", "ME Name", "FNR Beat", "LYRR", "JQRR", "LYTM", "MTD"].forEach(key => {
            const cell = document.createElement("td");
            cell.textContent = item[key] || "-";
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

function applyFilters() {
    let filteredData = [...jsonData];
    const filterMeName = document.getElementById("filter-me-name").value;
    const filterFnrBeat = document.getElementById("filter-fnr-beat").value;
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    if (filterMeName) {
        filteredData = filteredData.filter(row => row["ME Name"] === filterMeName);
    }
    if (filterFnrBeat) {
        filteredData = filteredData.filter(row => row["FNR Beat"] === filterFnrBeat);
    }
    if (searchQuery) {
        filteredData = filteredData.filter(row => 
            row["HUL Code"].toLowerCase().includes(searchQuery) ||
            row["HUL Outlet Name"].toLowerCase().includes(searchQuery)
        );
    }
    populateTable(filteredData);
    updateDropdowns(filteredData);
}

function updateDropdowns(filteredData) {
    const meNames = new Set(), fnrBeats = new Set();
    filteredData.forEach(row => {
        if (row["ME Name"]) meNames.add(row["ME Name"]);
        if (row["FNR Beat"]) fnrBeats.add(row["FNR Beat"]);
    });
    populateSelectDropdown("filter-me-name", meNames, "ME Name");
    populateSelectDropdown("filter-fnr-beat", fnrBeats, "FNR Beat");
}

function populateSelectDropdown(id, optionsSet, columnName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = "";

    // Dropdown header
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
    document.getElementById("search-bar").value = "";
    document.getElementById("filter-me-name").selectedIndex = 0;
    document.getElementById("filter-fnr-beat").selectedIndex = 0;
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-fnr-beat").addEventListener("change", applyFilters);

function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();
