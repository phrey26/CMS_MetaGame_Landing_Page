<?php
require_once dirname(__DIR__, 2) . '/config/database.php';
require_once dirname(__DIR__, 2) . '/includes/function.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed.'], 405);
}

$body = getRequestBody();
$username = is_string($body['username'] ?? null) ? sanitize($body['username']) : '';
$password = is_string($body['password'] ?? null) ? $body['password'] : '';

if ($username === '' || $password === '') {
    jsonResponse(['error' => 'Username and password are required.'], 400);
}

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT id, password_hash FROM admins WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    jsonResponse(['error' => 'Invalid username or password.'], 401);
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
session_regenerate_id(true);
$_SESSION['admin_id'] = $admin['id'];

jsonResponse(['message' => 'Logged in.', 'username' => $username]);
