# Champion Schools 34 (Ken Garff for Good)

Olympic-themed college and career readiness platform for Utah high school students, with an administrator back end for school Key Contacts and counselors. Built from the Trailblazers final presentation (Nov 2026) and the Keys to Success activities.

**Run it:** open `index.html`, or serve the folder (`python3 -m http.server`) and visit http://localhost:8000. No build step, no dependencies. It also works on GitHub Pages.

This is a **front-end prototype**: all data is sample data stored in the browser (localStorage). Use "Reset demo data" in the footer to start over, and the "Demo calendar month" picker to preview any month's event.

## Student experience
- **Training Room** (home): tier and streak, Daily Warm-Up, live monthly event, year-round Keys to Success drills, medal rack.
- **Events**: nine monthly events (Sept to May), each with an Olympic value, higher-ed initiative, activities, prize, and a bronze/silver/gold medal (1/3, 2/3, all activities).
- **Podium**: school leaderboard and school-vs-school (average points per student, so small rural schools can win).
- **My Medals**: medal case, tier ladder (Rookie to Champion), badges.
- **Prize Locker**: redeem points; includes digital and school-delivered prizes for students far from Wasatch Front rewards.

## Administrator back end
- **Dashboard**: participation, points, medals, completion by event, activity by grade, students needing a nudge.
- **Approvals**: account requests, activity verifications (FAFSA, applications, tours), prize requests.
- **Students & Points**: award points, search, filter, CSV export.
- **School Readiness**: 5-part intake that generates a printable one-page implementation plan.
- **Activation Kit**: per month: Canvas message, morning announcement, teacher talk, parent blurb, ambassador script, printable poster, .txt download.
- **Onboarding & Calendar**: role-based onboarding tracks and the Prepare / Activate / Sustain calendar with target dates from a launch date.
- **School Prizes**: add prizes students at your school actually want.

## Content
Edit `js/data.js` to change months, activities, points, prizes, onboarding steps and calendar. **Placeholders for KGFG to confirm:** point values, prize list, Olympic event names, tier thresholds, and the Keys to Success drill list (public site does not list individual activities).

## Next steps for production
Real sign-in and roles (student / key contact / KGFG), a database, Keys to Success account integration, real onboarding videos, QR codes on posters, and KPI reporting. Student data handling should be reviewed with KGFG before launch. Logo: `assets/logo.png` (replace with official brand files).
