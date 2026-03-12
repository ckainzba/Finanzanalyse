const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=fake";
const body = { contents: [{ parts: [{text: "Hi"}] }] };
(async () => {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    console.log("Status:", res.status);
    console.log(await res.text());
  } catch (err) {
    console.log("Fetch Error:", err);
  }
})();
