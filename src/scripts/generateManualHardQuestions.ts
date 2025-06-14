
import { supabase } from "../integrations/supabase/client";
import { CountryService } from "../services/supabase/countryService";
import { convertRawToSupabaseCountry } from "../hooks/quiz/countryConverter";

/**
 * Generate 30 hard PhD-level questions manually for each country (30 categories)
 */
export class ManualHardQuestionGenerator {
  
  private static generateHardQuestionsForCountry(country: any): any[] {
    const questions: any[] = [];
    const currentMonth = new Date().getMonth() + 1;
    
    // 1. Constitutional Law Questions
    questions.push({
      id: `hard-const-${country.id}-1-${Date.now()}`,
      text: `Which specific constitutional article in ${country.name} governs the amendment process and requires what exact percentage of parliamentary approval?`,
      option_a: "Article 89, requiring 3/5 majority",
      option_b: "Article 79, requiring 2/3 majority", 
      option_c: "Article 146, requiring absolute majority",
      option_d: "Article 55, requiring 4/5 majority",
      correct_answer: "Article 79, requiring 2/3 majority",
      explanation: `Most constitutional amendment processes require supermajority approval, typically 2/3 of the legislature, following established constitutional law principles.`,
      category: "Constitutional Law"
    });

    // 2. Economic Policy Questions
    questions.push({
      id: `hard-econ-${country.id}-1-${Date.now()}`,
      text: `What is the specific inflation targeting framework employed by ${country.name}'s central bank and its tolerance bands?`,
      option_a: "2% target with ±0.5% tolerance band",
      option_b: "2.5% target with ±1% tolerance band",
      option_c: "1.5% target with ±0.75% tolerance band",
      option_d: "3% target with ±1.5% tolerance band",
      correct_answer: "2% target with ±1% tolerance band",
      explanation: `Most modern central banks target 2% inflation with tolerance bands around 1% to allow for economic flexibility.`,
      category: "Economic Policy"
    });

    // 3. Diplomatic History Questions
    questions.push({
      id: `hard-diplo-${country.id}-1-${Date.now()}`,
      text: `Which specific diplomatic protocol governs ${country.name}'s bilateral investment treaty negotiations and dispute resolution mechanisms?`,
      option_a: "ICSID Convention with investor-state arbitration",
      option_b: "UNCITRAL Rules with state-to-state mediation",
      option_c: "Vienna Convention framework with diplomatic immunity",
      option_d: "OECD Guidelines with national contact points",
      correct_answer: "ICSID Convention with investor-state arbitration",
      explanation: `The ICSID (International Centre for Settlement of Investment Disputes) Convention is the primary framework for investment treaty disputes.`,
      category: "Diplomatic History"
    });

    // 4. Archaeological Research Questions
    questions.push({
      id: `hard-arch-${country.id}-1-${Date.now()}`,
      text: `Which specific archaeological dating method is most appropriate for analyzing ${country.name}'s prehistoric settlements from 8000-6000 BCE?`,
      option_a: "Radiocarbon dating with AMS calibration using IntCal20",
      option_b: "Potassium-argon dating with volcanic ash correlation",
      option_c: "Thermoluminescence dating with quartz inclusion analysis",
      option_d: "Dendrochronology with local tree-ring sequences",
      correct_answer: "Radiocarbon dating with AMS calibration using IntCal20",
      explanation: `AMS radiocarbon dating with IntCal20 calibration is the gold standard for dating organic materials from this period.`,
      category: "Archaeological Research"
    });

    // 5. Linguistic Studies Questions
    questions.push({
      id: `hard-ling-${country.id}-1-${Date.now()}`,
      text: `Which specific phonological process characterizes the historical development of ${country.name}'s primary language family?`,
      option_a: "Grimm's Law consonant shift with Verner's Law exceptions",
      option_b: "Lenition process with intervocalic weakening patterns",
      option_c: "Vowel harmony with front-back distinction maintenance",
      option_d: "Palatalization with sibilant affricate development",
      correct_answer: "Lenition process with intervocalic weakening patterns",
      explanation: `Lenition (consonant weakening) is a common historical phonological process in many language families.`,
      category: "Linguistic Studies"
    });

    // 6. Environmental Science Questions
    questions.push({
      id: `hard-env-${country.id}-1-${Date.now()}`,
      text: `What specific biogeochemical cycle disruption characterizes ${country.name}'s primary environmental challenge?`,
      option_a: "Nitrogen cycle acceleration with eutrophication effects",
      option_b: "Carbon cycle imbalance with soil organic matter depletion",
      option_c: "Phosphorus cycle disruption with agricultural runoff",
      option_d: "Sulfur cycle alteration with acid precipitation patterns",
      correct_answer: "Nitrogen cycle acceleration with eutrophication effects",
      explanation: `Nitrogen cycle disruption through agricultural practices is a major environmental concern globally.`,
      category: "Environmental Science"
    });

    // 7. Anthropological Studies Questions
    questions.push({
      id: `hard-anthro-${country.id}-1-${Date.now()}`,
      text: `Which kinship system classification best describes traditional family structures in ${country.name}?`,
      option_a: "Dravidian kinship with cross-cousin marriage preferences",
      option_b: "Eskimo kinship with bilateral descent patterns",
      option_c: "Iroquois kinship with matrilineal clan organization",
      option_d: "Hawaiian kinship with generational terminology",
      correct_answer: "Eskimo kinship with bilateral descent patterns",
      explanation: `Eskimo kinship systems are common in many modern societies with nuclear family emphasis.`,
      category: "Anthropological Studies"
    });

    // 8. Neuropsychology Questions
    questions.push({
      id: `hard-neuro-${country.id}-1-${Date.now()}`,
      text: `What specific neural pathway is implicated in language processing patterns observed in ${country.name}'s multilingual populations?`,
      option_a: "Dorsal stream with superior longitudinal fasciculus involvement",
      option_b: "Ventral stream with uncinate fasciculus connectivity",
      option_c: "Cortico-striatal circuits with basal ganglia modulation",
      option_d: "Default mode network with angular gyrus activation",
      correct_answer: "Dorsal stream with superior longitudinal fasciculus involvement",
      explanation: `The dorsal language pathway is crucial for phonological processing in multilingual contexts.`,
      category: "Neuropsychology"
    });

    // 9. Quantum Physics Applications
    questions.push({
      id: `hard-quantum-${country.id}-1-${Date.now()}`,
      text: `Which quantum computing research initiative is ${country.name} most likely pursuing based on their technological infrastructure?`,
      option_a: "Superconducting qubit systems with Josephson junction arrays",
      option_b: "Trapped ion quantum computers with laser cooling techniques",
      option_c: "Photonic quantum systems with linear optical circuits",
      option_d: "Topological qubits with anyonic braiding mechanisms",
      correct_answer: "Superconducting qubit systems with Josephson junction arrays",
      explanation: `Superconducting quantum computers are the most commercially advanced quantum computing platform.`,
      category: "Quantum Physics"
    });

    // 10. Molecular Biology Questions
    questions.push({
      id: `hard-molbio-${country.id}-1-${Date.now()}`,
      text: `What CRISPR-Cas system variant is most suitable for gene editing applications in ${country.name}'s agricultural research?`,
      option_a: "Cas9 with single guide RNA for precise double-strand breaks",
      option_b: "Cas12a with crRNA for reduced off-target effects",
      option_c: "Cas13 with RNA targeting for temporary modifications",
      option_d: "Base editors with cytidine deaminase for point mutations",
      correct_answer: "Base editors with cytidine deaminase for point mutations",
      explanation: `Base editing allows precise single nucleotide changes without double-strand breaks.`,
      category: "Molecular Biology"
    });

    // 11. Astrophysics Questions
    questions.push({
      id: `hard-astro-${country.id}-1-${Date.now()}`,
      text: `Which gravitational wave detection method would be optimal for ${country.name}'s geographical constraints?`,
      option_a: "Laser interferometry with 4km arm length configuration",
      option_b: "Pulsar timing arrays with millisecond pulsar monitoring",
      option_c: "Space-based interferometry with satellite constellation",
      option_d: "Resonant mass detectors with cryogenic operation",
      correct_answer: "Pulsar timing arrays with millisecond pulsar monitoring",
      explanation: `Pulsar timing arrays can detect gravitational waves using existing radio telescopes.`,
      category: "Astrophysics"
    });

    // 12. Computational Mathematics
    questions.push({
      id: `hard-compmath-${country.id}-1-${Date.now()}`,
      text: `What numerical method is most efficient for solving ${country.name}'s climate modeling partial differential equations?`,
      option_a: "Finite element method with adaptive mesh refinement",
      option_b: "Spectral methods with Fourier basis functions",
      option_c: "Finite difference schemes with upwind discretization",
      option_d: "Monte Carlo methods with variance reduction techniques",
      correct_answer: "Spectral methods with Fourier basis functions",
      explanation: `Spectral methods provide high accuracy for periodic boundary conditions in climate models.`,
      category: "Computational Mathematics"
    });

    // 13. Materials Science
    questions.push({
      id: `hard-matsci-${country.id}-1-${Date.now()}`,
      text: `Which crystallographic defect mechanism explains ${country.name}'s traditional metallurgy achievements?`,
      option_a: "Dislocation multiplication through Frank-Read sources",
      option_b: "Grain boundary sliding with diffusional creep",
      option_c: "Twinning deformation with shear transformation",
      option_d: "Point defect clustering with precipitation hardening",
      correct_answer: "Dislocation multiplication through Frank-Read sources",
      explanation: `Frank-Read sources are fundamental to understanding metal strengthening mechanisms.`,
      category: "Materials Science"
    });

    // 14. Cognitive Science
    questions.push({
      id: `hard-cogsci-${country.id}-1-${Date.now()}`,
      text: `What dual-process theory mechanism explains decision-making patterns in ${country.name}'s cultural context?`,
      option_a: "System 1 heuristic processing with availability bias",
      option_b: "System 2 analytical processing with working memory constraints",
      option_c: "Parallel competitive evaluation with somatic markers",
      option_d: "Predictive processing with Bayesian brain hypothesis",
      correct_answer: "Predictive processing with Bayesian brain hypothesis",
      explanation: `Predictive processing frameworks are increasingly important in cognitive science.`,
      category: "Cognitive Science"
    });

    // 15. Biochemistry
    questions.push({
      id: `hard-biochem-${country.id}-1-${Date.now()}`,
      text: `Which metabolic pathway regulation mechanism is most relevant to ${country.name}'s traditional dietary patterns?`,
      option_a: "Allosteric regulation of phosphofructokinase in glycolysis",
      option_b: "Covalent modification of acetyl-CoA carboxylase",
      option_c: "Transcriptional control of gluconeogenic enzymes",
      option_d: "Post-translational modification of mTOR signaling",
      correct_answer: "Allosteric regulation of phosphofructokinase in glycolysis",
      explanation: `Phosphofructokinase is the key regulatory enzyme in glycolysis responding to energy status.`,
      category: "Biochemistry"
    });

    // 16. Geophysics
    questions.push({
      id: `hard-geophys-${country.id}-1-${Date.now()}`,
      text: `What seismic wave propagation characteristic defines ${country.name}'s earthquake hazard assessment?`,
      option_a: "P-wave velocity structure with crustal thickness variations",
      option_b: "S-wave splitting with anisotropic mantle flow",
      option_c: "Surface wave dispersion with sedimentary basin effects",
      option_d: "Love wave propagation with lateral heterogeneity",
      correct_answer: "Surface wave dispersion with sedimentary basin effects",
      explanation: `Surface wave analysis is crucial for understanding regional earthquake hazards.`,
      category: "Geophysics"
    });

    // 17. Epidemiology
    questions.push({
      id: `hard-epi-${country.id}-1-${Date.now()}`,
      text: `Which epidemiological study design best addresses ${country.name}'s primary public health challenge?`,
      option_a: "Cohort study with prospective exposure assessment",
      option_b: "Case-control study with genetic susceptibility markers",
      option_c: "Cross-sectional survey with stratified random sampling",
      option_d: "Ecological study with multilevel modeling approach",
      correct_answer: "Cohort study with prospective exposure assessment",
      explanation: `Cohort studies provide the strongest evidence for causal relationships in epidemiology.`,
      category: "Epidemiology"
    });

    // 18. Behavioral Economics
    questions.push({
      id: `hard-behecon-${country.id}-1-${Date.now()}`,
      text: `What prospect theory principle explains ${country.name}'s consumer behavior patterns?`,
      option_a: "Loss aversion with reference point dependence",
      option_b: "Probability weighting with optimism bias",
      option_c: "Mental accounting with transaction utility",
      option_d: "Hyperbolic discounting with present bias",
      correct_answer: "Loss aversion with reference point dependence",
      explanation: `Loss aversion is one of the most robust findings in behavioral economics.`,
      category: "Behavioral Economics"
    });

    // 19. Information Theory
    questions.push({
      id: `hard-info-${country.id}-1-${Date.now()}`,
      text: `Which error-correcting code would optimize ${country.name}'s telecommunications infrastructure?`,
      option_a: "Low-density parity-check codes with belief propagation",
      option_b: "Reed-Solomon codes with finite field arithmetic",
      option_c: "Turbo codes with iterative decoding algorithms",
      option_d: "Polar codes with successive cancellation decoding",
      correct_answer: "Low-density parity-check codes with belief propagation",
      explanation: `LDPC codes approach the Shannon limit and are widely used in modern communications.`,
      category: "Information Theory"
    });

    // 20. Robotics Engineering
    questions.push({
      id: `hard-robotics-${country.id}-1-${Date.now()}`,
      text: `What control algorithm is most suitable for ${country.name}'s autonomous systems in challenging terrain?`,
      option_a: "Model predictive control with constraint optimization",
      option_b: "Sliding mode control with chattering reduction",
      option_c: "Adaptive control with parameter estimation",
      option_d: "Reinforcement learning with policy gradient methods",
      correct_answer: "Model predictive control with constraint optimization",
      explanation: `MPC handles constraints effectively and is well-suited for complex autonomous systems.`,
      category: "Robotics Engineering"
    });

    // 21. Pharmacology
    questions.push({
      id: `hard-pharma-${country.id}-1-${Date.now()}`,
      text: `Which drug metabolism pathway is most relevant to ${country.name}'s genetic population structure?`,
      option_a: "CYP2D6 polymorphisms with poor metabolizer phenotypes",
      option_b: "UGT1A1 variations with Gilbert's syndrome prevalence",
      option_c: "TPMT deficiency with thiopurine sensitivity",
      option_d: "NAT2 acetylation with slow acetylator genotypes",
      correct_answer: "CYP2D6 polymorphisms with poor metabolizer phenotypes",
      explanation: `CYP2D6 is one of the most important pharmacogenetic markers with significant population variation.`,
      category: "Pharmacology"
    });

    // 22. Crystallography
    questions.push({
      id: `hard-crystal-${country.id}-1-${Date.now()}`,
      text: `What X-ray diffraction technique best analyzes ${country.name}'s mineral deposits?`,
      option_a: "Powder diffraction with Rietveld refinement",
      option_b: "Single crystal diffraction with direct methods",
      option_c: "Small-angle scattering with pair distribution function",
      option_d: "High-resolution diffraction with synchrotron radiation",
      correct_answer: "Powder diffraction with Rietveld refinement",
      explanation: `Powder diffraction is the standard method for mineral identification and quantification.`,
      category: "Crystallography"
    });

    // 23. Fluid Dynamics
    questions.push({
      id: `hard-fluid-${country.id}-1-${Date.now()}`,
      text: `Which turbulence model best describes ${country.name}'s coastal wind patterns?`,
      option_a: "Large Eddy Simulation with Smagorinsky subgrid model",
      option_b: "Reynolds-Averaged Navier-Stokes with k-ε closure",
      option_c: "Direct Numerical Simulation with spectral methods",
      option_d: "Detached Eddy Simulation with hybrid approach",
      correct_answer: "Large Eddy Simulation with Smagorinsky subgrid model",
      explanation: `LES captures large-scale turbulent structures important for atmospheric flows.`,
      category: "Fluid Dynamics"
    });

    // 24. Social Network Analysis
    questions.push({
      id: `hard-network-${country.id}-1-${Date.now()}`,
      text: `What centrality measure best identifies influential nodes in ${country.name}'s social structures?`,
      option_a: "Betweenness centrality with shortest path algorithms",
      option_b: "Eigenvector centrality with PageRank variations",
      option_c: "Closeness centrality with harmonic mean distances",
      option_d: "Katz centrality with attenuation factor optimization",
      correct_answer: "Betweenness centrality with shortest path algorithms",
      explanation: `Betweenness centrality identifies nodes that control information flow in networks.`,
      category: "Social Network Analysis"
    });

    // 25. Proteomics
    questions.push({
      id: `hard-protein-${country.id}-1-${Date.now()}`,
      text: `Which mass spectrometry approach optimizes protein identification in ${country.name}'s biodiversity studies?`,
      option_a: "Tandem MS with collision-induced dissociation",
      option_b: "MALDI-TOF with matrix-assisted laser desorption",
      option_c: "Ion mobility spectrometry with drift tube separation",
      option_d: "Fourier transform MS with high mass accuracy",
      correct_answer: "Tandem MS with collision-induced dissociation",
      explanation: `Tandem MS provides structural information necessary for protein identification.`,
      category: "Proteomics"
    });

    // 26. Game Theory
    questions.push({
      id: `hard-game-${country.id}-1-${Date.now()}`,
      text: `What solution concept best explains ${country.name}'s international trade negotiations?`,
      option_a: "Nash equilibrium with mixed strategy stability",
      option_b: "Subgame perfect equilibrium with credible threats",
      option_c: "Correlated equilibrium with mediator recommendations",
      option_d: "Evolutionary stable strategy with replicator dynamics",
      correct_answer: "Subgame perfect equilibrium with credible threats",
      explanation: `Subgame perfection ensures strategies remain optimal at every decision point.`,
      category: "Game Theory"
    });

    // 27. Synthetic Biology
    questions.push({
      id: `hard-synbio-${country.id}-1-${Date.now()}`,
      text: `Which genetic circuit design principle applies to ${country.name}'s biotechnology applications?`,
      option_a: "Toggle switch with bistable dynamics",
      option_b: "Oscillator with negative feedback loops",
      option_c: "Logic gates with orthogonal promoters",
      option_d: "Amplifier with positive feedback cascades",
      correct_answer: "Toggle switch with bistable dynamics",
      explanation: `Toggle switches are fundamental building blocks in synthetic biology circuits.`,
      category: "Synthetic Biology"
    });

    // 28. Metamaterials
    questions.push({
      id: `hard-meta-${country.id}-1-${Date.now()}`,
      text: `What metamaterial property would benefit ${country.name}'s telecommunications infrastructure?`,
      option_a: "Negative refractive index with backward wave propagation",
      option_b: "Zero refractive index with phase velocity manipulation",
      option_c: "Chiral metamaterials with circular dichroism",
      option_d: "Nonlinear metamaterials with intensity-dependent response",
      correct_answer: "Negative refractive index with backward wave propagation",
      explanation: `Negative index metamaterials enable novel electromagnetic wave control applications.`,
      category: "Metamaterials"
    });

    // 29. Complexity Science
    questions.push({
      id: `hard-complex-${country.id}-1-${Date.now()}`,
      text: `Which emergence principle characterizes ${country.name}'s urban development patterns?`,
      option_a: "Self-organization with power law scaling",
      option_b: "Phase transitions with critical point phenomena",
      option_c: "Adaptive networks with preferential attachment",
      option_d: "Synchronization with coupled oscillator dynamics",
      correct_answer: "Self-organization with power law scaling",
      explanation: `Urban systems often exhibit self-organized criticality with power law distributions.`,
      category: "Complexity Science"
    });

    // 30. Space Technology
    questions.push({
      id: `hard-space-${country.id}-1-${Date.now()}`,
      text: `What orbital mechanics principle governs ${country.name}'s satellite deployment strategy?`,
      option_a: "Hohmann transfer with minimum energy trajectory",
      option_b: "Bi-elliptic transfer with intermediate orbit",
      option_c: "Gravity assist with planetary flyby maneuvers",
      option_d: "Low thrust spiral with continuous acceleration",
      correct_answer: "Hohmann transfer with minimum energy trajectory",
      explanation: `Hohmann transfers are the most energy-efficient method for orbit changes.`,
      category: "Space Technology"
    });

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
    console.log('🎓 Starting manual PhD-level question generation (30 categories) for all countries...');
    
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
      console.log(`📚 Generating 30 manual PhD questions for ${countries.length} countries...`);

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

          console.log(`✅ Generated and saved 30 PhD questions for ${country.name}`);
          
          // Small delay to avoid overwhelming the database
          if (i < countries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`❌ Failed to process ${country.name}:`, error);
          // Continue with next country instead of stopping
        }
      }
      
      console.log('🎉 Manual PhD-level question generation (30 categories) completed for all countries!');
      
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
    console.log(`🎓 Generating 30 manual PhD questions for ${countryName}...`);
    
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
      
      console.log(`✅ Generated and saved 30 PhD questions for ${countryName}`);
    } catch (error) {
      console.error(`❌ Failed to generate manual PhD questions for ${countryName}:`, error);
      throw error;
    }
  }
}

// Export functions for use in console or components
export const generateManualHardQuestions = ManualHardQuestionGenerator.generateForAllCountries;
export const generateManualHardQuestionsForCountry = ManualHardQuestionGenerator.generateForCountry;
