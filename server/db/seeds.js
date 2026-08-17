const db = require('./database');

function seedDatabase() {
  console.log('🌱 Updating SR SHOP database with official store profile and imported products...');

  // 1. Seed Real Store Profile & Settings from the Facebook Banner
  const defaultSettings = [
    ['store_name', 'SR SHOP'],
    ['store_tagline', 'ត្រូវការ គ្រឿងអេឡិចត្រូនិក និងសម្ភារៈប្រើប្រាស់ប្រចាំថ្ងៃនាំចូលផ្ទាល់ (Direct Imported Quality Electronics & Everyday Essentials)'],
    ['store_address', 'បុរីពិភពថ្មីកំបូល 3, ភូមិថ្មី, សង្កាត់កំបូល, ខណ្ឌកំបូល, រាជធានីភ្នំពេញ (Borey Piphup Thmey Kamboul 3, Phnom Penh)'],
    ['store_phone', '098 33 47 55'],
    ['store_email', 'contact@srmacshop.com'],
    ['store_website', 'srmacshop.com'],
    ['store_facebook', 'https://www.facebook.com/SRonlines.shop/'],
    ['store_messenger', 'https://m.me/SRonlines.shop'],
    ['store_telegram', 'https://t.me/SIYEANLONG'],
    ['store_telegram_handle', '@SIYEANLONG'],
    ['store_whatsapp', '+85598334755'],
    ['store_currency', '$'],
    ['free_shipping_threshold', '30'],
    ['announcement_text', '🎉 SR SHOP - គ្រឿងអេឡិចត្រូនិកគុណភាពខ្ពស់នាំចូលផ្ទាល់ពីប្រទេសចិន | ទំនាក់ទំនង: 098 33 47 55 | ដឹកជញ្ជូនរហ័សទូទាំងប្រទេស'],
    ['store_banner_image', '/sr-shop-banner.jpg']
  ];

  const setStmt = db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`);
  db.transaction(() => {
    for (const [key, value] of defaultSettings) {
      setStmt.run(key, value);
    }
  })();

  // 2. Seed Categories
  const categories = [
    {
      id: 'cat_auto',
      name: 'គ្រឿងបន្លាស់ និងឧបករណ៍ឡាន (Auto & Car Gear)',
      slug: 'auto-accessories',
      icon: 'Car',
      description: 'ឧបករណ៍សាកថ្មឡាន ស្នប់ខ្យល់កង់ឌីជីថល និងម៉ាស៊ីនបូមធូលីក្នុងឡាន',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      display_order: 1
    },
    {
      id: 'cat_tools',
      name: 'ឧបករណ៍ជួសជុល និងសម្ភារៈជាង (Hardware & Tools)',
      slug: 'hardware-tools',
      icon: 'Wrench',
      description: 'ប្រអប់ឧបករណ៍ជួសជុលផ្ទះ និងឡានគ្រប់មុខគុណភាពខ្ពស់',
      image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
      display_order: 2
    },
    {
      id: 'cat_electronics',
      name: 'គ្រឿងអេឡិចត្រូនិក និង Smart Gadgets (Electronics)',
      slug: 'smart-electronics',
      icon: 'Cpu',
      description: 'ឧបករណ៍ GPS តាមដានឡាន ក្បាលសាកល្បឿនលឿន និងកាសប៊្លូធូស',
      image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80',
      display_order: 3
    },
    {
      id: 'cat_home',
      name: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ (Home & Personal Care)',
      slug: 'home-lifestyle',
      icon: 'Home',
      description: 'ឧបករណ៍កៀបសក់ ថ្នាំបំបាត់ស្ទះលូ និងឧបករណ៍បាញ់មូសអគ្គិសនី',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      display_order: 4
    }
  ];

  const catStmt = db.prepare(`INSERT OR REPLACE INTO categories (id, name, slug, icon, description, image, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  db.transaction(() => {
    for (const cat of categories) {
      catStmt.run(cat.id, cat.name, cat.slug, cat.icon, cat.description, cat.image, cat.display_order);
    }
  })();

  // 3. Seed Exact Products from the Banner Image
  const products = [
    {
      id: 'sr_prod_1',
      name: 'Multi-Function High-Power Car Jump Starter & Emergency Power Bank Kit',
      slug: 'multi-function-high-power-car-jump-starter-kit',
      category_id: 'cat_auto',
      description: 'ឧបករណ៍បញ្ឆេះអាគុយឡានចល័តកម្លាំងខ្លាំង 20000mAh ភ្ជាប់មកជាមួយពិល LED បន្ទាន់ ដង្កៀបអាគុយសុវត្ថិភាព ឧបករណ៍បូមខ្យល់កង់ និងប្រអប់ដែករឹងមាំសម្រាប់ដាក់ក្នុងឡាន។ អាចបញ្ឆេះឡានបានយ៉ាងងាយស្រួលដោយខ្លួនឯងមិនបាច់រង់ចាំជំនួយ។',
      short_description: '20,000mAh High-Power 12V Emergency Car Jump Starter + Air Pump + Heavy Duty Case.',
      cost_price: 21.50,
      price: 49.00,
      compare_at_price: 85.00,
      stock: 45,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'TOP SELLER',
      rating: 4.9,
      review_count: 84,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Edition', options: ['Standard Jump Starter Kit', 'Deluxe Edition + Air Compressor Pump (+ $15)'] }
      ]),
      specs: JSON.stringify({
        'Battery Capacity': '20,000 mAh High-Rate Polymer',
        'Peak Current': '1200A Peak Output',
        'Output Voltage': '12V Car Start, 5V/2A Dual USB Fast Charge',
        'Built-in Features': 'Multi-mode Emergency LED Strobe & SOS, Compass, Hard Toolbox Case',
        'Origin': 'Factory Direct Import (China High-Power Series)'
      }),
      supplier_info: 'Guangdong AutoTech Electronics (SKU: SR-JUMP-HP8)'
    },
    {
      id: 'sr_prod_2',
      name: 'Digital Portable Car & Motorcycle Tire Inflator Air Pump',
      slug: 'digital-portable-car-motorcycle-tire-inflator-air-pump',
      category_id: 'cat_auto',
      description: 'ស្នប់បូមខ្យល់កង់ឌីជីថលស្វ័យប្រវត្តិកម្លាំងខ្លាំង កំណត់កម្រិតសម្ពាធខ្យល់តាមតម្រូវការ និងបិទដោយស្វ័យប្រវត្តិពេលពេញ។ អេក្រង់ LED ច្បាស់ មានពិលបំភ្លឺពេលយប់ ប្រើប្រាស់បានជាមួយឡាន ម៉ូតូ កង់ និងបាល់។',
      short_description: 'Automatic Preset Digital Tire Inflator with LED screen & Emergency Light.',
      cost_price: 11.00,
      price: 28.00,
      compare_at_price: 45.00,
      stock: 65,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'CAR MUST-HAVE',
      rating: 4.8,
      review_count: 62,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Power Type', options: ['12V Car Cigarette Plug', 'Wireless USB Rechargeable Battery (+ $6)'] }
      ]),
      specs: JSON.stringify({
        'Max Pressure': '150 PSI',
        'Display': 'Digital HD LCD Screen with Real-Time Pressure',
        'Auto Shutoff': 'Yes (Prevents over-inflation)',
        'Accessories': '3 Nozzle Adapters for Cars, Bikes, Balls, Inflatables'
      }),
      supplier_info: 'Zhejiang AirPro Appliances'
    },
    {
      id: 'sr_prod_3',
      name: 'Complete Home & Auto Hardware Repair Tool Set Box',
      slug: 'complete-home-auto-hardware-repair-tool-set-box',
      category_id: 'cat_tools',
      description: 'ប្រអប់ឧបករណ៍ជួសជុលគ្រប់មុខផលិតពីដែកថែប Chrome Vanadium គុណភាពខ្ពស់ មិនងាយរេចរឹល។ ក្នុងប្រអប់មាន ដង្កៀប ទុលឡឺវីស កាំបិតក្រដាស កាសែតម៉ែត្រ និងក្បាលទុលឡឺវីសច្រើនទំហំ ងាយស្រួលទុកដាក់ និងយកតាមខ្លួន។',
      short_description: 'Heavy-duty multi-piece toolbox with pliers, screwdrivers, utility knife & carry case.',
      cost_price: 9.20,
      price: 24.50,
      compare_at_price: 42.00,
      stock: 50,
      is_featured: 1,
      is_trending: 0,
      is_best_seller: 1,
      badge: 'POPULAR HARDWARE',
      rating: 4.9,
      review_count: 53,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Tool Count', options: ['Essential 16-Piece Kit', 'Master 32-Piece Kit (+ $8)'] }
      ]),
      specs: JSON.stringify({
        'Material': 'High-Grade CR-V (Chrome Vanadium) Steel',
        'Case': 'Impact-Resistant Molded Toolbox',
        'Ideal For': 'Home DIY, Automotive Emergency, Electrical Repairs'
      }),
      supplier_info: 'Yongkang Hardware Tools Ltd.'
    },
    {
      id: 'sr_prod_4',
      name: 'High-Power Cordless Handheld Car & Home Vacuum Cleaner',
      slug: 'high-power-cordless-handheld-car-vacuum-cleaner',
      category_id: 'cat_auto',
      description: 'ម៉ាស៊ីនបូមធូលីចល័តក្នុងឡាន និងក្នុងផ្ទះ កម្លាំងបឺតខ្លាំង 8500Pa បូមបានទាំងសើមនិងស្ងួត។ តម្រង HEPA អាចលាងទឹកបាន មកជាមួយក្បាលបឺតច្រើនប្រភេទសម្រាប់សម្អាតកន្លែងចង្អៀត និងពូកឡាន។',
      short_description: '8500Pa Strong Cyclonic Suction, Washable HEPA Filter & Multi-Nozzle Set.',
      cost_price: 6.80,
      price: 18.99,
      compare_at_price: 35.00,
      stock: 80,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'TOP VALUE',
      rating: 4.7,
      review_count: 76,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['Sleek Black', 'Pearl White'] }
      ]),
      specs: JSON.stringify({
        'Suction Power': '8,500 Pa Cyclonic Motor',
        'Filter': 'Washable & Reusable Nano HEPA Filter',
        'Battery': 'USB Fast Rechargeable Lithium (35 min run time)',
        'Weight': '380g Ergonomic Lightweight'
      }),
      supplier_info: 'Ningbo CleanTech Electrical'
    },
    {
      id: 'sr_prod_5',
      name: 'Dual USB Fast Car Charger & Bluetooth FM Transmitter with Hands-Free Calling',
      slug: 'dual-usb-fast-car-charger-bluetooth-fm-transmitter',
      category_id: 'cat_electronics',
      description: 'ក្បាលសាកលឿនដោតក្នុងឡានភ្ជាប់ Bluetooth 5.0 ចាក់ចម្រៀងចេញពីទូរស័ព្ទចូលធុងបាសឡាន និងនិយាយទូរស័ព្ទ Hands-Free ច្បាស់ល្អ។ មានអេក្រង់ LED បង្ហាញតង់ស្យុងអាគុយឡាន និងរន្ធសាកល្បឿនលឿន 2 រន្ធ។',
      short_description: 'Bluetooth 5.0 Music Streaming, Hands-free call, LED voltage display & Dual Fast USB.',
      cost_price: 2.90,
      price: 9.50,
      compare_at_price: 19.00,
      stock: 120,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'CAR ESSENTIAL',
      rating: 4.8,
      review_count: 94,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Edition', options: ['Matte Black Dual USB', 'RGB Color Light Version (+ $2)'] }
      ]),
      specs: JSON.stringify({
        'Bluetooth': 'V5.0 + EDR (Up to 10m range)',
        'Output Ports': 'Dual USB QC 3.1A Fast Charge',
        'FM Frequency': '87.5 - 108.0 MHz',
        'Features': 'Built-in Noise Canceling Microphone, USB Flash Drive & TF Card Support'
      }),
      supplier_info: 'Shenzhen SoundPro Audio'
    },
    {
      id: 'sr_prod_6',
      name: 'Smart Real-Time GPS Vehicle & Asset Tracker with Mobile App',
      slug: 'smart-realtime-gps-vehicle-asset-tracker',
      category_id: 'cat_electronics',
      description: 'ឧបករណ៍ GPS តូចល្មមសម្រាប់តាមដានទីតាំងឡាន ម៉ូតូ និងសម្ភារៈមានតម្លៃតាមទូរស័ព្ទដៃ Real-time 24 ម៉ោង។ មានមុខងារផ្ញើសាររោទ៍ពេលឡានរំញ័រ ឬចាកចេញពីតំបន់សុវត្ថិភាព (Geofencing) និងមើលប្រវត្តិធ្វើដំណើរឡើងវិញបាន។',
      short_description: '24/7 Live GPS tracking, anti-theft vibration alarm & route history on smartphone.',
      cost_price: 12.50,
      price: 32.00,
      compare_at_price: 59.00,
      stock: 40,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 0,
      badge: 'SMART GPS',
      rating: 4.9,
      review_count: 48,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Model', options: ['OBD-II Direct Plug', 'Magnetic Hidden Wireless Battery'] }
      ]),
      specs: JSON.stringify({
        'Accuracy': 'GPS + LBS + Beidou Positioning (Under 5m error)',
        'App Support': 'Free iOS & Android App (No Monthly Subscription)',
        'Alerts': 'Speeding Alert, Geo-fence Boundary, Geo-tamper Alert'
      }),
      supplier_info: 'Shenzhen MicroGPS Tech'
    },
    {
      id: 'sr_prod_7',
      name: '2-in-1 Ceramic Tourmaline Hair Straightener & Curling Wand',
      slug: '2-in-1-ceramic-tourmaline-hair-straightener-curler',
      category_id: 'cat_home',
      description: 'ឧបករណ៍កៀបសក់ និងមូលសក់ 2-in-1 ក្តៅលឿនក្នុងរយៈពេលត្រឹមតែ 30 វិនាទី។ បន្ទះសេរ៉ាមិច Tourmaline ជួយការពារសរសៃសក់មិនឱ្យខូច ឬឆេះ ធ្វើឱ្យសក់រលោងស្អាតជាប់បានយូរពេញមួយថ្ងៃ។',
      short_description: 'Fast 30s PTC heating ceramic tourmaline dual-function hair styling wand.',
      cost_price: 5.20,
      price: 16.50,
      compare_at_price: 32.00,
      stock: 75,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'BEAUTY BEST',
      rating: 4.8,
      review_count: 67,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Color Style', options: ['Matte Black & Red Accent', 'Rose Gold & Mint Green'] }
      ]),
      specs: JSON.stringify({
        'Heating Element': 'PTC Fast Heating (160°C - 220°C Adjustable)',
        'Plate Material': 'Tourmaline Ceramic Glaze (Ionic Protection)',
        'Cable': '360-Degree Swivel Tangle-Free Cord'
      }),
      supplier_info: 'Jinhua Beauty Electronics'
    },
    {
      id: 'sr_prod_8',
      name: 'Wireless Around-the-Neck Bluetooth Sports Headset',
      slug: 'wireless-around-the-neck-bluetooth-sports-headset',
      category_id: 'cat_electronics',
      description: 'កាសប៊្លូធូសពាក់កកម្លាំងបាសបុកពិរោះ សំឡេង Stereo ច្បាស់ល្អ និងមិនងាយជ្រុះពេលហាត់ប្រាណ ឬបើកបរ។ ថាមពលថ្មប្រើប្រាស់បានរហូតដល់ 20 ម៉ោងជាប់គ្នា ភ្ជាប់កាសមេដែកពេលឈប់ប្រើមិនឱ្យរញ៉េរញ៉ៃ។',
      short_description: '20h long battery life, deep bass stereo & ergonomic magnetic neckband.',
      cost_price: 3.80,
      price: 12.00,
      compare_at_price: 25.00,
      stock: 90,
      is_featured: 0,
      is_trending: 0,
      is_best_seller: 1,
      badge: 'HOT AUDIO',
      rating: 4.7,
      review_count: 51,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['Obsidian Black', 'Midnight Blue'] }
      ]),
      specs: JSON.stringify({
        'Bluetooth': 'V5.2 Low Latency Chipset',
        'Battery Life': '20 Hours Continuous Music Playtime',
        'Waterproof': 'IPX5 Sweat & Splash Proof for Workouts'
      }),
      supplier_info: 'Dongguan AudioCraft'
    },
    {
      id: 'sr_prod_9',
      name: 'Electric Smokeless Mosquito & Insect Repellent Vaporizer Set',
      slug: 'electric-smokeless-mosquito-insect-repellent-vaporizer-set',
      category_id: 'cat_home',
      description: 'ឧបករណ៍កម្ចាត់មូស និងសត្វល្អិតអគ្គិសនីដោតភ្លើង គ្មានផ្សែង គ្មានក្លិនឆួល និងមានសុវត្ថិភាពសម្រាប់កុមារ និងមនុស្សចាស់។ មកជាមួយដបទឹកថ្នាំការពារមូស 2 ដប ការពារបានរហូតដល់ 90 យប់។',
      short_description: 'Smokeless, odorless mosquito repellent heater plug with 2 refill liquid bottles.',
      cost_price: 1.80,
      price: 7.50,
      compare_at_price: 15.00,
      stock: 140,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'FAMILY SAFE',
      rating: 4.8,
      review_count: 88,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Package', options: ['Heater Plug + 2 Refill Bottles (90 Nights)', 'Family Value Pack (+ 4 Refills)'] }
      ]),
      specs: JSON.stringify({
        'Coverage': 'Up to 25 sq. meters room protection',
        'Formula': 'Plant-Derived Mild Pyrethroid (Odorless)',
        'Plug Type': 'Rotatable 90° Standard 2-Pin Plug'
      }),
      supplier_info: 'Zhejiang HomeCare Sourcing'
    },
    {
      id: 'sr_prod_10',
      name: 'Fast-Acting Pipe & Drain Cleaner Foaming Agent (2-Bottle Value Pack)',
      slug: 'fast-acting-pipe-drain-cleaner-foaming-agent',
      category_id: 'cat_home',
      description: 'ម្សៅពពុះពិសេសសម្រាប់រំលាយខ្លាញ់ សក់ កម្ទេចកំទី និងកម្ចាត់ក្លិនស្អុយក្នុងទុយោលូ បង្គន់ និងកន្លែងលាងចានបានយ៉ាងមានប្រសិទ្ធភាពក្នុងរយៈពេលតែ 15 នាទី ដោយមិនធ្វើឱ្យខូចបំពង់ទុយោ។',
      short_description: 'Heavy-duty drain clog remover & deodorizer for sinks, toilets & sewer pipes.',
      cost_price: 2.20,
      price: 8.50,
      compare_at_price: 16.00,
      stock: 110,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 1,
      badge: 'TOP CLEANER',
      rating: 4.9,
      review_count: 72,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Size', options: ['Twin 2-Bottle Pack (2x 260g)', 'Mega 4-Bottle Value Set (+ $6)'] }
      ]),
      specs: JSON.stringify({
        'Weight': '260g per bottle (Contains powerful active enzymes)',
        'Safe On': 'PVC Pipes, Cast Iron, Copper & Stainless Sinks',
        'Application': 'Kitchen sinks, bathroom drains, floor traps, toilets'
      }),
      supplier_info: 'Yiwu Household Chemical Sourcing'
    },
    {
      id: 'sr_prod_11',
      name: 'Braided Fast-Charging 3-in-1 Multi Cable with Leather Travel Case',
      slug: 'braided-fast-charging-3in1-multi-cable-with-pouch',
      category_id: 'cat_electronics',
      description: 'ខ្សែសាកល្បឿនលឿន 3-in-1 ស្វិតមាំមិនងាយដាច់ មានក្បាលសាក Lightning (iPhone), Type-C និង Micro-USB ក្នុងខ្សែតែមួយ។ ភ្ជាប់មកជាមួយកាបូបស្បែកតូចសម្រាប់រៀបចំទុកដាក់តាមខ្លួនយ៉ាងស្អាត។',
      short_description: 'Durable nylon braided 3-in-1 fast charging cable with portable organizer wrap.',
      cost_price: 1.50,
      price: 6.00,
      compare_at_price: 12.00,
      stock: 150,
      is_featured: 0,
      is_trending: 0,
      is_best_seller: 1,
      badge: 'DAILY ESSENTIAL',
      rating: 4.8,
      review_count: 105,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['Ruby Red & Grey Case', 'Stealth Black', 'Navy Blue'] }
      ]),
      specs: JSON.stringify({
        'Connectors': 'USB-A to Type-C, Lightning, Micro-USB',
        'Max Current': '3.5A Fast Charging Output',
        'Cable Length': '1.2 Meters High-Density Nylon Braided'
      }),
      supplier_info: 'Shenzhen LinkTech Cables'
    }
  ];

  const prodStmt = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, name, slug, category_id, description, short_description, cost_price, price,
      compare_at_price, stock, is_featured, is_trending, is_best_seller, badge,
      rating, review_count, images, variants, specs, supplier_info
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const p of products) {
      prodStmt.run(
        p.id, p.name, p.slug, p.category_id, p.description, p.short_description,
        p.cost_price, p.price, p.compare_at_price, p.stock, p.is_featured,
        p.is_trending, p.is_best_seller, p.badge, p.rating, p.review_count,
        p.images, p.variants, p.specs, p.supplier_info
      );
    }
  })();

  // 4. Seed Slides for Dynamic Hero Slideshow
  const initialSlides = [
    {
      id: 'slide_1',
      title: '20,000mAh High-Power Car Jump Starter & Emergency Kit',
      title_km: 'ឧបករណ៍បញ្ឆេះអាគុយឡានចល័តកម្លាំងខ្លាំង 20000mAh',
      subtitle: 'Never get stranded! 12V instant engine jump start + emergency tire pump & LED strobe.',
      subtitle_km: 'បញ្ឆេះឡានបានភ្លាមៗដោយខ្លួនឯង ភ្ជាប់ជាមួយពិល LED បន្ទាន់ និងប្រអប់ដែករឹងមាំ។',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
      badge: '🔥 #1 BESTSELLER',
      price: 49.00,
      compare_at_price: 85.00,
      cta_text: 'Shop Jump Starter',
      cta_text_km: 'ទិញឧបករណ៍បញ្ឆេះឡាន',
      link_url: '',
      product_id: 'sr_prod_1',
      display_order: 1
    },
    {
      id: 'slide_2',
      title: 'Digital Automatic Tire Inflator Air Compressor',
      title_km: 'ស្នប់បូមខ្យល់កង់ឌីជីថលស្វ័យប្រវត្តិកម្លាំងខ្លាំង',
      subtitle: 'Fast digital preset with automatic shut-off and night LED lighting.',
      subtitle_km: 'កំណត់កម្រិតខ្យល់តាមតម្រូវការ និងបិទដោយស្វ័យប្រវត្តិពេលពេញ មានអេក្រង់ LCD ច្បាស់។',
      image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1200&auto=format&fit=crop&q=80',
      badge: '⚡ MUST HAVE CAR GEAR',
      price: 28.00,
      compare_at_price: 45.00,
      cta_text: 'Order Air Pump',
      cta_text_km: 'ទិញស្នប់បូមខ្យល់',
      link_url: '',
      product_id: 'sr_prod_2',
      display_order: 2
    },
    {
      id: 'slide_3',
      title: 'Real-Time GPS Vehicle Tracker with Smartphone App',
      title_km: 'ឧបករណ៍ GPS តាមដានទីតាំងឡាន ម៉ូតូ Real-Time 24 ម៉ោង',
      subtitle: '24/7 Live satellite tracking, anti-theft vibration alarm & route history.',
      subtitle_km: 'តាមដានទីតាំងផ្ទាល់ 24 ម៉ោងតាមទូរស័ព្ទដៃ មានមុខងាររោទ៍ប្រាប់ពេលឡានរំញ័រ។',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
      badge: '🛰️ SMART SECURITY',
      price: 32.00,
      compare_at_price: 59.00,
      cta_text: 'Get GPS Tracker',
      cta_text_km: 'ទិញឧបករណ៍ GPS',
      link_url: '',
      product_id: 'sr_prod_6',
      display_order: 3
    },
    {
      id: 'slide_4',
      title: '8,500Pa Cordless Handheld Car & Home Vacuum Cleaner',
      title_km: 'ម៉ាស៊ីនបូមធូលីចល័តក្នុងឡាន និងក្នុងផ្ទះ កម្លាំងបឺត 8500Pa',
      subtitle: 'Wet & dry cyclonic strong suction with washable nano HEPA filter.',
      subtitle_km: 'បូមបានទាំងសើមនិងស្ងួត តម្រង HEPA លាងទឹកបាន មកជាមួយក្បាលបឺតច្រើនប្រភេទ។',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&auto=format&fit=crop&q=80',
      badge: '✨ TOP CLEANING VALUE',
      price: 18.99,
      compare_at_price: 35.00,
      cta_text: 'Shop Vacuum',
      cta_text_km: 'ទិញម៉ាស៊ីនបូមធូលី',
      link_url: '',
      product_id: 'sr_prod_4',
      display_order: 4
    }
  ];

  const slideStmt = db.prepare(`
    INSERT OR REPLACE INTO slides (
      id, title, title_km, subtitle, subtitle_km, image, badge,
      price, compare_at_price, cta_text, cta_text_km, link_url, product_id, display_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  db.transaction(() => {
    for (const s of initialSlides) {
      slideStmt.run(
        s.id, s.title, s.title_km, s.subtitle, s.subtitle_km, s.image, s.badge,
        s.price, s.compare_at_price, s.cta_text, s.cta_text_km, s.link_url, s.product_id, s.display_order
      );
    }
  })();

  // 5. Coupons
  const coupons = [
    { code: 'SRSHOP10', discount_type: 'percent', discount_value: 10, min_spend: 0, usage_limit: 5000, times_used: 128, is_active: 1 },
    { code: 'SAVE20', discount_type: 'percent', discount_value: 20, min_spend: 40, usage_limit: 1000, times_used: 45, is_active: 1 },
    { code: 'FREESHIP', discount_type: 'fixed', discount_value: 3, min_spend: 25, usage_limit: 2000, times_used: 88, is_active: 1 }
  ];

  const couponStmt = db.prepare(`
    INSERT OR REPLACE INTO coupons (code, discount_type, discount_value, min_spend, usage_limit, times_used, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const c of coupons) {
      couponStmt.run(c.code, c.discount_type, c.discount_value, c.min_spend, c.usage_limit, c.times_used, c.is_active);
    }
  })();

  // 5. Customer Reviews
  const reviews = [
    {
      id: 'rev_sr1',
      product_id: 'sr_prod_1',
      user_name: 'Sokha R. (Verified Buyer)',
      rating: 5,
      comment: 'ទិញពី SR SHOP មកប្រើបានល្អខ្លាំងណាស់ បញ្ឆេះឡាន Camry ខ្ញុំឆេះភ្លាមៗ! គុណភាពល្អ និងដឹកជញ្ជូនលឿនដល់ផ្ទះ។'
    },
    {
      id: 'rev_sr2',
      product_id: 'sr_prod_2',
      user_name: 'Vicheka M. (Verified Buyer)',
      rating: 5,
      comment: 'ស្នប់បូមខ្យល់កង់នេះស្រួលប្រើណាស់ ដាក់ក្នុងឡានមិនខាតកន្លែង កំណត់កម្រិតខ្យល់ពេញបិទខ្លួនឯង។'
    },
    {
      id: 'rev_sr3',
      product_id: 'sr_prod_4',
      user_name: 'Chan Dara (Verified Buyer)',
      rating: 5,
      comment: 'ម៉ាស៊ីនបូមធូលីបឺតខ្លាំងល្អណាស់ បូមពូកឡានស្អាតគ្មានសល់ធូលី។ អរគុណ SR SHOP សម្រាប់តម្លៃសមរម្យ!'
    }
  ];

  const revStmt = db.prepare(`
    INSERT OR REPLACE INTO reviews (id, product_id, user_name, rating, comment, is_verified)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const r of reviews) {
      revStmt.run(r.id, r.product_id, r.user_name, r.rating, r.comment, r.is_verified);
    }
  })();

  // 6. Seed Realistic Orders with the Actual Products
  const sampleOrders = [
    {
      id: 'ord_sr101',
      order_number: 'SR-88301',
      customer_name: 'Sovan Kiry',
      customer_email: 'sovan.kiry@gmail.com',
      customer_phone: '098 33 47 55',
      shipping_address: 'Borey Piphup Thmey Kamboul 3, Phnom Penh',
      city: 'Phnom Penh',
      country: 'Cambodia',
      shipping_method: 'Standard Express (Phnom Penh Fast Delivery)',
      shipping_cost: 0,
      payment_method: 'Cash on Delivery (COD)',
      payment_status: 'Paid',
      subtotal: 49.00,
      discount_amount: 4.90,
      coupon_code: 'SRSHOP10',
      tax_amount: 3.09,
      total_amount: 47.19,
      total_cost: 21.50,
      gross_profit: 25.69,
      status: 'Delivered',
      tracking_carrier: 'J&T Express Cambodia',
      tracking_number: 'JT-883920194',
      notes: 'Customer contacted on Facebook Messenger for Car Jump Starter delivery.',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'ord_sr102',
      order_number: 'SR-88302',
      customer_name: 'Meng Ly',
      customer_email: 'mengly.tech@gmail.com',
      customer_phone: '012 88 99 77',
      shipping_address: 'St 271, Sangkat Boeung Tumpun, Khan Meanchey',
      city: 'Phnom Penh',
      country: 'Cambodia',
      shipping_method: 'Standard Express (Phnom Penh Fast Delivery)',
      shipping_cost: 0,
      payment_method: 'ABA / KHQR Pay',
      payment_status: 'Paid',
      subtotal: 46.99,
      discount_amount: 0,
      coupon_code: null,
      tax_amount: 3.29,
      total_amount: 50.28,
      total_cost: 17.80,
      gross_profit: 32.48,
      status: 'Shipped',
      tracking_carrier: 'Virak Buntham Express (VET)',
      tracking_number: 'VET-7729104',
      notes: 'Contains Digital Air Pump + Handheld Car Vacuum Cleaner.',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];

  const ordStmt = db.prepare(`
    INSERT OR REPLACE INTO orders (
      id, order_number, customer_name, customer_email, customer_phone,
      shipping_address, city, country, shipping_method, shipping_cost,
      payment_method, payment_status, subtotal, discount_amount, coupon_code,
      tax_amount, total_amount, total_cost, gross_profit, status,
      tracking_carrier, tracking_number, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const o of sampleOrders) {
      ordStmt.run(
        o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
        o.shipping_address, o.city, o.country, o.shipping_method, o.shipping_cost,
        o.payment_method, o.payment_status, o.subtotal, o.discount_amount, o.coupon_code,
        o.tax_amount, o.total_amount, o.total_cost, o.gross_profit, o.status,
        o.tracking_carrier, o.tracking_number, o.notes, o.created_at
      );
    }
  })();

  // 7. Seed Staff & Team Members with Role-Based Permissions
  const sampleStaff = [
    {
      id: 'usr_admin',
      name: 'Siyean Long (Store Owner)',
      email: 'admin@srshop.store',
      phone: '098 33 47 55',
      password: 'admin',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_manager',
      name: 'Dara Rath (Store Manager)',
      email: 'manager@srshop.store',
      phone: '012 99 88 77',
      password: 'manager123',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_staff',
      name: 'Bopha Pich (Fulfillment Specialist)',
      email: 'staff@srshop.store',
      phone: '097 55 44 33',
      password: 'staff123',
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const userStmt = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, phone, password, role, avatar, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  db.transaction(() => {
    for (const u of sampleStaff) {
      userStmt.run(u.id, u.name, u.email, u.phone, u.password, u.role, u.avatar);
    }
  })();

  console.log('✅ SR SHOP database successfully re-seeded with official Facebook banner profile, real products & staff accounts!');
}

seedDatabase();
module.exports = seedDatabase;

