import { Experience, Project, SkillCategory, Certification } from "./types";

export const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Certificates", href: "#certifications" },
  { name: "Projects", href: "#projects" },
  { name: "Music", href: "#music" },
  { name: "Skills", href: "#skills" },
  { name: "Fun", href: "#fun" },
  { name: "Contact", href: "#contact" },
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: "ibm-ai-eng",
    title: "AI Engineering Professional Certificate",
    issuer: "IBM",
    date: "August 2025",
    category: "AI/ML",
    skills: ["Machine Learning", "Machine Learning Algorithms", "Deep Learning", "Computer Vision", "Visualization (Computer Graphics)"],
    viewUrl: "1TjByUNI_p-TGt_rVN1Fc0nceQcFrBZl7"
  },
  {
    id: "ibm-ds-prof",
    title: "Data Science Professional Certificate",
    issuer: "IBM",
    date: "July 2025",
    category: "Data Science",
    skills: ["Python Programming", "Data Science", "Data Analysis", "R Programming", "Professional Development"],
    viewUrl: "1kuH-Z9_xD7EwVzcuF_BiR0UoeNH5ElM2"
  },
  {
    id: "google-analytics",
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google",
    date: "December 2022",
    category: "Analytics",
    skills: ["Data Analysis", "R Programming", "SQL", "Spreadsheet Software", "Data Visualization"],
    viewUrl: "1mptvoJe0XFMvixXG5H8LmYKqqjdtTost"
  },
  {
    id: "dl-ai-nn-dl",
    title: "Neural Networks and Deep Learning",
    issuer: "DeepLearning.ai",
    date: "July 2020",
    category: "AI/ML",
    skills: ["Artificial Neural Networks", "RNNs", "Linear Algebra", "Applied Machine Learning", "Python Programming", "Deep Learning", "Calculus", "Supervised Learning", "CNNs"],
    viewUrl: "11AauG0yXFp9P1BUkNnMjYLwGcjBzJ4QV"
  },
  {
    id: "umich-sports",
    title: "Prediction Models with Sports Data",
    issuer: "University of Michigan",
    date: "August 2021",
    category: "Analytics",
    skills: ["Data Analytics", "Data Modelling", "Regression Modelling"],
    viewUrl: "1IxeVDF_3-ojF5ayX09LU7c4CUx0v5-St"
  },
  {
    id: "ms-cv",
    title: "Building computer vision application with Azure cognitive services",
    issuer: "Microsoft / EdX",
    date: "June 2021",
    category: "AI/ML",
    skills: ["Azure", "Computer Vision", "OpenCV"],
    viewUrl: "1fV7wUHIPa2mg_qCuimsGrSEtO6lXgLOo"
  }
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    id: "work-standardaero",
    company: "StandardAero",
    role: "Software Engineer Intern",
    period: "Aug 2026 - Present",
    description: [
      "Working with supply chain and automation initiatives.",
      "Gaining hands-on experience applying software development and automation to real-world aviation operations while collaborating with experienced professionals and fellow interns."
    ],
    technologies: ["Automation", "Software Development", "Supply Chain"],
    type: "work",
    logoUrl: "https://drive.google.com/thumbnail?id=1BvvhEABEu6nSVHaoSCLunZKrVLJPuiOQ&sz=w500"
  },
  {
    id: "work-fhlb",
    company: "Federal Home Loan Bank of Dallas",
    role: "Software Developer Intern",
    period: "May 2026 – Aug 2026",
    description: [
      "Developing and enhancing enterprise software solutions within the IT department, contributing to internal applications and business-critical workflows.",
      "Working on upgrade legacy systems and softwares to make them user ready and easier to maintain per modern standards."
    ],
    technologies: ["Enterprise Software", "Software Development", "IT"],
    type: "work",
    logoUrl: "https://drive.google.com/thumbnail?id=1Jfa49gHJ9K2vF8_gcJ9jfGq8-moL9QOG&sz=w500"
  },
  {
    id: "work-jcc",
    company: "USSPACECOM Joint Cyber Center (JCC)",
    role: "S-TRACE (The Data Mine, Purdue University)",
    period: "Jan 2026 – May 2026",
    description: [
      "Developing a cyber situational awareness tool integrating orbital visibility, space–ground communications, and cyber threat intelligence for real-time mission monitoring.",
      "Mapping space–terrestrial communication paths and correlating cyber vulnerabilities with mission-critical assets to surface high-priority threat vectors."
    ],
    technologies: ["Cybersecurity", "Space Systems", "Threat Intelligence"],
    type: "work",
    logoUrls: [
      "https://drive.google.com/thumbnail?id=1WHuooRmVT2K0v_Q6GYmXlyZ3haObDJRn&sz=w500",
      "https://drive.google.com/thumbnail?id=1FjYvA3j4btaCe9BSP_s4ItfFeffxhHOl&sz=w500",
      "https://drive.google.com/thumbnail?id=1beXNZnqsyMi7FHxasa3S4gA48pwLhtiG&sz=w500"
    ]
  },
  {
    id: "work-tutor",
    company: "Undergraduate Tutor",
    role: "Computer Science",
    period: "Jan 2025 – Present",
    description: [
      "Mentoring undergraduate students in core Computer Science subjects including Data Structures & Algorithms, Computer Architecture, and Computer Networks.",
      "Simplifying complex theoretical concepts into digestible practical examples, leading to a measurable improvement in student performance and exam scores.",
      "Providing guidance on AP Computer Science curriculum, fostering a strong foundation in object-oriented programming and problem-solving methodologies."
    ],
    technologies: ["DSA", "Computer Architecture", "Computer Networks"],
    type: "work",
    logoUrl: "https://drive.google.com/thumbnail?id=1951SHvo0LB1K9BsvKif43O9pTlwoNOVJ&sz=w500"
  },
  {
    id: "edu-utd",
    company: "University of Texas at Dallas",
    role: "M.S. in Computer Science",
    period: "Aug 2025 – May 2027",
    description: [
      "Pursuing a Master of Science in Computer Science with a specialized focus on Intelligent Systems, Artificial Intelligence, and Machine Learning.",
      "Engaging in advanced coursework covering Deep Learning, Natural Language Processing, and Reinforcement Learning to build robust AI solutions.",
      "Collaborating on research projects involving high-performance computing and large-scale data processing within the Erik Jonsson School of Engineering.",
      "Maintaining academic excellence while exploring the intersection of distributed systems and scalable AI architectures.",
      "CGPA: 3.3 / 4.0 | Richardson, TX"
    ],
    technologies: ["Computer Science", "Machine Learning", "AI"],
    type: "education",
    logoUrl: "https://drive.google.com/thumbnail?id=1W3bkHb2ppbUCQWV-ZCzErQZa3SC2YzYr&sz=w500"
  },
  {
    id: "work-exl",
    company: "EXL Digital",
    role: "Software Engineer (Backend / AI)",
    period: "Sep 2023 – Jul 2025",
    description: [
      "Optimized SQL and GraphQL APIs with cross-functional teams, reducing response time by 30% through query restructuring and targeted caching.",
      "Designed and deployed ML and Generative AI pipelines automating 70% of banking reconciliation workflows, significantly reducing manual review effort.",
      "Built Smart Contract Assist features using LLM-based document extraction, cutting processing turnaround time by 40% and improving accuracy."
    ],
    technologies: ["SQL", "GraphQL", "ML", "Generative AI", "Python"],
    type: "work",
    logoUrl: "https://drive.google.com/thumbnail?id=1xGOcfhJG9W6m8pYih5W6VOTWL8_n4PpS&sz=w500"
  },
  {
    id: "work-issi",
    company: "ISSI Ltd.",
    role: "Software Engineering Intern",
    period: "Jun 2022 – Aug 2022",
    description: [
      "Built reusable Angular UI components and integrated them with RESTful backend services to deliver complete CRUD workflows across two product modules."
    ],
    technologies: ["Angular", "SQL", "CRUD", "RESTful APIs"],
    type: "work",
    logoUrl: "https://drive.google.com/thumbnail?id=1_FAw5My-fOQN-QdH0z9E5B47Xmw2349I&sz=w500"
  },
  {
    id: "edu-nitr",
    company: "National Institute of Technology, Rourkela",
    role: "B.Tech in Computer Science",
    period: "Jun 2019 – Jun 2023",
    description: [
      "Awarded Bachelor of Technology in Computer Science and Engineering from a premier Institute of National Importance, focusing on core computing foundations.",
      "Mastered complex principles including Data Structures, Algorithms, Operating Systems, Database Management, and Computer Networks.",
      "Conducted research-oriented thesis on 'Facial GANs and Generative Modeling', exploring high-fidelity image synthesis and training optimization for deep learning models.",
      "Active contributor to the technical ecosystem, leading initiatives in coding clubs and balancing academic rigor with creative leadership roles in campus symposiums.",
      "CGPA: 7.5 / 10.0",
      "Rourkela, India"
    ],
    technologies: ["Computer Science", "GANs", "Software Engineering", "Algorithms", "Deep Learning"],
    type: "education",
    logoUrl: "https://drive.google.com/thumbnail?id=1TFlt98VgT8D71GlREaVXNrpJAJRrc3TP&sz=w500"
  },
  {
    id: "work-solve",
    company: "Solve Intellify",
    role: "Data Science Intern",
    period: "Jun 2020 – Jul 2020",
    description: [
      "Cleaned and analyzed large educational datasets in Python, surfacing insights on remote learning engagement trends for stakeholder reporting."
    ],
    technologies: ["Python", "Data Science", "Data Analysis", "Reporting"],
    type: "work",
    logoUrl: "https://drive.google.com/thumbnail?id=1ZN6g54HeReMeWe5Oq79oLuuGyYrUUFFV&sz=w500"
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "lyriq",
    title: "LyrIQ",
    description: "Built a full-stack React + FastAPI platform featuring lyric explanation, emotion detection, and AI-generated chord suggestions via LLM APIs and custom prompt pipelines.",
    tags: ["React", "FastAPI", "LLM APIs", "NVIDIA NIM"],
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    demoUrl: "https://lyriq-675793904460.us-west1.run.app/",
    difficulty: 3
  },
  {
    id: "applysmart",
    title: "Apply Smart",
    description: "Engineered a resume-parsing and semantic job-matching system using NLP; integrated automated application tracking to filter irrelevant listings and streamline job search.",
    tags: ["React", "FastAPI", "NLP", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1000&auto=format&fit=crop",
    demoUrl: "https://applysmart-503697605046.us-west1.run.app/",
    difficulty: 3
  },
  {
    id: "rankly",
    title: "Rank.ly",
    description: "Built an interactive ranking and scoring web application enabling users to upload images and categorize items dynamically. Designed responsive UI and backend APIs.",
    tags: ["React", "FastAPI", "ShadCN UI"],
    imageUrl: "https://drive.google.com/thumbnail?id=17xalykRrmDwLVkEaUOAljK7bQBWvhCZ8&sz=w1000",
    demoUrl: "https://v0-shadcn-app-builder.vercel.app/signin",
    difficulty: 2
  },
  {
    id: "facial-gans",
    title: "Facial GANs",
    description: "Designed and trained GAN architectures for high-fidelity facial image synthesis; optimized training pipelines to cut compute cost by 25% without quality loss.",
    tags: ["Python", "PyTorch", "GANs", "Computer Vision"],
    imageUrl: "https://drive.google.com/thumbnail?id=1NW_FX6_oFa5qWKX-K3pbu4UtVtElPS5X&sz=w1000",
    demoUrl: "https://drive.google.com/file/d/1NW_FX6_oFa5qWKX-K3pbu4UtVtElPS5X/view?usp=sharing",
    difficulty: 2
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "LANGUAGES",
    items: [
      { name: "Python", score: 95 },
      { name: "TypeScript", score: 90 },
      { name: "JavaScript", score: 92 },
      { name: "C#", score: 85 },
      { name: "C++", score: 80 },
      { name: "SQL", score: 80 },
      { name: "Java", score: 85 }
    ]
  },
  {
    category: "FRONTEND",
    items: [
      { name: "React", score: 95 },
      { name: "Next.js", score: 90 },
      { name: "Tailwind CSS", score: 90 },
      { name: "Framer Motion", score: 75 },
      { name: "Redux", score: 70 }
    ]
  },
  {
    category: "BACKEND & CLOUD",
    items: [
      { name: "FastAPI", score: 90 },
      { name: "Node.js", score: 80 },
      { name: "Django", score: 70 },
      { name: "AWS", score: 80 },
      { name: "Azure Services", score: 80 },
      { name: ".NET", score: 80 },
      { name: "Docker", score: 70 },
      { name: "MySQL", score: 80 }
    ]
  },
  {
    category: "AI & ML",
    items: [
      { name: "PyTorch", score: 90 },
      { name: "TensorFlow", score: 80 },
      { name: "Scikit-learn", score: 78 },
      { name: "OpenCV", score: 90 },
      { name: "NVIDIA NIM", score: 90 },
      { name: "LangChain", score: 90 }
    ]
  },
  {
    category: "TOOLS & FRAMEWORKS",
    items: [
      { name: "VS Code", score: 98 },
      { name: "Git / GitHub", score: 95 },
      { name: "Postman", score: 65 },
      { name: "Unity", score: 60 },
      { name: "Linux", score: 80 },
      { name: "Visual Studio", score: 90 }
    ]
  },
  {
    category: "CREATIVE & PRODUCTIVITY",
    items: [
      { name: "Adobe Creative Suite", score: 85 },
      { name: "Logic Pro X", score: 95 },
      { name: "Figma", score: 88 },
      { name: "Microsoft 365", score: 95 },
      { name: "Jira", score: 80 },
      { name: "Notion", score: 90 }
    ]
  }
];

