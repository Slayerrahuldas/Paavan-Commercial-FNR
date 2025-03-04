let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("sales.json");
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

        for (const key of ["HUL Code", "HUL Outlet Name", "ME Name", "DETS Beat", "LYRR", "JQRR", "LYTM", "MTD"]) {
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
        "DETS Beat": document.getElementById("filter-dets-beat").value
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

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

function updateDropdowns(filteredData) {
    const dropdowns = {
        "filter-me-name": new Set(),
        "filter-dets-beat": new Set()
    };

    filteredData.forEach(row => {
        if (row["ME Name"]) dropdowns["filter-me-name"].add(row["ME Name"]);
        if (row["DETS Beat"]) dropdowns["filter-dets-beat"].add(row["DETS Beat"]);
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
    document.getElementById("search-bar").value = "";
    document.getElementById("filter-me-name").selectedIndex = 0;
    document.getElementById("filter-dets-beat").selectedIndex = 0;
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-dets-beat").addEventListener("change", applyFilters);

function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();
