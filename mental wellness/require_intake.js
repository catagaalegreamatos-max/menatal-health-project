// Redirect users to the intake form if no client intake data is present
(function(){
  try {
    const allowed = ['client_intake.html','disclaimer.html'];
    const path = window.location.pathname.split('/').pop();
    if (allowed.includes(path)) return;
    const intake = localStorage.getItem('clientIntake');
    if (!intake) {
      // Preserve original location so we can return after intake if desired
      sessionStorage.setItem('returnTo', window.location.pathname + window.location.search + window.location.hash);
      window.location.href = 'client_intake.html';
    }
  } catch (e) {
    console.error('require_intake check failed', e);
  }
})();
