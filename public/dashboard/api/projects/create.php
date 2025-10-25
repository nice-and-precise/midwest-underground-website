<?php
/**
 * Create Project API
 * Creates a new project in the JSON database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
$requiredFields = ['name', 'customer_name', 'type', 'service', 'status', 'budget'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Load projects data
$dataFile = '../data/projects.json';
if (!file_exists($dataFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Projects data file not found']);
    exit();
}

$projectsJson = file_get_contents($dataFile);
$projectsData = json_decode($projectsJson, true);

if (!$projectsData) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse projects data']);
    exit();
}

// Generate new project ID
$maxId = 0;
foreach ($projectsData['projects'] as $project) {
    if (preg_match('/PRJ-(\d+)/', $project['id'], $matches)) {
        $num = intval($matches[1]);
        if ($num > $maxId) {
            $maxId = $num;
        }
    }
}
$newId = 'PRJ-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);

// Create new project
$newProject = [
    'id' => $newId,
    'name' => $data['name'],
    'customer_name' => $data['customer_name'],
    'type' => $data['type'],
    'service' => $data['service'],
    'status' => $data['status'],
    'budget' => floatval($data['budget']),
    'start_date' => $data['start_date'] ?? date('Y-m-d'),
    'estimated_completion' => $data['estimated_completion'] ?? date('Y-m-d', strtotime('+90 days')),
    'completion_percentage' => isset($data['completion_percentage']) ? intval($data['completion_percentage']) : 0,
    'location' => $data['location'] ?? '',
    'description' => $data['description'] ?? '',
    'projected_revenue' => isset($data['projected_revenue']) ? floatval($data['projected_revenue']) : floatval($data['budget']) * 1.3,
    'crew_assigned' => $data['crew_assigned'] ?? null
];

// Add to projects array
$projectsData['projects'][] = $newProject;

// Save back to file
$jsonOutput = json_encode($projectsData, JSON_PRETTY_PRINT);
if (file_put_contents($dataFile, $jsonOutput) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save project data']);
    exit();
}

// Return success response
http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Project created successfully',
    'project' => $newProject
]);
