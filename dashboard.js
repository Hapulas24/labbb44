if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

initializeOrLoadData();

// ========================================
// USER / GREETING
// ========================================

const username = localStorage.getItem("username") || "Student";
const currentHour = new Date().getHours();
let greetingText;

if (currentHour < 12) {
    greetingText = "Good Morning";
} else if (currentHour < 18) {
    greetingText = "Good Afternoon";
} else {
    greetingText = "Good Evening";
}

document.getElementById("greeting").textContent = greetingText + ", " + username + "!";

// ========================================
// NAVIGATION VIEW SWITCHING
// ========================================

const navDashboard = document.getElementById("navDashboard");
const navInventory = document.getElementById("navInventory");
const dashboardView = document.getElementById("dashboardView");
const inventoryView = document.getElementById("inventoryView");
const pageSubheading = document.getElementById("pageSubheading");

navDashboard.addEventListener("click", function (e) {
    e.preventDefault();
    navDashboard.classList.add("active");
    navInventory.classList.remove("active");
    dashboardView.classList.remove("d-none");
    inventoryView.classList.add("d-none");
    if (pageSubheading) {
        pageSubheading.textContent = "Here's an overview of your portal and inventory status.";
    }
});

navInventory.addEventListener("click", function (e) {
    e.preventDefault();
    navInventory.classList.add("active");
    navDashboard.classList.remove("active");
    inventoryView.classList.remove("d-none");
    dashboardView.classList.add("d-none");
    if (pageSubheading) {
        pageSubheading.textContent = "Manage stock inventory, filter items, and export data.";
    }
});

// ========================================
// STATISTIC CARDS UPDATE
// ========================================

function updateStatCards() {
    const stats = getStockStatistics();
    
    document.getElementById("statTotalProducts").textContent = stats.totalProducts;
    document.getElementById("statLowStock").textContent = stats.lowStockCount;
    document.getElementById("statTotalValue").textContent = "₱" + Number(stats.totalValue).toLocaleString();
    document.getElementById("statTotalStock").textContent = stats.totalStock;
}

// ========================================
// RECENT ACTIVITIES
// ========================================

const activityTable = document.getElementById("activityTable");
activityTable.innerHTML = `
    <tr>
        <td>Today</td>
        <td>Submitted Web Development Assignment</td>
        <td><span class="badge bg-success">Completed</span></td>
    </tr>
    <tr>
        <td>Yesterday</td>
        <td>Attended JavaScript Class</td>
        <td><span class="badge bg-success">Completed</span></td>
    </tr>
    <tr>
        <td>2 Days Ago</td>
        <td>Downloaded Course Materials</td>
        <td><span class="badge bg-primary">Done</span></td>
    </tr>
    <tr>
        <td>3 Days Ago</td>
        <td>Quiz 2</td>
        <td><span class="badge bg-warning text-dark">Pending</span></td>
    </tr>
`;

// ========================================
// LOGOUT
// ========================================

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    window.location.href = "index.html";
});

// ========================================
// CONTROLS & ELEMENTS
// ========================================

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const searchResultsTable = document.getElementById("searchResultsTable");

