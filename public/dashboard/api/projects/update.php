<?php
/**
 * Update Project API
 * Updates an existing project in the JSON database
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
$requiredFields = ['id', 'name', 'customer_name', 'type', 'service', 'status', 'budget'];
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

// Find project by ID
$projectIndex = null;
foreach ($projectsData['projects'] as $index => $project) {
    if ($project['id'] === $data['id']) {
        $projectIndex = $index;
        break;
    }
}

if ($projectIndex === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Project not found']);
    exit();
}

// Update project data (preserve fields not in request)
$existingProject = $projectsData['projects'][$projectIndex];
$updatedProject = array_merge($existingProject, [
    'name' => $data['name'],
    'customer_name' => $data['customer_name'],
    'type' => $data['type'],
    'service' => $data['service'],
    'status' => $data['status'],
    'budget' => floatval($data['budget']),
    'start_date' => $data['start_date'] ?? $existingProject['start_date'],
    'estimated_completion' => $data['estimated_completion'] ?? $existingProject['estimated_completion'],
    'completion_percentage' => isset($data['completion_percentage']) ? intval($data['completion_percentage']) : $existingProject['completion_percentage'],
    'location' => $data['location'] ?? $existingProject['location'],
    'description' => $data['description'] ?? $existingProject['description'],
    'projected_revenue' => isset($data['projected_revenue']) ? floatval($data['projected_revenue']) : $existingProject['projected_revenue'],
    'crew_assigned' => $data['crew_assigned'] ?? $existingProject['crew_assigned']
]);

// Replace project in array
$projectsData['projects'][$projectIndex] = $updatedProject;

// Save back to file
$jsonOutput = json_encode($projectsData, JSON_PRETTY_PRINT);
if (file_put_contents($dataFile, $jsonOutput) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save project data']);
    exit();
}

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Project updated successfully',
    'project' => $updatedProject
]);
