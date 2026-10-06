let products = [];

// Initialize sample data
function initializeData() {
    products = [
        {
            id: 1,
            name: "Laptop",
            category: "Electronics",
            price: 35000,
            quantity: 10,
            reorderLevel: 5,
            sku: "LAP001"
        },
        {
            id: 2,
            name: "Keyboard",
            category: "Electronics",
            price: 1500,
            quantity: 3,
            reorderLevel: 5,
            sku: "KEY001"
        },
        {
            id: 3,
            name: "Mouse",
            category: "Electronics",
            price: 800,
            quantity: 2,
            reorderLevel: 5,
            sku: "MOU001"
        },
        {
            id: 4,
            name: "Notebook",
            category: "School Supplies",
            price: 100,
            quantity: 20,
            reorderLevel: 5,
            sku: "NOT001"
        }
    ];
}


// ========================================
// GET PRODUCTS
// ========================================

function getProducts() {
    return products;
}


// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}


// Get low-stock products
function getLowStockProducts() {
    return products.filter(product =>
        product.quantity <= product.reorderLevel
    );
}


// ========================================
// SEARCH
// ========================================

function searchProducts(keyword) {

    const searchKeyword =
        keyword.toLowerCase();

    return products.filter(product =>
        product.name.toLowerCase().includes(searchKeyword) ||
        product.sku.toLowerCase().includes(searchKeyword)
    );
}


// Update search results
function updateSearchResults(query) {

    if (!query || query.trim() === "") {
        return products;
    }

    return searchProducts(query.trim());
}


// ========================================
// GENERAL STATISTICS
// ========================================

function getStatistics() {

    const totalProducts =
        products.length;

    const totalStock =
        products.reduce(
            (total, product) =>
                total + product.quantity,
            0
        );

    const lowStockCount =
        getLowStockProducts().length;

    const totalInventoryValue =
        products.reduce(
            (total, product) =>
                total +
                (product.price * product.quantity),
            0
        );

    return {
        totalProducts,
        totalStock,
        lowStockCount,
        totalInventoryValue
    };
}


// ========================================
// CATEGORIES
// ========================================

function getCategories() {

    return [
        ...new Set(
            products.map(
                product => product.category
            )
        )
    ];
}


// Get products by category
function getProductsByCategory(category) {

    return products.filter(product =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );
}


// ========================================
// STOCK STATUS
// ========================================

function getProductsByStockStatus(status) {

    return products.filter(product => {

        const quantity =
            product.quantity;

        const reorderLevel =
            product.reorderLevel;

        if (
            status.toLowerCase() ===
            "in stock"
        ) {
            return quantity > reorderLevel;
        }

        if (
            status.toLowerCase() ===
            "low stock"
        ) {
            return (
                quantity > 0 &&
                quantity <= reorderLevel
            );
        }

        if (
            status.toLowerCase() ===
            "out of stock"
        ) {
            return quantity === 0;
        }

        return true;
    });
}


// ========================================
// PRICE RANGE
// ========================================

function getProductsByPriceRange(
    minPrice,
    maxPrice
) {

    return products.filter(product =>
        product.price >= minPrice &&
        product.price <= maxPrice
    );
}


// ========================================
// FILTER FUNCTIONS
// ========================================

// Filter by category
function filterByCategory(category) {

    if (!category || category === "") {
        return products;
    }

    return products.filter(product =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );
}


// Filter by stock status
function filterByStockStatus(status) {

    if (!status || status === "") {
        return products;
    }

    return getProductsByStockStatus(status);
}


// Filter by price range
function filterByPriceRange(min, max) {

    return products.filter(product => {

        const price = product.price;

        if (
            min !== "" &&
            price < Number(min)
        ) {
            return false;
        }

        if (
            max !== "" &&
            price > Number(max)
        ) {
            return false;
        }

        return true;
    });
}


// Apply all active filters
function applyFilters(
    category,
    status,
    minPrice,
    maxPrice
) {

    let filteredProducts =
        products;


    // Category filter
    if (category) {

        filteredProducts =
            filteredProducts.filter(product =>
                product.category.toLowerCase() ===
                category.toLowerCase()
            );
    }


    // Stock status filter
    if (status) {

        filteredProducts =
            filteredProducts.filter(product => {

                if (
                    status.toLowerCase() ===
                    "in stock"
                ) {
                    return (
                        product.quantity >
                        product.reorderLevel
                    );
                }

                if (
                    status.toLowerCase() ===
                    "low stock"
                ) {
                    return (
                        product.quantity > 0 &&
                        product.quantity <=
                        product.reorderLevel
                    );
                }

                if (
                    status.toLowerCase() ===
                    "out of stock"
                ) {
                    return (
                        product.quantity === 0
                    );
                }

                return true;
            });
    }


    // Minimum price filter
    if (
        minPrice !== "" &&
        minPrice !== null &&
        minPrice !== undefined
    ) {

        filteredProducts =
            filteredProducts.filter(product =>
                product.price >=
                Number(minPrice)
            );
    }


    // Maximum price filter
    if (
        maxPrice !== "" &&
        maxPrice !== null &&
        maxPrice !== undefined
    ) {

        filteredProducts =
            filteredProducts.filter(product =>
                product.price <=
                Number(maxPrice)
            );
    }


    return filteredProducts;
}


