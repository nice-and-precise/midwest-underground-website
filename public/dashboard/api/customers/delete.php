<?php
/**
 * Delete Customer API
 * Deletes a customer from the JSON database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Allow POST or DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Customer ID is required']);
    exit();
}

$customerId = $data['id'];

// Load customers data
$dataFile = '../data/customers.json';
if (!file_exists($dataFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Customers data file not found']);
    exit();
}

$customersJson = file_get_contents($dataFile);
$customersData = json_decode($customersJson, true);

if (!$customersData) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse customers data']);
    exit();
}

// Find and remove customer
$customerIndex = null;
$deletedCustomer = null;

foreach ($customersData['customers'] as $index => $customer) {
    if ($customer['id'] === $customerId) {
        $customerIndex = $index;
        $deletedCustomer = $customer;
        break;
    }
}

if ($customerIndex === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Customer not found']);
    exit();
}

// Remove customer from array
array_splice($customersData['customers'], $customerIndex, 1);

// Save back to file
$jsonOutput = json_encode($customersData, JSON_PRETTY_PRINT);
if (file_put_contents($dataFile, $jsonOutput) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save customer data']);
    exit();
}

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Customer deleted successfully',
    'deleted_customer' => $deletedCustomer
]);
