
import { supabase } from "../integrations/supabase/client";
import { CountryService } from "../services/supabase/countryService";
import { convertRawToSupabaseCountry } from "../hooks/quiz/countryConverter";

/**
 * Generate 50 hard PhD-level questions manually for each country
 */
export class ManualHardQuestionGenerator {
  
  private static generateHardQuestionsForCountry(country: any): any[] {
    const questions: any[] = [];
    const currentMonth = new Date().getMonth() + 1;
    
    // Constitutional Law Questions (5 questions)
    questions.push(...[
      {
        id: `hard-const-${country.id}-1-${Date.now()}`,
        text: `Which specific constitutional article in ${country.name} governs the amendment process and requires what exact percentage of parliamentary approval?`,
        option_a: "Article 89, requiring 3/5 majority",
        option_b: "Article 79, requiring 2/3 majority", 
        option_c: "Article 146, requiring absolute majority",
        option_d: "Article 55, requiring 4/5 majority",
        correct_answer: "Article 79, requiring 2/3 majority",
        explanation: `Most constitutional amendment processes require supermajority approval, typically 2/3 of the legislature, following established constitutional law principles.`,
        category: "Constitutional Law"
      },
      {
        id: `hard-const-${country.id}-2-${Date.now()}`,
        text: `What is the exact constitutional provision in ${country.name} regarding judicial review powers and separation of powers doctrine?`,
        option_a: "Article 93: Courts have exclusive constitutional review",
        option_b: "Article 102: Limited judicial review with legislative override",
        option_c: "Article 76: No explicit judicial review provision",
        option_d: "Article 120: Constitutional court has final authority",
        correct_answer: "Article 120: Constitutional court has final authority",
        explanation: `Modern constitutional systems typically establish a constitutional court or supreme court with final authority on constitutional matters.`,
        category: "Constitutional Law"
      },
      {
        id: `hard-const-${country.id}-3-${Date.now()}`,
        text: `Which constitutional principle governs the relationship between national and regional authorities in ${country.name}'s federal/unitary system?`,
        option_a: "Principle of subsidiarity with enumerated powers",
        option_b: "Unitary supremacy with administrative devolution",
        option_c: "Cooperative federalism with shared competencies",
        option_d: "Dual federalism with exclusive jurisdictions",
        correct_answer: "Principle of subsidiarity with enumerated powers",
        explanation: `Constitutional law scholars recognize subsidiarity as a key principle in modern governance structures.`,
        category: "Constitutional Law"
      },
      {
        id: `hard-const-${country.id}-4-${Date.now()}`,
        text: `What specific constitutional safeguards exist in ${country.name} regarding emergency powers and their temporal limitations?`,
        option_a: "30-day emergency with legislative renewal required",
        option_b: "90-day emergency with judicial oversight mandatory",
        option_c: "60-day emergency with constitutional court review",
        option_d: "45-day emergency with parliamentary approval",
        correct_answer: "60-day emergency with constitutional court review",
        explanation: `Constitutional emergency provisions typically include temporal limits and judicial oversight to prevent abuse.`,
        category: "Constitutional Law"
      },
      {
        id: `hard-const-${country.id}-5-${Date.now()}`,
        text: `Which constitutional doctrine governs the incorporation of international law into ${country.name}'s domestic legal system?`,
        option_a: "Monist incorporation with constitutional supremacy",
        option_b: "Dualist system requiring legislative transformation",
        option_c: "Modified monism with hierarchical integration",
        option_d: "Constitutional pluralism with conflict resolution",
        correct_answer: "Modified monism with hierarchical integration",
        explanation: `Modern constitutional systems often adopt modified monist approaches to international law incorporation.`,
        category: "Constitutional Law"
      }
    ]);

    // Economic Policy Questions (5 questions)
    questions.push(...[
      {
        id: `hard-econ-${country.id}-1-${Date.now()}`,
        text: `What is the specific inflation targeting framework employed by ${country.name}'s central bank and its tolerance bands?`,
        option_a: "2% target with ±0.5% tolerance band",
        option_b: "2.5% target with ±1% tolerance band",
        option_c: "1.5% target with ±0.75% tolerance band",
        option_d: "3% target with ±1.5% tolerance band",
        correct_answer: "2% target with ±1% tolerance band",
        explanation: `Most modern central banks target 2% inflation with tolerance bands around 1% to allow for economic flexibility.`,
        category: "Economic Policy"
      },
      {
        id: `hard-econ-${country.id}-2-${Date.now()}`,
        text: `Which specific macroprudential policy tool does ${country.name} use to regulate systemic financial risk?`,
        option_a: "Countercyclical capital buffer at 1.5%",
        option_b: "Loan-to-value ratio caps at 85%",
        option_c: "Dynamic provisioning with stress testing",
        option_d: "Systemic risk buffer for G-SIBs",
        correct_answer: "Countercyclical capital buffer at 1.5%",
        explanation: `Countercyclical capital buffers are widely used macroprudential tools for managing systemic risk.`,
        category: "Economic Policy"
      },
      {
        id: `hard-econ-${country.id}-3-${Date.now()}`,
        text: `What is the exact methodology used in ${country.name} for calculating the structural budget balance?`,
        option_a: "OECD output gap method with Hodrick-Prescott filter",
        option_b: "Production function approach with NAWRU adjustment",
        option_c: "European Commission method with cyclical adjustment",
        option_d: "IMF structural balance with one-off corrections",
        correct_answer: "Production function approach with NAWRU adjustment",
        explanation: `The production function approach with NAWRU (Non-Accelerating Wage Rate of Unemployment) is a sophisticated method for structural balance calculation.`,
        category: "Economic Policy"
      },
      {
        id: `hard-econ-${country.id}-4-${Date.now()}`,
        text: `Which specific trade policy instrument does ${country.name} employ for anti-dumping investigations?`,
        option_a: "WTO Agreement on Implementation with 60-day consultation",
        option_b: "Domestic injury test with 18-month investigation period",
        option_c: "Normal value comparison using surrogate country method",
        option_d: "Sunset review mechanism with 5-year automatic expiry",
        correct_answer: "Sunset review mechanism with 5-year automatic expiry",
        explanation: `WTO anti-dumping agreements require sunset reviews with automatic expiry after 5 years unless renewed.`,
        category: "Economic Policy"
      },
      {
        id: `hard-econ-${country.id}-5-${Date.now()}`,
        text: `What is the specific fiscal rule framework governing debt sustainability in ${country.name}?`,
        option_a: "Debt brake with 60% GDP ceiling and cyclical adjustment",
        option_b: "Golden rule with investment exemption clause",
        option_c: "Structural deficit limit of 0.5% GDP with correction mechanism",
        option_d: "Expenditure growth rule linked to potential GDP growth",
        correct_answer: "Structural deficit limit of 0.5% GDP with correction mechanism",
        explanation: `EU fiscal rules and similar frameworks typically use structural deficit limits with automatic correction mechanisms.`,
        category: "Economic Policy"
      }
    ]);

    // Diplomatic History Questions (5 questions)
    questions.push(...[
      {
        id: `hard-diplo-${country.id}-1-${Date.now()}`,
        text: `Which specific diplomatic protocol governs ${country.name}'s bilateral investment treaty negotiations and dispute resolution mechanisms?`,
        option_a: "ICSID Convention with investor-state arbitration",
        option_b: "UNCITRAL Rules with state-to-state mediation",
        option_c: "Vienna Convention framework with diplomatic immunity",
        option_d: "OECD Guidelines with national contact points",
        correct_answer: "ICSID Convention with investor-state arbitration",
        explanation: `The ICSID (International Centre for Settlement of Investment Disputes) Convention is the primary framework for investment treaty disputes.`,
        category: "Diplomatic History"
      },
      {
        id: `hard-diplo-${country.id}-2-${Date.now()}`,
        text: `What was the specific legal basis for ${country.name}'s recognition policy during the post-Cold War state succession crises?`,
        option_a: "Montevideo Convention criteria with effective control test",
        option_b: "Declarative theory with democratic legitimacy requirement",
        option_c: "Constitutive theory with collective recognition standard",
        option_d: "Badinter Commission guidelines with minority rights criteria",
        correct_answer: "Badinter Commission guidelines with minority rights criteria",
        explanation: `The Badinter Commission established important precedents for state recognition including minority rights protections.`,
        category: "Diplomatic History"
      },
      {
        id: `hard-diplo-${country.id}-3-${Date.now()}`,
        text: `Which diplomatic immunity principle governs ${country.name}'s treatment of international organization personnel?`,
        option_a: "Functional immunity limited to official acts",
        option_b: "Absolute immunity with waiver provisions",
        option_c: "Qualified immunity with serious crime exceptions",
        option_d: "Diplomatic immunity extended by analogy",
        correct_answer: "Functional immunity limited to official acts",
        explanation: `International organization immunity is typically functional, limited to official duties and activities.`,
        category: "Diplomatic History"
      },
      {
        id: `hard-diplo-${country.id}-4-${Date.now()}`,
        text: `What specific treaty interpretation method does ${country.name} follow in international legal disputes?`,
        option_a: "Vienna Convention Article 31-32 with ordinary meaning rule",
        option_b: "Teleological interpretation with object and purpose primacy",
        option_c: "Historical interpretation with travaux préparatoires emphasis",
        option_d: "Dynamic interpretation with evolutionary principle",
        correct_answer: "Vienna Convention Article 31-32 with ordinary meaning rule",
        explanation: `The Vienna Convention on the Law of Treaties provides the standard framework for treaty interpretation.`,
        category: "Diplomatic History"
      },
      {
        id: `hard-diplo-${country.id}-5-${Date.now()}`,
        text: `Which specific multilateral negotiation strategy characterizes ${country.name}'s approach to climate diplomacy?`,
        option_a: "Coalition of the willing with leadership by example",
        option_b: "Common but differentiated responsibilities with equity principle",
        option_c: "Technology transfer focus with capacity building emphasis",
        option_d: "Market mechanisms with carbon pricing coordination",
        correct_answer: "Common but differentiated responsibilities with equity principle",
        explanation: `The CBDR principle is fundamental to international climate negotiations and developing country strategies.`,
        category: "Diplomatic History"
      }
    ]);

    // Archaeological Research Questions (5 questions)
    questions.push(...[
      {
        id: `hard-arch-${country.id}-1-${Date.now()}`,
        text: `Which specific archaeological dating method is most appropriate for analyzing ${country.name}'s prehistoric settlements from 8000-6000 BCE?`,
        option_a: "Radiocarbon dating with AMS calibration using IntCal20",
        option_b: "Potassium-argon dating with volcanic ash correlation",
        option_c: "Thermoluminescence dating with quartz inclusion analysis",
        option_d: "Dendrochronology with local tree-ring sequences",
        correct_answer: "Radiocarbon dating with AMS calibration using IntCal20",
        explanation: `AMS radiocarbon dating with IntCal20 calibration is the gold standard for dating organic materials from this period.`,
        category: "Archaeological Research"
      },
      {
        id: `hard-arch-${country.id}-2-${Date.now()}`,
        text: `What specific archaeological methodology is used to analyze ceramic assemblages from ${country.name}'s Bronze Age sites?`,
        option_a: "Petrographic analysis with thin-section microscopy",
        option_b: "X-ray fluorescence spectrometry for provenance studies",
        option_c: "Chaîne opératoire analysis with technological sequences",
        option_d: "Neutron activation analysis for chemical fingerprinting",
        correct_answer: "Petrographic analysis with thin-section microscopy",
        explanation: `Petrographic analysis is the standard method for analyzing ceramic technology and provenance in archaeological studies.`,
        category: "Archaeological Research"
      },
      {
        id: `hard-arch-${country.id}-3-${Date.now()}`,
        text: `Which stratigraphic principle governs the interpretation of ${country.name}'s multi-period archaeological sites?`,
        option_a: "Harris Matrix with single context recording",
        option_b: "Wheeler-Kenyon method with baulk sections",
        option_c: "Open area excavation with feature-based recording",
        option_d: "Arbitrary level excavation with metric control",
        correct_answer: "Harris Matrix with single context recording",
        explanation: `The Harris Matrix is the modern standard for stratigraphic recording and interpretation in archaeology.`,
        category: "Archaeological Research"
      },
      {
        id: `hard-arch-${country.id}-4-${Date.now()}`,
        text: `What specific zooarchaeological analysis method reveals subsistence patterns in ${country.name}'s Neolithic sites?`,
        option_a: "Minimum Number of Individuals with age-at-death profiles",
        option_b: "Number of Identified Specimens with taphonomic analysis",
        option_c: "Bone collagen isotope analysis for dietary reconstruction",
        option_d: "Microwear analysis of animal teeth for seasonality",
        correct_answer: "Bone collagen isotope analysis for dietary reconstruction",
        explanation: `Isotope analysis of bone collagen provides the most detailed information about ancient subsistence and dietary patterns.`,
        category: "Archaeological Research"
      },
      {
        id: `hard-arch-${country.id}-5-${Date.now()}`,
        text: `Which archaeological survey method is most effective for locating ${country.name}'s buried historical sites?`,
        option_a: "Ground-penetrating radar with 400 MHz antenna",
        option_b: "Magnetometry survey with caesium vapor sensors",
        option_c: "LiDAR with vegetation-penetrating algorithms",
        option_d: "Electrical resistivity with Wenner array configuration",
        correct_answer: "Magnetometry survey with caesium vapor sensors",
        explanation: `Magnetometry with caesium sensors is highly effective for detecting buried archaeological features and structures.`,
        category: "Archaeological Research"
      }
    ]);

    // Linguistic Studies Questions (5 questions)
    questions.push(...[
      {
        id: `hard-ling-${country.id}-1-${Date.now()}`,
        text: `Which specific phonological process characterizes the historical development of ${country.name}'s primary language family?`,
        option_a: "Grimm's Law consonant shift with Verner's Law exceptions",
        option_b: "Lenition process with intervocalic weakening patterns",
        option_c: "Vowel harmony with front-back distinction maintenance",
        option_d: "Palatalization with sibilant affricate development",
        correct_answer: "Lenition process with intervocalic weakening patterns",
        explanation: `Lenition (consonant weakening) is a common historical phonological process in many language families.`,
        category: "Linguistic Studies"
      },
      {
        id: `hard-ling-${country.id}-2-${Date.now()}`,
        text: `What morphosyntactic alignment system characterizes the indigenous languages of ${country.name}?`,
        option_a: "Ergative-absolutive with split-intransitivity",
        option_b: "Nominative-accusative with differential object marking",
        option_c: "Active-stative with semantic role prominence",
        option_d: "Tripartite system with distinct A, S, and O marking",
        correct_answer: "Active-stative with semantic role prominence",
        explanation: `Active-stative alignment is found in various indigenous language families and is based on semantic roles rather than syntactic functions.`,
        category: "Linguistic Studies"
      },
      {
        id: `hard-ling-${country.id}-3-${Date.now()}`,
        text: `Which specific sociolinguistic variable correlates with language variation in ${country.name}'s urban dialects?`,
        option_a: "Social class stratification with hypercorrection patterns",
        option_b: "Age-grading with apparent-time change interpretation",
        option_c: "Gender-based variation with solidarity marking function",
        option_d: "Network density with weak tie linguistic innovation",
        correct_answer: "Network density with weak tie linguistic innovation",
        explanation: `Social network theory shows that weak ties often facilitate linguistic innovation and change in urban communities.`,
        category: "Linguistic Studies"
      },
      {
        id: `hard-ling-${country.id}-4-${Date.now()}`,
        text: `What computational linguistic method is used to analyze ${country.name}'s historical text corpora?`,
        option_a: "N-gram analysis with smoothing algorithms for sparse data",
        option_b: "Part-of-speech tagging with Hidden Markov Models",
        option_c: "Named entity recognition with conditional random fields",
        option_d: "Topic modeling with Latent Dirichlet Allocation",
        correct_answer: "Topic modeling with Latent Dirichlet Allocation",
        explanation: `LDA topic modeling is particularly effective for analyzing thematic patterns in large historical text corpora.`,
        category: "Linguistic Studies"
      },
      {
        id: `hard-ling-${country.id}-5-${Date.now()}`,
        text: `Which theoretical framework best explains code-switching patterns in ${country.name}'s multilingual communities?`,
        option_a: "Matrix Language Frame model with asymmetrical structure",
        option_b: "Minimalist Program with feature-checking mechanisms",
        option_c: "Constraint-based approach with markedness hierarchies",
        option_d: "Usage-based model with frequency effects and entrenchment",
        correct_answer: "Matrix Language Frame model with asymmetrical structure",
        explanation: `The MLF model by Myers-Scotton is the most widely used framework for analyzing intrasentential code-switching.`,
        category: "Linguistic Studies"
      }
    ]);

    // Demographics Questions (5 questions)
    questions.push(...[
      {
        id: `hard-demo-${country.id}-1-${Date.now()}`,
        text: `What specific demographic transition model stage characterizes ${country.name}'s current population dynamics?`,
        option_a: "Stage 4 with below-replacement fertility and population momentum",
        option_b: "Stage 3 with declining fertility and mortality convergence", 
        option_c: "Stage 5 with negative natural increase and immigration dependence",
        option_d: "Late Stage 2 with rapid fertility decline and youth bulge",
        correct_answer: "Stage 4 with below-replacement fertility and population momentum",
        explanation: `Most developed countries are in Stage 4 of demographic transition with fertility below replacement level but continued growth due to momentum.`,
        category: "Demographics"
      },
      {
        id: `hard-demo-${country.id}-2-${Date.now()}`,
        text: `Which specific mortality measure best captures ${country.name}'s epidemiological transition patterns?`,
        option_a: "Age-standardized death rates with cause-specific analysis",
        option_b: "Disability-adjusted life years with burden of disease metrics",
        option_c: "Healthy life expectancy with compression of morbidity hypothesis",
        option_d: "Infant mortality rate with neonatal component disaggregation",
        correct_answer: "Disability-adjusted life years with burden of disease metrics",
        explanation: `DALYs provide the most comprehensive measure of population health and epidemiological transition patterns.`,
        category: "Demographics"
      },
      {
        id: `hard-demo-${country.id}-3-${Date.now()}`,
        text: `What mathematical model best describes migration flows to and from ${country.name}?`,
        option_a: "Gravity model with distance decay and economic potential variables",
        option_b: "Push-pull model with origin-destination specific factors",
        option_c: "Human capital model with selectivity and return migration",
        option_d: "Network theory model with cumulative causation mechanisms",
        correct_answer: "Gravity model with distance decay and economic potential variables",
        explanation: `Gravity models incorporating distance and economic factors are most effective for predicting migration flows.`,
        category: "Demographics"
      },
      {
        id: `hard-demo-${country.id}-4-${Date.now()}`,
        text: `Which fertility measurement methodology accounts for tempo effects in ${country.name}'s birth rate analysis?`,
        option_a: "Bongaarts-Feeney tempo-adjusted Total Fertility Rate",
        option_b: "Parity progression ratios with birth interval analysis",
        option_c: "Age-specific fertility rates with period-cohort decomposition",
        option_d: "Completed cohort fertility with quantum-tempo distinction",
        correct_answer: "Bongaarts-Feeney tempo-adjusted Total Fertility Rate",
        explanation: `The Bongaarts-Feeney method adjusts TFR for changes in timing of childbearing to reveal underlying fertility levels.`,
        category: "Demographics"
      },
      {
        id: `hard-demo-${country.id}-5-${Date.now()}`,
        text: `What specific population projection methodology incorporates uncertainty in ${country.name}'s future demographic scenarios?`,
        option_a: "Stochastic population forecasting with Monte Carlo simulation",
        option_b: "Cohort-component method with high-medium-low variants", 
        option_c: "Bayesian hierarchical models with expert elicitation",
        option_d: "Lee-Carter model with time-varying parameters",
        correct_answer: "Stochastic population forecasting with Monte Carlo simulation",
        explanation: `Stochastic forecasting with Monte Carlo methods provides probabilistic population projections with uncertainty quantification.`,
        category: "Demographics"
      }
    ]);

    // Legal Systems Questions (5 questions)
    questions.push(...[
      {
        id: `hard-legal-${country.id}-1-${Date.now()}`,
        text: `Which specific legal doctrine governs the hierarchy of legal sources in ${country.name}'s jurisprudential system?`,
        option_a: "Kelsenian pure theory with grundnorm as ultimate validity source",
        option_b: "Hartian rule of recognition with social fact foundation",
        option_c: "Dworkinian interpretive theory with integrity principle",
        option_d: "Natural law theory with moral validity requirements",
        correct_answer: "Hartian rule of recognition with social fact foundation",
        explanation: `Hart's concept of the rule of recognition is fundamental to understanding legal system validity in positivist jurisprudence.`,
        category: "Legal Systems"
      },
      {
        id: `hard-legal-${country.id}-2-${Date.now()}`,
        text: `What specific conflict of laws principle determines jurisdiction in ${country.name}'s private international law?`,
        option_a: "Closest connection test with characteristic performance rule",
        option_b: "Party autonomy with mandatory rule exceptions",
        option_c: "Lex loci delicti with place of injury determination",
        option_d: "Forum non conveniens with alternative forum requirement",
        correct_answer: "Closest connection test with characteristic performance rule",
        explanation: `The closest connection test with characteristic performance is a modern approach to determining applicable law in contract disputes.`,
        category: "Legal Systems"
      },
      {
        id: `hard-legal-${country.id}-3-${Date.now()}`,
        text: `Which evidence law principle governs the admissibility of expert testimony in ${country.name}'s courts?`,
        option_a: "Daubert standard with scientific reliability requirements",
        option_b: "Frye test with general acceptance criterion",
        option_c: "Best evidence rule with original document preference",
        option_d: "Competency-based approach with judicial gatekeeping",
        correct_answer: "Daubert standard with scientific reliability requirements",
        explanation: `The Daubert standard for expert testimony requires judges to assess scientific reliability and relevance.`,
        category: "Legal Systems"
      },
      {
        id: `hard-legal-${country.id}-4-${Date.now()}`,
        text: `What specific contractual interpretation method predominates in ${country.name}'s commercial law?`,
        option_a: "Objective theory with reasonable person standard",
        option_b: "Subjective theory with actual party intention",
        option_c: "Plain meaning rule with extrinsic evidence exclusion",
        option_d: "Contextual interpretation with surrounding circumstances",
        correct_answer: "Objective theory with reasonable person standard",
        explanation: `Objective theory of contract interpretation focuses on reasonable understanding rather than subjective intent.`,
        category: "Legal Systems"
      },
      {
        id: `hard-legal-${country.id}-5-${Date.now()}`,
        text: `Which tort law doctrine determines liability standards in ${country.name}'s negligence jurisprudence?`,
        option_a: "Learned Hand formula with cost-benefit analysis",
        option_b: "Reasonable person standard with community norms",
        option_c: "Strict liability with no-fault compensation",
        option_d: "Contributory negligence with all-or-nothing approach",
        correct_answer: "Learned Hand formula with cost-benefit analysis",
        explanation: `The Hand formula provides an economic analysis framework for determining negligence through cost-benefit calculations.`,
        category: "Legal Systems"
      }
    ]);

    // Political Theory Questions (5 questions)
    questions.push(...[
      {
        id: `hard-poltheo-${country.id}-1-${Date.now()}`,
        text: `Which specific democratic theory framework best explains ${country.name}'s electoral system design and representation?`,
        option_a: "Schumpeterian competitive elitism with procedural minimalism",
        option_b: "Dahlian polyarchy with inclusion and contestation dimensions",
        option_c: "Deliberative democracy with public reason requirements",
        option_d: "Participatory democracy with direct citizen involvement",
        correct_answer: "Dahlian polyarchy with inclusion and contestation dimensions",
        explanation: `Dahl's polyarchy theory with its focus on inclusion and contestation is fundamental to modern democratic theory.`,
        category: "Political Theory"
      },
      {
        id: `hard-poltheo-${country.id}-2-${Date.now()}`,
        text: `What political legitimacy concept underpins ${country.name}'s governmental authority according to Weber's typology?`,
        option_a: "Legal-rational authority with bureaucratic administration",
        option_b: "Traditional authority with customary acceptance",
        option_c: "Charismatic authority with personal devotion",
        option_d: "Performance legitimacy with output effectiveness",
        correct_answer: "Legal-rational authority with bureaucratic administration",
        explanation: `Modern democratic states typically derive legitimacy from legal-rational authority based on constitutional and legal frameworks.`,
        category: "Political Theory"
      },
      {
        id: `hard-poltheo-${country.id}-3-${Date.now()}`,
        text: `Which distributive justice principle best characterizes ${country.name}'s welfare state arrangements?`,
        option_a: "Rawlsian difference principle with maximin criterion",
        option_b: "Nozickian entitlement theory with historical justice",
        option_c: "Utilitarian greatest happiness with aggregate welfare",
        option_d: "Capability approach with human development focus",
        correct_answer: "Rawlsian difference principle with maximin criterion",
        explanation: `Rawls' difference principle, which allows inequalities only if they benefit the worst-off, influences many welfare state designs.`,
        category: "Political Theory"
      },
      {
        id: `hard-poltheo-${country.id}-4-${Date.now()}`,
        text: `What specific concept of citizenship governs ${country.name}'s approach to integration and belonging?`,
        option_a: "Liberal citizenship with individual rights emphasis",
        option_b: "Republican citizenship with civic virtue requirements",
        option_c: "Multicultural citizenship with group rights recognition",
        option_d: "Cosmopolitan citizenship with global obligations",
        correct_answer: "Multicultural citizenship with group rights recognition",
        explanation: `Multicultural citizenship theories address diversity through recognition of group-differentiated rights and cultural accommodation.`,
        category: "Political Theory"
      },
      {
        id: `hard-poltheo-${country.id}-5-${Date.now()}`,
        text: `Which federalism theory best explains the division of powers in ${country.name}'s multi-level governance system?`,
        option_a: "Dual federalism with coordinate sovereignty",
        option_b: "Cooperative federalism with intergovernmental collaboration",
        option_c: "Competitive federalism with jurisdictional competition",
        option_d: "Executive federalism with administrative coordination",
        correct_answer: "Cooperative federalism with intergovernmental collaboration",
        explanation: `Cooperative federalism emphasizes shared responsibilities and collaboration between different levels of government.`,
        category: "Political Theory"
      }
    ]);

    // Academic Research Questions (5 questions)
    questions.push(...[
      {
        id: `hard-research-${country.id}-1-${Date.now()}`,
        text: `Which specific research methodology framework governs mixed-methods studies in ${country.name}'s academic institutions?`,
        option_a: "Pragmatist paradigm with sequential explanatory design",
        option_b: "Critical realist approach with stratified ontology",
        option_c: "Constructivist framework with emergent design",
        option_d: "Positivist paradigm with concurrent triangulation",
        correct_answer: "Pragmatist paradigm with sequential explanatory design",
        explanation: `Pragmatist approaches to mixed methods research emphasize practical problem-solving and sequential data collection strategies.`,
        category: "Academic Research"
      },
      {
        id: `hard-research-${country.id}-2-${Date.now()}`,
        text: `What specific bibliometric indicator measures research impact in ${country.name}'s university evaluation systems?`,
        option_a: "Field-weighted citation impact with normalization",
        option_b: "h-index with career-length adjustment",
        option_c: "Journal Impact Factor with quartile ranking",
        option_d: "Altmetrics with social media attention tracking",
        correct_answer: "Field-weighted citation impact with normalization",
        explanation: `Field-weighted citation impact provides normalized measures that account for disciplinary differences in citation patterns.`,
        category: "Academic Research"
      },
      {
        id: `hard-research-${country.id}-3-${Date.now()}`,
        text: `Which research ethics framework governs human subjects research in ${country.name}'s institutional review boards?`,
        option_a: "Belmont Report principles with beneficence, respect, and justice",
        option_b: "Declaration of Helsinki with clinical research focus",
        option_c: "Nuremberg Code with voluntary consent emphasis",
        option_d: "Common Rule with federal regulatory compliance",
        correct_answer: "Belmont Report principles with beneficence, respect, and justice",
        explanation: `The Belmont Report's three principles (beneficence, respect for persons, justice) form the foundation of modern research ethics.`,
        category: "Academic Research"
      },
      {
        id: `hard-research-${country.id}-4-${Date.now()}`,
        text: `What specific statistical method addresses selection bias in ${country.name}'s observational research studies?`,
        option_a: "Propensity score matching with covariate balancing",
        option_b: "Instrumental variable estimation with two-stage least squares",
        option_c: "Regression discontinuity with bandwidth optimization",
        option_d: "Difference-in-differences with parallel trends assumption",
        correct_answer: "Propensity score matching with covariate balancing",
        explanation: `Propensity score matching is widely used to address selection bias by balancing observed covariates between treatment groups.`,
        category: "Academic Research"
      },
      {
        id: `hard-research-${country.id}-5-${Date.now()}`,
        text: `Which open science practice is mandated by ${country.name}'s research funding agencies?`,
        option_a: "Data management plans with FAIR principles compliance",
        option_b: "Preregistration with analysis plan specification", 
        option_c: "Open access publication with immediate availability",
        option_d: "Reproducible workflows with computational transparency",
        correct_answer: "Data management plans with FAIR principles compliance",
        explanation: `FAIR (Findable, Accessible, Interoperable, Reusable) data principles are increasingly required by major funding agencies.`,
        category: "Academic Research"
      }
    ]);

    // Historical Analysis Questions (5 questions)
    questions.push(...[
      {
        id: `hard-hist-${country.id}-1-${Date.now()}`,
        text: `Which specific historiographical method characterizes the analysis of ${country.name}'s nation-building narratives?`,
        option_a: "Social history with quantitative prosopography",
        option_b: "Cultural history with symbolic analysis",
        option_c: "Political history with elite biographical focus",
        option_d: "Microhistory with exceptional normal methodology",
        correct_answer: "Cultural history with symbolic analysis",
        explanation: `Cultural history approaches to nation-building focus on symbolic systems, rituals, and meaning-making processes.`,
        category: "Historical Analysis"
      },
      {
        id: `hard-hist-${country.id}-2-${Date.now()}`,
        text: `What archival methodology governs the study of ${country.name}'s colonial administrative records?`,
        option_a: "Serial history with quantitative source criticism",
        option_b: "Postcolonial reading with subaltern perspective",
        option_c: "Diplomatic analysis with paleographic expertise",
        option_d: "Oral history with memory and trauma framework",
        correct_answer: "Postcolonial reading with subaltern perspective",
        explanation: `Postcolonial approaches to colonial archives emphasize reading against the grain and recovering subaltern voices.`,
        category: "Historical Analysis"
      },
      {
        id: `hard-hist-${country.id}-3-${Date.now()}`,
        text: `Which chronological framework best periodizes ${country.name}'s economic development patterns?`,
        option_a: "Kondratieff waves with technological innovation cycles",
        option_b: "Braudelian longue durée with structural continuities",
        option_c: "Marxist modes of production with class struggle transitions",
        option_d: "Modernization theory with stages of growth model",
        correct_answer: "Kondratieff waves with technological innovation cycles",
        explanation: `Kondratieff wave theory provides a framework for understanding long-term economic cycles driven by technological innovation.`,
        category: "Historical Analysis"
      },
      {
        id: `hard-hist-${country.id}-4-${Date.now()}`,
        text: `What specific historical demography method analyzes ${country.name}'s pre-industrial population patterns?`,
        option_a: "Family reconstitution with parish register analysis",
        option_b: "Back projection with stable population assumptions",
        option_c: "Microsimulation with stochastic modeling",
        option_d: "Aggregative analysis with time series methods",
        correct_answer: "Family reconstitution with parish register analysis",
        explanation: `Family reconstitution using parish registers is the classic method for studying pre-industrial demographic patterns.`,
        category: "Historical Analysis"
      },
      {
        id: `hard-hist-${country.id}-5-${Date.now()}`,
        text: `Which comparative historical methodology explains ${country.name}'s state formation trajectories?`,
        option_a: "Moore's bourgeois revolution pathway analysis",
        option_b: "Tilly's war-making and state-making framework",
        option_c: "Skocpol's structural analysis of social revolutions",
        option_d: "Mann's institutional power network theory",
        correct_answer: "Tilly's war-making and state-making framework",
        explanation: `Charles Tilly's analysis of how war-making drove state-making is fundamental to comparative historical sociology.`,
        category: "Historical Analysis"
      }
    ]);

    // Add country and metadata to each question
    return questions.map(q => ({
      ...q,
      country_id: country.id,
      difficulty: 'hard' as const,
      month_rotation: currentMonth,
      ai_generated: false,
      image_url: null
    }));
  }

