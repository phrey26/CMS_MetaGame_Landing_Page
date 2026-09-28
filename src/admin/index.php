<?php
require_once dirname(__DIR__, 2) . '/includes/auth.php';
session_start();
requireLogin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard — MetaGames Admin</title>
<link href="../output.css" rel="stylesheet">
</head>
<body class="bg-black text-white min-h-screen px-6 py-10">

  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold">MetaGames CMS Dashboard</h1>
      <a href="logout.php" class="text-red-400 hover:underline text-sm font-semibold">Log out</a>
    </div>

    <p class="text-slate-400 mb-8">Pick a section to edit its content on the landing page.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a href="sections/header.php" class="bg-slate-900 border border-slate-700 hover:border-blue-500 transition rounded-xl p-6">
        <h2 class="font-bold text-lg mb-1">Header</h2>
        <p class="text-slate-400 text-sm">Site title, stripe colors, scroll behavior.</p>
      </a>
      <a href="sections/navbar.php" class="bg-slate-900 border border-slate-700 hover:border-blue-500 transition rounded-xl p-6">
        <h2 class="font-bold text-lg mb-1">Navbar</h2>
        <p class="text-slate-400 text-sm">Logo, join button, navigation links.</p>
      </a>
      <a href="sections/news.php" class="bg-slate-900 border border-slate-700 hover:border-blue-500 transition rounded-xl p-6">
        <h2 class="font-bold text-lg mb-1">News &amp; Updates</h2>
        <p class="text-slate-400 text-sm">News feed items.</p>
      </a>
      <a href="sections/emblem.php" class="bg-slate-900 border border-slate-700 hover:border-blue-500 transition rounded-xl p-6">
        <h2 class="font-bold text-lg mb-1">Emblem &amp; Meaning</h2>
        <p class="text-slate-400 text-sm">Emblem wheel color stops and meanings.</p>
      </a>
      <a href="sections/effects.php" class="bg-slate-900 border border-slate-700 hover:border-blue-500 transition rounded-xl p-6">
        <h2 class="font-bold text-lg mb-1">Effects</h2>
        <p class="text-slate-400 text-sm">Scroll reveal, progress bar, and tilt config.</p>
      </a>
    </div>
  </div>
</body>
</html>
