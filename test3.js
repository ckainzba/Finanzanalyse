(async () => {
  fetch('http://localhost:3002/app.js').then(r => r.text()).then(r => console.log('success'));
})();