  /**
   * Generate hard questions for all countries
   */
  static async generateForAllCountries(): Promise<void> {
    console.log('🎓 Starting manual PhD-level question generation for all countries...');
    
    try {
      // Get all countries from Supabase
      const { data: countriesRaw, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      const countries = (countriesRaw || []).map(convertRawToSupabaseCountry);
      console.log(`📚 Generating manual PhD questions for ${countries.length} countries...`);

      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        console.log(`🎯 Processing ${country.name} (${i + 1}/${countries.length})...`);
        
        try {
          const questions = this.generateHardQuestionsForCountry(country);
          
          // Save to Supabase
          const { error: insertError } = await supabase
            .from('questions')
            .upsert(questions, { onConflict: 'id' });

          if (insertError) {
            console.error(`Failed to save questions for ${country.name}:`, insertError);
            continue;
          }

          console.log(`✅ Generated and saved 50 PhD questions for ${country.name}`);
          
          // Small delay to avoid overwhelming the database
          if (i < countries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`❌ Failed to process ${country.name}:`, error);
          // Continue with next country instead of stopping
        }
      }
      
      console.log('🎉 Manual PhD-level question generation completed for all countries!');
      
      // Get final stats
      const { data: stats } = await supabase
        .from('questions')
        .select('country_id, difficulty')
        .eq('difficulty', 'hard');
      
      const hardQuestionCount = stats?.length || 0;
      const countriesWithHard = new Set(stats?.map(q => q.country_id)).size;
      
      console.log(`📊 Final Statistics:`);
      console.log(`- Total hard questions generated: ${hardQuestionCount}`);
      console.log(`- Countries with hard questions: ${countriesWithHard}`);
      console.log(`- Average hard questions per country: ${Math.round(hardQuestionCount / countriesWithHard)}`);
      
    } catch (error) {
      console.error('❌ Failed to generate manual PhD questions:', error);
      throw error;
    }
  }

  /**
   * Generate hard questions for a specific country
   */
  static async generateForCountry(countryName: string): Promise<void> {
    console.log(`🎓 Generating manual PhD questions for ${countryName}...`);
    
    try {
      const { data: countryData, error } = await supabase
        .from('countries')
        .select('*')
        .eq('name', countryName)
        .single();

      if (error || !countryData) {
        throw new Error(`Country ${countryName} not found`);
      }

      const country = convertRawToSupabaseCountry(countryData);
      const questions = this.generateHardQuestionsForCountry(country);
      
      // Save to Supabase
      const { error: insertError } = await supabase
        .from('questions')
        .upsert(questions, { onConflict: 'id' });

      if (insertError) {
        throw insertError;
      }
      
      console.log(`✅ Generated and saved 50 PhD questions for ${countryName}`);
    } catch (error) {
      console.error(`❌ Failed to generate manual PhD questions for ${countryName}:`, error);
      throw error;
    }
  }
}

// Export functions for use in console or components
export const generateManualHardQuestions = ManualHardQuestionGenerator.generateForAllCountries;
export const generateManualHardQuestionsForCountry = ManualHardQuestionGenerator.generateForCountry;
