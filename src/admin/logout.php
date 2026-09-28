<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Logging Out — MetaGames</title>
<link href="../output.css" rel="stylesheet">
</head>
<body class="bg-black text-white min-h-screen flex items-center justify-center">
  <p class="text-slate-300">Logging out…</p>

  <script type="module">
    fetch('/api/auth/logout.php', { method: 'POST', credentials: 'same-origin' })
      .finally(() => { window.location.href = 'login.php'; });
  </script>
</body>
</html>
