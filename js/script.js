(() => {
  "use strict";

  /* =========================================================
     SEFAT BHUIYAN — PORTFOLIO
     COMPLETE JAVASCRIPT
     Previous Features + Steps 1–8
     ========================================================= */


  /* =========================================================
     BASIC HELPERS
     ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  const hasFinePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;


  /* =========================================================
     THEME SYSTEM
     ========================================================= */

  const themeButton =
    $("#themeBtn");

  const savedTheme =
    localStorage.getItem(
      "sb-theme"
    );


  if (
    savedTheme === "light"
  ) {
    document.body.classList.add(
      "light"
    );
  }


  function updateThemeButton() {

    if (!themeButton) {
      return;
    }

    const isLight =
      document.body.classList.contains(
        "light"
      );

    themeButton.innerHTML =
      isLight
        ? `<svg class="theme-svg theme-svg-sun" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
        : `<svg class="theme-svg theme-svg-moon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

    themeButton.setAttribute(
      "aria-label",
      isLight
        ? "Switch to dark mode"
        : "Switch to light mode"
    );

    themeButton.setAttribute(
      "title",
      isLight
        ? "Switch to dark mode"
        : "Switch to light mode"
    );

  }


  updateThemeButton();


  if (
    themeButton
  ) {

    themeButton.addEventListener(
      "click",
      () => {

        document.body.classList.toggle(
          "light"
        );


        localStorage.setItem(
          "sb-theme",
          document.body.classList.contains(
            "light"
          )
            ? "light"
            : "dark"
        );


        updateThemeButton();

      }
    );

  }


  /* =========================================================
     LOADING SCREEN
     ========================================================= */

  const loader =
    document.createElement(
      "div"
    );


  loader.id =
    "siteLoader";


  loader.innerHTML = `
    <div class="loader-shell">

      <div class="loader-mark" aria-hidden="true">
        <span>SB</span>
      </div>

      <h2 class="loader-title">
        Sefat Bhuiyan
      </h2>

      <p class="loader-subtitle">
        Digital Marketer &amp; Graphic Designer
      </p>

      <div class="loader-bar" aria-hidden="true">
        <span></span>
      </div>

      <span
        class="loader-percent"
        id="loaderPercent"
      >
        0%
      </span>

    </div>
  `;


  document.body.prepend(
    loader
  );


  document.body.style.overflow =
    "hidden";


  const loaderPercent =
    $("#loaderPercent");


  let loaderValue =
    0;


  const loaderCounter =
    setInterval(
      () => {

        loaderValue +=
          Math.floor(
            Math.random() * 7
          ) + 3;


        if (
          loaderValue >= 100
        ) {

          loaderValue =
            100;

          clearInterval(
            loaderCounter
          );

        }


        if (
          loaderPercent
        ) {

          loaderPercent.textContent =
            `${loaderValue}%`;

        }

      },
      55
    );


  let loaderHidden =
    false;


  function startHeroCardAnimation() {
    const heroCard = $(".id-card");
    if (!heroCard) return;
    heroCard.classList.add("is-ready");
  }


  function hideLoader() {

    if (
      loaderHidden
    ) {
      return;
    }


    loaderHidden =
      true;


    clearInterval(
      loaderCounter
    );


    if (
      loaderPercent
    ) {

      loaderPercent.textContent =
        "100%";

    }


    setTimeout(
      () => {

        loader.classList.add(
          "loaded"
        );


        document.body.style.overflow =
          "";


        setTimeout(
          startHeroCardAnimation,
          prefersReducedMotion
            ? 0
            : 160
        );


        setTimeout(
          () => {

            loader.remove();

          },
          750
        );

      },
      prefersReducedMotion
        ? 120
        : 1850
    );

  }


  if (
    document.readyState ===
    "complete"
  ) {

    hideLoader();

  } else {

    window.addEventListener(
      "load",
      hideLoader,
      {
        once: true
      }
    );

  }


  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  const scrollProgress =
    document.createElement(
      "div"
    );


  scrollProgress.className =
    "scroll-progress";


  document.body.appendChild(
    scrollProgress
  );


  function updateScrollProgress() {

    const scrollTop =
      window.scrollY ||
      window.pageYOffset ||
      0;


    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;


    const percentage =
      documentHeight > 0
        ? Math.min(
            100,
            Math.max(
              0,
              (
                scrollTop /
                documentHeight
              ) * 100
            )
          )
        : 0;


    scrollProgress.style.width =
      `${percentage}%`;

  }


  window.addEventListener(
    "scroll",
    updateScrollProgress,
    {
      passive: true
    }
  );


  updateScrollProgress();


  /* =========================================================
     MOUSE POSITION
     ========================================================= */

  let mouseClientX =
    window.innerWidth / 2;


  let mouseClientY =
    window.innerHeight / 2;


  if (
    hasFinePointer
  ) {

    window.addEventListener(
      "pointermove",
      (event) => {

        mouseClientX =
          event.clientX;


        mouseClientY =
          event.clientY;


        document.documentElement.style.setProperty(
          "--mx",
          `${(
            mouseClientX /
            window.innerWidth
          ) * 100}%`
        );


        document.documentElement.style.setProperty(
          "--my",
          `${(
            mouseClientY /
            window.innerHeight
          ) * 100}%`
        );

      },
      {
        passive: true
      }
    );

  }


  /* =========================================================
     CUSTOM CURSOR
     ========================================================= */

  const cursor =
    $("#cursor");


  if (
    cursor &&
    hasFinePointer &&
    !prefersReducedMotion
  ) {

    document.body.classList.add(
      "has-custom-cursor"
    );


    let cursorX =
      window.innerWidth / 2;


    let cursorY =
      window.innerHeight / 2;


    const trailPoints =
      [];


    for (
      let i = 0;
      i < 8;
      i++
    ) {

      const trailElement =
        document.createElement(
          "span"
        );


      trailElement.className =
        "cursor-trail";


      trailElement.style.opacity =
        String(
          Math.max(
            0.05,
            0.32 -
            i * 0.035
          )
        );


      document.body.appendChild(
        trailElement
      );


      trailPoints.push({
        element:
          trailElement,
        x:
          cursorX,
        y:
          cursorY
      });

    }


    function animateCursor() {

      cursorX +=
        (
          mouseClientX -
          cursorX
        ) * 0.22;


      cursorY +=
        (
          mouseClientY -
          cursorY
        ) * 0.22;


      cursor.style.transform =
        `translate3d(${cursorX}px, ${cursorY}px, 0)`;


      let previousX =
        cursorX;


      let previousY =
        cursorY;


      trailPoints.forEach(
        (
          point,
          index
        ) => {

          const strength =
            0.22 -
            index * 0.014;


          point.x +=
            (
              previousX -
              point.x
            ) * strength;


          point.y +=
            (
              previousY -
              point.y
            ) * strength;


          point.element.style.transform =
            `translate3d(${point.x}px, ${point.y}px, 0)`;


          previousX =
            point.x;


          previousY =
            point.y;

        }
      );


      requestAnimationFrame(
        animateCursor
      );

    }


    requestAnimationFrame(
      animateCursor
    );


    const interactiveElements =
      $$(
        `
        a,
        button,
        input,
        textarea,
        select,
        .chip,
        .skill-row,
        .featured-project-card
        `
      );


    interactiveElements.forEach(
      (
        element
      ) => {

        element.addEventListener(
          "mouseenter",
          () => {

            cursor.classList.add(
              "is-link"
            );

          }
        );


        element.addEventListener(
          "mouseleave",
          () => {

            cursor.classList.remove(
              "is-link"
            );

          }
        );

      }
    );

  } else if (
    cursor &&
    !hasFinePointer
  ) {

    cursor.style.display =
      "none";

  }


  /* =========================================================
     LIVE BACKGROUND
     ========================================================= */

  const liveBackground =
    document.createElement(
      "div"
    );


  liveBackground.className =
    "live-background";


  liveBackground.setAttribute(
    "aria-hidden",
    "true"
  );

  const orbContainer =
    document.createElement(
      "div"
    );

  orbContainer.className =
    "live-orbs";

  for (
    let i = 1;
    i <= 3;
    i++
  ) {
    const orb =
      document.createElement(
        "span"
      );

    orb.className =
      `ambient-orb ambient-orb-${i}`;

    orbContainer.appendChild(
      orb
    );
  }

  liveBackground.appendChild(
    orbContainer
  );


  document.body.prepend(
    liveBackground
  );


  /* =========================================================
     3D CYBERNETIC MARQUEE RUNWAY ENGINE
     Holographic Skill Badges • Specular Sweep • Stellar Stars
     ========================================================= */

  const marqueeTrack =
    $("#marqueeTrack");


  const defaultMarquee = [
    "DIGITAL MARKETING",
    "GRAPHIC DESIGN",
    "CONTENT CREATION",
    "SOCIAL MEDIA",
    "BRAND VISUALS",
    "CREATIVE STRATEGY"
  ];

  const marqueeIcons = [
    // Digital Marketing (Rocket Performance)
    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>`,
    // Graphic Design (Pen Tool Precision)
    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
    // Content Creation (Sparkle Magic Star)
    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    // Social Media (Global Network Nodes)
    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    // Brand Visuals (Diamond Identity Gem)
    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
    // Creative Strategy (Innovation Lightbulb)
    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`
  ];


  function renderMarquee(
    items
  ) {

    if (
      !marqueeTrack
    ) {
      return;
    }


    const build =
      () =>
        items
          .map(
            (
              item,
              index
            ) => {
              const icon = marqueeIcons[index % marqueeIcons.length];
              return `
                <div class="marquee-chip" role="presentation">
                  <span class="marquee-chip-icon" aria-hidden="true">${icon}</span>
                  <span class="marquee-chip-text">${item}</span>
                  <span class="marquee-chip-glow" aria-hidden="true"></span>
                </div>
                <span class="marquee-divider" aria-hidden="true">
                  <span class="marquee-star">✦</span>
                  <span class="marquee-divider-glow"></span>
                </span>
              `;
            }
          )
          .join("");


    const block =
      build() +
      build();

    marqueeTrack.innerHTML =
      block +
      block;

  }


  renderMarquee(
    defaultMarquee
  );


  /* =========================================================
     LANGUAGE SYSTEM
     English • Bangla • Arabic
     ========================================================= */

  const languageSwitcher =
    $(".language-switcher");


  const languageToggle =
    $("#languageToggle");


  const languageMenu =
    $("#languageMenu");


  const languageCurrent =
    $("#languageCurrent");


  const languageOptions =
    $$(".language-option");


  const languageData = {

    /* =======================================================
       ENGLISH
       ======================================================= */

    en: {

      lang:
        "en",

      dir:
        "ltr",

      short:
        "EN",

      title:
        "Sefat Bhuiyan — Portfolio",

      description:
        "Personal portfolio of Sefat Bhuiyan — Digital Marketer & Graphic Designer.",


      nav: [
        "Home",
        "About",
        "Education",
        "Career",
        "Projects"
      ],


      hero: {

        availability:
          "Available for work",

        heading:
          `<span class="hero-greeting-line">Hi, I'm</span><br /><span class="hero-name-line"><span class="gradient hero-name-vibrant">Sefat Bhuiyan</span></span>`,

        lead:
          "I build creative digital experiences. Specialized in digital marketing, content creation, graphic design, and modern social media visuals.",

        viewWork:
          "View Work&nbsp;→",

        resume:
          "Resume&nbsp;↗"

      },


      card: {

        role:
          "Digital Marketer & Graphic Designer",

        specialty:
          "SPECIALTY",

        specialtyValue:
          "Marketing & Design",

        location:
          "LOCATION",

        locationValue:
          "Dhaka, Bangladesh",

        experience:
          "EXPERIENCE",

        experienceValue:
          "Creative Projects",

        status:
          "STATUS",

        statusValue:
          "● Active",

        brand:
          "PERSONAL BRAND"

      },


      about: {

        eyebrow:
          "About Me",

        heading:
          `Passionate about <span class="gradient">Digital Excellence</span>`,

        description:
          "I am a creative digital marketer and designer focused on building clear, engaging, and visually strong digital experiences. I blend marketing strategy, content creation, and design to help brands communicate better.",

        stats: [
          "Creative Skills",
          "Projects & Designs",
          "Clients / Collaborations",
          "Core Services"
        ]

      },


      services: {

        eyebrow:
          "What I Do",

        heading:
          "Creative services that move brands forward.",

        description:
          "A focused set of services combining strategy, design, content, and social media support.",

        items: [
          [
            "Social Media Marketing",
            "Page setup, content planning, growth-focused social media support."
          ],
          [
            "Graphic Design",
            "Posts, banners, thumbnails, business creatives, and visual systems."
          ],
          [
            "Content Creation",
            "Creative concepts, ad creatives, scripts, and branded visual content."
          ],
          [
            "Brand Visuals",
            "Clean identity assets, campaign visuals, and consistent presentation."
          ]
        ]

      },


      projects: {

        eyebrow:
          "Selected Works",

        heading:
          `Explore My <span class="gradient">Projects</span>`,

        description:
          "Want to see all of my work in one place? Open my complete project collection on Google Drive.",

        kicker:
          "Complete Portfolio Collection",

        headingCard:
          "সবগুলো Project দেখতে এখানে ক্লিক করুন",

        descriptionCard:
          "আমার সব ডিজাইন, marketing creatives, social media work এবং অন্যান্য project একসাথে দেখতে নিচের button-এ click করুন।",

        button:
          "All Projects",

        tags: [
          "Design",
          "Marketing",
          "Content",
          "Creative"
        ]

      },


      featured: {

        eyebrow:
          "Featured Project Focus",

        heading:
          "Selected creative directions for brands & social media.",

        description:
          "Explore a few core project categories and open the full collection to see the detailed work.",

        cards: [

          [
            "Social Media Marketing",
            "Social Media Campaign",
            "Page visuals, content planning, and growth-focused creative direction.",
            "View Collection",
            "Open social media campaign work"
          ],

          [
            "Graphic Design",
            "Brand Visual Design",
            "Clean visual assets, campaign creatives, and consistent brand presentation.",
            "View Collection",
            "Open brand visual design work"
          ],

          [
            "Content Creation",
            "Content & Ad Creative",
            "Creative concepts, ad-ready visuals, scripts, and branded content direction.",
            "View Collection",
            "Open content and ad creative work"
          ]

        ]

      },


      career: {

        eyebrow:
          "Career Journey",

        heading:
          "My professional path.",

        items: [

          [
            "Content & Social Media",
            "Independent Work",
            "Explored content creation, page growth, and social media strategy through hands-on projects and experimentation."
          ],

          [
            "Graphic Design Practice",
            "Creative Projects",
            "Designed social posts, banners, thumbnails, logos, and visual assets while developing a consistent production workflow."
          ],

          [
            "Digital Marketing & Design",
            "Freelance / Personal Projects",
            "Building campaigns, social visuals, creative content, and digital brand materials with a strong focus on clarity and visual quality."
          ]

        ]

      },


      education: {

        eyebrow:
          "Academic Background",

        heading:
          `Academic <span class="gradient">Background</span>`,

        description:
          "Academic and technical learning that supports my creative and digital work.",

        current:
          "Current",

        completed:
          "Completed",

        items: [

          [
            "Diploma in Computer Technology",
            "Bangladesh · Computer Technology",
            [
              "Computer fundamentals and practical technology learning",
              "Digital tools and problem-solving practice",
              "Hands-on technical learning and projects"
            ]
          ],

          [
            "Secondary School Certificate",
            "Bangladesh · SSC",
            [
              "Completed higher secondary education",
              "Academic foundation for further technical study",
              "Transitioned into diploma and professional skill development"
            ]
          ]

        ]

      },


      skills: {

        eyebrow:
          "Expertise & Skills",

        heading:
          "What I bring to the table.",

        arsenal:
          "Technical / Creative Arsenal",

        traits:
          "Professional Traits",

        traitsItems: [
          "Creative Thinking",
          "Problem Solving",
          "Content Strategy",
          "Visual Storytelling",
          "Brand Consistency",
          "Client Communication"
        ],

        learner:
          "Constant Learner",

        learnerText:
          "Continuously learning new tools, creative workflows, digital marketing techniques, and design systems."

      },


      testimonials: {

        eyebrow:
          "Client Testimonials",

        heading:
          "People I have worked with.",

        clients: [
          "Client",
          "Creative Partner"
        ],

        roles: [
          "Business / Brand",
          "Creative Collaboration"
        ],

        texts: [

          "Creative, responsive, and easy to communicate with. The visuals were delivered cleanly and matched the direction very well.",

          "Strong attention to detail and a very good sense of modern social media presentation. Would work together again."

        ]

      },


      contact: {

        eyebrow:
          "Let's Connect",

        heading:
          "Have a project in mind?",

        description:
          "Let's discuss your next campaign, design need, or digital project.",

        labels: [
          "WhatsApp",
          "Facebook",
          "Email",
          "LinkedIn",
          "Location"
        ],

        values: [
          "01828157751",
          "Open Profile ↗",
          "ksefat94@gmail.com",
          "View Profile ↗",
          "Dhaka, Bangladesh"
        ],

        name:
          "Your Name",

        email:
          "Email Address",

        subject:
          "Subject",

        message:
          "Write your message...",

        send:
          "Send Message&nbsp;→"

      },


      footer: {

        role:
          "DIGITAL MARKETER • DESIGNER",

        back:
          "Back to top ↑",

        nav: [
          "Home",
          "About",
          "Career",
          "Projects",
          "Education",
          "Contact"
        ],

        copyright:
          "© 2026 Sefat Bhuiyan. Crafted with ♥"

      },


      aria: {

        changeLanguage:
          "Change language",

        whatsapp:
          "Chat on WhatsApp",

        facebook:
          "Open Facebook profile",

        email:
          "Send email",

        linkedin:
          "Open LinkedIn profile",

        resume:
          "Open Sefat Bhuiyan resume"

      },


      marquee: [
        "DIGITAL MARKETING",
        "GRAPHIC DESIGN",
        "CONTENT CREATION",
        "SOCIAL MEDIA",
        "BRAND VISUALS",
        "CREATIVE STRATEGY"
      ]

    },


    /* =======================================================
       BANGLA
       ======================================================= */

    bn: {

      lang:
        "bn",

      dir:
        "ltr",

      short:
        "বাংলা",

      title:
        "সিফাত ভুঁইয়া — পোর্টফোলিও",

      description:
        "সিফাত ভুঁইয়ার ব্যক্তিগত পোর্টফোলিও — ডিজিটাল মার্কেটার ও গ্রাফিক ডিজাইনার।",


      nav: [
        "হোম",
        "আমার সম্পর্কে",
        "শিক্ষা",
        "ক্যারিয়ার",
        "প্রজেক্ট"
      ],


      hero: {

        availability:
          "কাজের জন্য উপলব্ধ",

        heading:
          `<span class="hero-greeting-line">হাই, আমি</span><br /><span class="hero-name-line"><span class="gradient hero-name-vibrant">সিফাত ভুঁইয়া</span></span>`,

        lead:
          "আমি সৃজনশীল ডিজিটাল এক্সপেরিয়েন্স তৈরি করি। Digital Marketing, Content Creation, Graphic Design এবং আধুনিক Social Media Visuals নিয়ে কাজ করি।",

        viewWork:
          "আমার কাজ দেখুন&nbsp;→",

        resume:
          "রেজুমে&nbsp;↗"

      },


      card: {

        role:
          "ডিজিটাল মার্কেটার ও গ্রাফিক ডিজাইনার",

        specialty:
          "বিশেষত্ব",

        specialtyValue:
          "মার্কেটিং ও ডিজাইন",

        location:
          "অবস্থান",

        locationValue:
          "ঢাকা, বাংলাদেশ",

        experience:
          "অভিজ্ঞতা",

        experienceValue:
          "ক্রিয়েটিভ প্রজেক্ট",

        status:
          "স্ট্যাটাস",

        statusValue:
          "● সক্রিয়",

        brand:
          "পার্সোনাল ব্র্যান্ড"

      },


      about: {

        eyebrow:
          "আমার সম্পর্কে",

        heading:
          `ডিজিটাল <span class="gradient">এক্সিলেন্স</span> নিয়ে কাজ করতে ভালোবাসি`,

        description:
          "আমি একজন সৃজনশীল ডিজিটাল মার্কেটার ও ডিজাইনার। পরিষ্কার, আকর্ষণীয় এবং শক্তিশালী ভিজ্যুয়াল ডিজিটাল এক্সপেরিয়েন্স তৈরি করার দিকে আমার ফোকাস। Marketing Strategy, Content Creation এবং Design একসাথে ব্যবহার করে ব্র্যান্ডকে আরও ভালোভাবে যোগাযোগ করতে সাহায্য করি।",

        stats: [
          "ক্রিয়েটিভ স্কিল",
          "প্রজেক্ট ও ডিজাইন",
          "ক্লায়েন্ট / সহযোগিতা",
          "মূল সার্ভিস"
        ]

      },


      services: {

        eyebrow:
          "আমি যা করি",

        heading:
          "ব্র্যান্ডকে এগিয়ে নিতে সৃজনশীল সার্ভিস।",

        description:
          "ডিজিটাল মার্কেটিং, ডিজাইন, কনটেন্ট এবং সোশ্যাল মিডিয়া সাপোর্টের একটি focused service system.",

        items: [

          [
            "Social Media Marketing",
            "Page setup, content planning এবং growth-focused social media support."
          ],

          [
            "Graphic Design",
            "Posts, banners, thumbnails, business creatives এবং visual systems."
          ],

          [
            "Content Creation",
            "Creative concepts, ad creatives, scripts এবং branded visual content."
          ],

          [
            "Brand Visuals",
            "Clean identity assets, campaign visuals এবং consistent presentation."
          ]

        ]

      },


      projects: {

        eyebrow:
          "নির্বাচিত কাজ",

        heading:
          `আমার <span class="gradient">প্রজেক্টসমূহ</span> দেখুন`,

        description:
          "আমার সব কাজ এক জায়গায় দেখতে complete project collection খুলুন।",

        kicker:
          "সম্পূর্ণ পোর্টফোলিও কালেকশন",

        headingCard:
          "সবগুলো Project দেখতে এখানে ক্লিক করুন",

        descriptionCard:
          "আমার সব ডিজাইন, marketing creatives, social media work এবং অন্যান্য project একসাথে দেখতে নিচের button-এ click করুন।",

        button:
          "সব প্রজেক্ট",

        tags: [
          "ডিজাইন",
          "মার্কেটিং",
          "কনটেন্ট",
          "ক্রিয়েটিভ"
        ]

      },


      featured: {

        eyebrow:
          "ফিচার্ড প্রজেক্ট ফোকাস",

        heading:
          "ব্র্যান্ড ও সোশ্যাল মিডিয়ার জন্য নির্বাচিত ক্রিয়েটিভ কাজ।",

        description:
          "আমার কাজের কয়েকটি মূল প্রজেক্ট ক্যাটাগরি দেখুন এবং বিস্তারিত কাজ দেখতে সম্পূর্ণ কালেকশন খুলুন।",

        cards: [

          [
            "সোশ্যাল মিডিয়া মার্কেটিং",
            "সোশ্যাল মিডিয়া ক্যাম্পেইন",
            "পেজ ভিজ্যুয়াল, কনটেন্ট প্ল্যানিং এবং গ্রোথ-ফোকাসড ক্রিয়েটিভ ডিরেকশন।",
            "কাজ দেখুন",
            "সোশ্যাল মিডিয়া ক্যাম্পেইনের কাজ খুলুন"
          ],

          [
            "গ্রাফিক ডিজাইন",
            "ব্র্যান্ড ভিজ্যুয়াল ডিজাইন",
            "ক্লিন ভিজ্যুয়াল অ্যাসেট, ক্যাম্পেইন ক্রিয়েটিভ এবং কনসিস্টেন্ট ব্র্যান্ড প্রেজেন্টেশন।",
            "কাজ দেখুন",
            "ব্র্যান্ড ভিজ্যুয়াল ডিজাইনের কাজ খুলুন"
          ],

          [
            "কনটেন্ট ক্রিয়েশন",
            "কনটেন্ট ও অ্যাড ক্রিয়েটিভ",
            "ক্রিয়েটিভ কনসেপ্ট, বিজ্ঞাপনের উপযোগী ভিজ্যুয়াল, স্ক্রিপ্ট এবং ব্র্যান্ডেড কনটেন্ট ডিরেকশন।",
            "কাজ দেখুন",
            "কনটেন্ট ও অ্যাড ক্রিয়েটিভের কাজ খুলুন"
          ]

        ]

      },


      career: {

        eyebrow:
          "ক্যারিয়ার জার্নি",

        heading:
          "আমার পেশাগত পথ।",

        items: [

          [
            "কনটেন্ট ও সোশ্যাল মিডিয়া",
            "ইন্ডিপেন্ডেন্ট ওয়ার্ক",
            "Content Creation, page growth এবং Social Media Strategy নিয়ে hands-on কাজ ও experimentation করেছি।"
          ],

          [
            "গ্রাফিক ডিজাইন প্র্যাকটিস",
            "ক্রিয়েটিভ প্রজেক্ট",
            "সোশ্যাল পোস্ট, ব্যানার, থাম্বনেইল, লোগো এবং বিভিন্ন ভিজ্যুয়াল অ্যাসেট ডিজাইন করেছি।"
          ],

          [
            "ডিজিটাল মার্কেটিং ও ডিজাইন",
            "ফ্রিল্যান্স / ব্যক্তিগত প্রজেক্ট",
            "ক্যাম্পেইন, সোশ্যাল ভিজ্যুয়াল, ক্রিয়েটিভ কনটেন্ট এবং ডিজিটাল ব্র্যান্ড ম্যাটেরিয়াল তৈরি করছি।"
          ]

        ]

      },


      education: {

        eyebrow:
          "শিক্ষাগত পটভূমি",

        heading:
          `শিক্ষাগত <span class="gradient">পটভূমি</span>`,

        description:
          "আমার সৃজনশীল ও ডিজিটাল কাজকে সহায়তা করা একাডেমিক ও টেকনিক্যাল লার্নিং।",

        current:
          "চলমান",

        completed:
          "সম্পন্ন",

        items: [

          [
            "ডিপ্লোমা ইন কম্পিউটার টেকনোলজি",
            "বাংলাদেশ · কম্পিউটার টেকনোলজি",
            [
              "কম্পিউটার ফান্ডামেন্টাল ও ব্যবহারিক প্রযুক্তি শিক্ষা",
              "ডিজিটাল টুলস ও সমস্যা সমাধানের অনুশীলন",
              "হাতে-কলমে টেকনিক্যাল লার্নিং ও প্রজেক্ট"
            ]
          ],

          [
            "সেকেন্ডারি স্কুল সার্টিফিকেট",
            "বাংলাদেশ · SSC",
            [
              "উচ্চ মাধ্যমিক শিক্ষা সম্পন্ন",
              "পরবর্তী টেকনিক্যাল পড়াশোনার জন্য একাডেমিক ভিত্তি",
              "ডিপ্লোমা ও প্রফেশনাল স্কিল ডেভেলপমেন্টে অগ্রসর"
            ]
          ]

        ]

      },


      skills: {

        eyebrow:
          "দক্ষতা ও স্কিল",

        heading:
          "আমি যে দক্ষতাগুলো নিয়ে কাজ করি।",

        arsenal:
          "টেকনিক্যাল / ক্রিয়েটিভ আর্সেনাল",

        traits:
          "প্রফেশনাল বৈশিষ্ট্য",

        traitsItems: [
          "Creative Thinking",
          "Problem Solving",
          "Content Strategy",
          "Visual Storytelling",
          "Brand Consistency",
          "Client Communication"
        ],

        learner:
          "সবসময় শেখার আগ্রহ",

        learnerText:
          "নতুন টুল, creative workflow, digital marketing technique এবং design system নিয়মিত শিখছি।"

      },


      testimonials: {

        eyebrow:
          "ক্লায়েন্ট মতামত",

        heading:
          "যাদের সাথে কাজ করেছি।",

        clients: [
          "ক্লায়েন্ট",
          "ক্রিয়েটিভ পার্টনার"
        ],

        roles: [
          "ব্যবসা / ব্র্যান্ড",
          "ক্রিয়েটিভ সহযোগিতা"
        ],

        texts: [

          "সৃজনশীল, দ্রুত সাড়া দেয় এবং যোগাযোগ করা সহজ। ভিজ্যুয়ালগুলো পরিষ্কারভাবে ডেলিভার করা হয়েছে এবং নির্দেশনার সঙ্গে ভালোভাবে মিলেছে।",

          "ডিটেইলের প্রতি ভালো নজর এবং আধুনিক সোশ্যাল মিডিয়া প্রেজেন্টেশনের দারুণ ধারণা আছে। আবারও একসাথে কাজ করতে চাই।"

        ]

      },


      contact: {

        eyebrow:
          "যোগাযোগ করি",

        heading:
          "কোনো প্রজেক্টের পরিকল্পনা আছে?",

        description:
          "আপনার পরবর্তী campaign, design need অথবা digital project নিয়ে আলোচনা করা যাক।",

        labels: [
          "WhatsApp",
          "Facebook",
          "Email",
          "LinkedIn",
          "অবস্থান"
        ],

        values: [
          "01828157751",
          "প্রোফাইল খুলুন ↗",
          "ksefat94@gmail.com",
          "প্রোফাইল দেখুন ↗",
          "ঢাকা, বাংলাদেশ"
        ],

        name:
          "আপনার নাম",

        email:
          "ইমেইল ঠিকানা",

        subject:
          "বিষয়",

        message:
          "আপনার মেসেজ লিখুন...",

        send:
          "মেসেজ পাঠান&nbsp;→"

      },


      footer: {

        role:
          "ডিজিটাল মার্কেটার • ডিজাইনার",

        back:
          "উপরে যান ↑",

        nav: [
          "হোম",
          "আমার সম্পর্কে",
          "ক্যারিয়ার",
          "প্রজেক্ট",
          "শিক্ষা",
          "যোগাযোগ"
        ],

        copyright:
          "© 2026 সিফাত ভুঁইয়া। Crafted with ♥"

      },


      aria: {

        changeLanguage:
          "ভাষা পরিবর্তন",

        whatsapp:
          "WhatsApp-এ যোগাযোগ করুন",

        facebook:
          "Facebook প্রোফাইল খুলুন",

        email:
          "ইমেইল পাঠান",

        linkedin:
          "LinkedIn প্রোফাইল খুলুন",

        resume:
          "সিফাত ভুঁইয়ার রেজুমে খুলুন"

      },


      marquee: [
        "ডিজিটাল মার্কেটিং",
        "গ্রাফিক ডিজাইন",
        "কনটেন্ট ক্রিয়েশন",
        "সোশ্যাল মিডিয়া",
        "ব্র্যান্ড ভিজ্যুয়াল",
        "ক্রিয়েটিভ স্ট্র্যাটেজি"
      ]

    },


    /* =======================================================
       ARABIC
       ======================================================= */

    ar: {

      lang:
        "ar",

      dir:
        "rtl",

      short:
        "عربي",

      title:
        "سيفات بويان — الملف الشخصي",

      description:
        "الملف الشخصي لسيفات بويان — مسوّق رقمي ومصمم جرافيك.",


      nav: [
        "الرئيسية",
        "نبذة عني",
        "التعليم",
        "المسار المهني",
        "المشاريع"
      ],


      hero: {

        availability:
          "متاح للعمل",

        heading:
          `<span class="hero-greeting-line">مرحباً، أنا</span><br /><span class="hero-name-line"><span class="gradient hero-name-vibrant">سيفات بويان</span></span>`,

        lead:
          "أصنع تجارب رقمية إبداعية متخصصة في التسويق الرقمي، صناعة المحتوى، التصميم الجرافيكي، والتصاميم الحديثة لوسائل التواصل الاجتماعي.",

        viewWork:
          "شاهد أعمالي&nbsp;→",

        resume:
          "السيرة الذاتية&nbsp;↗"

      },


      card: {

        role:
          "مسوّق رقمي ومصمم جرافيك",

        specialty:
          "التخصص",

        specialtyValue:
          "التسويق والتصميم",

        location:
          "الموقع",

        locationValue:
          "دكا، بنغلاديش",

        experience:
          "الخبرة",

        experienceValue:
          "مشاريع إبداعية",

        status:
          "الحالة",

        statusValue:
          "● نشط",

        brand:
          "علامة شخصية"

      },


      about: {

        eyebrow:
          "نبذة عني",

        heading:
          `شغوف بـ <span class="gradient">التميز الرقمي</span>`,

        description:
          "أنا مسوّق رقمي ومصمم إبداعي أركز على بناء تجارب رقمية واضحة وجذابة وقوية بصرياً. أدمج استراتيجية التسويق وصناعة المحتوى والتصميم لمساعدة العلامات التجارية على التواصل بشكل أفضل.",

        stats: [
          "مهارات إبداعية",
          "المشاريع والتصاميم",
          "العملاء / التعاونات",
          "الخدمات الأساسية"
        ]

      },


      services: {

        eyebrow:
          "ماذا أقدم",

        heading:
          "خدمات إبداعية تساعد العلامات التجارية على التقدم.",

        description:
          "مجموعة خدمات مركزة تجمع بين التسويق الرقمي والتصميم وصناعة المحتوى ودعم وسائل التواصل.",

        items: [

          [
            "التسويق عبر وسائل التواصل",
            "إعداد الصفحات، تخطيط المحتوى، ودعم نمو وسائل التواصل الاجتماعي."
          ],

          [
            "التصميم الجرافيكي",
            "منشورات، بانرات، صور مصغرة، تصاميم تجارية وأنظمة بصرية."
          ],

          [
            "صناعة المحتوى",
            "أفكار إبداعية، تصاميم إعلانية، نصوص ومحتوى بصري للعلامة التجارية."
          ],

          [
            "الهوية البصرية",
            "أصول هوية نظيفة، تصاميم الحملات وتقديم متناسق."
          ]

        ]

      },


      projects: {

        eyebrow:
          "أعمال مختارة",

        heading:
          `استكشف <span class="gradient">مشاريعي</span>`,

        description:
          "شاهد جميع أعمالي في مكان واحد من خلال مجموعة المشاريع الكاملة.",

        kicker:
          "مجموعة الأعمال الكاملة",

        headingCard:
          "اضغط هنا لمشاهدة جميع المشاريع",

        descriptionCard:
          "شاهد جميع تصاميمي، وأعمال التسويق، ومحتوى وسائل التواصل الاجتماعي والمشاريع الأخرى في مكان واحد.",

        button:
          "جميع المشاريع",

        tags: [
          "تصميم",
          "تسويق",
          "محتوى",
          "إبداع"
        ]

      },


      featured: {

        eyebrow:
          "تركيز على المشاريع المميزة",

        heading:
          "اتجاهات إبداعية مختارة للعلامات التجارية ووسائل التواصل الاجتماعي.",

        description:
          "استكشف بعض فئات المشاريع الأساسية وافتح المجموعة الكاملة لرؤية الأعمال بالتفصيل.",

        cards: [

          [
            "التسويق عبر وسائل التواصل",
            "حملة لوسائل التواصل",
            "تصاميم الصفحات وتخطيط المحتوى والتوجيه الإبداعي الموجّه للنمو.",
            "عرض الأعمال",
            "فتح أعمال حملة وسائل التواصل"
          ],

          [
            "التصميم الجرافيكي",
            "تصميم الهوية البصرية",
            "أصول بصرية نظيفة وتصاميم للحملات وعرض متناسق للعلامة التجارية.",
            "عرض الأعمال",
            "فتح أعمال الهوية البصرية"
          ],

          [
            "صناعة المحتوى",
            "محتوى وتصاميم إعلانية",
            "أفكار إبداعية وتصاميم جاهزة للإعلانات ونصوص وتوجيه للمحتوى الخاص بالعلامة التجارية.",
            "عرض الأعمال",
            "فتح أعمال المحتوى والتصاميم الإعلانية"
          ]

        ]

      },


      career: {

        eyebrow:
          "المسار المهني",

        heading:
          "مساري المهني.",

        items: [

          [
            "المحتوى ووسائل التواصل",
            "عمل مستقل",
            "استكشفت صناعة المحتوى ونمو الصفحات واستراتيجية وسائل التواصل من خلال مشاريع عملية."
          ],

          [
            "ممارسة التصميم الجرافيكي",
            "مشاريع إبداعية",
            "صممت منشورات اجتماعية وبانرات وصوراً مصغرة وشعارات وأصولاً بصرية مختلفة."
          ],

          [
            "التسويق الرقمي والتصميم",
            "عمل حر / مشاريع شخصية",
            "أعمل على الحملات والتصاميم الاجتماعية والمحتوى الإبداعي ومواد العلامات التجارية الرقمية."
          ]

        ]

      },


      education: {

        eyebrow:
          "الخلفية الأكاديمية",

        heading:
          `الخلفية <span class="gradient">الأكاديمية</span>`,

        description:
          "تعلم أكاديمي وتقني يدعم عملي الإبداعي والرقمي.",

        current:
          "حالي",

        completed:
          "مكتمل",

        items: [

          [
            "دبلوم تكنولوجيا الحاسوب",
            "بنغلاديش · تكنولوجيا الحاسوب",
            [
              "أساسيات الحاسوب والتعلم التقني العملي",
              "الأدوات الرقمية وممارسة حل المشكلات",
              "التعلم التقني والمشاريع العملية"
            ]
          ],

          [
            "شهادة الثانوية",
            "بنغلاديش · SSC",
            [
              "إكمال التعليم الثانوي",
              "أساس أكاديمي لمواصلة الدراسة التقنية",
              "الانتقال إلى الدبلوم وتطوير المهارات المهنية"
            ]
          ]

        ]

      },


      skills: {

        eyebrow:
          "الخبرات والمهارات",

        heading:
          "ما أقدمه من مهارات.",

        arsenal:
          "المهارات التقنية والإبداعية",

        traits:
          "الصفات المهنية",

        traitsItems: [
          "التفكير الإبداعي",
          "حل المشكلات",
          "استراتيجية المحتوى",
          "السرد البصري",
          "اتساق العلامة التجارية",
          "التواصل مع العملاء"
        ],

        learner:
          "متعلم باستمرار",

        learnerText:
          "أتعلم باستمرار أدوات جديدة وأساليب إبداعية وتقنيات التسويق الرقمي وأنظمة التصميم."

      },


      testimonials: {

        eyebrow:
          "آراء العملاء",

        heading:
          "الأشخاص الذين عملت معهم.",

        clients: [
          "العميل",
          "شريك إبداعي"
        ],

        roles: [
          "نشاط / علامة تجارية",
          "تعاون إبداعي"
        ],

        texts: [

          "مبدع وسريع الاستجابة وسهل التواصل معه. تم تسليم التصاميم بشكل نظيف وتوافقت جيداً مع التوجيه.",

          "اهتمام قوي بالتفاصيل وفهم جيد جداً لأسلوب العرض الحديث على وسائل التواصل الاجتماعي. سأعمل معه مرة أخرى."

        ]

      },


      contact: {

        eyebrow:
          "لنتواصل",

        heading:
          "هل لديك مشروع في ذهنك؟",

        description:
          "لنتحدث عن حملتك القادمة أو احتياجك التصميمي أو مشروعك الرقمي.",

        labels: [
          "واتساب",
          "فيسبوك",
          "البريد الإلكتروني",
          "لينكدإن",
          "الموقع"
        ],

        values: [
          "01828157751",
          "فتح الملف ↗",
          "ksefat94@gmail.com",
          "عرض الملف ↗",
          "دكا، بنغلاديش"
        ],

        name:
          "اسمك",

        email:
          "البريد الإلكتروني",

        subject:
          "الموضوع",

        message:
          "اكتب رسالتك...",

        send:
          "إرسال الرسالة&nbsp;→"

      },


      footer: {

        role:
          "مسوّق رقمي • مصمم",

        back:
          "العودة إلى الأعلى ↑",

        nav: [
          "الرئيسية",
          "نبذة عني",
          "المسار المهني",
          "المشاريع",
          "التعليم",
          "التواصل"
        ],

        copyright:
          "© 2026 سيفات بويان. صُنع بكل حب ♥"

      },


      aria: {

        changeLanguage:
          "تغيير اللغة",

        whatsapp:
          "التواصل عبر واتساب",

        facebook:
          "فتح ملف فيسبوك",

        email:
          "إرسال بريد إلكتروني",

        linkedin:
          "فتح ملف لينكدإن",

        resume:
          "فتح السيرة الذاتية لسيفات بويان"

      },


      marquee: [
        "التسويق الرقمي",
        "التصميم الجرافيكي",
        "صناعة المحتوى",
        "وسائل التواصل الاجتماعي",
        "الهوية البصرية",
        "الاستراتيجية الإبداعية"
      ]

    }

  };


  /* =========================================================
     META HELPER
     ========================================================= */

  function ensureMeta(
    attribute,
    key,
    content
  ) {

    let meta =
      document.querySelector(
        `meta[${attribute}="${key}"]`
      );


    if (
      !meta
    ) {

      meta =
        document.createElement(
          "meta"
        );


      meta.setAttribute(
        attribute,
        key
      );


      document.head.appendChild(
        meta
      );

    }


    meta.setAttribute(
      "content",
      content
    );

  }


  /* =========================================================
     LANGUAGE HELPERS
     ========================================================= */

  function setText(
    selector,
    value
  ) {

    const element =
      $(selector);


    if (
      element
    ) {

      element.textContent =
        value;

    }

  }


  function setHTML(
    selector,
    value
  ) {

    const element =
      $(selector);


    if (
      element
    ) {

      element.innerHTML =
        value;

    }

  }


  function setAttr(
    selector,
    attribute,
    value
  ) {

    const element =
      $(selector);


    if (
      element
    ) {

      element.setAttribute(
        attribute,
        value
      );

    }

  }


  function setTextFromElement(
    element,
    value
  ) {

    if (
      element
    ) {

      element.textContent =
        value;

    }

  }


  /* =========================================================
     FEATURED PROJECT LANGUAGE
     ========================================================= */

  function applyFeaturedProjects(
    data
  ) {

    if (
      !data ||
      !data.featured
    ) {

      return;

    }


    setText(
      "#featuredProjectsEyebrow",
      data.featured.eyebrow
    );


    setText(
      "#featuredProjectsHeading",
      data.featured.heading
    );


    setText(
      "#featuredProjectsDescription",
      data.featured.description
    );


    const cards =
      $$("#featuredProjects .featured-project-card");


    data.featured.cards.forEach(
      (
        item,
        index
      ) => {

        const card =
          cards[index];


        if (
          !card
        ) {

          return;

        }


        const category =
          $(".featured-project-category", card);


        const heading =
          $("h4", card);


        const description =
          $(".featured-project-body > p", card);


        const linkText =
          $(".featured-project-link span:first-child", card);


        const link =
          $(".featured-project-link", card);


        setTextFromElement(
          category,
          item[0]
        );


        setTextFromElement(
          heading,
          item[1]
        );


        setTextFromElement(
          description,
          item[2]
        );


        setTextFromElement(
          linkText,
          item[3]
        );


        if (
          link
        ) {

          link.setAttribute(
            "aria-label",
            item[4]
          );

        }

      }
    );

  }


  /* =========================================================
     APPLY LANGUAGE
     ========================================================= */

  function applyLanguage(
    language
  ) {

    const data =
      languageData[language] ||
      languageData.en;


    document.documentElement.lang =
      data.lang;


    document.documentElement.dir =
      data.dir;


    document.title =
      data.title;


    setAttr(
      'meta[name="description"]',
      "content",
      data.description
    );


    ensureMeta(
      "property",
      "og:title",
      data.title
    );


    ensureMeta(
      "property",
      "og:description",
      data.description
    );


    ensureMeta(
      "name",
      "twitter:title",
      data.title
    );


    ensureMeta(
      "name",
      "twitter:description",
      data.description
    );


    if (
      languageCurrent
    ) {

      languageCurrent.textContent =
        data.short;

    }


    if (
      languageToggle
    ) {

      languageToggle.setAttribute(
        "aria-label",
        data.aria.changeLanguage
      );


      languageToggle.setAttribute(
        "title",
        data.aria.changeLanguage
      );

    }


    /* ---------- Navbar ---------- */

    const navLinks =
      $$(".nav a");


    data.nav.forEach(
      (
        value,
        index
      ) => {

        if (
          navLinks[index]
        ) {

          navLinks[index].textContent =
            value;

        }

      }
    );


    /* ---------- Hero ---------- */

    const pillEl = $("#home .pill");
    if (pillEl) {
      pillEl.innerHTML = `<span class="dot"></span>${data.hero.availability}`;
    }


    setHTML(
      "#home h1",
      data.hero.heading
    );


    if (window.updateLeadTypewriterTarget) {
      window.updateLeadTypewriterTarget(data.hero.lead);
    } else {
      const leadText = $("#leadTypingText");
      if (leadText) {
        leadText.textContent = data.hero.lead;
      } else {
        setText(
          "#home .lead",
          data.hero.lead
        );
      }
    }


    const heroPrimaryLabel = $("#home .btn.primary .label");
    if (heroPrimaryLabel) {
      heroPrimaryLabel.textContent = data.hero.viewWork.replace(/&nbsp;→|→/g, "").trim();
    } else {
      setHTML(
        "#home .btn.primary",
        data.hero.viewWork
      );
    }


    const resumeLabel = $("#resumeBtn .label");
    if (resumeLabel) {
      resumeLabel.textContent = data.hero.resume.replace(/&nbsp;↗|↗/g, "").trim();
    } else {
      setHTML(
        "#resumeBtn",
        data.hero.resume
      );
    }


    setAttr(
      "#resumeBtn",
      "aria-label",
      data.aria.resume
    );


    setAttr(
      "#resumeBtn",
      "title",
      data.aria.resume
    );


    /* ---------- Hero Card ---------- */

    setText(
      ".card-role",
      data.card.role
    );


    const cardLabels =
      $$(".card-grid .label");


    const cardValues =
      $$(".card-grid .value");


    const cardLabelData = [

      data.card.specialty,

      data.card.location,

      data.card.experience,

      data.card.status

    ];


    const cardValueData = [

      data.card.specialtyValue,

      data.card.locationValue,

      data.card.experienceValue,

      data.card.statusValue

    ];


    cardLabelData.forEach(
      (
        value,
        index
      ) => {

        if (
          cardLabels[index]
        ) {

          cardLabels[index].textContent =
            value;

        }

      }
    );


    cardValueData.forEach(
      (
        value,
        index
      ) => {

        if (
          cardValues[index]
        ) {

          cardValues[index].textContent =
            value;

        }

      }
    );


    setText(
      ".barcode-brand",
      data.card.brand
    );


    /* ---------- About ---------- */

    setText(
      "#about .eyebrow",
      data.about.eyebrow
    );


    setHTML(
      "#about h2",
      data.about.heading
    );


    setText(
      "#about .section-desc",
      data.about.description
    );


    const statLabels =
      $$("#about .stat > span");


    data.about.stats.forEach(
      (
        value,
        index
      ) => {

        if (
          statLabels[index]
        ) {

          statLabels[index].textContent =
            value;

        }

      }
    );


    /* ---------- Services ---------- */

    setText(
      "#services .eyebrow",
      data.services.eyebrow
    );


    setText(
      "#services h2",
      data.services.heading
    );


    setText(
      "#services .section-desc",
      data.services.description
    );


    const serviceCards =
      $$("#services .service");


    data.services.items.forEach(
      (
        item,
        index
      ) => {

        const card =
          serviceCards[index];


        if (
          !card
        ) {

          return;

        }


        setTextFromElement(
          $("h3", card),
          item[0]
        );


        setTextFromElement(
          $("p", card),
          item[1]
        );

      }
    );


    /* ---------- Projects ---------- */

    setText(
      "#projects .eyebrow",
      data.projects.eyebrow
    );


    setHTML(
      "#projects .section-head h2",
      data.projects.heading
    );


    setText(
      "#projects .section-head .section-desc",
      data.projects.description
    );


    setText(
      "#projects .all-projects-kicker",
      data.projects.kicker
    );


    setText(
      "#projects .all-projects-copy h3",
      data.projects.headingCard
    );


    setText(
      "#projects .all-projects-copy p",
      data.projects.descriptionCard
    );


    setText(
      "#projects .all-projects-btn span:first-child",
      data.projects.button
    );


    const projectTags =
      $$("#projects .all-projects-tags span");


    data.projects.tags.forEach(
      (
        value,
        index
      ) => {

        if (
          projectTags[index]
        ) {

          projectTags[index].textContent =
            value;

        }

      }
    );


    applyFeaturedProjects(
      data
    );


    /* ---------- Career ---------- */

    setText(
      "#career .eyebrow",
      data.career.eyebrow
    );


    setText(
      "#career .section-head h2",
      data.career.heading
    );


    const careerItems =
      $$("#career .timeline-item");


    data.career.items.forEach(
      (
        item,
        index
      ) => {

        const card =
          careerItems[index];


        if (
          !card
        ) {

          return;

        }


        setTextFromElement(
          $("h3", card),
          item[0]
        );


        setTextFromElement(
          $(".company", card),
          item[1]
        );


        setTextFromElement(
          $("p", card),
          item[2]
        );

      }
    );


    /* ---------- Education ---------- */

    setText(
      "#education .eyebrow",
      data.education.eyebrow
    );


    setHTML(
      "#education .section-head h2",
      data.education.heading
    );


    setText(
      "#education .section-head .section-desc",
      data.education.description
    );


    const educationCards =
      $$("#education .edu-card");


    data.education.items.forEach(
      (
        item,
        index
      ) => {

        const card =
          educationCards[index];


        if (
          !card
        ) {

          return;

        }


        setTextFromElement(
          $(".tag", card),
          index === 0
            ? data.education.current
            : data.education.completed
        );


        setTextFromElement(
          $("h3", card),
          item[0]
        );


        const metaText = $(".meta-text", card);
        if (metaText) {
          metaText.textContent = item[1];
        } else {
          setTextFromElement(
            $(".meta", card),
            item[1]
          );
        }


        const listItems =
          $$("li", card);


        item[2].forEach(
          (
            value,
            itemIndex
          ) => {

            if (
              listItems[itemIndex]
            ) {

              listItems[itemIndex].textContent =
                value;

            }

          }
        );

      }
    );


    /* ---------- Skills ---------- */

    setText(
      "#skills .eyebrow",
      data.skills.eyebrow
    );


    setText(
      "#skills .section-head h2",
      data.skills.heading
    );


    setText(
      "#skills .skill-card:first-child h3",
      data.skills.arsenal
    );


    setText(
      "#skills .skill-card:nth-child(2) h3",
      data.skills.traits
    );


    const skillChips =
      $$("#skills .skill-card:nth-child(2) .chip");


    data.skills.traitsItems.forEach(
      (
        value,
        index
      ) => {

        if (
          skillChips[index]
        ) {

          skillChips[index].textContent =
            value;

        }

      }
    );


    const learnerBlock =
      $("#skills .skill-card:nth-child(2) > div:last-child");


    if (
      learnerBlock
    ) {

      setTextFromElement(
        $("b", learnerBlock),
        data.skills.learner
      );


      if (typeof window.updateLearnerTypewriterTarget === "function") {
        window.updateLearnerTypewriterTarget(data.skills.learnerText);
      } else {
        const typingEl = $("#learnerTypingText");
        if (typingEl) {
          typingEl.textContent = data.skills.learnerText;
        } else {
          setTextFromElement(
            $("p", learnerBlock),
            data.skills.learnerText
          );
        }
      }

    }


    /* ---------- Testimonials ---------- */

    setText(
      "#testimonials .eyebrow",
      data.testimonials.eyebrow
    );


    setText(
      "#testimonials .section-head h2",
      data.testimonials.heading
    );


    const testimonialCards =
      $$("#testimonials .testimonial");


    data.testimonials.texts.forEach(
      (
        value,
        index
      ) => {

        const card =
          testimonialCards[index];


        if (
          !card
        ) {

          return;

        }


        setTextFromElement(
          card.querySelector(
            ":scope > p"
          ),
          value
        );


        const nameText = card.querySelector(".person-name-text");
        if (nameText) {
          nameText.textContent = data.testimonials.clients[index];
        } else {
          setTextFromElement(
            card.querySelector(
              ".person b"
            ),
            data.testimonials.clients[index]
          );
        }


        const roleEl = card.querySelector(".person-role") ||
          card.querySelector(".person > div:last-child > div");
        if (roleEl) {
          roleEl.textContent = data.testimonials.roles[index];
        }

      }
    );


    /* ---------- Contact ---------- */

    setText(
      "#contact .eyebrow",
      data.contact.eyebrow
    );


    setText(
      "#contact h2",
      data.contact.heading
    );


    setText(
      "#contact .section-desc",
      data.contact.description
    );


    const contactLabels =
      $$("#contact .contact-channel-name");


    const contactValues =
      $$("#contact .contact-channel-val");


    data.contact.labels.forEach(
      (
        value,
        index
      ) => {

        if (
          contactLabels[index]
        ) {

          contactLabels[index].textContent =
            value;

        }

      }
    );


    data.contact.values.forEach(
      (
        value,
        index
      ) => {

        if (
          contactValues[index]
        ) {

          contactValues[index].textContent =
            value;

        }

      }
    );


    const form =
      $("#contactForm");


    if (
      form
    ) {

      const nameInput =
        form.querySelector(
          'input[name="name"]'
        );


      const emailInput =
        form.querySelector(
          'input[name="email"]'
        );


      const subjectInput =
        form.querySelector(
          'input[name="subject"]'
        );


      const messageInput =
        form.querySelector(
          'textarea[name="message"]'
        );


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      if (
        nameInput
      ) {

        nameInput.placeholder =
          data.contact.name;

      }


      if (
        emailInput
      ) {

        emailInput.placeholder =
          data.contact.email;

      }


      if (
        subjectInput
      ) {

        subjectInput.placeholder =
          data.contact.subject;

      }


      if (
        messageInput
      ) {

        messageInput.placeholder =
          data.contact.message;

      }


      if (
        submitButton
      ) {

        const label =
          submitButton.querySelector(
            '.ignition-label'
          ) || submitButton;

        label.innerHTML =
          data.contact.send;

      }

    }


    /* ---------- Social aria ---------- */

    setAttr(
      "#socialWhatsApp",
      "aria-label",
      data.aria.whatsapp
    );


    setAttr(
      "#socialFacebook",
      "aria-label",
      data.aria.facebook
    );


    setAttr(
      "#socialEmail",
      "aria-label",
      data.aria.email
    );


    setAttr(
      "#socialLinkedIn",
      "aria-label",
      data.aria.linkedin
    );


    /* ---------- Footer ---------- */

    setText(
      "footer .brand small",
      data.footer.role
    );


    const backBtn = $("footer .footer-top > .btn");
    if (backBtn) {
      const topLabel = $(".btn-top-label", backBtn);
      if (topLabel) {
        topLabel.textContent = data.footer.back.replace(/&nbsp;↑|↑/g, "").trim();
      } else {
        setTextFromElement(backBtn, data.footer.back);
      }
    }


    const footerLinks =
      $$("footer .footer-nav a");


    data.footer.nav.forEach(
      (
        value,
        index
      ) => {

        if (
          footerLinks[index]
        ) {

          footerLinks[index].textContent =
            value;

        }

      }
    );


    setText(
      "footer .copyright",
      data.footer.copyright
    );


    /* ---------- Marquee ---------- */

    renderMarquee(
      data.marquee
    );


    /* ---------- Save ---------- */

    localStorage.setItem(
      "sb-language",
      language
    );


    /* ---------- Active option ---------- */

    languageOptions.forEach(
      (
        option
      ) => {

        option.classList.toggle(
          "active",
          option.dataset.lang ===
            language
        );

      }
    );

  }


  /* =========================================================
     LANGUAGE MENU EVENTS
     ========================================================= */

  if (
    languageSwitcher &&
    languageToggle &&
    languageMenu
  ) {

    languageToggle.addEventListener(
      "click",
      (
        event
      ) => {

        event.stopPropagation();


        const isOpen =
          languageSwitcher.classList.toggle(
            "open"
          );


        languageToggle.setAttribute(
          "aria-expanded",
          String(
            isOpen
          )
        );

      }
    );


    languageOptions.forEach(
      (
        option
      ) => {

        option.addEventListener(
          "click",
          () => {

            const language =
              option.dataset.lang;


            applyLanguage(
              language
            );


            languageSwitcher.classList.remove(
              "open"
            );


            languageToggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );


    document.addEventListener(
      "click",
      (
        event
      ) => {

        if (
          !languageSwitcher.contains(
            event.target
          )
        ) {

          languageSwitcher.classList.remove(
            "open"
          );


          languageToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );


    document.addEventListener(
      "keydown",
      (
        event
      ) => {

        if (
          event.key ===
          "Escape"
        ) {

          languageSwitcher.classList.remove(
            "open"
          );


          languageToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }


  /* =========================================================
     INITIAL LANGUAGE
     ========================================================= */

  const savedLanguage =
    localStorage.getItem(
      "sb-language"
    ) || "en";


  applyLanguage(
    savedLanguage
  );


  /* =========================================================
     SCROLL REVEAL
     Compatible with .reveal-ready in style.css
     ========================================================= */

  const revealElements =
    $$(
      `
      .section,
      .about-copy,
      .stats,
      .stat,
      .service,
      .project,
      .timeline-item,
      .edu-card,
      .skill-card,
      .testimonial,
      .contact,
      footer .footer-top
      `
    );


  revealElements.forEach(
    (
      element,
      index
    ) => {

      element.classList.add(
        "reveal-ready"
      );


      if (
        !prefersReducedMotion
      ) {

        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(
            index * 35,
            280
          )}ms`
        );

      }

    }
  );


  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {

    const revealObserver =
      new IntersectionObserver(
        (
          entries,
          observer
        ) => {

          entries.forEach(
            (
              entry
            ) => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }


              entry.target.classList.add(
                "in-view"
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:
            0.12,

          rootMargin:
            "0px 0px -50px 0px"
        }
      );


    revealElements.forEach(
      (
        element
      ) => {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      (
        element
      ) => {

        element.classList.add(
          "in-view"
        );

      }
    );

  }


  /* =========================================================
     GENERAL CARD TILT
     ========================================================= */

  if (
    hasFinePointer &&
    !prefersReducedMotion
  ) {

    const tiltCards =
      $$(
        `
        .service,
        .project,
        .edu-card,
        .testimonial,
        .stat
        `
      );


    tiltCards.forEach(
      (
        card
      ) => {

        card.addEventListener(
          "pointermove",
          (
            event
          ) => {

            const rect =
              card.getBoundingClientRect();


            if (
              !rect.width ||
              !rect.height
            ) {

              return;

            }


            const x =
              (
                (
                  event.clientX -
                  rect.left
                ) /
                rect.width
              ) -
              0.5;


            const y =
              (
                (
                  event.clientY -
                  rect.top
                ) /
                rect.height
              ) -
              0.5;


            const rotateX =
              -y * 5;


            const rotateY =
              x * 5;


            card.style.transform =
              `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;

          },
          {
            passive: true
          }
        );


        card.addEventListener(
          "pointerleave",
          () => {

            card.style.transform =
              "";

          }
        );

      }
    );

  }


  /* =========================================================
     SKILL BAR ANIMATION
     ========================================================= */

  const skillCards =
    $$(".skill-card");


  function animateSkillCard(
    card
  ) {

    const rows =
      $$(".skill-row", card);


    card.classList.add(
      "in-view"
    );


    rows.forEach(
      (
        row
      ) => {

        const bar =
          $(".bar span", row);


        const percentage =
          $("strong", row);


        if (
          !bar ||
          !percentage
        ) {

          return;

        }


        bar.style.setProperty(
          "--skill-width",
          percentage.textContent.trim()
        );

      }
    );

  }


  if (
    "IntersectionObserver" in window
  ) {

    const skillObserver =
      new IntersectionObserver(
        (
          entries,
          observer
        ) => {

          entries.forEach(
            (
              entry
            ) => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }


              animateSkillCard(
                entry.target
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:
            0.2
        }
      );


    skillCards.forEach(
      (
        card
      ) => {

        skillObserver.observe(
          card
        );

      }
    );

  } else {

    skillCards.forEach(
      animateSkillCard
    );

  }


  /* =========================================================
     ARSENAL SPOTLIGHT
     ========================================================= */

  const arsenalCard =
    $(".skill-wrap .skill-card:first-child");


  if (
    arsenalCard &&
    hasFinePointer &&
    !prefersReducedMotion
  ) {

    let targetX =
      50;


    let targetY =
      50;


    let currentX =
      50;


    let currentY =
      50;


    let spotlightFrame =
      0;


    function animateArsenalSpotlight() {

      currentX +=
        (
          targetX -
          currentX
        ) * 0.12;


      currentY +=
        (
          targetY -
          currentY
        ) * 0.12;


      arsenalCard.style.setProperty(
        "--card-mx",
        `${currentX}%`
      );


      arsenalCard.style.setProperty(
        "--card-my",
        `${currentY}%`
      );


      if (
        Math.abs(
          targetX -
          currentX
        ) > 0.1 ||
        Math.abs(
          targetY -
          currentY
        ) > 0.1
      ) {

        spotlightFrame =
          requestAnimationFrame(
            animateArsenalSpotlight
          );

      } else {

        spotlightFrame =
          0;

      }

    }


    arsenalCard.addEventListener(
      "pointermove",
      (
        event
      ) => {

        const rect =
          arsenalCard.getBoundingClientRect();


        if (
          !rect.width ||
          !rect.height
        ) {

          return;

        }


        targetX =
          (
            (
              event.clientX -
              rect.left
            ) /
            rect.width
          ) * 100;


        targetY =
          (
            (
              event.clientY -
              rect.top
            ) /
            rect.height
          ) * 100;


        if (
          !spotlightFrame
        ) {

          spotlightFrame =
            requestAnimationFrame(
              animateArsenalSpotlight
            );

        }

      },
      {
        passive: true
      }
    );


    arsenalCard.addEventListener(
      "pointerleave",
      () => {

        targetX =
          50;


        targetY =
          50;

      }
    );

  }


  /* =========================================================
     MAIN PROJECT CTA CARD
     ========================================================= */

  const projectShowcase =
    $(".all-projects-card");


  if (
    projectShowcase
  ) {

    if (
      "IntersectionObserver" in window &&
      !prefersReducedMotion
    ) {

      const projectObserver =
        new IntersectionObserver(
          (
            entries,
            observer
          ) => {

            entries.forEach(
              (
                entry
              ) => {

                if (
                  !entry.isIntersecting
                ) {

                  return;

                }


                entry.target.classList.add(
                  "is-visible"
                );


                observer.unobserve(
                  entry.target
                );

              }
            );

          },
          {
            threshold:
              0.18,

            rootMargin:
              "0px 0px -60px 0px"
          }
        );


      projectObserver.observe(
        projectShowcase
      );

    } else {

      projectShowcase.classList.add(
        "is-visible"
      );

    }


    if (
      hasFinePointer &&
      !prefersReducedMotion
    ) {

      projectShowcase.addEventListener(
        "pointermove",
        (
          event
        ) => {

          const rect =
            projectShowcase.getBoundingClientRect();


          if (
            !rect.width ||
            !rect.height
          ) {

            return;

          }


          const x =
            (
              (
                event.clientX -
                rect.left
              ) /
              rect.width
            ) -
            0.5;


          const y =
            (
              (
                event.clientY -
                rect.top
              ) /
              rect.height
            ) -
            0.5;


          projectShowcase.style.transform =
            `translateY(0) scale(1) perspective(1100px) rotateX(${(
              -y * 3.2
            ).toFixed(2)}deg) rotateY(${(
              x * 3.2
            ).toFixed(2)}deg)`;

        },
        {
          passive: true
        }
      );


      projectShowcase.addEventListener(
        "pointerleave",
        () => {

          projectShowcase.style.transform =
            "";

        }
      );

    }

  }


  /* =========================================================
     FEATURED PROJECT CARDS
     ========================================================= */

  const featuredCards =
    $$("#featuredProjects .featured-project-card");


  if (
    featuredCards.length
  ) {

    if (
      "IntersectionObserver" in window &&
      !prefersReducedMotion
    ) {

      const featuredObserver =
        new IntersectionObserver(
          (
            entries,
            observer
          ) => {

            entries.forEach(
              (
                entry
              ) => {

                if (
                  !entry.isIntersecting
                ) {

                  return;

                }


                entry.target.classList.add(
                  "is-visible"
                );


                observer.unobserve(
                  entry.target
                );

              }
            );

          },
          {
            threshold:
              0.12,

            rootMargin:
              "0px 0px -50px 0px"
          }
        );


      featuredCards.forEach(
        (
          card
        ) => {

          featuredObserver.observe(
            card
          );

        }
      );

    } else {

      featuredCards.forEach(
        (
          card
        ) => {

          card.classList.add(
            "is-visible"
          );

        }
      );

    }


    if (
      hasFinePointer &&
      !prefersReducedMotion
    ) {

      featuredCards.forEach(
        (
          card
        ) => {

          card.addEventListener(
            "pointermove",
            (
              event
            ) => {

              const rect =
                card.getBoundingClientRect();


              if (
                !rect.width ||
                !rect.height
              ) {

                return;

              }


              const x =
                (
                  (
                    event.clientX -
                    rect.left
                  ) /
                  rect.width
                ) * 100;


              const y =
                (
                  (
                    event.clientY -
                    rect.top
                  ) /
                  rect.height
                ) * 100;


              card.style.setProperty(
                "--project-mx",
                `${x}%`
              );


              card.style.setProperty(
                "--project-my",
                `${y}%`
              );

            },
            {
              passive: true
            }
          );


          card.addEventListener(
            "pointerleave",
            () => {

              card.style.removeProperty(
                "--project-mx"
              );


              card.style.removeProperty(
                "--project-my"
              );

            }
          );

        }
      );

    }

  }


  /* =========================================================
     NAVIGATION ACTIVE STATE
     ========================================================= */

  const navigationLinks =
    $$(".nav a, .quicknav a");


  const pageSections =
    $$("main section[id]");


  if (
    "IntersectionObserver" in window
  ) {

    const navigationObserver =
      new IntersectionObserver(
        (
          entries
        ) => {

          entries.forEach(
            (
              entry
            ) => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }


              const sectionId =
                entry.target.id;


              navigationLinks.forEach(
                (
                  link
                ) => {

                  const href =
                    link.getAttribute(
                      "href"
                    );


                  const active =
                    href ===
                      `#${sectionId}` ||
                    (
                      sectionId ===
                        "home" &&
                      href ===
                        "#top"
                    );


                  link.classList.toggle(
                    "active",
                    active
                  );

                }
              );

            }
          );

        },
        {
          rootMargin:
            "-35% 0px -55% 0px"
        }
      );


    pageSections.forEach(
      (
        section
      ) => {

        navigationObserver.observe(
          section
        );

      }
    );

  }


  /* =========================================================
     SMOOTH ANCHOR SCROLL
     ========================================================= */

  $$(
    'a[href^="#"]'
  ).forEach(
    (
      link
    ) => {

      link.addEventListener(
        "click",
        (
          event
        ) => {

          const targetId =
            link.getAttribute(
              "href"
            );


          if (
            !targetId ||
            targetId === "#"
          ) {

            return;

          }


          const target =
            targetId === "#top"
              ? document.body
              : $(targetId);


          if (
            !target
          ) {

            return;

          }


          event.preventDefault();


          target.scrollIntoView(
            {
              behavior:
                prefersReducedMotion
                  ? "auto"
                  : "smooth",

              block:
                "start"
            }
          );

        }
      );

    }
  );


  /* =========================================================
     CONTACT FORM
     ========================================================= */

  const contactForm =
    $("#contactForm");


  if (
    contactForm
  ) {

    const emailInput =
      contactForm.querySelector(
        'input[name="email"]'
      );


    const replyToField =
      contactForm.querySelector(
        'input[name="_replyto"]'
      );


    const submitButton =
      contactForm.querySelector(
        'button[type="submit"]'
      );


    if (
      emailInput &&
      replyToField
    ) {

      emailInput.addEventListener(
        "input",
        () => {

          replyToField.value =
            emailInput.value.trim();


          emailInput.setCustomValidity(
            ""
          );

        }
      );


      emailInput.addEventListener(
        "blur",
        () => {

          const value =
            emailInput.value.trim();


          if (
            value &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              value
            )
          ) {

            emailInput.setCustomValidity(
              "Please enter a valid email address."
            );

          } else {

            emailInput.setCustomValidity(
              ""
            );

          }

        }
      );

    }


    contactForm.addEventListener(
      "submit",
      () => {

        if (
          !submitButton
        ) {

          return;

        }


        submitButton.setAttribute(
          "aria-busy",
          "true"
        );


        submitButton.disabled =
          true;


        const label =
          submitButton.querySelector(
            '.ignition-label'
          ) || submitButton;

        label.innerHTML =
          "Sending...";

      }
    );


    contactForm.addEventListener(
      "invalid",
      () => {

        const notice =
          $("#formNotice");


        if (
          !notice
        ) {

          return;

        }


        notice.textContent =
          "Please check the highlighted fields and try again.";

      },
      true
    );

  }


  /* =========================================================
     RESUME BUTTON
     ========================================================= */

  const resumeButton =
    $("#resumeBtn");


  if (
    resumeButton
  ) {

    


    resumeButton.target =
      "_blank";


    resumeButton.rel =
      "noopener noreferrer";


    const activeLanguage =
      localStorage.getItem(
        "sb-language"
      ) || "en";


    const activeData =
      languageData[
        activeLanguage
      ] ||
      languageData.en;


    resumeButton.setAttribute(
      "aria-label",
      activeData.aria.resume
    );


    resumeButton.setAttribute(
      "title",
      activeData.aria.resume
    );

  }


  /* =========================================================
     STEP 6 — SEO / SOCIAL META
     ========================================================= */

  ensureMeta(
    "name",
    "author",
    "Sefat Bhuiyan"
  );


  ensureMeta(
    "name",
    "robots",
    "index, follow"
  );


  ensureMeta(
    "property",
    "og:type",
    "website"
  );


  ensureMeta(
    "property",
    "og:site_name",
    "Sefat Bhuiyan — Portfolio"
  );


  ensureMeta(
    "property",
    "og:title",
    "Sefat Bhuiyan — Digital Marketer & Graphic Designer"
  );


  ensureMeta(
    "property",
    "og:description",
    "Personal portfolio of Sefat Bhuiyan — Digital Marketing, Graphic Design, Content Creation and Social Media."
  );


  ensureMeta(
    "name",
    "twitter:card",
    "summary_large_image"
  );


  ensureMeta(
    "name",
    "twitter:title",
    "Sefat Bhuiyan — Digital Marketer & Graphic Designer"
  );


  ensureMeta(
    "name",
    "twitter:description",
    "Digital Marketer & Graphic Designer portfolio."
  );


  /* =========================================================
     STEP 7 — IMAGE PERFORMANCE
     ========================================================= */

  const portfolioImages =
    $$("img");


  portfolioImages.forEach(
    (
      image
    ) => {

      image.decoding =
        "async";


      if (
        image.classList.contains(
          "portrait"
        )
      ) {

        image.loading =
          "eager";


        image.fetchPriority =
          "high";

      } else {

        image.loading =
          "lazy";


        image.fetchPriority =
          "low";

      }

    }
  );


  /* =========================================================
     STEP 8 — ACCESSIBILITY
     ========================================================= */

  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach(
      (
        link
      ) => {

        const rel =
          new Set(
            (
              link.getAttribute(
                "rel"
              ) ||
              ""
            )
              .split(
                /\s+/
              )
              .filter(
                Boolean
              )
          );


        rel.add(
          "noopener"
        );


        rel.add(
          "noreferrer"
        );


        link.setAttribute(
          "rel",
          [
            ...rel
          ].join(" ")
        );

      }
    );


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  const mobileNav =
    $(".nav");


  const menuToggle =
    $("#menuToggle");


  const topbar =
    $(".topbar");


  if (
    mobileNav &&
    !mobileNav.id
  ) {

    mobileNav.id =
      "mobileNavigation";

  }


  if (
    menuToggle
  ) {

    menuToggle.setAttribute(
      "aria-controls",
      "mobileNavigation"
    );

  }


  if (
    menuToggle &&
    topbar
  ) {

    const mobileNavLinks =
      $$(".nav a");


    function closeMobileMenu() {

      topbar.classList.remove(
        "mobile-open"
      );


      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );


      menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    }


    menuToggle.addEventListener(
      "click",
      (
        event
      ) => {

        event.stopPropagation();


        const isOpen =
          topbar.classList.toggle(
            "mobile-open"
          );


        menuToggle.setAttribute(
          "aria-expanded",
          String(
            isOpen
          )
        );


        menuToggle.setAttribute(
          "aria-label",
          isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        );

      }
    );


    mobileNavLinks.forEach(
      (
        link
      ) => {

        link.addEventListener(
          "click",
          closeMobileMenu
        );

      }
    );


    document.addEventListener(
      "click",
      (
        event
      ) => {

        if (
          !topbar.contains(
            event.target
          )
        ) {

          closeMobileMenu();

        }

      }
    );


    document.addEventListener(
      "keydown",
      (
        event
      ) => {

        if (
          event.key ===
          "Escape"
        ) {

          closeMobileMenu();

        }

      }
    );

  }


  /* =========================================================
     PAGE VISIBILITY PERFORMANCE
     ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      document.documentElement.classList.toggle(
        "page-hidden",
        document.hidden
      );

    }
  );


  /* =========================================================
     CONTENT CLEANUP
     ========================================================= */

  $$("#education .section-desc").forEach(
    (
      element
    ) => {

      const value =
        element.textContent.trim();


      if (
        value ===
        "Replace these education entries with your exact study history later."
      ) {

        element.textContent =
          "Academic and technical learning that supports my creative and digital work.";

      }

    }
  );


  $$(".testimonials .person b").forEach(
    (
      element,
      index
    ) => {

      if (
        element.textContent.trim() ===
        "Client Name"
      ) {

        element.textContent =
          index === 0
            ? "Client"
            : "Creative Partner";

      }

    }
  );


  /* =========================================================
     FINAL EXACT BANGLA NAME
     ========================================================= */

  languageData.bn.title =
    "সিফাত ভুঁইয়া — পোর্টফোলিও";


  languageData.bn.description =
    "সিফাত ভুঁইয়ার ব্যক্তিগত পোর্টফোলিও — ডিজিটাল মার্কেটার ও গ্রাফিক ডিজাইনার।";


  languageData.bn.hero.heading =
    `<span class="hero-greeting-line">হাই, আমি</span><br /><span class="hero-name-line"><span class="gradient hero-name-vibrant">সিফাত ভুঁইয়া</span></span>`;


  languageData.bn.footer.copyright =
    "© 2026 সিফাত ভুঁইয়া। Crafted with ♥";


  languageData.bn.aria.resume =
    "সিফাত ভুঁইয়ার রেজুমে খুলুন";


  /* =========================================================
     RE-APPLY FINAL LANGUAGE
     ========================================================= */

  applyLanguage(
    localStorage.getItem(
      "sb-language"
    ) || "en"
  );


  /* =========================================================
     RESIZE
     ========================================================= */

  window.addEventListener(
    "resize",
    updateScrollProgress,
    {
      passive: true
    }
  );


  /* =========================================================
     THREEUI: SHADERBUTTONS — VARIANT: IGNITION (ignition-button)
     Raw WebGL Hyperspace Warp & Flash Engine
     Adapted to Portfolio Theme: Electric Cyan / Neon Violet
     ========================================================= */

  function initIgnitionShaderButton() {
    const btn = document.getElementById('contactSubmitBtn');
    const canvas = document.getElementById('ignition-gl');
    if (!btn || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported for ignition button');
      return;
    }

    const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FS = [
      'precision highp float;',
      'uniform vec2 u_res;',
      'uniform float u_time;',
      'uniform float u_warp;',
      'uniform float u_flash;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}',
      'float noise(vec2 p){',
      '  vec2 i=floor(p), f=fract(p);',
      '  vec2 u=f*f*(3.0-2.0*f);',
      '  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),',
      '             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);',
      '}',
      'float fbm(vec2 p){',
      '  float v=0.0; float a=0.5;',
      '  for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.07+vec2(13.1,5.7); a*=0.5; }',
      '  return v;',
      '}',
      'void main(){',
      '  vec2 sc = gl_FragCoord.xy / u_res;',
      '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;',
      '  float r = length(uv);',
      '  float rr = max(r, 0.08);',
      '  float a = atan(uv.y, uv.x);',
      '  float t = u_time;',
      '  vec3 col = vec3(0.012, 0.014, 0.026);',
      '  float hz = fbm(uv * 2.6 + vec2(t * 0.35, 1.7));',
      '  col += vec3(0.04, 0.07, 0.22) * hz * (0.7 + 0.6 * u_warp);',
      '  for (int i = 0; i < 3; i++) {',
      '    float fi = float(i);',
      '    float ringN = 26.0 + fi * 9.0;',
      '    vec2 sp = vec2((a / 6.28318 + 0.5) * ringN,',
      '                   (0.3 + fi * 0.22) / rr + t * (2.0 + fi * 1.2));',
      '    vec2 cell = floor(sp);',
      '    vec2 f = fract(sp);',
      '    float h = hash(cell + fi * 17.31);',
      '    float on = step(0.68, h);',
      '    vec2 c = vec2(0.2 + 0.6 * hash(cell + 4.7), 0.5);',
      '    vec2 dlt = f - c;',
      '    float sy = mix(130.0, 8.0, u_warp);',
      '    float star = on * exp(-(dlt.x * dlt.x * 150.0 + dlt.y * dlt.y * sy));',
      '    float tw = 0.7 + 0.3 * sin(h * 81.0 + t * 9.0);',
      '    tw = mix(tw, 1.0, u_warp);',
      '    vec3 colCyan = vec3(0.18, 0.82, 0.98);',
      '    vec3 colViolet = vec3(0.68, 0.42, 1.0);',
      '    vec3 colWhite = vec3(0.92, 0.98, 1.0);',
      '    vec3 sCol = mix(mix(colWhite, colCyan, 0.65), colViolet, step(0.85, h));',
      '    float fade = smoothstep(0.02, 0.25, r);',
      '    col += sCol * star * tw * fade * (1.1 + 0.7 * u_warp);',
      '  }',
      '  col += vec3(0.20, 0.75, 1.0) * u_warp * 0.35 * exp(-r * 3.8);',
      '  col += vec3(0.55, 0.35, 1.0) * u_warp * 0.20 * exp(-r * 2.2);',
      '  vec2 e = sc * (1.0 - sc);',
      '  col *= 0.3 + 0.7 * pow(e.x * e.y * 16.0, 0.3);',
      '  col = mix(col, vec3(0.92, 0.98, 1.0), clamp(u_flash, 0.0, 1.0));',
      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed:', gl.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const locP = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uWarp = gl.getUniformLocation(prog, 'u_warp');
    const uFlash = gl.getUniformLocation(prog, 'u_flash');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    let warp = 0;
    let warpTarget = 0;
    let flash = 0;
    let z = 0;
    let last = performance.now();

    btn.addEventListener('mouseenter', () => { warpTarget = 1; });
    btn.addEventListener('mouseleave', () => { warpTarget = 0; });
    btn.addEventListener('focus', () => { warpTarget = 1; });
    btn.addEventListener('blur', () => { warpTarget = 0; });
    btn.addEventListener('click', () => {
      flash = 1;
      warp = 0;
      z = 0;
    });

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      warp += (warpTarget - warp) * Math.min(1, dt * 2.6);
      flash *= Math.exp(-4.5 * dt);
      z += dt * (0.05 + warp * 1.35);
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 4.0 : z);
      gl.uniform1f(uWarp, warp);
      gl.uniform1f(uFlash, flash);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  initIgnitionShaderButton();


  /* =========================================================
     3D INTERACTIVE BACKGROUND ENGINE
     Sleek 3D Constellation & Perspective Geometric Matrix
     - Pure 3D coordinates (x, y, z) with focal perspective projection
     - Fluid mouse parallax orbit & inertia tilt
     - Dynamic 3D depth-linked constellation edges
     - Glowing 3D spatial nodes with pulsing rings
     - Adaptive dark/light mode palette
     - High-performance 60fps single-loop, battery-friendly
     ========================================================= */

  function init3DInteractiveBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let centerX = 0;
    let centerY = 0;

    // 3D Camera & Scene Parameters
    const FOV = 620; // Focal length
    const DEPTH_RANGE = 750;
    const NODE_COUNT = 80;
    const MAX_CONNECT_DIST = 165;

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let mouse = { x: -9999, y: -9999 };
    let isMouseOver = false;

    // Theme color palette adaptation
    function getThemeColors() {
      const isLight = document.body.classList.contains('light');
      if (isLight) {
        return {
          nodes: ['#4f46e5', '#2563eb', '#7c3aed', '#0284c7', '#6366f1'],
          lineBase: 'rgba(79, 70, 229, ',
          lineCyan: 'rgba(2, 132, 199, ',
          ringColor: 'rgba(99, 102, 241, ',
          glowColor: 'rgba(99, 102, 241, 0.35)',
          nodeAlphaMult: 0.72,
          lineAlphaMult: 0.26
        };
      }
      return {
        nodes: ['#a78bfa', '#38bdf8', '#818cf8', '#c084fc', '#e0e7ff'],
        lineBase: 'rgba(167, 139, 250, ',
        lineCyan: 'rgba(56, 189, 248, ',
        ringColor: 'rgba(56, 189, 248, ',
        glowColor: 'rgba(56, 189, 248, 0.55)',
        nodeAlphaMult: 0.95,
        lineAlphaMult: 0.32
      };
    }

    // 3D Point & Node Definition
    class Node3D {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        const spreadX = Math.max(width * 1.05, 1000);
        const spreadY = Math.max(height * 1.05, 800);
        this.x = (Math.random() - 0.5) * spreadX;
        this.y = (Math.random() - 0.5) * spreadY;
        this.z = initial
          ? (Math.random() - 0.5) * DEPTH_RANGE
          : DEPTH_RANGE / 2;

        this.vx = (Math.random() - 0.5) * 0.42;
        this.vy = (Math.random() - 0.5) * 0.42;
        this.vz = (Math.random() - 0.5) * 0.32;

        this.baseRadius = 1.4 + Math.random() * 2.0;
        this.isSpecial = Math.random() < 0.18; // nodes with 3D orbital rings
        this.ringAngle = Math.random() * Math.PI * 2;
        this.ringSpeed = (Math.random() - 0.5) * 0.03;
        this.colorIndex = Math.floor(Math.random() * 5);
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.pulse += 0.024;
        this.ringAngle += this.ringSpeed;

        const halfDepth = DEPTH_RANGE / 2;
        const spreadX = Math.max(width * 0.65, 600);
        const spreadY = Math.max(height * 0.65, 500);

        if (this.z < -halfDepth) this.z = halfDepth;
        if (this.z > halfDepth) this.z = -halfDepth;
        if (this.x < -spreadX) this.x = spreadX;
        if (this.x > spreadX) this.x = -spreadX;
        if (this.y < -spreadY) this.y = spreadY;
        if (this.y > spreadY) this.y = -spreadY;

        // Interactive gentle 3D repulsion near mouse
        if (isMouseOver && this.projX != null) {
          const dx = this.projX - mouse.x;
          const dy = this.projY - mouse.y;
          const dist2d = Math.hypot(dx, dy);
          if (dist2d < 150 && dist2d > 1) {
            const force = (150 - dist2d) / 150 * 1.1;
            this.x += (dx / dist2d) * force * 1.5;
            this.y += (dy / dist2d) * force * 1.5;
          }
        }
      }

      project(cosY, sinY, cosX, sinX) {
        // 3D rotation: orbit around Y axis then tilt around X axis
        const x1 = this.x * cosY + this.z * sinY;
        const z1 = -this.x * sinY + this.z * cosY;

        const y2 = this.y * cosX - z1 * sinX;
        const z2 = this.y * sinX + z1 * cosX;

        // Focal perspective projection
        const scale = FOV / (FOV + z2);
        this.projX = centerX + x1 * scale;
        this.projY = centerY + y2 * scale;
        this.scale = scale;
        this.depthZ = z2;
        this.visible = scale > 0.05 &&
          this.projX >= -80 && this.projX <= width + 80 &&
          this.projY >= -80 && this.projY <= height + 80;
      }
    }

    const nodes = [];
    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new Node3D());
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      centerX = width / 2;
      centerY = height / 2;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (nodes.length === 0) {
        initNodes();
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Smooth mouse parallax orbit
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMouseOver = true;
      targetRotY = (e.clientX - centerX) * 0.0003;
      targetRotX = -(e.clientY - centerY) * 0.00025;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      isMouseOver = false;
      targetRotX = 0;
      targetRotY = 0;
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Touch support for mobile 3D tilt
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        isMouseOver = true;
        targetRotY = (e.touches[0].clientX - centerX) * 0.00022;
        targetRotX = -(e.touches[0].clientY - centerY) * 0.00018;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isMouseOver = false;
      targetRotX = 0;
      targetRotY = 0;
    });

    let autoAngle = 0;
    let animFrameId = null;
    let isVisible = true;

    // Pause animation when tab is inactive to save battery/GPU
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    });

    function render() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors();

      // Smooth camera interpolation with auto-orbit drift
      autoAngle += 0.001;
      rotX += (targetRotX - rotX) * 0.04;
      rotY += (targetRotY + Math.sin(autoAngle) * 0.05 - rotY) * 0.04;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Update and project all nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].project(cosY, sinY, cosX, sinX);
      }

      // Sort nodes by depth (painter's algorithm: draw farthest first)
      nodes.sort((a, b) => b.depthZ - a.depthZ);

      // 1. Draw 3D Connection Lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!a.visible) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (!b.visible) continue;

          // 3D Distance check
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist3d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3d < MAX_CONNECT_DIST) {
            const proximity = 1 - dist3d / MAX_CONNECT_DIST;
            const avgScale = (a.scale + b.scale) * 0.5;
            const alpha = proximity * proximity * avgScale * colors.lineAlphaMult;

            if (alpha > 0.015) {
              ctx.beginPath();
              ctx.moveTo(a.projX, a.projY);
              ctx.lineTo(b.projX, b.projY);
              ctx.strokeStyle = (i % 2 === 0 ? colors.lineBase : colors.lineCyan) + alpha.toFixed(3) + ')';
              ctx.lineWidth = Math.max(0.4, (0.8 * avgScale).toFixed(2));
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw 3D Nodes & Orbital Geometries
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node.visible) continue;

        const pulseScale = 1 + Math.sin(node.pulse) * 0.15;
        const radius = Math.max(0.8, node.baseRadius * node.scale * pulseScale);
        const depthAlpha = Math.min(1, Math.max(0.12, (node.scale * 1.1) * colors.nodeAlphaMult));
        const color = colors.nodes[node.colorIndex % colors.nodes.length];

        // Soft outer glow for foreground nodes
        if (node.scale > 0.88) {
          ctx.beginPath();
          ctx.arc(node.projX, node.projY, radius * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = colors.glowColor;
          ctx.globalAlpha = depthAlpha * 0.32;
          ctx.fill();
        }

        // Core node circle
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = depthAlpha;
        ctx.fill();

        // 3D Orbital Geometric Ring for special anchor nodes
        if (node.isSpecial && node.scale > 0.6) {
          const ringR = radius * 3.6;
          ctx.beginPath();
          ctx.ellipse(
            node.projX,
            node.projY,
            ringR,
            ringR * 0.38,
            node.ringAngle,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = colors.ringColor + (depthAlpha * 0.52).toFixed(2) + ')';
          ctx.lineWidth = Math.max(0.5, 0.75 * node.scale);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;

      if (!prefersReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    }

    if (prefersReducedMotion) {
      render();
    } else {
      animFrameId = requestAnimationFrame(render);
    }
  }

  init3DInteractiveBackground();


  /* =========================================================
     3D FLOATING DOCK & QUICKNAV TACTILE ENGINE
     - Real-time 3D Perspective Tilt (rotateX, rotateY, translateZ)
     - Interactive Specular Glare & Dynamic Lighting
     - Proximity Wave Magnification
     - Tactile Mechanical Spring Click Feedback
     ========================================================= */

  function init3DQuickNav() {
    const dock = $(".quicknav");
    if (!dock) return;

    const items = $$(".quicknav a", dock);
    if (!items.length) return;

    let dockBounds = dock.getBoundingClientRect();

    function updateBounds() {
      dockBounds = dock.getBoundingClientRect();
    }

    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });

    dock.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const dockCenterX = dockBounds.left + dockBounds.width / 2;
      const dockCenterY = dockBounds.top + dockBounds.height / 2;

      // Subtle dock container 3D tilt
      const dockTiltX = (mouseY - dockCenterY) * -0.06;
      const dockTiltY = (mouseX - dockCenterX) * 0.04;
      dock.style.setProperty("--dock-tilt-x", `${dockTiltX.toFixed(2)}deg`);
      dock.style.setProperty("--dock-tilt-y", `${dockTiltY.toFixed(2)}deg`);

      // 3D Proximity and Tile Tilt for each button
      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const itemCenterY = itemRect.top + itemRect.height / 2;
        const dist = Math.hypot(mouseX - itemCenterX, mouseY - itemCenterY);

        const maxDist = 95;
        const proximity = Math.max(0, 1 - dist / maxDist);

        // Specular glare reflection
        const relX = ((mouseX - itemRect.left) / itemRect.width) * 100;
        const relY = ((mouseY - itemRect.top) / itemRect.height) * 100;
        item.style.setProperty("--glare-x", `${relX.toFixed(1)}%`);
        item.style.setProperty("--glare-y", `${relY.toFixed(1)}%`);

        // 3D Elevation & Tilting
        const tiltX = (mouseY - itemCenterY) * -0.32;
        const tiltY = (mouseX - itemCenterX) * 0.32;
        const liftZ = proximity * 18;
        const scale = 1 + proximity * 0.18;

        item.style.setProperty("--item-tilt-x", `${tiltX.toFixed(2)}deg`);
        item.style.setProperty("--item-tilt-y", `${tiltY.toFixed(2)}deg`);
        item.style.setProperty("--item-lift-z", `${liftZ.toFixed(1)}px`);
        item.style.setProperty("--item-scale", scale.toFixed(3));
        item.style.setProperty("--item-proximity", proximity.toFixed(2));
      });
    });

    dock.addEventListener("mouseleave", () => {
      dock.style.removeProperty("--dock-tilt-x");
      dock.style.removeProperty("--dock-tilt-y");

      items.forEach((item) => {
        item.style.removeProperty("--item-tilt-x");
        item.style.removeProperty("--item-tilt-y");
        item.style.removeProperty("--item-lift-z");
        item.style.removeProperty("--item-scale");
        item.style.removeProperty("--item-proximity");
        item.style.removeProperty("--glare-x");
        item.style.removeProperty("--glare-y");
      });
    });

    // Tactile 3D press response
    items.forEach((item) => {
      item.addEventListener("mousedown", () => {
        item.classList.add("is-pressed");
      });
      item.addEventListener("mouseup", () => {
        item.classList.remove("is-pressed");
      });
      item.addEventListener("mouseleave", () => {
        item.classList.remove("is-pressed");
      });
    });
  }

  init3DQuickNav();


  /* =========================================================
     3D CONTACT SECTION PARALLAX & TACTILE ENGINE
     - Real-time 3D Card Gyroscopic Parallax Tilt (rotateX, rotateY)
     - Interactive 3D Channel Badge Elevation & Shine Sweep
     - Smooth Lerp & Return Physics
     ========================================================= */

  function init3DContactSection() {
    const card = $("#contactCard");
    if (!card) return;

    if (prefersReducedMotion) return;

    let bounds = card.getBoundingClientRect();
    let isHovering = false;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let animId = null;

    function updateCardBounds() {
      bounds = card.getBoundingClientRect();
    }

    window.addEventListener("resize", updateCardBounds, { passive: true });
    window.addEventListener("scroll", updateCardBounds, { passive: true });

    function lerpTilt() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;

      card.style.setProperty("--c-tilt-x", `${currentTiltX.toFixed(2)}deg`);
      card.style.setProperty("--c-tilt-y", `${currentTiltY.toFixed(2)}deg`);

      if (isHovering || Math.abs(currentTiltX) > 0.05 || Math.abs(currentTiltY) > 0.05) {
        animId = requestAnimationFrame(lerpTilt);
      } else {
        card.style.removeProperty("--c-tilt-x");
        card.style.removeProperty("--c-tilt-y");
        animId = null;
      }
    }

    card.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Range between -1 and 1
      const normalizedX = (mouseX / bounds.width - 0.5) * 2;
      const normalizedY = (mouseY / bounds.height - 0.5) * 2;

      // Subtle, elegant 3D tilt
      targetTiltX = normalizedY * -3.2;
      targetTiltY = normalizedX * 3.5;

      if (!isHovering) {
        isHovering = true;
        if (!animId) animId = requestAnimationFrame(lerpTilt);
      }
    });

    card.addEventListener("mouseleave", () => {
      isHovering = false;
      targetTiltX = 0;
      targetTiltY = 0;
    });
  }

  init3DContactSection();


  /* =========================================================
     3D HERO ROLE FLIPPER ENGINE
     ========================================================= */

  function initHeroRoleFlipper() {
    const roleEl = $("#heroRoleText");
    if (!roleEl) return;

    const rolesByLang = {
      en: [
        "Digital Marketer",
        "Content Creator",
        "Canva Designer",
        "Website Builder",
        "Marketing Strategist",
        "Brand Visual Designer"
      ],
      bn: [
        "ডিজিটাল মার্কেটার",
        "কনটেন্ট ক্রিয়েটর",
        "ক্যানভা ডিজাইনার",
        "ওয়েবসাইট বিল্ডার",
        "মার্কেটিং স্ট্র্যাটেজিস্ট",
        "ব্র্যান্ড ভিজ্যুয়াল ডিজাইনার"
      ],
      ar: [
        "مسوق رقمي",
        "صانع محتوى",
        "مصمم كانفا",
        "مطور مواقع",
        "خبير استراتيجيات تسويق",
        "مصمم هوية بصرية"
      ]
    };

    let currentIndex = 0;

    function getActiveRoles() {
      const currentLang = document.documentElement.lang || "en";
      return rolesByLang[currentLang] || rolesByLang.en;
    }

    function cycleRole() {
      const roles = getActiveRoles();
      currentIndex = (currentIndex + 1) % roles.length;

      roleEl.classList.add("is-flipping");

      setTimeout(() => {
        roleEl.textContent = roles[currentIndex];
        roleEl.classList.remove("is-flipping");
      }, 350);
    }

    let intervalId = setInterval(cycleRole, 2800);

    // Pause on hover
    const pill = roleEl.closest(".role-pill-3d");
    if (pill) {
      pill.addEventListener("mouseenter", () => clearInterval(intervalId));
      pill.addEventListener("mouseleave", () => {
        intervalId = setInterval(cycleRole, 2800);
      });
    }
  }

  initHeroRoleFlipper();


  /* =========================================================
     THREEUI SHADERBUTTONS INTERACTION ENGINE
     Dynamic Pointer Tracking for Ceramic & Violet Keycaps
     ========================================================= */

  function initThreeUIShaderButtons() {
    const buttons = $$(".shader-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        btn.style.setProperty("--pointer-x", `${px.toFixed(1)}%`);
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.removeProperty("--pointer-x");
      });
    });
  }

  initThreeUIShaderButtons();


  /* =========================================================
     HERO LEAD TYPEWRITER ENGINE
     Smooth natural typing, pause to read, erase, and repeat loop
     ========================================================= */

  function initLeadTypewriter() {
    const textEl = document.getElementById("leadTypingText");
    if (!textEl) return;

    let targetText = textEl.textContent.trim();
    let charIndex = targetText.length;
    let isDeleting = false;
    let timeoutId = null;

    window.updateLeadTypewriterTarget = function(newText) {
      if (!newText || newText === targetText) return;
      targetText = newText.trim();
      charIndex = 0;
      isDeleting = false;
      textEl.textContent = "";
      if (timeoutId) clearTimeout(timeoutId);
      typeStep();
    };

    function typeStep() {
      if (isDeleting) {
        if (charIndex > 0) {
          charIndex--;
          textEl.textContent = targetText.substring(0, charIndex);
          timeoutId = setTimeout(typeStep, 16);
        } else {
          isDeleting = false;
          timeoutId = setTimeout(typeStep, 450);
        }
      } else {
        if (charIndex < targetText.length) {
          charIndex++;
          textEl.textContent = targetText.substring(0, charIndex);
          timeoutId = setTimeout(typeStep, 28);
        } else {
          // Finished typing: pause for 3.5s so user can read it comfortably
          isDeleting = true;
          timeoutId = setTimeout(typeStep, 3500);
        }
      }
    }

    // Start cycle after initial page load
    timeoutId = setTimeout(() => {
      isDeleting = true;
      typeStep();
    }, 4000);
  }

  initLeadTypewriter();


  /* =========================================================
     3D SOCIAL BUTTONS INTERACTION ENGINE
     Smooth Tactile Magnetic Micro-Physics
     ========================================================= */

  function initHero3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const socialButtons = document.querySelectorAll(".social-btn-3d");

    // 3D Social Buttons Magnetic Micro-Tilt
    socialButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        btn.style.transform = `perspective(600px) translateY(-8px) rotateX(${(-normY * 14).toFixed(1)}deg) rotateY(${(normX * 14).toFixed(1)}deg) translateZ(18px) scale(1.12)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  initHero3DInteractions();


  /* =========================================================
     EXECUTIVE 3D TIMELINE CARD INTERACTION ENGINE
     Spotlight Tracking & Micro-Tilt Physics
     ========================================================= */

  function initTimelineInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const cards = $$(".timeline-card");
    cards.forEach((card) => {
      let isHovered = false;
      let targetTiltX = 0;
      let targetTiltY = 0;
      let currentTiltX = 0;
      let currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.1;
        currentTiltY += (targetTiltY - currentTiltY) * 0.1;

        if (isHovered || Math.abs(currentTiltX) > 0.05 || Math.abs(currentTiltY) > 0.05) {
          card.style.transform = `perspective(800px) translateY(-6px) translateZ(12px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = "";
          animFrame = null;
        }
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--card-mouse-x", `${x}px`);
        card.style.setProperty("--card-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 4.5;
        targetTiltY = normX * 4.5;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    });
  }

  initTimelineInteractions();


  /* =========================================================
     CONSTANT LEARNER TYPEWRITER ENGINE
     Smooth natural typing, comfortable read pause, erase & loop
     ========================================================= */

  function initLearnerTypewriter() {
    const textEl = document.getElementById("learnerTypingText");
    if (!textEl) return;

    let targetText = textEl.textContent.trim() ||
      "Continuously learning new tools, creative workflows, digital marketing techniques, and design systems.";
    let charIndex = targetText.length;
    let isDeleting = false;
    let timeoutId = null;

    window.updateLearnerTypewriterTarget = function(newText) {
      if (!newText || newText === targetText) return;
      targetText = newText.trim();
      charIndex = 0;
      isDeleting = false;
      textEl.textContent = "";
      if (timeoutId) clearTimeout(timeoutId);
      typeStep();
    };

    function typeStep() {
      if (isDeleting) {
        if (charIndex > 0) {
          charIndex--;
          textEl.textContent = targetText.substring(0, charIndex);
          timeoutId = setTimeout(typeStep, 14);
        } else {
          isDeleting = false;
          timeoutId = setTimeout(typeStep, 400);
        }
      } else {
        if (charIndex < targetText.length) {
          charIndex++;
          textEl.textContent = targetText.substring(0, charIndex);
          timeoutId = setTimeout(typeStep, 26);
        } else {
          // Finished typing: pause 3.5s so user can read comfortably
          isDeleting = true;
          timeoutId = setTimeout(typeStep, 3500);
        }
      }
    }

    // Start cycle after initial page entrance
    timeoutId = setTimeout(() => {
      isDeleting = true;
      typeStep();
    }, 3200);
  }

  initLearnerTypewriter();


  /* =========================================================
     ACADEMIC BACKGROUND 3D CARDS & SPOTLIGHT ENGINE
     True 3D Perspective Tilt, Radial Spotlight & Sheen
     ========================================================= */

  function initEducation3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const cards = $$(".edu-card-3d");
    cards.forEach((card) => {
      let isHovered = false;
      let targetTiltX = 0;
      let targetTiltY = 0;
      let currentTiltX = 0;
      let currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.12;
        currentTiltY += (targetTiltY - currentTiltY) * 0.12;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          card.style.transform = `perspective(1000px) translateY(-8px) translateZ(16px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = "";
          animFrame = null;
        }
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--edu-mouse-x", `${x}px`);
        card.style.setProperty("--edu-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 5.5;
        targetTiltY = normX * 5.5;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    });
  }

  initEducation3DInteractions();


  /* =========================================================
     PROFESSIONAL TRAITS & CHIPS 3D SPOTLIGHT ENGINE
     Interactive 3D Depth, Floating Chips & Sheen
     ========================================================= */

  function initTraitsCard3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const traitCard = $(".skill-card-traits");
    if (!traitCard) return;

    let isHovered = false;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let animFrame = null;

    function updateTilt() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;

      if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
        traitCard.style.transform = `perspective(1000px) translateY(-5px) translateZ(10px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
        animFrame = requestAnimationFrame(updateTilt);
      } else {
        traitCard.style.transform = "";
        animFrame = null;
      }
    }

    traitCard.addEventListener("mousemove", (e) => {
      const rect = traitCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      traitCard.style.setProperty("--skill-mouse-x", `${x}px`);
      traitCard.style.setProperty("--skill-mouse-y", `${y}px`);

      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      targetTiltX = -normY * 4;
      targetTiltY = normX * 4;

      if (!isHovered) {
        isHovered = true;
        if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
      }
    });

    traitCard.addEventListener("mouseleave", () => {
      isHovered = false;
      targetTiltX = 0;
      targetTiltY = 0;
    });

    // Interactive magnetic hover effect for individual 3D chips
    const chips = $$(".chip-3d", traitCard);
    chips.forEach((chip) => {
      chip.addEventListener("mousemove", (e) => {
        const cRect = chip.getBoundingClientRect();
        const cX = (e.clientX - cRect.left) / cRect.width - 0.5;
        const cY = (e.clientY - cRect.top) / cRect.height - 0.5;
        chip.style.transform = `translate3d(${cX * 4}px, ${-3 + cY * 3}px, 12px) scale(1.04)`;
      });

      chip.addEventListener("mouseleave", () => {
        chip.style.transform = "";
      });
    });
  }

  initTraitsCard3DInteractions();


  /* =========================================================
     EXECUTIVE 3D CLIENT TESTIMONIALS INTERACTION ENGINE
     True 3D Perspective Tilt & Radial Spotlight Physics
     ========================================================= */

  function initTestimonial3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const cards = $$(".testimonial-3d");
    cards.forEach((card) => {
      let isHovered = false;
      let targetTiltX = 0;
      let targetTiltY = 0;
      let currentTiltX = 0;
      let currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.12;
        currentTiltY += (targetTiltY - currentTiltY) * 0.12;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          card.style.transform = `perspective(1000px) translateY(-8px) translateZ(16px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = "";
          animFrame = null;
        }
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--testi-mouse-x", `${x}px`);
        card.style.setProperty("--testi-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 5.5;
        targetTiltY = normX * 5.5;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    });
  }

  initTestimonial3DInteractions();


  /* =========================================================
     EXECUTIVE 3D ABOUT & STATS INTERACTION ENGINE
     ========================================================= */

  function initAboutAndStats3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const aboutCard = $(".about-copy-3d");
    if (aboutCard) {
      let isHovered = false;
      let targetTiltX = 0, targetTiltY = 0, currentTiltX = 0, currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.1;
        currentTiltY += (targetTiltY - currentTiltY) * 0.1;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          aboutCard.style.transform = `perspective(1000px) translateY(-6px) translateZ(12px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          aboutCard.style.transform = "";
          animFrame = null;
        }
      }

      aboutCard.addEventListener("mousemove", (e) => {
        const rect = aboutCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        aboutCard.style.setProperty("--about-mouse-x", `${x}px`);
        aboutCard.style.setProperty("--about-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 4;
        targetTiltY = normX * 4;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      aboutCard.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    }

    const statCards = $$(".stat-3d");
    statCards.forEach((stat) => {
      let isHovered = false;
      let targetTiltX = 0, targetTiltY = 0, currentTiltX = 0, currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.12;
        currentTiltY += (targetTiltY - currentTiltY) * 0.12;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          stat.style.transform = `perspective(800px) translateY(-5px) translateZ(10px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          stat.style.transform = "";
          animFrame = null;
        }
      }

      stat.addEventListener("mousemove", (e) => {
        const rect = stat.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        stat.style.setProperty("--stat-mouse-x", `${x}px`);
        stat.style.setProperty("--stat-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 5;
        targetTiltY = normX * 5;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      stat.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    });
  }

  initAboutAndStats3DInteractions();


  /* =========================================================
     EXECUTIVE 3D SERVICES INTERACTION ENGINE
     ========================================================= */

  function initServices3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const cards = $$(".service-3d");
    cards.forEach((card) => {
      let isHovered = false;
      let targetTiltX = 0, targetTiltY = 0, currentTiltX = 0, currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.12;
        currentTiltY += (targetTiltY - currentTiltY) * 0.12;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          card.style.transform = `perspective(1000px) translateY(-8px) translateZ(14px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = "";
          animFrame = null;
        }
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--service-mouse-x", `${x}px`);
        card.style.setProperty("--service-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 5.5;
        targetTiltY = normX * 5.5;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    });
  }

  initServices3DInteractions();


  /* =========================================================
     EXECUTIVE 3D FEATURED PROJECTS & BUTTONS INTERACTION ENGINE
     ========================================================= */

  function initProjectsAndBanner3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    const projectCards = $$(".project-card-3d");
    projectCards.forEach((card) => {
      let isHovered = false;
      let targetTiltX = 0, targetTiltY = 0, currentTiltX = 0, currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.12;
        currentTiltY += (targetTiltY - currentTiltY) * 0.12;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          card.style.transform = `perspective(1000px) translateY(-8px) translateZ(16px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = "";
          animFrame = null;
        }
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--proj-mouse-x", `${x}px`);
        card.style.setProperty("--proj-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 5;
        targetTiltY = normX * 5;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    });

    // 3D Magnetic Tactile hover physics for "View Collection" buttons
    const ctaButtons = $$(".btn-3d-glow");
    ctaButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const cX = (e.clientX - rect.left) / rect.width - 0.5;
        const cY = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = `translate3d(${cX * 6}px, ${-3 + cY * 4}px, 14px) scale(1.03)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });

    // 3D Banner interaction
    const banner = $(".all-projects-card.all-projects-3d");
    if (banner) {
      let isHovered = false;
      let targetTiltX = 0, targetTiltY = 0, currentTiltX = 0, currentTiltY = 0;
      let animFrame = null;

      function updateTilt() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.08;
        currentTiltY += (targetTiltY - currentTiltY) * 0.08;

        if (isHovered || Math.abs(currentTiltX) > 0.04 || Math.abs(currentTiltY) > 0.04) {
          banner.style.transform = `perspective(1200px) translateY(-5px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
          animFrame = requestAnimationFrame(updateTilt);
        } else {
          banner.style.transform = "";
          animFrame = null;
        }
      }

      banner.addEventListener("mousemove", (e) => {
        const rect = banner.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        banner.style.setProperty("--banner-mouse-x", `${x}px`);
        banner.style.setProperty("--banner-mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetTiltX = -normY * 3;
        targetTiltY = normX * 3;

        if (!isHovered) {
          isHovered = true;
          if (!animFrame) animFrame = requestAnimationFrame(updateTilt);
        }
      });

      banner.addEventListener("mouseleave", () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
      });
    }

    // 3D Magnetic Tactile hover physics for "All Projects" banner button
    const bannerBtn = $(".all-projects-btn.all-projects-btn-3d");
    if (bannerBtn) {
      bannerBtn.addEventListener("mousemove", (e) => {
        const rect = bannerBtn.getBoundingClientRect();
        const cX = (e.clientX - rect.left) / rect.width - 0.5;
        const cY = (e.clientY - rect.top) / rect.height - 0.5;
        bannerBtn.style.transform = `translate3d(${cX * 8}px, ${-4 + cY * 5}px, 16px) scale(1.04)`;
      });

      bannerBtn.addEventListener("mouseleave", () => {
        bannerBtn.style.transform = "";
      });
    }
  }

  initProjectsAndBanner3DInteractions();


  /* =========================================================
     EXECUTIVE 3D NAVBAR & BRAND BADGE ENGINE
     ========================================================= */

  function initNavbar3DInteractions() {
    if (prefersReducedMotion || !hasFinePointer) return;

    // Interactive 3D micro-tilt on brand badges
    const brandBadges = $$(".brand-badge-3d");
    brandBadges.forEach((badge) => {
      badge.addEventListener("mousemove", (e) => {
        const rect = badge.getBoundingClientRect();
        const cX = (e.clientX - rect.left) / rect.width - 0.5;
        const cY = (e.clientY - rect.top) / rect.height - 0.5;
        badge.style.transform = `perspective(400px) rotateY(${cX * 26}deg) rotateX(${-cY * 26}deg) scale(1.12)`;
      });

      badge.addEventListener("mouseleave", () => {
        badge.style.transform = "";
      });
    });

    // 3D Capsule Pill Nav Link Micro-physics
    const navItems = $$(".nav.nav-3d a");
    navItems.forEach((link) => {
      link.addEventListener("mousemove", (e) => {
        const rect = link.getBoundingClientRect();
        const cX = (e.clientX - rect.left) / rect.width - 0.5;
        const cY = (e.clientY - rect.top) / rect.height - 0.5;
        link.style.transform = `translate3d(${cX * 4}px, ${-2 + cY * 3}px, 8px) scale(1.04)`;
      });

      link.addEventListener("mouseleave", () => {
        link.style.transform = "";
      });
    });
  }

  initNavbar3DInteractions();


  /* =========================================================
     EXECUTIVE 3D BACK TO TOP BUTTON INTERACTION ENGINE
     ========================================================= */

  function initFooter3DInteractions() {
    const backBtn = $(".back-to-top-3d");
    if (!backBtn) return;

    if (!prefersReducedMotion && hasFinePointer) {
      backBtn.addEventListener("mousemove", (e) => {
        const rect = backBtn.getBoundingClientRect();
        const cX = (e.clientX - rect.left) / rect.width - 0.5;
        const cY = (e.clientY - rect.top) / rect.height - 0.5;
        backBtn.style.transform = `translate3d(${cX * 6}px, ${-3 + cY * 4}px, 12px) scale(1.04)`;
      });

      backBtn.addEventListener("mouseleave", () => {
        backBtn.style.transform = "";
      });
    }

    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  /* =========================================================
     EXECUTIVE 3D ORBITAL PENDULUM & CHORKI (চরকি) ENGINE
     Multi-revolution (3-5 rounds) frictionless spin, realistic inertia,
     and buttery-smooth natural pendulum settling (Zero dropped frames)
     ========================================================= */

  function initHeroLanyardPhysics() {
    const card = $("#heroIdCard");
    const assembly = $("#lanyardAssembly");
    if (!card || !assembly) return;

    const glare = $("#cardSpecularGlare");
    const spinTrigger = $("#cardSpinTrigger");

    // Natural resting angle: 0° (Completely straight and upright)
    const restTheta = 0;

    // Physics State
    let theta = restTheta; // Current orbital angle in degrees
    let thetaVel = 0;      // Angular velocity (deg/frame)

    // Multi-revolution smoothspin state (Flawless, continuous quartic deceleration)
    let isSpinning = false;
    let spinStart = 0;
    let spinTarget = 0;
    let spinStartTime = 0;
    let spinDuration = 2400; // ms for 4 silky revolutions

    let isDragging = false;
    let hasMoved = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let startTheta = 0;

    // Velocity tracking history for drag release
    const pointerHistory = [];
    const maxHistory = 6;

    function addPointerHistory(x) {
      const now = performance.now();
      pointerHistory.push({ x, t: now });
      while (pointerHistory.length > maxHistory) {
        pointerHistory.shift();
      }
    }

    function getReleaseVelocity() {
      if (pointerHistory.length < 2) return 0;
      const oldest = pointerHistory[0];
      const newest = pointerHistory[pointerHistory.length - 1];
      const dt = Math.max(1, newest.t - oldest.t);
      return (newest.x - oldest.x) / dt; // px/ms
    }

    // Trigger glorious, ultra-smooth 4-round Chorki Spin (চরকি পাক)
    // Uses C-infinity continuous quartic ease-out: 0 torque steps, 0 dead-zones, 0 right-side snag!
    function triggerChorkiLoop(direction = 1, rounds = 4) {
      isSpinning = true;
      spinStartTime = 0;
      spinStart = theta;
      const dir = direction >= 0 ? 1 : -1;
      const baseRev = Math.round(theta / 360) * 360;
      spinTarget = baseRev + dir * (360 * rounds);
      spinDuration = prefersReducedMotion ? 1200 : Math.round(rounds * 620); // ~2480ms for 4 rounds
      thetaVel = 0;
    }

    // Pointer Event Listeners (Tactile, seamless whole-card interaction)
    card.addEventListener("pointerdown", (e) => {
      if (e.target.closest("#cardSpinTrigger")) return;
      e.preventDefault();

      isDragging = true;
      hasMoved = false;
      isSpinning = false; // Immediately interrupt any active spin on touch
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      startTheta = theta;
      thetaVel = 0;

      card.classList.add("is-dragging");

      pointerHistory.length = 0;
      addPointerHistory(e.clientX);

      try {
        card.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;

      addPointerHistory(e.clientX);

      const dx = e.clientX - startPointerX;
      const dy = e.clientY - startPointerY;

      if (Math.hypot(dx, dy) > 4) {
        hasMoved = true;
      }

      // Natural drag: moving cursor right pulls badge right (negative theta in CSS)
      const angularSensitivity = 0.22;
      const targetTheta = startTheta - dx * angularSensitivity;
      theta += (targetTheta - theta) * 0.55;

      // Specular highlight tracking
      if (glare) {
        const rect = card.getBoundingClientRect();
        const glareX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const glareY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        glare.style.setProperty("--glare-x", `${glareX.toFixed(1)}%`);
        glare.style.setProperty("--glare-y", `${glareY.toFixed(1)}%`);
      }
    });

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("is-dragging");

      try {
        if (e && e.pointerId) card.releasePointerCapture(e.pointerId);
      } catch (err) {}

      const vx = getReleaseVelocity(); // px/ms

      if (Math.abs(vx) > 0.35) {
        // High-velocity fling: spins 3-5 full rounds in the direction of swipe
        const rounds = Math.min(5, Math.max(3, Math.round(Math.abs(vx) * 6)));
        triggerChorkiLoop(vx > 0 ? -1 : 1, rounds);
      } else if (hasMoved) {
        // Gentle release: realistic physical inertia continuing into gentle pendulum swing
        thetaVel = Math.max(-6, Math.min(6, -vx * 10));
      } else {
        // Direct click/tap without drag: triggers standard 4 full revolutions!
        triggerChorkiLoop(1, 4);
      }
    }

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Spin button click
    if (spinTrigger) {
      spinTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerChorkiLoop(1, 4);
      });
    }

    // Keyboard Accessibility
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerChorkiLoop(1, 4);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        triggerChorkiLoop(-1, 4);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        triggerChorkiLoop(1, 4);
      }
    });

    // Physics Simulation Loop (RAF) - 100% Butter-smooth, zero GPU strain
    function physicsTick(currentTime) {
      if (isSpinning) {
        if (spinStartTime === 0) spinStartTime = currentTime;
        const elapsed = currentTime - spinStartTime;
        const t = Math.min(1, elapsed / spinDuration);

        // Smooth physical friction easing (power 2.2):
        // Decelerates uniformly across all 4 revolutions with zero premature braking or dead-zones!
        const eased = 1 - Math.pow(1 - t, 2.2);
        theta = spinStart + (spinTarget - spinStart) * eased;

        if (t >= 1) {
          theta = spinTarget % 360;
          thetaVel = 0;
          isSpinning = false;
        }
      } else if (!isDragging) {
        // Natural pendulum restoring sway when released gently
        const rad = (theta * Math.PI) / 180;
        const torque = -0.32 * Math.sin(rad);
        thetaVel = (thetaVel + torque) * 0.985;
        theta += thetaVel;

        // Clean settling to exact straight upright (0°)
        if (Math.abs(thetaVel) < 0.015 && Math.abs(Math.sin(rad)) < 0.02) {
          theta = Math.round(theta / 360) * 360;
          thetaVel = 0;
        }
      }

      // Hardware-accelerated GPU 2D affine rotation around top anchor
      // Uses translateZ(0) so the entire assembly is a cached GPU layer (Zero dropped frames!)
      assembly.style.transform = `rotate(${theta.toFixed(2)}deg) translateZ(0)`;

      requestAnimationFrame(physicsTick);
    }

    requestAnimationFrame(physicsTick);
  }

  initHeroLanyardPhysics();


  /* =========================================================
     END
     ========================================================= */

})();