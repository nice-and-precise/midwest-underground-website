<?php
/**
 * Update Customer API
 * Updates an existing customer in the JSON database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST/PUT
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate required fields
$requiredFields = ['id', 'name', 'type', 'contact_person', 'phone', 'email'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

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

// Find customer by ID
$customerIndex = null;
foreach ($customersData['customers'] as $index => $customer) {
    if ($customer['id'] === $data['id']) {
        $customerIndex = $index;
        break;
    }
}

if ($customerIndex === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Customer not found']);
    exit();
}

// Update customer data
$existingCustomer = $customersData['customers'][$customerIndex];
$updatedCustomer = array_merge($existingCustomer, [
    'name' => $data['name'],
    'type' => $data['type'],
    'contact_person' => $data['contact_person'],
    'phone' => $data['phone'],
    'email' => $data['email'],
    'address' => $data['address'] ?? $existingCustomer['address'],
    'status' => $data['status'] ?? $existingCustomer['status'],
    'total_revenue' => isset($data['total_revenue']) ? floatval($data['total_revenue']) : $existingCustomer['total_revenue'],
    'projects_count' => isset($data['projects_count']) ? intval($data['projects_count']) : $existingCustomer['projects_count'],
    'last_project_date' => $data['last_project_date'] ?? $existingCustomer['last_project_date']
]);

// Replace customer in array
$customersData['customers'][$customerIndex] = $updatedCustomer;

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
    'message' => 'Customer updated successfully',
    'customer' => $updatedCustomer
]);
