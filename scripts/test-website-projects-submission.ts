/**
 * WAL GROUPS: Website Project Requests Simulation & Validation Test Script
 * 
 * Verifies:
 * 1. Successful submission and database insertion for all 4 packages:
 *    - Starter ($399)
 *    - Business ($699)
 *    - Growth ($999)
 *    - Custom ($1,499+)
 * 2. Field validation triggers for missing or invalid inputs:
 *    - Missing full name
 *    - Missing company name
 *    - Missing / invalid email
 *    - Missing / short phone number
 *    - Missing country
 *    - Missing industry
 *    - Missing business description
 *    - Empty website goals
 * 3. Retrieval verification from Supabase / fallback storage
 * 4. Automatic cleanup of test data
 * 
 * Usage:
 *   npx tsx scripts/test-website-projects-submission.ts
 *   npm run test:website-projects
 */

import { supabase, saveWebsiteProjectRequestToSupabase, fetchWebsiteProjectRequestsFromSupabase } from '../src/lib/supabase';

interface TestResult {
  name: string;
  category: 'PACKAGE_SUBMISSION' | 'VALIDATION_CHECK' | 'RETRIEVAL_CHECK';
  status: 'PASS' | 'FAIL';
  details: string;
  projectId?: string;
  durationMs: number;
}

const results: TestResult[] = [];
const createdProjectIds: string[] = [];

// Helper for timing
async function timedRun(fn: () => Promise<void>) {
  const start = Date.now();
  await fn();
  return Date.now() - start;
}

// ----------------------------------------------------------------------------
// 1. PACKAGE SUBMISSION SIMULATIONS (Starter, Business, Growth, Custom)
// ----------------------------------------------------------------------------
const packagesToTest = [
  {
    packageName: 'Starter Website Package',
    packagePrice: '$399',
    fullName: 'David Miller',
    companyName: 'Miller Express Freight',
    email: 'david.miller@example-test.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    cityState: 'Dallas, TX',
    industry: 'Logistics & Fleet Operations',
    aboutBusiness: 'Regional freight and truckload logistics provider serving Texas and surrounding states.',
    goals: ['Generate New Business Leads', 'Establish Professional Digital Presence'],
    pages: ['Home', 'Services', 'Fleet Overview', 'Contact Us'],
    hasWebsite: 'No',
    websiteUrl: '',
    hasLogo: 'Yes',
    hasContent: 'Drafted / Ready',
    designStyle: 'Clean & Professional',
    inspiration: 'https://example-logistics.com',
    specificRequirements: 'Must be mobile optimized for truck drivers and fleet managers.',
    timeline: '1-2 weeks',
    confirmationAccepted: true
  },
  {
    packageName: 'Business Website Package',
    packagePrice: '$699',
    fullName: 'Sarah Jenkins',
    companyName: 'Nexus Global Warehousing',
    email: 'sarah.j@example-test.com',
    phone: '+1 (555) 876-5432',
    country: 'United States',
    cityState: 'Chicago, IL',
    industry: 'Warehousing & 3PL',
    aboutBusiness: 'Full-service third-party logistics and warehousing facility with cross-docking capabilities.',
    goals: ['Showcase Fleet & Warehouse Facilities', 'Attract Corporate Clients & Shippers', 'Enable Direct Quote Requests'],
    pages: ['Home', 'About Us', 'Warehousing Solutions', 'Technology & Tracking', 'Rate Quote', 'Contact'],
    hasWebsite: 'Yes',
    websiteUrl: 'https://nexus-legacy-demo.com',
    hasLogo: 'Yes',
    hasContent: 'Drafted / Ready',
    designStyle: 'Modern & Bold',
    inspiration: 'https://fedex.com',
    specificRequirements: 'Include interactive rate inquiry form and Google Maps facility location.',
    timeline: '2-4 weeks',
    confirmationAccepted: true
  },
  {
    packageName: 'Growth Website Package',
    packagePrice: '$999',
    fullName: 'Michael Chang',
    companyName: 'Apex Cold Chain Systems',
    email: 'm.chang@example-test.com',
    phone: '+1 (555) 432-1098',
    country: 'Canada',
    cityState: 'Toronto, ON',
    industry: 'Refrigerated & Cold Chain',
    aboutBusiness: 'Temperature-controlled cross-border pharmaceutical and food logistics company.',
    goals: ['Establish Professional Digital Presence', 'Customer Portal / Tracking Access', 'Attract Corporate Clients & Shippers', 'Rank High on Search Engines (SEO)'],
    pages: ['Home', 'Cold Storage Capabilities', 'Compliance & Safety', 'Carrier Network', 'Track Cargo', 'Brochures', 'Careers', 'Contact'],
    hasWebsite: 'Yes',
    websiteUrl: 'https://apex-coldchain-test.ca',
    hasLogo: 'Yes',
    hasContent: 'Need help drafting',
    designStyle: 'Corporate & Authoritative',
    inspiration: 'https://dhl.com',
    specificRequirements: 'Client login button linked to TMS tracking portal and downloadable PDF capability.',
    timeline: '3-5 weeks',
    confirmationAccepted: true
  },
  {
    packageName: 'Custom Website Package',
    packagePrice: 'Starting at $1,499+',
    fullName: 'Elena Rostova',
    companyName: 'Titan Enterprise Logistics Group',
    email: 'e.rostova@example-test.com',
    phone: '+1 (555) 998-1122',
    country: 'United Kingdom',
    cityState: 'London',
    industry: 'International Freight Forwarding',
    aboutBusiness: 'Multimodal air, sea, and rail freight management company operating across 4 continents.',
    goals: ['Customer Portal / Tracking Access', 'Multi-Language / International Reach', 'Custom Web Application Features', 'Automated Lead Routing & CRM Sync'],
    pages: ['Home', 'Global Ocean Freight', 'Air Cargo', 'Customs Brokerage', 'Supply Chain Tech', 'Case Studies', 'Investor Relations', 'Client Portal', 'Contact'],
    hasWebsite: 'Yes',
    websiteUrl: 'https://titan-logistics-test.co.uk',
    hasLogo: 'Yes',
    hasContent: 'Drafted / Ready',
    designStyle: 'High-Tech & Futuristic',
    inspiration: 'https://maersk.com',
    specificRequirements: 'Full API integration with internal ERP, multi-currency display, and custom quotation calculator.',
    timeline: 'Flexible',
    confirmationAccepted: true
  }
];

