import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@institutbiznisa.rs' },
    update: {},
    create: {
      email: 'admin@institutbiznisa.rs',
      password: adminPassword,
      nickname: 'Founder',
      firstName: 'Petar',
      lastName: 'Jurkovic',
      role: 'admin',
      rank: 7,
      xp: 100000,
      verified: true,
      verificationStatus: 'approved',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      nickname: 'TestUser',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      rank: 2,
      xp: 250,
    },
  });
  console.log('Created test user:', user.email);

  // Create channels
  const channels = [
    { name: 'dobrodoslica', description: 'Predstavite se zajednici', category: 'Opsta diskusija', type: 'public', order: 1 },
    { name: 'dnevne-poruke', description: 'Dnevne motivacije i vesti od founder-a', category: 'Opsta diskusija', type: 'public', order: 2 },
    { name: 'pitanja-i-odgovori', description: 'Postavite pitanje i pomozite drugima', category: 'Opsta diskusija', type: 'public', order: 3 },
    { name: 'marketing-diskusija', description: 'Diskusija o marketing strategijama', category: 'Biznis teme', type: 'public', order: 4 },
    { name: 'prodaja-negotijacije', description: 'Tehnike prodaje i pregovaranja', category: 'Biznis teme', type: 'public', order: 5 },
    { name: 'finansije-investicije', description: 'Upravljanje finansijama i investicije', category: 'Biznis teme', type: 'public', order: 6 },
    { name: 'startup-ideje', description: 'Podelite i razvijte svoje biznis ideje', category: 'Startup', type: 'public', order: 7 },
    { name: 'timski-projekti', description: 'Formirajte timove za projekte', category: 'Startup', type: 'public', order: 8 },
    { name: 'networking-dogadjaji', description: 'Najave networking dogadjaja', category: 'Dogadjaji', type: 'public', order: 9 },
    { name: 'uspesne-price', description: 'Podelite svoju preduzetnicku pricu', category: 'Inspiracija', type: 'public', order: 10 },
  ];

  for (const channel of channels) {
    await prisma.channel.create({ data: channel });
  }
  console.log('Created channels');

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Osnovi Preduzetnistva',
      description: 'Naucite osnove pokretanja i vodjenja sopstvenog biznisa.',
      priceRsd: 1999, priceEur: 17, category: 'startup', level: 'beginner', duration: '5 sati', published: true, featured: true,
      lessons: {
        create: [
          { title: 'Uvod u preduzetnistvo', description: 'Sta znaci biti preduzetnik', order: 1, duration: '30 min' },
          { title: 'Pronalazenje ideje', description: 'Kako pronaci profitabilnu biznis ideju', order: 2, duration: '45 min' },
          { title: 'Validacija trzista', description: 'Proverite da li postoji potraznja', order: 3, duration: '40 min' },
        ]
      }
    }
  });
  console.log('Created course:', course1.title);

  const course2 = await prisma.course.create({
    data: {
      title: 'Digitalni Marketing 101',
      description: 'Kompletan vodic kroz digitalni marketing.',
      priceRsd: 4999, priceEur: 43, category: 'marketing', level: 'beginner', duration: '8 sati', published: true, featured: true,
      lessons: {
        create: [
          { title: 'Uvod u digitalni marketing', description: 'Osnove i koncepti', order: 1, duration: '45 min' },
          { title: 'Facebook i Instagram oglasi', description: 'Kreiranje efikasnih kampanja', order: 2, duration: '60 min' },
          { title: 'Google Ads', description: 'Pokretanje Search i Display kampanja', order: 3, duration: '60 min' },
        ]
      }
    }
  });
  console.log('Created course:', course2.title);

  // Create achievements
  await prisma.achievement.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Prvi Korak', description: 'Registrovan na platformu', icon: 'footprints', xpReward: 10, requirement: 'register' },
      { name: 'Prva Poruka', description: 'Poslana prva poruka u zajednici', icon: 'message', xpReward: 20, requirement: 'first_message' },
      { name: 'Prva Kupovina', description: 'Kupljen prvi kurs', icon: 'shopping-cart', xpReward: 100, requirement: 'first_purchase' },
      { name: 'Aktivni Clan', description: 'Poslato 100 poruka', icon: 'messages', xpReward: 200, requirement: '100_messages' },
    ]
  });
  console.log('Created achievements');

  // Create sample messages
  const generalChannel = await prisma.channel.findFirst({ where: { name: 'dobrodoslica' } });
  if (generalChannel) {
    await prisma.message.createMany({
      data: [
        { channelId: generalChannel.id, userId: admin.id, content: 'Dobrodosli u Institut Biznisa! Predstavite se i recite nam sta vas motivise!', pinned: true },
        { channelId: generalChannel.id, userId: user.id, content: 'Cao svima! Ja sam Marko, pokrecem svoj prvi startup.', pinned: false },
      ]
    });
    console.log('Created sample messages');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