// ========================================
// STOCK STATISTICS
// ========================================

function getStockStatistics() {

    const totalProducts =
        products.length;

    const totalStock =
        products.reduce(
            (total, product) =>
                total + product.quantity,
            0
        );

    const totalValue =
        products.reduce(
            (total, product) =>
                total +
                (product.price * product.quantity),
            0
        );

    const lowStockCount =
        getLowStockProducts().length;

    const outOfStockCount =
        products.filter(
            product =>
                product.quantity === 0
        ).length;

    const inStockCount =
        products.filter(
            product =>
                product.quantity >
                product.reorderLevel
        ).length;

    return {
        totalProducts,
        totalStock,
        totalValue,
        lowStockCount,
        outOfStockCount,
        inStockCount
    };
}


// ========================================
// CATEGORY SUMMARY
// ========================================

function getCategorySummary() {

    const summary = {};

    products.forEach(product => {

        if (!summary[product.category]) {

            summary[product.category] = {
                quantity: 0,
                value: 0
            };
        }

        summary[product.category].quantity +=
            product.quantity;

        summary[product.category].value +=
            product.price *
            product.quantity;
    });

    return summary;
}


// ========================================
// PRODUCT MANAGEMENT
// ========================================

// Add product
function addProduct(product) {

    product.id =
        products.length > 0
            ? Math.max(
                ...products.map(
                    p => p.id
                )
              ) + 1
            : 1;

    products.push(product);

    saveProducts();

    return product;
}


// Update product
function updateProduct(
    id,
    updatedData
) {

    const product =
        getProductById(id);

    if (product) {

        Object.assign(
            product,
            updatedData
        );

        saveProducts();

        return product;
    }

    return null;
}


// Delete product
function deleteProduct(id) {

    const index =
        products.findIndex(
            product =>
                product.id === id
        );

    if (index !== -1) {

        const deletedProduct =
            products.splice(index, 1)[0];

        saveProducts();

        return deletedProduct;
    }

    return null;
}


// ========================================
// LOCAL STORAGE
// ========================================

// Save products
function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );
}


// Load products
function loadProducts() {

    const savedProducts =
        localStorage.getItem(
            "products"
        );

    if (savedProducts) {

        products =
            JSON.parse(savedProducts);

    }
}


// Initialize or load data
function initializeOrLoadData() {

    const savedProducts =
        localStorage.getItem(
            "products"
        );

    if (savedProducts) {

        loadProducts();

    } else {

        initializeData();

        saveProducts();
    }
}


// ========================================
// CSV EXPORT
// ========================================

// Convert product data to CSV
function exportToCSV(data) {

    if (
        !data ||
        data.length === 0
    ) {
        return "";
    }


    const headers = [
        "ID",
        "Name",
        "Category",
        "Price",
        "Quantity",
        "Reorder Level",
        "SKU"
    ];


    const rows =
        data.map(product => [

            product.id,
            product.name,
            product.category,
            product.price,
            product.quantity,
            product.reorderLevel,
            product.sku

        ]);


    const csvRows = [];


    csvRows.push(
        headers.join(",")
    );


    rows.forEach(row => {

        csvRows.push(
            row
                .map(
                    value =>
                        `"${value}"`
                )
                .join(",")
        );

    });


    return csvRows.join("\n");
}


// ========================================
// DOWNLOAD CSV
// ========================================

function downloadCSV(
    csvContent,
    filename
) {

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.setAttribute(
        "href",
        url
    );

    link.setAttribute(
        "download",
        filename
    );


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


// ========================================
// REAL-TIME INVENTORY SIMULATION
// ========================================

function simulateInventoryUpdate() {

    products.forEach(product => {

        // Random change: -1, 0, or +1
        const change =
            Math.floor(
                Math.random() * 3
            ) - 1;


        // Calculate new quantity
        let newQuantity =
            product.quantity +
            change;


        // Prevent negative stock
        if (newQuantity < 0) {
            newQuantity = 0;
        }


        product.quantity =
            newQuantity;

    });


    // Save updated inventory
    saveProducts();
}