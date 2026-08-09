export interface FRQPart {
    id: string;
    label: string; // e.g., "(a) Identify"
    prompt: string;
    points: number;
    rubricCriteria: string[];
    sampleAnswer: string;
  }
  
  export interface FRQQuestion {
    id: string;
    unit: number;
    title: string;
    scenario: string;
    parts: FRQPart[];
  }
  
  export const allFRQs: FRQQuestion[] = [
    // ==========================================
    // UNIT 1: THE LIVING WORLD - ECOSYSTEMS
    // ==========================================
    {
      id: "frq-u1-1",
      unit: 1,
      title: "Biogeochemical Cycling & Primary Productivity",
      scenario: "A research team monitors an undisturbed temperate forest ecosystem over three years to evaluate nutrient fluxes between biotic reservoirs and soil pools.",
      parts: [
        {
          id: "u1-1-a",
          label: "(a) Identify",
          prompt: "Identify the primary biological process that moves carbon from an inorganic atmospheric reservoir into an organic biotic reservoir.",
          points: 1,
          rubricCriteria: [
            "1 point for identifying photosynthesis."
          ],
          sampleAnswer: "Photosynthesis."
        },
        {
          id: "u1-1-b",
          label: "(b) Explain",
          prompt: "Explain the mathematical relationship between Gross Primary Productivity (GPP), Net Primary Productivity (NPP), and Plant Respiration (R).",
          points: 1,
          rubricCriteria: [
            "1 point for explaining that NPP equals GPP minus cellular respiration (NPP = GPP - R), meaning NPP represents the net energy remaining for plant growth and biomass accumulation after metabolic costs are met."
          ],
          sampleAnswer: "Net Primary Productivity is the amount of energy that remains after autotrophs use a portion of Gross Primary Productivity for cellular respiration (NPP = GPP - R)."
        },
        {
          id: "u1-1-c",
          label: "(c) Describe",
          prompt: "Describe the role of specialized soil bacteria in converting atmospheric nitrogen (N₂) into a form accessible to vascular plants.",
          points: 2,
          rubricCriteria: [
            "1 point for describing nitrogen fixation carried out by bacteria (such as Rhizobium or free-living Azotobacter).",
            "1 point for identifying the product of fixation as ammonia (NH₃) or ammonium (NH₄⁺)."
          ],
          sampleAnswer: "Nitrogen-fixing bacteria residing in root nodules or soil convert inert atmospheric nitrogen gas (N₂) into ammonia (NH₃) or ammonium (NH₄⁺), which plants can absorb through their roots."
        }
      ]
    },
    {
      id: "frq-u1-2",
      unit: 1,
      title: "Trophic Structure & Energy Flow",
      scenario: "An ecologist constructs a energy pyramid model for a freshwater lake ecosystem dominated by phytoplankton, zooplankton, minnows, and osprey.",
      parts: [
        {
          id: "u1-2-a",
          label: "(a) Describe",
          prompt: "Describe the 10% rule of energy transfer between trophic levels in an ecosystem.",
          points: 1,
          rubricCriteria: [
            "1 point for describing that approximately 90% of usable energy is lost as heat/metabolic expenditure, leaving only ~10% to be passed to the next higher trophic level."
          ],
          sampleAnswer: "The 10% rule states that only about 10% of total chemical energy stored as biomass at one trophic level is transferred to the next higher level, while ~90% is lost to heat and metabolic respiration."
        },
        {
          id: "u1-2-b",
          label: "(b) Calculate",
          prompt: "If the producer level in the lake stores 45,000 kcal/m²/yr of energy, calculate the amount of energy available to the tertiary consumers.",
          points: 2,
          rubricCriteria: [
            "1 point for correct setup/step-down through trophic levels (45,000 → 4,500 → 450 → 45).",
            "1 point for correct numerical answer (45 kcal/m²/yr)."
          ],
          sampleAnswer: "Primary consumers receive 4,500 kcal/m²/yr, secondary consumers receive 450 kcal/m²/yr, and tertiary consumers receive 45 kcal/m²/yr."
        }
      ]
    },
  
    // ==========================================
    // UNIT 2: THE LIVING WORLD - BIODIVERSITY
    // ==========================================
    {
      id: "frq-u2-1",
      unit: 2,
      title: "Island Biogeography & Ecosystem Services",
      scenario: "Conservation biologists study two oceanic islands of equal distance from the mainland: Island Alpha (500 km²) and Island Beta (20 km²).",
      parts: [
        {
          id: "u2-1-a",
          label: "(a) Explain",
          prompt: "Explain why Island Alpha is expected to maintain higher species richness than Island Beta according to the Theory of Island Biogeography.",
          points: 2,
          rubricCriteria: [
            "1 point for explaining that larger island area provides a higher diversity of ecological niches and resources.",
            "1 point for noting lower extinction rates on larger islands due to larger sustainable population sizes."
          ],
          sampleAnswer: "Island Alpha has a larger land area, providing greater habitat heterogeneity and resource availability. This supports larger population sizes, which reduces extinction rates relative to Island Beta."
        },
        {
          id: "u2-1-b",
          label: "(b) Identify & Describe",
          prompt: "Identify ONE provisioning ecosystem service provided by island forests and describe its economic benefit to human populations.",
          points: 2,
          rubricCriteria: [
            "1 point for identifying a valid provisioning service (e.g., timber, medicinal plants, fresh water, wild food).",
            "1 point for describing its direct economic or practical utilization by humans."
          ],
          sampleAnswer: "Timber production is a provisioning service. Harvested wood provides raw materials for construction and paper production, generating revenue and trade for local economies."
        }
      ]
    },
    {
      id: "frq-u2-2",
      unit: 2,
      title: "Ecological Succession & Tolerance Limits",
      scenario: "A volcanic eruption on a Pacific island covers several square kilometers of coastal forest with barren basalt lava rock.",
      parts: [
        {
          id: "u2-2-a",
          label: "(a) Identify",
          prompt: "Identify the type of ecological succession that will occur on the newly formed lava rock.",
          points: 1,
          rubricCriteria: [
            "1 point for identifying primary succession."
          ],
          sampleAnswer: "Primary succession."
        },
        {
          id: "u2-2-b",
          label: "(b) Describe",
          prompt: "Describe the role of pioneer species in establishing soil on the barren volcanic substrate.",
          points: 2,
          rubricCriteria: [
            "1 point for identifying pioneer species like lichens or mosses.",
            "1 point for describing organic acid secretion/physical weathering that breaks down rock into soil combined with decomposing organic matter."
          ],
          sampleAnswer: "Pioneer species such as lichens and mosses colonize bare rock, secreting weak acids that weather the mineral surface into soil particles while contributing organic material as they die and decompose."
        }
      ]
    },
  
    // ==========================================
    // UNIT 3: POPULATIONS
    // ==========================================
    {
      id: "frq-u3-1",
      unit: 3,
      title: "Human Demographics & Age Structure",
      scenario: "Demographers analyze two nations: Country A has a broad-based age structure pyramid, while Country B has a narrow-based cylinder pyramid.",
      parts: [
        {
          id: "u3-1-a",
          label: "(a) Describe",
          prompt: "Describe the projected population growth trend for Country A over the next two decades based on its age structure.",
          points: 1,
          rubricCriteria: [
            "1 point for describing rapid population growth due to a large momentum of individuals entering reproductive age."
          ],
          sampleAnswer: "Country A will experience rapid population growth because a large proportion of its population is currently in pre-reproductive age brackets."
        },
        {
          id: "u3-1-b",
          label: "(b) Explain",
          prompt: "Explain how increasing educational opportunities for women in Country A could lead to a decline in its Total Fertility Rate (TFR).",
          points: 2,
          rubricCriteria: [
            "1 point for connecting education to delayed marriage/childbearing age.",
            "1 point for linking economic empowerment/family planning knowledge to smaller desired family size."
          ],
          sampleAnswer: "Educating women delays the age of marriage and first pregnancy while increasing access to reproductive health education and economic independence, leading to fewer offspring per woman over her lifetime."
        }
      ]
    },
    {
      id: "frq-u3-2",
      unit: 3,
      title: "Population Dynamics & Life History Strategies",
      scenario: "Wildlife managers monitor a reintroduced population of gray wolves (K-selected) and a native population of field mice (r-selected) in a reserve.",
      parts: [
        {
          id: "u3-2-a",
          label: "(a) Compare",
          prompt: "Compare TWO reproductive traits of r-selected species to those of K-selected species.",
          points: 2,
          rubricCriteria: [
            "1 point for contrasting offspring quantity (r-selected produce many, K-selected produce few).",
            "1 point for contrasting parental care or age to maturity (r-selected provide minimal care/mature rapidly, K-selected provide high care/mature slowly)."
          ],
          sampleAnswer: "r-selected species produce large numbers of offspring per reproductive event with minimal parental care, whereas K-selected species produce few offspring and invest high energy into parental care and protection."
        },
        {
          id: "u3-2-b",
          label: "(b) Describe",
          prompt: "Describe what occurs to a population size (N) when it exceeds the carrying capacity (K) of its environment.",
          points: 1,
          rubricCriteria: [
            "1 point for describing overshoot followed by a population dieback/crash due to resource depletion."
          ],
          sampleAnswer: "The population experiences overshoot, leading to resource depletion that causes increased mortality and a population dieback below carrying capacity."
        }
      ]
    },
  
    // ==========================================
    // UNIT 4: EARTH SYSTEMS AND RESOURCES
    // ==========================================
    {
      id: "frq-u4-1",
      unit: 4,
      title: "Soil Composition & Watershed Hydrology",
      scenario: "Agricultural scientists compare two soil samples within a regional watershed: Sample X (70% Sand, 20% Silt, 10% Clay) and Sample Y (20% Sand, 20% Silt, 60% Clay).",
      parts: [
        {
          id: "u4-1-a",
          label: "(a) Describe",
          prompt: "Describe how soil porosity and permeability differ between Sample X and Sample Y.",
          points: 2,
          rubricCriteria: [
            "1 point for describing high permeability/large pore size in sandy Sample X.",
            "1 point for describing low permeability/high total pore volume in clay-heavy Sample Y."
          ],
          sampleAnswer: "Sample X (sandy) has high permeability due to large, interconnected pores that drain water rapidly. Sample Y (clay) has lower overall permeability but smaller pores that retain water."
        },
        {
          id: "u4-1-b",
          label: "(b) Propose a Solution",
          prompt: "Propose a soil management practice to reduce agricultural runoff on sloped land within the watershed.",
          points: 1,
          rubricCriteria: [
            "1 point for proposing contour plowing, terracing, cover cropping, or no-till farming."
          ],
          sampleAnswer: "Implement contour plowing across the slope to slow surface runoff and encourage water infiltration into the soil."
        }
      ]
    },
    {
      id: "frq-u4-2",
      unit: 4,
      title: "Atmospheric Circulation & El Niño Oscillations",
      scenario: "Meteorologists analyze changes in Pacific Ocean trade winds during an El Niño Southern Oscillation (ENSO) event.",
      parts: [
        {
          id: "u4-2-a",
          label: "(a) Describe",
          prompt: "Describe the change in atmospheric trade wind patterns in the tropical Pacific Ocean during an El Niño event compared to normal conditions.",
          points: 1,
          rubricCriteria: [
            "1 point for describing weakening or reversal of easterly trade winds."
          ],
          sampleAnswer: "Easterly trade winds weaken or reverse direction, blowing warm surface ocean water eastward toward South America."
        },
        {
          id: "u4-2-b",
          label: "(b) Explain",
          prompt: "Explain how El Niño alters ocean upwelling off the western coast of South America.",
          points: 2,
          rubricCriteria: [
            "1 point for explaining warm water suppression of the thermocline.",
            "1 point for stating that nutrient-rich deep water is prevented from rising to the surface, reducing primary productivity."
          ],
          sampleAnswer: "Warm surface water accumulates along the coast of South America, depressing the thermocline and suppressing cold upwelling. This prevents nutrient-rich waters from rising, causing a drop in coastal biological productivity."
        }
      ]
    },
  
    // ==========================================
    // UNIT 5: LAND AND WATER USE
    // ==========================================
    {
      id: "frq-u5-1",
      unit: 5,
      title: "Integrated Pest Management & Sustainable Agriculture",
      scenario: "An apple orchard manager transitions from conventional chemical pesticide spraying to an Integrated Pest Management (IPM) framework.",
      parts: [
        {
          id: "u5-1-a",
          label: "(a) Describe",
          prompt: "Describe TWO non-chemical strategies utilized in an IPM framework to control agricultural pest populations.",
          points: 2,
          rubricCriteria: [
            "1 point for describing biological control (e.g., introducing natural predators like ladybugs).",
            "1 point for describing mechanical/cultural control (e.g., crop rotation, pheromone traps, physical barriers)."
          ],
          sampleAnswer: "1. Biological control: Introducing predatory insects (like ladybugs) that eat target pests. 2. Cultural control: Using pheromone traps to disrupt pest mating cycles."
        },
        {
          id: "u5-1-b",
          label: "(b) Propose a Solution",
          prompt: "Propose an irrigation technique that minimizes freshwater waste in water-stressed agricultural regions.",
          points: 1,
          rubricCriteria: [
            "1 point for proposing drip/trickle irrigation."
          ],
          sampleAnswer: "Drip irrigation, which delivers water directly to plant root zones through buried tubing, minimizing evaporation and runoff."
        }
      ]
    },
    {
      id: "frq-u5-2",
      unit: 5,
      title: "Forestry & Overfishing Management",
      scenario: "A coastal province balances commercial timber harvests in public temperate rainforests with marine fisheries management in offshore waters.",
      parts: [
        {
          id: "u5-2-a",
          label: "(a) Compare",
          prompt: "Compare clearcutting to selective cutting in terms of ecosystem impact.",
          points: 2,
          rubricCriteria: [
            "1 point for noting clearcutting removes all canopy trees, causing severe soil erosion and habitat fragmentation.",
            "1 point for noting selective cutting leaves mature trees standing, maintaining forest canopy and soil integrity."
          ],
          sampleAnswer: "Clearcutting removes all trees from an area, causing high soil erosion and widespread habitat destruction. Selective cutting removes only specific mature trees, preserving uneven-aged canopy structure and stabilizing topsoil."
        },
        {
          id: "u5-2-b",
          label: "(b) Explain",
          prompt: "Explain how the concept of the 'Tragedy of the Commons' applies to open-ocean commercial fishing.",
          points: 1,
          rubricCriteria: [
            "1 point for explaining that individuals exploit an unregulated shared resource for personal profit, leading to resource depletion (overfishing) for all."
          ],
          sampleAnswer: "Because open ocean waters are a shared, unregulated resource, individual fishing fleets maximize harvests for immediate profit, leading to widespread stock collapse from overexploitation."
        }
      ]
    },
  
    // ==========================================
    // UNIT 6: ENERGY RESOURCES AND CONSUMPTION
    // ==========================================
    {
      id: "frq-u6-1",
      unit: 6,
      title: "Fossil Fuel Generation & Nuclear Power",
      scenario: "A municipality considers replacing an aging 500 MW coal-fired power station with either a combined-cycle natural gas plant or a nuclear power plant.",
      parts: [
        {
          id: "u6-1-a",
          label: "(a) Describe",
          prompt: "Describe ONE environmental advantage and ONE environmental disadvantage of utilizing nuclear power over coal-fired power.",
          points: 2,
          rubricCriteria: [
            "1 point for advantage (zero greenhouse gas emissions during operation/no air pollutants like SO₂ or particulates).",
            "1 point for disadvantage (generation of long-lived high-level radioactive waste requiring permanent thermal isolation)."
          ],
          sampleAnswer: "Advantage: Nuclear reactors produce no atmospheric carbon dioxide or sulfur dioxide during operation. Disadvantage: They generate spent fuel rods containing high-level radioactive waste that requires secure, long-term geological storage."
        },
        {
          id: "u6-1-b",
          label: "(b) Explain",
          prompt: "Explain why natural gas is considered a cleaner-burning fossil fuel than coal.",
          points: 1,
          rubricCriteria: [
            "1 point for explaining that combustion of natural gas (CH₄) releases lower amounts of CO₂ per unit energy and negligible sulfur dioxide or heavy metals compared to coal."
          ],
          sampleAnswer: "Natural gas emits roughly half the carbon dioxide per unit of energy produced compared to coal, and burns with negligible emission of sulfur dioxide, mercury, and ash particulates."
        }
      ]
    },
    {
      id: "frq-u6-2",
      unit: 6,
      title: "Renewable Energy Integration & Efficiency",
      scenario: "A utility company invests in a hybrid solar photovoltaic (PV) and wind energy farm to power rural municipal grids.",
      parts: [
        {
          id: "u6-2-a",
          label: "(a) Identify & Explain",
          prompt: "Identify the main operational limitation of solar and wind energy, and explain how utility providers address it.",
          points: 2,
          rubricCriteria: [
            "1 point for identifying intermittency (variable weather/sunlight reliance).",
            "1 point for explaining grid energy storage systems (e.g., battery banks or pumped-storage hydro) or backup generation."
          ],
          sampleAnswer: "The main limitation is intermittency, as output depends on weather conditions. Utilities address this by pairing farms with large-scale battery storage systems or pumped hydro facilities to store surplus energy."
        },
        {
          id: "u6-2-b",
          label: "(b) Propose a Solution",
          prompt: "Propose a building design feature that reduces residential energy consumption for heating and cooling.",
          points: 1,
          rubricCriteria: [
            "1 point for proposing passive solar design (south-facing windows, thermal mass walls), upgraded insulation, double-pane low-E glass, or green roofs."
          ],
          sampleAnswer: "Installing south-facing double-paned windows with overhanging eaves (passive solar design) to capture heat in winter while shading the glass from high summer sun."
        }
      ]
    },
  
    // ==========================================
    // UNIT 7: ATMOSPHERIC POLLUTION
    // ==========================================
    {
      id: "frq-u7-1",
      unit: 7,
      title: "Photochemical Smog & Thermal Inversions",
      scenario: "A major metropolitan valley experiences frequent summer air quality warnings for ground-level ozone and photochemical smog.",
      parts: [
        {
          id: "u7-1-a",
          label: "(a) Identify & Describe",
          prompt: "Identify TWO primary pollutants required for the formation of photochemical smog and describe their chemical reaction precursor role.",
          points: 2,
          rubricCriteria: [
            "1 point for identifying Nitrogen Oxides (NOₓ) and Volatile Organic Compounds (VOCs).",
            "1 point for describing how solar ultraviolet light splits NO₂ into NO and free oxygen, which combines with O₂ to form tropospheric ozone (O₃) while VOCs react with NO to maintain high ozone levels."
          ],
          sampleAnswer: "Nitrogen oxides (NOₓ) and Volatile Organic Compounds (VOCs). Sunlight breaks down NO₂, freeing oxygen atoms to form tropospheric ozone (O₃), while VOCs bind with NO to keep ozone from breaking back down."
        },
        {
          id: "u7-1-b",
          label: "(b) Explain",
          prompt: "Explain how a thermal inversion traps air pollutants near the urban ground level.",
          points: 2,
          rubricCriteria: [
            "1 point for describing a layer of warm air sitting over a layer of cooler, denser surface air.",
            "1 point for explaining that warm air acts as a cap, preventing vertical convection and trapping emissions near the ground."
          ],
          sampleAnswer: "A thermal inversion occurs when a warm air layer forms above a layer of cool air near the surface. Because warm air is less dense, it prevents vertical mixing, trapping air pollutants close to the ground."
        }
      ]
    },
    {
      id: "frq-u7-2",
      unit: 7,
      title: "Acid Deposition & Indoor Air Quality",
      scenario: "Air monitoring stations near industrial coal plants record low pH rain samples, while environmental health officials survey suburban homes for indoor air hazards.",
      parts: [
        {
          id: "u7-2-a",
          label: "(a) Describe",
          prompt: "Describe the chemical process by which industrial sulfur dioxide (SO₂) emissions transform into acid deposition.",
          points: 2,
          rubricCriteria: [
            "1 point for describing reaction of SO₂ with atmospheric water vapor and oxygen.",
            "1 point for identifying the product as sulfuric acid (H₂SO₄) which falls as wet/dry deposition."
          ],
          sampleAnswer: "Sulfur dioxide gas reacts with atmospheric water vapor and oxygen to form sulfuric acid (H₂SO₄). This acid dissolves into precipitation, falling as acid rain."
        },
        {
          id: "u7-2-b",
          label: "(b) Identify",
          prompt: "Identify ONE hazardous indoor air pollutant derived from natural bedrock underneath building foundations and describe its human health impact.",
          points: 2,
          rubricCriteria: [
            "1 point for identifying radon-222 gas.",
            "1 point for describing alpha-radiation exposure causing lung tissue damage and lung cancer."
          ],
          sampleAnswer: "Radon-222 gas. It is a radioactive gas that seeps through basement cracks; inhaling its radioactive decay products causes lung damage and increases the risk of lung cancer."
        }
      ]
    },
  
    // ==========================================
    // UNIT 8: AQUATIC AND TERRESTRIAL POLLUTION
    // ==========================================
    {
      id: "frq-u8-1",
      unit: 8,
      title: "Wastewater Treatment & Cultural Eutrophication",
      scenario: "A municipal wastewater treatment facility discharges effluent into a river flowing toward a shallow coastal estuary.",
      parts: [
        {
          id: "u8-1-a",
          label: "(a) Describe",
          prompt: "Describe the specific objective of Primary Treatment and Secondary Treatment in a municipal sewage facility.",
          points: 2,
          rubricCriteria: [
            "1 point for primary treatment (physical removal of large solids/grit through screening and settling).",
            "1 point for secondary treatment (biological degradation of dissolved organic matter by aerobic micro-organisms)."
          ],
          sampleAnswer: "Primary treatment physically removes floating solids, grit, and sludge using screens and settling tanks. Secondary treatment uses aerobic bacteria in aeration tanks to biologically break down dissolved organic material."
        },
        {
          id: "u8-1-b",
          label: "(b) Explain",
          prompt: "Explain how excessive nutrient discharge leads to a hypoxic 'dead zone' in the coastal estuary.",
          points: 2,
          rubricCriteria: [
            "1 point for explaining nutrient-fueled algal blooms.",
            "1 point for explaining that bacterial decomposition of dead algae consumes dissolved oxygen, lowering DO to lethal levels."
          ],
          sampleAnswer: "Excess nitrogen and phosphorus fuel massive algal blooms. When algae die, aerobic decomposers multiply rapidly and consume dissolved oxygen, lowering DO levels and creating hypoxic conditions lethal to aquatic organisms."
        }
      ]
    },
  
    // ==========================================
    // UNIT 8: AQUATIC AND TERRESTRIAL POLLUTION (2nd Prompt)
    // ==========================================
    {
      id: "frq-u8-2",
      unit: 8,
      title: "Solid Waste Management & Bioaccumulation",
      scenario: "County officials evaluate a modern sanitary landfill operation while aquatic biologists measure methylmercury levels in local river food webs.",
      parts: [
        {
          id: "u8-2-a",
          label: "(a) Describe",
          prompt: "Describe TWO structural engineering features of a modern sanitary landfill designed to protect local groundwater.",
          points: 2,
          rubricCriteria: [
            "1 point for impermeable bottom liner (clay or synthetic high-density polyethylene sheet).",
            "1 point for leachate collection/treatment pipes beneath the landfill."
          ],
          sampleAnswer: "1. A thick impermeable bottom liner made of plastic and clay to prevent liquid seepage. 2. A network of leachate collection pipes installed above the liner to pump out contaminated liquids for treatment."
        },
        {
          id: "u8-2-b",
          label: "(b) Explain",
          prompt: "Explain the difference between bioaccumulation and biomagnification of persistent toxins like methylmercury.",
          points: 2,
          rubricCriteria: [
            "1 point for defining bioaccumulation (buildup of a fat-soluble toxin in tissues of an individual organism over its lifetime).",
            "1 point for defining biomagnification (increasing concentration of toxins in organism tissues at successively higher trophic levels)."
          ],
          sampleAnswer: "Bioaccumulation is the buildup of a toxin within a single organism's fat tissues over time. Biomagnification is the increasing concentration of that toxin as it is passed up successive steps of the food chain to apex predators."
        }
      ]
    },
  
    // ==========================================
    // UNIT 9: GLOBAL CHANGE
    // ==========================================
    {
      id: "frq-u9-1",
      unit: 9,
      title: "Ocean Acidification & Coral Bleaching",
      scenario: "Marine scientists monitor tropical coral reefs subject to rising sea surface temperatures and increasing dissolved inorganic carbon concentrations.",
      parts: [
        {
          id: "u9-1-a",
          label: "(a) Describe",
          prompt: "Describe the chemical process by which elevated atmospheric carbon dioxide (CO₂) causes ocean acidification.",
          points: 2,
          rubricCriteria: [
            "1 point for describing absorption of atmospheric CO₂ into surface ocean water to form carbonic acid (H₂CO₃).",
            "1 point for noting dissociation into hydrogen ions (H⁺), which lowers seawater pH."
          ],
          sampleAnswer: "Atmospheric CO₂ dissolves into seawater and reacts with water to form carbonic acid (H₂CO₃). Carbonic acid dissociates, releasing hydrogen ions (H⁺) that increase ocean acidity and lower pH."
        },
        {
          id: "u9-1-b",
          label: "(b) Explain",
          prompt: "Explain how increased acidity hinders reef-building corals from constructing calcium carbonate (CaCO₃) skeletons.",
          points: 1,
          rubricCriteria: [
            "1 point for explaining that free hydrogen ions (H⁺) bind with free carbonate ions (CO₃²⁻), making carbonate unavailable for coral calcification."
          ],
          sampleAnswer: "Excess hydrogen ions bind with available carbonate ions (CO₃²⁻) to form bicarbonate (HCO₃⁻). This depletes free carbonate ions needed by corals to produce calcium carbonate (CaCO₃) skeletons."
        }
      ]
    },
    {
      id: "frq-u9-2",
      unit: 9,
      title: "Stratospheric Ozone Depletion & Invasive Species",
      scenario: "Environmental agencies track atmospheric stratospheric chlorine levels while wildlife officers monitor invasive zebra mussel spread in freshwater lakes.",
      parts: [
        {
          id: "u9-2-a",
          label: "(a) Describe",
          prompt: "Describe how chlorofluorocarbons (CFCs) catalyze the destruction of stratospheric ozone (O₃).",
          points: 2,
          rubricCriteria: [
            "1 point for UV radiation breaking chlorine atoms free from CFC molecules.",
            "1 point for chlorine radical attacking O₃ to form ClO and O₂, catalytic destruction cycle continuing repeatedly."
          ],
          sampleAnswer: "Solar UV radiation breaks chlorine atoms off CFC molecules in the stratosphere. Free chlorine radicals react with ozone (O₃) molecules, stripping an oxygen atom to form ClO and O₂, breaking down the ozone layer."
        },
        {
          id: "u9-2-b",
          label: "(b) Identify & Explain",
          prompt: "Identify ONE ecological feature that allows invasive species to outcompete native species in introduced ecosystems.",
          points: 1,
          rubricCriteria: [
            "1 point for identifying generalist species characteristics, rapid reproduction, high dispersal ability, or absence of natural predators/parasites."
          ],
          sampleAnswer: "Invasive species typically lack natural predators or biological controls in their new habitat, allowing their population to grow unchecked and outcompete native species for resources."
        }
      ]
    }
  ];