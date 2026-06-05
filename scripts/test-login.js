(async ()=>{
  const url = 'http://localhost:3000/api/auth/login';
  const body = { email: 'master@jardines.co', password: '123456' };
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body:', text);
  } catch (e) {
    console.error('fetch error', e);
  }
})();