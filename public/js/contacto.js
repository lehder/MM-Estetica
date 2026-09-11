document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedService = urlParams.get('service');
  const serviceInput = document.getElementById('serviceSelect');
  const feedback = document.getElementById('contactFeedback');

  if (selectedService && serviceInput) {
    serviceInput.value = decodeURIComponent(selectedService);
  }

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = 'Solicitud recibida. Nos comunicaremos contigo en breve.';
    feedback.style.color = '#2E7D32';
    form.reset();
  });
});