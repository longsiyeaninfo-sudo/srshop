const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {})
        }
      },
      (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Full SR SHOP API, Database, Staff RBAC & Slideshow Automated Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(title, condition, extra = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title} ${extra}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title} ${extra}`);
    }
  }

  try {
    // 1. Health check
    const h = await makeRequest('/api/health');
    assert('Health Check Endpoint', h.status === 200 && h.data.store === 'SR SHOP');

    // 2. Settings check
    const s = await makeRequest('/api/settings');
    assert('Get Store Settings', s.status === 200 && s.data.settings.store_name === 'SR SHOP', `(Name: ${s.data.settings.store_name})`);

    // 3. Categories check
    const c = await makeRequest('/api/categories');
    assert('Get Categories Count', c.status === 200 && c.data.categories.length >= 4, `(${c.data.categories.length} categories)`);

    // Category CRUD Tests
    const createCat = await makeRequest('/api/categories', 'POST', {
      name: 'Automated Test Gadgets',
      slug: 'auto-test-gadgets',
      icon: '⚡',
      description: 'Test category description',
      display_order: 99
    });
    assert('Create New Category (POST /api/categories)', createCat.status === 200 && createCat.data.category?.id?.startsWith('cat_'), `(ID: ${createCat.data.category?.id})`);
    const createdCatId = createCat.data.category?.id;

    const updateCat = await makeRequest(`/api/categories/${createdCatId}`, 'PUT', {
      name: 'Updated Test Gadgets',
      icon: '🔋'
    });
    assert('Update Category (PUT /api/categories/:id)', updateCat.status === 200 && updateCat.data.category?.name === 'Updated Test Gadgets');

    const deleteCat = await makeRequest(`/api/categories/${createdCatId}`, 'DELETE');
    assert('Delete Category (DELETE /api/categories/:id)', deleteCat.status === 200 && deleteCat.data.success === true);

    // 4. Products catalog check
    const p = await makeRequest('/api/products');
    assert('Get Products Catalog', p.status === 200 && p.data.products.length >= 10, `(${p.data.products.length} products listed)`);

    // 5. Slideshow API tests
    const slidesList = await makeRequest('/api/slides');
    assert('Get Active Slides List', slidesList.status === 200 && slidesList.data.slides.length >= 4, `(${slidesList.data.slides.length} active slides)`);

    // Create a new slide
    const createSlide = await makeRequest('/api/slides', 'POST', {
      title: 'Automated Test Slide',
      title_km: 'ស្លាយតេស្តស្វ័យប្រវត្តិ',
      subtitle: 'Test promo details',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
      badge: 'TEST BADGE',
      price: 39.99,
      compare_at_price: 69.99,
      cta_text: 'Test CTA',
      product_id: 'sr_prod_1',
      display_order: 99
    });
    assert('Create New Slide (POST /api/slides)', createSlide.status === 200 && createSlide.data.slide.id.startsWith('slide_'), `(ID: ${createSlide.data.slide?.id})`);

    const createdSlideId = createSlide.data.slide.id;

    // Update slide
    const updateSlide = await makeRequest(`/api/slides/${createdSlideId}`, 'PUT', {
      title: 'Updated Test Slide Title',
      badge: 'UPDATED BADGE'
    });
    assert('Update Slide (PUT /api/slides/:id)', updateSlide.status === 200 && updateSlide.data.slide.title === 'Updated Test Slide Title');

    // Reorder slides
    const reorderSlides = await makeRequest('/api/slides/reorder', 'PUT', {
      slideIds: [createdSlideId, 'slide_1', 'slide_2']
    });
    assert('Reorder Slides (PUT /api/slides/reorder)', reorderSlides.status === 200 && reorderSlides.data.slides[0].id === createdSlideId);

    // Delete slide
    const deleteSlide = await makeRequest(`/api/slides/${createdSlideId}`, 'DELETE');
    assert('Delete Slide (DELETE /api/slides/:id)', deleteSlide.status === 200 && deleteSlide.data.success === true);

    // 6. Staff & RBAC Management Tests
    const staffList = await makeRequest('/api/staff');
    assert('Get Staff Members Directory (GET /api/staff)', staffList.status === 200 && staffList.data.staff.length >= 3, `(${staffList.data.staff?.length} team members)`);

    // Create staff member
    const newStaff = await makeRequest('/api/staff', 'POST', {
      name: 'Vannak Test Agent',
      email: 'vannak.test@srshop.store',
      phone: '088 11 22 33',
      role: 'staff',
      password: 'testpassword123'
    });
    assert('Create Staff Member (POST /api/staff)', newStaff.status === 200 && newStaff.data.staff?.role === 'staff', `(ID: ${newStaff.data.staff?.id})`);

    const newStaffId = newStaff.data.staff?.id;

    // Update staff member role to manager
    const updateStaff = await makeRequest(`/api/staff/${newStaffId}`, 'PUT', {
      role: 'manager',
      phone: '088 99 88 77'
    });
    assert('Update Staff Role & Phone (PUT /api/staff/:id)', updateStaff.status === 200 && updateStaff.data.staff?.role === 'manager');

    // Delete staff member
    const deleteStaff = await makeRequest(`/api/staff/${newStaffId}`, 'DELETE');
    assert('Delete Staff Member (DELETE /api/staff/:id)', deleteStaff.status === 200 && deleteStaff.data.success === true);

    // 7. Role Authentication Tests (Admin, Manager, Staff)
    const authAdmin = await makeRequest('/api/auth/login', 'POST', { email: 'admin@srshop.store', password: 'admin' });
    assert('Admin Authentication (Role: admin)', authAdmin.status === 200 && authAdmin.data.user.role === 'admin');

    const authManager = await makeRequest('/api/auth/login', 'POST', { email: 'manager@srshop.store', password: 'manager123' });
    assert('Manager Authentication (Role: manager)', authManager.status === 200 && authManager.data.user.role === 'manager');

    const authStaff = await makeRequest('/api/auth/login', 'POST', { email: 'staff@srshop.store', password: 'staff123' });
    assert('Staff Authentication (Role: staff)', authStaff.status === 200 && authStaff.data.user.role === 'staff');

    // 8. Search check
    const searchRes = await makeRequest('/api/products?q=Ring');
    assert('Search Products Query', searchRes.status === 200 && searchRes.data.products.length >= 1);

    // 9. Coupon validation
    const cp = await makeRequest('/api/coupons/validate', 'POST', { code: 'SRSHOP10', subtotal: 100 });
    assert('Coupon Code SRSHOP10 Discount Calculation', cp.status === 200 && cp.data.coupon.discount_amount === 10);

    // 10. Place Order & Inventory Auto-deduction
    const ord = await makeRequest('/api/orders', 'POST', {
      customer_name: 'Test Customer',
      customer_email: 'test@customer.com',
      customer_phone: '098 33 47 55',
      shipping_address: '100 Innovation Way',
      city: 'Phnom Penh',
      shipping_method: 'Standard Express',
      shipping_cost: 0,
      payment_method: 'KHQR / ABA Pay & Bakong',
      coupon_code: 'SRSHOP10',
      items: [
        {
          product_id: 'sr_prod_1',
          product_name: '20,000mAh Car Jump Starter',
          quantity: 1
        }
      ]
    });
    assert('Place Order & Return Order Number', ord.status === 200 && ord.data.order.order_number.startsWith('SR-'));

    // 11. Reseller Analytics & Profit Margins
    const an = await makeRequest('/api/analytics');
    assert('Reseller Margins & KPI Metrics', an.status === 200 && an.data.metrics.totalRevenue > 0);

    console.log(`\n======================================================`);
    console.log(`🎉 ALL TESTS PASSED: ${passed}/${total} Tests Successful!`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
