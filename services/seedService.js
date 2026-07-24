const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');

const Settings = require('../models/Settings');
const TreeSpecies = require('../models/TreeSpecies');
const FAQ = require('../models/FAQ');
const UrbanPlanter = require('../models/UrbanPlanter');
const RuralGrower = require('../models/RuralGrower');
const News = require('../models/News');
const TrackingUpdate = require('../models/TrackingUpdate');

const seedService = {
  seed() {
    this.seedAdmin();
    this.seedSettings();
    this.seedTreeSpecies();
    this.seedFAQs();
    this.seedUrbanPlanters();
    this.seedRuralGrowers();
    this.seedNews();
    this.seedTrackingUpdates();
  },

  seedAdmin() {
    if (User.count() > 0) return;

    const hash = bcrypt.hashSync(config.admin.password, 12);
    User.create(config.admin.username, hash);
    console.log('Admin user created');
  },

  seedSettings() {
    const defaults = {
      hero_title: 'Plant Trees',
      hero_highlight_text: 'Grow Hope',
      hero_description: 'Join the reforestation movement. Sponsor a tree and help restore our planet\'s forests for generations to come.',
      hero_btn_primary_text: 'Sponsor a Tree',
      hero_btn_primary_url: '/sponsor',
      hero_btn_secondary_text: 'How It Works',
      hero_btn_secondary_url: '/how-it-works',
      hero_overlay_color: '#0f2606',
      hero_overlay_opacity: '0.70',
      hero_stat_trees_planted: '15000',
      hero_stat_sponsors: '3200',
      hero_stat_rural_growers: '85',
      hero_stat_communities: '42',
      about_hero_bg_image: '',
      how_it_works_bg_image: '',
      how_it_works_step1_image: '',
      how_it_works_step2_image: '',
      how_it_works_step3_image: '',
      how_it_works_whoweare_image: '',
      how_it_works_urban_planters_image: '',
      how_it_works_rural_growers_image: '',
      trees_bg_image: '',
      impact_bg_image: '',
      news_bg_image: '',
      contact_bg_image: '',
      sponsor_bg_image: '',
      tracking_bg_image: '',
      default_page_banner: '',
    };
    for (const [key, value] of Object.entries(defaults)) {
      if (!Settings.get(key)) {
        Settings.set(key, value);
      }
    }
    console.log('Default settings created');
  },

  seedTreeSpecies() {
    if (TreeSpecies.count() > 0) return;

    const species = [
      { name: 'Narra', scientific_name: 'Pterocarpus indicus', description: 'The national tree of the Philippines, known for its durable wood and beautiful yellow flowers. A keystone species for reforestation.', benefits: 'Provides high-quality timber, prevents soil erosion, supports bird populations, nitrogen-fixing', native_region: 'Southeast Asia', growth_rate: 'Fast', max_height: '30-40 meters', climate_zone: 'Tropical' },
      { name: 'Mahogany', scientific_name: 'Swietenia macrophylla', description: 'A valuable hardwood species widely used in reforestation for its rapid growth and economic value.', benefits: 'High timber value, carbon sequestration, shade provision, habitat creation', native_region: 'Central and South America', growth_rate: 'Fast', max_height: '40-50 meters', climate_zone: 'Tropical' },
      { name: 'Molave', scientific_name: 'Vitex parviflora', description: 'A resilient native hardwood species known for its durability and resistance to termites.', benefits: 'Excellent timber, erosion control, windbreak, wildlife food source', native_region: 'Philippines', growth_rate: 'Moderate', max_height: '25-30 meters', climate_zone: 'Tropical' },
      { name: 'Niyog-niyogan', scientific_name: 'Ficus pseudopalma', description: 'A unique fig species native to the Philippines, important for local biodiversity and soil health.', benefits: 'Wildlife habitat, soil improvement, ornamental value, medicinal uses', native_region: 'Philippines', growth_rate: 'Moderate', max_height: '5-8 meters', climate_zone: 'Tropical' },
      { name: 'Acacia', scientific_name: 'Samanea saman', description: 'A fast-growing shade tree with a wide canopy, excellent for reforestation and agroforestry.', benefits: 'Nitrogen-fixing, shade provision, livestock forage, erosion control', native_region: 'Central and South America', growth_rate: 'Fast', max_height: '25-30 meters', climate_zone: 'Tropical' },
    ];

    for (const s of species) {
      TreeSpecies.create(s);
    }
    console.log('Tree species seeded');
  },

  seedFAQs() {
    if (FAQ.count() > 0) return;

    const faqs = [
      { question: 'How does tree sponsorship work?', answer: 'You choose a tree species and quantity, start a sponsorship, and we partner with a rural grower who plants and cares for the tree. You receive updates on your tree\'s growth.', category: 'Sponsorship', sort_order: 1 },
      { question: 'How much does it cost to sponsor a tree?', answer: 'The cost varies by species, but most trees can be sponsored starting at ₱100 per tree. This covers the sapling, planting, and care for the first year.', category: 'Sponsorship', sort_order: 2 },
      { question: 'Can I visit the tree I sponsored?', answer: 'Yes! We encourage sponsors to visit the planting sites. Contact us and we can arrange a visit with the grower managing your tree.', category: 'Sponsorship', sort_order: 3 },
      { question: 'What species of trees do you plant?', answer: 'We plant native and endemic species that are well-suited to the local ecosystem. Our tree directory shows the species currently available for sponsorship.', category: 'Trees', sort_order: 4 },
      { question: 'How are rural growers selected?', answer: 'Rural growers are vetted through our partner organizations. They receive training in sustainable farming and reforestation practices.', category: 'Growers', sort_order: 5 },
      { question: 'Is my sponsorship contribution tax-deductible?', answer: 'My Pet Tree is a reforestation advocacy platform. Please consult with your tax advisor regarding the deductibility of your contribution.', category: 'Sponsorship', sort_order: 6 },
    ];

    for (const f of faqs) {
      FAQ.create(f);
    }
    console.log('FAQs seeded');
  },

  seedUrbanPlanters() {
    if (UrbanPlanter.count() > 0) return;

    const planters = [
      { name: 'Maria Santos', email: 'maria.santos@example.com', phone: '+63 912 345 6789', location: 'Quezon City, Philippines', organization: 'Green Metro Initiative', bio: 'Maria is an environmental advocate who leads urban tree-planting activities in Metro Manila. She coordinates with local government units to identify suitable planting sites and mobilizes community volunteers for reforestation efforts.' },
      { name: 'Juan dela Cruz', email: 'juan.delacruz@example.com', phone: '+63 917 654 3210', location: 'Makati, Philippines', organization: 'Trees for Tomorrow Foundation', bio: 'A former corporate executive turned environmentalist, Juan uses his network to connect urban donors with rural growing communities. He believes that reforestation is a shared responsibility between the city and the countryside.' },
      { name: 'Elena Reyes', email: 'elena.reyes@example.com', phone: '+63 915 789 0123', location: 'Baguio, Philippines', organization: 'Cordillera Green Network', bio: 'Elena grew up in the Cordillera mountains and has dedicated her life to protecting the region\'s watersheds. She works closely with indigenous communities to integrate traditional knowledge with modern reforestation techniques.' },
    ];

    for (const p of planters) {
      UrbanPlanter.create(p);
    }
    console.log('Urban planters seeded');
  },

  seedRuralGrowers() {
    if (RuralGrower.count() > 0) return;

    const growers = [
      { name: 'Pedro Mendoza', email: 'pedro.mendoza@example.com', phone: '+63 920 111 2233', location: 'Nueva Ecija', farm_size: '5 hectares', bio: 'Pedro is a third-generation farmer who has converted part of his family farm into a tree nursery. He grows native hardwood seedlings and mentors other farmers in sustainable agroforestry practices.' },
      { name: 'Luzviminda Torres', email: 'luz.torres@example.com', phone: '+63 921 222 3344', location: 'Laguna', farm_size: '3 hectares', bio: 'Luz leads a women\'s farming cooperative that manages a community tree nursery. Her group focuses on planting fruit-bearing native trees that provide both ecological and economic benefits to their community.' },
      { name: 'Ramon Gonzales', email: 'ramon.gonzales@example.com', phone: '+63 922 333 4455', location: 'Batangas', farm_size: '8 hectares', bio: 'Ramon combines reforestation with organic farming on his land. He has planted over 2,000 native trees alongside coffee and cacao, creating a thriving agroforest that supports local biodiversity.' },
      { name: 'Teresa Ramirez', email: 'teresa.ramirez@example.com', phone: '+63 923 444 5566', location: 'Pampanga', farm_size: '4 hectares', bio: 'Teresa is a retired school teacher who turned her ancestral lot into a community-managed forest. She works with local schools to educate children about the importance of native trees and environmental stewardship.' },
    ];

    for (const g of growers) {
      RuralGrower.create(g);
    }

    const planterIds = UrbanPlanter.getAll().map(p => p.id);
    const growerIds = RuralGrower.getAll().map(g => g.id);

    if (planterIds.length >= 1 && growerIds.length >= 1) {
      RuralGrower.setLinkedPlanters(growerIds[0], [planterIds[0]]);
      console.log('  Linked Pedro Mendoza -> Maria Santos');
    }
    if (planterIds.length >= 1 && growerIds.length >= 2) {
      RuralGrower.setLinkedPlanters(growerIds[1], [planterIds[0]]);
      console.log('  Linked Luzviminda Torres -> Maria Santos');
    }
    if (planterIds.length >= 2 && growerIds.length >= 3) {
      RuralGrower.setLinkedPlanters(growerIds[2], [planterIds[1]]);
      console.log('  Linked Ramon Gonzales -> Juan dela Cruz');
    }
    if (planterIds.length >= 3 && growerIds.length >= 4) {
      RuralGrower.setLinkedPlanters(growerIds[3], [planterIds[2]]);
      console.log('  Linked Teresa Ramirez -> Elena Reyes');
    }

    console.log('Rural growers seeded');
  },

  seedNews() {
    if (News.count() > 0) return;

    const articles = [
      {
        title: 'Community Reforestation Drive Plants 5,000 Trees in One Week',
        slug: 'community-reforestation-drive-5000-trees',
        excerpt: 'Our community-led reforestation initiative in Laguna successfully planted 5,000 native trees in just seven days, with over 200 volunteers from local schools and businesses participating.',
        body: 'The week-long event brought together students, corporate volunteers, and local farmers who worked side by side to plant native hardwood seedlings across 12 hectares of degraded land. The initiative was coordinated by Urban Planter Maria Santos and supported by Rural Grower Luzviminda Torres.\n\n"Seeing the community come together like this gives me hope," said Santos. "Every tree planted is a promise to future generations."\n\nThe trees planted include Narra, Molave, and Acacia species, which are well-adapted to the local climate and provide essential habitat for native wildlife.\n\nVolunteers also participated in educational workshops on sustainable forestry and the importance of native species in ecosystem restoration.',
        author: 'My Pet Tree Team',
        is_published: true,
      },
      {
        title: 'Rural Growers Report Strong Growth for Sponsored Trees This Season',
        slug: 'rural-growers-strong-growth-sponsored-trees',
        excerpt: 'Despite a challenging dry season, our network of rural growers reports a 92% survival rate for sponsored trees planted in the last year.',
        body: 'The quarterly report from our rural grower network shows encouraging results for reforestation efforts across four provinces. Pedro Mendoza from Nueva Ecija reported that his Narra seedlings have reached an average height of 1.5 meters, while Ramon Gonzales in Batangas noted that his Molave trees are thriving in the agroforestry setting.\n\n"Our trees are growing strong because the soil is healthy," said Gonzales. "The combination of reforestation and organic farming creates a perfect environment for native species."\n\nThe high survival rate is attributed to the careful matching of tree species to local growing conditions and the dedicated care provided by our rural grower partners.',
        author: 'My Pet Tree Team',
        is_published: true,
      },
      {
        title: 'New Partnership Expands Reforestation to Baguio Watershed Areas',
        slug: 'new-partnership-baguio-watershed-reforestation',
        excerpt: 'My Pet Tree partners with the Cordillera Green Network to restore critical watershed areas in Baguio and Benguet, home to endangered pine forest ecosystems.',
        body: 'This new partnership, led by Urban Planter Elena Reyes, aims to plant 10,000 native Benguet pine and Alnos trees over the next two years in critical watershed areas that supply water to Baguio City and surrounding municipalities.\n\n"Our watersheds are the source of life for our communities," said Reyes. "By restoring these forests, we are protecting the water supply and creating livelihoods for indigenous communities."\n\nThe project will work with local indigenous groups who have traditional knowledge of forest management, combining ancestral practices with modern reforestation techniques.',
        author: 'My Pet Tree Team',
        is_published: true,
      },
    ];

    for (const a of articles) {
      News.create(a);
    }
    console.log('News articles seeded');
  },

  seedTrackingUpdates() {
    const growers = RuralGrower.getAll();
    if (growers.length === 0) {
      console.log('  No growers available for tracking updates - skipping');
      return;
    }

    const existing = TrackingUpdate.getAllByGrower(growers[0].id);
    if (existing && existing.length > 0) return;

    const updateTemplates = [
      {
        title: 'Site Preparation Completed',
        description: 'Prepared the planting site by clearing invasive species and marking tree positions. Soil quality looks good after the recent rains.',
        notes: 'Soil tested at pH 6.2, suitable for native hardwoods. Marked 500 planting spots.',
        daysAgo: 90,
      },
      {
        title: 'Seedlings Planted',
        description: 'Planted 200 Narra and 150 Molave seedlings today. Weather conditions were ideal with overcast skies and light drizzle.',
        notes: 'All seedlings were sourced from our certified nursery. Applied organic mulch around each tree.',
        daysAgo: 60,
      },
      {
        title: 'First Month Growth Check',
        description: 'All seedlings are showing healthy growth. Only 5% mortality rate, which is excellent. Weed maintenance was performed around each tree.',
        notes: 'Average height increase of 8cm for Narra, 6cm for Molave. No pest damage observed.',
        daysAgo: 30,
      },
      {
        title: 'Quarterly Maintenance Complete',
        description: 'Performed regular maintenance including weeding, watering, and applying organic fertilizer. Trees are thriving with the rainy season in full effect.',
        notes: 'Narra trees now average 45cm height. Molave trees average 35cm. Additional 50 trees planted to replace the small number that did not survive.',
        daysAgo: 7,
      },
    ];

    for (const grower of growers) {
      for (let i = 0; i < updateTemplates.length; i++) {
        const t = updateTemplates[i];
        const date = new Date();
        date.setDate(date.getDate() - t.daysAgo);
        const updateDate = date.toISOString().split('T')[0];

        TrackingUpdate.create({
          rural_grower_id: grower.id,
          title: t.title,
          description: t.description,
          update_date: updateDate,
          notes: t.notes,
          status: 'active',
        });
      }
    }
    console.log('Tracking updates seeded');
  },
};

module.exports = seedService;
