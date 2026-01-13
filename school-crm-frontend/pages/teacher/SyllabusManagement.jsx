import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Upload,
  Share2,
  Calendar,
  FileText,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Youtube,
  File,
  Video,
  Presentation,
} from "lucide-react";

const SyllabusManagement = () => {
  const [selectedClass, setSelectedClass] = useState("10th A");
  const [selectedSemester, setSelectedSemester] = (useState < 1) | (2 > 1);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);
  const [selectedTopicForUpload, setSelectedTopicForUpload] =
    (useState < string) | (null > null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState < string > [];

  const semester1Data = [
    {
      id: "math-sem1",
      name: "Mathematics",
      topics: [
        {
          id: "m1-1",
          name: "Real Numbers",
          status: "completed",
          progress: 100,
          date: "2024-03-01",
          materials: [],
          homework: "Exercise 1.1 to 1.5",
          keyPoints: [
            "Understanding Euclid's division algorithm",
            "Fundamental theorem of arithmetic",
            "Properties of rational and irrational numbers",
            "Decimal expansions of rational numbers",
          ],
        },
        {
          id: "m1-2",
          name: "Polynomials",
          status: "completed",
          progress: 100,
          date: "2024-03-05",
          materials: [],
          homework: "Exercise 2.1 to 2.4",
          keyPoints: [
            "Geometrical meaning of zeroes of a polynomial",
            "Relationship between zeroes and coefficients",
            "Division algorithm for polynomials",
            "Factorization of polynomials",
          ],
        },
        {
          id: "m1-3",
          name: "Pair of Linear Equations in Two Variables",
          status: "in-progress",
          progress: 60,
          date: "2024-03-10",
          materials: [],
          homework: "Exercise 3.1 to 3.3",
          keyPoints: [
            "Graphical method of solution",
            "Algebraic methods: Substitution and Elimination",
            "Cross-multiplication method",
            "Equations reducible to linear form",
          ],
        },
        {
          id: "m1-4",
          name: "Quadratic Equations",
          status: "pending",
          progress: 0,
          date: "2024-03-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Standard form of quadratic equations",
            "Solution by factorization",
            "Completing the square method",
            "Quadratic formula and discriminant",
            "Nature of roots",
          ],
        },
        {
          id: "m1-5",
          name: "Arithmetic Progressions",
          status: "pending",
          progress: 0,
          date: "2024-03-20",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Common difference and general term",
            "nth term of an AP",
            "Sum of first n terms",
            "Applications in real-life problems",
          ],
        },
        {
          id: "m1-6",
          name: "Triangles",
          status: "pending",
          progress: 0,
          date: "2024-03-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Similar triangles and their properties",
            "Criteria for similarity (AAA, SAS, SSS)",
            "Pythagoras theorem and its converse",
            "Areas of similar triangles",
          ],
        },
        {
          id: "m1-7",
          name: "Coordinate Geometry (Distance Formula)",
          status: "pending",
          progress: 0,
          date: "2024-03-30",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Distance formula between two points",
            "Section formula (internal division)",
            "Midpoint formula",
            "Area of a triangle using coordinates",
          ],
        },
        {
          id: "m1-8",
          name: "Statistics (Mean, Median, Mode)",
          status: "pending",
          progress: 0,
          date: "2024-04-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Mean of grouped data",
            "Median of grouped data",
            "Mode of grouped data",
            "Cumulative frequency graphs",
          ],
        },
      ],
    },
    {
      id: "science-sem1",
      name: "Science",
      topics: [
        {
          id: "s1-1",
          name: "Physics: Light – Reflection & Refraction",
          status: "completed",
          progress: 100,
          date: "2024-03-01",
          materials: [],
          homework: "Complete lab work",
          keyPoints: [
            "Laws of reflection and refraction",
            "Spherical mirrors and their properties",
            "Mirror formula and magnification",
            "Refraction through lenses",
            "Lens formula and power of lens",
          ],
        },
        {
          id: "s1-2",
          name: "Physics: The Human Eye and the Colourful World",
          status: "in-progress",
          progress: 50,
          date: "2024-03-08",
          materials: [],
          homework: "Exercise questions",
          keyPoints: [
            "Structure and functioning of human eye",
            "Defects of vision and their correction",
            "Refraction of light through a prism",
            "Dispersion and scattering of light",
            "Atmospheric refraction phenomena",
          ],
        },
        {
          id: "s1-3",
          name: "Chemistry: Chemical Reactions and Equations",
          status: "pending",
          progress: 0,
          date: "2024-03-12",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Balancing chemical equations",
            "Types of chemical reactions",
            "Oxidation and reduction",
            "Effects of oxidation in daily life",
          ],
        },
        {
          id: "s1-4",
          name: "Chemistry: Acids, Bases and Salts",
          status: "pending",
          progress: 0,
          date: "2024-03-18",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Properties of acids and bases",
            "pH scale and indicators",
            "Importance of pH in daily life",
            "Preparation and uses of common salts",
          ],
        },
        {
          id: "s1-5",
          name: "Chemistry: Metals and Non-metals",
          status: "pending",
          progress: 0,
          date: "2024-03-22",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Physical and chemical properties",
            "Reactivity series",
            "Extraction of metals",
            "Corrosion and its prevention",
          ],
        },
        {
          id: "s1-6",
          name: "Biology: Life Processes",
          status: "pending",
          progress: 0,
          date: "2024-03-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Nutrition in plants and animals",
            "Respiration - aerobic and anaerobic",
            "Transportation in plants and animals",
            "Excretion in plants and animals",
          ],
        },
        {
          id: "s1-7",
          name: "Biology: Control and Coordination",
          status: "pending",
          progress: 0,
          date: "2024-03-30",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Nervous system in animals",
            "Coordination in plants (hormones)",
            "Reflex actions",
            "Human brain structure",
          ],
        },
        {
          id: "s1-8",
          name: "Biology: How do Organisms Reproduce",
          status: "pending",
          progress: 0,
          date: "2024-04-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Asexual reproduction modes",
            "Sexual reproduction in plants",
            "Reproduction in humans",
            "Reproductive health",
          ],
        },
      ],
    },
    {
      id: "english-sem1",
      name: "English",
      topics: [
        {
          id: "e1-1",
          name: "Literature: Prose lessons",
          status: "completed",
          progress: 100,
          date: "2024-03-01",
          materials: [],
          homework: "Read chapters 1-3",
          keyPoints: [
            "Understanding prose comprehension",
            "Character analysis",
            "Theme and moral lessons",
            "Literary devices in prose",
          ],
        },
        {
          id: "e1-2",
          name: "Literature: Poems",
          status: "in-progress",
          progress: 70,
          date: "2024-03-08",
          materials: [],
          homework: "Memorize poem 1",
          keyPoints: [
            "Poetic devices and figures of speech",
            "Rhyme scheme and rhythm",
            "Central idea and theme",
            "Poet's message and interpretation",
          ],
        },
        {
          id: "e1-3",
          name: "Grammar: Tenses",
          status: "pending",
          progress: 0,
          date: "2024-03-12",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Present, past and future tenses",
            "Simple, continuous, perfect forms",
            "Usage in different contexts",
            "Common errors and corrections",
          ],
        },
        {
          id: "e1-4",
          name: "Grammar: Modals",
          status: "pending",
          progress: 0,
          date: "2024-03-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Types of modals and their uses",
            "Expressing ability, permission, obligation",
            "Probability and possibility",
            "Modal perfect forms",
          ],
        },
        {
          id: "e1-5",
          name: "Grammar: Subject–Verb Agreement",
          status: "pending",
          progress: 0,
          date: "2024-03-18",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Rules of subject-verb agreement",
            "Singular and plural subjects",
            "Collective nouns and agreement",
            "Special cases and exceptions",
          ],
        },
        {
          id: "e1-6",
          name: "Grammar: Determiners",
          status: "pending",
          progress: 0,
          date: "2024-03-22",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Articles - a, an, the",
            "Demonstratives and possessives",
            "Quantifiers and numbers",
            "Usage in sentences",
          ],
        },
        {
          id: "e1-7",
          name: "Writing Skills: Letter Writing",
          status: "pending",
          progress: 0,
          date: "2024-03-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Formal and informal letter formats",
            "Salutation and closing",
            "Body structure and paragraphing",
            "Tone and language appropriate",
          ],
        },
        {
          id: "e1-8",
          name: "Writing Skills: Paragraph Writing",
          status: "pending",
          progress: 0,
          date: "2024-03-28",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Topic sentence and structure",
            "Supporting details and examples",
            "Coherence and unity",
            "Concluding sentences",
          ],
        },
        {
          id: "e1-9",
          name: "Writing Skills: Analytical Paragraph",
          status: "pending",
          progress: 0,
          date: "2024-04-02",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Analyzing graphs, charts, tables",
            "Identifying trends and patterns",
            "Comparative analysis",
            "Logical conclusion drawing",
          ],
        },
      ],
    },
    {
      id: "social-sem1",
      name: "Social Science",
      topics: [
        {
          id: "ss1-1",
          name: "History: Nationalism in Europe",
          status: "completed",
          progress: 100,
          date: "2024-03-01",
          materials: [],
          homework: "Chapter questions",
          keyPoints: [
            "French Revolution and nationalism",
            "Rise of nationalism in Europe",
            "Age of revolutions (1830-1848)",
            "Unification of Germany and Italy",
          ],
        },
        {
          id: "ss1-2",
          name: "History: Nationalism in India",
          status: "in-progress",
          progress: 45,
          date: "2024-03-08",
          materials: [],
          homework: "Timeline activity",
          keyPoints: [
            "First War of Independence 1857",
            "Growth of nationalism",
            "Gandhian phase of nationalism",
            "Civil Disobedience Movement",
          ],
        },
        {
          id: "ss1-3",
          name: "Geography: Resources and Development",
          status: "pending",
          progress: 0,
          date: "2024-03-12",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Types and classification of resources",
            "Resource planning and conservation",
            "Land resources and degradation",
            "Soil types and conservation",
          ],
        },
        {
          id: "ss1-4",
          name: "Geography: Forest and Wildlife Resources",
          status: "pending",
          progress: 0,
          date: "2024-03-18",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Biodiversity and conservation",
            "Types of species",
            "Conservation of forests and wildlife",
            "Community and conservation efforts",
          ],
        },
        {
          id: "ss1-5",
          name: "Geography: Water Resources",
          status: "pending",
          progress: 0,
          date: "2024-03-22",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Water scarcity and need for management",
            "Multipurpose river projects",
            "Rainwater harvesting",
            "Water conservation techniques",
          ],
        },
        {
          id: "ss1-6",
          name: "Political Science: Power Sharing",
          status: "pending",
          progress: 0,
          date: "2024-03-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Why power sharing is desirable",
            "Forms of power sharing",
            "Federal government",
            "Belgium and Sri Lanka case studies",
          ],
        },
        {
          id: "ss1-7",
          name: "Political Science: Federalism",
          status: "pending",
          progress: 0,
          date: "2024-03-30",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "What is federalism",
            "Unitary and federal governments",
            "Federalism in India",
            "Decentralization in India",
          ],
        },
        {
          id: "ss1-8",
          name: "Economics: Development",
          status: "pending",
          progress: 0,
          date: "2024-04-02",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Economic development indicators",
            "Income and other goals",
            "National development",
            "Human Development Index (HDI)",
          ],
        },
        {
          id: "ss1-9",
          name: "Economics: Sectors of the Indian Economy",
          status: "pending",
          progress: 0,
          date: "2024-04-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Primary, Secondary, Tertiary sectors",
            "Comparing the sectors",
            "Organized and unorganized sectors",
            "Public and private sectors",
          ],
        },
      ],
    },
  ];

  const semester2Data = [
    {
      id: "math-sem2",
      name: "Mathematics",
      topics: [
        {
          id: "m2-1",
          name: "Trigonometry (Introduction, Identities, Heights & Distances)",
          status: "pending",
          progress: 0,
          date: "2024-04-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Trigonometric ratios",
            "Trigonometric identities",
            "Heights and distances applications",
            "Complementary angles",
          ],
        },
        {
          id: "m2-2",
          name: "Circles",
          status: "pending",
          progress: 0,
          date: "2024-04-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Tangent to a circle",
            "Number of tangents from a point",
            "Circle theorems",
            "Properties of tangents",
          ],
        },
        {
          id: "m2-3",
          name: "Constructions",
          status: "pending",
          progress: 0,
          date: "2024-04-20",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Division of line segment",
            "Construction of tangents",
            "Triangle constructions",
            "Geometric tools usage",
          ],
        },
        {
          id: "m2-4",
          name: "Areas Related to Circles",
          status: "pending",
          progress: 0,
          date: "2024-04-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Area of circle and sectors",
            "Area of segments",
            "Combination of plane figures",
            "Practical applications",
          ],
        },
        {
          id: "m2-5",
          name: "Surface Areas and Volumes",
          status: "pending",
          progress: 0,
          date: "2024-05-01",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Surface area of combinations",
            "Volume of combinations",
            "Frustum of cone",
            "Real-life applications",
          ],
        },
        {
          id: "m2-6",
          name: "Probability",
          status: "pending",
          progress: 0,
          date: "2024-05-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Theoretical probability",
            "Experimental probability",
            "Simple events",
            "Complementary events",
          ],
        },
      ],
    },
    {
      id: "science-sem2",
      name: "Science",
      topics: [
        {
          id: "s2-1",
          name: "Physics: Electricity",
          status: "pending",
          progress: 0,
          date: "2024-04-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Electric current and circuit",
            "Ohm's law",
            "Resistance and factors",
            "Electric power and energy",
          ],
        },
        {
          id: "s2-2",
          name: "Physics: Magnetic Effects of Electric Current",
          status: "pending",
          progress: 0,
          date: "2024-04-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Magnetic field and field lines",
            "Electromagnetic induction",
            "Electric motor",
            "Domestic electric circuits",
          ],
        },
        {
          id: "s2-3",
          name: "Physics: Sources of Energy",
          status: "pending",
          progress: 0,
          date: "2024-04-20",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Conventional sources of energy",
            "Non-conventional sources",
            "Renewable vs non-renewable",
            "Environmental consequences",
          ],
        },
        {
          id: "s2-4",
          name: "Chemistry: Carbon and its Compounds",
          status: "pending",
          progress: 0,
          date: "2024-04-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Covalent bonding in carbon",
            "Versatile nature of carbon",
            "Functional groups",
            "Important carbon compounds",
          ],
        },
        {
          id: "s2-5",
          name: "Chemistry: Periodic Classification of Elements",
          status: "pending",
          progress: 0,
          date: "2024-05-01",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Mendeleev's periodic table",
            "Modern periodic table",
            "Periodic trends",
            "Valency and electronic configuration",
          ],
        },
        {
          id: "s2-6",
          name: "Biology: Heredity and Evolution",
          status: "pending",
          progress: 0,
          date: "2024-05-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Heredity and inheritance",
            "Mendel's experiments",
            "Evolution and speciation",
            "Human evolution",
          ],
        },
        {
          id: "s2-7",
          name: "Biology: Environment",
          status: "pending",
          progress: 0,
          date: "2024-05-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Ecosystem components",
            "Food chains and webs",
            "Energy flow",
            "Ozone layer depletion",
          ],
        },
        {
          id: "s2-8",
          name: "Biology: Management of Natural Resources",
          status: "pending",
          progress: 0,
          date: "2024-05-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Sustainable development",
            "Forest conservation",
            "Water harvesting",
            "Coal and petroleum management",
          ],
        },
      ],
    },
    {
      id: "english-sem2",
      name: "English",
      topics: [
        {
          id: "e2-1",
          name: "Literature: Remaining prose & poetry chapters",
          status: "pending",
          progress: 0,
          date: "2024-04-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Advanced comprehension",
            "Critical analysis",
            "Literary appreciation",
            "Interpretation skills",
          ],
        },
        {
          id: "e2-2",
          name: "Grammar: Reported Speech",
          status: "pending",
          progress: 0,
          date: "2024-04-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Direct and indirect speech",
            "Reporting verbs",
            "Tense changes",
            "Question and command reporting",
          ],
        },
        {
          id: "e2-3",
          name: "Grammar: Passive Voice",
          status: "pending",
          progress: 0,
          date: "2024-04-20",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Active to passive conversion",
            "Passive voice in different tenses",
            "By-phrase usage",
            "When to use passive",
          ],
        },
        {
          id: "e2-4",
          name: "Grammar: Clauses",
          status: "pending",
          progress: 0,
          date: "2024-04-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Types of clauses",
            "Noun, adjective, adverb clauses",
            "Relative pronouns",
            "Complex sentence formation",
          ],
        },
        {
          id: "e2-5",
          name: "Writing Skills: Story Writing",
          status: "pending",
          progress: 0,
          date: "2024-05-01",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Plot development",
            "Character creation",
            "Setting description",
            "Dialogue and narration",
          ],
        },
        {
          id: "e2-6",
          name: "Writing Skills: Formal Emails",
          status: "pending",
          progress: 0,
          date: "2024-05-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Email structure",
            "Subject line importance",
            "Professional tone",
            "Formal language",
          ],
        },
        {
          id: "e2-7",
          name: "Writing Skills: Article Writing",
          status: "pending",
          progress: 0,
          date: "2024-05-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Article format",
            "Catchy headlines",
            "Factual content",
            "Target audience",
          ],
        },
      ],
    },
    {
      id: "social-sem2",
      name: "Social Science",
      topics: [
        {
          id: "ss2-1",
          name: "History: The Making of a Global World",
          status: "pending",
          progress: 0,
          date: "2024-04-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Pre-modern world",
            "Nineteenth century globalization",
            "The Great Depression",
            "Post-war economic order",
          ],
        },
        {
          id: "ss2-2",
          name: "History: The Age of Industrialisation",
          status: "pending",
          progress: 0,
          date: "2024-04-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Before the Industrial Revolution",
            "Hand labour and steam power",
            "Industrialisation in colonies",
            "Factories and workers",
          ],
        },
        {
          id: "ss2-3",
          name: "History: Print Culture and the Modern World",
          status: "pending",
          progress: 0,
          date: "2024-04-20",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "First printed books",
            "Print revolution",
            "Reading culture",
            "Print and censorship",
          ],
        },
        {
          id: "ss2-4",
          name: "Geography: Agriculture",
          status: "pending",
          progress: 0,
          date: "2024-04-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Types of farming",
            "Cropping patterns",
            "Major crops",
            "Agricultural development",
          ],
        },
        {
          id: "ss2-5",
          name: "Geography: Minerals and Energy Resources",
          status: "pending",
          progress: 0,
          date: "2024-05-01",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Types of minerals",
            "Ferrous and non-ferrous minerals",
            "Energy resources",
            "Conservation of minerals",
          ],
        },
        {
          id: "ss2-6",
          name: "Geography: Manufacturing Industries",
          status: "pending",
          progress: 0,
          date: "2024-05-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Classification of industries",
            "Industrial location",
            "Industrial pollution",
            "Industrial disasters",
          ],
        },
        {
          id: "ss2-7",
          name: "Geography: Lifelines of National Economy",
          status: "pending",
          progress: 0,
          date: "2024-05-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Transport and communication",
            "International trade",
            "Tourism as trade",
            "Digital India",
          ],
        },
        {
          id: "ss2-8",
          name: "Political Science: Democracy and Diversity",
          status: "pending",
          progress: 0,
          date: "2024-05-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Social divisions",
            "Politics of social divisions",
            "Overlapping identities",
            "Nation and diversity",
          ],
        },
        {
          id: "ss2-9",
          name: "Political Science: Gender, Religion and Caste",
          status: "pending",
          progress: 0,
          date: "2024-05-20",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Gender and politics",
            "Religion and politics",
            "Caste and politics",
            "Communalism and secularism",
          ],
        },
        {
          id: "ss2-10",
          name: "Political Science: Political Parties",
          status: "pending",
          progress: 0,
          date: "2024-05-25",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Functions of political parties",
            "Party system",
            "State and national parties",
            "Challenges to parties",
          ],
        },
        {
          id: "ss2-11",
          name: "Political Science: Outcomes of Democracy",
          status: "pending",
          progress: 0,
          date: "2024-05-30",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Accountability and legitimacy",
            "Economic outcomes",
            "Reduction of inequality",
            "Accommodation of diversity",
          ],
        },
        {
          id: "ss2-12",
          name: "Economics: Money and Credit",
          status: "pending",
          progress: 0,
          date: "2024-06-05",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Modern forms of money",
            "Need for banks",
            "Credit and loans",
            "Self Help Groups",
          ],
        },
        {
          id: "ss2-13",
          name: "Economics: Globalisation and the Indian Economy",
          status: "pending",
          progress: 0,
          date: "2024-06-10",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Production across countries",
            "Foreign trade",
            "MNCs and their role",
            "Impact of globalisation",
          ],
        },
        {
          id: "ss2-14",
          name: "Economics: Consumer Rights",
          status: "pending",
          progress: 0,
          date: "2024-06-15",
          materials: [],
          homework: "Not assigned",
          keyPoints: [
            "Consumer movement in India",
            "Consumer rights",
            "Consumer protection act",
            "Redressal mechanisms",
          ],
        },
      ],
    },
  ];

  const [syllabusData, setSyllabusData] = useState({
    semester1: semester1Data,
    semester2: semester2Data,
  });

  const currentSemesterData =
    selectedSemester === 1 ? syllabusData.semester1 : syllabusData.semester2;

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let totalTopics = 0;
    let completedProgress = 0;

    currentSemesterData.forEach((subject) => {
      subject.topics.forEach((topic) => {
        totalTopics++;
        completedProgress += topic.progress;
      });
    });

    return totalTopics > 0 ? Math.round(completedProgress / totalTopics) : 0;
  };

  const overallProgress = calculateOverallProgress();
  const totalCompletedTopics = currentSemesterData.reduce(
    (acc, subject) =>
      acc + subject.topics.filter((t) => t.status === "completed").length,
    0
  );
  const totalTopics = currentSemesterData.reduce(
    (acc, subject) => acc + subject.topics.length,
    0
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleMarkCompleted = (subjectId, topicId) => {
    setSyllabusData((prev) => {
      const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
      return {
        ...prev,
        [semesterKey]: prev[semesterKey].map((subject) =>
          subject.id === subjectId
            ? {
                ...subject,
                topics: subject.topics.map((topic) =>
                  topic.id === topicId
                    ? { ...topic, status: "completed", progress: 100 }
                    : topic
                ),
              }
            : subject
        ),
      };
    });
  };

  const handleMarkInProgress = (subjectId, topicId) => {
    setSyllabusData((prev) => {
      const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
      return {
        ...prev,
        [semesterKey]: prev[semesterKey].map((subject) =>
          subject.id === subjectId
            ? {
                ...subject,
                topics: subject.topics.map((topic) =>
                  topic.id === topicId
                    ? {
                        ...topic,
                        status: "in-progress",
                        progress: topic.progress || 30,
                      }
                    : topic
                ),
              }
            : subject
        ),
      };
    });
  };

  const handleReschedule = (subjectId, topicId) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    if (newDate) {
      setSyllabusData((prev) => {
        const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
        return {
          ...prev,
          [semesterKey]: prev[semesterKey].map((subject) =>
            subject.id === subjectId
              ? {
                  ...subject,
                  topics: subject.topics.map((topic) =>
                    topic.id === topicId ? { ...topic, date: newDate } : topic
                  ),
                }
              : subject
          ),
        };
      });
    }
  };

  const handleShare = (subjectId, topicId) => {
    const subject = currentSemesterData.find((s) => s.id === subjectId);
    const topic = subject?.topics.find((t) => t.id === topicId);
    if (topic) {
      alert(
        `Sharing: ${topic.name}\nDate: ${topic.date}\nHomework: ${topic.homework}`
      );
    }
  };

  const handleOpenUploadModal = (subjectId, topicId) => {
    setSelectedTopicForUpload(`${subjectId}:${topicId}`);
    setUploadModalOpen(true);
  };

  const handleOpenHomeworkModal = (subjectId, topicId) => {
    const subject = currentSemesterData.find((s) => s.id === subjectId);
    const topic = subject?.topics.find((t) => t.id === topicId);
    if (topic) {
      setHomeworkText(topic.homework === "Not assigned" ? "" : topic.homework);
    }
    setSelectedTopicForUpload(`${subjectId}:${topicId}`);
    setHomeworkModalOpen(true);
  };

  const handleAddYoutubeLink = () => {
    if (youtubeLink && selectedTopicForUpload) {
      const [subjectId, topicId] = selectedTopicForUpload.split(":");
      setSyllabusData((prev) => {
        const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
        return {
          ...prev,
          [semesterKey]: prev[semesterKey].map((subject) =>
            subject.id === subjectId
              ? {
                  ...subject,
                  topics: subject.topics.map((topic) =>
                    topic.id === topicId
                      ? {
                          ...topic,
                          materials: [
                            ...topic.materials,
                            {
                              type: "youtube",
                              name: "YouTube Video",
                              url: youtubeLink,
                            },
                          ],
                        }
                      : topic
                  ),
                }
              : subject
          ),
        };
      });
      setYoutubeLink("");
    }
  };

  const handleFileUpload = (event, fileType) => {
    const files = event.target.files;
    if (files && files.length > 0 && selectedTopicForUpload) {
      const [subjectId, topicId] = selectedTopicForUpload.split(":");
      const file = files[0];

      // Create a blob URL for the file
      const fileUrl = URL.createObjectURL(file);

      setSyllabusData((prev) => {
        const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
        return {
          ...prev,
          [semesterKey]: prev[semesterKey].map((subject) =>
            subject.id === subjectId
              ? {
                  ...subject,
                  topics: subject.topics.map((topic) =>
                    topic.id === topicId
                      ? {
                          ...topic,
                          materials: [
                            ...topic.materials,
                            { type: fileType, name: file.name, url: fileUrl },
                          ],
                        }
                      : topic
                  ),
                }
              : subject
          ),
        };
      });
    }
  };

  const handleSaveHomework = () => {
    if (selectedTopicForUpload) {
      const [subjectId, topicId] = selectedTopicForUpload.split(":");
      setSyllabusData((prev) => {
        const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
        return {
          ...prev,
          [semesterKey]: prev[semesterKey].map((subject) =>
            subject.id === subjectId
              ? {
                  ...subject,
                  topics: subject.topics.map((topic) =>
                    topic.id === topicId
                      ? { ...topic, homework: homeworkText || "Not assigned" }
                      : topic
                  ),
                }
              : subject
          ),
        };
      });
      setHomeworkModalOpen(false);
      setHomeworkText("");
    }
  };

  const handleRemoveMaterial = (subjectId, topicId, materialIndex) => {
    setSyllabusData((prev) => {
      const semesterKey = selectedSemester === 1 ? "semester1" : "semester2";
      return {
        ...prev,
        [semesterKey]: prev[semesterKey].map((subject) =>
          subject.id === subjectId
            ? {
                ...subject,
                topics: subject.topics.map((topic) =>
                  topic.id === topicId
                    ? {
                        ...topic,
                        materials: topic.materials.filter(
                          (_, idx) => idx !== materialIndex
                        ),
                      }
                    : topic
                ),
              }
            : subject
        ),
      };
    });
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case "pdf":
        return <File size={16} className="text-red-500" />;
      case "ppt":
        return <Presentation size={16} className="text-orange-500" />;
      case "video":
        return <Video size={16} className="text-purple-500" />;
      case "youtube":
        return <Youtube size={16} className="text-red-600" />;
      default:
        return <FileText size={16} />;
    }
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const isSubjectExpanded = (subjectId) => {
    return expandedSubjects.includes(subjectId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Syllabus & Lesson Plan</h2>
          <p className="text-slate-500">
            Track syllabus progress and manage lesson plans
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="10th A">10th A</option>
            <option value="10th B">10th B</option>
            <option value="11th A">11th A</option>
            <option value="12th A">12th A</option>
          </select>
        </div>
      </div>

      {/* Semester Toggle */}
      <div className="flex items-center justify-center gap-4 bg-white rounded-xl p-2 shadow-sm border border-slate-100 w-fit mx-auto">
        <button
          onClick={() => setSelectedSemester(1)}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            selectedSemester === 1
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          📌 Semester 1
        </button>
        <button
          onClick={() => setSelectedSemester(2)}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            selectedSemester === 2
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          📌 Semester 2
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm mb-2">
              Semester {selectedSemester} - Overall Completion
            </p>
            <h3 className="text-3xl font-bold">{overallProgress}%</h3>
            <p className="text-indigo-100 text-sm mt-2">
              {totalCompletedTopics} of {totalTopics} topics completed
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <BookOpen size={48} className="opacity-80" />
          </div>
        </div>
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-lg transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Subjects and Topics */}
      {currentSemesterData.map((subject) => (
        <div key={subject.id} className="space-y-4">
          {/* Subject Header - Clickable */}
          <button
            onClick={() => toggleSubject(subject.id)}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl p-5 text-white hover:from-slate-800 hover:to-slate-700 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {subject.name === "Mathematics" && "🔢"}
                  {subject.name === "Science" && "🧪"}
                  {subject.name === "English" && "📖"}
                  {subject.name === "Social Science" && "🌍"}
                </span>
                <div className="text-left">
                  <h3 className="text-xl font-bold">{subject.name}</h3>
                  <p className="text-slate-200 text-sm mt-1">
                    {
                      subject.topics.filter((t) => t.status === "completed")
                        .length
                    }{" "}
                    / {subject.topics.length} topics completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSubjectExpanded(subject.id) ? (
                  <ChevronDown size={24} className="text-white" />
                ) : (
                  <ChevronRight size={24} className="text-white" />
                )}
              </div>
            </div>
          </button>

          {/* Topics - Only show when expanded */}
          {isSubjectExpanded(subject.id) && (
            <div className="space-y-4 ml-2">
              {subject.topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`bg-white p-6 rounded-xl border-2 ${getStatusColor(
                    topic.status
                  )} shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold">{topic.name}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            topic.status
                          )}`}
                        >
                          {topic.status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={12} />
                              Completed
                            </span>
                          ) : topic.status === "in-progress" ? (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              In Progress
                            </span>
                          ) : (
                            "Pending"
                          )}
                        </span>
                      </div>

                      {/* Key Points */}
                      <div className="mb-3 bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          📚 Key Learning Points:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {topic.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Progress Bar */}
                      {topic.status !== "pending" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">
                              Progress
                            </span>
                            <span className="text-xs font-medium">
                              {topic.progress}%
                            </span>
                          </div>
                          <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                topic.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${topic.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-slate-400" />
                          <span className="text-slate-600">
                            Scheduled: {topic.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-slate-600">
                            Homework: {topic.homework}
                          </span>
                        </div>
                      </div>

                      {/* Materials */}
                      {topic.materials.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-slate-700 mb-2">
                            Teaching Materials:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {topic.materials.map((material, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              >
                                {getMaterialIcon(material.type)}
                                {material.url ? (
                                  <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                  >
                                    {material.name}
                                  </a>
                                ) : (
                                  <span className="text-slate-700">
                                    {material.name}
                                  </span>
                                )}
                                {material.url && (
                                  <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800"
                                    title="Open material"
                                  >
                                    <LinkIcon size={14} />
                                  </a>
                                )}
                                <button
                                  onClick={() =>
                                    handleRemoveMaterial(
                                      subject.id,
                                      topic.id,
                                      idx
                                    )
                                  }
                                  className="text-red-500 hover:text-red-700 ml-1"
                                  title="Remove material"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vertical Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {topic.status === "pending" && (
                        <button
                          onClick={() =>
                            handleMarkInProgress(subject.id, topic.id)
                          }
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Clock size={14} />
                          Start
                        </button>
                      )}
                      {topic.status !== "completed" && (
                        <button
                          onClick={() =>
                            handleMarkCompleted(subject.id, topic.id)
                          }
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <CheckCircle size={14} />
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleReschedule(subject.id, topic.id)}
                        className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Calendar size={14} />
                        Reschedule
                      </button>
                      <button
                        onClick={() =>
                          handleOpenUploadModal(subject.id, topic.id)
                        }
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Upload size={14} />
                        Materials
                      </button>
                      <button
                        onClick={() =>
                          handleOpenHomeworkModal(subject.id, topic.id)
                        }
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <FileText size={14} />
                        Homework
                      </button>
                      <button
                        onClick={() => handleShare(subject.id, topic.id)}
                        className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Share2 size={14} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Upload Materials Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Upload className="text-indigo-600" size={24} />
                Upload Teaching Materials
              </h3>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setYoutubeLink("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* YouTube Link */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Youtube className="text-red-600" size={20} />
                  YouTube Video Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddYoutubeLink}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <File className="text-red-500" size={20} />
                  Upload PDF
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, "pdf")}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>

              {/* PPT Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Presentation className="text-orange-500" size={20} />
                  Upload PowerPoint (PPT/PPTX)
                </label>
                <input
                  type="file"
                  accept=".ppt,.pptx"
                  onChange={(e) => handleFileUpload(e, "ppt")}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Video className="text-purple-500" size={20} />
                  Upload Video (MP4, AVI, MOV)
                </label>
                <input
                  type="file"
                  accept=".mp4,.avi,.mov,.mkv"
                  onChange={(e) => handleFileUpload(e, "video")}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    setYoutubeLink("");
                  }}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Homework Modal */}
      {homeworkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-purple-600" size={24} />
                Set Homework
              </h3>
              <button
                onClick={() => {
                  setHomeworkModalOpen(false);
                  setHomeworkText("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Homework Description
                </label>
                <textarea
                  value={homeworkText}
                  onChange={(e) => setHomeworkText(e.target.value)}
                  placeholder="Enter homework details, exercises, or assignments..."
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setHomeworkModalOpen(false);
                    setHomeworkText("");
                  }}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHomework}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Save Homework
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusManagement;
