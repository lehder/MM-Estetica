document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const messageBox = document.getElementById('authMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageBox.textContent = 'Verificando...';
    messageBox.style.color = '#736E68';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      messageBox.textContent = 'Acceso correcto. Redirigiendo...';
      messageBox.style.color = 'green';
      localStorage.setItem('mm_token', data.token);

      setTimeout(() => {
        window.location.href = 'servicios.html';
      }, 1000);
    } catch (err) {
      messageBox.textContent = err.message;
      messageBox.style.color = '#B00020';
    }
  });
});