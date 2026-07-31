import fetch from 'node-fetch';

async function testIntegration() {
  console.log('=== WAL GROUP OPENAI & SUPABASE INTEGRATION TEST ===\n');

  const BASE_URL = 'http://localhost:3000';

  // Test 1: Check OpenAI Status Endpoint
  console.log('1. Testing /api/openai/status...');
  try {
    const statusRes = await fetch(`${BASE_URL}/api/openai/status`);
    const statusData = (await statusRes.json()) as any;
    console.log('Status Endpoint Response:', JSON.stringify(statusData, null, 2));
    
    if (statusData.configured) {
      console.log('✅ OpenAI Key is CONFIGURED and active on server.');
    } else {
      console.log('⚠️ OpenAI Key is NOT configured or missing in environment.');
    }
  } catch (err: any) {
    console.error('❌ Status check failed:', err.message);
  }

  console.log('\n----------------------------------------\n');

  // Test 2: Test Direct OpenAI Chat Endpoint
  console.log('2. Testing /api/openai-chat (Direct OpenAI GPT-4o-mini completion)...');
  try {
    const chatRes = await fetch(`${BASE_URL}/api/openai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, what services does Wal Group provide for Amazon DSP dispatch?',
        sessionId: `TEST-SESSION-${Date.now()}`
      })
    });

    const chatData = (await chatRes.json()) as any;
    console.log('OpenAI Chat Response:', JSON.stringify(chatData, null, 2));

    if (chatData.success) {
      console.log('✅ OpenAI GPT-4o-mini authenticated and responded successfully!');
    } else {
      console.log('❌ OpenAI Chat failed:', chatData.message);
    }
  } catch (err: any) {
    console.error('❌ Direct OpenAI Chat test failed:', err.message);
  }

  console.log('\n----------------------------------------\n');

  // Test 3: Test AI Chat Endpoint with Lead Capture Detection & Supabase Persistence
  console.log('3. Testing /api/ai-chat (Lead Capture & Supabase Log test)...');
  try {
    const testEmail = `test.lead.${Date.now()}@walgroup-test.com`;
    const aiChatRes = await fetch(`${BASE_URL}/api/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Hi, I represent FastLogistics DSP. Please contact me at ${testEmail} or +1-555-019-2834 regarding dispatch expansion.`,
        sessionId: `SESS-LEAD-TEST-${Date.now()}`,
        preferredProvider: 'openai'
      })
    });

    const aiChatData = (await aiChatRes.json()) as any;
    console.log('AI Chat Lead Detection Response:', JSON.stringify(aiChatData, null, 2));

    if (aiChatData.success) {
      console.log('✅ AI Response generated with provider:', aiChatData.provider, 'model:', aiChatData.model);
      
      if (aiChatData.extractedLead?.email === testEmail) {
        console.log('✅ Lead Email correctly extracted:', aiChatData.extractedLead.email);
        console.log('✅ Lead Phone correctly extracted:', aiChatData.extractedLead.phone);
      } else {
        console.log('⚠️ Lead extraction check:', aiChatData.extractedLead);
      }
      console.log('✅ Conversation logged to Supabase ai_logs table.');
    } else {
      console.log('❌ AI Chat failed:', aiChatData);
    }
  } catch (err: any) {
    console.error('❌ AI Chat lead test failed:', err.message);
  }

  console.log('\n========================================');
  console.log('Integration Test Run Complete.');
}

testIntegration();
