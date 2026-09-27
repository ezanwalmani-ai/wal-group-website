import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generatePortfolioAssets() {
  const targetDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. South DeKalb Towing & Transport SVG / WebP
  const southDekalbSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a0c" />
        <stop offset="50%" stop-color="#141419" />
        <stop offset="100%" stop-color="#050507" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff5500" stop-opacity="0.3" />
        <stop offset="50%" stop-color="#ff3300" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#ff5500" stop-opacity="0.1" />
      </linearGradient>
      <radialGradient id="headlight" cx="65%" cy="45%" r="40%">
        <stop offset="0%" stop-color="#4aa3ff" stop-opacity="0.35" />
        <stop offset="50%" stop-color="#0b1b36" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Background -->
    <rect width="1200" height="675" fill="url(#bg)" />
    <circle cx="850" cy="320" r="380" fill="url(#headlight)" />
    
    <!-- Stylized Luxury Car Silhouette -->
    <path d="M 620 420 C 650 360, 720 310, 850 290 C 980 270, 1100 320, 1180 390 L 1200 450 L 600 450 Z" fill="#181a20" opacity="0.6"/>
    <!-- Headlights glow -->
    <ellipse cx="820" cy="355" rx="55" ry="12" fill="#70b5ff" opacity="0.8" filter="blur(4px)"/>
    <ellipse cx="960" cy="360" rx="50" ry="10" fill="#70b5ff" opacity="0.8" filter="blur(4px)"/>

    <!-- Header bar -->
    <rect x="0" y="0" width="1200" height="70" fill="#0c0d11" fill-opacity="0.95" />
    <circle cx="55" cy="35" r="18" fill="#ff5500" />
    <text x="50" y="42" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">S</text>
    <text x="85" y="32" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#ffffff" letter-spacing="1">SOUTH DEKALB</text>
    <text x="85" y="48" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#9ca3af" letter-spacing="2">TOWING &amp; TRANSPORT</text>
    
    <!-- Nav links -->
    <text x="360" y="39" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffffff">Home</text>
    <text x="420" y="39" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#9ca3af">Services</text>
    <text x="490" y="39" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#9ca3af">Storage</text>
    <text x="560" y="39" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#9ca3af">About</text>
    <text x="620" y="39" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#9ca3af">Reviews</text>
    <text x="690" y="39" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#9ca3af">Service Area</text>
    <text x="790" y="39" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#9ca3af">Contact</text>

    <!-- Nav Button -->
    <rect x="940" y="16" width="200" height="38" rx="8" fill="#ff4d00" />
    <text x="1040" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">CALL NOW (404) 508-0246</text>

    <!-- Hero Content -->
    <!-- Badge -->
    <rect x="50" y="140" width="290" height="28" rx="14" fill="#ff4d00" fill-opacity="0.15" stroke="#ff4d00" stroke-opacity="0.4" />
    <circle cx="68" cy="154" r="4" fill="#ff4d00" />
    <text x="80" y="158" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#ff661a" letter-spacing="1">SOUTH DEKALB • LITHONIA, GEORGIA</text>

    <!-- Headline -->
    <text x="50" y="230" font-family="system-ui, sans-serif" font-weight="900" font-size="48" fill="#ffffff" letter-spacing="-1">Reliable Towing When</text>
    <text x="50" y="290" font-family="system-ui, sans-serif" font-weight="900" font-size="48" fill="#ffffff" letter-spacing="-1">You Need It Most.</text>

    <!-- Subhead -->
    <text x="50" y="340" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">Professional towing, vehicle transport and storage services in Lithonia</text>
    <text x="50" y="365" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">and the surrounding South DeKalb area.</text>

    <!-- CTA Buttons -->
    <rect x="50" y="410" width="180" height="52" rx="10" fill="#ff4d00" />
    <text x="140" y="442" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle">REQUEST A TOW →</text>

    <rect x="245" y="410" width="200" height="52" rx="10" fill="#1c1d22" stroke="#333742" stroke-width="1.5" />
    <text x="345" y="442" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle">CALL (404) 508-0246</text>

    <!-- Bottom info -->
    <text x="50" y="505" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#ff7733">GET DIRECTIONS: 7043 Rogers Lake Rd, Lithonia, GA 30058</text>
  </svg>`;

  // 2. Alpine Medical Services SVG
  const alpineMedicalSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgAlpine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#041b24" />
        <stop offset="60%" stop-color="#082b3a" />
        <stop offset="100%" stop-color="#031219" />
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bgAlpine)" />

    <!-- Top nav -->
    <rect x="0" y="0" width="1200" height="70" fill="#03151d" fill-opacity="0.9" />
    <circle cx="55" cy="35" r="18" fill="#d91e2b" />
    <path d="M 45 35 L 50 35 L 53 25 L 57 45 L 60 35 L 65 35" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    <text x="85" y="32" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#ffffff" letter-spacing="0.5">ALPINE MEDICAL SERVICES</text>
    <text x="85" y="47" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#f87171" letter-spacing="1">WASTE MANAGEMENT SERVICES</text>

    <text x="360" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#e2e8f0">Services</text>
    <text x="435" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">How It Works</text>
    <text x="535" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">Who We Serve</text>
    <text x="640" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">Compliance</text>
    <text x="735" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">Contact</text>
    <text x="840" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#38bdf8">928-792-9005</text>
    
    <rect x="970" y="16" width="180" height="38" rx="6" fill="#d91e2b" />
    <text x="1060" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">REQUEST SERVICE →</text>

    <!-- Badge -->
    <rect x="50" y="130" width="280" height="26" rx="13" fill="#0e384b" stroke="#38bdf8" stroke-opacity="0.4" />
    <circle cx="65" cy="143" r="4" fill="#38bdf8" />
    <text x="78" y="147" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#38bdf8" letter-spacing="1">ARIZONA STATEWIDE DISPATCH ACTIVE</text>

    <!-- Headline -->
    <text x="50" y="210" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-0.5">EVERY CONTAINER.</text>
    <text x="50" y="260" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-0.5">EVERY MANIFEST.</text>
    <text x="50" y="310" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#38bdf8" letter-spacing="-0.5">EVERY MILE.</text>

    <!-- Subhead -->
    <text x="50" y="360" font-family="system-ui, sans-serif" font-weight="400" font-size="15" fill="#94a3b8">Safe, reliable, and fully compliant medical waste management solutions</text>
    <text x="50" y="385" font-family="system-ui, sans-serif" font-weight="400" font-size="15" fill="#94a3b8">for healthcare facilities across Arizona. Regulated sharps, pharmaceuticals,</text>
    <text x="50" y="410" font-family="system-ui, sans-serif" font-weight="400" font-size="15" fill="#94a3b8">trace radioactive, and HIPAA destruction without the compliance guesswork.</text>

    <rect x="50" y="450" width="220" height="50" rx="8" fill="#d91e2b" />
    <text x="160" y="481" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">REQUEST A SERVICE PLAN →</text>

    <rect x="285" y="450" width="220" height="50" rx="8" fill="#082330" stroke="#1f4b61" stroke-width="1.5" />
    <text x="395" y="481" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#e2e8f0" text-anchor="middle">EXPLORE REGULATED STREAMS</text>

    <!-- Right Side Card -->
    <rect x="760" y="140" width="380" height="420" rx="14" fill="#061c26" stroke="#163e52" stroke-width="1.5" />
    <text x="800" y="185" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#ffffff">ALPINE MEDICAL SERVICES</text>
    <text x="800" y="205" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#38bdf8">VERIFIED STATEWIDE TRANSPORTER</text>

    <rect x="800" y="230" width="140" height="75" rx="8" fill="#0a2a38" />
    <text x="815" y="255" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#94a3b8">STATEWIDE FACILITIES</text>
    <text x="815" y="285" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#ffffff">40+<tspan font-size="12" fill="#64748b">/mo</tspan></text>

    <rect x="960" y="230" width="140" height="75" rx="8" fill="#0a2a38" />
    <text x="975" y="255" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#94a3b8">FIELD EXPERIENCE</text>
    <text x="975" y="285" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#ffffff">10+<tspan font-size="12" fill="#64748b">yrs</tspan></text>

    <text x="800" y="340" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">HQ Location: <tspan fill="#ffffff" font-weight="600">Show Low, AZ 85901</tspan></text>
    <text x="800" y="370" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">Route Coverage: <tspan fill="#38bdf8" font-weight="600">Arizona Statewide</tspan></text>
    <text x="800" y="400" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">Direct Dispatch: <tspan fill="#ffffff" font-weight="600">928-792-9005</tspan></text>

    <rect x="800" y="435" width="300" height="42" rx="6" fill="#0a3242" stroke="#38bdf8" stroke-opacity="0.4" />
    <text x="950" y="461" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#38bdf8" text-anchor="middle">REVIEW FULL COMPLIANCE DOSSIER</text>
  </svg>`;

  // 3. M&L Worldwide Logistics SVG
  const mlWorldwideSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgML" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#021526" />
        <stop offset="50%" stop-color="#052849" />
        <stop offset="100%" stop-color="#021324" />
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bgML)" />

    <!-- Top nav -->
    <rect x="0" y="0" width="1200" height="70" fill="#01101e" fill-opacity="0.95" />
    <!-- Diamond logo -->
    <rect x="45" y="20" width="30" height="30" rx="3" transform="rotate(45 60 35)" fill="#0055a5" stroke="#ffffff" stroke-width="1.5" />
    <text x="60" y="39" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">M&amp;L</text>
    <text x="95" y="33" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#ffffff" letter-spacing="1">WORLDWIDE</text>
    <text x="95" y="48" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#f59e0b" letter-spacing="2">LOGISTICS</text>

    <text x="360" y="40" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffffff">Domestic</text>
    <text x="440" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">Drive-Away</text>
    <text x="540" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">International</text>
    <text x="650" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">Company</text>
    <text x="740" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#94a3b8">Contact</text>
    <text x="850" y="40" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#f59e0b">(800) 756-1331</text>
    
    <rect x="980" y="16" width="170" height="38" rx="8" fill="#f59e0b" />
    <text x="1065" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#021526" text-anchor="middle">REQUEST QUOTE →</text>

    <!-- Eyebrow -->
    <text x="50" y="145" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#f59e0b" letter-spacing="1.5">● ESTABLISHED 1988 • ROME, NEW YORK</text>

    <!-- Headline -->
    <text x="50" y="215" font-family="system-ui, sans-serif" font-weight="900" font-size="46" fill="#ffffff" letter-spacing="-0.5">Transportation &amp; Logistics,</text>
    <text x="50" y="270" font-family="system-ui, sans-serif" font-weight="900" font-size="46" fill="#f59e0b" letter-spacing="-0.5">Built Around Your Supply Chain.</text>

    <!-- Subhead -->
    <text x="50" y="325" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">From domestic freight brokerage to single drive-away vehicle movements and international</text>
    <text x="50" y="350" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">forwarding, M&amp;L Worldwide Logistics provides dependable, integrated transportation solutions.</text>

    <!-- CTAs -->
    <rect x="50" y="390" width="180" height="48" rx="8" fill="#f59e0b" />
    <text x="140" y="420" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#021526" text-anchor="middle">REQUEST A QUOTE →</text>

    <rect x="245" y="390" width="160" height="48" rx="8" fill="#0b243b" stroke="#1d486e" stroke-width="1.5" />
    <text x="325" y="420" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#ffffff" text-anchor="middle">EXPLORE SERVICES</text>

    <!-- Tracking Input Bar -->
    <rect x="50" y="475" width="550" height="52" rx="10" fill="#051c33" stroke="#1d486e" stroke-width="1.5" />
    <text x="75" y="506" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Track PRO #, BOL, Container or VIN...</text>
    <rect x="490" y="482" width="100" height="38" rx="6" fill="#f59e0b" />
    <text x="540" y="506" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#021526" text-anchor="middle">TRACK</text>

    <text x="55" y="555" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Examples: <tspan fill="#94a3b8">ML-89214-DOM</tspan>  •  <tspan fill="#94a3b8">DA-2024-8841</tspan></text>
  </svg>`;

  // 4. Abhi Jobs SVG
  const abhiJobsSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgAbhi" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#071b2e" />
        <stop offset="50%" stop-color="#0a2a46" />
        <stop offset="100%" stop-color="#041220" />
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bgAbhi)" />

    <!-- Top nav -->
    <rect x="0" y="0" width="1200" height="70" fill="#ffffff" />
    <!-- Red people icon -->
    <circle cx="50" cy="28" r="8" fill="#e52323" />
    <circle cx="68" cy="30" r="6" fill="#e52323" />
    <path d="M 42 48 C 42 40, 58 40, 58 48 Z" fill="#e52323" />
    <path d="M 62 48 C 62 42, 74 42, 74 48 Z" fill="#e52323" />
    <text x="85" y="34" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#e52323" letter-spacing="1">ABHI JOBS</text>
    <text x="85" y="48" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#64748b">Discover. Apply. Grow.</text>

    <text x="420" y="41" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#e52323">Home</text>
    <text x="490" y="41" font-family="system-ui, sans-serif" font-weight="500" font-size="13" fill="#334155">About</text>
    <text x="560" y="41" font-family="system-ui, sans-serif" font-weight="500" font-size="13" fill="#334155">Find Jobs</text>
    <text x="650" y="41" font-family="system-ui, sans-serif" font-weight="500" font-size="13" fill="#334155">Hire Talent</text>

    <rect x="830" y="18" width="85" height="34" rx="8" fill="#ffffff" stroke="#cbd5e1" />
    <text x="872" y="40" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#1e293b" text-anchor="middle">Sign In</text>

    <rect x="930" y="18" width="115" height="34" rx="8" fill="#e52323" />
    <text x="987" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">Get Started</text>

    <!-- Eyebrow -->
    <rect x="420" y="140" width="280" height="28" rx="14" fill="#0f3454" stroke="#2563eb" stroke-opacity="0.4" />
    <circle cx="438" cy="154" r="4" fill="#e52323" />
    <text x="450" y="158" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#ffffff">ABHI JOBS | <tspan fill="#94a3b8" font-weight="500">Skills-First Career Platform</tspan></text>

    <!-- Headline -->
    <text x="600" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="-1">Discover. Apply. <tspan fill="#e52323">Grow.</tspan></text>

    <!-- Subhead -->
    <text x="600" y="295" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1" text-anchor="middle">ABHI JOBS connects skilled individuals with meaningful career opportunities</text>
    <text x="600" y="325" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1" text-anchor="middle">while helping people build relevant skills for the future of work.</text>

    <!-- CTAs -->
    <rect x="410" y="375" width="140" height="48" rx="10" fill="#e52323" />
    <text x="480" y="405" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">Find Jobs</text>

    <rect x="565" y="375" width="180" height="48" rx="10" fill="#0d2840" stroke="#1e4976" stroke-width="1.5" />
    <text x="655" y="405" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#ffffff" text-anchor="middle">Explore ABHI JOBS →</text>

    <!-- Search bar -->
    <rect x="250" y="465" width="700" height="60" rx="30" fill="#ffffff" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.4))" />
    <text x="290" y="501" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">Job title, skill, or department</text>
    <line x1="510" y1="480" x2="510" y2="510" stroke="#e2e8f0" stroke-width="1" />
    <text x="535" y="501" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">City or 'Remote'...</text>
    
    <rect x="790" y="475" width="150" height="40" rx="20" fill="#0f172a" />
    <text x="865" y="500" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">Search →</text>
  </svg>`;

  // 5. Wal Groups Platform SVG
  const walGroupsSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgWal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050404" />
        <stop offset="60%" stop-color="#140d08" />
        <stop offset="100%" stop-color="#080707" />
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bgWal)" />

    <!-- Top nav -->
    <rect x="0" y="0" width="1200" height="70" fill="#080808" fill-opacity="0.95" />
    <rect x="45" y="18" width="34" height="34" rx="8" fill="#ff6600" />
    <text x="62" y="41" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">W</text>
    <text x="90" y="34" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="1">WAL</text>
    <text x="90" y="48" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#ff6600" letter-spacing="2">GROUPS</text>

    <text x="240" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ff6600">Home</text>
    <text x="310" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#cbd5e1">About Us</text>
    <text x="390" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#cbd5e1">Services</text>
    <text x="470" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#cbd5e1">DSP Solutions</text>
    <text x="580" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#cbd5e1">AFP Solutions</text>
    <text x="690" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#cbd5e1">BPO Services</text>
    <text x="800" y="40" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#cbd5e1">Website Design</text>

    <rect x="990" y="16" width="160" height="38" rx="8" fill="#ff6600" />
    <text x="1070" y="40" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">Book a Demo</text>

    <!-- Eyebrow -->
    <rect x="50" y="140" width="310" height="28" rx="14" fill="#ff6600" fill-opacity="0.15" stroke="#ff6600" stroke-opacity="0.3" />
    <circle cx="68" cy="154" r="4" fill="#ff6600" />
    <text x="80" y="158" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#ff8533">24×7×365 BACKEND OPERATIONS &amp; OUTSOURCING</text>

    <!-- Headline -->
    <text x="50" y="225" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff">We Run the Backend <tspan fill="#ff8533" font-style="italic">So You</tspan></text>
    <text x="50" y="275" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ff6600"><tspan fill="#ff6600" font-style="italic">Can</tspan> <tspan fill="#ffffff">Run the Business.</tspan></text>

    <!-- Subhead -->
    <text x="50" y="330" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">Smart outsourcing, streamlined delivery services, and professional websites</text>
    <text x="50" y="355" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">— all in one place. Engineered for Amazon DSPs, Amazon Freight Partners,</text>
    <text x="50" y="380" font-family="system-ui, sans-serif" font-weight="400" font-size="16" fill="#cbd5e1">and growing logistics fleets.</text>

    <rect x="50" y="420" width="190" height="50" rx="10" fill="#ff6600" />
    <text x="145" y="451" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">Explore Our Solutions →</text>

    <rect x="255" y="420" width="160" height="50" rx="10" fill="#141414" stroke="#2e2e2e" stroke-width="1.5" />
    <text x="335" y="451" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#ffffff" text-anchor="middle">Book a Demo</text>

    <!-- Live Control Center Card -->
    <rect x="750" y="140" width="390" height="420" rx="14" fill="#0d1117" stroke="#21262d" stroke-width="1.5" />
    <circle cx="780" cy="180" r="5" fill="#10b981" />
    <text x="795" y="184" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#10b981" letter-spacing="1">LIVE CONTROL CENTER</text>
    <text x="1110" y="184" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#64748b" text-anchor="end">24/7 ACTIVE</text>

    <!-- Card 1 -->
    <rect x="775" y="215" width="340" height="70" rx="8" fill="#161b22" />
    <text x="795" y="240" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#8b949e">NETRADYNE SAFETY SCORE</text>
    <text x="795" y="268" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#ffffff">995 <tspan font-size="12" fill="#10b981" font-weight="700">(+18 pts)</tspan></text>

    <!-- Card 2 -->
    <rect x="775" y="295" width="340" height="70" rx="8" fill="#161b22" />
    <text x="795" y="320" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#8b949e">TIME CARD RECONCILIATION</text>
    <text x="795" y="348" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#ffffff">100% Verified</text>

    <!-- Card 3 -->
    <rect x="775" y="375" width="340" height="70" rx="8" fill="#161b22" />
    <text x="795" y="400" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#8b949e">COST PER HIRE REDUCTION</text>
    <text x="795" y="428" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#ff6600">38% Savings</text>

    <text x="945" y="485" font-family="system-ui, sans-serif" font-style="italic" font-size="11" fill="#64748b" text-anchor="middle">"Proactive shift management &amp; automated compliance."</text>
  </svg>`;

  const items = [
    { name: 'southdekalb', svg: southDekalbSvg },
    { name: 'alpine-medical', svg: alpineMedicalSvg },
    { name: 'ml-worldwide', svg: mlWorldwideSvg },
    { name: 'abhijobs', svg: abhiJobsSvg },
    { name: 'wal-groups', svg: walGroupsSvg }
  ];

  for (const item of items) {
    const svgBuffer = Buffer.from(item.svg);
    // Generate WebP
    await sharp(svgBuffer)
      .webp({ quality: 90 })
      .toFile(path.join(targetDir, `${item.name}.webp`));
    // Generate JPG
    await sharp(svgBuffer)
      .jpeg({ quality: 90 })
      .toFile(path.join(targetDir, `${item.name}.jpg`));
    console.log(`✓ Saved ${item.name}.webp and ${item.name}.jpg`);
  }
}

generatePortfolioAssets().catch(console.error);
