<?php

header("Content-Type: application/json");

$products = [
    [
        "id" => 1,
        "name" => "Laptop",
        "category" => "Electronics",
        "price" => 35000,
        "quantity" => 10,
        "reorderLevel" => 5,
        "sku" => "LAP001"
    ],
    [
        "id" => 2,
        "name" => "Keyboard",
        "category" => "Electronics",
        "price" => 1500,
        "quantity" => 3,
        "reorderLevel" => 5,
        "sku" => "KEY001"
    ],
    [
        "id" => 3,
        "name" => "Mouse",
        "category" => "Electronics",
        "price" => 800,
        "quantity" => 2,
        "reorderLevel" => 5,
        "sku" => "MOU001"
    ],
    [
        "id" => 4,
        "name" => "Notebook",
        "category" => "School Supplies",
        "price" => 100,
        "quantity" => 20,
        "reorderLevel" => 5,
        "sku" => "NOT001"
    ]
];

echo json_encode($products);

?>