export const MUSIC_ARTICLES = [
  {
    title: "Rolling Stone India: What We're Listening To - 06/07/2021",
    publication: "Rolling Stone India",
    url: "https://rollingstoneindia.com/rsdailymusic-heres-what-were-listening-to-today-138/",
    image: "https://rollingstoneindia.com/wp-content/uploads/2023/04/RS-Daily-Music-1-960x640.jpg",
    snippet: "Featured in the daily selection of fresh indie music."
  },
  {
    title: "Rolling Stone India: What We're Listening To - 04/27/2022",
    publication: "Rolling Stone India",
    url: "https://rollingstoneindia.com/rsdailymusic-heres-what-were-listening-to-today-273/",
    image: "https://rollingstoneindia.com/wp-content/uploads/2023/04/RS-Daily-Music-1-960x640.jpg",
    snippet: "Featured in the daily selection of fresh indie music."
  },
  {
    title: "Rolling Stone India: Editor's Pick",
    publication: "Rolling Stone India",
    url: "https://rollingstoneindia.com/rsdailymusic-heres-what-were-listening-to-today-181/",
    image: "https://rollingstoneindia.com/wp-content/uploads/2023/08/RS-Daily-Music-Features-1.jpg",
    snippet: "Highlighting the unique soundscapes of Rayjew."
  },
  {
    title: "Birds of a Feather: Bold Eclectic Debut",
    publication: "The Indian Music Diaries",
    url: "https://theindianmusicdiaries.com/rayjews-birds-of-a-feather-a-bold-eclectic-hip-hop-debut/",
    image: "https://theindianmusicdiaries.com/wp-content/uploads/2023/11/Rayjew-Birds-of-a-Feather-Review.jpg",
    snippet: "A deep dive into the genre-bending debut album."
  }
];

