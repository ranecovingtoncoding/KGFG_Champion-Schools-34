/* Champion Schools 34 — content data.
 * Monthly initiatives come from the Trailblazers Final Presentation (Nov 2026).
 * Keys to Success drills come from ktsutah.org + KGFG interviews.
 * Point values, prizes and "Olympic event" names are PLACEHOLDERS for KGFG to confirm. */
(function () {
  const ta = (k, l, ph) => ({ k, l, t: 'ta', ph: ph || '' });
  const tx = (k, l, ph) => ({ k, l, t: 'tx', ph: ph || '' });

  // ---------- Monthly initiatives (school-year order) ----------
  const MONTHS = [
    {
      id: 'sep', num: 9, name: 'September', value: 'Friendship', initiative: 'Find My Team',
      event: 'Cross-Country Relay', icon: '🎿', color: '#1E6BFF',
      tagline: 'Discover the people and tools that will help me take my first step toward higher education.',
      prize: 'Champion Schools 34 starter pack',
      activities: [
        { id: 'sep1', title: 'Complete orientation activities', type: 'module', pts: 60, mins: 10,
          lesson: 'Every champion starts with a warm-up. Take the platform tour: find your Training Room, your Events schedule, the Prize Locker, and the Podium. Then set up your profile so your school can find you.',
          fields: [ta('note', 'What is one thing on the platform you want to try first?')] },
        { id: 'sep2', title: 'Refer a friend', type: 'action', pts: 100, mins: 5, verify: true,
          lesson: 'Teams win together. Invite a classmate to join Champion Schools 34.',
          fields: [tx('friend', "Friend's first name and grade"), tx('how', 'How did you invite them? (text, in person, social)')] },
        { id: 'sep3', title: 'Meet your counselor and introduce yourself', type: 'meet', pts: 100, mins: 15, verify: true,
          lesson: 'Your counselor is your coach. Stop by the counseling office and say hello. Ask one question about life after high school.',
          fields: [tx('who', "Counselor's name"), ta('ask', 'What did you ask or learn?')] }
      ]
    },
    {
      id: 'oct', num: 10, name: 'October', value: 'Curiosity', initiative: 'Define My Future',
      event: 'Discovery Decathlon', icon: '🔭', color: '#19C37D',
      tagline: 'Explore my interests, goals, and the paths that can lead me there.',
      prize: 'Discovery Decathlon medal ribbon + drawing entry',
      activities: [
        { id: 'oct1', title: 'Complete the YouScience Aptitude test', type: 'assessment', pts: 150, mins: 45, verify: true,
          link: 'https://www.ktsutah.org/',
          lesson: 'The YouScience aptitude assessment shows what you are naturally good at. Take it from your Keys to Success account, then come back and share your top result.',
          fields: [tx('top', 'Name one top aptitude or career match you saw')] },
        { id: 'oct2', title: 'Complete a career exploration module', type: 'module', pts: 100, mins: 15,
          lesson: 'Pick a career that sounds interesting and learn what it pays, what training it needs, and what a typical day looks like.',
          fields: [tx('career', 'Career you explored'), ta('learn', 'One thing that surprised you')] },
        { id: 'oct3', title: 'Complete a major exploration module', type: 'module', pts: 100, mins: 15,
          lesson: 'Majors are the college version of events. Compare what you would study, and what jobs it connects to.',
          fields: [tx('major', 'Major you explored'), ta('learn', 'What would you study, and where could it lead?')] },
        { id: 'oct4', title: 'Build a "Future Me" vision board', type: 'reflect', pts: 100, mins: 20,
          lesson: 'Picture yourself five years after graduation. Where are you, what are you doing, who is with you?',
          fields: [ta('v1', 'Future Me: where I live and work'), ta('v2', 'Future Me: what I am proud of'), ta('v3', 'Future Me: who helped me get there')] }
      ]
    },
    {
      id: 'nov', num: 11, name: 'November', value: 'Gratitude', initiative: 'My Circle of Support',
      event: 'Crew Rowing', icon: '🚣', color: '#F5A623',
      tagline: 'Recognize the people who believe in me and can help me move forward.',
      prize: 'Gratitude drawing: gift card (digital) + school shout-out',
      activities: [
        { id: 'nov1', title: 'Add to the Champion Schools 34 gratitude board', type: 'wall', pts: 75, mins: 5, wall: true,
          lesson: 'Who helped you get where you are? Post a short thank-you to the school gratitude board.',
          fields: [ta('msg', 'Thank-you message (shown on the board with your first name)', 'Thank you to...')] },
        { id: 'nov2', title: 'Send a note of appreciation to a friend or teacher', type: 'note', pts: 75, mins: 10,
          lesson: 'Write a note to someone in your circle of support. Be specific about what they did.',
          fields: [tx('to', 'Who is it for?'), ta('note', 'Your note')] }
      ]
    },
    {
      id: 'dec', num: 12, name: 'December', value: 'Self-Confidence', initiative: 'I Can Achieve My Dreams',
      event: 'Ski Jump', icon: '🏂', color: '#E4002B',
      tagline: 'Build the confidence to see college and career success as part of my future.',
      prize: 'Scholarship entry boost + prize drawing',
      activities: [
        { id: 'dec1', title: 'Complete an application for a scholarship or higher-ed program', type: 'apply', pts: 250, mins: 60, verify: true,
          link: 'https://www.ktsutah.org/',
          lesson: 'Take the leap. Pick one scholarship or program that fits you and submit the application. Use the Keys to Success scholarship finder.',
          fields: [tx('what', 'Scholarship or program name'), tx('due', 'Deadline'), ta('note', 'Anything your counselor should know?')] }
      ]
    },
    {
      id: 'jan', num: 1, name: 'January', value: 'Integrity', initiative: 'Own My Pathway',
      event: 'Biathlon', icon: '🎯', color: '#8B5CF6',
      tagline: 'Take charge of my plan to make my dreams a reality.',
      prize: 'Pathway planner kit + drawing',
      activities: [
        { id: 'jan1', title: 'Build a post-high-school plan: three goals, three dates', type: 'plan', pts: 200, mins: 25,
          lesson: 'Aim before you shoot. Write three goals for life after high school and a target date for each.',
          fields: [{ t: 'rows', k: 'goals', n: 3, cols: [{ k: 'goal', l: 'Goal' }, { k: 'date', l: 'Target date', t: 'dt' }] }] },
        { id: 'jan2', title: 'Revisit fall goals: one followed through, one recommitting', type: 'reflect', pts: 100, mins: 10,
          lesson: 'Integrity means doing what you said you would. Look back at your fall.',
          fields: [ta('done', 'One goal I followed through on'), ta('again', 'One goal I am recommitting to')] }
      ]
    },
    {
      id: 'feb', num: 2, name: 'February', value: 'Teamwork', initiative: 'Stronger Together',
      event: 'Bobsled', icon: '🛷', color: '#06B6D4',
      tagline: 'Work alongside peers, families, and educators to make progress toward my goals.',
      prize: 'Family prize pack + drawing',
      activities: [
        { id: 'feb1', title: 'Invite a parent or guardian and complete the family conversation guide', type: 'family', pts: 150, mins: 30, verify: true,
          lesson: 'Bobsled is a team sport. Sit down with a parent or guardian and talk through your plan using the guide.',
          fields: [tx('who', 'Who did you talk with?'), ta('q1', 'What do they hope for you after high school?'), ta('q2', 'What is one next step you agreed on?')] },
        { id: 'feb2', title: 'Complete a short informational interview with an adult in a field you like', type: 'interview', pts: 150, mins: 30, verify: true,
          lesson: 'Ask a working adult three questions: how they got there, what a day looks like, what they would tell their younger self.',
          fields: [tx('who', 'Who did you interview, and what is their job?'), ta('learn', 'What did you learn?')] }
      ]
    },
    {
      id: 'mar', num: 3, name: 'March', value: 'Perseverance', initiative: 'Finish the Form',
      event: 'Marathon', icon: '🏃', color: '#F97316',
      tagline: 'Get the support and persistence to complete applications, financial-aid forms, and scholarships.',
      prize: 'Finish-line prize drawing + FAFSA finisher badge',
      activities: [
        { id: 'mar1', title: 'Complete the FAFSA', type: 'form', pts: 200, mins: 60, verify: true,
          link: 'https://studentaid.gov/h/apply-for-aid/fafsa',
          lesson: 'Seniors: file the FAFSA at studentaid.gov. It is the key to grants, work-study and federal loans.',
          fields: [{ t: 'ck', k: 'done', l: 'Confirm', o: ['I submitted my FAFSA', 'My counselor or a parent helped me check it'] }],
          alt: { title: 'Complete the FAFSA readiness checklist', lesson: 'Underclassmen: get ready now so senior year is easy.',
            fields: [{ t: 'ck', k: 'ready', l: 'I have...', o: ['Learned what the FAFSA is', 'Talked with a parent about it', 'Found out what documents are needed', 'Created or planned my FSA ID', 'Marked the FAFSA opening date on my calendar'] }] } },
        { id: 'mar2', title: 'Complete a financial aid module: grants vs. loans and true cost', type: 'module', pts: 100, mins: 20,
          lesson: 'Grants and scholarships are free money. Loans must be repaid. Sticker price is not what most students pay. Look at tuition plus housing, books and fees: the "true cost of attendance."',
          fields: [ta('a1', 'In your own words: grants vs. loans'), tx('a2', 'One cost besides tuition that you did not expect')] }
      ]
    },
    {
      id: 'apr', num: 4, name: 'April', value: 'Respect', initiative: 'Find My Fit',
      event: 'Figure Skating', icon: '⛸️', color: '#EC4899',
      tagline: 'Find the college, program, or pathway where I can thrive.',
      prize: 'Campus-visit prize drawing',
      activities: [
        { id: 'apr1', title: 'Compare three colleges or programs side by side', type: 'compare', pts: 150, mins: 30,
          lesson: 'Respect different paths: universities, community colleges, technical programs, apprenticeships, military and work. Compare three.',
          fields: [{ t: 'rows', k: 'cmp', n: 3, cols: [{ k: 'name', l: 'College / program' }, { k: 'cost', l: 'Cost per year' }, { k: 'size', l: 'Size' }, { k: 'off', l: 'Offerings I like' }] }] },
        { id: 'apr2', title: 'Take a virtual or in-person campus or program tour and post a reflection', type: 'tour', pts: 150, mins: 60, verify: true,
          lesson: 'Visit a campus or take a virtual tour. Notice how it feels.',
          fields: [tx('where', 'What did you tour?'), ta('refl', 'Reflection: how did it feel, and would you fit?')] }
      ]
    },
    {
      id: 'may', num: 5, name: 'May', value: 'Excellence', initiative: 'I Will Be a Champion',
      event: 'Podium Ceremony', icon: '🏆', color: '#F5C542',
      tagline: 'Celebrate my growth and commit to reaching my personal best.',
      prize: 'Champion Ceremony: school medal presentation',
      activities: [
        { id: 'may1', title: 'Complete an end-of-year reflection: September vs. now', type: 'reflect', pts: 150, mins: 15,
          lesson: 'Look at how far you have come this year.',
          fields: [ta('then', 'In September I was...'), ta('now', 'Now I am...'), ta('proud', 'What I am proudest of')] },
        { id: 'may2', title: 'Set a personal-best goal for the summer or next school year', type: 'goal', pts: 100, mins: 10,
          lesson: 'Champions keep training. Pick one measurable goal.',
          fields: [tx('goal', 'My personal-best goal'), tx('date', 'By when?'), ta('how', 'How will I do it?')] }
      ]
    }
  ];

  // ---------- Keys to Success year-round drills (Training Room) ----------
  const DRILLS = [
    { id: 'k_daily', title: 'Daily Warm-Up', type: 'daily', pts: 10, mins: 1, icon: '🔥', daily: true, desc: 'Check in once a day. Build a streak.' },
    { id: 'k_app', title: 'Download the Keys to Success app', type: 'action', pts: 25, mins: 2, icon: '📱', desc: 'Get Keys to Success on your phone.', fields: [{ t: 'ck', k: 'ok', l: 'Confirm', o: ['I installed the app and signed in'] }] },
    { id: 'k_scholar', title: 'Scholarship Gym: save 3 scholarships', type: 'action', pts: 60, mins: 10, icon: '🎓', desc: 'Browse the scholarship finder and save three you could win.', fields: [tx('s1', 'Scholarship 1'), tx('s2', 'Scholarship 2'), tx('s3', 'Scholarship 3')] },
    { id: 'k_cte', title: 'Career Pathways: explore a CTE pathway', type: 'module', pts: 60, mins: 10, icon: '🛠️', desc: 'Learn about a Career & Technical Education pathway offered in Utah.', fields: [tx('p', 'Pathway you explored'), ta('n', 'Why does it interest you?')] },
    { id: 'k_pay', title: 'Ways to Pay: explore funding options', type: 'module', pts: 60, mins: 10, icon: '💵', desc: 'Scholarships, grants, work-study, and payment plans in one place.', fields: [ta('n', 'Which two ways to pay could work for you?')] },
    { id: 'k_give', title: 'Enter the $2,000 scholarship giveaway', type: 'action', pts: 25, mins: 1, icon: '🎟️', desc: 'No application. Just have an account and hit enter. One in the fall, four in the spring.', fields: [{ t: 'ck', k: 'ok', l: 'Confirm', o: ['I entered the giveaway'] }] },
    { id: 'k_ucaw', title: 'UCAW: submit a college application (seniors)', type: 'apply', pts: 200, mins: 60, icon: '🏫', desc: 'Utah College Application Week: apply while your school gives you the time.', grades: [12], verify: true, fields: [tx('c', 'College or school applied to')] },
    { id: 'k_uhead', title: 'UHEAD: attend Utah Higher Education Day', type: 'event', pts: 100, mins: 120, icon: '🗓️', desc: 'Spring event, usually for juniors. Meet recruiters and explore careers.', verify: true, fields: [ta('n', 'Who did you talk with and what did you learn?')] },
    { id: 'k_amb', title: 'Ambassador Tryouts: apply to be an ambassador', type: 'apply', pts: 100, mins: 20, icon: '🤝', desc: 'Lead at your school, do monthly workshops, and unlock ambassador scholarships.', verify: true, fields: [ta('why', 'Why do you want to be an ambassador?')] }
  ];

  // ---------- Prize Locker (placeholders) ----------
  const PRIZES = [
    { id: 'p1', name: 'Digital gift card: $10', cost: 400, tag: 'Digital: works anywhere in Utah', icon: '🎁' },
    { id: 'p2', name: 'Champion Schools 34 water bottle', cost: 250, tag: 'Shipped to your school', icon: '🥤' },
    { id: 'p3', name: 'Champion Schools 34 hoodie', cost: 900, tag: 'Shipped to your school', icon: '🧥' },
    { id: 'p4', name: 'ACT / SAT prep voucher', cost: 700, tag: 'Digital: works anywhere in Utah', icon: '📚' },
    { id: 'p5', name: 'Application fee waiver', cost: 600, tag: 'Digital: works anywhere in Utah', icon: '📝' },
    { id: 'p6', name: 'Free Chick-fil-A meal (Wasatch Front)', cost: 300, tag: 'Local pickup only', icon: '🍔' }
  ];

  const TIERS = [
    { n: 'Rookie', min: 0 }, { n: 'Contender', min: 300 }, { n: 'Finalist', min: 800 },
    { n: 'Medalist', min: 1500 }, { n: 'Champion', min: 2500 }
  ];

  // ---------- Admin content ----------
  const ONBOARDING = [
    { role: 'Admin / Sponsor', icon: '🏛️', length: '10-min overview + check-in call',
      goal: 'Authorize the program and remove barriers.',
      video: ['Why Champion Schools 34 supports your school goals', 'What it asks of your staff (very little)', 'How you will see results (impact snapshot)'],
      steps: ['Watch the 10-minute overview', 'Name the executive sponsor', 'Attend the check-in call with Ken Garff for Good', 'Approve launch date and announcement channels'] },
    { role: 'School Point of Contact', icon: '📍', length: '30-min onboarding call',
      goal: 'Own the rollout and the monthly rhythm.',
      video: ['Your dashboard in 5 minutes', 'Approving accounts and awarding points', 'Using the monthly activation kit'],
      steps: ['Complete the school readiness intake', 'Attend the 30-minute onboarding call', 'Explore the admin dashboard', 'Review the implementation calendar', 'Send the first monthly kit'] },
    { role: 'Teachers & Counselor Leads', icon: '🍎', length: '10-min quick-start video',
      goal: 'Introduce students in advisory, CTE or CCR time.',
      video: ['How to introduce the platform in 2 minutes', 'Reading the participation view', 'Reading the one-minute teacher talk'],
      steps: ['Watch the quick-start video', 'Read the one-minute teacher talk', 'Introduce this month\'s event in advisory, CTE or CCR', 'Approve any pending student verifications'] },
    { role: 'Students', icon: '🏅', length: '2-min launch video',
      goal: 'Know what to do first and why it is worth it.',
      video: ['Welcome to Champion Schools 34 (Olympic athlete + student ambassador)'],
      steps: ['Watch the 2-minute launch video', 'Create your account', 'Finish orientation activities', 'Meet your counselor'] }
  ];

  const CALENDAR = [
    { phase: 'Prepare', when: '4–6 weeks before launch', offsetDays: -35,
      tasks: ['Complete the school intake form', 'Confirm technology access and student logins', 'Assign roles (sponsor, point of contact, support team)', 'Finalize the launch plan'] },
    { phase: 'Prepare', when: '2 weeks before launch', offsetDays: -14,
      tasks: ['Run a staff preview session', 'Send the school-wide launch message', 'Confirm student access and delivery channels'] },
    { phase: 'Activate', when: 'Launch and every month', offsetDays: 0,
      tasks: ['Introduce Champion Schools 34 through existing school channels', 'Deliver the first student initiative with clear participation instructions', 'Send the monthly activation kit', 'Approve verifications and award points'] },
    { phase: 'Sustain', when: 'Midyear check-in (January)', offsetDays: 120,
      tasks: ['Review participation with Ken Garff for Good', 'Adjust the approach and the prizes'] },
    { phase: 'Sustain', when: 'Year-end impact report (May)', offsetDays: 240,
      tasks: ['Review the impact snapshot', 'Decide next-year renewal and plan'] }
  ];

  window.CS34DATA = { MONTHS, DRILLS, PRIZES, TIERS, ONBOARDING, CALENDAR };
})();
