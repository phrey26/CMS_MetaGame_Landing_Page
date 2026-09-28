<?php
require_once dirname(__DIR__, 2) . '/includes/auth.php';
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Register Admin — MetaGames</title>
<link href="../output.css" rel="stylesheet">
</head>
<body class="bg-black text-white min-h-screen flex items-center justify-center px-4">

  <div class="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Create Admin Account</h1>

    <form id="register-form" class="space-y-4">
      <label class="block text-sm text-slate-300">
        <span class="block mb-1">Username</span>
        <input type="text" name="username" required autocomplete="username"
               class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white" />
      </label>
      <label class="block text-sm text-slate-300">
        <span class="block mb-1">Password (min. 8 characters)</span>
        <input type="password" name="password" required minlength="8" autocomplete="new-password"
               class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white" />
      </label>
      <label class="block text-sm text-slate-300">
        <span class="block mb-1">Confirm Password</span>
        <input type="password" name="confirm" required minlength="8" autocomplete="new-password"
               class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white" />
      </label>
      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 transition text-white py-2.5 rounded font-bold">Register</button>
    </form>

    <p id="register-error" class="text-red-400 text-sm mt-4 hidden"></p>
    <p id="register-success" class="text-green-400 text-sm mt-4 hidden"></p>
    <p class="text-slate-400 text-sm mt-6 text-center">Already have an account? <a href="login.php" class="text-blue-400 hover:underline">Log in</a></p>
  </div>

  <script type="module">
    const form = document.getElementById('register-form');
    const errorEl = document.getElementById('register-error');
    const successEl = document.getElementById('register-success');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.classList.add('hidden');
      successEl.classList.add('hidden');

      if (form.password.value !== form.confirm.value) {
        errorEl.textContent = 'Passwords do not match.';
        errorEl.classList.remove('hidden');
        return;
      }

      try {
        const res = await fetch('/api/auth/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ username: form.username.value, password: form.password.value }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Registration failed.');

        successEl.textContent = 'Account created. Redirecting to login…';
        successEl.classList.remove('hidden');
        setTimeout(() => { window.location.href = 'login.php'; }, 1200);
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
      }
    });
  </script>
</body>
</html>
