<?php
/**
 * Delete Project API
 * Deletes a project from the JSON database
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
    echo json_encode(['error' => 'Project ID is required']);
    exit();
}

$projectId = $data['id'];

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

// Find and remove project
$projectIndex = null;
$deletedProject = null;

foreach ($projectsData['projects'] as $index => $project) {
    if ($project['id'] === $projectId) {
        $projectIndex = $index;
        $deletedProject = $project;
        break;
    }
}

if ($projectIndex === null) {
    http_response_code(404);
    echo json_encode(['error' => 'Project not found']);
    exit();
}

// Remove project from array
array_splice($projectsData['projects'], $projectIndex, 1);

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
    'message' => 'Project deleted successfully',
    'deleted_project' => $deletedProject
]);
