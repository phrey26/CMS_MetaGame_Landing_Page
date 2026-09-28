<?php
require_once dirname(__DIR__, 3) . '/includes/auth.php';
session_start();
requireLogin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Edit Navbar — MetaGames Admin</title>
<link href="../../output.css" rel="stylesheet">
</head>
<body class="bg-black text-white min-h-screen px-6 py-10">

  <div class="max-w-3xl mx-auto">
    <a href="../index.php" class="text-blue-400 hover:underline text-sm">&larr; Back to dashboard</a>
    <h1 class="text-2xl sm:text-3xl font-bold mt-3 mb-8">Navbar</h1>

    <div class="space-y-6">
      <div id="card-logo"></div>
      <div id="card-cta"></div>
      <div id="card-links"></div>
    </div>
  </div>

  <script type="module" src="../../js/admin/pages/navbar.js"></script>
</body>
</html>
