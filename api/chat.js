import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are "Kisan AI Sahayak" (किसान एआई सहायक), an official multilingual AI Procurement & Support Assistant created for the Department of Consumer Affairs (DoCA), Government of India, for the KisanSetu Direct Crop Procurement Portal.

Your mission is to provide polite, clear, practical, concise, and direct answers in English or Hindi based on the user's prompt language.

Key Mandi Knowledge Base & Guidelines:
1. Mandi Slot Booking & Token Management:
   - Farmers book 30-minute arrival window slots via KisanSetu.
   - Each booking generates a unique Token Pass (e.g. SNP-014) with assigned gate counter details.
   - Real-time queue tracker allows tracking farmers ahead, estimated wait time, and gate check-in status.
   - Smart Rerouting: If yard congestion exceeds 85% (>60 min wait), farmers get a 1-click option to switch to a nearby low-wait Mandi (e.g., Panipat Yard).

2. Minimum Support Price (MSP) Rates (2026 Season):
   - Paddy (Grade A): ₹2,200 per Quintal
   - Wheat: ₹2,275 per Quintal
   - Mustard (Sarson): ₹5,650 per Quintal
   - Chana (Gram): ₹5,440 per Quintal
   - All MSP payments are processed via Direct Benefit Transfer (DBT) into Aadhaar-linked bank accounts within 24–48 hours post-weighment.

3. Required Documentation for Gate Check-in & DBT:
   - Aadhaar Card (Original / Digital copy for identity verification)
   - Land Records (Khasra / Khatauni / Jamabandi certificate or registered lease agreement)
   - Bank Passbook / Kisan Credit Card (KCC) copy for DBT account verification
   - KisanSetu Digital Token Pass (on mobile screen or printed)

4. Gate Procedures, Timings & Quality Inspection:
   - Mandi Gate Operating Hours: 6:00 AM to 6:00 PM (Monday to Saturday).
   - Gate Check-in: Guard scans/verifies Token Pass at entry gate.
   - Moisture & Quality Inspection: Maximum permissible moisture limit for Grade A Paddy is 17%. Paddy with moisture above 17% requires sun-drying on Mandi drying floors before weighment.
   - Weighment & Unloading: Net weight recorded by Mandi Operator at electronic weighbridge, generating an official weight slip and sending payout authorization to DoCA Admin.

