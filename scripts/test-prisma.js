const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async function(){
  const p = new PrismaClient();
  try {
    const u = await p.user.findUnique({ where: { email: 'master@jardines.co' } });
    console.log('user:', u ? { id: u.id, email: u.email, passwordHash: u.password, role: u.role } : null);
    if (u) {
      const ok = await bcrypt.compare('123456', u.password);
      console.log('password matches:', ok);
    }
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    await p.$disconnect();
  }
})();