| # | Test | Result | Notes |
|---|------|--------|-------|
| 01 | BC consultant role, 3 candidates, 1 excluded | PASS | Aisha 99/risk none, Rahul 1/skills-gap, Sara excluded; market level 2/52d; jev-1.13.0, 336ms |
| 02 | Sales role, 3 candidates mixed eligibility | PASS | HTTP 200, 624ms, model jev-1.13.0, 1607 tok |
| 03 | Niche executive role - expect tight market | PASS | HTTP 200, 310ms, model jev-1.13.0, 1059 tok |
| 04 | Broad junior role - expect quick fill | PASS | HTTP 200, 554ms, model jev-1.13.0, 1556 tok |
| 05 | Single strong candidate | PASS | HTTP 200, 296ms, model jev-1.13.0, 1039 tok |
| 06 | Single weak candidate | PASS | HTTP 200, 312ms, model jev-1.13.0, 958 tok |
| 07 | Eight candidates (max allowed) | PASS | HTTP 200, 366ms, model jev-1.13.0, 3656 tok |
| 08 | Nine candidates - must 400 | PASS | HTTP 400, 218ms |
| 09 | Missing role title - must 400 | PASS | HTTP 400, 190ms |
| 10 | Missing requirements - must 400 | PASS | HTTP 400, 98ms |
| 11 | Empty candidates - must 400 | PASS | HTTP 400, 128ms |
| 12 | All candidates not open to work - 200, none scored | PASS | HTTP 200, 101ms, model undefined, undefined tok |
| 13 | Arabic/Unicode role and profile | PASS | HTTP 200, 346ms, model jev-1.13.0, 1192 tok |
| 14 | HTML/script injection strings - reflected escaped | PASS | HTTP 200, 318ms, model jev-1.13.0, 978 tok |
| 15 | Very long profile (5000+ chars) | PASS | HTTP 200, 317ms, model jev-1.13.0, 7232 tok |
| 16 | Job hopper - expect stability signal | PASS | HTTP 200, 443ms, model jev-1.13.0, 1023 tok |
| 17 | Overqualified - expect seniority-gap concern | PASS | HTTP 200, 368ms, model jev-1.13.0, 991 tok |
| 18 | Thin profile - expect evidence-thin | PASS | HTTP 200, 287ms, model jev-1.13.0, 852 tok |
| 19 | Duplicate candidate names | PASS | HTTP 200, 269ms, model jev-1.13.0, 1376 tok |
| 20 | No hiring context field | PASS | HTTP 200, 299ms, model jev-1.13.0, 947 tok |
| 21 | GET request - must 405 | PASS | HTTP 405, 126ms |
| 22 | Healthcare role with certifications | PASS | HTTP 200, 316ms, model jev-1.13.0, 1585 tok |
| 23 | Emojis and special characters | PASS | HTTP 200, 349ms, model jev-1.13.0, 981 tok |
| U1 | Page loads at 390px, no horizontal overflow | PASS | overflow 0px |
| U2 | Role title/context/requirements accept input | PASS | values set |
| U3 | Add candidate button adds cards | PASS | 1 -> 3 |
| U4 | Remove candidate works | PASS | 3 -> 2 |
| U6 | Run produces live results | PASS | results section visible |
| U7 | Rendered results free of undefined/NaN | PASS | clean |
| U8 | Excluded-by-policy block renders for unchecked candidate | PASS | Vikram excluded block present |
| U9 | Market forecast renders | PASS | 52 days |
| U10 | Ranked card with numeric score | PASS | score 82 |
| U11 | No horizontal overflow after results render | PASS | overflow 0px |
| U12 | Empty submit shows inline error | PASS | Add a role, requirements, and at least one candidate. |
| U13 | 8-candidate run at phone size | PASS | 4 scored (4 eligible of 8), 4 excluded lines |
| U14 | No overflow with 8 candidates + results | PASS | overflow 0px |
| Q1 | Qualitative: niche CFO role vs junior support role market tightness | PASS | CFO 78d/level 3 vs support 18d/level 0 - correct differentiation |
| Q2 | Qualitative: job hopper risk classification | PASS | stability-signal flagged, overall 20 |
| Q3 | Qualitative: overqualified CMO for junior role | PASS | seniority-gap flagged, overall 8 |
| Q4 | Qualitative: Arabic role and profile scored natively | PASS | overall 88, evidence returned in Arabic |
| Q5 | Qualitative: duplicate names scored independently | PASS | 93 vs 24 by evidence |
| U5 | Form with 2 candidates at 390px (screenshot) | PASS | shots/u5-form.png |
| U15 | Zoom check: rank+name spacing at 3x | PASS | "#1 Zoom Name" renders with proper space - earlier appearance was thumbnail compression |
