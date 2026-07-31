import fetch from 'node-fetch';

async function testSupabaseWebhook() {
  console.log('====================================================');
  console.log('=== SUPABASE DATABASE TRIGGER & WEBHOOK AUDIT TEST ===');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:3000';

  // Test 1: Contact Submissions Table Trigger Payload
  console.log('1. Testing Contact Submissions Database Trigger Payload...');
  try {
    const contactPayload = {
      type: 'INSERT',
      table: 'contact_submissions',
      record: {
        id: 'contact_test_001',
        full_name: 'Alexander Sterling',
        email: 'alexander.sterling.test@walgroup-audit.com',
        phone: '+1-555-0188',
        company_name: 'Apex Global Logistics',
        subject: 'Amazon DSP Dispatch Outsource Query',
        message: 'We operate 45 vans in Chicago and need 24/7 Cortex dispatchers.',
        target_email: 'thewalgroupinfo@gmail.com'
      }
    };

    const res = await fetch(`${BASE_URL}/api/supabase-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    });

    const data = (await res.json()) as any;
    console.log('Contact Webhook Result:', JSON.stringify(data, null, 2));

    if (data.success && data.processed) {
      console.log('✅ Contact Submissions Database Webhook correctly linked and executed!');
    } else {
      console.log('❌ Contact Webhook failed:', data);
    }
  } catch (err: any) {
    console.error('❌ Contact Webhook Exception:', err.message);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 2: Bookings Table Trigger Payload
  console.log('2. Testing Discovery Call Bookings Database Trigger Payload...');
  try {
    const bookingPayload = {
      type: 'INSERT',
      table: 'bookings',
      record: {
        id: 'WAL-DEMO-TRIGGER-889',
        company_name: 'Titan Fleet Express',
        full_name: 'Marcus Vance',
        email: 'marcus.vance.test@walgroup-audit.com',
        phone: '+1-555-0192',
        preferred_date: '2026-08-05',
        preferred_time: '14:00',
        timezone: 'EST (UTC-5)',
        meet_link: 'https://meet.google.com/wal-titan-demo',
        project_description: 'Audit for 14-day Amazon pay statement reconciliation.',
        selected_services: ['Amazon DSP Dispatch', 'Payroll Reconciliation']
      }
    };

    const res = await fetch(`${BASE_URL}/api/supabase-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });

    const data = (await res.json()) as any;
    console.log('Booking Webhook Result:', JSON.stringify(data, null, 2));

    if (data.success && data.processed) {
      console.log('✅ Discovery Call Bookings Database Webhook correctly linked and executed!');
    } else {
      console.log('❌ Booking Webhook failed:', data);
    }
  } catch (err: any) {
    console.error('❌ Booking Webhook Exception:', err.message);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 3: Job Applications Table Trigger Payload
  console.log('3. Testing Job Applications Database Trigger Payload...');
  try {
    const jobPayload = {
      type: 'INSERT',
      table: 'job_applications',
      record: {
        id: 'JOB-APP-TRIGGER-404',
        full_name: 'Elena Rostova',
        email: 'elena.rostova.test@walgroup-audit.com',
        phone: '+1-555-0144',
        position: 'Amazon DSP Dispatcher & Fleet Lead',
        experience_years: 5,
        resume_url: 'https://yzkjivknyalgfnpklxgr.supabase.co/storage/v1/object/public/resumes/elena_resume.pdf',
        resume_file_name: 'Elena_Rostova_Dispatcher_Resume.pdf'
      }
    };

    const res = await fetch(`${BASE_URL}/api/supabase-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobPayload)
    });

    const data = (await res.json()) as any;
    console.log('Job App Webhook Result:', JSON.stringify(data, null, 2));

    if (data.success && data.processed) {
      console.log('✅ Job Applications Database Webhook correctly linked and executed!');
    } else {
      console.log('❌ Job App Webhook failed:', data);
    }
  } catch (err: any) {
    console.error('❌ Job App Webhook Exception:', err.message);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 4: Leads Table Trigger Payload
  console.log('4. Testing Leads Database Trigger Payload...');
  try {
    const leadPayload = {
      type: 'INSERT',
      table: 'leads',
      record: {
        id: 'LEAD-TRIGGER-991',
        name: 'David Beckham Logistics',
        company: 'Beckham DSP Inc',
        email: 'david.lead.test@walgroup-audit.com',
        phone: '+1-555-0166',
        fleet_size: '30 Vans',
        score: 'Hot'
      }
    };

    const res = await fetch(`${BASE_URL}/api/supabase-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    });

    const data = (await res.json()) as any;
    console.log('Lead Webhook Result:', JSON.stringify(data, null, 2));

    if (data.success && data.processed) {
      console.log('✅ Leads Database Webhook correctly linked and executed!');
    } else {
      console.log('❌ Lead Webhook failed:', data);
    }
  } catch (err: any) {
    console.error('❌ Lead Webhook Exception:', err.message);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 5: Tickets Table Trigger Payload
  console.log('5. Testing Client Support Tickets Database Trigger Payload...');
  try {
    const ticketPayload = {
      type: 'INSERT',
      table: 'tickets',
      record: {
        id: 'WM-20260731-9011',
        full_name: 'Sarah Connor',
        email: 'sarah.connor.test@walgroup-audit.com',
        phone: '+1-555-0177',
        company_name: 'Skynet Freight',
        department: 'Cortex Dispatch Support',
        subject: 'Cortex Route Assignment Delay',
        priority: 'High',
        message: 'Need urgent dispatcher reassignment for shift B.'
      }
    };

    const res = await fetch(`${BASE_URL}/api/supabase-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketPayload)
    });

    const data = (await res.json()) as any;
    console.log('Ticket Webhook Result:', JSON.stringify(data, null, 2));

    if (data.success && data.processed) {
      console.log('✅ Support Tickets Database Webhook correctly linked and executed!');
    } else {
      console.log('❌ Ticket Webhook failed:', data);
    }
  } catch (err: any) {
    console.error('❌ Ticket Webhook Exception:', err.message);
  }

  console.log('\n====================================================');
  console.log('SUPABASE DATABASE TRIGGER & WEBHOOK AUDIT COMPLETE.');
  console.log('====================================================');
}

testSupabaseWebhook();