// ========================================
// DISPLAY RESULTS & LOW STOCK HIGHLIGHT
// ========================================

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResultsTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    No products found.
                </td>
            </tr>
        `;
        return;
    }

    searchResultsTable.innerHTML = results.map(product => {
        const isLowStock = product.quantity > 0 && product.quantity <= product.reorderLevel;

        return `
            <tr class="${isLowStock ? "table-warning" : ""}">
                <td>${product.id}</td>
                <td>
                    <strong>${product.name}</strong>
                    ${isLowStock ? `<span class="badge bg-warning text-dark ms-2">LOW STOCK</span>` : ""}
                </td>
                <td>${product.category}</td>
                <td>₱${Number(product.price).toLocaleString()}</td>
                <td>${product.quantity}</td>
                <td>${product.reorderLevel}</td>
                <td><strong>${product.sku}</strong></td>
            </tr>
        `;
    }).join("");
}

// ========================================
// UPDATE LOW STOCK ALERT
// ========================================

function updateLowStockAlert() {
    const lowStockProducts = getLowStockProducts();
    const lowStockMessage = document.getElementById("lowStockMessage");

    if (lowStockProducts.length === 0) {
        lowStockMessage.textContent = "All products have sufficient stock.";
        return;
    }

    lowStockMessage.textContent = lowStockProducts.length +
        " product(s) are running low: " +
        lowStockProducts.map(product => product.name).join(", ") + ".";
}

// ========================================
// SEARCH + FILTERS FUNCTION
// ========================================

function performSearchAndFilter() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedStatus = stockFilter.value;
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;

    let results = getProducts();

    if (query !== "") {
        results = results.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query)
        );
    }

    if (selectedCategory !== "" && selectedCategory !== "All Categories") {
        results = results.filter(product =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    if (selectedStatus !== "" && selectedStatus !== "All Status") {
        const status = selectedStatus.toLowerCase();
        results = results.filter(product => {
            if (status === "in stock") return product.quantity > product.reorderLevel;
            if (status === "low stock") return product.quantity > 0 && product.quantity <= product.reorderLevel;
            if (status === "out of stock") return product.quantity === 0;
            return true;
        });
    }

    if (minPrice !== "") {
        results = results.filter(product => product.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
        results = results.filter(product => product.price <= Number(maxPrice));
    }

    displaySearchResults(results);
}

// Event Listeners for Filters
searchInput.addEventListener("input", performSearchAndFilter);
categoryFilter.addEventListener("change", performSearchAndFilter);
stockFilter.addEventListener("change", performSearchAndFilter);
minPriceInput.addEventListener("input", performSearchAndFilter);
maxPriceInput.addEventListener("input", performSearchAndFilter);

// ========================================
// CSV EXPORT
// ========================================

document.getElementById("exportBtn").addEventListener("click", function () {
    const data = getProducts();
    const csvContent = exportToCSV(data);

    if (!csvContent) {
        alert("No product data available to export.");
        return;
    }

    downloadCSV(csvContent, "inventory.csv");
});

// ========================================
// CHARTS
// ========================================

let categoryChart;
function updateCategoryChart() {
    const categorySummary = getCategorySummary();
    const categoryLabels = Object.keys(categorySummary);
    const categoryValues = categoryLabels.map(category => categorySummary[category].value);

    if (categoryChart) {
        categoryChart.data.labels = categoryLabels;
        categoryChart.data.datasets[0].data = categoryValues;
        categoryChart.update();
        return;
    }

    categoryChart = new Chart(document.getElementById("inventoryValueChart"), {
        type: "bar",
        data: {
            labels: categoryLabels,
            datasets: [{ label: "Inventory Value", data: categoryValues }]
        },
        options: { responsive: true, plugins: { legend: { display: true } } }
    });
}

let stockStatusChart;
function updateStockStatusChart() {
    const stockStats = getStockStatistics();
    const chartData = [stockStats.inStockCount, stockStats.lowStockCount, stockStats.outOfStockCount];

    if (stockStatusChart) {
        stockStatusChart.data.datasets[0].data = chartData;
        stockStatusChart.update();
        return;
    }

    stockStatusChart = new Chart(document.getElementById("stockStatusChart"), {
        type: "doughnut",
        data: {
            labels: ["In Stock", "Low Stock", "Out of Stock"],
            datasets: [{ data: chartData }]
        },
        options: { responsive: true }
    });
}

let stockQuantityChart;
function updateStockQuantityChart() {
    const categorySummaryQuantity = getCategorySummary();
    const categoryNames = Object.keys(categorySummaryQuantity);
    const categoryQuantities = categoryNames.map(category => categorySummaryQuantity[category].quantity);

    if (stockQuantityChart) {
        stockQuantityChart.data.labels = categoryNames;
        stockQuantityChart.data.datasets[0].data = categoryQuantities;
        stockQuantityChart.update();
        return;
    }

    stockQuantityChart = new Chart(document.getElementById("stockQuantityChart"), {
        type: "bar",
        data: {
            labels: categoryNames,
            datasets: [{ label: "Stock Quantity", data: categoryQuantities }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Quantity" } },
                x: { title: { display: true, text: "Category" } }
            }
        }
    });
}

// Initial Load Setup
updateStatCards();
performSearchAndFilter();
updateLowStockAlert();
updateCategoryChart();
updateStockStatusChart();
updateStockQuantityChart();

// ========================================
// REAL-TIME INVENTORY SIMULATION
// ========================================

function simulateInventoryUpdate() {
    const products = getProducts();
    if (products.length === 0) return;

    const randomIndex = Math.floor(Math.random() * products.length);
    const product = products[randomIndex];
    const change = Math.floor(Math.random() * 3) - 1;

    product.quantity = Math.max(0, product.quantity + change);

    saveProducts();

    updateStatCards();
    performSearchAndFilter();
    updateLowStockAlert();
    updateCategoryChart();
    updateStockStatusChart();
    updateStockQuantityChart();
}

setInterval(simulateInventoryUpdate, 5000);