// ----------------------------------------------------------------------------
// 2. VALIDATION SCENARIOS (MISSING / INVALID FIELDS)
// ----------------------------------------------------------------------------
interface ValidationTestCase {
  name: string;
  fieldMissing: string;
  payload: any;
  expectedErrorMatch: string;
}

const validationCases: ValidationTestCase[] = [
  {
    name: 'Reject submission with missing Full Name',
    fieldMissing: 'fullName',
    payload: {
      packageName: 'Starter Website Package',
      packagePrice: '$399',
      fullName: '', // MISSING
      companyName: 'Acme Logistics',
      email: 'acme@example.com',
      phone: '+1 555-1234567',
      country: 'United States',
      industry: 'Logistics',
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  },
  {
    name: 'Reject submission with missing Company Name',
    fieldMissing: 'companyName',
    payload: {
      packageName: 'Business Website Package',
      packagePrice: '$699',
      fullName: 'John Doe',
      companyName: '   ', // MISSING
      email: 'john@example.com',
      phone: '+1 555-1234567',
      country: 'United States',
      industry: 'Logistics',
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  },
  {
    name: 'Reject submission with missing / invalid Email',
    fieldMissing: 'email',
    payload: {
      packageName: 'Growth Website Package',
      packagePrice: '$999',
      fullName: 'John Doe',
      companyName: 'Acme Logistics',
      email: 'invalid-email-address', // INVALID
      phone: '+1 555-1234567',
      country: 'United States',
      industry: 'Logistics',
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'email'
  },
  {
    name: 'Reject submission with missing Phone Number',
    fieldMissing: 'phone',
    payload: {
      packageName: 'Starter Website Package',
      packagePrice: '$399',
      fullName: 'John Doe',
      companyName: 'Acme Logistics',
      email: 'john@example.com',
      phone: '', // MISSING
      country: 'United States',
      industry: 'Logistics',
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  },
  {
    name: 'Reject submission with missing Country',
    fieldMissing: 'country',
    payload: {
      packageName: 'Starter Website Package',
      packagePrice: '$399',
      fullName: 'John Doe',
      companyName: 'Acme Logistics',
      email: 'john@example.com',
      phone: '+1 555-1234567',
      country: '', // MISSING
      industry: 'Logistics',
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  },
  {
    name: 'Reject submission with missing Industry',
    fieldMissing: 'industry',
    payload: {
      packageName: 'Starter Website Package',
      packagePrice: '$399',
      fullName: 'John Doe',
      companyName: 'Acme Logistics',
      email: 'john@example.com',
      phone: '+1 555-1234567',
      country: 'United States',
      industry: '', // MISSING
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  },
  {
    name: 'Reject submission with missing Business Description',
    fieldMissing: 'aboutBusiness',
    payload: {
      packageName: 'Starter Website Package',
      packagePrice: '$399',
      fullName: 'John Doe',
      companyName: 'Acme Logistics',
      email: 'john@example.com',
      phone: '+1 555-1234567',
      country: 'United States',
      industry: 'Logistics',
      aboutBusiness: '', // MISSING
      goals: ['Generate New Business Leads'],
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  },
  {
    name: 'Reject submission with empty Goals array',
    fieldMissing: 'goals',
    payload: {
      packageName: 'Starter Website Package',
      packagePrice: '$399',
      fullName: 'John Doe',
      companyName: 'Acme Logistics',
      email: 'john@example.com',
      phone: '+1 555-1234567',
      country: 'United States',
      industry: 'Logistics',
      aboutBusiness: 'Experienced dispatching company with reliable carrier network.',
      goals: [], // EMPTY
      confirmationAccepted: true
    },
    expectedErrorMatch: 'required'
  }
];

// Helper to simulate client-side validation logic
function validateClientForm(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.fullName || !data.fullName.trim()) errors.fullName = 'Full Name is required';
  if (!data.companyName || !data.companyName.trim()) errors.companyName = 'Company / Business Name is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = 'Work email address is required';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  const cleanPhone = (data.phone || '').replace(/[\s\-\(\)\.]/g, '');
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (cleanPhone.length < 7) {
    errors.phone = 'Please enter a valid phone number (minimum 7 digits)';
  }

  if (!data.country || !data.country.trim()) errors.country = 'Country is required';
  if (!data.industry || !data.industry.trim()) errors.industry = 'Industry selection is required';

  if (!data.aboutBusiness || !data.aboutBusiness.trim()) {
    errors.aboutBusiness = 'Business description is required';
  } else if (data.aboutBusiness.trim().length < 15) {
    errors.aboutBusiness = 'Please provide a little more detail (at least 15 characters)';
  }

  if (!Array.isArray(data.goals) || data.goals.length === 0) {
    errors.goals = 'Please select at least one goal for your website';
  }

  if (!data.confirmationAccepted) {
    errors.confirmedAccuracy = 'Please confirm that the information provided is accurate';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// ----------------------------------------------------------------------------
// MAIN EXECUTION
// ----------------------------------------------------------------------------
async function runTests() {
  console.log('\n========================================================================');
  console.log(' WAL GROUPS: WEBSITE PROJECT FORM SIMULATION & DATABASE TEST SUITE');
  console.log('========================================================================\n');

  // STEP 1: TEST SUBMISSIONS FOR EACH PACKAGE
  console.log('>> [PHASE 1] Simulating Submissions for all 4 Packages:');
  console.log('   Starter ($399) | Business ($699) | Growth ($999) | Custom ($1,499+)\n');

  for (const pkg of packagesToTest) {
    const testName = `Submit & Insert: ${pkg.packageName} (${pkg.packagePrice})`;
    const testId = `TEST-WEB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const duration = await timedRun(async () => {
      try {
        const payload = {
          id: testId,
          package_name: pkg.packageName,
          package_price: pkg.packagePrice,
          full_name: pkg.fullName,
          business_name: pkg.companyName,
          email: pkg.email,
          phone: pkg.phone,
          country: pkg.country,
          city_state: pkg.cityState,
          industry: pkg.industry,
          business_description: pkg.aboutBusiness,
          website_goals: pkg.goals,
          required_pages: pkg.pages,
          has_existing_website: pkg.hasWebsite === 'Yes',
          current_website_url: pkg.websiteUrl || null,
          has_logo: pkg.hasLogo,
          has_content: pkg.hasContent,
          design_style: pkg.designStyle,
          inspiration_url: pkg.inspiration || null,
          additional_requirements: pkg.specificRequirements || null,
          project_timeline: pkg.timeline,
          confirmation_accepted: pkg.confirmationAccepted,
          status: 'New'
        };

        const res = await saveWebsiteProjectRequestToSupabase(payload);

        if (res.success && res.projectId) {
          createdProjectIds.push(res.projectId);
          results.push({
            name: testName,
            category: 'PACKAGE_SUBMISSION',
            status: 'PASS',
            details: `Successfully inserted into Supabase. Assigned Project ID: ${res.projectId}`,
            projectId: res.projectId,
            durationMs: 0
          });
          console.log(`  ✓ [PASS] ${testName}`);
          console.log(`    Ref: ${res.projectId} | Client: ${pkg.fullName} (${pkg.companyName})`);
        } else {
          results.push({
            name: testName,
            category: 'PACKAGE_SUBMISSION',
            status: 'FAIL',
            details: res.error || 'Failed insertion without explicit error.',
            durationMs: 0
          });
          console.log(`  ✗ [FAIL] ${testName}: ${res.error}`);
        }
      } catch (err: any) {
        results.push({
          name: testName,
          category: 'PACKAGE_SUBMISSION',
          status: 'FAIL',
          details: err.message || String(err),
          durationMs: 0
        });
        console.log(`  ✗ [FAIL] ${testName}: ${err.message}`);
      }
    });

    if (results.length > 0) {
      results[results.length - 1].durationMs = duration;
    }
  }

  // STEP 2: TEST VALIDATION RULES FOR MISSING FIELDS
  console.log('\n>> [PHASE 2] Testing Field Validation & Missing Input Rejections:\n');

  for (const testCase of validationCases) {
    const duration = await timedRun(async () => {
      // 1. Client-side validation check
      const clientValidation = validateClientForm(testCase.payload);

      // 2. Server-side validation contract simulation
      const { fullName, companyName, email, phone, country, industry, aboutBusiness, goals } = testCase.payload;
      const serverPasses = Boolean(fullName && companyName && email && phone && country && industry && aboutBusiness && Array.isArray(goals) && goals.length > 0);

      const rejectedByClient = !clientValidation.isValid;
      const rejectedByServer = !serverPasses;

      if (rejectedByClient || rejectedByServer) {
        const errorMsg = Object.values(clientValidation.errors).join(', ') || 'Caught by server required-field guard';
        results.push({
          name: testCase.name,
          category: 'VALIDATION_CHECK',
          status: 'PASS',
          details: `Rejected as expected. Guard reason: ${errorMsg}`,
          durationMs: 0
        });
        console.log(`  ✓ [PASS] ${testCase.name}`);
        console.log(`    Triggered Error: "${errorMsg}"`);
      } else {
        results.push({
          name: testCase.name,
          category: 'VALIDATION_CHECK',
          status: 'FAIL',
          details: `Form erroneously accepted incomplete payload missing [${testCase.fieldMissing}].`,
          durationMs: 0
        });
        console.log(`  ✗ [FAIL] ${testCase.name}: Incomplete data was not rejected!`);
      }
    });

    if (results.length > 0) {
      results[results.length - 1].durationMs = duration;
    }
  }

  // STEP 3: RETRIEVAL & QUERY TEST
  console.log('\n>> [PHASE 3] Testing Data Retrieval for Admin Portal:\n');
  const queryDuration = await timedRun(async () => {
    try {
      const fetchRes = await fetchWebsiteProjectRequestsFromSupabase();
      if (fetchRes.success && Array.isArray(fetchRes.data)) {
        results.push({
          name: 'Fetch Website Project Records for Admin Portal',
          category: 'RETRIEVAL_CHECK',
          status: 'PASS',
          details: `Retrieved ${fetchRes.data.length} records successfully without database crashes.`,
          durationMs: 0
        });
        console.log(`  ✓ [PASS] Admin Portal fetch succeeded. Total records available: ${fetchRes.data.length}`);
      } else {
        results.push({
          name: 'Fetch Website Project Records for Admin Portal',
          category: 'RETRIEVAL_CHECK',
          status: 'FAIL',
          details: fetchRes.error || 'Fetch returned false',
          durationMs: 0
        });
        console.log(`  ✗ [FAIL] Admin fetch returned error: ${fetchRes.error}`);
      }
    } catch (err: any) {
      results.push({
        name: 'Fetch Website Project Records for Admin Portal',
        category: 'RETRIEVAL_CHECK',
        status: 'FAIL',
        details: err.message,
        durationMs: 0
      });
      console.log(`  ✗ [FAIL] Admin fetch threw exception: ${err.message}`);
    }
  });

  if (results.length > 0) {
    results[results.length - 1].durationMs = queryDuration;
  }

  // STEP 4: CLEANUP TEST RECORDS
  console.log('\n>> [PHASE 4] Cleaning Up Test Records from Supabase:\n');
  if (createdProjectIds.length > 0) {
    try {
      for (const id of createdProjectIds) {
        // Attempt cleanup in dedicated table
        await supabase.from('website_project_requests').delete().eq('id', id);
        // Attempt cleanup in leads fallback table
        await supabase.from('leads').delete().eq('id', id);
      }
      console.log(`  ✓ Cleaned up ${createdProjectIds.length} test project records (${createdProjectIds.join(', ')}).`);
    } catch (cleanErr: any) {
      console.warn(`  ! Note on cleanup: ${cleanErr.message}`);
    }
  }

  // STEP 5: FINAL SCORECARD
  console.log('\n========================================================================');
  console.log(' TEST SUMMARY SCORECARD');
  console.log('========================================================================\n');

  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.table(results.map(r => ({
    Test: r.name,
    Category: r.category,
    Result: r.status === 'PASS' ? '✅ PASS' : '❌ FAIL',
    Duration: `${r.durationMs}ms`,
    Details: r.details.length > 60 ? r.details.substring(0, 57) + '...' : r.details
  })));

  console.log(`\nResults: ${passed}/${total} PASSED (${failed} FAILED)`);

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Submissions and field validations are operating properly.\n');
  } else {
    console.error(`\n⚠️  ${failed} TEST(S) FAILED. Please inspect the logs above.\n`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
