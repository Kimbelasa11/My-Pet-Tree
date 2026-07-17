const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const Content = require('../models/Content');
const Settings = require('../models/Settings');
const TreeSpecies = require('../models/TreeSpecies');
const FAQ = require('../models/FAQ');

const seedService = {
  seed() {
    this.seedAdmin();
    this.seedContent();
    this.seedSettings();
    this.seedTreeSpecies();
    this.seedFAQs();
  },

  seedAdmin() {
    if (User.count() > 0) return;

    const hash = bcrypt.hashSync(config.admin.password, 12);
    User.create(config.admin.username, hash);
    console.log(`Admin user created: ${config.admin.username}`);
  },

  seedContent() {
    const pages = [
      { page: 'home', section: 'hero', title: 'Plant Trees, Grow Hope', subtitle: 'Join the reforestation movement. Sponsor a tree and help restore our planet\'s forests for generations to come.', body: null },
      { page: 'home', section: 'mission', title: 'Our Mission', subtitle: null, body: 'We empower communities to restore degraded lands through tree sponsorship, connecting urban supporters with rural growers to create lasting environmental and social impact.' },
      { page: 'home', section: 'stats', title: null, subtitle: null, body: JSON.stringify({ treesPlanted: 15000, activeGrowers: 85, communitiesReached: 42, speciesPlanted: 30 }) },
      { page: 'about', section: 'hero', title: 'About My Pet Tree', subtitle: 'A reforestation advocacy platform connecting people who care about the planet with the communities who nurture it.', body: null },
      { page: 'about', section: 'story', title: 'Our Story', subtitle: null, body: 'My Pet Tree began as a small community initiative to restore local forests. Today, we are a growing platform that connects sponsors, urban planters, and rural growers in a shared mission to reforest the planet. Every tree sponsored through our platform represents a partnership between someone who wants to make a difference and a grower who nurtures that tree to maturity.' },
      { page: 'about', section: 'values', title: 'Our Values', subtitle: null, body: JSON.stringify([{ title: 'Sustainability', description: 'We prioritize long-term ecological health in every planting.' }, { title: 'Community', description: 'We empower local growers and strengthen rural economies.' }, { title: 'Transparency', description: 'Every tree is tracked, every contribution is accounted for.' }, { title: 'Impact', description: 'We measure success by forests restored and lives improved.' }]) },
      { page: 'how-it-works', section: 'hero', title: 'How It Works', subtitle: 'Sponsor a tree in three simple steps and watch your impact grow.', body: null },
      { page: 'impact', section: 'hero', title: 'Our Impact', subtitle: 'Every tree tells a story. See the difference we\'re making together.', body: null },
      { page: 'contact', section: 'hero', title: 'Get in Touch', subtitle: 'Have questions, suggestions, or want to partner with us? We\'d love to hear from you.', body: null },
      { page: 'sponsor', section: 'hero', title: 'Sponsor a Tree', subtitle: 'Choose a tree species and make a lasting impact on our planet.', body: null },
    ];

    for (const c of pages) {
      Content.update(c.page, c.section, c);
    }
    console.log('Default content created');
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
      { question: 'How does tree sponsorship work?', answer: 'You choose a tree species and quantity, make a donation, and we partner with a rural grower who plants and cares for the tree. You receive updates on your tree\'s growth.', category: 'Sponsorship', sort_order: 1 },
      { question: 'How much does it cost to sponsor a tree?', answer: 'The cost varies by species, but most trees can be sponsored starting at ₱100 per tree. This covers the sapling, planting, and care for the first year.', category: 'Sponsorship', sort_order: 2 },
      { question: 'Can I visit the tree I sponsored?', answer: 'Yes! We encourage sponsors to visit the planting sites. Contact us and we can arrange a visit with the grower managing your tree.', category: 'Sponsorship', sort_order: 3 },
      { question: 'What species of trees do you plant?', answer: 'We plant native and endemic species that are well-suited to the local ecosystem. Our tree directory shows the species currently available for sponsorship.', category: 'Trees', sort_order: 4 },
      { question: 'How are rural growers selected?', answer: 'Rural growers are vetted through our partner organizations. They receive training in sustainable farming and reforestation practices.', category: 'Growers', sort_order: 5 },
      { question: 'Is my donation tax-deductible?', answer: 'My Pet Tree is an advocacy platform. Please consult with your tax advisor regarding the deductibility of your contribution.', category: 'Donations', sort_order: 6 },
    ];

    for (const f of faqs) {
      FAQ.create(f);
    }
    console.log('FAQs seeded');
  },
};

module.exports = seedService;