export const DISCOGRAPHY = [
  {
    title: "Birds of a Feather",
    year: "2023",
    role: "Artist / Producer",
    link: "https://open.spotify.com/album/5qzLAHHCj3gagVkOiQ0H14?si=zq1bHII9Q_eyhxEJP7Athg"
  },
  {
    title: "Love & Loss",
    year: "2024",
    role: "Artist / Producer",
    link: "https://open.spotify.com/album/3pLdbow9Ca2gJj4mFZUkXE"
  },
  {
    title: "Perspective",
    year: "2021",
    role: "Artist / Producer",
    link: "https://open.spotify.com/album/7mMA7S0bUUBrwQrCwlgtDJ?si=YXJFNtpmRKutZPPVSVSVO_pA"
  },
  {
    title: "WoW",
    year: "2021",
    role: "Artist / Producer",
    link: "https://open.spotify.com/album/25gUglFg49IMVMjPtvaThx?si=s7CG3ElXSjW6tYdOB1RfxQ"
  },
  {
    title: "PACKED",
    year: "2021",
    role: "Artist / Producer",
    link: "https://open.spotify.com/track/1pCkpXii9vkVjx5exuNrZ3?si=58c5d9bb82b44da1"
  },
  {
    title: "Latest Release",
    year: "2024",
    role: "Artist",
    link: "https://open.spotify.com/album/6WJ6UYrt963XByprXGTAwd"
  }
];

export const ARTIST_PROFILE = "https://open.spotify.com/artist/5YcC0Yq3B27NqUREQkKj4C";