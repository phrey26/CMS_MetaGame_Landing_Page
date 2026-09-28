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

if ($username === '' || strlen($password) < 8) {
    jsonResponse(['error' => 'Username is required and password must be at least 8 characters.'], 400);
}

$pdo = getPDO();

$check = $pdo->prepare('SELECT id FROM admins WHERE username = ?');
$check->execute([$username]);
if ($check->fetchColumn() !== false) {
    jsonResponse(['error' => 'That username is already taken.'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$insert = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
$insert->execute([$username, $hash]);

jsonResponse(['message' => 'Account created. You can now log in.'], 201);