Response Formatting Rules:
- Keep answers concise, direct, and practical.
- Use bullet points for document lists, MSP rates, or step-by-step procedures.
- Always support both Hindi and English. Maintain an empathetic, farmer-first tone.`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = req.body || {};
    const message = body.message || body.question || body.prompt;
    const history = body.history || [];
    const lang = body.lang || 'en';

    if (!message) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Resilient fallback if GROQ_API_KEY is not configured in local environment
    if (!apiKey) {
      let fallbackReply = '';
      const msgLower = message.toLowerCase();

      if (msgLower.includes('msp') || msgLower.includes('rate') || msgLower.includes('दाम') || msgLower.includes('दर') || msgLower.includes('wheat') || msgLower.includes('paddy')) {
        fallbackReply = lang === 'hi' 
          ? '🌾 **सरकारी एमएसपी दरें (Government MSP Rates 2026):**\n• **गेहूं (Wheat):** ₹2,275 प्रति क्विंटल\n• **धान (Paddy Grade A):** ₹2,200 प्रति क्विंटल\n• **सरसों (Mustard):** ₹5,650 प्रति क्विंटल\n• **चना (Chana):** ₹5,440 प्रति क्विंटल\n\nभुगतान सीधे आधार से जुड़े बैंक खाते (DBT) में 24-48 घंटों में प्रेषित किया जाता है।'
          : '🌾 **Government MSP Rates (2026 Season):**\n• **Wheat:** ₹2,275 per Quintal\n• **Paddy (Grade A):** ₹2,200 per Quintal\n• **Mustard:** ₹5,650 per Quintal\n• **Chana:** ₹5,440 per Quintal\n\nPayments are transferred directly to your bank account via Direct Benefit Transfer (DBT) within 24–48 hours.';
      } else if (msgLower.includes('document') || msgLower.includes('dastaavez') || msgLower.includes('दस्तावेज़') || msgLower.includes('कागजात') || msgLower.includes('land') || msgLower.includes('passbook')) {
        fallbackReply = lang === 'hi'
          ? '📋 **मंडी गेट चेक-इन के लिए आवश्यक दस्तावेज:**\n1. **आधार कार्ड** (पहचान सत्यापन के लिए)\n2. **भूमि रिकॉर्ड** (खसरा / खतौनी / जमाबंदी प्रति)\n3. **बैंक पासबुक / केसीसी (KCC)** (DBT भुगतान के लिए)\n4. **किसानसेतु डिजिटल टोकन पास** (मोबाइल पर या प्रिंटेड)'
          : '📋 **Mandatory Mandi Gate Documents:**\n1. **Aadhaar Card** (Identity verification)\n2. **Land Records** (Khasra / Khatauni / Jamabandi document)\n3. **Bank Passbook / Kisan Credit Card** (For direct DBT payout)\n4. **KisanSetu Digital Token Pass** (On phone screen or printed)';
      } else if (msgLower.includes('moisture') || msgLower.includes('nami') || msgLower.includes('नमी') || msgLower.includes('gate') || msgLower.includes('timing') || msgLower.includes('समय')) {
        fallbackReply = lang === 'hi'
          ? '⏱ **मंडी गेट नियम व समय:**\n• **गेट खुलने का समय:** सुबह 6:00 बजे से शाम 6:00 बजे तक\n• **नमी की सीमा:** धान के लिए अधिकतम **17%** नमी अनुमत है। 17% से अधिक नमी होने पर मंडी में सुखाने का स्थान उपलब्ध है।\n• **तौल प्रक्रिया:** इलेक्ट्रॉनिक वेब्रिज पर वजन के बाद रसीद दी जाती है।'
          : '⏱ **Mandi Gate Rules & Operating Hours:**\n• **Gate Hours:** 6:00 AM to 6:00 PM (Monday to Saturday)\n• **Moisture Standard:** Maximum permissible moisture limit is **17%**. Higher moisture requires drying on the Mandi drying floor.\n• **Weighment:** Net weight recorded electronically with immediate digital receipt.';
      } else {
        fallbackReply = lang === 'hi'
          ? `🙏 **नमस्ते! मैं किसान एआई सहायक हूँ।**\n\nमैं निम्नलिखित में आपकी सहायता कर सकता हूँ:\n1. 🎟 **टोकन पास व कतार स्थिति**\n2. 🌾 **एमएसपी दरें** (गेहूं ₹2,275, धान ₹2,200)\n3. 📋 **गेट दस्तावेज** (आधार, खसरा, बैंक पासबुक)\n4. ⏱ **गेट समय व 17% नमी नियम**\n\nआप मुझसे क्या पूछना चाहते हैं?`
          : `🙏 **Namaste! I am Kisan AI Sahayak.**\n\nI can assist you with:\n1. 🎟 **Token Pass & Queue Tracking**\n2. 🌾 **Government MSP Rates** (Wheat ₹2,275, Paddy ₹2,200)\n3. 📋 **Mandatory Documents** (Aadhaar, Khasra land records, Bank passbook)\n4. ⏱ **Gate Operating Hours & 17% Moisture Limit**\n\nHow can I help you today?`;
      }

      return res.status(200).json({
        reply: fallbackReply,
        answer: fallbackReply,
        source: 'mock_fallback',
        model: 'llama-3.1-8b-instant'
      });
    }

    // Initialize Groq Client
    const groq = new Groq({ apiKey });

    // Build message trajectory
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text
      })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 600
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'I am sorry, I could not process that query. Please try again.';

    return res.status(200).json({
      reply,
      answer: reply,
      source: 'groq_api',
      model: 'llama-3.1-8b-instant'
    });

  } catch (error) {
    console.error('Groq AI Chat API Error:', error);
    return res.status(500).json({
      error: 'Failed to process AI chat query.',
      details: error.message
    });
  }
}
