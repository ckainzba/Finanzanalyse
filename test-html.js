const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
  <style>
    body { background: #ccc; }
    .modal-overlay { display: flex; }
  </style>
</head>
<body>
  <div class="modal-overlay">
    <div class="modal review-modal-content">
      <div class="modal-header">
        <h3>Erkannte Daten überprüfen (15 Felder)</h3>
      </div>
      <div class="modal-body review-modal-body">
        <div class="review-row"><label>1</label><input type="text"></div>
        <div class="review-row"><label>2</label><input type="text"></div>
        <div class="review-row"><label>3</label><input type="text"></div>
        <div class="review-row"><label>4</label><input type="text"></div>
        <div class="review-row"><label>5</label><input type="text"></div>
        <div class="review-row"><label>6</label><input type="text"></div>
        <div class="review-row"><label>7</label><input type="text"></div>
        <div class="review-row"><label>8</label><input type="text"></div>
        <div class="review-row"><label>9</label><input type="text"></div>
      </div>
    </div>
  </div>
</body>
</html>
`;
fs.writeFileSync('test-modal.html', html);
