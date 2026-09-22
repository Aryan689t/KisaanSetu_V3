//improvements


**1. IoT Digital Weighbridge Simulation (Operator Desk)**
- Replace any manual `<input type="number">` fields for Weight and Moisture with read-only display fields.
- Add a prominent button: `[ 📡 Fetch from Digital Weighbridge ]`.
- When clicked, simulate a 2-second loading state (spinner/skeleton), then auto-populate dummy data (e.g., Weight: 45.20 Qtl, Moisture: 14.5%).

**2. The "Holding Yard" Moisture Failure Flow (Operator & Farmer)**
- In the Operator UI, if the fetched Moisture exceeds 17% (e.g., hardcode a scenario that returns 19%), trigger a red UI warning.
- Disable the `[ Approve Procurement ]` button.
- Reveal a new button: `[ ☀️ Send to Drying Yard ]`.
- If clicked, update the Farmer's live tracker status to `Suspended - Drying Required` and pause their wait-time counter.

**3. "Green Channel" VIP Pass (Farmer & Operator)**
- On the Farmer Dashboard, style the advance-booking token as an "Express Pass (Green Channel)". Use a premium-looking green gradient card with a QR code placeholder.
- On the Operator's Live Yard Queue Table, add a "Channel" column. Color-code the rows: Green badge for `Advance Booking` and Yellow badge for `Walk-in`.

**4. Fuel vs. Time Smart Reroute Card (Farmer/Congestion Simulator)**
- Upgrade the current congestion reroute modal. Instead of a simple text alert, design a comparative cost-benefit card:
  - Current Mandi: e.g., "Sonipat - 67 min wait" (Red)
  - Alternate Mandi: e.g., "Panipat (12km) - 14 min wait" (Green)
  - Est. Extra Diesel: "₹180"
  - Govt. Freight Subsidy: "+₹200 (Added to DBT)"
  - Net Benefit: "Save 53 mins & earn ₹20 extra"
- Add a large `[ Accept Reroute & Claim Subsidy ]` button that updates the user's booked mandi state.

**5. Offline Mode PWA Simulation (SubtleDemoBar & Navbar)**
- Add a Network Status indicator to the top navigation bar (defaulting to Green/Online).
- Add a toggle button in the `SubtleDemoBar` called `[ Toggle Wi-Fi Drop ]`.
- When toggled, change the nav indicator to a red `🔴 Offline: Saving data locally` badge. 

Please review the codebase now and provide the necessary code changes file by file.