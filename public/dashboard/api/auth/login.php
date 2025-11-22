<?php
/**
 * Authentication API - Login
 * Simple session-based authentication for dashboard demo
 */

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Demo users (in production, these would be in a database with hashed passwords)
$users = [
    'admin' => [
        'password' => password_hash('MidwestUnderground2025!', PASSWORD_BCRYPT),
        'name' => 'John Anderson',
        'email' => 'admin@midwestunderground.com',
        'role' => 'admin',
        'permissions' => ['view', 'edit', 'delete', 'financials', 'users']
    ],
    'manager' => [
        'password' => password_hash('Manager2025!', PASSWORD_BCRYPT),
        'name' => 'Sarah Johnson',
        'email' => 'manager@midwestunderground.com',
        'role' => 'manager',
        'permissions' => ['view', 'edit', 'financials']
    ],
    'viewer' => [
        'password' => password_hash('Viewer2025!', PASSWORD_BCRYPT),
        'name' => 'Mike Williams',
        'email' => 'viewer@midwestunderground.com',
        'role' => 'viewer',
        'permissions' => ['view']
    ]
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Username and password are required'
        ]);
        exit;
    }

    if (!isset($users[$username])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid credentials'
        ]);
        exit;
    }

    // Verify password
    if (!password_verify($password, $users[$username]['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid credentials'
        ]);
        exit;
    }

    // Create session
    $_SESSION['user'] = [
        'username' => $username,
        'name' => $users[$username]['name'],
        'email' => $users[$username]['email'],
        'role' => $users[$username]['role'],
        'permissions' => $users[$username]['permissions'],
        'login_time' => time()
    ];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $_SESSION['user']
    ]);

} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
