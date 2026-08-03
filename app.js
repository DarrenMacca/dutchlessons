/* ============================================================
   CEFR PERCENTAGE PROGRESSION ENGINE (85% PASSING CRITERIA)
   ============================================================ */

// 1. Initial State Profile Trackers (Saves completed item fingerprints to prevent scoring duplicates)
let cefrUserProgressMatrix = {
    currentScore: parseInt(localStorage.getItem("cefr_user_score")) || 0,
    correctStreak: parseInt(localStorage.getItem("cefr_user_streak")) || 0,
    
    // Arrays holding the unique IDs of questions answered correctly
    masteredItems: JSON.parse(localStorage.getItem("cefr_mastered_fingerprints")) || {
        A1: [],
        A2: [],
        B1: [],
        B2: []
    }
};

// 🎯 TARGET CRITERIA: A level requires an 85% completion rate to unlock the next block
const PASSING_PERCENTAGE_CRITERIA = 85;

/**
 * Dynamic Percentage Calculator: Computes active completion rates per milestone bracket
 */
function calculateLevelPercentage(levelKey) {
    // 🔍 Under the hood, this counts total items available inside your main data structures
    let totalAvailableQueries = 0;
    
    if (typeof CEFR_LEVELS !== "undefined" && CEFR_LEVELS[levelKey]) {
        totalAvailableQueries += CEFR_LEVELS[levelKey].length; // Vocabulary-backed items
    }
    if (typeof CEFR_SENTENCES !== "undefined" && CEFR_SENTENCES[levelKey]) {
        totalAvailableQueries += CEFR_SENTENCES[levelKey].length; // Context items
    }
    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined" && CEFR_CONVERSATION_PROMPTS[levelKey]) {
        totalAvailableQueries += CEFR_CONVERSATION_PROMPTS[levelKey].length; // Dialogues
    }

    // Baseline fallback protection against zero-division loops
    if (totalAvailableQueries === 0) return 100;

    const correctUniqueCount = cefrUserProgressMatrix.masteredItems[levelKey].length;
    const currentPercent = Math.min(100, Math.round((correctUniqueCount / totalAvailableQueries) * 100));
    
    return currentPercent;
}

/**
 * Gatekeeper Engine Check: Determines if a level tier is legally open for the user
 */
function isLevelUnlocked(levelKey) {
    if (levelKey === "A1") return true; // A1 is wide open by default
    if (levelKey === "A2") return calculateLevelPercentage("A1") >= PASSING_PERCENTAGE_CRITERIA;
    if (levelKey === "B1") return isLevelUnlocked("A2") && calculateLevelPercentage("A2") >= PASSING_PERCENTAGE_CRITERIA;
    if (levelKey === "B2") return isLevelUnlocked("B1") && calculateLevelPercentage("B1") >= PASSING_PERCENTAGE_CRITERIA;
    return true;
}

/**
 * Activity Evaluator: Logs successful module tasks and awards cosmetic score increments
 */
function registerSuccessfulModuleTask(levelKey, itemId, sourceModule) {
    // 🛡️ SECURITY FILTER: Restrict scoring strictly to authorized activity tabs
    const approvedTabs = ["Quiz", "Build", "Sentence", "Conversation"];
    if (!approvedTabs.includes(sourceModule)) return;

    // Create a unique compound tracking fingerprint identifier
    const itemFingerprint = `${sourceModule}_${itemId}`;

    // If they haven't answered this specific question correctly before, save it!
    if (!cefrUserProgressMatrix.masteredItems[levelKey].includes(itemFingerprint)) {
        cefrUserProgressMatrix.masteredItems[levelKey].push(itemFingerprint);
        cefrUserProgressMatrix.currentScore += 10; // Award cosmetic score points
        cefrUserProgressMatrix.correctStreak += 1;
        
        // Save changes permanently to device memory profiles
        localStorage.setItem("cefr_user_score", cefrUserProgressMatrix.currentScore);
        localStorage.setItem("cefr_user_streak", cefrUserProgressMatrix.correctStreak);
        localStorage.setItem("cefr_mastered_fingerprints", JSON.stringify(cefrUserProgressMatrix.masteredItems));
        
        // Live UI rendering checks for milestones
        evaluateMilestoneThresholds(levelKey);
    } else {
        cefrUserProgressMatrix.correctStreak += 1;
        localStorage.setItem("cefr_user_streak", cefrUserProgressMatrix.correctStreak);
    }

    renderScoreDashboardUI();
}

/**
 * Milestone Review Tracker: Monitors percentages and pops up promotion modals
 */
function evaluateMilestoneThresholds(currentLevel) {
    const currentPercent = calculateLevelPercentage(currentLevel);
    console.log(`📊 Progress Matrix: Level ${currentLevel} is currently at ${currentPercent}% completion.`);

    // Check if the current level just satisfied the 85% requirement to reveal the next gate
    if (currentPercent >= PASSING_PERCENTAGE_CRITERIA) {
        let nextLvlMap = { "A1": "A2", "A2": "B1", "B1": "B2" };
        let nextLevelName = nextLvlMap[currentLevel];
        
        if (nextLevelName) {
            // Check if we already popped this level up during this lifecycle
            const alreadyNotified = localStorage.getItem(`notified_pass_${currentLevel}`) === "true";
            if (!alreadyNotified) {
                localStorage.setItem(`notified_pass_${currentLevel}`, "true");
                triggerLevelPassModal(currentLevel, nextLevelName);
            }
        }
    }

    enforceMobileNavigationLocks();
}
/* ============================================================
   MINING REFERENCES — Open Cut & Underground Vocabulary (Dutch → English)
   ============================================================ */

const MINING_REFERENCES = {
    "Open Cut Mining": [
        { dutch: "toegangshelling", english: "access ramp", category: "Open Cut Mining" },
        { dutch: "rusthoek", english: "angle of repose", category: "Open Cut Mining" },
        { dutch: "boorwinning", english: "auger mining", category: "Open Cut Mining" },
        { dutch: "voorladergraafmachine", english: "backhoe excavator", category: "Open Cut Mining" },
        { dutch: "bank", english: "bench", category: "Open Cut Mining" },
        { dutch: "berm", english: "berm", category: "Open Cut Mining" },
        { dutch: "boorpatroon", english: "blast pattern", category: "Open Cut Mining" },
        { dutch: "boxcut", english: "box cut", category: "Open Cut Mining" },
        { dutch: "bulkwinning", english: "bulk mining", category: "Open Cut Mining" },
        { dutch: "vangbank", english: "catch bench", category: "Open Cut Mining" },
        { dutch: "richel", english: "crest", category: "Open Cut Mining" },
        { dutch: "dozeropvang", english: "dozer trap", category: "Open Cut Mining" },
        { dutch: "dragline", english: "dragline", category: "Open Cut Mining" },
        { dutch: "rotatieboorinstallatie", english: "drill rig (rotary blasthole)", category: "Open Cut Mining" },
        { dutch: "stortplaats", english: "dump / waste dump", category: "Open Cut Mining" },
        { dutch: "elektrische kabelschop", english: "electric rope shovel", category: "Open Cut Mining" },
        { dutch: "ex-pit stortplaats", english: "ex-pit dump", category: "Open Cut Mining" },
        { dutch: "front", english: "face", category: "Open Cut Mining" },
        { dutch: "gehaltecontrole", english: "grade control", category: "Open Cut Mining" },
        { dutch: "transportweg", english: "haul road", category: "Open Cut Mining" },
        { dutch: "hoogwand", english: "highwall", category: "Open Cut Mining" },
        { dutch: "in-pit breek- en transportsysteem", english: "in-pit crushing and conveying (IPCC)", category: "Open Cut Mining" },
        { dutch: "in-pit stortplaats", english: "in-pit dump", category: "Open Cut Mining" },
        { dutch: "bankhoogte", english: "lift", category: "Open Cut Mining" },
        { dutch: "laden-en-transporteren", english: "load-and-haul", category: "Open Cut Mining" },
        { dutch: "laagwand", english: "lowwall", category: "Open Cut Mining" },
        { dutch: "levensduur van de mijn", english: "mine life", category: "Open Cut Mining" },
        { dutch: "mijnplan", english: "mine plan", category: "Open Cut Mining" },
        { dutch: "mobiele breker", english: "mobile crusher", category: "Open Cut Mining" },
        { dutch: "muckpile", english: "muckpile", category: "Open Cut Mining" },
        { dutch: "dagbouw", english: "open-cut / open-pit", category: "Open Cut Mining" },
        { dutch: "deklaag", english: "overburden", category: "Open Cut Mining" },
        { dutch: "perimeterwal", english: "perimeter bund", category: "Open Cut Mining" },
        { dutch: "putvloer", english: "pit floor", category: "Open Cut Mining" },
        { dutch: "ultime putgrens", english: "pit limit / ultimate pit limit", category: "Open Cut Mining" },
        { dutch: "steengroeve", english: "quarry", category: "Open Cut Mining" },
        { dutch: "herverplaatsing", english: "rehandle", category: "Open Cut Mining" },
        { dutch: "rehabilitatie", english: "rehabilitation", category: "Open Cut Mining" },
        { dutch: "rotatieboor", english: "rotary blasthole drill", category: "Open Cut Mining" },
        { dutch: "rom-plaats", english: "run-of-mine (rom) pad", category: "Open Cut Mining" },
        { dutch: "veiligheidswal", english: "safety bund", category: "Open Cut Mining" },
        { dutch: "afzeving", english: "scalping", category: "Open Cut Mining" },
        { dutch: "taludstabiliteit", english: "slope stability", category: "Open Cut Mining" },
        { dutch: "stripratio", english: "stripping ratio", category: "Open Cut Mining" },
        { dutch: "oppervlaktemijner", english: "surface miner", category: "Open Cut Mining" },
        { dutch: "teen", english: "toe", category: "Open Cut Mining" },
        { dutch: "verwijdering van toplaag", english: "topsoil stripping", category: "Open Cut Mining" },
        { dutch: "verkeersmanagementplan", english: "traffic management plan", category: "Open Cut Mining" },
        { dutch: "ultime put", english: "ultimate pit", category: "Open Cut Mining" },
        { dutch: "wiellader", english: "wheel loader", category: "Open Cut Mining" }
    ],

    "Underground Mining": [
        { dutch: "adit", english: "adit", category: "Underground Mining" },
        { dutch: "vulling", english: "backfill", category: "Underground Mining" },
        { dutch: "blokinstorting", english: "block caving", category: "Underground Mining" },
        { dutch: "blokpijler", english: "block pillar", category: "Underground Mining" },
        { dutch: "trechterschacht", english: "drawbell", category: "Underground Mining" },
        { dutch: "trekpunt", english: "drawpoint", category: "Underground Mining" },
        { dutch: "instorting", english: "caving", category: "Underground Mining" },
        { dutch: "dwarsdoorsnede", english: "crosscut", category: "Underground Mining" },
        { dutch: "gang", english: "drift", category: "Underground Mining" },
        { dutch: "voetwand", english: "footwall", category: "Underground Mining" },
        { dutch: "hangende wand", english: "hanging wall", category: "Underground Mining" },
        { dutch: "langwandmijnbouw", english: "longwall mining", category: "Underground Mining" },
        { dutch: "productieniveau", english: "production level", category: "Underground Mining" },
        { dutch: "schacht", english: "raise", category: "Underground Mining" },
        { dutch: "hoofdas", english: "shaft", category: "Underground Mining" },
        { dutch: "stope", english: "stope", category: "Underground Mining" },
        { dutch: "bodemdaling", english: "subsidence", category: "Underground Mining" },
        { dutch: "onderuitsnijding", english: "undercut", category: "Underground Mining" },
        { dutch: "onderuitsnijdingsniveau", english: "undercut level", category: "Underground Mining" },
        { dutch: "winze", english: "winze", category: "Underground Mining" }
    ]
};

A1: [
    // Simple Greetings & Formal Introductions
    { english: "Hello, how are you?", dutch: "hallo hoe gaat het" },
    { english: "Good morning, sir.", dutch: "goedemorgen meneer" },
    { english: "Good afternoon, ma'am.", dutch: "goedemiddag mevrouw" },
    { english: "Good night, family.", dutch: "goedenavond familie" },
    { english: "Goodbye, my friend.", dutch: "tot ziens mijn vriend" },
    { english: "I am very happy today.", dutch: "ik ben heel blij vandaag" },
    { english: "How is he?", dutch: "hoe gaat het met hem" },
    { english: "How is she?", dutch: "hoe gaat het met haar" },
    { english: "Hello, good morning.", dutch: "hallo goedemorgen" },
    { english: "Goodbye, sir.", dutch: "tot ziens meneer" },

    // Travel, Transit & Essential Needs
    { english: "I would like water, please.", dutch: "ik wil graag water alsjeblieft" },
    { english: "I would like beer, please.", dutch: "ik wil graag bier alsjeblieft" },
    { english: "Where is the bathroom?", dutch: "waar is de badkamer" },
    { english: "Where is the hotel?", dutch: "waar is het hotel" },
    { english: "The hotel is near.", dutch: "het hotel is dichtbij" },
    { english: "Where is the station?", dutch: "waar is het station" },
    { english: "Where is the train?", dutch: "waar is de trein" },
    { english: "Where is the bus?", dutch: "waar is de bus" },
    { english: "Where is the airport?", dutch: "waar is het vliegveld" },
    { english: "Where is the ticket?", dutch: "waar is het ticket" },

    // Daily Routines, Work & Study
    { english: "I want a coffee.", dutch: "ik wil een koffie" },
    { english: "The coffee is hot.", dutch: "de koffie is heet" },
    { english: "I want to study more.", dutch: "ik wil meer studeren" },
    { english: "I want to work more.", dutch: "ik wil meer werken" },
    { english: "I want to read books.", dutch: "ik wil boeken lezen" },
    { english: "I want to write books.", dutch: "ik wil boeken schrijven" },
    { english: "I want to go home.", dutch: "ik wil naar huis gaan" },
    { english: "I want to rest.", dutch: "ik wil rusten" },
    { english: "I want to clean the house.", dutch: "ik wil het huis schoonmaken" },
    { english: "I want to cook today.", dutch: "ik wil vandaag koken" },
    { english: "I am learning.", dutch: "ik ben aan het leren" },
    { english: "He is fixing the television.", dutch: "hij repareert de televisie" },
    { english: "We are ready.", dutch: "wij zijn klaar" },
    { english: "The hour is near.", dutch: "het uur is dichtbij" },

    // Family, Home Life & Food Transactions
    { english: "She is my sister.", dutch: "zij is mijn zus" },
    { english: "I have two brothers.", dutch: "ik heb twee broers" },
    { english: "My friend is very happy.", dutch: "mijn vriend is heel blij" },
    { english: "We have hunger.", dutch: "wij hebben honger" },
    { english: "They have a big house.", dutch: "zij hebben een groot huis" },
    { english: "The food is good.", dutch: "het eten is goed" },
    { english: "I want bread and milk.", dutch: "ik wil brood en melk" },
    { english: "Steak with french fries, please.", dutch: "biefstuk met patat alsjeblieft" },
    { english: "Rice without beans.", dutch: "rijst zonder bonen" },
    { english: "I like cold tea.", dutch: "ik vind koude thee lekker" },
    { english: "They like cheese and eggs.", dutch: "zij vinden kaas en eieren lekker" },
    { english: "We like this place.", dutch: "wij vinden deze plek leuk" }
],
A2: [
    // Time Sequences, Indicators, and Routines
    { english: "Normally I get up early.", dutch: "normaal gesproken sta ik vroeg op" },
    { english: "I want to cook dinner now.", dutch: "ik wil nu het avondeten koken" },
    { english: "She is learning fast now.", dutch: "zij leert nu snel" },
    { english: "He wants to finish homework early.", dutch: "hij wil het huiswerk vroeg afmaken" },
    { english: "They want information now.", dutch: "zij willen nu informatie" },
    { english: "The movie finishes in ten minutes.", dutch: "de film eindigt over tien minuten" },
    { english: "I have fifteen minutes now.", dutch: "ik heb nu vijftien minuten" },
    { english: "Anoche I was happy.", dutch: "gisteravond was ik blij" },
    { english: "Before, I want breakfast.", dutch: "eerst wil ik ontbijt" },
    { english: "She already finished homework.", dutch: "zij heeft het huiswerk al afgemaakt" },
    { english: "I still have problems.", dutch: "ik heb nog steeds problemen" },

    // Household Actions, Cooking, and Spaces
    { english: "The kitchen is clean now.", dutch: "de keuken is nu schoon" },
    { english: "Open the kitchen window, please.", dutch: "open het keukenraam alsjeblieft" },
    { english: "I want to try a new breakfast today.", dutch: "ik wil vandaag een nieuw ontbijt proberen" },
    { english: "I want to fix the window now.", dutch: "ik wil nu het raam repareren" },
    { english: "He is fixing the television in the house.", dutch: "hij repareert de televisie in het huis" },
    { english: "We have food for lunch and dinner.", dutch: "wij hebben eten voor lunch en diner" },

    // Family Transactions & Travel Contexts
    { english: "We want to visit parents today.", dutch: "wij willen vandaag onze ouders bezoeken" },
    { english: "Where is my friend? I want to wait.", dutch: "waar is mijn vriend ik wil wachten" },
    { english: "I want to drive to the airport.", dutch: "ik wil naar het vliegveld rijden" },

    // Messages, Information & Communication Loops
    { english: "I want to read the message now.", dutch: "ik wil nu het bericht lezen" },
    { english: "She wants to write a message.", dutch: "zij wil een bericht schrijven" },
    { english: "He wants more information, please.", dutch: "hij wil meer informatie alsjeblieft" },
    { english: "Don't forget the message.", dutch: "vergeet het bericht niet" },

    // Travel Logistics, Apparel, & Social Scenarios
    { english: "Where is the plane? It is late.", dutch: "waar is het vliegtuig het is laat" },
    { english: "The plane arrives in twenty minutes.", dutch: "het vliegtuig komt over twintig minuten aan" },
    { english: "I need transport to the station.", dutch: "ik heb vervoer naar het station nodig" },
    { english: "They want to leave the hotel early.", dutch: "zij willen het hotel vroeg verlaten" },
    { english: "We arrived near the new place.", dutch: "wij kwamen aan dichtbij de nieuwe plek" },
    { english: "I want new shoes for the trip.", dutch: "ik wil nieuwe schoenen voor de reis" },
    { english: "She likes her small shoes.", dutch: "zij vindt haar kleine schoenen leuk" },
    { english: "Often, he likes this clean house.", dutch: "vaak vindt hij dit schone huis leuk" },

    // Number Assemblies & Quantities
    { english: "I have eleven new books.", dutch: "ik heb elf nieuwe boeken" },
    { english: "There are twelve buses in the station.", dutch: "er zijn twaalf bussen op het station" },
    { english: "Thirteen minutes to finish.", dutch: "dertien minuten om af te maken" },
    { english: "Fourteen fish and rice, please.", dutch: "veertien vis en rijst alsjeblieft" },
    { english: "We have fifteen eggs for breakfast.", dutch: "wij hebben vijftien eieren voor het ontbijt" },
    { english: "She has sixteen apples.", dutch: "zij heeft zestien appels" },
    { english: "Seventeen train tickets, please.", dutch: "zeventien treinkaartjes alsjeblieft" },
    { english: "Eighteen beers for the house.", dutch: "achttien bieren voor het huis" },
    { english: "Nineteen people study here.", dutch: "negentien mensen studeren hier" },
    { english: "Twenty minutes to rest.", dutch: "twintig minuten om te rusten" }
],

B1: [
    // Present Perfect & Continuous Actions (The Core B1 Milestone)
    { english: "I have been here for a month.", dutch: "ik ben hier een maand geweest" },
    { english: "You have learned fast during the trip.", dutch: "jij hebt snel geleerd tijdens de reis" },
    { english: "He has worked hard today.", dutch: "hij heeft vandaag hard gewerkt" },
    { english: "We have studied the past experiences.", dutch: "wij hebben de ervaringen uit het verleden bestudeerd" },
    { english: "They have lived here for two years.", dutch: "zij hebben hier twee jaar gewoond" },
    { english: "She is working in the kitchen now.", dutch: "zij is nu in de keuken aan het werken" },
    { english: "We are studying to improve our skills.", dutch: "wij studeren om onze vaardigheden te verbeteren" },
    { english: "He is reading a new book while waiting.", dutch: "hij leest een nieuw boek terwijl hij wacht" },
    { english: "They are living in a small place near school.", dutch: "zij wonen in een kleine plek dichtbij de school" },

    // Daily Life Management, Communication & Improvement
    { english: "I want to improve my communication skills.", dutch: "ik wil mijn communicatieve vaardigheden verbeteren" },
    { english: "We need to continue the conversations today.", dutch: "wij moeten vandaag de gesprekken voortzetten" },
    { english: "I want to understand the past experiences.", dutch: "ik wil de ervaringen uit het verleden begrijpen" },
    { english: "She wants to review the information now.", dutch: "zij wil nu de informatie herzien" },
    { english: "He needs to prepare the daily homework.", dutch: "hij moet het dagelijkse huiswerk voorbereiden" },
    { english: "They want to follow the rules after lunch.", dutch: "zij willen de regels volgen na de lunch" },
    { english: "I want to get a ticket for the trip.", dutch: "ik wil een ticket voor de reis krijgen" },
    { english: "We need to change the daily routine.", dutch: "wij moeten de dagelijkse routine veranderen" },
    { english: "However, I understand your problems.", dutch: "echter, ik begrijp jouw problemen" },

    // Restaurant Transactions & Food Contexts
    { english: "Where is the new restaurant?", dutch: "waar is het nieuwe restaurant" },
    { english: "Bring the menu, please.", dutch: "breng het menu alsjeblieft" },

    // Restaurant Billings, Logistics & Connections
    { english: "Bring the bill to the table, please.", dutch: "breng de rekening naar de tafel alsjeblieft" },
    { english: "The bill is big after dinner.", dutch: "de rekening is groot na het diner" },
    { english: "I want to understand the restaurant menu.", dutch: "ik wil het menu van het restaurant begrijpen" },

    // Travel Logistics, Planning & Household Shifting
    { english: "I want to plan a new trip.", dutch: "ik wil een nieuwe reis plannen" },
    { english: "They want to find a hotel near the station.", dutch: "zij willen een hotel vinden dichtbij het station" },
    { english: "She needs to cancel her train ticket.", dutch: "zij moet haar treinkaartje annuleren" },
    { english: "He wants to bring his parents on the trip.", dutch: "hij wil zijn ouders meenemen op de reis" },
    { english: "We plan to move house this month.", dutch: "wij zijn van plan deze maand te verhuizen" },
    { english: "They want to join our trip today.", dutch: "zij willen vandaag met onze reis meegaan" },
    { english: "Where can I find transport now?", dutch: "waar kan ik nu vervoer vinden" },
    { english: "The plane was canceled last night.", dutch: "het vliegtuig werd gisteravond geannuleerd" },

    // Timeline Scales, Numbers & Duration Indicators
    { english: "He studied for an hour during lunch.", dutch: "hij heeft een uur gestudeerd tijdens de lunch" },
    { english: "She has been working here for a month.", dutch: "zij werkt hier al een maand" },
    { english: "They have lived in this house for ten years.", dutch: "zij wonen al tien jaar in dit huis" },
    { english: "I need to review everything after this month.", dutch: "ik moet alles herzien na deze maand" },
    { english: "We want to prepare the trip during the month.", dutch: "wij willen de reis voorbereiden gedurende de maand" },
    { english: "He has learned a lot about skills this year.", dutch: "hij heeft dit jaar veel geleerd over vaardigheden" },
    { english: "She wants to get information about the hotel before.", dutch: "zij wil eerder informatie krijgen over het hotel" },
    { english: "They will continue studying after two years.", dutch: "zij zullen doorgaan met studeren na twee jaar" },
    { english: "While studying, I want to improve daily.", dutch: "tijdens het studeren wil ik dagelijks verbeteren" }
],

B2: [
    // Professional Strategies, Abstract Processes, and Analysis
    { english: "They want to analyze the situation.", dutch: "zij willen de situatie analyseren" },
    { english: "We need to evaluate the risks carefully.", dutch: "wij moeten de risico's zorgvuldig evalueren" },
    { english: "Although it was difficult, she finished the task.", dutch: "hoewel het moeilijk was, heeft zij de taak afgemaakt" },
    { english: "They argued that the plan was not realistic.", dutch: "zij betoogden dat het plan niet realistisch was" },
    { english: "The strategy has increased our performance results.", dutch: "de strategie heeft onze prestatie-resultaten verhoogd" },
    { english: "Therefore, it is necessary to analyze the risk concept.", dutch: "daarom is het nodig om het risicoconcept te analyseren" },
    { english: "We need to coordinate a positive strategy to achieve results.", dutch: "wij moeten een positieve strategie coördineren om resultaten te behalen" },
    { english: "She has clarified her innovative approach during the discussion.", dutch: "zij heeft haar innovatieve benadering verduidelijkt tijdens de discussie" },
    { english: "I want to update the system to strengthen our skills.", dutch: "ik wil het systeem bijwerken om onze vaardigheden te versterken" },
    { english: "He has explored every possibility to optimize the task.", dutch: "hij heeft elke mogelijkheid onderzocht om de taak te optimaliseren" },
    { english: "They argued that a professional approach is necessary.", dutch: "zij betoogden dat een professionele aanpak nodig is" },
    { english: "We have analyzed the complicated situation again.", dutch: "wij hebben de ingewikkelde situatie opnieuw geanalyseerd" },
    { english: "She has adapted the strategy to improve performance.", dutch: "zij heeft de strategie aangepast om de prestaties te verbeteren" },
    { english: "I want to try a positive approach now.", dutch: "ik wil nu een positieve benadering proberen" },
    { english: "He forgot to check the results of the process.", dutch: "hij vergat de resultaten van het proces te controleren" },
    { english: "We must analyze the results carefully.", dutch: "wij moeten de resultaten zorgvuldig analyseren" },
    { english: "She wants to improve her performance.", dutch: "zij wil haar prestaties verbeteren" },
    { english: "We need to update the system.", dutch: "wij moeten het systeem bijwerken" },
    { english: "He explained the strategy clearly.", dutch: "hij legde de strategie duidelijk uit" },
    { english: "They want to optimize the process.", dutch: "zij willen het proces optimaliseren" },

    // Abstract Milestones, Culture, and Challenges
    { english: "We will continue even if there are challenges.", dutch: "wij gaan door zelfs als er uitdagingen zijn" },
    { english: "Despite the problems, they finished the trip.", dutch: "ondanks de problemen hebben zij de reis afgemaakt" },
    { english: "We need to adapt to the new situation.", dutch: "wij moeten ons aanpassen aan de nieuwe situatie" },
    { english: "She wants to expand her professional experience.", dutch: "zij wil haar professionele ervaring uitbreiden" },
    { english: "He insisted on reviewing the data again.", dutch: "hij drong erop aan de gegevens opnieuw te bekijken" },
    { english: "They hope to achieve better results.", dutch: "zij hopen betere resultaten te behalen" },
    { english: "We need to clarify the instructions.", dutch: "wij moeten de instructies verduidelijken" },
    { english: "Although it seems easy, it is complicated.", dutch: "hoewel het makkelijk lijkt, is het ingewikkeld" },
    { english: "She argued that the change was necessary.", dutch: "zij betoogde dat de verandering nodig was" },
    { english: "They want to strengthen the communication process.", dutch: "zij willen het communicatieproces versterken" },
    { english: "They discussed the situation for an hour during lunch.", dutch: "zij bespraken de situatie een uur tijdens de lunch" },
    { english: "She wants to learn about our society and culture.", dutch: "zij wil leren over onze samenleving en cultuur" },
    { english: "In addition, motivation is necessary to achieve goals.", dutch: "bovendien is motivatie nodig om doelen te bereiken" },
    { english: "Expectations are high for the future long term trip.", dutch: "de verwachtingen zijn hoog voor de toekomstige lange-termijnreis" },
    { english: "They live in a remote place, however they study daily.", dutch: "zij wonen op een afgelegen plek, maar studeren dagelijks" },

    // Final Verification Loops & Resource Management
    { english: "I want to understand this abstract concept better.", dutch: "ik wil dit abstracte concept beter begrijpen" },
    { english: "We must prepare for possible system changes.", dutch: "wij moeten ons voorbereiden op mogelijke systeemveranderingen" },
    { english: "They want to increase information access in society.", dutch: "zij willen de toegang tot informatie in de samenleving vergroten" },
    { english: "He has reduced the risk of the strategy.", dutch: "hij heeft het risico van de strategie verminderd" }
]
};

/* ============================================================
   CEFR LEVELS — A1 → B2 Vocabulary (Dutch → English)
   ============================================================ */

const CEFR_LEVELS = {
    A1: [
        // Daily Life
        { dutch: "leven", english: "to live", category: "Daily Life" },
        { dutch: "werken", english: "to work", category: "Daily Life" },
        { dutch: "studeren", english: "to study", category: "Daily Life" },
        { dutch: "lezen", english: "to read", category: "Daily Life" },
        { dutch: "boeken", english: "books", category: "Daily Life" },
        { dutch: "uur", english: "hour", category: "Daily Life" },
        { dutch: "opstaan", english: "to get up", category: "Daily Life" },
        { dutch: "muziek", english: "music", category: "Daily Life" },
        { dutch: "televisie", english: "television", category: "Daily Life" },
        { dutch: "schoonmaken", english: "to clean", category: "Daily Life" },
        { dutch: "koken", english: "to cook", category: "Daily Life" },
        { dutch: "openen", english: "to open", category: "Daily Life" },
        { dutch: "afmaken", english: "to finish", category: "Daily Life" },
        { dutch: "schrijven", english: "to write", category: "Daily Life" },
        { dutch: "leren", english: "to learn", category: "Daily Life" },
        { dutch: "gaan", english: "to go", category: "Daily Life" },
        { dutch: "doen", english: "to do", category: "Daily Life" },
        { dutch: "zien", english: "to see", category: "Daily Life" },
        { dutch: "luisteren", english: "to listen", category: "Daily Life" },
        { dutch: "uitgaan", english: "to go out", category: "Daily Life" },
        { dutch: "rusten", english: "to rest", category: "Daily Life" },
        { dutch: "heet", english: "hot", category: "Daily Life" },
        { dutch: "koud", english: "cold", category: "Daily Life" },
        { dutch: "blij", english: "happy", category: "Daily Life" },
        { dutch: "nieuw", english: "new", category: "Daily Life" },
        { dutch: "hallo", english: "hello", category: "Daily Life" },
        { dutch: "tot ziens", english: "goodbye", category: "Daily Life" },
        { dutch: "dank je", english: "thank you", category: "Daily Life" },
        { dutch: "sorry", english: "sorry / I feel", category: "Daily Life" },
        { dutch: "jij bent", english: "you are", category: "Daily Life" },
        { dutch: "klaar", english: "ready", category: "Daily Life" },
        { dutch: "wakker", english: "awake", category: "Daily Life" },
        { dutch: "tijd", english: "time", category: "Daily Life" },
        { dutch: "problemen", english: "problems", category: "Daily Life" },
        { dutch: "verandering", english: "change", category: "Daily Life" },
        { dutch: "goedemorgen", english: "good morning", category: "Daily Life" },
        { dutch: "goedemiddag", english: "good afternoon", category: "Daily Life" },
        { dutch: "goedenavond", english: "good night", category: "Daily Life" },
        { dutch: "goed", english: "well / good", category: "Daily Life" },
        { dutch: "meneer", english: "sir", category: "Daily Life" },
        { dutch: "mevrouw", english: "ma'am", category: "Daily Life" },

        // Family
        { dutch: "familie", english: "family", category: "Family" },
        { dutch: "moeder", english: "mother", category: "Family" },
        { dutch: "vader", english: "father", category: "Family" },
        { dutch: "zoon", english: "son", category: "Family" },
        { dutch: "dochter", english: "daughter", category: "Family" },
        { dutch: "vriend", english: "friend", category: "Family" },
        { dutch: "vriendin", english: "friend (female)", category: "Family" },
        { dutch: "zus", english: "sister", category: "Family" },
        { dutch: "broers", english: "brothers", category: "Family" },
        { dutch: "zussen", english: "sisters", category: "Family" },
        { dutch: "grootmoeder", english: "grandmother", category: "Family" },
        { dutch: "honger", english: "hunger", category: "Family" },
        { dutch: "wij hebben", english: "we have", category: "Family" },
        { dutch: "zij hebben", english: "they have", category: "Family" },

        // Food & Drink
        { dutch: "water", english: "water", category: "Food & Drink" },
        { dutch: "eten", english: "food", category: "Food & Drink" },
        { dutch: "koffie", english: "coffee", category: "Food & Drink" },
        { dutch: "thee", english: "tea", category: "Food & Drink" },
        { dutch: "melk", english: "milk", category: "Food & Drink" },
        { dutch: "biefstuk", english: "steak", category: "Food & Drink" },
        { dutch: "patat", english: "french fries", category: "Food & Drink" },
        { dutch: "brood", english: "bread", category: "Food & Drink" },
        { dutch: "bier", english: "beer", category: "Food & Drink" },
        { dutch: "ei", english: "egg", category: "Food & Drink" },
        { dutch: "fruit", english: "fruit", category: "Food & Drink" },
        { dutch: "appel", english: "apple", category: "Food & Drink" },
        { dutch: "sinaasappel", english: "orange", category: "Food & Drink" },
        { dutch: "banaan", english: "banana", category: "Food & Drink" },
        { dutch: "kip", english: "chicken", category: "Food & Drink" },
        { dutch: "vis", english: "fish", category: "Food & Drink" },
        { dutch: "soep", english: "soup", category: "Food & Drink" },
        { dutch: "salade", english: "salad", category: "Food & Drink" },
        { dutch: "rijst", english: "rice", category: "Food & Drink" },
        { dutch: "bonen", english: "beans", category: "Food & Drink" },
        { dutch: "kaas", english: "cheese", category: "Food & Drink" },
        { dutch: "zout", english: "salt", category: "Food & Drink" },

        // Travel
        { dutch: "bus", english: "bus", category: "Travel" },
        { dutch: "trein", english: "train", category: "Travel" },
        { dutch: "ticket", english: "ticket", category: "Travel" },
        { dutch: "station", english: "station", category: "Travel" },
        { dutch: "vliegveld", english: "airport", category: "Travel" },
        { dutch: "huis", english: "house", category: "Travel" },
        { dutch: "school", english: "school", category: "Travel" },
        { dutch: "hotel", english: "hotel", category: "Travel" },
        { dutch: "badkamer", english: "bathroom", category: "Travel" },
        { dutch: "plaats", english: "place", category: "Travel" },

        // Connectors & Pronouns
        { dutch: "en", english: "and", category: "Connectors" },
        { dutch: "of", english: "or", category: "Connectors" },
        { dutch: "met", english: "with", category: "Connectors" },
        { dutch: "zonder", english: "without", category: "Connectors" },
        { dutch: "meer", english: "more", category: "Connectors" },
        { dutch: "weinig", english: "little", category: "Connectors" },
        { dutch: "alleen", english: "only", category: "Connectors" },
        { dutch: "erg", english: "very", category: "Connectors" },
        { dutch: "dichtbij", english: "near", category: "Connectors" },
        { dutch: "voor", english: "for", category: "Connectors" },
        { dutch: "naar", english: "to", category: "Connectors" },
        { dutch: "in", english: "in", category: "Connectors" },
        { dutch: "zij", english: "she", category: "Connectors" },
        { dutch: "hij", english: "he", category: "Connectors" },
        { dutch: "zij", english: "they", category: "Connectors" },
        { dutch: "haar / zijn / hun", english: "his / her / their", category: "Connectors" },
        { dutch: "wat", english: "what", category: "Connectors" },
        { dutch: "wie", english: "who", category: "Connectors" },
        { dutch: "wanneer", english: "when", category: "Connectors" },
        { dutch: "hoe", english: "how", category: "Connectors" },
        { dutch: "welk", english: "which", category: "Connectors" },
        { dutch: "waar", english: "where", category: "Connectors" },
        { dutch: "niet", english: "no / not", category: "Connectors" },
        { dutch: "ja", english: "yes", category: "Connectors" },
        { dutch: "er is / er zijn", english: "there is / there are", category: "Connectors" },
        { dutch: "ander", english: "other / another", category: "Connectors" },
        { dutch: "ondanks", english: "despite", category: "Connectors" },
        { dutch: "alsjeblieft", english: "please", category: "Connectors" },
        { dutch: "me", english: "myself / to me", category: "Connectors" },
        { dutch: "mijn", english: "my", category: "Connectors" },
        { dutch: "een", english: "a / an", category: "Connectors" },
        { dutch: "de", english: "the", category: "Connectors" },

        // Verbs & Participles
        { dutch: "is", english: "is", category: "Verbs" },
        { dutch: "vindt leuk", english: "likes", category: "Verbs" },
        { dutch: "vinden leuk", english: "they like", category: "Verbs" },
        { dutch: "zou willen", english: "would like", category: "Verbs" },
        { dutch: "aan het leren", english: "learning", category: "Verbs" },
        { dutch: "aan het repareren", english: "fixing", category: "Verbs" },
        { dutch: "is / u bent", english: "is / you are (formal)", category: "Verbs" },
        { dutch: "ik wil", english: "I want", category: "Verbs" },
        { dutch: "ik heb", english: "I have", category: "Verbs" },
        { dutch: "ik heb nodig", english: "I need", category: "Verbs" },

        // Adjectives
        { dutch: "goed", english: "good", category: "Adjectives" },
        { dutch: "moeilijk", english: "difficult", category: "Adjectives" },
        { dutch: "duidelijk", english: "clear", category: "Adjectives" },
        { dutch: "makkelijk", english: "easy", category: "Adjectives" },
        { dutch: "slecht", english: "bad", category: "Adjectives" },
        { dutch: "klein", english: "small", category: "Adjectives" },

        // Numbers
        { dutch: "één", english: "one", category: "Numbers" },
        { dutch: "twee", english: "two", category: "Numbers" },
        { dutch: "drie", english: "three", category: "Numbers" },
        { dutch: "vier", english: "four", category: "Numbers" },
        { dutch: "vijf", english: "five", category: "Numbers" },
        { dutch: "zes", english: "six", category: "Numbers" },
        { dutch: "zeven", english: "seven", category: "Numbers" },
        { dutch: "acht", english: "eight", category: "Numbers" },
        { dutch: "negen", english: "nine", category: "Numbers" },
        { dutch: "tien", english: "ten", category: "Numbers" }
    ],
A2: [
    // Daily Life
    { dutch: "ontbijt", english: "breakfast", category: "Daily Life" },
    { dutch: "lunch", english: "lunch", category: "Daily Life" },
    { dutch: "diner", english: "dinner", category: "Daily Life" },
    { dutch: "vroeg", english: "early", category: "Daily Life" },
    { dutch: "laat", english: "late", category: "Daily Life" },
    { dutch: "gisteravond", english: "last night", category: "Daily Life" },
    { dutch: "nu", english: "now", category: "Daily Life" },
    { dutch: "minuten", english: "minutes", category: "Daily Life" },
    { dutch: "huiswerk", english: "homework", category: "Daily Life" },
    { dutch: "bericht", english: "message", category: "Daily Life" },
    { dutch: "informatie", english: "information", category: "Daily Life" },
    { dutch: "film", english: "movie", category: "Daily Life" },
    { dutch: "raam", english: "window", category: "Daily Life" },
    { dutch: "keuken", english: "kitchen", category: "Daily Life" },
    { dutch: "schoenen", english: "shoes", category: "Daily Life" },
    { dutch: "reis", english: "trip", category: "Daily Life" },
    { dutch: "proberen", english: "to try", category: "Daily Life" },
    { dutch: "vergeten", english: "to forget", category: "Daily Life" },
    { dutch: "wachten", english: "to wait", category: "Daily Life" },
    { dutch: "rijden", english: "to drive", category: "Daily Life" },
    { dutch: "repareren", english: "to fix", category: "Daily Life" },
    { dutch: "weggaan", english: "to leave", category: "Daily Life" },
    { dutch: "aankomen", english: "to arrive", category: "Daily Life" },

    // Family
    { dutch: "ouders", english: "parents", category: "Family" },

    // Travel
    { dutch: "vliegtuig", english: "plane", category: "Travel" },
    { dutch: "bezoeken", english: "to visit", category: "Travel" },
    { dutch: "vervoer", english: "transport", category: "Travel" },

    // Connectors
    { dutch: "vaak", english: "often", category: "Connectors" },
    { dutch: "voor", english: "before", category: "Connectors" },
    { dutch: "al", english: "already", category: "Connectors" },
    { dutch: "nog steeds", english: "still", category: "Connectors" },
    { dutch: "normaal gesproken", english: "normally", category: "Connectors" },
    { dutch: "omdat", english: "because", category: "Connectors" },

    // Numbers
    { dutch: "elf", english: "eleven", category: "Numbers" },
    { dutch: "twaalf", english: "twelve", category: "Numbers" },
    { dutch: "dertien", english: "thirteen", category: "Numbers" },
    { dutch: "veertien", english: "fourteen", category: "Numbers" },
    { dutch: "vijftien", english: "fifteen", category: "Numbers" },
    { dutch: "zestien", english: "sixteen", category: "Numbers" },
    { dutch: "zeventien", english: "seventeen", category: "Numbers" },
    { dutch: "achttien", english: "eighteen", category: "Numbers" },
    { dutch: "negentien", english: "nineteen", category: "Numbers" },
    { dutch: "twintig", english: "twenty", category: "Numbers" }
],
B1: [
    // Daily Life — auxiliary verbs
    { dutch: "ik heb", english: "I have (auxiliary)", category: "Daily Life" },
    { dutch: "jij hebt", english: "you have (auxiliary)", category: "Daily Life" },
    { dutch: "hij/zij heeft", english: "he/she has (auxiliary)", category: "Daily Life" },
    { dutch: "wij hebben", english: "we have (auxiliary)", category: "Daily Life" },
    { dutch: "jullie hebben", english: "you (plural) have (auxiliary)", category: "Daily Life" },
    { dutch: "zij hebben", english: "they have (auxiliary)", category: "Daily Life" },

    // Daily Life — participles
    { dutch: "geweest", english: "been", category: "Daily Life" },
    { dutch: "geleerd", english: "learned", category: "Daily Life" },
    { dutch: "aan het werken", english: "working", category: "Daily Life" },
    { dutch: "aan het studeren", english: "studying", category: "Daily Life" },
    { dutch: "aan het lezen", english: "reading", category: "Daily Life" },
    { dutch: "aan het leven", english: "living", category: "Daily Life" },
    { dutch: "dagelijks", english: "daily", category: "Daily Life" },

    // Daily Life — verbs & nouns
    { dutch: "communicatie", english: "communication", category: "Daily Life" },
    { dutch: "gesprekken", english: "conversations", category: "Daily Life" },
    { dutch: "verbeteren", english: "to improve", category: "Daily Life" },
    { dutch: "vaardigheden", english: "skills", category: "Daily Life" },
    { dutch: "herzien", english: "to review", category: "Daily Life" },
    { dutch: "doorgaan", english: "to continue", category: "Daily Life" },
    { dutch: "volgen", english: "to follow", category: "Daily Life" },
    { dutch: "voorbereiden", english: "to prepare", category: "Daily Life" },
    { dutch: "krijgen", english: "to get", category: "Daily Life" },
    { dutch: "begrijpen", english: "to understand", category: "Daily Life" },

    // Family & Personal Experience
    { dutch: "ervaringen", english: "experiences", category: "Family" },
    { dutch: "verleden", english: "past", category: "Family" },

    // Food & Drink
    { dutch: "restaurant", english: "restaurant", category: "Food & Drink" },
    { dutch: "menu", english: "menu", category: "Food & Drink" },
    { dutch: "rekening", english: "bill", category: "Food & Drink" },

    // Travel & Planning Logistics
    { dutch: "vinden", english: "to find", category: "Travel" },
    { dutch: "annuleren", english: "to cancel", category: "Travel" },
    { dutch: "brengen", english: "to bring", category: "Travel" },
    { dutch: "plannen", english: "to plan", category: "Travel" },
    { dutch: "verhuizen", english: "to move (house)", category: "Travel" },
    { dutch: "meedoen", english: "to join", category: "Travel" },

    // Connectors
    { dutch: "terwijl", english: "while", category: "Connectors" },
    { dutch: "echter", english: "however", category: "Connectors" },
    { dutch: "over", english: "about", category: "Connectors" },
    { dutch: "na", english: "after", category: "Connectors" },
    { dutch: "tijdens", english: "during", category: "Connectors" },

    // Numbers & Time Scales
    { dutch: "maand", english: "month", category: "Numbers" },
    { dutch: "jaren", english: "years", category: "Numbers" }
],
B2: [
    // Daily Life — abstract nouns & professional vocabulary
    { dutch: "proces", english: "process", category: "Daily Life" },
    { dutch: "resultaten", english: "results", category: "Daily Life" },
    { dutch: "prestatie", english: "performance", category: "Daily Life" },
    { dutch: "strategie", english: "strategy", category: "Daily Life" },
    { dutch: "systeem", english: "system", category: "Daily Life" },
    { dutch: "benadering", english: "approach", category: "Daily Life" },
    { dutch: "concept", english: "concept", category: "Daily Life" },
    { dutch: "risico", english: "risk", category: "Daily Life" },
    { dutch: "mogelijkheid", english: "possibility", category: "Daily Life" },
    { dutch: "situatie", english: "situation", category: "Daily Life" },

    // Daily Life — advanced verbs
    { dutch: "optimaliseren", english: "to optimize", category: "Daily Life" },
    { dutch: "coördineren", english: "to coordinate", category: "Daily Life" },
    { dutch: "verhogen", english: "to increase", category: "Daily Life" },
    { dutch: "bijwerken", english: "to update", category: "Daily Life" },
    { dutch: "analyseren", english: "to analyze", category: "Daily Life" },
    { dutch: "evalueren", english: "to evaluate", category: "Daily Life" },
    { dutch: "bespreken", english: "to discuss", category: "Daily Life" },
    { dutch: "verduidelijken", english: "to clarify", category: "Daily Life" },
    { dutch: "versterken", english: "to strengthen", category: "Daily Life" },
    { dutch: "zich aanpassen", english: "to adapt", category: "Daily Life" },
    { dutch: "bereiken", english: "to achieve", category: "Daily Life" },

    // Daily Life — B2 adjectives
    { dutch: "ingewikkeld", english: "complicated", category: "Daily Life" },
    { dutch: "noodzakelijk", english: "necessary", category: "Daily Life" },
    { dutch: "mogelijk", english: "possible", category: "Daily Life" },
    { dutch: "effectief", english: "effective", category: "Daily Life" },
    { dutch: "realistisch", english: "realistic", category: "Daily Life" },
    { dutch: "innovatief", english: "innovative", category: "Daily Life" },
    { dutch: "professioneel", english: "professional", category: "Daily Life" },
    { dutch: "positief", english: "positive", category: "Daily Life" },

    // Daily Life — participles used in B2 sentences
    { dutch: "geanalyseerd", english: "analyzed", category: "Daily Life" },
    { dutch: "geëvalueerd", english: "evaluated", category: "Daily Life" },
    { dutch: "betoogd", english: "argued", category: "Daily Life" },
    { dutch: "uitgebreid", english: "expanded", category: "Daily Life" },
    { dutch: "aangepast", english: "adapted", category: "Daily Life" },
    { dutch: "verminderd", english: "reduced", category: "Daily Life" },
    { dutch: "geëist", english: "insisted", category: "Daily Life" },
    { dutch: "verkend", english: "explored", category: "Daily Life" },
    { dutch: "verduidelijkt", english: "clarified", category: "Daily Life" },
    { dutch: "versterkt", english: "strengthened", category: "Daily Life" },
    { dutch: "besproken", english: "discussed", category: "Daily Life" },
    { dutch: "bijgewerkt", english: "updated", category: "Daily Life" },
    { dutch: "geoptimaliseerd", english: "optimized", category: "Daily Life" },

    // Family — abstract B2 concepts
    { dutch: "samenleving", english: "society", category: "Family" },
    { dutch: "cultuur", english: "culture", category: "Family" },
    { dutch: "motivatie", english: "motivation", category: "Family" },
    { dutch: "uitdagingen", english: "challenges", category: "Family" },
    { dutch: "verwachtingen", english: "expectations", category: "Family" },

    // Travel — B2 abstract travel concepts
    { dutch: "afgelegen", english: "remote", category: "Travel" },
    { dutch: "toekomst", english: "future", category: "Travel" },
    { dutch: "lange termijn", english: "long term", category: "Travel" },

    // Connectors — B2 logical connectors
    { dutch: "bovendien", english: "in addition", category: "Connectors" },
    { dutch: "daarom", english: "therefore", category: "Connectors" },
    { dutch: "ondanks", english: "despite", category: "Connectors" },
    { dutch: "hoewel", english: "although", category: "Connectors" },
    { dutch: "zelfs", english: "even", category: "Connectors" },
    { dutch: "weer", english: "again", category: "Connectors" },
    { dutch: "zorgvuldig", english: "carefully", category: "Connectors" }
],

/* ============================================================
   LISTEN VOCAB — A1 → B2 (Category → Word List)
   ============================================================ */
const LISTEN_VOCAB = {
    A1: {
        "Daily Life": [
            "leven","werken","studeren","lezen","boeken","uur",
            "opstaan","muziek","televisie","schoonmaken","koken",
            "openen","afmaken","schrijven","leren","gaan","doen",
            "zien","luisteren","uitgaan","rusten","heet","koud",
            "blij","nieuw","hallo","tot ziens","dank je","sorry",
            "jij bent","klaar","wakker","tijd","problemen","verandering",
            "goedemorgen","goedemiddag","goedenavond","goed","meneer","mevrouw"
        ],
        "Family": [
            "familie","moeder","vader","zoon","dochter","vriend","vriendin",
            "zus","broers","zussen","grootmoeder","honger",
            "wij hebben","zij hebben"
        ],
        "Food & Drink": [
            "water","eten","koffie","thee","melk","biefstuk","patat",
            "brood","bier","ei","fruit","appel","sinaasappel",
            "banaan","kip","vis","soep","salade","rijst",
            "bonen","kaas","zout"
        ],
        "Travel": [
            "bus","trein","ticket","station","vliegveld",
            "huis","school","hotel","badkamer","plaats"
        ],
        "Connectors": [
            "en","of","met","zonder","meer","weinig","alleen","erg",
            "dichtbij","voor","naar","in","wat","wie","wanneer",
            "hoe","welk","waar","niet","ja","er is / er zijn","ander",
            "ondanks","alsjeblieft","me","mijn","een","een","de","de",
            "zij","haar / zijn / hun"
        ],
        "Verbs": [
            "is","vindt leuk","vinden leuk","zou willen","aan het leren","aan het repareren",
            "is / u bent","ik wil","ik heb","ik heb nodig"
        ],
        "Adjectives": [
            "goed","moeilijk","duidelijk","makkelijk","slecht","klein"
        ],
        "Numbers": [
            "één","twee","drie","vier","vijf","zes","zeven","acht","negen","tien"
        ]
    },

    A2: {
        "Daily Life": [
            "ontbijt","lunch","diner","vroeg","laat","gisteravond",
            "nu","minuten","huiswerk","bericht","informatie",
            "film","raam","keuken","schoenen","reis","proberen",
            "vergeten","wachten","rijden","repareren","weggaan","aankomen"
        ],
        "Family": [],
        "Travel": [
            "vliegtuig","bezoeken","vervoer"
        ],
        "Connectors": [
            "vaak","voor","al","nog steeds","normaal gesproken","omdat"
        ],
        "Numbers": [
            "elf","twaalf","dertien","veertien","vijftien","zestien","zeventien","achttien","negentien","twintig"
        ]
    },

    B1: {
        "Daily Life": [
            "ik heb","jij hebt","hij/zij heeft","wij hebben","jullie hebben","zij hebben",
            "geweest","geleerd","aan het werken","aan het studeren",
            "aan het lezen","aan het leven","dagelijks",
            "communicatie","gesprekken","verbeteren",
            "vaardigheden","herzien","doorgaan",
            "volgen","voorbereiden","krijgen","begrijpen"
        ],
        "Family": [
            "ervaringen","verleden"
        ],
        "Food & Drink": [
            "restaurant","menu","rekening"
        ],
        "Travel": [
            "vinden","annuleren","brengen","plannen",
            "verhuizen","meedoen"
        ],
        "Connectors": [
            "terwijl","echter","over",
            "na","tijdens"
        ],
        "Numbers": [
            "maand","jaren"
        ]
    },

    B2: {
        "Daily Life": [
            "proces","resultaten","prestatie",
            "strategie","systeem","benadering","concept",
            "risico","mogelijkheid","situatie",
            "optimaliseren","coördineren","verhogen","bijwerken",
            "analyseren","evalueren","bespreken","verduidelijken",
            "versterken","zich aanpassen","bereiken",
            "ingewikkeld","noodzakelijk","mogelijk","effectief",
            "realistisch","innovatief","professioneel","positief",
            "geanalyseerd","geëvalueerd","betoogd","uitgebreid",
            "aangepast","verminderd","geëist","verkend",
            "verduidelijkt","versterkt","besproken","bijgewerkt",
            "geoptimaliseerd"
        ],
        "Family": [
            "samenleving","cultuur","motivatie",
            "uitdagingen","verwachtingen"
        ],
        "Food & Drink": [],
        "Travel": [
            "afgelegen","toekomst","lange termijn"
        ],
        "Connectors": [
            "bovendien","daarom","ondanks",
            "hoewel","zelfs","weer","zorgvuldig"
        ],
        "Numbers": []
    }
};

/* ============================================================
   WORD-BY-WORD DICTIONARY — CEFR A1 → B2 (Categorized)
   ============================================================ */

const WORD_DICT = {
    /* ============================================================
       FOUNDATIONAL CONVERSATIONAL ARCHITECTURE (STRUCTURAL TOKENS)
       ============================================================ */

    "kan": "can",
    "kopen": "buy",
    "bestellen": "order",
    "de": "the",
    "het": "the",
    "een": "a / an",
    "is": "is",
    "zijn": "are",
    "wil": "want",
    "heeft_nodig": "need",

    /* ============================================================
       VERB INFLECTION MATRIX (SUBJECT LOOPS)
       ============================================================ */
    "ik kan": "I can",
    "jij kunt": "you can (informal)",
    "hij kan": "he can",
    "zij kan": "she can",
    "u kunt": "you (formal) can",
    "wij kunnen": "we can",
    "zij kunnen": "they can",

    "jij wilt": "you want",
    "jij hebt nodig": "you need",
    "jij hebt": "you have",
    "jij doet": "you do / you make",

    "ik koop": "I buy",
    "jij koopt": "you buy",

    "ik bestel": "I order / I request",
    "jij bestelt": "you order",

    /* ============================================================
       ADJECTIVE AGREEMENT (GENDER & PLURAL)
       ============================================================ */
    "goed": "good",
    "goed_vrouw": "good (fem.)",
    "goed_mv": "good (plural)",
    "goed_vrouw_mv": "good (fem. plural)",

    "slecht": "bad",
    "slecht_vrouw": "bad (fem.)",
    "slecht_mv": "bad (plural)",
    "slecht_vrouw_mv": "bad (fem. plural)",

    "nieuw": "new",
    "nieuw_vrouw": "new (fem.)",
    "nieuw_mv": "new (plural)",
    "nieuw_vrouw_mv": "new (fem. plural)",

    "klein": "small",
    "klein_vrouw": "small (fem.)",
    "klein_mv": "small (plural)",
    "klein_vrouw_mv": "small (fem. plural)",

    "koud": "cold",
    "koud_vrouw": "cold (fem.)",
    "koud_mv": "cold (plural)",
    "koud_vrouw_mv": "cold (fem. plural)",

    "groot_mv": "big / large (plural)",
    "lang_mv": "tall (plural)",
    "lang_vrouw_mv": "tall (fem. plural)",

    "schoon_vrouw": "clean (fem.)",
    "schoon_mv": "clean (plural)",

    /* ============================
       Functional Connectors
       ============================ */
    "en": "and",
    "of": "or",
    "met": "with",
    "zonder": "without",
    "meer": "more",
    "weinig": "little",
    "alleen": "only / alone",
    "erg": "very",
    "dichtbij": "near",
    "voor": "for",
    "naar": "to",
    "in": "in / on",
    "door": "for / by",
    "van": "of / from",
    "naar_de": "to the",
    "van_de": "of the",
    "maar": "but",
    "omdat": "because",
    "ook": "also",
    "dan": "then",
    "als": "yes / if",
    "er_is": "there is",
    "er_zijn": "there are",
    "ander_vrouw": "other / another (fem.)",
    "ander_man": "other / another (masc.)",
    "anderen_vrouw_mv": "others (fem. plural)",
    "anderen_mv": "others (plural)",
    "ondanks": "despite",
    "alsjeblieft": "please",
    "terwijl": "while",
    "echter": "however",
    "over": "about / on top of",
    "na": "after",
    "tijdens": "during",
    "bovendien": "in addition / furthermore",
    "daarom": "therefore",
    "hoewel": "although",
    "zelfs": "even",
    "weer": "again",

    /* ============================
       Question Roots & Interrogatives
       ============================ */
    "wat": "what",
    "wie": "who",
    "wanneer": "when",
    "hoe": "how",
    "welk": "which",
    "waar": "where",
    "waarom": "why",

    /* ============================
       Articles
       ============================ */
    "de": "the",
    "het": "the",
    "een": "a / an",
    "sommige": "some",

    /* ============================
       Pronouns & Object Markers
       ============================ */
    "mij": "me / myself",
    "jou": "you / yourself",
    "aan_hem": "to him",
    "aan_haar": "to her",
    "ons": "us / ourselves",
    "hen": "to them",
    "het": "it",
    "haar_pronoun": "it / her",
    "hen_man": "them (masc.)",
    "hen_vrouw": "them (fem.)",

    "dat": "that / which",

    "hij": "he",
    "zij": "she",
    "ik": "I",
    "jij": "you (informal)",
    "wij": "we",
    "wij_vrouw": "we (fem.)",
    "zij_mv": "they",
    "zij_vrouw_mv": "they (fem.)",
    "jullie": "you all",

    "mijn": "my",
    "mijn_mv": "my (plural)",
    "zijn_haar_hun": "his / her / their / your",
    "zijn_haar_hun_mv": "his / her / their / your (plural)",
    "jouw": "your",
    "jouw_mv": "your (plural)",

    "dit": "this",
    "deze_man": "this (masc.)",
    "deze_vrouw": "this (fem.)",
    "die_man": "that (masc.)",
    "die_vrouw": "that (fem.)",

    "iets": "something",
    "alles": "everything / all",
    "alle_vrouw_mv": "all (fem. plural)",
    "alle_mv": "all (masc. plural)",

    /* ============================
       High-Frequency Verb Inflections
       ============================ */
    "ik ben": "I am",
    "jij bent": "you are",
    "wij zijn": "we are",
    "zij zijn": "they are",

    "ik heb": "I have",
    "hij heeft": "he has",
    "zij heeft": "she has",
    "wij hebben": "we have",
    "zij hebben": "they have",

    "ik wil": "I want",
    "hij wil": "he wants",
    "wij willen": "we want",
    "zij willen": "they want",

    "ik heb nodig": "I need",
    "hij heeft nodig": "he needs",
    "wij hebben nodig": "we need",
    "zij hebben nodig": "they need",

    "ik leef": "I live",
    "zij leven": "they live",

    "hij werkt": "he works",
    "aan_het_werken": "working",

    "aan_het_studeren": "studying",
    "aan_het_leren": "learning",
    "aan_het_repareren": "fixing",
    "aan_het_lezen": "reading",
    "aan_het_wonen": "living",
    "aan_het_wachten": "waiting",
    "aan_het_kijken": "watching / seeing",
    "aan_het_praten": "talking / speaking",
    "aan_het_koken": "cooking",
    "aan_het_rijden": "driving",
    "aan_het_plannen": "planning",
    "aan_het_ontbijten": "eating breakfast",

    "komt_aan": "arrives",
    "kwamen_aan": "we arrived",
    "zullen_arriveren": "they will arrive",
    "arriveer": "I arrive / he arrives",

    "opent": "opens",

    "stelde_voor": "suggested",
    "betoogden": "argued",
    "maakten_af": "they finished",
    "drong_aan": "insisted",
    "legde_uit": "explained",
    "vroeg": "asked for",

    "zou_helpen": "helped / would help",
    "plannen": "they plan",

    "ons_aanpassen": "to adapt ourselves",
    "ons_voorbereiden": "to prepare ourselves",

    "zal_hebben": "he / she will have",
    "zullen_zijn": "they will be",

    "voltooide": "completed",
    "bezocht": "visited",
    "vergat": "forgot",
    "belde": "called",
    "ik_kocht": "I bought",
    "ik_maakte_schoon": "I cleaned",
    "ik_schreef": "I wrote",

    "ik_zal_studeren": "I will study",
    "ik_zal_helpen": "I will help",
    "wij_zullen_doorgaan": "we will continue",
    "wij_zullen_eten": "we will eat",

    "weggaan": "to leave / to go away"
};
/* ============================
   Time, Chronology & Adverbs
   ============================ */
"vandaag": "today",                    // vandaag
"morgen": "tomorrow / morning",        // morgen / ochtend
"gisteren": "yesterday",               // gisteren
"gisteravond": "last night",           // gisteravond
"nu": "now",                           // nu
"altijd": "always",                    // altijd
"nooit": "never",                      // nooit
"al": "already / now",                 // al / nu
"nog": "still / yet",                  // nog / nog steeds
"normaal_gesproken": "normally",       // normaal gesproken
"binnenkort": "soon",                  // binnenkort
"laat": "late / afternoon",            // laat / middag
"vroeg": "early",                      // vroeg
"vaak": "often",                       // vaak
"later": "later",                      // later
"vanavond": "tonight",                 // vanavond
"om_negen_uur": "at nine",             // om negen uur
"duidelijk": "clearly",                // duidelijk
"langzaam": "slowly",                  // langzaam

/* ============================
   Gender & Plural Adjective Maps
   ============================ */
"goed_masc": "good",                   // goed
"goed_fem": "good (fem.)",             // goed (vrouw.)
"goed_mv": "good (plural)",            // goed (mv.)
"goed_fem_mv": "good (fem. plural)",   // goed (vrouw. mv.)

"slecht_masc": "bad",                  // slecht
"slecht_fem": "bad (fem.)",            // slecht (vrouw.)
"slecht_mv": "bad (plural)",           // slecht (mv.)
"slecht_fem_mv": "bad (fem. plural)",  // slecht (vrouw. mv.)

"nieuw_masc": "new",                   // nieuw
"nieuw_fem": "new (fem.)",             // nieuw (vrouw.)
"nieuw_mv": "new (plural)",            // nieuw (mv.)
"nieuw_fem_mv": "new (fem. plural)",   // nieuw (vrouw. mv.)

"klein_masc": "small",                 // klein
"klein_fem": "small (fem.)",           // klein (vrouw.)
"klein_mv": "small (plural)",          // klein (mv.)
"klein_fem_mv": "small (fem. plural)", // klein (vrouw. mv.)

"heet": "hot",                         // heet
"heet_mv": "hot (plural)",             // heet (mv.)

"koud_masc": "cold",                   // koud
"koud_fem": "cold (fem.)",             // koud (vrouw.)
"koud_mv": "cold (plural)",            // koud (mv.)
"koud_fem_mv": "cold (fem. plural)",   // koud (vrouw. mv.)

"blij": "happy",                       // blij
"blij_mv": "happy (plural)",           // blij (mv.)

"moeilijk": "difficult",               // moeilijk
"moeilijk_mv": "difficult (plural)",   // moeilijk (mv.)

"makkelijk": "easy",                   // makkelijk
"makkelijk_mv": "easy (plural)",       // makkelijk (mv.)

"duidelijk_fem": "clear / bright (fem.)",  // duidelijk (vrouw.)
"duidelijk_masc": "clear / bright (masc.)", // duidelijk
"duidelijk_mv": "clear (plural)",          // duidelijk (mv.)
"duidelijk_fem_mv": "clear (fem. plural)", // duidelijk (vrouw. mv.)

"groot": "big / large",                // groot
"groot_mv": "big / large (plural)",    // groot (mv.)

"lang_masc": "tall / high",            // lang / hoog
"lang_fem": "tall (fem.)",             // lang (vrouw.)
"lang_mv": "tall (plural)",            // lang (mv.)
"lang_fem_mv": "tall (fem. plural)",   // lang (vrouw. mv.)

"heerlijk_fem": "delicious (fem.)",    // heerlijk (vrouw.)
"heerlijk_masc": "delicious (masc.)",  // heerlijk

"vriendelijk": "kind / nice",          // vriendelijk
"vriendelijk_mv": "kind / nice (plural)", // vriendelijk (mv.)

"schoon_fem": "clean (fem.)",          // schoon (vrouw.)
"schoon_masc": "clean (masc.)",        // schoon

"rood_fem": "red (fem.)",              // rood (vrouw.)
"rood_masc": "red (masc.)",            // rood

"vertraagd_masc": "delayed / late",    // vertraagd / laat
"vertraagd_fem": "delayed (fem.)",     // vertraagd (vrouw.)

"realistisch": "realistic",            // realistisch
"realistisch_mv": "realistic (plural)",// realistisch (mv.)

"professioneel": "professional",       // professioneel
"professioneel_mv": "professional (plural)", // professioneel (mv.)

"innovatief_fem": "innovative (fem.)", // innovatief (vrouw.)
"innovatief_masc": "innovative (masc.)", // innovatief

"onnodig_mv": "unnecessary (plural)",  // onnodig (mv.)
"onnodig": "unnecessary",              // onnodig

"riskant_fem": "risky (fem.)",         // riskant (vrouw.)
"riskant_masc": "risky (masc.)",       // riskant

"in_staat": "capable",                 // in staat
"in_staat_mv": "capable (plural)",     // in staat (mv.)

"effectief_masc": "effective",         // effectief
"effectief_fem": "effective (fem.)",   // effectief (vrouw.)

"positief_masc": "positive",           // positief
"positief_fem": "positive (fem.)",     // positief (vrouw.)
"positief_mv": "positive (plural)",    // positief (mv.)

"ingewikkeld_masc": "complicated",     // ingewikkeld
"ingewikkeld_fem": "complicated (fem.)",// ingewikkeld (vrouw.)

"belangrijk": "important",             // belangrijk
"belangrijk_mv": "important (plural)", // belangrijk (mv.)

"anders": "different",                 // anders / verschillend
"anders_mv": "different (plural)",     // anders / verschillend (mv.)

"beter": "better",                     // beter
"beter_mv": "better / best (plural)",  // beter / beste (mv.)

"uitstekend": "excellent",             // uitstekend
"uitstekend_mv": "excellent (plural)", // uitstekend (mv.)

"mogelijk": "possible",                // mogelijk
"mogelijk_mv": "possible (plural)",    // mogelijk (mv.)

"volgende_masc": "next",               // volgende
"volgende_fem": "next (fem.)",         // volgende (vrouw.)

/* ============================
   A2 Intermediate Core Numbers
   ============================ */
"elf": "eleven",          // elf
"twaalf": "twelve",       // twaalf
"dertien": "thirteen",    // dertien
"veertien": "fourteen",   // veertien
"vijftien": "fifteen",    // vijftien
"zestien_typo": "sixteen",// zestien (typo preserved)
"zeventien": "seventeen", // zeventien
"achttien": "eighteen",   // achttien
"negentien": "nineteen",  // negentien
"twintig": "twenty"       // twintig
};

/* ============================================================
   AUTO‑EXPAND DICTIONARY FROM CEFR LEVELS
   ============================================================ */
function autoExpandDictionary() {
    const allWords = Object.values(CEFR_LEVELS).flat();

    allWords.forEach(item => {
        if (!item || !item.dutch || !item.english) return;
        const key = item.dutch.toLowerCase().trim();
        const value = item.english.trim();
        WORD_DICT[key] = value; // Dutch → English dictionary
    });
}

autoExpandDictionary();

/* ============================================================
   MULTI-WORD PHRASES (CEFR-aligned)
   ============================================================ */
const CEFR_PHRASES = {
    // A1
    "hoe gaat het": "how are you",
    "waar woon je": "where do you live",
    "hoe laat is het": "what time is it",
    "vind je koffie lekker": "you like coffee",
    "ik vind muziek leuk": "I like music",
    "ik woon in de stad": "I live in the city",
    "ik werk in een hotel": "I work in a hotel",
    "ik wil eten": "I want to eat",
    "ik wil drinken": "I want to drink",
    "waar is de badkamer": "where is the bathroom",
    "zij rent snel": "she runs fast",
    "zij is snel": "she is fast",
    "zij gaat snel": "she goes fast",

    // A2
    "wat deed je gisteren": "what did you do yesterday",
    "ben je naar de supermarkt gegaan": "did you go to the supermarket",
    "reis je vaak": "you travel often",
    "wat heb je gekocht": "what did you buy",
    "wat ben je aan het doen": "what are you doing",
    "eet je meestal vroeg": "you usually eat early",
    "ik heb hulp nodig": "I need help",
    "ik wil een reservering maken": "I want to make a reservation",
    "waar is het station": "where is the station",

    // B1
    "ik leer al nederlands": "I have been learning Dutch",
    "ik geniet van reizen": "I enjoy traveling",
    "ik wil mijn vaardigheden verbeteren": "I want to improve my skills",
    "wat vind je van de stad": "what do you think of the city",
    "hoe houd je een gezonde levensstijl": "how do you maintain a healthy life",
    "wat heb je onlangs geleerd": "what did you learn recently",
    "wat zijn je doelen": "what are your goals",
    "welke ervaringen heb je": "what past experiences do you have",

    // B2
    "hoe ga je om met stressvolle situaties": "how do you handle stressful situations",
    "wat is jouw mening over technologie": "what is your opinion on technology",
    "hoe is jouw leven veranderd": "how has your life changed",
    "welke uitdagingen heb je": "what challenges do you face",
    "wat hoop je te bereiken": "what do you hope to achieve",
    "wat denk je over de toekomst": "what do you think about the future",
    "hoe zie je de huidige samenleving": "how do you see modern society",
    "wat is jouw perspectief": "what is your perspective"
};

/* ============================================================
   TRANSLATION ENGINE — CEFR Phrases + Word Dictionary
   ============================================================ */
function translateToEnglish(dutchText) {
    const normalized = dutchText.toLowerCase().trim();

    // 1. Phrase detection
    if (CEFR_PHRASES[normalized]) {
        return CEFR_PHRASES[normalized];
    }

    // 2. Word-by-word fallback
    return normalized
        .split(/\s+/)
        .map(w => WORD_DICT[w] || `[${w}]`)
        .join(" ");
}

/* ============================================================
   CLEAN MISSING WORD VALIDATOR — NO AUTO-TRANSLATION
   ============================================================ */

function validateMissingWords() {
    const missing = new Set();

    function scan(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    // 1. CEFR sentences (now using item.dutch)
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scan(item.dutch));
    });

    // 2. Build disruptors (Dutch)
    [
        "snel","langzaam","altijd","nooit","gisteren","morgen",
        "omdat","maar","erg","ook","alleen","dan"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 3. Grammar helpers (Dutch)
    [
        "ik","jij","hij","zij","wij","jullie","zij_mv",
        "ben","bent","is","zijn",
        "heb","hebt","heeft","hebben"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 4. Conversation fillers (Dutch)
    [
        "hallo","tot ziens","dank je","alsjeblieft",
        "wat","wie","waar","wanneer","hoe","welk",
        "omdat","maar","ook","dan"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 5. Quiz distractors (Dutch)
    [
        "goed","slecht","groot","klein","makkelijk","moeilijk",
        "auto","straat","stad"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    console.group("=== CLEAN MISSING WORD REPORT ===");

    if (missing.size === 0) {
        console.log("✔ No missing words! Dictionary is complete.");
    } else {
        console.log("❌ Missing words (" + missing.size + "):");
        missing.forEach(w => console.log(" - " + w));
    }

    console.groupEnd();
}

/* ============================================================
   SUPER VALIDATOR — AUTO-FIX (Dutch version)
   ============================================================ */

function validateAndEnhanceDictionary() {

    const missing = new Set();
    const added = [];

    const isArticle = w => ["de","het","een"].includes(w);
    const isPronoun = w => ["mij","jou","hem","haar","ons","hen","het"].includes(w);
    const isPreposition = w => ["naar","van","door","voor","met","zonder","in","op"].includes(w);
    const isConnector = w => ["en","of","maar","omdat","ook","dan"].includes(w);
    const isAdverb = w => ["vandaag","gisteren","morgen","nu","binnenkort","vroeg","laat","duidelijk"].includes(w);
    const isMultiWord = w => w.includes(" ");

    function inferTranslation(word) {
        if (isArticle(word)) return "the";
        if (isPronoun(word)) return "pronoun";
        if (isPreposition(word)) return "preposition";
        if (isConnector(word)) return "connector";
        if (isAdverb(word)) return "time-related adverb";
        if (isMultiWord(word)) return "multi-word phrase";
        return word + " (unclassified)";
    }

    function scanSentence(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scanSentence(item.dutch));
    });

    ["snel","langzaam","altijd","nooit","gisteren","morgen","omdat","maar","erg","ook","alleen","dan"]
        .forEach(tok => { if (!WORD_DICT[tok]) missing.add(tok); });

    ["ik","jij","hij","zij","wij","jullie","zij_mv","ben","bent","is","zijn","heb","hebt","heeft","hebben"]
        .forEach(tok => { if (!WORD_DICT[tok]) missing.add(tok); });

    ["hallo","tot ziens","dank je","alsjeblieft","wat","wie","waar","wanneer","hoe","welk","omdat","maar","ook","dan"]
        .forEach(tok => { if (!WORD_DICT[tok]) missing.add(tok); });

    ["goed","slecht","groot","klein","makkelijk","moeilijk","auto","straat","stad"]
        .forEach(tok => { if (!WORD_DICT[tok]) missing.add(tok); });

    missing.forEach(w => {
        if (!WORD_DICT[w]) {
            WORD_DICT[w] = inferTranslation(w);
            added.push({ word: w, translation: WORD_DICT[w] });
        }
    });

    console.group("=== SUPER VALIDATOR REPORT ===");
    console.log("Missing words found:", missing.size);
    console.log("Auto-added:", added.length);
    added.forEach(entry => console.log(`+ ${entry.word} → ${entry.translation}`));
    console.log("New dictionary size:", Object.keys(WORD_DICT).length);
    console.groupEnd();
}
/* ============================================================
   GRAMMAR ERROR EXPLAINER (DUTCH VERSION)
   ============================================================ */
function explainGrammarError(user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    // Missing pronoun “je”
    if (c.includes("vind je") && !u.includes("je") && u.includes("vind")) {
        return "Je vergat het voornaamwoord “je”. Nederlands gebruikt “Vind je…” om te vragen of iemand iets leuk vindt.";
    }

    // Missing article
    if ((c.includes("de ") || c.includes("het ")) &&
        !u.includes("de ") && !u.includes("het ")) {
        return "Je miste het lidwoord (de/het). Nederlands gebruikt meestal een lidwoord voor zelfstandige naamwoorden.";
    }

    // Wrong adverb vs frequency
    if (c.includes("vaak") && u.includes("langzaam")) {
        return "Je gebruikte “langzaam” (slow) in plaats van een frequentiewoord zoals “vaak”.";
    }

    // Wrong verb form
    if (c.split(" ")[0] !== u.split(" ")[0]) {
        return "Je werkwoordsvorm komt niet overeen met de doelszin. Controleer de vervoeging.";
    }

    return "Je zin is begrijpelijk, maar de grammatica of woordkeuze komt niet overeen met het doelantwoord.";
}

function getCEFRGrammarHint(level, user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    /* ============================
       A1 HINTS (DUTCH)
       ============================ */
    if (level === "A1") {
        if (!u.includes("de") && !u.includes("het") && (c.includes("de") || c.includes("het"))) {
            return "A1 hint: Vergeet niet om lidwoorden (de/het) te gebruiken.";
        }
        if (!u.includes("je") && c.includes("vind je")) {
            return "A1 hint: Gebruik “vind je” om te vragen of iemand iets leuk vindt.";
        }
        return "A1 hint: Focus op de tegenwoordige tijd en eenvoudige zinsstructuren.";
    }

    /* ============================
       A2 HINTS (DUTCH)
       ============================ */
    if (level === "A2") {
        if (u.includes("langzaam") && c.includes("vaak")) {
            return "A2 hint: Gebruik frequentiewoorden zoals “vaak”.";
        }
        if (!u.includes("gisteren") && c.includes("gisteren")) {
            return "A2 hint: Oefen tijdsmarkeringen zoals “gisteren”.";
        }
        return "A2 hint: Oefen veelgebruikte verleden tijd vormen en dagelijkse routines.";
    }

    /* ============================
       B1 HINTS (DUTCH)
       ============================ */
    if (level === "B1") {
        if (!u.includes("omdat") && c.includes("omdat")) {
            return "B1 hint: Gebruik verbindingswoorden zoals “omdat” om redenen uit te leggen.";
        }
        if (!u.includes("dat") && c.includes("dat")) {
            return "B1 hint: Meerdere zinsdelen vereisen vaak “dat”.";
        }
        return "B1 hint: Voeg verbindingswoorden toe (omdat, hoewel, wanneer) om langere zinnen te maken.";
    }

    /* ============================
       B2 HINTS (DUTCH)
       ============================ */
    if (level === "B2") {
        if (!u.includes("hoewel") && c.includes("hoewel")) {
            return "B2 hint: Gebruik contrastwoorden zoals “hoewel” voor complexe ideeën.";
        }
        if (!u.includes("om") && c.includes("om")) {
            return "B2 hint: Gebruik “om” om doel of intentie uit te drukken.";
        }
        return "B2 hint: Richt je op abstracte woordenschat en zinnen met meerdere zinsdelen.";
    }

    return "";
}

/* ============================================================
   CEFR TRAINER — CLEAN APP.JS (PART 1)
   ============================================================ */

function groupByCategory(words) {
    const out = {};
    words.forEach(w => {
        if (!out[w.category]) out[w.category] = [];
        out[w.category].push(w);
    });
    return out;
}

const STORAGE_KEY = "cefr_trainer_state_v2";

let appState = {
    currentLevel: "A1",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    totalXP: 0,
    globalScore: 0,
    levelStats: {
        A1: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        A2: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        B1: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        B2: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        }
    }
};
/* ============================================================
   CATEGORY AUTO‑ASSIGNER — DUTCH VERSION
   ============================================================ */

function autoAssignCategory(word) {
    const w = word.dutch.toLowerCase();

    // Verbs (infinitives)
    if (w.endsWith("en"))
        return "verbs";

    // Adjectives
    if (
        w.endsWith("e") ||
        w.endsWith("er") ||
        w.endsWith("ste")
    )
        return "adjectives";

    // Numbers
    if (!isNaN(parseInt(w)))
        return "numbers";

    // Food & drink
    if ([
        "appel","brood","water","vlees","koffie","thee","ei",
        "bier","wijn","rijst","kip","vis","salade","groente","fruit"
    ].includes(w))
        return "food-drink";

    // Travel
    if ([
        "vliegveld","hotel","taxi","trein","vliegtuig","ticket",
        "kaart","stad","land","reis","toerist"
    ].includes(w))
        return "travel";

    // Daily life
    if ([
        "morgen","middag","avond","huis","werk","school",
        "dag","week","maand"
    ].includes(w))
        return "Daily Life";

    // Family
    if ([
        "moeder","vader","broer","zus","opa","oma",
        "oom","tante","neef","nicht","familie"
    ].includes(w))
        return "family";

    // Shopping
    if ([
        "geld","prijs","winkel","kopen","verkopen","markt","product"
    ].includes(w))
        return "shopping";

    // Emergency
    if ([
        "help","politie","ziekenhuis","ambulance","brand","noodgeval"
    ].includes(w))
        return "emergency";

    // Work
    if ([
        "werk","kantoor","baas","werknemer","bedrijf","vergadering"
    ].includes(w))
        return "work";

    // Places / objects
    if ([
        "huis","school","park","straat","deur","tafel","stoel",
        "auto","kamer","badkamer"
    ].includes(w))
        return "places-objects";

    // Connectors
    if ([
        "en","maar","omdat","hoewel","wanneer","als","of",
        "dan","later","na","voor"
    ].includes(w))
        return "connectors";

    // Grammar words
    if ([
        "de","het","een","ik","jij","hij","zij","wij","jullie","zij_mv"
    ].includes(w))
        return "grammar";

    return "Daily Life";
}

/* ============================================================
   APPLY CATEGORIES TO ALL CEFR LEVELS — DUTCH VERSION
   ============================================================ */

Object.keys(CEFR_LEVELS).forEach(level => {
    CEFR_LEVELS[level] = CEFR_LEVELS[level].map(w => ({
        ...w,
        category: w.category || autoAssignCategory(w)
    }));
});

/* ============================================================
   STATE LOAD / SAVE
   ============================================================ */
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) Object.assign(appState, JSON.parse(raw));
    } catch (e) {
        console.error("State load error:", e);
    }
}

function setLearnerName(name) {

    // If this is a different learner, reset everything
    if (appState.learnerName !== name) {
        resetAllProgress();
    }

    appState.learnerName = name;
    saveState();
    renderDashboard();
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State save error:", e);
    }
}

/* ============================================================
   FULL RESET — ALL LEVELS, ALL SCORES, ALL XP
   ============================================================ */

// Ensure this property exists on your global appState object
appState.lastActiveDate = appState.lastActiveDate || null;

/* ============================================================
   CALENDAR DAY STREAK ENGINE
   ============================================================ */

// Safely ensure this property exists on your global state when app initializes
if (typeof appState !== "undefined" && !appState.hasOwnProperty("lastActiveDate")) {
    appState.lastActiveDate = null;
}

function checkAndAdvanceStreak() {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const lastActive = appState.lastActiveDate;
    
    if (typeof appState.levelStats[appState.currentLevel].streak !== "number") {
        appState.levelStats[appState.currentLevel].streak = 0;
    }

    if (!lastActive) {
        appState.levelStats[appState.currentLevel].streak = 1;
        appState.lastActiveDate = todayStr;
        saveState();
        return;
    }

    if (lastActive === todayStr) {
        return;
    }

    const lastDateObj = new Date(lastActive);
    const todayDateObj = new Date(todayStr);
    const timeDiff = todayDateObj.getTime() - lastDateObj.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
        appState.levelStats[appState.currentLevel].streak++;
    } else if (dayDiff > 1) {
        appState.levelStats[appState.currentLevel].streak = 1;
    }

    appState.lastActiveDate = todayStr;
    saveState();
}

/* ============================================================
   FULL RESET — ALL LEVELS, ALL SCORES, ALL XP
   ============================================================ */
function resetAllProgress() {
    Object.keys(appState.levelStats).forEach(level => {
        appState.levelStats[level] = {
            listens: 0,
            flashSeen: 0,
            quizScore: 0,
            quizCompleted: 0,
            buildCompleted: 0,
            sentenceCompleted: 0,
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        };
    });

    appState.totalXP = 0;
    appState.globalScore = 0;
    appState.badges = [];
    appState.currentLevel = "A1";
    appState.lastActiveDate = null; 

    reviewList = [];
    localStorage.removeItem('reviewList');

    saveState();

    updateBadges();
    updateProgressMeters();
    renderReviewList();
    
    activateTab("dashboard");
    
    console.log("🧼 Application data successfully cleared!");
}

/* ============================================================
   DUTCH VOICE (TTS for explanations)
   ============================================================ */

function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";        // Dutch voice
    u.rate = appState.speechRate;
    u.pitch = 1.0;

    window.speechSynthesis.speak(u);
}

/* ============================================================
   SPEECH SYNTHESIS — Dutch word pronunciation
   ============================================================ */
function speakDutch(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";
    u.rate = appState.speechRate;

    window.speechSynthesis.speak(u);
}

/* ============================================================
   QUIZ AUDIO — Dutch (correct + incorrect)
   ============================================================ */
function speakQuiz(correctAnswer) {
    const message = `Het juiste antwoord is: ${correctAnswer}`;
    speak(message);
}

/* ============================================================
   LEVEL SELECTOR
   ============================================================ */
function setLevel(level) {
    if (!CEFR_LEVELS[level]) return;

    appState.currentLevel = level;
    saveState();

    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.level === level);
    });

    activateTab(currentTab);
}

/* ============================================================
   TAB SYSTEM — FINAL CLEAN VERSION
   ============================================================ */

const TABS = [
    "dashboard",
    "listen",
    "flash",
    "quiz",
    "build",
    "sentence",
    "conversation",
    "grammar",
    "mining",
    "review"
];

let currentTab = "dashboard";
/* ============================================================
   ACTIVATE TAB
   ============================================================ */
function activateTab(tabName) {
    if (!TABS.includes(tabName)) return;
    currentTab = tabName;

    // Hide all tabs
    TABS.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("hidden");
    });

    // Show active tab
    const activePanel = document.getElementById(tabName);
    if (activePanel) activePanel.classList.remove("hidden");

    // Update nav button highlight
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Load dynamic content
    switch (tabName) {
        case "listen":
            renderListenTab();
            break;

        case "flash":
            renderFlashcardsTab();
            break;

        case "quiz":
            renderQuizTab();
            break;

        case "build":
            renderBuildTab();
            break;

        case "sentence":
            renderSentenceTab();
            break;

        case "conversation":
            renderConversationTab();
            break;

        case "grammar":
            renderGrammarTab();
            break;

        case "mining":
            renderMiningReferencesTab();
            break;
          
        case "review":
            renderReviewList();
            break;

        case "dashboard":
            break;
    }
}


/* ============================================================
   TAB NAVIGATION WIRING
   ============================================================ */
function initTabNavigation() {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);
        });
    });
}

initTabNavigation();
activateTab("dashboard");

function initDashboardResetButtons() {
    const resetAllBtn = document.getElementById("resetAllLevelsBtn");

    if (resetAllBtn) {
        resetAllBtn.addEventListener("click", () => {

            if (!confirm("Alle niveaus en scores resetten? Dit kan niet ongedaan worden gemaakt.")) return;

            resetAllProgress();
            saveState();
            updateProgressMeters();
            updateBadges();
            renderDashboard();

            alert("Alle niveaus gereset. Je bent terug bij A1!");
        });
    }
}

/* ============================================================
   LISTEN TAB — CATEGORY + AUDIO PLAYER + CLEAN UI
   ============================================================ */

let listenAutoPlay = {
    active: false,
    paused: false,
    index: 0,
    list: []
};

function renderListenTab() {
    const container = document.getElementById("listen-content");
    if (!container) return;

    const levelData = LISTEN_VOCAB[appState.currentLevel];

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Luisteren — Niveau ${appState.currentLevel}</h2>
            <p>Klik op een categorie en tik op een woord om het te horen.</p>

            <div class="listen-player-controls" style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin-top:6px;
                justify-content:flex-start;
            ">
                <button class="pill" id="listen-playall">Alles afspelen</button>
                <button class="pill" id="listen-pause">Pauze</button>
                <button class="pill" id="listen-resume">Hervatten</button>
                <button class="pill" id="listen-stop">Stop</button>
            </div>
        </div>
    `;

    Object.keys(levelData).forEach(categoryName => {
        const words = levelData[categoryName];

        html += `
<div class="glass-panel">
    <div class="listen-category-header" data-cat="${categoryName}">
       <span class="listen-category-title">${categoryName}</span>
       <span class="listen-arrow">▶</span>
    </div>

    <div class="listen-category-content" data-cat="${categoryName}">
        <div class="listen-grid" style="
            display:grid;
            grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
            gap:6px;
            margin-top:8px;
        ">
            ${words.map(dutch => {
                const entry = CEFR_LEVELS[appState.currentLevel].find(w => w.dutch === dutch);
                const english = entry ? entry.english : "";
                return `
                    <button class="pill listen-pill" data-dutch="${dutch}">
                        <div class="listen-pill-en">${english}</div>
                        <div class="listen-pill-nl">${dutch}</div>
                    </button>
                `;
            }).join("")}
        </div>
    </div>
</div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(
                `.listen-category-content[data-cat="${cat}"]`
            );
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    container.querySelectorAll(".pill[data-dutch]").forEach(btn => {
        btn.addEventListener("click", () => {
            speakDutch(btn.dataset.dutch);
            appState.levelStats[appState.currentLevel].listens++;
            saveState();
            updateBadges();
            updateProgressMeters();
        });
    });

    listenAutoPlay.list = Object.values(levelData).flat();

    document.getElementById("listen-playall").onclick = () => {
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        playNextListenWord();
    };

    document.getElementById("listen-pause").onclick = () => {
        listenAutoPlay.paused = true;
        if (speechSynthesis.pause) speechSynthesis.pause();
    };

    document.getElementById("listen-resume").onclick = () => {
        listenAutoPlay.paused = false;
        if (speechSynthesis.resume) speechSynthesis.resume();
        playNextListenWord();
    };

    document.getElementById("listen-stop").onclick = () => {
        listenAutoPlay.active = false;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        if (speechSynthesis.cancel) speechSynthesis.cancel();
    };
}


/* ============================================================
   AUTO PLAY ENGINE
   ============================================================ */
function playNextListenWord() {
    if (!listenAutoPlay.active || listenAutoPlay.paused) return;

    const list = listenAutoPlay.list;
    if (listenAutoPlay.index >= list.length) {
        listenAutoPlay.active = false;
        return;
    }

    const word = list[listenAutoPlay.index];
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "nl-NL";
    utter.rate = appState.speechRate;

    utter.onend = () => {
        if (!listenAutoPlay.paused) {
            listenAutoPlay.index++;
            setTimeout(playNextListenWord, 50);
        }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================================================
   FLASHCARDS — CATEGORY GROUPED + FLIP + AUDIO
   ============================================================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    const normalized = {};

    Object.keys(grouped).forEach(cat => {
        const cleanKey = cat.trim().toLowerCase();

        if (!normalized[cleanKey]) normalized[cleanKey] = {
            display: cat.trim(),
            items: []
        };

        normalized[cleanKey].items = normalized[cleanKey].items.concat(grouped[cat]);
    });
}
/* ------------------------------------------------------------
   HEADER
   ------------------------------------------------------------ */
let html = `
    <div class="glass-panel">
        <h2>Flashcards — Niveau ${appState.currentLevel}</h2>
        <p>Vertaal het woord en tik op de kaart om hem om te draaien. De Nederlandse kant speelt audio af.</p>
    </div>
`;

/* ------------------------------------------------------------
   RENDER MERGED CATEGORIES
   ------------------------------------------------------------ */
Object.keys(normalized).forEach(cleanKey => {
    const catDisplay = normalized[cleanKey].display.toUpperCase();
    const items = normalized[cleanKey].items;

    html += `
    <div class="glass-panel">
        <div class="flash-category-header" data-cat="${cleanKey}">
            <span class="listen-category-title">${catDisplay}</span>
            <span class="listen-arrow">▶</span>
        </div>

        <div class="flash-category-content" data-cat="${cleanKey}">
            <div class="fc-grid">
                ${items.map(item => `
                    <div class="fc-card">
                        <div class="fc-inner">
                            <div class="fc-front pill">${item.english}</div>
                            <div class="fc-back pill">${item.dutch}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    </div>`;
});

container.innerHTML = html;

/* ------------------------------------------------------------
   CATEGORY COLLAPSE
   ------------------------------------------------------------ */
container.querySelectorAll(".flash-category-header").forEach(header => {
    header.addEventListener("click", () => {
        const cat = header.dataset.cat;
        const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
        const arrow = header.querySelector(".listen-arrow");
        const open = content.classList.toggle("open");
        arrow.classList.toggle("open", open);
    });
});

/* ------------------------------------------------------------
   FLASHCARD FLIP + AUDIO
   ------------------------------------------------------------ */
container.querySelectorAll(".fc-card").forEach(card => {
    card.addEventListener("click", () => {
        const inner = card.querySelector(".fc-inner");
        const flipped = inner.classList.toggle("fc-flipped");
        const dutch = inner.querySelector(".fc-back").textContent.trim();

        if (flipped) {
            speakDutch(dutch);
            appState.levelStats[appState.currentLevel].flashSeen++;
            saveState();
            updateBadges();
            updateProgressMeters();
        } else {
            speechSynthesis.cancel();
        }
    });
});


/* ============================================================
   SHARED QUIZ / BUILD / SENTENCE / CONVERSATION STATE
   ============================================================ */

let quizState = {
    currentWord: null,
    options: [],
    harderMode: false,
    selected: null
};

let buildState = {
    currentWord: null,
    tokens: []
};

let sentenceState = {
    currentSentence: null,
    tokens: []
};

let convoState = {
    currentPrompt: null,
    tokens: []
};

function generateQuizOptions(words, correctWord) {
    let opts = [correctWord.dutch];
    const count = quizState.harderMode ? 5 : 3;

    while (opts.length < count) {
        const w = words[Math.floor(Math.random() * words.length)];
        if (!opts.includes(w.dutch)) opts.push(w.dutch);
    }

    return opts.sort(() => Math.random() - 0.5);
}

/* ============================================================
   QUIZ TAB — RENDER + EVENTS
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>Geen woorden gevonden voor niveau ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    quizState.currentWord = words[Math.floor(Math.random() * words.length)];
    quizState.options = generateQuizOptions(words, quizState.currentWord);
    quizState.selected = null;

    container.innerHTML = `
    <div class="glass-panel quiz-card">
        <h2>Quiz — Niveau ${appState.currentLevel}</h2>
        <p>Selecteer het juiste Nederlandse woord voor het Engelse woord.</p>

        <div id="qb-meta"><strong>Engels:</strong> ${quizState.currentWord.english}</div>

        <div id="qb-grid" class="sb-grid">
            ${quizState.options.map(opt => `
                <button class="pill" data-dutch="${opt}">${opt}</button>
            `).join("")}
        </div>

        <div id="qb-answer" class="qb-answer"></div>

        <div class="sb-controls quiz-controls-tight">
            <button id="qb-submit">Controleren</button>
            <button id="qb-next">Volgende</button>
            <button id="qb-harder" class="${quizState.harderMode ? "active" : ""}">Moeilijker</button>
        </div>

        <div id="qb-feedback" class="qb-feedback"></div>
    </div>
    `;

    setupQuizEvents();
}

/* ============================================================
   QUIZ EVENTS
   ============================================================ */

function setupQuizEvents() {
    const grid = document.getElementById("qb-grid");
    const submitBtn = document.getElementById("qb-submit");
    const nextBtn = document.getElementById("qb-next");
    const harderBtn = document.getElementById("qb-harder");
    const feedback = document.getElementById("qb-feedback");
    const answerBox = document.getElementById("qb-answer");

    quizState.selected = null;

    grid.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.dutch;
            answerBox.textContent = quizState.selected;
        });
    });

    function getEnglishForDutch(dutchWord) {
        const levelWords = CEFR_LEVELS[appState.currentLevel];
        const match = levelWords.find(w => w.dutch === dutchWord);
        return match ? match.english : "[no match]";
    }

    submitBtn.addEventListener("click", () => {
        if (!quizState.selected) {
            feedback.textContent = "Kies eerst een antwoord.";
            return;
        }

        const correct = quizState.currentWord.dutch;
        const learnerDutch = quizState.selected;
        const learnerEnglish = getEnglishForDutch(learnerDutch);

        if (appState.levelStats[appState.currentLevel].quizScore === null) {
            appState.levelStats[appState.currentLevel].quizScore = 0;
        }

        if (learnerDutch === correct) {
            feedback.innerHTML = `
                <div class="quiz-correct">Correct! 🎉</div>
                <div class="quiz-selected"><strong>Je koos:</strong> ${learnerDutch} (${learnerEnglish})</div>
            `;

            appState.levelStats[appState.currentLevel].quizScore++;
            appState.levelStats[appState.currentLevel].quizCompleted++;

            appState.totalXP = (appState.totalXP || 0) + 10; 
            appState.globalScore = (appState.globalScore || 0) + 5;

            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();

        } else {
            feedback.innerHTML = `
                <div class="quiz-incorrect">Incorrect — juiste antwoord: ${correct}</div>
                <div class="quiz-selected"><strong>Je koos:</strong> ${learnerDutch} (${learnerEnglish})</div>
            `;

            const mistakeString = `${quizState.currentWord.english} ➔ ${correct}`;
            addIncorrectWord(mistakeString);
        }

        setTimeout(() => speakQuiz(correct), 50);

        saveState();
    });

    nextBtn.addEventListener("click", () => {
        renderQuizTab();
    });

    harderBtn.addEventListener("click", () => {
        quizState.harderMode = !quizState.harderMode;
        harderBtn.classList.toggle("active");
        renderQuizTab();
    });
}
/* ============================================================
   KEYBOARD NORMALIZATION UTILITY (MULTI-WORD VERSION)
   ============================================================ */
function cleanStringForKeyboard(text) {
    if (!text) return "";
    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[!?.–—,;:]/g, "")
        .replace(/\s+/g, " ");
}



/* ============================================================
   BUILD TAB — English → Dutch Builder (with disruptors + feedback)
   ============================================================ */
function renderBuildTab() {
    const container = document.getElementById("build-content");

    const pool = CEFR_SENTENCES[appState.currentLevel];
    const sentence = pool[Math.floor(Math.random() * pool.length)];

    const english = sentence.english;
    const dutch = sentence.dutch;

    const coreTokens = dutch.split(" ");

    const disruptors = [
        "snel","langzaam","altijd","nooit","gisteren","morgen",
        "omdat","maar","erg","ook","alleen","dan"
    ];

    let bank = [...coreTokens];

    while (bank.length < coreTokens.length + 5) {
        const d = disruptors[Math.floor(Math.random() * disruptors.length)];
        if (!bank.includes(d)) bank.push(d);
    }

    bank = bank.sort(() => Math.random() - 0.5);

    buildState.tokens = bank;
    buildState.answer = [];

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Zet deze zin in het Nederlands</h2>
            <p class="build-english"><strong>Engels:</strong> ${english}</p>

            <div id="build-selected" class="build-selected"></div>

            <div id="build-words" class="sb-grid">
                ${bank.map(w => `<button class="pill build-opt" data-token="${w}">${w}</button>`).join("")}
            </div>

            <input id="build-input" class="input-field" placeholder="Of typ de Nederlandse zin…">

            <div id="build-feedback"></div>

            <div class="sb-controls">
                <button id="build-undo">Undo</button>
                <button id="build-reset">Reset</button>
                <button id="build-check">Check</button>
                <button id="build-next">Volgende</button>
            </div>
        </div>
    `;

    setupBuildEvents(sentence);
}

function setupBuildEvents(sentence) {
    const selectedArea = document.getElementById("build-selected");
    const grid = document.getElementById("build-words");
    const input = document.getElementById("build-input");
    const feedback = document.getElementById("build-feedback");

    const undoBtn = document.getElementById("build-undo");
    const resetBtn = document.getElementById("build-reset");
    const checkBtn = document.getElementById("build-check");
    const nextBtn = document.getElementById("build-next");

    buildState.answer = [];

    grid.querySelectorAll(".build-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            buildState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            selectedArea.textContent = buildState.answer.join(" ");
        });
    });

    input.addEventListener("input", () => {
        buildState.answer = input.value.trim().split(" ");
        selectedArea.textContent = buildState.answer.join(" ");
    });

    undoBtn.addEventListener("click", () => {
        buildState.answer.pop();
        selectedArea.textContent = buildState.answer.join(" ");

        grid.querySelectorAll(".build-opt").forEach(btn => {
            if (!buildState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        buildState.answer = [];
        selectedArea.textContent = "";
        input.value = "";
        grid.querySelectorAll(".build-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    checkBtn.addEventListener("click", () => {
        const correct = sentence.dutch.trim();
        const user = buildState.answer.join(" ").trim();

        const learnerEnglish = translateToEnglish(user);

        const cleanCorrect = cleanStringForKeyboard(correct);
        const cleanUser = cleanStringForKeyboard(user);

        if (cleanUser === cleanCorrect) {
            feedback.innerHTML = `
                <span style="color:#4ade80;font-weight:600;">Correct! 🎉</span><br><br>
                <strong>Your Translated Response is:</strong><br>${learnerEnglish}
            `;
            appState.levelStats[appState.currentLevel].buildCompleted++;

            appState.totalXP = (appState.totalXP || 0) + 20; 
            appState.globalScore = (appState.globalScore || 0) + 15;

            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 50);
        } else {
            const correctTokens = correct.split(" ");
            const userTokens = buildState.answer;

            let html = `<strong>The correct answer is:</strong><br>${correct}<br><br>`;
            html += `<strong>Your Answer:</strong><br>${user}<br><br>`;
            html += `<strong>Your Translated Response is:</strong><br>${learnerEnglish}<br><br>`;
            html += `<strong>Word-by-word feedback:</strong><br>`;

            userTokens.forEach((t, i) => {
                if (cleanStringForKeyboard(correctTokens[i]) === cleanStringForKeyboard(t)) {
                    html += `<span style="color:#4ade80;">${t} ✔</span> `;
                } else {
                    html += `<span style="color:#f87171;">${t} ✖</span> `;
                }
            });

            feedback.innerHTML = html;
            setTimeout(() => speakQuiz(correct), 50);

            const mistakeSentenceString = `${sentence.english} ➔ ${correct}`;
            addIncorrectWord(mistakeSentenceString);
        }

        saveState();
    });

    nextBtn.addEventListener("click", () => {
        renderBuildTab();
    });
}

/* ============================================================
   SENTENCE TAB — CEFR MULTIPLE‑CHOICE (DUTCH VERSION)
   ============================================================ */

function generateSentenceForLevel(level) {
    const pool = CEFR_SENTENCE_CHOICES[level];
    const item = pool[Math.floor(Math.random() * pool.length)];

    const shuffled = [...item.options]
        .filter(Boolean)
        .sort(() => Math.random() - 0.5);

    return {
        english: item.english,
        correct: item.correct,
        options: shuffled
    };
}

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    const level = appState.currentLevel;

    if (!CEFR_SENTENCE_CHOICES[level]) {
        container.innerHTML = "<p>No sentences available for this level.</p>";
        return;
    }

    const q = generateSentenceForLevel(level);

    container.innerHTML = `
        <div class="glass-panel sentence-card">
            <h2>Sentence — Niveau ${level}</h2>
            <p>Select the correct Dutch translation.</p>

            <div class="sentence-english">
                <strong>English:</strong> ${q.english}
            </div>

            <div id="sentence-options" class="sentence-options">
                ${q.options.map(opt => `
                    <button class="pill" data-opt="${opt.nl}">
                        ${opt.nl}
                    </button>
                `).join("")}
            </div>

            <div id="sentence-feedback"></div>

            <div class="sentence-controls">
                <button id="sentence-next" class="pill">Volgende</button>
            </div>
        </div>
    `;

    setupSentenceEvents(q);
}

function setupSentenceEvents(q) {
    const buttons = document.querySelectorAll("#sentence-options .pill");
    const feedback = document.getElementById("sentence-feedback");
    const nextBtn = document.getElementById("sentence-next");

    function getEnglishForDutch(dutchWord) {
        const match = q.options.find(opt => opt.nl === dutchWord);
        return match ? match.en : "[no match]";
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const chosen = btn.dataset.opt;
            const chosenEnglish = getEnglishForDutch(chosen);

            if (chosen === q.correct.nl) {
                feedback.innerHTML = `
                    <span style="color:#4ade80;font-weight:600;">
                        Correct! 🎉
                    </span><br>
                    <div class="sentence-selected">
                        <strong>You selected:</strong> ${chosen} (${chosenEnglish})
                    </div>
                `;

                appState.levelStats[appState.currentLevel].sentenceCompleted++;

                appState.totalXP = (appState.totalXP || 0) + 15; 
                appState.globalScore = (appState.globalScore || 0) + 10;

                checkAndAdvanceStreak();

                updateBadges();
                updateProgressMeters();
                speakQuiz(q.correct.nl);

            } else {
                feedback.innerHTML = `
                    <span style="color:#f87171;font-weight:600;">
                        Incorrect.
                    </span><br>
                    Correct answer: <strong>${q.correct.nl}</strong><br>
                    <div class="sentence-selected">
                        <strong>You selected:</strong> ${chosen} (${chosenEnglish})
                    </div>
                `;

                const mistakeSentenceString = `${q.english} ➔ ${q.correct.nl}`;
                addIncorrectWord(mistakeSentenceString);

                speakQuiz(q.correct.nl);
            }

            buttons.forEach(b => b.disabled = true);
            saveState();
        });
    });

    nextBtn.addEventListener("click", () => {
        renderSentenceTab();
    });
}
/* ============================================================
   CEFR SENTENCE CHOICES — FULL PACK (A1 → B2) — DUTCH VERSION
   ============================================================ */

const CEFR_SENTENCE_CHOICES = {

    /* ============================
       A1 — Beginner
       ============================ */

    A1: [
    {
        english: "I’m a bit tired today.",
        correct: { nl: "ik ben een beetje moe vandaag", en: "I’m a bit tired today." },
        options: [
            { nl: "ik ben een beetje moe vandaag", en: "I’m a bit tired today." },
            { nl: "ik ben vandaag erg druk", en: "I’m really busy today." },
            { nl: "ik ben vandaag erg blij", en: "I’m really happy today." }
        ]
    },
    {
        english: "The room’s nice and clean.",
        correct: { nl: "de kamer is schoon", en: "The room’s nice and clean." },
        options: [
            { nl: "de kamer is schoon", en: "The room’s nice and clean." },
            { nl: "de kamer is vies", en: "The room’s dirty." },
            { nl: "de kamer is leeg", en: "The room’s empty." }
        ]
    },
    {
        english: "She’s my mum.",
        correct: { nl: "zij is mijn moeder", en: "She’s my mum." },
        options: [
            { nl: "zij is mijn moeder", en: "She’s my mum." },
            { nl: "zij is mijn zus", en: "She’s my sister." },
            { nl: "zij is mijn vriendin", en: "She’s my friend." }
        ]
    },
    {
        english: "We’re at home right now.",
        correct: { nl: "we zijn nu thuis", en: "We’re at home right now." },
        options: [
            { nl: "we zijn nu thuis", en: "We’re at home right now." },
            { nl: "we zijn nu op het werk", en: "We’re at work right now." },
            { nl: "we zijn nu in de winkel", en: "We’re at the shop right now." }
        ]
    },
    {
        english: "He likes his water cold.",
        correct: { nl: "hij houdt van koud water", en: "He likes his water cold." },
        options: [
            { nl: "hij houdt van koud water", en: "He likes his water cold." },
            { nl: "hij houdt van warm water", en: "He likes his water hot." },
            { nl: "hij houdt van zoet water", en: "He likes sweet water." }
        ]
    },
    {
        english: "The bus is running late.",
        correct: { nl: "de bus is te laat", en: "The bus is running late." },
        options: [
            { nl: "de bus is te laat", en: "The bus is running late." },
            { nl: "de bus is vroeg", en: "The bus is arriving early." },
            { nl: "de bus werkt niet", en: "The bus isn’t working." }
        ]
    },
    {
        english: "My mate is really nice.",
        correct: { nl: "mijn vriend is erg aardig", en: "My mate is really nice." },
        options: [
            { nl: "mijn vriend is erg aardig", en: "My mate is really nice." },
            { nl: "mijn vriend is erg serieus", en: "My mate is very serious." },
            { nl: "mijn vriend is erg luid", en: "My mate is very loud." }
        ]
    },
    {
        english: "The shop is close by.",
        correct: { nl: "de winkel is dichtbij", en: "The shop is close by." },
        options: [
            { nl: "de winkel is dichtbij", en: "The shop is close by." },
            { nl: "de winkel is ver weg", en: "The shop is far away." },
            { nl: "de winkel is gesloten", en: "The shop is closed." }
        ]
    },
    {
        english: "The food tastes really good.",
        correct: { nl: "het eten smaakt erg goed", en: "The food tastes really good." },
        options: [
            { nl: "het eten smaakt erg goed", en: "The food tastes really good." },
            { nl: "het eten smaakt slecht", en: "The food tastes bad." },
            { nl: "het eten is koud", en: "The food is cold." }
        ]
    },
    {
       english: "I’m learning Dutch.",
	correct: { nl: "ik leer nederlands", en: "I’m learning Dutch." },
	options: [
   	 { nl: "ik leer nederlands", en: "I’m learning Dutch." },
   	 { nl: "ik leer engels", en: "I’m learning English." },
   	 { nl: "ik leer frans", en: "I’m learning French." }

        ]
    },
    {
        english: "The weather’s pretty warm today.",
        correct: { nl: "het weer is vandaag best warm", en: "The weather’s pretty warm today." },
        options: [
            { nl: "het weer is vandaag best warm", en: "The weather’s pretty warm today." },
            { nl: "het weer is vandaag koud", en: "The weather’s cold today." },
            { nl: "het weer is vandaag regenachtig", en: "The weather’s rainy today." }
        ]
    },
    {
        english: "She’s at the park.",
        correct: { nl: "zij is in het park", en: "She’s at the park." },
        options: [
            { nl: "zij is in het park", en: "She’s at the park." },
            { nl: "zij is op school", en: "She’s at school." },
            { nl: "zij is thuis", en: "She’s at home." }
        ]
    },
    {
        english: "I need a bit of help.",
        correct: { nl: "ik heb een beetje hulp nodig", en: "I need a bit of help." },
        options: [
            { nl: "ik heb een beetje hulp nodig", en: "I need a bit of help." },
            { nl: "ik heb een beetje water nodig", en: "I need a bit of water." },
            { nl: "ik heb een beetje tijd nodig", en: "I need a bit of time." }
        ]
    },
    {
        english: "The dog is very friendly.",
        correct: { nl: "de hond is erg vriendelijk", en: "The dog is very friendly." },
        options: [
            { nl: "de hond is erg vriendelijk", en: "The dog is very friendly." },
            { nl: "de hond is erg luid", en: "The dog is very loud." },
            { nl: "de hond is erg klein", en: "The dog is very small." }
        ]
    },
    {
        english: "We’re having dinner now.",
        correct: { nl: "we zijn nu aan het avondeten", en: "We’re having dinner now." },
        options: [
            { nl: "we zijn nu aan het avondeten", en: "We’re having dinner now." },
            { nl: "we zijn nu aan het ontbijten", en: "We’re having breakfast now." },
            { nl: "we zijn nu aan het werk", en: "We’re working now." }
        ]
    },
    {
        english: "The car is very new.",
        correct: { nl: "de auto is erg nieuw", en: "The car is very new." },
        options: [
            { nl: "de auto is erg nieuw", en: "The car is very new." },
            { nl: "de auto is erg oud", en: "The car is very old." },
            { nl: "de auto is erg snel", en: "The car is very fast." }
        ]
    },
    {
        english: "I’m going to the shop.",
        correct: { nl: "ik ga naar de winkel", en: "I’m going to the shop." },
        options: [
            { nl: "ik ga naar de winkel", en: "I’m going to the shop." },
            { nl: "ik ga naar school", en: "I’m going to school." },
            { nl: "ik ga naar het park", en: "I’m going to the park." }
        ]
    },
    {
        english: "She’s drinking coffee.",
        correct: { nl: "zij drinkt koffie", en: "She’s drinking coffee." },
        options: [
            { nl: "zij drinkt koffie", en: "She’s drinking coffee." },
            { nl: "zij drinkt thee", en: "She’s drinking tea." },
            { nl: "zij drinkt water", en: "She’s drinking water." }
        ]
    },
    {
        english: "The house is pretty big.",
        correct: { nl: "het huis is best groot", en: "The house is pretty big." },
        options: [
            { nl: "het huis is best groot", en: "The house is pretty big." },
            { nl: "het huis is best klein", en: "The house is pretty small." },
            { nl: "het huis is best oud", en: "The house is pretty old." }
        ]
    },
    {
        english: "I’m feeling really good today.",
        correct: { nl: "ik voel me vandaag erg goed", en: "I’m feeling really good today." },
        options: [
            { nl: "ik voel me vandaag erg goed", en: "I’m feeling really good today." },
            { nl: "ik voel me vandaag erg slecht", en: "I’m feeling really bad today." },
            { nl: "ik voel me vandaag erg moe", en: "I’m feeling really tired today." }
        ]
    }
    ]
};
/* ===== A1 PART 2 (joined cleanly, Dutch version) ===== */

{
    english: "She’s reading a book.",
    correct: { nl: "zij leest een boek", en: "She’s reading a book." },
    options: [
        { nl: "zij leest een boek", en: "She’s reading a book." },
        { nl: "zij schrijft een boek", en: "She’s writing a book." },
        { nl: "zij koopt een boek", en: "She’s buying a book." }
    ]
},
{
    english: "I’m cooking dinner.",
    correct: { nl: "ik kook het avondeten", en: "I’m cooking dinner." },
    options: [
        { nl: "ik kook het avondeten", en: "I’m cooking dinner." },
        { nl: "ik eet het avondeten", en: "I’m eating dinner." },
        { nl: "ik maak het ontbijt", en: "I’m making breakfast." }
    ]
},
{
    english: "The street is very quiet.",
    correct: { nl: "de straat is erg rustig", en: "The street is very quiet." },
    options: [
        { nl: "de straat is erg rustig", en: "The street is very quiet." },
        { nl: "de straat is erg luid", en: "The street is very noisy." },
        { nl: "de straat is erg druk", en: "The street is very busy." }
    ]
},
{
    english: "We’re watching a movie.",
    correct: { nl: "we kijken een film", en: "We’re watching a movie." },
    options: [
        { nl: "we kijken een film", en: "We’re watching a movie." },
        { nl: "we maken een film", en: "We’re making a movie." },
        { nl: "we kopen een film", en: "We’re buying a movie." }
    ]
},
{
    english: "The water is really cold.",
    correct: { nl: "het water is erg koud", en: "The water is really cold." },
    options: [
        { nl: "het water is erg koud", en: "The water is really cold." },
        { nl: "het water is erg warm", en: "The water is really hot." },
        { nl: "het water is erg vies", en: "The water is really dirty." }
    ]
},
{
    english: "I’m walking to the park.",
    correct: { nl: "ik loop naar het park", en: "I’m walking to the park." },
    options: [
        { nl: "ik loop naar het park", en: "I’m walking to the park." },
        { nl: "ik loop naar de winkel", en: "I’m walking to the shop." },
        { nl: "ik loop naar huis", en: "I’m walking home." }
    ]
},
{
    english: "He’s talking to his mate.",
    correct: { nl: "hij praat met zijn vriend", en: "He’s talking to his mate." },
    options: [
        { nl: "hij praat met zijn vriend", en: "He’s talking to his mate." },
        { nl: "hij praat met zijn moeder", en: "He’s talking to his mum." },
        { nl: "hij praat met zijn baas", en: "He’s talking to his boss." }
    ]
},
{
    english: "The coffee smells great.",
    correct: { nl: "de koffie ruikt erg goed", en: "The coffee smells great." },
    options: [
        { nl: "de koffie ruikt erg goed", en: "The coffee smells great." },
        { nl: "de koffie ruikt slecht", en: "The coffee smells bad." },
        { nl: "de koffie is koud", en: "The coffee is cold." }
    ]
},
{
    english: "I’m buying some fruit.",
    correct: { nl: "ik koop fruit", en: "I’m buying some fruit." },
    options: [
        { nl: "ik koop fruit", en: "I’m buying some fruit." },
        { nl: "ik koop brood", en: "I’m buying bread." },
        { nl: "ik koop melk", en: "I’m buying milk." }
    ]
},
{
    english: "She’s wearing a red shirt.",
    correct: { nl: "zij draagt een rood shirt", en: "She’s wearing a red shirt." },
    options: [
        { nl: "zij draagt een rood shirt", en: "She’s wearing a red shirt." },
        { nl: "zij draagt een blauw shirt", en: "She’s wearing a blue shirt." },
        { nl: "zij draagt een wit shirt", en: "She’s wearing a white shirt." }
    ]
},
{
    english: "The kids are playing outside.",
    correct: { nl: "de kinderen spelen buiten", en: "The kids are playing outside." },
    options: [
        { nl: "de kinderen spelen buiten", en: "The kids are playing outside." },
        { nl: "de kinderen slapen", en: "The kids are sleeping." },
        { nl: "de kinderen eten", en: "The kids are eating." }
    ]
},
{
    english: "I’m cleaning the kitchen.",
    correct: { nl: "ik maak de keuken schoon", en: "I’m cleaning the kitchen." },
    options: [
        { nl: "ik maak de keuken schoon", en: "I’m cleaning the kitchen." },
        { nl: "ik maak de badkamer schoon", en: "I’m cleaning the bathroom." },
        { nl: "ik maak mijn kamer schoon", en: "I’m cleaning my room." }
    ]
},
{
    english: "The sun is shining.",
    correct: { nl: "de zon schijnt", en: "The sun is shining." },
    options: [
        { nl: "de zon schijnt", en: "The sun is shining." },
        { nl: "de zon is verborgen", en: "The sun is hidden." },
        { nl: "de zon gaat onder", en: "The sun is going down." }
    ]
},
{
    english: "We’re waiting for the bus.",
    correct: { nl: "we wachten op de bus", en: "We’re waiting for the bus." },
    options: [
        { nl: "we wachten op de bus", en: "We’re waiting for the bus." },
        { nl: "we wachten op de trein", en: "We’re waiting for the train." },
        { nl: "we wachten op een vriend", en: "We’re waiting for a mate." }
    ]
},
{
    english: "I’m writing a message.",
    correct: { nl: "ik schrijf een bericht", en: "I’m writing a message." },
    options: [
        { nl: "ik schrijf een bericht", en: "I’m writing a message." },
        { nl: "ik lees een bericht", en: "I’m reading a message." },
        { nl: "ik verwijder een bericht", en: "I’m deleting a message." }
    ]
},
{
    english: "The shop is open now.",
    correct: { nl: "de winkel is nu open", en: "The shop is open now." },
    options: [
        { nl: "de winkel is nu open", en: "The shop is open now." },
        { nl: "de winkel is nu gesloten", en: "The shop is closed now." },
        { nl: "de winkel is erg druk", en: "The shop is really busy." }
    ]
},
{
    english: "She’s listening to music.",
    correct: { nl: "zij luistert naar muziek", en: "She’s listening to music." },
    options: [
        { nl: "zij luistert naar muziek", en: "She’s listening to music." },
        { nl: "zij zingt muziek", en: "She’s singing music." },
        { nl: "zij danst", en: "She’s dancing." }
    ]
},
{
    english: "I’m drinking some juice.",
    correct: { nl: "ik drink sap", en: "I’m drinking some juice." },
    options: [
        { nl: "ik drink sap", en: "I’m drinking some juice." },
        { nl: "ik drink water", en: "I’m drinking water." },
        { nl: "ik drink koffie", en: "I’m drinking coffee." }
    ]
},
{
    english: "The bag is very heavy.",
    correct: { nl: "de tas is erg zwaar", en: "The bag is very heavy." },
    options: [
        { nl: "de tas is erg zwaar", en: "The bag is very heavy." },
        { nl: "de tas is erg licht", en: "The bag is very light." },
        { nl: "de tas is erg klein", en: "The bag is very small." }
    ]
},
{
    english: "We’re walking together.",
    correct: { nl: "we lopen samen", en: "We’re walking together." },
    options: [
        { nl: "we lopen samen", en: "We’re walking together." },
        { nl: "we rennen samen", en: "We’re running together." },
        { nl: "we praten samen", en: "We’re talking together." }
    ]
}
]; // ← CLEAN END OF A1 ARRAY
/* ============================
   A2 — Elementary (Dutch version)
   ============================ */

A2: [
    {
        english: "We’re planning a trip next week.",
        correct: { nl: "we plannen een reis volgende week", en: "We’re planning a trip next week." },
        options: [
            { nl: "we plannen een reis volgende week", en: "We’re planning a trip next week." },
            { nl: "we annuleren een reis volgende week", en: "We’re cancelling a trip next week." },
            { nl: "we herinneren een reis volgende week", en: "We’re remembering a trip next week." }
        ]
    },

    {
        english: "I forgot my keys at home.",
        correct: { nl: "ik ben mijn sleutels thuis vergeten", en: "I forgot my keys at home." },
        options: [
            { nl: "ik ben mijn sleutels thuis vergeten", en: "I forgot my keys at home." },
            { nl: "ik ben mijn sleutels thuis kwijtgeraakt", en: "I lost my keys at home." },
            { nl: "ik liet mijn sleutels in de auto", en: "I left my keys in the car." }
        ]
    },

    {
        english: "They’re cooking dinner together.",
        correct: { nl: "zij koken samen het avondeten", en: "They’re cooking dinner together." },
        options: [
            { nl: "zij koken samen het avondeten", en: "They’re cooking dinner together." },
            { nl: "zij eten samen het avondeten", en: "They’re eating dinner together." },
            { nl: "zij maken samen schoon", en: "They’re cleaning together." }
        ]
    },

    {
        english: "She often arrives late.",
        correct: { nl: "zij komt vaak te laat", en: "She often arrives late." },
        options: [
            { nl: "zij komt vaak te laat", en: "She often arrives late." },
            { nl: "zij komt vaak vroeg", en: "She often arrives early." },
            { nl: "zij komt vaak moe aan", en: "She often arrives tired." }
        ]
    },

    {
        english: "We’ll visit the market tomorrow.",
        correct: { nl: "we bezoeken morgen de markt", en: "We’ll visit the market tomorrow." },
        options: [
            { nl: "we bezoeken morgen de markt", en: "We’ll visit the market tomorrow." },
            { nl: "we bezoeken morgen de winkel", en: "We’ll visit the shop tomorrow." },
            { nl: "we bezoeken morgen het park", en: "We’ll visit the park tomorrow." }
        ]
    },

    {
        english: "I’m listening to a new song.",
        correct: { nl: "ik luister naar een nieuw liedje", en: "I’m listening to a new song." },
        options: [
            { nl: "ik luister naar een nieuw liedje", en: "I’m listening to a new song." },
            { nl: "ik zing een nieuw liedje", en: "I’m singing a new song." },
            { nl: "ik schrijf een nieuw liedje", en: "I’m writing a new song." }
        ]
    },

    {
        english: "She bought fresh fruit this morning.",
        correct: { nl: "zij kocht vers fruit vanmorgen", en: "She bought fresh fruit this morning." },
        options: [
            { nl: "zij kocht vers fruit vanmorgen", en: "She bought fresh fruit this morning." },
            { nl: "zij verkocht vers fruit vanmorgen", en: "She sold fresh fruit this morning." },
            { nl: "zij kookte vers fruit vanmorgen", en: "She cooked fresh fruit this morning." }
        ]
    },

    {
        english: "We’re waiting for our food.",
        correct: { nl: "we wachten op ons eten", en: "We’re waiting for our food." },
        options: [
            { nl: "we wachten op ons eten", en: "We’re waiting for our food." },
            { nl: "we eten ons eten", en: "We’re eating our food." },
            { nl: "we bereiden ons eten", en: "We’re preparing our food." }
        ]
    },

    {
        english: "He’s driving to work right now.",
        correct: { nl: "hij rijdt nu naar zijn werk", en: "He’s driving to work right now." },
        options: [
            { nl: "hij rijdt nu naar zijn werk", en: "He’s driving to work right now." },
            { nl: "hij loopt nu naar zijn werk", en: "He’s walking to work right now." },
            { nl: "hij slaapt nu", en: "He’s sleeping right now." }
        ]
    },

    {
        english: "I’ll call you later today.",
        correct: { nl: "ik bel je later vandaag", en: "I’ll call you later today." },
        options: [
            { nl: "ik bel je later vandaag", en: "I’ll call you later today." },
            { nl: "ik zie je later vandaag", en: "I’ll see you later today." },
            { nl: "ik stuur je later vandaag een bericht", en: "I’ll message you later today." }
        ]
    },

    {
        english: "She’s cleaning the house right now.",
        correct: { nl: "zij maakt nu het huis schoon", en: "She’s cleaning the house right now." },
        options: [
            { nl: "zij maakt nu het huis schoon", en: "She’s cleaning the house right now." },
            { nl: "zij kookt nu", en: "She’s cooking right now." },
            { nl: "zij rust nu", en: "She’s resting right now." }
        ]
    },

    {
        english: "We usually eat dinner at six.",
        correct: { nl: "we eten meestal om zes uur", en: "We usually eat dinner at six." },
        options: [
            { nl: "we eten meestal om zes uur", en: "We usually eat dinner at six." },
            { nl: "we ontbijten meestal om zes uur", en: "We usually eat breakfast at six." },
            { nl: "we gaan meestal om zes uur weg", en: "We usually go out at six." }
        ]
    },

    {
        english: "I’m trying a new recipe today.",
        correct: { nl: "ik probeer vandaag een nieuw recept", en: "I’m trying a new recipe today." },
        options: [
            { nl: "ik probeer vandaag een nieuw recept", en: "I’m trying a new recipe today." },
            { nl: "ik lees vandaag een nieuw recept", en: "I’m reading a new recipe today." },
            { nl: "ik koop vandaag een nieuw recept", en: "I’m buying a new recipe today." }
        ]
    },

    {
        english: "She’s writing an email.",
        correct: { nl: "zij schrijft een e-mail", en: "She’s writing an email." },
        options: [
            { nl: "zij schrijft een e-mail", en: "She’s writing an email." },
            { nl: "zij leest een e-mail", en: "She’s reading an email." },
            { nl: "zij verwijdert een e-mail", en: "She’s deleting an email." }
        ]
    },

    {
        english: "We arrived early this morning.",
        correct: { nl: "we kwamen vanmorgen vroeg aan", en: "We arrived early this morning." },
        options: [
            { nl: "we kwamen vanmorgen vroeg aan", en: "We arrived early this morning." },
            { nl: "we kwamen vanmorgen laat aan", en: "We arrived late this morning." },
            { nl: "we kwamen vanmorgen moe aan", en: "We arrived tired this morning." }
        ]
    },

    {
        english: "He’s watching the news.",
        correct: { nl: "hij kijkt naar het nieuws", en: "He’s watching the news." },
        options: [
            { nl: "hij kijkt naar het nieuws", en: "He’s watching the news." },
            { nl: "hij leest het nieuws", en: "He’s reading the news." },
            { nl: "hij luistert naar het nieuws", en: "He’s listening to the news." }
        ]
    },

    {
        english: "I’ll meet you at the café.",
        correct: { nl: "ik ontmoet je in het café", en: "I’ll meet you at the café." },
        options: [
            { nl: "ik ontmoet je in het café", en: "I’ll meet you at the café." },
            { nl: "ik ontmoet je in het park", en: "I’ll meet you at the park." },
            { nl: "ik ontmoet je in de winkel", en: "I’ll meet you at the shop." }
        ]
    },

    {
        english: "She’s learning new words every day.",
        correct: { nl: "zij leert elke dag nieuwe woorden", en: "She’s learning new words every day." },
        options: [
            { nl: "zij leert elke dag nieuwe woorden", en: "She’s learning new words every day." },
            { nl: "zij vergeet elke dag woorden", en: "She’s forgetting words every day." },
            { nl: "zij leert elke dag woorden aan anderen", en: "She’s teaching words every day." }
        ]
    },

    {
        english: "We’re looking for a good restaurant.",
        correct: { nl: "we zoeken een goed restaurant", en: "We’re looking for a good restaurant." },
        options: [
            { nl: "we zoeken een goed restaurant", en: "We’re looking for a good restaurant." },
            { nl: "we zoeken een goed hotel", en: "We’re looking for a good hotel." },
            { nl: "we zoeken een goed park", en: "We’re looking for a good park." }
        ]
    },

    {
        english: "I’m finishing my work now.",
        correct: { nl: "ik maak nu mijn werk af", en: "I’m finishing my work now." },
        options: [
            { nl: "ik maak nu mijn werk af", en: "I’m finishing my work now." },
            { nl: "ik begin nu aan mijn werk", en: "I’m starting my work now." },
            { nl: "ik stop nu met mijn werk", en: "I’m leaving my work now." }
        ]
    }
];
{
    english: "She’s visiting her mum today.",
    correct: { nl: "zij bezoekt haar moeder vandaag", en: "She’s visiting her mum today." },
    options: [
        { nl: "zij bezoekt haar moeder vandaag", en: "She’s visiting her mum today." },
        { nl: "zij bezoekt haar vriendin vandaag", en: "She’s visiting her friend today." },
        { nl: "zij bezoekt haar zus vandaag", en: "She’s visiting her sister today." }
    ]
},
{
    english: "We’re having lunch at the market.",
    correct: { nl: "we lunchen op de markt", en: "We’re having lunch at the market." },
    options: [
        { nl: "we lunchen op de markt", en: "We’re having lunch at the market." },
        { nl: "we ontbijten op de markt", en: "We’re having breakfast at the market." },
        { nl: "we dineren op de markt", en: "We’re having dinner at the market." }
    ]
},
{
    english: "He forgot his phone at work.",
    correct: { nl: "hij vergat zijn telefoon op het werk", en: "He forgot his phone at work." },
    options: [
        { nl: "hij vergat zijn telefoon op het werk", en: "He forgot his phone at work." },
        { nl: "hij verloor zijn telefoon op het werk", en: "He lost his phone at work." },
        { nl: "hij liet zijn telefoon thuis", en: "He left his phone at home." }
    ]
},
{
    english: "I’m cooking early today.",
    correct: { nl: "ik kook vandaag vroeg", en: "I’m cooking early today." },
    options: [
        { nl: "ik kook vandaag vroeg", en: "I’m cooking early today." },
        { nl: "ik kook vandaag laat", en: "I’m cooking late today." },
        { nl: "ik kook nu", en: "I’m cooking right now." }
    ]
},
{
    english: "She’s waiting outside.",
    correct: { nl: "zij wacht buiten", en: "She’s waiting outside." },
    options: [
        { nl: "zij wacht buiten", en: "She’s waiting outside." },
        { nl: "zij wacht binnen", en: "She’s waiting inside." },
        { nl: "zij wacht thuis", en: "She’s waiting at home." }
    ]
},
{
    english: "We’ll eat together later.",
    correct: { nl: "we eten later samen", en: "We’ll eat together later." },
    options: [
        { nl: "we eten later samen", en: "We’ll eat together later." },
        { nl: "we ontbijten later samen", en: "We’ll have breakfast together later." },
        { nl: "we dineren later samen", en: "We’ll have dinner together later." }
    ]
},
{
    english: "I’m learning new phrases now.",
    correct: { nl: "ik leer nu nieuwe zinnen", en: "I’m learning new phrases now." },
    options: [
        { nl: "ik leer nu nieuwe zinnen", en: "I’m learning new phrases now." },
        { nl: "ik leer nu nieuwe woorden", en: "I’m learning new words now." },
        { nl: "ik leer nu nummers", en: "I’m learning numbers now." }
    ]
},
{
    english: "He’s cleaning the kitchen again.",
    correct: { nl: "hij maakt de keuken weer schoon", en: "He’s cleaning the kitchen again." },
    options: [
        { nl: "hij maakt de keuken weer schoon", en: "He’s cleaning the kitchen again." },
        { nl: "hij maakt de badkamer weer schoon", en: "He’s cleaning the bathroom again." },
        { nl: "hij maakt zijn kamer weer schoon", en: "He’s cleaning his room again." }
    ]
},
{
    english: "We arrived late yesterday.",
    correct: { nl: "we kwamen gisteren laat aan", en: "We arrived late yesterday." },
    options: [
        { nl: "we kwamen gisteren laat aan", en: "We arrived late yesterday." },
        { nl: "we kwamen gisteren vroeg aan", en: "We arrived early yesterday." },
        { nl: "we kwamen gisteren moe aan", en: "We arrived tired yesterday." }
    ]
},
{
    english: "She’s buying fresh bread.",
    correct: { nl: "zij koopt vers brood", en: "She’s buying fresh bread." },
    options: [
        { nl: "zij koopt vers brood", en: "She’s buying fresh bread." },
        { nl: "zij koopt vers fruit", en: "She’s buying fresh fruit." },
        { nl: "zij koopt verse koffie", en: "She’s buying fresh coffee." }
    ]
},
{
    english: "I’ll call my mate later.",
    correct: { nl: "ik bel mijn vriend later", en: "I’ll call my mate later." },
    options: [
        { nl: "ik bel mijn vriend later", en: "I’ll call my mate later." },
        { nl: "ik zie mijn vriend later", en: "I’ll see my mate later." },
        { nl: "ik bezoek mijn vriend later", en: "I’ll visit my mate later." }
    ]
},
{
    english: "We’re visiting the shop now.",
    correct: { nl: "we bezoeken nu de winkel", en: "We’re visiting the shop now." },
    options: [
        { nl: "we bezoeken nu de winkel", en: "We’re visiting the shop now." },
        { nl: "we bezoeken nu de markt", en: "We’re visiting the market now." },
        { nl: "we bezoeken nu het park", en: "We’re visiting the park now." }
    ]
},
{
    english: "She’s drinking cold water.",
    correct: { nl: "zij drinkt koud water", en: "She’s drinking cold water." },
    options: [
        { nl: "zij drinkt koud water", en: "She’s drinking cold water." },
        { nl: "zij drinkt warm water", en: "She’s drinking hot water." },
        { nl: "zij drinkt koud sap", en: "She’s drinking cold juice." }
    ]
},
{
    english: "I’m finishing my coffee.",
    correct: { nl: "ik maak mijn koffie op", en: "I’m finishing my coffee." },
    options: [
        { nl: "ik maak mijn koffie op", en: "I’m finishing my coffee." },
        { nl: "ik drink mijn koffie", en: "I’m drinking my coffee." },
        { nl: "ik maak mijn koffie klaar", en: "I’m preparing my coffee." }
    ]
},
{
    english: "We’re eating together now.",
    correct: { nl: "we eten nu samen", en: "We’re eating together now." },
    options: [
        { nl: "we eten nu samen", en: "We’re eating together now." },
        { nl: "we koken nu samen", en: "We’re cooking together now." },
        { nl: "we maken nu samen schoon", en: "We’re cleaning together now." }
    ]
},
{
    english: "She arrived early today.",
    correct: { nl: "zij kwam vandaag vroeg aan", en: "She arrived early today." },
    options: [
        { nl: "zij kwam vandaag vroeg aan", en: "She arrived early today." },
        { nl: "zij kwam vandaag laat aan", en: "She arrived late today." },
        { nl: "zij kwam vandaag moe aan", en: "She arrived tired today." }
    ]
},
{
    english: "I’m visiting my mum tomorrow.",
    correct: { nl: "ik bezoek mijn moeder morgen", en: "I’m visiting my mum tomorrow." },
    options: [
        { nl: "ik bezoek mijn moeder morgen", en: "I’m visiting my mum tomorrow." },
        { nl: "ik bezoek mijn vriend morgen", en: "I’m visiting my mate tomorrow." },
        { nl: "ik bezoek mijn zus morgen", en: "I’m visiting my sister tomorrow." }
    ]
},
{
    english: "We’re learning together today.",
    correct: { nl: "we leren vandaag samen", en: "We’re learning together today." },
    options: [
        { nl: "we leren vandaag samen", en: "We’re learning together today." },
        { nl: "we lezen vandaag samen", en: "We’re reading together today." },
        { nl: "we schrijven vandaag samen", en: "We’re writing together today." }
    ]
},
{
    english: "She’s finishing her work now.",
    correct: { nl: "zij maakt haar werk nu af", en: "She’s finishing her work now." },
    options: [
        { nl: "zij maakt haar werk nu af", en: "She’s finishing her work now." },
        { nl: "zij begint nu aan haar werk", en: "She’s starting her work now." },
        { nl: "zij stopt nu met haar werk", en: "She’s leaving her work now." }
    ]
}
]; // ← CLEAN END OF A2 ARRAY

/* ============================
   B1 — Intermediate (Dutch version)
   ============================ */

B1: [
    {
        english: "We need to explain the plan clearly.",
        correct: { nl: "we moeten het plan duidelijk uitleggen", en: "We need to explain the plan clearly." },
        options: [
            { nl: "we moeten het plan duidelijk uitleggen", en: "We need to explain the plan clearly." },
            { nl: "we moeten het plan duidelijk veranderen", en: "We need to change the plan clearly." },
            { nl: "we moeten het plan duidelijk vergeten", en: "We need to forget the plan clearly." },
            { nl: "we moeten het plan duidelijk herzien", en: "We need to review the plan clearly." }
        ]
    },
    {
        english: "She prefers to work in a quiet place.",
        correct: { nl: "zij werkt liever op een rustige plek", en: "She prefers to work in a quiet place." },
        options: [
            { nl: "zij werkt liever op een rustige plek", en: "She prefers to work in a quiet place." },
            { nl: "zij werkt liever op een luidruchtige plek", en: "She prefers to work in a noisy place." },
            { nl: "zij werkt liever op een kleine plek", en: "She prefers to work in a small place." },
            { nl: "zij werkt liever op een koude plek", en: "She prefers to work in a cold place." }
        ]
    },
    {
        english: "I decided to take the earlier bus.",
        correct: { nl: "ik besloot de vroegere bus te nemen", en: "I decided to take the earlier bus." },
        options: [
            { nl: "ik besloot de vroegere bus te nemen", en: "I decided to take the earlier bus." },
            { nl: "ik besloot de latere bus te nemen", en: "I decided to take the later bus." },
            { nl: "ik besloot de verkeerde bus te nemen", en: "I decided to take the wrong bus." },
            { nl: "ik besloot de juiste bus te nemen", en: "I decided to take the correct bus." }
        ]
    },
    {
        english: "We’re preparing a simple dinner tonight.",
        correct: { nl: "we bereiden vanavond een eenvoudige maaltijd", en: "We’re preparing a simple dinner tonight." },
        options: [
            { nl: "we bereiden vanavond een eenvoudige maaltijd", en: "We’re preparing a simple dinner tonight." },
            { nl: "we bereiden vanavond een grote maaltijd", en: "We’re preparing a big dinner tonight." },
            { nl: "we bereiden vanavond een koude maaltijd", en: "We’re preparing a cold dinner tonight." },
            { nl: "we bereiden vanavond een nieuwe maaltijd", en: "We’re preparing a new dinner tonight." }
        ]
    },
    {
        english: "He explained the problem very well.",
        correct: { nl: "hij legde het probleem heel goed uit", en: "He explained the problem very well." },
        options: [
            { nl: "hij legde het probleem heel goed uit", en: "He explained the problem very well." },
            { nl: "hij vergat het probleem heel goed", en: "He forgot the problem very well." },
            { nl: "hij veranderde het probleem heel goed", en: "He changed the problem very well." },
            { nl: "hij herzag het probleem heel goed", en: "He reviewed the problem very well." }
        ]
    },
    {
        english: "I’m trying to improve my Dutch every day.",
	correct: { nl: "ik probeer elke dag mijn nederlands te verbeteren", en: "I’m trying to improve my Dutch every day." },
	options: [
	    { nl: "ik probeer elke dag mijn nederlands te verbeteren", en: "I’m trying to improve my Dutch every day." },
	    { nl: "ik probeer elke dag mijn nederlands te vergeten", en: "I’m trying to forget my Dutch every day." },
 	   { nl: "ik probeer elke dag mijn nederlands te veranderen", en: "I’m trying to change my Dutch every day." },
 	   { nl: "ik probeer elke dag mijn nederlands te onderwijzen", en: "I’m trying to teach my Dutch every day." }
        ]
    },
    {
        english: "She described the place in great detail.",
        correct: { nl: "zij beschreef de plek heel gedetailleerd", en: "She described the place in great detail." },
        options: [
            { nl: "zij beschreef de plek heel gedetailleerd", en: "She described the place in great detail." },
            { nl: "zij vergat de plek heel gedetailleerd", en: "She forgot the place in great detail." },
            { nl: "zij veranderde de plek heel gedetailleerd", en: "She changed the place in great detail." },
            { nl: "zij herzag de plek heel gedetailleerd", en: "She reviewed the place in great detail." }
        ]
    },
    {
        english: "We chose the restaurant because it’s quiet.",
        correct: { nl: "we kozen het restaurant omdat het rustig is", en: "We chose the restaurant because it’s quiet." },
        options: [
            { nl: "we kozen het restaurant omdat het rustig is", en: "We chose the restaurant because it’s quiet." },
            { nl: "we kozen het restaurant omdat het luidruchtig is", en: "We chose the restaurant because it’s noisy." },
            { nl: "we kozen het restaurant omdat het duur is", en: "We chose the restaurant because it’s expensive." },
            { nl: "we kozen het restaurant omdat het klein is", en: "We chose the restaurant because it’s small." }
        ]
    },
    {
        english: "He suggested a different idea.",
        correct: { nl: "hij stelde een ander idee voor", en: "He suggested a different idea." },
        options: [
            { nl: "hij stelde een ander idee voor", en: "He suggested a different idea." },
            { nl: "hij vergat een ander idee", en: "He forgot a different idea." },
            { nl: "hij wees een ander idee af", en: "He rejected a different idea." },
            { nl: "hij veranderde een ander idee", en: "He changed a different idea." }
        ]
    },
    {
        english: "I can’t imagine living in a cold place.",
        correct: { nl: "ik kan me niet voorstellen om op een koude plek te wonen", en: "I can’t imagine living in a cold place." },
        options: [
            { nl: "ik kan me niet voorstellen om op een koude plek te wonen", en: "I can’t imagine living in a cold place." },
            { nl: "ik kan me niet voorstellen om op een warme plek te wonen", en: "I can’t imagine living in a warm place." },
            { nl: "ik kan me niet voorstellen om op een dure plek te wonen", en: "I can’t imagine living in an expensive place." },
            { nl: "ik kan me niet voorstellen om op een kleine plek te wonen", en: "I can’t imagine living in a small place." }
        ]
    },
    {
        english: "We continued walking until we found the café.",
        correct: { nl: "we liepen door totdat we het café vonden", en: "We continued walking until we found the café." },
        options: [
            { nl: "we liepen door totdat we het café vonden", en: "We continued walking until we found the café." },
            { nl: "we liepen door totdat we de winkel vonden", en: "We continued walking until we found the shop." },
            { nl: "we liepen door totdat we het park vonden", en: "We continued walking until we found the park." },
            { nl: "we liepen door totdat we het huis vonden", en: "We continued walking until we found the house." }
        ]
    },
    {
        english: "She explained why she arrived late.",
        correct: { nl: "zij legde uit waarom zij te laat aankwam", en: "She explained why she arrived late." },
        options: [
            { nl: "zij legde uit waarom zij te laat aankwam", en: "She explained why she arrived late." },
            { nl: "zij legde uit waarom zij vroeg aankwam", en: "She explained why she arrived early." },
            { nl: "zij legde uit waarom zij moe aankwam", en: "She explained why she arrived tired." },
            { nl: "zij legde uit waarom zij blij aankwam", en: "She explained why she arrived happy." }
        ]
    },
    {
        english: "I prefer to study in the morning.",
        correct: { nl: "ik studeer liever in de ochtend", en: "I prefer to study in the morning." },
        options: [
            { nl: "ik studeer liever in de ochtend", en: "I prefer to study in the morning." },
            { nl: "ik studeer liever in de middag", en: "I prefer to study in the afternoon." },
            { nl: "ik studeer liever in de avond", en: "I prefer to study at night." },
            { nl: "ik studeer liever thuis", en: "I prefer to study at home." }
        ]
    },
    {
        english: "We’re trying to choose a good time.",
        correct: { nl: "we proberen een goed moment te kiezen", en: "We’re trying to choose a good time." },
        options: [
            { nl: "we proberen een goed moment te kiezen", en: "We’re trying to choose a good time." },
            { nl: "we proberen een slecht moment te kiezen", en: "We’re trying to choose a bad time." },
            { nl: "we proberen een vroeg moment te kiezen", en: "We’re trying to choose an early time." },
            { nl: "we proberen een laat moment te kiezen", en: "We’re trying to choose a late time." }
        ]
    },
    {
        english: "He described the problem again.",
        correct: { nl: "hij beschreef het probleem opnieuw", en: "He described the problem again." },
        options: [
            { nl: "hij beschreef het probleem opnieuw", en: "He described the problem again." },
            { nl: "hij vergat het probleem opnieuw", en: "He forgot the problem again." },
            { nl: "hij veranderde het probleem opnieuw", en: "He changed the problem again." },
            { nl: "hij herzag het probleem opnieuw", en: "He reviewed the problem again." }
        ]
    },
    {
        english: "I’m preparing something simple for lunch.",
        correct: { nl: "ik bereid iets eenvoudigs voor de lunch", en: "I’m preparing something simple for lunch." },
        options: [
            { nl: "ik bereid iets eenvoudigs voor de lunch", en: "I’m preparing something simple for lunch." },
            { nl: "ik bereid iets groots voor de lunch", en: "I’m preparing something big for lunch." },
            { nl: "ik bereid iets kouds voor de lunch", en: "I’m preparing something cold for lunch." },
            { nl: "ik bereid iets nieuws voor de lunch", en: "I’m preparing something new for lunch." }
        ]
    },
    {
        english: "She continued talking for a long time.",
        correct: { nl: "zij bleef lange tijd praten", en: "She continued talking for a long time." },
        options: [
            { nl: "zij bleef lange tijd praten", en: "She continued talking for a long time." },
            { nl: "zij bleef lange tijd lopen", en: "She continued walking for a long time." },
            { nl: "zij bleef lange tijd lezen", en: "She continued reading for a long time." },
            { nl: "zij bleef lange tijd schrijven", en: "She continued writing for a long time." }
        ]
    },
    {
        english: "We chose this place because it’s comfortable.",
        correct: { nl: "we kozen deze plek omdat het comfortabel is", en: "We chose this place because it’s comfortable." },
        options: [
            { nl: "we kozen deze plek omdat het comfortabel is", en: "We chose this place because it’s comfortable." },
            { nl: "we kozen deze plek omdat het duur is", en: "We chose this place because it’s expensive." },
            { nl: "we kozen deze plek omdat het koud is", en: "We chose this place because it’s cold." },
            { nl: "we kozen deze plek omdat het klein is", en: "We chose this place because it’s small." }
        ]
    },
    {
        english: "He suggested meeting a bit earlier.",
        correct: { nl: "hij stelde voor om iets eerder af te spreken", en: "He suggested meeting a bit earlier." },
        options: [
            { nl: "hij stelde voor om iets eerder af te spreken", en: "He suggested meeting a bit earlier." },
            { nl: "hij stelde voor om iets later af te spreken", en: "He suggested meeting a bit later." },
            { nl: "hij stelde voor om thuis af te spreken", en: "He suggested meeting at home." },
            { nl: "hij stelde voor om in het park af te spreken", en: "He suggested meeting at the park." }
        ]
    }
];
{
    english: "She explained the idea in a simple way.",
    correct: { nl: "zij legde het idee op een eenvoudige manier uit", en: "She explained the idea in a simple way." },
    options: [
        { nl: "zij legde het idee op een eenvoudige manier uit", en: "She explained the idea in a simple way." },
        { nl: "zij legde het idee op een moeilijke manier uit", en: "She explained the idea in a difficult way." },
        { nl: "zij legde het idee op een snelle manier uit", en: "She explained the idea in a fast way." },
        { nl: "zij legde het idee op een langzame manier uit", en: "She explained the idea in a slow way." }
    ]
},

{
    english: "We’re trying to improve the plan a little.",
    correct: { nl: "we proberen het plan een beetje te verbeteren", en: "We’re trying to improve the plan a little." },
    options: [
        { nl: "we proberen het plan een beetje te verbeteren", en: "We’re trying to improve the plan a little." },
        { nl: "we proberen het plan een beetje te veranderen", en: "We’re trying to change the plan a little." },
        { nl: "we proberen het plan een beetje te vergeten", en: "We’re trying to forget the plan a little." },
        { nl: "we proberen het plan een beetje te herzien", en: "We’re trying to review the plan a little." }
    ]
},

{
    english: "He suggested taking a short break.",
    correct: { nl: "hij stelde voor om een korte pauze te nemen", en: "He suggested taking a short break." },
    options: [
        { nl: "hij stelde voor om een korte pauze te nemen", en: "He suggested taking a short break." },
        { nl: "hij stelde voor om een lange pauze te nemen", en: "He suggested taking a long break." },
        { nl: "hij stelde voor om een koude pauze te nemen", en: "He suggested taking a cold break." },
        { nl: "hij stelde voor om een vroege pauze te nemen", en: "He suggested taking an early break." }
    ]
},

{
    english: "I can’t imagine choosing another place.",
    correct: { nl: "ik kan me niet voorstellen een andere plek te kiezen", en: "I can’t imagine choosing another place." },
    options: [
        { nl: "ik kan me niet voorstellen een andere plek te kiezen", en: "I can’t imagine choosing another place." },
        { nl: "ik kan me niet voorstellen deze plek te kiezen", en: "I can’t imagine choosing this place." },
        { nl: "ik kan me niet voorstellen een kleine plek te kiezen", en: "I can’t imagine choosing a small place." },
        { nl: "ik kan me niet voorstellen een dure plek te kiezen", en: "I can’t imagine choosing an expensive place." }
    ]
},

{
    english: "She described the restaurant as very comfortable.",
    correct: { nl: "zij beschreef het restaurant als erg comfortabel", en: "She described the restaurant as very comfortable." },
    options: [
        { nl: "zij beschreef het restaurant als erg comfortabel", en: "She described the restaurant as very comfortable." },
        { nl: "zij beschreef het restaurant als erg duur", en: "She described the restaurant as very expensive." },
        { nl: "zij beschreef het restaurant als erg koud", en: "She described the restaurant as very cold." },
        { nl: "zij beschreef het restaurant als erg klein", en: "She described the restaurant as very small." }
    ]
},

{
    english: "We continued talking until it got late.",
    correct: { nl: "we bleven praten totdat het laat werd", en: "We continued talking until it got late." },
    options: [
        { nl: "we bleven praten totdat het laat werd", en: "We continued talking until it got late." },
        { nl: "we bleven praten totdat het vroeg werd", en: "We continued talking until it got early." },
        { nl: "we bleven praten totdat het koud werd", en: "We continued talking until it got cold." },
        { nl: "we bleven praten totdat het comfortabel werd", en: "We continued talking until it got comfortable." }
    ]
},

{
    english: "He explained the reason very clearly.",
    correct: { nl: "hij legde de reden heel duidelijk uit", en: "He explained the reason very clearly." },
    options: [
        { nl: "hij legde de reden heel duidelijk uit", en: "He explained the reason very clearly." },
        { nl: "hij legde de reden heel langzaam uit", en: "He explained the reason very slowly." },
        { nl: "hij legde de reden heel snel uit", en: "He explained the reason very quickly." },
        { nl: "hij legde de reden heel slecht uit", en: "He explained the reason very badly." }
    ]
},

{
    english: "I prefer to walk when the weather is warm.",
    correct: { nl: "ik loop liever wanneer het weer warm is", en: "I prefer to walk when the weather is warm." },
    options: [
        { nl: "ik loop liever wanneer het weer warm is", en: "I prefer to walk when the weather is warm." },
        { nl: "ik loop liever wanneer het weer koud is", en: "I prefer to walk when the weather is cold." },
        { nl: "ik loop liever wanneer het weer regenachtig is", en: "I prefer to walk when the weather is rainy." },
        { nl: "ik loop liever wanneer het weer duur is", en: "I prefer to walk when the weather is expensive." }
    ]
},

{
    english: "We’re preparing everything for tomorrow.",
    correct: { nl: "we bereiden alles voor voor morgen", en: "We’re preparing everything for tomorrow." },
    options: [
        { nl: "we bereiden alles voor voor morgen", en: "We’re preparing everything for tomorrow." },
        { nl: "we bereiden alles voor voor vandaag", en: "We’re preparing everything for today." },
        { nl: "we bereiden alles voor voor de middag", en: "We’re preparing everything for the afternoon." },
        { nl: "we bereiden alles voor voor vanavond", en: "We’re preparing everything for tonight." }
    ]
},

{
    english: "She suggested choosing a quieter place.",
    correct: { nl: "zij stelde voor een rustigere plek te kiezen", en: "She suggested choosing a quieter place." },
    options: [
        { nl: "zij stelde voor een rustigere plek te kiezen", en: "She suggested choosing a quieter place." },
        { nl: "zij stelde voor een luidruchtigere plek te kiezen", en: "She suggested choosing a noisier place." },
        { nl: "zij stelde voor een duurdere plek te kiezen", en: "She suggested choosing a more expensive place." },
        { nl: "zij stelde voor een kleinere plek te kiezen", en: "She suggested choosing a smaller place." }
    ]
},

{
    english: "I’m trying to describe the problem clearly.",
    correct: { nl: "ik probeer het probleem duidelijk te beschrijven", en: "I’m trying to describe the problem clearly." },
    options: [
        { nl: "ik probeer het probleem duidelijk te beschrijven", en: "I’m trying to describe the problem clearly." },
        { nl: "ik probeer het probleem langzaam te beschrijven", en: "I’m trying to describe the problem slowly." },
        { nl: "ik probeer het probleem snel te beschrijven", en: "I’m trying to describe the problem quickly." },
        { nl: "ik probeer het probleem slecht te beschrijven", en: "I’m trying to describe the problem badly." }
    ]
},

{
    english: "We continued walking until we reached the shop.",
    correct: { nl: "we liepen door totdat we de winkel bereikten", en: "We continued walking until we reached the shop." },
    options: [
        { nl: "we liepen door totdat we de winkel bereikten", en: "We continued walking until we reached the shop." },
        { nl: "we liepen door totdat we het park bereikten", en: "We continued walking until we reached the park." },
        { nl: "we liepen door totdat we het café bereikten", en: "We continued walking until we reached the café." },
        { nl: "we liepen door totdat we het huis bereikten", en: "We continued walking until we reached the house." }
    ]
},

{
    english: "He described the place as warm and comfortable.",
    correct: { nl: "hij beschreef de plek als warm en comfortabel", en: "He described the place as warm and comfortable." },
    options: [
        { nl: "hij beschreef de plek als warm en comfortabel", en: "He described the place as warm and comfortable." },
        { nl: "hij beschreef de plek als koud en comfortabel", en: "He described the place as cold and comfortable." },
        { nl: "hij beschreef de plek als warm en duur", en: "He described the place as warm and expensive." },
        { nl: "hij beschreef de plek als warm en klein", en: "He described the place as warm and small." }
    ]
},

{
    english: "I decided to choose the earlier time.",
    correct: { nl: "ik besloot de vroegere tijd te kiezen", en: "I decided to choose the earlier time." },
    options: [
        { nl: "ik besloot de vroegere tijd te kiezen", en: "I decided to choose the earlier time." },
        { nl: "ik besloot de latere tijd te kiezen", en: "I decided to choose the later time." },
        { nl: "ik besloot de koudere tijd te kiezen", en: "I decided to choose the colder time." },
        { nl: "ik besloot de duurdere tijd te kiezen", en: "I decided to choose the more expensive time." }
    ]
},

{
    english: "She explained the plan again.",
    correct: { nl: "zij legde het plan opnieuw uit", en: "She explained the plan again." },
    options: [
        { nl: "zij legde het plan opnieuw uit", en: "She explained the plan again." },
        { nl: "zij veranderde het plan opnieuw", en: "She changed the plan again." },
        { nl: "zij vergat het plan opnieuw", en: "She forgot the plan again." },
        { nl: "zij herzag het plan opnieuw", en: "She reviewed the plan again." }
    ]
},

{
    english: "We’re preparing something warm for dinner.",
    correct: { nl: "we bereiden iets warms voor het avondeten", en: "We’re preparing something warm for dinner." },
    options: [
        { nl: "we bereiden iets warms voor het avondeten", en: "We’re preparing something warm for dinner." },
        { nl: "we bereiden iets kouds voor het avondeten", en: "We’re preparing something cold for dinner." },
        { nl: "we bereiden iets duurs voor het avondeten", en: "We’re preparing something expensive for dinner." },
        { nl: "we bereiden iets kleins voor het avondeten", en: "We’re preparing something small for dinner." }
    ]
},

{
    english: "He continued explaining for a long time.",
    correct: { nl: "hij bleef lange tijd uitleggen", en: "He continued explaining for a long time." },
    options: [
        { nl: "hij bleef lange tijd uitleggen", en: "He continued explaining for a long time." },
        { nl: "hij bleef lange tijd lezen", en: "He continued reading for a long time." },
        { nl: "hij bleef lange tijd schrijven", en: "He continued writing for a long time." },
        { nl: "hij bleef lange tijd lopen", en: "He continued walking for a long time." }
    ]
},

{
    english: "I prefer to choose a simple option.",
    correct: { nl: "ik kies liever een eenvoudige optie", en: "I prefer to choose a simple option." },
    options: [
        { nl: "ik kies liever een eenvoudige optie", en: "I prefer to choose a simple option." },
        { nl: "ik kies liever een dure optie", en: "I prefer to choose an expensive option." },
        { nl: "ik kies liever een koude optie", en: "I prefer to choose a cold option." },
        { nl: "ik kies liever een kleine optie", en: "I prefer to choose a small option." }
    ]
}
]; // ← CLEAN END OF B1 ARRAY

/* ============================
   B2 — Upper Intermediate (Dutch version)
   ============================ */

B2: [
    {
        english: "We need to consider all the details before deciding.",
        correct: { nl: "we moeten alle details overwegen voordat we beslissen", en: "We need to consider all the details before deciding." },
        options: [
            { nl: "we moeten alle details overwegen voordat we beslissen", en: "We need to consider all the details before deciding." },
            { nl: "we moeten alle details negeren voordat we beslissen", en: "We need to ignore all the details before deciding." },
            { nl: "we moeten alle details veranderen voordat we beslissen", en: "We need to change all the details before deciding." },
            { nl: "we moeten alle details herzien voordat we beslissen", en: "We need to review all the details before deciding." }
        ]
    },

    {
        english: "She realised the problem was more complex than expected.",
        correct: { nl: "zij realiseerde zich dat het probleem ingewikkelder was dan verwacht", en: "She realised the problem was more complex than expected." },
        options: [
            { nl: "zij realiseerde zich dat het probleem ingewikkelder was dan verwacht", en: "She realised the problem was more complex than expected." },
            { nl: "zij realiseerde zich dat het probleem eenvoudiger was dan verwacht", en: "She realised the problem was simpler than expected." },
            { nl: "zij realiseerde zich dat het probleem korter was dan verwacht", en: "She realised the problem was shorter than expected." },
            { nl: "zij realiseerde zich dat het probleem duurder was dan verwacht", en: "She realised the problem was more expensive than expected." }
        ]
    },

    {
        english: "We’re organising everything so the day runs smoothly.",
        correct: { nl: "we organiseren alles zodat de dag soepel verloopt", en: "We’re organising everything so the day runs smoothly." },
        options: [
            { nl: "we organiseren alles zodat de dag soepel verloopt", en: "We’re organising everything so the day runs smoothly." },
            { nl: "we organiseren alles zodat de dag slecht verloopt", en: "We’re organising everything so the day goes badly." },
            { nl: "we organiseren alles zodat de dag kort is", en: "We’re organising everything so the day is short." },
            { nl: "we organiseren alles zodat de dag duur is", en: "We’re organising everything so the day is expensive." }
        ]
    },

    {
        english: "He managed to finish the task on time.",
        correct: { nl: "hij slaagde erin de taak op tijd af te maken", en: "He managed to finish the task on time." },
        options: [
            { nl: "hij slaagde erin de taak op tijd af te maken", en: "He managed to finish the task on time." },
            { nl: "hij slaagde erin de taak te laat af te maken", en: "He managed to finish the task late." },
            { nl: "hij slaagde erin de taak slecht af te maken", en: "He managed to finish the task badly." },
            { nl: "hij slaagde erin de taak vroeg af te maken", en: "He managed to finish the task early." }
        ]
    },

    {
        english: "I recommend choosing a quieter place for the meeting.",
        correct: { nl: "ik raad aan een rustigere plek te kiezen voor de vergadering", en: "I recommend choosing a quieter place for the meeting." },
        options: [
            { nl: "ik raad aan een rustigere plek te kiezen voor de vergadering", en: "I recommend choosing a quieter place for the meeting." },
            { nl: "ik raad aan een luidruchtigere plek te kiezen voor de vergadering", en: "I recommend choosing a noisier place for the meeting." },
            { nl: "ik raad aan een duurdere plek te kiezen voor de vergadering", en: "I recommend choosing a more expensive place for the meeting." },
            { nl: "ik raad aan een kleinere plek te kiezen voor de vergadering", en: "I recommend choosing a smaller place for the meeting." }
        ]
    },

    {
        english: "We discussed several options before making a decision.",
        correct: { nl: "we bespraken verschillende opties voordat we een beslissing namen", en: "We discussed several options before making a decision." },
        options: [
            { nl: "we bespraken verschillende opties voordat we een beslissing namen", en: "We discussed several options before making a decision." },
            { nl: "we bespraken verschillende opties nadat we een beslissing namen", en: "We discussed several options after making a decision." },
            { nl: "we bespraken verschillende opties zonder een beslissing te nemen", en: "We discussed several options without making a decision." },
            { nl: "we bespraken verschillende opties om een beslissing te vermijden", en: "We discussed several options to avoid a decision." }
        ]
    },

    {
        english: "She recognised the place from a photo.",
        correct: { nl: "zij herkende de plek van een foto", en: "She recognised the place from a photo." },
        options: [
            { nl: "zij herkende de plek van een foto", en: "She recognised the place from a photo." },
            { nl: "zij herkende de plek van een bericht", en: "She recognised the place from a message." },
            { nl: "zij herkende de plek van een telefoontje", en: "She recognised the place from a call." },
            { nl: "zij herkende de plek van een verhaal", en: "She recognised the place from a story." }
        ]
    },

    {
        english: "We analysed the problem and found a simple solution.",
        correct: { nl: "we analyseerden het probleem en vonden een eenvoudige oplossing", en: "We analysed the problem and found a simple solution." },
        options: [
            { nl: "we analyseerden het probleem en vonden een eenvoudige oplossing", en: "We analysed the problem and found a simple solution." },
            { nl: "we analyseerden het probleem en vonden een dure oplossing", en: "We analysed the problem and found an expensive solution." },
            { nl: "we analyseerden het probleem en vonden een koude oplossing", en: "We analysed the problem and found a cold solution." },
            { nl: "we analyseerden het probleem en vonden een kleine oplossing", en: "We analysed the problem and found a small solution." }
        ]
    },

    {
        english: "He realised he needed more time to prepare.",
        correct: { nl: "hij realiseerde zich dat hij meer tijd nodig had om zich voor te bereiden", en: "He realised he needed more time to prepare." },
        options: [
            { nl: "hij realiseerde zich dat hij meer tijd nodig had om zich voor te bereiden", en: "He realised he needed more time to prepare." },
            { nl: "hij realiseerde zich dat hij minder tijd nodig had om zich voor te bereiden", en: "He realised he needed less time to prepare." },
            { nl: "hij realiseerde zich dat hij koude tijd nodig had om zich voor te bereiden", en: "He realised he needed cold time to prepare." },
            { nl: "hij realiseerde zich dat hij dure tijd nodig had om zich voor te bereiden", en: "He realised he needed expensive time to prepare." }
        ]
    },

    {
        english: "We’re trying to organise the day more efficiently.",
        correct: { nl: "we proberen de dag efficiënter te organiseren", en: "We’re trying to organise the day more efficiently." },
        options: [
            { nl: "we proberen de dag efficiënter te organiseren", en: "We’re trying to organise the day more efficiently." },
            { nl: "we proberen de dag langzamer te organiseren", en: "We’re trying to organise the day more slowly." },
            { nl: "we proberen de dag duurder te organiseren", en: "We’re trying to organise the day more expensively." },
            { nl: "we proberen de dag kouder te organiseren", en: "We’re trying to organise the day more coldly." }
        ]
    },

    {
        english: "She compared the two options carefully.",
        correct: { nl: "zij vergeleek de twee opties zorgvuldig", en: "She compared the two options carefully." },
        options: [
            { nl: "zij vergeleek de twee opties zorgvuldig", en: "She compared the two options carefully." },
            { nl: "zij vergeleek de twee opties snel", en: "She compared the two options quickly." },
            { nl: "zij vergeleek de twee opties slecht", en: "She compared the two options badly." },
            { nl: "zij vergeleek de twee opties langzaam", en: "She compared the two options slowly." }
        ]
    },

    {
        english: "We expect the meeting to finish early.",
        correct: { nl: "we verwachten dat de vergadering vroeg eindigt", en: "We expect the meeting to finish early." },
        options: [
            { nl: "we verwachten dat de vergadering vroeg eindigt", en: "We expect the meeting to finish early." },
            { nl: "we verwachten dat de vergadering laat eindigt", en: "We expect the meeting to finish late." },
            { nl: "we verwachten dat de vergadering slecht eindigt", en: "We expect the meeting to finish badly." },
            { nl: "we verwachten dat de vergadering koud eindigt", en: "We expect the meeting to finish cold." }
        ]
    },

    {
        english: "He managed to organise everything before midday.",
        correct: { nl: "hij slaagde erin alles te organiseren vóór de middag", en: "He managed to organise everything before midday." },
        options: [
            { nl: "hij slaagde erin alles te organiseren vóór de middag", en: "He managed to organise everything before midday." },
            { nl: "hij slaagde erin alles te organiseren na de middag", en: "He managed to organise everything after midday." },
            { nl: "hij slaagde erin alles te organiseren in de avond", en: "He managed to organise everything at night." },
            { nl: "hij slaagde erin alles te organiseren in de ochtend", en: "He managed to organise everything in the morning." }
        ]
    }
];

{
    english: "I recommend preparing a bit earlier next time.",
    correct: { nl: "ik raad aan om de volgende keer iets eerder voor te bereiden", en: "I recommend preparing a bit earlier next time." },
    options: [
        { nl: "ik raad aan om de volgende keer iets eerder voor te bereiden", en: "I recommend preparing a bit earlier next time." },
        { nl: "ik raad aan om de volgende keer iets later voor te bereiden", en: "I recommend preparing a bit later next time." },
        { nl: "ik raad aan om de volgende keer thuis voor te bereiden", en: "I recommend preparing at home next time." },
        { nl: "ik raad aan om de volgende keer in het park voor te bereiden", en: "I recommend preparing at the park next time." }
    ]
},
{
    english: "We discussed the plan and agreed on a few changes.",
    correct: { nl: "we bespraken het plan en kwamen enkele veranderingen overeen", en: "We discussed the plan and agreed on a few changes." },
    options: [
        { nl: "we bespraken het plan en kwamen enkele veranderingen overeen", en: "We discussed the plan and agreed on a few changes." },
        { nl: "we bespraken het plan en kwamen geen veranderingen overeen", en: "We discussed the plan and agreed on no changes." },
        { nl: "we bespraken het plan en kwamen veel veranderingen overeen", en: "We discussed the plan and agreed on many changes." },
        { nl: "we bespraken het plan en kwamen koude veranderingen overeen", en: "We discussed the plan and agreed on cold changes." }
    ]
},
{
    english: "She recognised the problem immediately.",
    correct: { nl: "zij herkende het probleem meteen", en: "She recognised the problem immediately." },
    options: [
        { nl: "zij herkende het probleem meteen", en: "She recognised the problem immediately." },
        { nl: "zij herkende het probleem langzaam", en: "She recognised the problem slowly." },
        { nl: "zij herkende het probleem laat", en: "She recognised the problem late." },
        { nl: "zij herkende het probleem slecht", en: "She recognised the problem badly." }
    ]
},
{
    english: "We analysed the situation and chose the best option.",
    correct: { nl: "we analyseerden de situatie en kozen de beste optie", en: "We analysed the situation and chose the best option." },
    options: [
        { nl: "we analyseerden de situatie en kozen de beste optie", en: "We analysed the situation and chose the best option." },
        { nl: "we analyseerden de situatie en kozen de slechtste optie", en: "We analysed the situation and chose the worst option." },
        { nl: "we analyseerden de situatie en kozen een koude optie", en: "We analysed the situation and chose a cold option." },
        { nl: "we analyseerden de situatie en kozen een dure optie", en: "We analysed the situation and chose an expensive option." }
    ]
},
{
    english: "He realised the meeting would take longer than planned.",
    correct: { nl: "hij realiseerde zich dat de vergadering langer zou duren dan gepland", en: "He realised the meeting would take longer than planned." },
    options: [
        { nl: "hij realiseerde zich dat de vergadering langer zou duren dan gepland", en: "He realised the meeting would take longer than planned." },
        { nl: "hij realiseerde zich dat de vergadering korter zou duren dan gepland", en: "He realised the meeting would take less time than planned." },
        { nl: "hij realiseerde zich dat de vergadering koude tijd zou nemen", en: "He realised the meeting would take cold time." },
        { nl: "hij realiseerde zich dat de vergadering dure tijd zou nemen", en: "He realised the meeting would take expensive time." }
    ]
},

/* ===== B2 PART 2 (joined cleanly) ===== */

{
    english: "She considered changing the plan after the meeting.",
    correct: { nl: "zij overwoog het plan te veranderen na de vergadering", en: "She considered changing the plan after the meeting." },
    options: [
        { nl: "zij overwoog het plan te veranderen na de vergadering", en: "She considered changing the plan after the meeting." },
        { nl: "zij overwoog het plan te vergeten na de vergadering", en: "She considered forgetting the plan after the meeting." },
        { nl: "zij overwoog het plan te herzien na de vergadering", en: "She considered reviewing the plan after the meeting." },
        { nl: "zij overwoog het plan af te ronden na de vergadering", en: "She considered finishing the plan after the meeting." }
    ]
},
{
    english: "We realised the situation required more attention.",
    correct: { nl: "we realiseerden ons dat de situatie meer aandacht nodig had", en: "We realised the situation required more attention." },
    options: [
        { nl: "we realiseerden ons dat de situatie meer aandacht nodig had", en: "We realised the situation required more attention." },
        { nl: "we realiseerden ons dat de situatie minder aandacht nodig had", en: "We realised the situation required less attention." },
        { nl: "we realiseerden ons dat de situatie koude aandacht nodig had", en: "We realised the situation required cold attention." },
        { nl: "we realiseerden ons dat de situatie dure aandacht nodig had", en: "We realised the situation required expensive attention." }
    ]
},
{
    english: "He managed to explain everything without any confusion.",
    correct: { nl: "hij slaagde erin alles uit te leggen zonder enige verwarring", en: "He managed to explain everything without any confusion." },
    options: [
        { nl: "hij slaagde erin alles uit te leggen zonder enige verwarring", en: "He managed to explain everything without any confusion." },
        { nl: "hij slaagde erin alles uit te leggen met veel verwarring", en: "He managed to explain everything with a lot of confusion." },
        { nl: "hij slaagde erin alles erg laat uit te leggen", en: "He managed to explain everything very late." },
        { nl: "hij slaagde erin alles erg snel uit te leggen", en: "He managed to explain everything very quickly." }
    ]
},
{
    english: "I recommend discussing the problem before choosing a solution.",
    correct: { nl: "ik raad aan het probleem te bespreken voordat we een oplossing kiezen", en: "I recommend discussing the problem before choosing a solution." },
    options: [
        { nl: "ik raad aan het probleem te bespreken voordat we een oplossing kiezen", en: "I recommend discussing the problem before choosing a solution." },
        { nl: "ik raad aan het probleem te bespreken nadat we een oplossing kiezen", en: "I recommend discussing the problem after choosing a solution." },
        { nl: "ik raad aan het probleem te bespreken zonder een oplossing te kiezen", en: "I recommend discussing the problem without choosing a solution." },
        { nl: "ik raad aan het probleem te bespreken om een oplossing te vermijden", en: "I recommend discussing the problem to avoid a solution." }
    ]
},
{
    english: "We compared several ideas and chose the most practical one.",
    correct: { nl: "we vergeleken verschillende ideeën en kozen de meest praktische", en: "We compared several ideas and chose the most practical one." },
    options: [
        { nl: "we vergeleken verschillende ideeën en kozen de meest praktische", en: "We compared several ideas and chose the most practical one." },
        { nl: "we vergeleken verschillende ideeën en kozen de duurste", en: "We compared several ideas and chose the most expensive one." },
        { nl: "we vergeleken verschillende ideeën en kozen de koudste", en: "We compared several ideas and chose the coldest one." },
        { nl: "we vergeleken verschillende ideeën en kozen de kleinste", en: "We compared several ideas and chose the smallest one." }
    ]
},
{
    english: "She recognised the mistake and corrected it quickly.",
    correct: { nl: "zij herkende de fout en corrigeerde die snel", en: "She recognised the mistake and corrected it quickly." },
    options: [
        { nl: "zij herkende de fout en corrigeerde die snel", en: "She recognised the mistake and corrected it quickly." },
        { nl: "zij herkende de fout en corrigeerde die langzaam", en: "She recognised the mistake and corrected it slowly." },
        { nl: "zij herkende de fout en corrigeerde die slecht", en: "She recognised the mistake and corrected it badly." },
        { nl: "zij herkende de fout en corrigeerde die laat", en: "She recognised the mistake and corrected it late." }
    ]
},
{
    english: "We analysed the results and noticed a clear pattern.",
    correct: { nl: "we analyseerden de resultaten en merkten een duidelijk patroon op", en: "We analysed the results and noticed a clear pattern." },
    options: [
        { nl: "we analyseerden de resultaten en merkten een duidelijk patroon op", en: "We analysed the results and noticed a clear pattern." },
        { nl: "we analyseerden de resultaten en merkten een klein patroon op", en: "We analysed the results and noticed a small pattern." },
        { nl: "we analyseerden de resultaten en merkten een duur patroon op", en: "We analysed the results and noticed an expensive pattern." },
        { nl: "we analyseerden de resultaten en merkten een koud patroon op", en: "We analysed the results and noticed a cold pattern." }
    ]
}
];

{
    english: "He considered waiting a bit longer before leaving.",
    correct: { nl: "hij overwoog om iets langer te wachten voordat hij vertrok", en: "He considered waiting a bit longer before leaving." },
    options: [
        { nl: "hij overwoog om iets langer te wachten voordat hij vertrok", en: "He considered waiting a bit longer before leaving." },
        { nl: "hij overwoog om iets korter te wachten voordat hij vertrok", en: "He considered waiting a bit less before leaving." },
        { nl: "hij overwoog om thuis te wachten voordat hij vertrok", en: "He considered waiting at home before leaving." },
        { nl: "hij overwoog om in het park te wachten voordat hij vertrok", en: "He considered waiting at the park before leaving." }
    ]
},
{
    english: "We expect the project to take a few more days.",
    correct: { nl: "we verwachten dat het project nog een paar dagen zal duren", en: "We expect the project to take a few more days." },
    options: [
        { nl: "we verwachten dat het project nog een paar dagen zal duren", en: "We expect the project to take a few more days." },
        { nl: "we verwachten dat het project een paar dagen minder zal duren", en: "We expect the project to take a few fewer days." },
        { nl: "we verwachten dat het project koude dagen zal duren", en: "We expect the project to take cold days." },
        { nl: "we verwachten dat het project dure dagen zal duren", en: "We expect the project to take expensive days." }
    ]
},
{
    english: "She managed to organise everything without any help.",
    correct: { nl: "zij slaagde erin alles te organiseren zonder enige hulp", en: "She managed to organise everything without any help." },
    options: [
        { nl: "zij slaagde erin alles te organiseren zonder enige hulp", en: "She managed to organise everything without any help." },
        { nl: "zij slaagde erin alles te organiseren met veel hulp", en: "She managed to organise everything with a lot of help." },
        { nl: "zij slaagde erin alles erg laat te organiseren", en: "She managed to organise everything very late." },
        { nl: "zij slaagde erin alles erg snel te organiseren", en: "She managed to organise everything very quickly." }
    ]
},
{
    english: "I recommend choosing the option that feels most comfortable.",
    correct: { nl: "ik raad aan de optie te kiezen die het meest comfortabel voelt", en: "I recommend choosing the option that feels most comfortable." },
    options: [
        { nl: "ik raad aan de optie te kiezen die het meest comfortabel voelt", en: "I recommend choosing the option that feels most comfortable." },
        { nl: "ik raad aan de optie te kiezen die duurder voelt", en: "I recommend choosing the option that feels more expensive." },
        { nl: "ik raad aan de optie te kiezen die kouder voelt", en: "I recommend choosing the option that feels colder." },
        { nl: "ik raad aan de optie te kiezen die kleiner voelt", en: "I recommend choosing the option that feels smaller." }
    ]
},
{
    english: "We discussed the idea and agreed it was practical.",
    correct: { nl: "we bespraken het idee en waren het eens dat het praktisch was", en: "We discussed the idea and agreed it was practical." },
    options: [
        { nl: "we bespraken het idee en waren het eens dat het praktisch was", en: "We discussed the idea and agreed it was practical." },
        { nl: "we bespraken het idee en waren het eens dat het duur was", en: "We discussed the idea and agreed it was expensive." },
        { nl: "we bespraken het idee en waren het eens dat het koud was", en: "We discussed the idea and agreed it was cold." },
        { nl: "we bespraken het idee en waren het eens dat het klein was", en: "We discussed the idea and agreed it was small." }
    ]
},
{
    english: "She recognised the voice immediately.",
    correct: { nl: "zij herkende de stem meteen", en: "She recognised the voice immediately." },
    options: [
        { nl: "zij herkende de stem meteen", en: "She recognised the voice immediately." },
        { nl: "zij herkende de stem langzaam", en: "She recognised the voice slowly." },
        { nl: "zij herkende de stem laat", en: "She recognised the voice late." },
        { nl: "zij herkende de stem slecht", en: "She recognised the voice badly." }
    ]
},
{
    english: "We analysed the options and chose the most efficient one.",
    correct: { nl: "we analyseerden de opties en kozen de meest efficiënte", en: "We analysed the options and chose the most efficient one." },
    options: [
        { nl: "we analyseerden de opties en kozen de meest efficiënte", en: "We analysed the options and chose the most efficient one." },
        { nl: "we analyseerden de opties en kozen de duurste", en: "We analysed the options and chose the most expensive one." },
        { nl: "we analyseerden de opties en kozen de koudste", en: "We analysed the options and chose the coldest one." },
        { nl: "we analyseerden de opties en kozen de kleinste", en: "We analysed the options and chose the smallest one." }
    ]
},
{
    english: "He considered preparing everything earlier next time.",
    correct: { nl: "hij overwoog om de volgende keer alles eerder voor te bereiden", en: "He considered preparing everything earlier next time." },
    options: [
        { nl: "hij overwoog om de volgende keer alles eerder voor te bereiden", en: "He considered preparing everything earlier next time." },
        { nl: "hij overwoog om de volgende keer alles later voor te bereiden", en: "He considered preparing everything later next time." },
        { nl: "hij overwoog om de volgende keer alles thuis voor te bereiden", en: "He considered preparing everything at home next time." },
        { nl: "hij overwoog om de volgende keer alles in het park voor te bereiden", en: "He considered preparing everything at the park next time." }
    ]
},
{
    english: "We expect the day to run smoothly if we organise well.",
    correct: { nl: "we verwachten dat de dag soepel verloopt als we goed organiseren", en: "We expect the day to run smoothly if we organise well." },
    options: [
        { nl: "we verwachten dat de dag soepel verloopt als we goed organiseren", en: "We expect the day to run smoothly if we organise well." },
        { nl: "we verwachten dat de dag slecht verloopt als we goed organiseren", en: "We expect the day to go badly if we organise well." },
        { nl: "we verwachten dat de dag koud verloopt als we goed organiseren", en: "We expect the day to go cold if we organise well." },
        { nl: "we verwachten dat de dag duur verloopt als we goed organiseren", en: "We expect the day to go expensive if we organise well." }
    ]
},
{
    english: "She managed to finish everything before the deadline.",
    correct: { nl: "zij slaagde erin alles af te maken vóór de deadline", en: "She managed to finish everything before the deadline." },
    options: [
        { nl: "zij slaagde erin alles af te maken vóór de deadline", en: "She managed to finish everything before the deadline." },
        { nl: "zij slaagde erin alles af te maken na de deadline", en: "She managed to finish everything after the deadline." },
        { nl: "zij slaagde erin alles erg laat af te maken", en: "She managed to finish everything very late." },
        { nl: "zij slaagde erin alles erg snel af te maken", en: "She managed to finish everything very quickly." }
    ]
},
{
    english: "I recommend discussing the details more carefully next time.",
    correct: { nl: "ik raad aan om de details de volgende keer zorgvuldiger te bespreken", en: "I recommend discussing the details more carefully next time." },
    options: [
        { nl: "ik raad aan om de details de volgende keer zorgvuldiger te bespreken", en: "I recommend discussing the details more carefully next time." },
        { nl: "ik raad aan om de details de volgende keer sneller te bespreken", en: "I recommend discussing the details more quickly next time." },
        { nl: "ik raad aan om de details de volgende keer later te bespreken", en: "I recommend discussing the details later next time." },
        { nl: "ik raad aan om de details de volgende keer thuis te bespreken", en: "I recommend discussing the details at home next time." }
    ]
}
]; // ← CLEAN END OF B2 ARRAY

/* ============================================================
   REDUCED DISRUPTOR SET — 5 PER LEVEL (FIXED DOUBLE-NESTING)
   ============================================================ */
function getDisruptorResponses(level) {
    const disruptors = DISRUPTOR_WORDS[level] || [];
    return disruptors.slice(0, 3).map(d => {
        if (d && typeof d === 'object' && d.nl) {
            return { nl: d.nl, en: d.en || "Incorrect response" };
        }
        return { nl: String(d), en: "Incorrect response" };
    });
}

const DISRUPTORS_A1 = [
    { nl: "Nou, ik zal je iets vertellen.", en: "Well, let me tell you something." },
    { nl: "Nou kijk.", en: "Well, look." },
    { nl: "De waarheid is dat…", en: "The truth is that..." }
];

const DISRUPTORS_A2 = [
    { nl: "Ik denk hier vaak over na.", en: "I often think about this." },
    { nl: "Voordat ik antwoord, zal ik je iets vertellen.", en: "Before answering, let me tell you something." },
    { nl: "Je weet hoe het is.", en: "You know how it is." }
];

const DISRUPTORS_B1 = [
    { nl: "Terwijl ik erover nadenk, zal ik je iets vertellen.", en: "While I think about it, let me tell you something." },
    { nl: "Maar er is meer te zeggen.", en: "However, there's more to say." },
    { nl: "Hierover heb ik een mening.", en: "About this, I have an opinion." }
];

const DISRUPTORS_B2 = [
    { nl: "bovendien", en: "besides" },
    { nl: "daarom", en: "therefore" },
    { nl: "ondanks", en: "despite" },
    { nl: "hoewel", en: "although" },
    { nl: "zelfs", en: "even" }
];

const DISRUPTOR_WORDS = {
    A1: DISRUPTORS_A1,
    A2: DISRUPTORS_A2,
    B1: DISRUPTORS_B1,
    B2: DISRUPTORS_B2
};


/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY & CONVERSATIONAL PHRASE SEARCH
   ============================================================ */

function globalLookup(word) {
    const w = word.toLowerCase();
    const levelsList = ["A1", "A2", "B1", "B2"];

    // Vocabulary lookup
    for (const level of levelsList) {
        const vocab = CEFR_LEVELS[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { dutch: match.dutch, source: "CEFR Vocabulary", level };
        }
    }

    // Sentence lookup
    for (const level of levelsList) {
        const bank = CEFR_SENTENCES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { dutch: match.dutch, source: "CEFR Sentences", level };
        }
    }

    // Dialogue choices lookup
    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { dutch: match.correct.nl, source: "Dialogue Choices", level };
        }
    }

    // Phrase lookup
    if (typeof CEFR_PHRASES !== "undefined") {
        const phraseMatch = CEFR_PHRASES.find(p =>
            p.english && p.english.toLowerCase() === w
        );
        if (phraseMatch) {
            return { dutch: phraseMatch.dutch, source: "CEFR Phrases", level: phraseMatch.level || "GLOBAL" };
        }
    }

    // Listen vocab lookup
    if (typeof LISTEN_VOCAB !== "undefined") {
        const lvMatch = LISTEN_VOCAB.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (lvMatch) {
            return { dutch: lvMatch.dutch, source: "Listen Vocab", level: lvMatch.level || "GLOBAL" };
        }
    }

    // Word dictionary lookup
    if (typeof WORD_DICT !== "undefined" && WORD_DICT[w]) {
        return { dutch: WORD_DICT[w], source: "Word Dictionary", level: "GLOBAL" };
    }

    // Conversation prompts lookup
    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined") {
        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
            const convoMatch = prompts.find(p =>
                p.english && p.english.toLowerCase() === w
            );
            if (convoMatch) {
                return {
                    dutch: convoMatch.dutch,
                    source: "Conversation Prompt",
                    level: convoMatch.level || levelKey
                };
            }
        }
    }

    // Conversation audio lookup
    const convoAudioBanks = [
        CEFR_CONVERSATION_AUDIO_A1,
        CEFR_CONVERSATION_AUDIO_A2,
        CEFR_CONVERSATION_AUDIO_B1,
        CEFR_CONVERSATION_AUDIO_B2
    ];

    for (const bank of convoAudioBanks) {
        if (!bank) continue;
        const audioMatch = bank.find(a =>
            a.english && a.english.toLowerCase() === w
        );
        if (audioMatch) {
            return {
                dutch: audioMatch.dutch,
                source: "Conversation Audio",
                level: audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}

function globalLookupDutch(dutchText) {
    const s = cleanStringForKeyboard(dutchText.toLowerCase().trim());
    const banks = [];

    if (CEFR_LEVELS?.A1) banks.push(...CEFR_LEVELS.A1);
    if (CEFR_LEVELS?.A2) banks.push(...CEFR_LEVELS.A2);
    if (CEFR_LEVELS?.B1) banks.push(...CEFR_LEVELS.B1);
    if (CEFR_LEVELS?.B2) banks.push(...CEFR_LEVELS.B2);

    if (Array.isArray(CEFR_PHRASES)) banks.push(...CEFR_PHRASES);
    if (Array.isArray(LISTEN_VOCAB)) banks.push(...LISTEN_VOCAB);

    if (Array.isArray(CEFR_CONVERSATION_AUDIO_A1)) banks.push(...CEFR_CONVERSATION_AUDIO_A1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_A2)) banks.push(...CEFR_CONVERSATION_AUDIO_A2);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_B1)) banks.push(...CEFR_CONVERSATION_AUDIO_B1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_B2)) banks.push(...CEFR_CONVERSATION_AUDIO_B2);

    // Expected responses
    Object.values(CEFR_CONVERSATION_PROMPTS || {}).forEach(levelArray => {
        if (Array.isArray(levelArray)) {
            levelArray.forEach(prompt => {
                if (Array.isArray(prompt.expected_responses)) {
                    banks.push(...prompt.expected_responses);
                }
            });
        }
    });

    // Inject disruptors
    const levelsList = ["A1", "A2", "B1", "B2"];
    levelsList.forEach(level => {
        const levelDisruptors = getDisruptorResponses(level);
        if (Array.isArray(levelDisruptors)) {
            banks.push(...levelDisruptors);
        }
    });

    for (const item of banks) {
        if (!item) continue;
        const dutchString = typeof item === 'object' ? item.nl || item.dutch : item;
        if (!dutchString) continue;

        if (cleanStringForKeyboard(dutchString.toLowerCase()) === s) {
            return item.en || item.english || "[Unknown translation]";
        }
    }
    return "[Unknown translation]";
}


/**
 * Universal Text Extractor Helper
 * Safely removes multi-nested tracking array patterns to clear all pill errors.
 */
function extractDutchText(item) {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
        if (item.nl && typeof item.nl === 'object') return extractDutchText(item.nl);
        if (item.dutch && typeof item.dutch === 'object') return extractDutchText(item.dutch);
        
        if (item.nl) return item.nl;
        if (item.dutch) return item.dutch;
        if (item.text) return item.text;
        
        const properties = Object.values(item);
        for (const value of properties) {
            if (typeof value === 'string' && !value.includes('[object')) return value;
            if (typeof value === 'object' && value !== null) {
                const nestedString = extractDutchText(value);
                if (nestedString) return nestedString;
            }
        }
    }
    return String(item);
}

/* ============================================================
   CONVERSATION TAB — MAIN RENDER PIPELINE (PART 2A) — DUTCH VERSION
   ============================================================ */

function shuffle(array) {
    return array
        .map(x => ({ x, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.x);
}

function generateConversationPrompt(level) {
    const pool = CEFR_CONVERSATION_PROMPTS[level];
    const item = pool[Math.floor(Math.random() * pool.length)];

    return {
        prompt_nl: item.prompt_nl,
        prompt_en: item.prompt_en,
        expected: item.expected_responses
    };
}

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    const level = appState.currentLevel;

    if (!CEFR_CONVERSATION_PROMPTS[level]) {
        container.innerHTML = "<p>Geen gespreksprompts beschikbaar voor dit niveau.</p>";
        return;
    }

    convoState.currentPrompt = generateConversationPrompt(level);

    const correctButtons = (convoState.currentPrompt.expected || []).map(exp => {
        const text = extractDutchText(exp);
        return {
            html: `<button class="pill preset-response correct" data-response="${text}">${text}</button>`
        };
    });

    const rawDisruptors = typeof getDisruptorResponses === 'function'
        ? getDisruptorResponses(level)
        : [];

    const disruptorButtons = (Array.isArray(rawDisruptors) ? rawDisruptors : []).map(exp => {
        const text = extractDutchText(exp);
        return {
            html: `<button class="pill preset-response disruptor" data-response="${text}">${text}</button>`
        };
    });

    const allButtons = shuffle([...correctButtons, ...disruptorButtons]);
    const presetButtons = allButtons.map(b => b && b.html ? b.html : "").join("");

    container.innerHTML = `
        <div class="glass-panel convo-card">
            <h2>Gesprek — Niveau ${level}</h2>
            <p>Reageer natuurlijk in het Nederlands.</p>

            <div class="convo-prompt">
                <strong>Nederlands:</strong> ${convoState.currentPrompt.prompt_nl}<br>
                <strong>Engels:</strong> ${convoState.currentPrompt.prompt_en}
            </div>

            <div class="preset-box">
                ${presetButtons}
            </div>

            <textarea id="convo-input" class="convo-input" placeholder="Typ hier je reactie..."></textarea>
            
            <div class="sb-controls quiz-controls-tight" style="margin-top:15px; display:flex; gap:8px;">
                <button id="convo-submit" class="pill" style="padding:10px 20px;">Controleren</button>
                <button id="convo-next" class="pill" style="padding:10px 20px;">Volgende</button>
                <button id="convo-reset" class="pill" style="padding:10px 20px;">Reset</button>
            </div>

            <div id="convo-feedback" class="convo-feedback-box"></div>
        </div>
    `;

    setupConversationEvents(convoState.currentPrompt);
}

/* ============================================================
   CONVERSATION EVENTS — SAFETY INSULATED GRADING ENGINE (PART 2B - A)
   ============================================================ */

function setupConversationEvents(convo) {
    const submitBtn = document.getElementById("convo-submit");
    const nextBtn = document.getElementById("convo-next");
    const resetBtn = document.getElementById("convo-reset");
    const feedback = document.getElementById("convo-feedback");
    const textarea = document.getElementById("convo-input");

    if (!submitBtn || !nextBtn || !resetBtn || !feedback || !textarea) {
        console.warn("Required conversation elements are missing from the DOM.");
        return;
    }

    // Bind preset pills
    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            textarea.value = btn.getAttribute("data-response") || btn.dataset.response;
            feedback.innerHTML = "";
        };
    });

    // RESET
    resetBtn.onclick = () => {
        document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
        });
        reloadSameConversation(convo);
    };

    // SUBMIT
    submitBtn.onclick = () => {
        const userText = textarea.value.trim();

        if (!userText) {
            feedback.innerHTML = `<span style="color:#f87171; display:block; margin-top:10px;">Voer eerst een reactie in of selecteer er één.</span>`;
            return;
        }

        let finalScore = 0;
        let expectedNl = "Geen referentietekst gevonden";
        let expectedEn = "Vertaling niet beschikbaar";
        let learnerEnglishTranslation = "[Onbekende vertaling]";

        try {
            let targetSource = convo.expected;
            if (Array.isArray(targetSource) && targetSource.length > 0) {
                targetSource = targetSource[0];
            }

            if (targetSource) {
                expectedNl = typeof targetSource === 'object'
                    ? (targetSource.nl || targetSource.dutch || "")
                    : String(targetSource);

                expectedEn = typeof targetSource === 'object'
                    ? (targetSource.en || targetSource.english || "Vertaling niet beschikbaar")
                    : "Vertaling niet beschikbaar";
            }

            if (typeof globalLookupDutch === "function") {
                learnerEnglishTranslation = globalLookupDutch(userText);
            }

            let isDisruptor = false;
            if (typeof getDisruptorResponses === 'function') {
                const disruptors = getDisruptorResponses(appState.currentLevel || "A1");
                isDisruptor = disruptors.some(d => {
                    const dText = typeof d === 'object'
                        ? (d.nl || d.dutch || "")
                        : String(d);
                    return dText.toLowerCase().trim() === userText.toLowerCase().trim();
                });
            }

            if (isDisruptor) {
                finalScore = 0;
            } else {
                if (typeof scoreConversationResponse === "function") {
                    const correctResponsesOnly = Array.isArray(convo.expected)
                        ? convo.expected
                        : [convo.expected];

                    const result = scoreConversationResponse(userText, correctResponsesOnly);
                    finalScore = result && typeof result.score === "number"
                        ? result.score
                        : 0;
                } else {
                    const userWords = userText.toLowerCase().split(/\s+/);
                    const matchWords = expectedNl.toLowerCase().split(/\s+/);
                    const matches = userWords.filter(w => matchWords.includes(w)).length;
                    finalScore = matchWords.length > 0
                        ? Math.round((matches / matchWords.length) * 100)
                        : 0;
                }
            }

        } catch (error) {
            console.error("Crash in evaluation loop:", error);
            const userWords = userText.toLowerCase().split(/\s+/);
            const matches = userWords.filter(w => expectedNl.toLowerCase().includes(w)).length;
            finalScore = userWords.length > 0
                ? Math.min(Math.round((matches / userWords.length) * 100), 100)
                : 0;
        }

        feedback.innerHTML = `
            <div style="margin-top:10px;">
                <strong>Score:</strong> ${finalScore}%<br>
                <strong>Jouw reactie:</strong> ${userText}<br>
                <strong>Vertaling:</strong> ${learnerEnglishTranslation}<br>
                <strong>Verwacht Nederlands:</strong> ${expectedNl}<br>
                <strong>Verwacht Engels:</strong> ${expectedEn}
            </div>
        `;

        appState.levelStats[appState.currentLevel].conversationCompleted++;
        updateBadges();
        updateProgressMeters();
        saveState();
    };

    nextBtn.onclick = () => {
        renderConversationTab();
    };
}
/* ------------------------------------------------------------
   RENDER ENGINE — GUARANTEED VISUAL INJECTION (DUTCH VERSION)
   ------------------------------------------------------------ */
let verdictHTML = "";
let borderGradientColor = "rgba(148, 163, 184, 0.2)";
let matchStatus = "incorrect";
let baseXP = 0;
let baseScore = 0;
let bonusText = "";

if (finalScore >= 70 && learnerEnglishTranslation !== "[Unknown translation]") {
    matchStatus = "correct";
    borderGradientColor = "rgba(74, 222, 128, 0.4)"; // Groen

    if (finalScore === 100) {
        baseXP = 40;
        baseScore = 30;
        bonusText = " — 💎 100% Perfecte Match! ⚡";
    } else {
        baseXP = 25;
        baseScore = 20;
    }

    verdictHTML = `<span style="color:#4ade80; font-weight:600; font-size:1.1rem;">Correct! 🎉 (+${baseXP} XP)${bonusText}</span>`;

    if (typeof speakDutch === "function") speakDutch(userText);
} else if (finalScore >= 40 && finalScore < 70) {
    matchStatus = "partial";
    borderGradientColor = "rgba(251, 146, 60, 0.5)"; // Oranje
    baseXP = 10;
    baseScore = 5;

    verdictHTML = `<span style="color:#fb923c; font-weight:600; font-size:1.1rem;">Gedeeltelijke Match! ⚠️ (+10 XP)</span>`;

    if (typeof audioContextPlayback === "function") audioContextPlayback("partial");
} else {
    matchStatus = "incorrect";
    borderGradientColor = "rgba(248, 113, 113, 0.4)"; // Rood

    verdictHTML = `<span style="color:#f87171; font-weight:600; font-size:1.1rem;">Onjuist. ✖ (0 XP)</span>`;

    if (typeof audioContextPlayback === "function") audioContextPlayback("incorrect");
}

// Lock options
document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.6";
});

// Render feedback
feedback.innerHTML = `
    <div class="convo-result" style="margin-top: 15px; padding: 12px; background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px solid ${borderGradientColor};">
        ${verdictHTML}
        <br><br>
        <strong>Jouw reactie:</strong> ${userText}<br>
        <strong>Jouw Engelse vertaling:</strong> <span style="color: #a5f3fc;">"${learnerEnglishTranslation}"</span><br><br>
        <strong>Score:</strong> <span style="color: ${matchStatus === 'correct' ? '#4ade80' : (matchStatus === 'partial' ? '#fb923c' : '#f87171')}">${finalScore}%</span><br>
        <strong>Verwacht Nederlands:</strong> ${expectedNl} (${expectedEn})
    </div>
`;

// Rewards
if (typeof processConversationRewards === "function") {
    try {
        processConversationRewards(matchStatus, baseXP, baseScore, expectedNl, convo.prompt_nl);
    } catch (e) {
        console.error("Error updating scores/badges storage counters:", e);
    }
}

nextBtn.onclick = () => renderConversationTab();


/* ============================================================
   CONVERSATION RUNTIME — STORAGE MANAGEMENT & SCENE RELOADS (PART 2B - B)
   ============================================================ */

function processConversationRewards(matchStatus, baseXP, baseScore, expectedNl, promptNlRaw) {
    if (!appState.levelStats[appState.currentLevel]) {
        appState.levelStats[appState.currentLevel] = { conversationCompleted: 0 };
    }

    appState.levelStats[appState.currentLevel].conversationCompleted++;

    if (matchStatus === "correct") {
        appState.totalXP = (appState.totalXP || 0) + baseXP;
        appState.globalScore = (appState.globalScore || 0) + baseScore;
        if (typeof checkAndAdvanceStreak === "function") checkAndAdvanceStreak();
    } else if (matchStatus === "partial") {
        appState.totalXP = (appState.totalXP || 0) + baseXP;
        appState.globalScore = (appState.globalScore || 0) + baseScore;
    } else {
        const promptNlClean = promptNlRaw || "Gespreksprompt";
        const mistakeString = `${promptNlClean} ➔ ${expectedNl}`;

        const cleanMistakeEntry = mistakeString.trim();
        const alreadyLogged =
            Array.isArray(window.reviewList) &&
            window.reviewList.some(item => item.trim() === cleanMistakeEntry);

        if (!alreadyLogged && typeof addIncorrectWord === "function") {
            addIncorrectWord(cleanMistakeEntry);
        }
    }

    if (typeof updateBadges === "function") updateBadges();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
    saveState();
}

function reloadSameConversation(convo) {
    const presetBox = document.querySelector("#conversation-content .preset-box");
    const inputBox = document.querySelector("#conversation-content #convo-input");
    const feedbackBox = document.querySelector("#conversation-content #convo-feedback");

    if (!presetBox || !inputBox || !feedbackBox) {
        console.warn("Conversation UI elements missing — aborting scene reset.");
        return;
    }

    const correct = convo.expected.map(exp => {
        const text = extractDutchText(exp);
        return { html: `<button class="pill preset-response correct" data-response="${text}">${text}</button>` };
    });

    const disruptors = getDisruptorResponses(appState.currentLevel).map(exp => {
        const text = extractDutchText(exp);
        return { html: `<button class="pill preset-response disruptor" data-response="${text}">${text}</button>` };
    });

    const allButtons = shuffle([...correct, ...disruptors]);
    const presetButtons = allButtons.map(b => b && b.html ? b.html : "").join("");

    presetBox.innerHTML = presetButtons;
    inputBox.value = "";
    feedbackBox.innerHTML = "";

    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            inputBox.value = btn.getAttribute("data-response") || btn.dataset.response;
        };
    });
}


/* ============================================================
   AUDIO FEEDBACK (unchanged)
   ============================================================ */

function audioContextPlayback(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "partial") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } else {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.stop(ctx.currentTime + 0.4);
        }
    } catch (e) {
        console.warn("WebAudio player stalled:", e);
    }
}

const CEFR_CONVERSATION_PROMPTS = {

    A1: [
        {
            prompt_nl: "Wat zou je graag drinken?",
            prompt_en: "What would you like to drink?",
            expected_responses: [
                { nl: "ik wil water alstublieft", en: "I want water please" },
                { nl: "ik zou graag een bier willen", en: "I would like a beer" },
                { nl: "ik wil koffie", en: "I want coffee" }
            ]
        },
        {
            prompt_nl: "Hoe gaat het vandaag met je?",
            prompt_en: "How are you today?",
            expected_responses: [
                { nl: "ik ben blij", en: "I am happy" },
                { nl: "het gaat goed, dank je", en: "I am good, thank you" },
                { nl: "ik ben moe", en: "I am tired" }
            ]
        },
        {
            prompt_nl: "Waar woon je?",
            prompt_en: "Where do you live?",
            expected_responses: [
                { nl: "ik woon in het huis", en: "I live in the house" },
                { nl: "ik woon dichtbij het hotel", en: "I live near the hotel" },
                { nl: "ik woon met mijn familie", en: "I live with my family" }
            ]
        },
        {
            prompt_nl: "Wat wil je eten?",
            prompt_en: "What do you want to eat?",
            expected_responses: [
                { nl: "ik wil kip", en: "I want chicken" },
                { nl: "ik wil een salade", en: "I want a salad" },
                { nl: "ik wil soep", en: "I want soup" }
            ]
        },
        {
            prompt_nl: "Heb je honger?",
            prompt_en: "Are you hungry?",
            expected_responses: [
                { nl: "ja, ik heb honger", en: "Yes, I'm hungry" },
                { nl: "ik heb geen honger", en: "I'm not hungry" },
                { nl: "ik heb een beetje honger", en: "I'm a little hungry" }
            ]
        },
        {
            prompt_nl: "Wat doe je graag?",
            prompt_en: "What do you like to do?",
            expected_responses: [
                { nl: "ik lees graag boeken", en: "I like reading books" },
                { nl: "ik luister graag naar muziek", en: "I like listening to music" },
                { nl: "ik kook graag", en: "I like cooking" }
            ]
        },
        {
            prompt_nl: "Hoe laat sta je op?",
            prompt_en: "What time do you get up?",
            expected_responses: [
                { nl: "ik sta vroeg op", en: "I get up early" },
                { nl: "ik sta laat op", en: "I get up late" },
                { nl: "ik sta om zeven uur op", en: "I get up at seven" }
            ]
        },
        {
            prompt_nl: "Wil je vandaag uitgaan?",
            prompt_en: "Do you want to go out today?",
            expected_responses: [
                { nl: "ja, ik wil uitgaan", en: "Yes, I want to go out" },
                { nl: "ik wil niet uitgaan", en: "I don't want to go out" },
                { nl: "ik wil later uitgaan", en: "I want to go out later" }
            ]
        },
        {
            prompt_nl: "Wat ben je aan het doen?",
            prompt_en: "What are you doing?",
            expected_responses: [
                { nl: "ik leer Nederlands", en: "I am learning Dutch" },
                { nl: "ik ben aan het koken", en: "I am cooking" },
                { nl: "ik kijk televisie", en: "I am watching TV" }
            ]
        },
        {
            prompt_nl: "Wil je een film kijken?",
            prompt_en: "Do you want to watch a movie?",
            expected_responses: [
                { nl: "ja, ik wil een film kijken", en: "Yes, I want to watch a movie" },
                { nl: "ik wil geen televisie kijken", en: "I don't want to watch TV" },
                { nl: "ik wil een nieuwe film kijken", en: "I want to watch a new movie" }
            ]
        },
        {
            prompt_nl: "Waar is de badkamer?",
            prompt_en: "Where is the bathroom?",
            expected_responses: [
                { nl: "het is dichtbij", en: "It is near" },
                { nl: "het is op het station", en: "It is in the station" },
                { nl: "het is in het huis", en: "It is in the house" }
            ]
        },
        {
            prompt_nl: "Welke muziek vind je leuk?",
            prompt_en: "What music do you like?",
            expected_responses: [
                { nl: "ik vind muziek leuk", en: "I like music" },
                { nl: "ik luister graag naar muziek", en: "I like listening to music" },
                { nl: "ik vind nieuwe muziek leuk", en: "I like new music" }
            ]
        },
        {
            prompt_nl: "Wil je uitrusten?",
            prompt_en: "Do you want to rest?",
            expected_responses: [
                { nl: "ja, ik wil uitrusten", en: "Yes, I want to rest" },
                { nl: "ik wil niet uitrusten", en: "I don't want to rest" },
                { nl: "ik wil een beetje uitrusten", en: "I want to rest a little" }
            ]
        },
        {
            prompt_nl: "Wat is er in het huis?",
            prompt_en: "What is in the house?",
            expected_responses: [
                { nl: "er is brood", en: "There is bread" },
                { nl: "er is rijst", en: "There is rice" },
                { nl: "er is kip", en: "There is chicken" }
            ]
        },
        {
            prompt_nl: "Wil je naar het hotel gaan?",
            prompt_en: "Do you want to go to the hotel?",
            expected_responses: [
                { nl: "ja, ik wil naar het hotel gaan", en: "Yes, I want to go to the hotel" },
                { nl: "ik wil niet gaan", en: "I don't want to go" },
                { nl: "ik wil later gaan", en: "I want to go later" }
            ]
        },
        {
            prompt_nl: "Welke fruit vind je lekker?",
            prompt_en: "What fruit do you like?",
            expected_responses: [
                { nl: "ik vind appel lekker", en: "I like apple" },
                { nl: "ik vind sinaasappel lekker", en: "I like orange" },
                { nl: "ik vind banaan lekker", en: "I like banana" }
            ]
        },
        {
            prompt_nl: "Wil je meer leren?",
            prompt_en: "Do you want to learn more?",
            expected_responses: [
                { nl: "ja, ik wil meer leren", en: "Yes, I want to learn more" },
                { nl: "ik wil snel leren", en: "I want to learn fast" },
                { nl: "ik wil leren met muziek", en: "I want to learn with music" }
            ]
        },
        {
            prompt_nl: "Wat kijk je op televisie?",
            prompt_en: "What do you watch on TV?",
            expected_responses: [
                { nl: "ik kijk naar boeken", en: "I look at books" },
                { nl: "ik kijk naar leuke dingen", en: "I watch good things" },
                { nl: "ik kijk naar nieuwe muziekvideo’s", en: "I watch new music videos" }
            ]
        },
        {
            prompt_nl: "Wil je brood met kaas?",
            prompt_en: "Do you want bread with cheese?",
            expected_responses: [
                { nl: "ja, ik wil brood met kaas", en: "Yes, I want bread with cheese" },
                { nl: "ik wil geen brood", en: "I don't want bread" },
                { nl: "ik wil kaas", en: "I want cheese" }
            ]
        },
        {
            prompt_nl: "Waar is je familie?",
            prompt_en: "Where is your family?",
            expected_responses: [
                { nl: "ze zijn thuis", en: "They are at home" },
                { nl: "ze zijn dichtbij", en: "They are near" },
                { nl: "ze zijn op het station", en: "They are at the station" }
            ]
        },
        {
            prompt_nl: "Wil je met de bus gaan?",
            prompt_en: "Do you want to go by bus?",
            expected_responses: [
                { nl: "ja, ik wil met de bus gaan", en: "Yes, I want to go by bus" },
                { nl: "ik wil niet met de bus gaan", en: "I don't want to go by bus" },
                { nl: "ik wil met de trein gaan", en: "I want to go by train" }
            ]
        },
        {
            prompt_nl: "Wat doe je thuis?",
            prompt_en: "What do you do at home?",
            expected_responses: [
                { nl: "ik kook", en: "I cook" },
                { nl: "ik lees boeken", en: "I read books" },
                { nl: "ik kijk televisie", en: "I watch TV" }
            ]
        },
        {
            prompt_nl: "Hallo, heb je je ticket?",
            prompt_en: "Hello, do you have your ticket?",
            expected_responses: [
                { nl: "ja, ik heb je ticket", en: "Yes, I have your ticket" },
                { nl: "ik heb mijn ticket niet", en: "I don't have my ticket" },
                { nl: "ik heb een ticket nodig", en: "I need a ticket" }
            ]
        },
        {
            prompt_nl: "Wat heb je nodig op het station?",
            prompt_en: "What do you need at the station?",
            expected_responses: [
                { nl: "ik heb de bus nodig", en: "I need the bus" },
                { nl: "ik heb de trein nodig", en: "I need the train" },
                { nl: "ik heb mijn vriend nodig", en: "I need my friend" }
            ]
        },
        {
            prompt_nl: "Wil je koffie of thee?",
            prompt_en: "Do you want coffee or tea?",
            expected_responses: [
                { nl: "ik wil warme koffie", en: "I want hot coffee" },
                { nl: "ik wil koude thee", en: "I want cold tea" },
                { nl: "ik wil geen koffie", en: "I don't want coffee" }
            ]
        },
        {
            prompt_nl: "Wie is zij?",
            prompt_en: "Who is she?",
            expected_responses: [
                { nl: "zij is mijn moeder", en: "She is my mother" },
                { nl: "zij is mijn zus", en: "She is my sister" },
                { nl: "zij is mijn vriendin", en: "She is my friend (female)" }
            ]
        },

{
    prompt_nl: "Wie is hij?",
    prompt_en: "Who is he?",
    expected_responses: [
        { nl: "hij is mijn vader", en: "He is my father" },
        { nl: "hij is mijn zoon", en: "He is my son" },
        { nl: "hij is mijn vriend", en: "He is my friend" }
    ]
},
{
    prompt_nl: "Zijn er problemen met het vervoer?",
    prompt_en: "Are there problems with the transport?",
    expected_responses: [
        { nl: "er zijn vandaag geen problemen", en: "There are no problems today" },
        { nl: "ja, er zijn problemen met de trein", en: "Yes, there are problems with the train" },
        { nl: "de bus is langzaam", en: "The bus is slow" }
    ]
},
{
    prompt_nl: "Wat wil je vandaag leren?",
    prompt_en: "What do you want to learn today?",
    expected_responses: [
        { nl: "ik wil leren koken", en: "I want to learn to cook" },
        { nl: "ik wil leren schrijven", en: "I want to learn to write" },
        { nl: "ik wil meer leren", en: "I want to learn more" }
    ]
},
{
    prompt_nl: "Wil je vandaag biefstuk eten?",
    prompt_en: "Do you want to eat steak today?",
    expected_responses: [
        { nl: "ja, met frietjes", en: "Yes, with french fries" },
        { nl: "ik wil vandaag geen biefstuk", en: "I don't want steak today" },
        { nl: "ik wil warme soep", en: "I want hot soup" }
    ]
},
{
    prompt_nl: "Waar is de school?",
    prompt_en: "Where is the school?",
    expected_responses: [
        { nl: "de school is dichtbij", en: "The school is near" },
        { nl: "het is dichtbij het hotel", en: "It is near the hotel" },
        { nl: "het is niet dichtbij", en: "It is not near" }
    ]
},
{
    prompt_nl: "Heb je melk of bier thuis?",
    prompt_en: "Do you have milk or beer at home?",
    expected_responses: [
        { nl: "ik heb melk en brood", en: "I have milk and bread" },
        { nl: "ik heb koude bier", en: "I have cold beer" },
        { nl: "ik heb geen bier thuis", en: "I don't have beer at home" }
    ]
},
{
    prompt_nl: "Hoe laat ga je werken?",
    prompt_en: "What hour do you go to work?",
    expected_responses: [
        { nl: "ik ga vroeg", en: "I go early" },
        { nl: "ik ga vandaag laat", en: "I go late today" },
        { nl: "ik ga vandaag niet werken", en: "I don't go to work today" }
    ]
},
{
    prompt_nl: "Hoe gaat het met je oma?",
    prompt_en: "How is your grandmother?",
    expected_responses: [
        { nl: "mijn oma is heel blij", en: "His grandmother is very happy" },
        { nl: "zij is goed, dank je", en: "She is well, thank you" },
        { nl: "zij is vandaag moe", en: "She is tired today" }
    ]
},
{
    prompt_nl: "Wil je nieuwe muziek luisteren?",
    prompt_en: "Do you want to listen to new music?",
    expected_responses: [
        { nl: "ja, ik hou van muziek", en: "Yes, I like music" },
        { nl: "ik wil geen muziek luisteren", en: "I don't want to listen to music" },
        { nl: "ik wil luisteren met mijn vriend", en: "I want to listen with my friend" }
    ]
},
{
    prompt_nl: "Wat moet je vandaag schoonmaken?",
    prompt_en: "What do you need to clean today?",
    expected_responses: [
        { nl: "ik moet het huis schoonmaken", en: "I need to clean the house" },
        { nl: "ik moet de badkamer schoonmaken", en: "I need to clean the bathroom" },
        { nl: "ik hoef vandaag niet schoon te maken", en: "I don't need to clean today" }
    ]
},
{
    prompt_nl: "Vind je nieuwe boeken leuk?",
    prompt_en: "Do you like new books?",
    expected_responses: [
        { nl: "ja, ik lees graag veel", en: "Yes, I like reading a lot" },
        { nl: "ik hou niet van boeken", en: "I don't like books" },
        { nl: "ik wil een boek schrijven", en: "I want to write a book" }
    ]
},
{
    prompt_nl: "Is er fruit op de tafel?",
    prompt_en: "Is there fruit on the table?",
    expected_responses: [
        { nl: "er is appel en sinaasappel", en: "There is apple and orange" },
        { nl: "er is een goede banaan", en: "There is a good banana" },
        { nl: "er is vandaag geen fruit", en: "There is no fruit today" }
    ]
},
{
    prompt_nl: "Wil je rijst met bonen?",
    prompt_en: "Do you want rice with beans?",
    expected_responses: [
        { nl: "ja, met een beetje kaas", en: "Yes, with a little cheese" },
        { nl: "ik wil rijst zonder bonen", en: "I want rice without beans" },
        { nl: "ik wil vandaag geen rijst", en: "I don't want rice today" }
    ]
},
{
    prompt_nl: "Goedemorgen, ben je klaar?",
    prompt_en: "Good morning, are you ready?",
    expected_responses: [
        { nl: "goedemorgen, ja ik ben klaar", en: "Good morning, yes I am ready" },
        { nl: "ik ben vandaag niet klaar", en: "I am not ready today" },
        { nl: "ik heb meer tijd nodig alstublieft", en: "I need more time please" }
    ]
},
{
    prompt_nl: "Wanneer ga je naar het vliegveld?",
    prompt_en: "When do you go to the airport?",
    expected_responses: [
        { nl: "ik ga nu", en: "I am going now" },
        { nl: "ik ga vandaag vroeg", en: "I am going early today" },
        { nl: "ik ga later met de bus", en: "I am going by bus later" }
    ]
},
{
    prompt_nl: "Vind je deze nieuwe plek leuk?",
    prompt_en: "Do you like this new place?",
    expected_responses: [
        { nl: "ja, de plek is heel goed", en: "Yes, the place is very good" },
        { nl: "ik vind deze plek niet leuk", en: "I don't like this place" },
        { nl: "het is een kleine plek", en: "It is a small place" }
    ]
},
{
    prompt_nl: "Wil je een biefstuk met frietjes?",
    prompt_en: "Do you want a steak with french fries?",
    expected_responses: [
        { nl: "ja, met een beetje zout", en: "Yes, with a little salt" },
        { nl: "nee, ik wil een salade", en: "No, I want a salad" },
        { nl: "ik wil biefstuk zonder frietjes", en: "I want steak without fries" }
    ]
},
{
    prompt_nl: "Hoe laat stopt de televisie?",
    prompt_en: "What hour does the television finish?",
    expected_responses: [
        { nl: "het stopt om tien uur", en: "It finishes at ten" },
        { nl: "het stopt over een uur", en: "It finishes in an hour" },
        { nl: "ik kijk vandaag geen televisie", en: "I don't watch TV today" }
    ]
},
{
    prompt_nl: "Welke fruit is er in het huis?",
    prompt_en: "What fruit is there in the house?",
    expected_responses: [
        { nl: "er is appel en banaan", en: "There is apple and banana" },
        { nl: "er is zoete sinaasappel", en: "There is sweet orange" },
        { nl: "er is hier geen fruit", en: "There is no fruit here" }
    ]
},
{
    prompt_nl: "Waar is het treinstation?",
    prompt_en: "Where is the train station?",
    expected_responses: [
        { nl: "het station is dichtbij", en: "The station is near" },
        { nl: "het is dichtbij de school", en: "It is near the school" },
        { nl: "het is ver van het hotel", en: "It is far from the hotel" }
    ]
},
{
    prompt_nl: "Wil je muziek luisteren met je vriend?",
    prompt_en: "Do you want to listen to music with your friend?",
    expected_responses: [
        { nl: "ja, ik luister graag naar muziek", en: "Yes, I like to listen to music" },
        { nl: "nee, ik wil een boek lezen", en: "No, I want to read a book" },
        { nl: "mijn vriend is niet hier", en: "My friend is not here" }
    ]
},
{
    prompt_nl: "Wat moet je vandaag doen?",
    prompt_en: "What do you need to do today?",
    expected_responses: [
        { nl: "ik moet meer werken", en: "I need to work more" },
        { nl: "ik moet Nederlands studeren", en: "I need to study Dutch" },
        { nl: "ik wil thuis uitrusten", en: "I want to rest at home" }
    ]
},
{
    prompt_nl: "Heb je problemen met de bus?",
    prompt_en: "Do you have problems with the bus?",
    expected_responses: [
        { nl: "er zijn vandaag geen problemen", en: "There are no problems today" },
        { nl: "ja, de bus is langzaam", en: "Yes, the bus is slow" },
        { nl: "ik wil met de trein gaan", en: "I want to go by train" }
    ]
},
{
    prompt_nl: "Vind je het leuk om warm eten te koken?",
    prompt_en: "Do you like to cook hot food?",
    expected_responses: [
        { nl: "ja, ik kook soep en kip", en: "Yes, I cook soup and chicken" },
        { nl: "nee, ik hou van koude fruit", en: "No, I like cold fruit" },
        { nl: "ik wil leren koken", en: "I want to learn to cook" }
    ]
}
],
A2: [
    {
        prompt_nl: "Wat wil je voor het ontbijt?",
        prompt_en: "What do you want for breakfast?",
        expected_responses: [
            { nl: "ik wil ei, brood en koffie", en: "I want egg, bread and coffee" },
            { nl: "normaal gesproken geef ik de voorkeur aan koude fruit", en: "Normally I prefer cold fruit" },
            { nl: "een vroeg ontbijt, alstublieft", en: "An early breakfast, please" }
        ]
    },
    {
        prompt_nl: "Hoe laat is het avondeten vandaag?",
        prompt_en: "What time is dinner today?",
        expected_responses: [
            { nl: "het avondeten is laat vandaag", en: "Dinner is late today" },
            { nl: "het is over twintig minuten", en: "It is in twenty minutes" },
            { nl: "ik wil nu het avondeten koken", en: "I want to cook dinner now" }
        ]
    },
    {
        prompt_nl: "Waarom kom je laat aan?",
        prompt_en: "Why are you arriving late?",
        expected_responses: [
            { nl: "de bus is langzaam vandaag", en: "The bus is slow today" },
            { nl: "omdat ik problemen had met de auto", en: "Because I had problems with the car" },
            { nl: "sorry, de reis is moeilijk", en: "I am sorry, the trip is difficult" }
        ]
    },
    {
        prompt_nl: "Heb je het huiswerk van school afgemaakt?",
        prompt_en: "Did you finish the school homework?",
        expected_responses: [
            { nl: "ja, ik heb het huiswerk al afgemaakt", en: "Yes, I already finished the homework" },
            { nl: "ik heb nog meer minuten nodig", en: "I still need more minutes" },
            { nl: "nee, het huiswerk is heel moeilijk", en: "No, the homework is very difficult" }
        ]
    },
    {
        prompt_nl: "Heb je mijn bericht gisteravond gelezen?",
        prompt_en: "Did you read my message last night?",
        expected_responses: [
            { nl: "ja, ik las je bericht gisteravond", en: "Yes, I read your message last night" },
            { nl: "nee, ik vergat televisie te kijken", en: "No, I forgot to look at the television" },
            { nl: "ik ontving de informatie nu", en: "I received the information now" }
        ]
    },
    {
        prompt_nl: "Wil je nu een film kijken?",
        prompt_en: "Do you want to watch a movie now?",
        expected_responses: [
            { nl: "ja, de film is nieuw", en: "Yes, the movie is new" },
            { nl: "eerst wil ik de keuken schoonmaken", en: "Before I want to clean the kitchen" },
            { nl: "nee, het is te laat om een film te kijken", en: "No, it is very late to watch a movie" }
        ]
    },
    {
        prompt_nl: "Kun je het keukenraam openen?",
        prompt_en: "Can you open the kitchen window?",
        expected_responses: [
            { nl: "ja, de keuken is heel warm", en: "Yes, the kitchen is very hot" },
            { nl: "ik kan het raam nu niet openen", en: "I cannot open the window now" },
            { nl: "het raam is kapot", en: "The window is broken" }
        ]
    },
    {
        prompt_nl: "Wil je nieuwe schoenen kopen?",
        prompt_en: "Do you want to buy new shoes?",
        expected_responses: [
            { nl: "ja, ik heb schoenen nodig voor de reis", en: "Yes, I need shoes for the trip" },
            { nl: "nee, mijn kleine schoenen zijn goed", en: "No, my small shoes are good" },
            { nl: "ik wil deze zwarte schoenen proberen", en: "I want to try these black shoes" }
        ]
    },
    {
        prompt_nl: "Wanneer reis je met het vliegtuig?",
        prompt_en: "When do you travel by plane?",
        expected_responses: [
            { nl: "het vliegtuig vertrekt over vijftien minuten", en: "The plane leaves in fifteen minutes" },
            { nl: "ik reis vroeg in de ochtend", en: "I travel early in the morning" },
            { nl: "ik wacht nog steeds op mijn vliegticket", en: "I am still waiting for my plane ticket" }
        ]
    },
    {
        prompt_nl: "Ga je je ouders bezoeken?",
        prompt_en: "Are you going to visit your parents?",
        expected_responses: [
            { nl: "ja, ik ga mijn ouders vandaag bezoeken", en: "Yes, I am going to visit my parents today" },
            { nl: "ik bezoek hen vaak in hun huis", en: "Often I visit them at their house" },
            { nl: "nee, ze zijn nu op reis", en: "No, they are on a trip now" }
        ]
    },
    {
        prompt_nl: "Heb je vervoer nodig om naar het hotel te gaan?",
        prompt_en: "Do you need transport to go to the hotel?",
        expected_responses: [
            { nl: "ja, ik heb nu snel vervoer nodig", en: "Yes, I need fast transport now" },
            { nl: "nee, het hotel is heel dichtbij", en: "No, the hotel is very near" },
            { nl: "ik rijd liever met mijn auto naar het hotel", en: "I prefer to drive my car to the hotel" }
        ]
    },
    {
        prompt_nl: "Wanneer komt de trein aan op het station?",
        prompt_en: "When does the train arrive at the station?",
        expected_responses: [
            { nl: "de trein komt over elf minuten aan", en: "The train arrives in eleven minutes" },
            { nl: "normaal komt hij vroeg aan", en: "Normally it arrives early" },
            { nl: "hij is al aangekomen op het station", en: "It already arrived at the station" }
        ]
    },
    {
        prompt_nl: "Wil je nu met mij lunchen?",
        prompt_en: "Do you want to have lunch with me now?",
        expected_responses: [
            { nl: "ja, ik heb veel honger", en: "Yes, I am very hungry" },
            { nl: "eerst moet ik mijn huiswerk afmaken", en: "Before I need to finish my homework" },
            { nl: "sorry, het is te laat om te lunchen", en: "I am sorry, it is very late to have lunch" }
        ]
    },
    {
        prompt_nl: "Ben je het bericht gisteravond vergeten?",
        prompt_en: "Did you forget the message last night?",
        expected_responses: [
            { nl: "ja, ik vergat het bericht gisteravond te lezen", en: "Yes, I forgot to read the message last night" },
            { nl: "nee, ik heb de informatie hier", en: "No, I have the information here" },
            { nl: "ik ontving je bericht niet", en: "I did not receive your message" }
        ]
    },
    {
        prompt_nl: "Hoeveel minuten heb je nodig om klaar te zijn?",
        prompt_en: "How many minutes do you need to be ready?",
        expected_responses: [
            { nl: "ik heb twaalf minuten meer nodig", en: "I need twelve minutes more" },
            { nl: "ik ben al klaar om uit te gaan", en: "I am already ready to go out" },
            { nl: "wacht vijftien minuten alstublieft", en: "Wait fifteen minutes please" }
        ]
    },
    {
        prompt_nl: "Rijd je graag 's nachts?",
        prompt_en: "Do you like to drive at night?",
        expected_responses: [
            { nl: "nee, ik rijd liever in de middag", en: "No, I prefer to drive in the afternoon" },
            { nl: "vaak rijd ik vroeg", en: "Often I drive early" },
            { nl: "ja, de weg is nu duidelijk", en: "Yes, the road is clear now" }
        ]
    },
    {
        prompt_nl: "Wat moet je in het huis repareren?",
        prompt_en: "What do you need to fix in the house?",
        expected_responses: [
            { nl: "ik moet het grote raam repareren", en: "I need to fix the big window" },
            { nl: "ik wil vandaag de keuken repareren", en: "I want to fix the kitchen today" },
            { nl: "ik heb de nieuwe televisie al gerepareerd", en: "I already fixed the new television" }
        ]
    },
    {
        prompt_nl: "Wanneer ga je het hotel verlaten?",
        prompt_en: "When are you going to leave the hotel?",
        expected_responses: [
            { nl: "ik wil vroeg in de ochtend vertrekken", en: "I want to leave early in the morning" },
            { nl: "ik vertrek over dertien minuten", en: "I am leaving in thirteen minutes" },
            { nl: "ik moet nog steeds op mijn vervoer wachten", en: "I still need to wait for my transport" }
        ]
    },
    {
        prompt_nl: "Hoeveel bustickets heb je?",
        prompt_en: "How many bus tickets do you have?",
        expected_responses: [
            { nl: "ik heb veertien nieuwe tickets", en: "I have fourteen new tickets" },
            { nl: "ik heb alleen twaalf tickets voor de familie", en: "I only have twelve tickets for the family" },
            { nl: "ik moet nog een kaartje kopen", en: "I need to buy another entry" }
        ]
    },
    {
        prompt_nl: "Wil je dit nieuwe eten proberen?",
        prompt_en: "Do you want to try this new food?",
        expected_responses: [
            { nl: "ja, ik wil graag de biefstuk proberen", en: "Yes, I would like to try the steak" },
            { nl: "nee, ik geef de voorkeur aan mijn gewone ontbijt", en: "No, I prefer my usual breakfast" },
            { nl: "omdat ik al rijst met bonen heb gegeten", en: "Because I already ate rice with beans" }
        ]
    },
    {
        prompt_nl: "Heb je informatie over de reis?",
        prompt_en: "Do you have information about the trip?",
        expected_responses: [
            { nl: "ja, ik heb de informatie al hier", en: "Yes, I already have the information here" },
            { nl: "ik wacht nog steeds op het bericht van mijn vriend", en: "I am still waiting for my friend's message" },
            { nl: "nee, ik vergat te vragen op het station", en: "No, I forgot to ask at the station" }
        ]
    },
{
    prompt_nl: "Hoe laat komt je vriend aan?",
    prompt_en: "What time does your friend arrive?",
    expected_responses: [
        { nl: "hij komt over zestien minuten aan", en: "He arrives in sixteen minutes" },
        { nl: "normaal komt hij vroeg voor de lunch", en: "Normally he arrives early for lunch" },
        { nl: "hij komt laat omdat de trein langzaam is", en: "Arriving late because the train is slow" }
    ]
},
{
    prompt_nl: "Wil je vandaag in het hotel dineren?",
    prompt_en: "Do you want to have dinner at the hotel today?",
    expected_responses: [
        { nl: "ja, het hotelavondeten is goed", en: "Yes, the hotel dinner is good" },
        { nl: "eerst wil ik mijn ouders bezoeken", en: "Before I want to visit my parents" },
        { nl: "nee, ik kook liever thuis", en: "No, I prefer to cook at my house" }
    ]
},
{
    prompt_nl: "Hoeveel minuten duurt de film?",
    prompt_en: "How many minutes does the movie last?",
    expected_responses: [
        { nl: "de film duurt twintig minuten meer", en: "The movie lasts twenty minutes more" },
        { nl: "vandaag eindigt hij vroeg", en: "Finishing early today" },
        { nl: "er zijn nog zeventien minuten over", en: "There are still seventeen minutes left" }
    ]
},
{
    prompt_nl: "Heb je het keukenraam schoongemaakt?",
    prompt_en: "Did you clean the kitchen window?",
    expected_responses: [
        { nl: "ja, het raam is nu schoon", en: "Yes, the window is clean now" },
        { nl: "nee, ik vergat de keuken schoon te maken", en: "No, I forgot to clean the kitchen" },
        { nl: "ik wil eerst het raam repareren", en: "Before, I want to fix the window" }
    ]
},
{
    prompt_nl: "Hoeveel nieuwe schoenen heb je?",
    prompt_en: "How many new shoes do you have?",
    expected_responses: [
        { nl: "ik heb achttien schoenen in mijn huis", en: "I have eighteen shoes at my house" },
        { nl: "ik heb maar één nieuw paar", en: "I only have one new pair" },
        { nl: "ik moet schoenen kopen voor de reis", en: "I need to buy shoes for the trip" }
    ]
},
{
    prompt_nl: "Wil je hier op de bus wachten?",
    prompt_en: "Do you want to wait for the bus here?",
    expected_responses: [
        { nl: "ja, het vervoer is vandaag laat", en: "Yes, the transport is late today" },
        { nl: "nee, ik ga liever nu naar het vliegveld", en: "No, I prefer to go to the airport now" },
        { nl: "het is beter om op het station te wachten", en: "It is better to wait at the station" }
    ]
},
{
    prompt_nl: "Waarom kocht je veertien appels?",
    prompt_en: "Why did you buy fourteen apples?",
    expected_responses: [
        { nl: "omdat mijn familie veel fruit eet", en: "Because my family eats a lot of fruit" },
        { nl: "om een groot ontbijt te maken", en: "To prepare a big breakfast" },
        { nl: "ik ben al vergeten waarom ik ze kocht", en: "I already forgot why I bought them" }
    ]
},
{
    prompt_nl: "Reis je graag met het vliegtuig?",
    prompt_en: "Do you like to travel by plane?",
    expected_responses: [
        { nl: "ja, de vliegreis is snel", en: "Yes, the trip by plane is fast" },
        { nl: "nee, ik geef de voorkeur aan de trein of de bus", en: "No, I prefer the train or the bus" },
        { nl: "vaak reis ik voor mijn werk", en: "Often I travel for my work" }
    ]
},
{
    prompt_nl: "Heb je negentien treinkaartjes?",
    prompt_en: "Do you have nineteen train tickets?",
    expected_responses: [
        { nl: "ja, ik heb negentien kaartjes klaar", en: "Yes, I have nineteen tickets ready" },
        { nl: "nee, ik heb maar vijftien kaartjes", en: "No, I only have fifteen tickets" },
        { nl: "ik heb er twintig nodig voor de groep", en: "I need twenty for the group" }
    ]
},
{
    prompt_nl: "Wanneer ga je je familie bezoeken?",
    prompt_en: "When are you going to visit your family?",
    expected_responses: [
        { nl: "normaal bezoek ik hen vroeg", en: "Normally I visit them early" },
        { nl: "ik ga nu met de trein", en: "I am going to go now by train" },
        { nl: "morgen, want vandaag heb ik huiswerk", en: "Tomorrow because today I have homework" }
    ]
},
{
    prompt_nl: "Heb je een bericht op mijn telefoon achtergelaten?",
    prompt_en: "Did you leave a message on my phone?",
    expected_responses: [
        { nl: "ja, ik stuurde een snel bericht", en: "Yes, I sent a quick message" },
        { nl: "nee, ik vergat je informatie", en: "No, I forgot your information" },
        { nl: "nog niet, ik bel later", en: "Not yet, I will call later" }
    ]
},
{
    prompt_nl: "Welke film wil je op televisie kijken?",
    prompt_en: "What movie do you want to watch on TV?",
    expected_responses: [
        { nl: "ik wil een nieuwe film kijken", en: "I want to watch a new movie" },
        { nl: "ik luister liever nu naar muziek", en: "I prefer to listen to music now" },
        { nl: "elke goede film is perfect", en: "Any good movie is perfect" }
    ]
},
{
    prompt_nl: "Waar kocht je die nieuwe schoenen?",
    prompt_en: "Where did you buy those new shoes?",
    expected_responses: [
        { nl: "ik kocht ze dichtbij het station", en: "I bought them near the station" },
        { nl: "in een kleine winkel in het centrum", en: "In a small place downtown" },
        { nl: "ik ben de naam van de winkel vergeten", en: "I already forgot the name of the store" }
    ]
},
{
    prompt_nl: "Waarom opende je het keukenraam?",
    prompt_en: "Why did you open the kitchen window?",
    expected_responses: [
        { nl: "omdat de keuken heel warm is", en: "Because the kitchen is very hot" },
        { nl: "voordat ik vandaag de keuken schoonmaak", en: "Before cleaning the kitchen today" },
        { nl: "om de tuin een minuut te zien", en: "To see the garden for a minute" }
    ]
},
{
    prompt_nl: "Heb je genoeg informatie voor de reis?",
    prompt_en: "Do you have enough information for the trip?",
    expected_responses: [
        { nl: "ja, ik heb de informatie al klaar", en: "Yes, I already have the information ready" },
        { nl: "ik moet nog steeds op het bericht wachten", en: "I still need to wait for the message" },
        { nl: "nee, de informatie is heel moeilijk", en: "No, the information is very difficult" }
    ]
},
{
    prompt_nl: "Wil je vandaag vroeg dineren?",
    prompt_en: "Do you want to have dinner early today?",
    expected_responses: [
        { nl: "ja, ik wil nu dineren alstublieft", en: "Yes, I want to have dinner now please" },
        { nl: "nee, normaal dineer ik heel laat", en: "No, normally I have dinner very late" },
        { nl: "omdat ik eerst huiswerk moet doen", en: "Because I have to do homework before" }
    ]
},
{
    prompt_nl: "Heb je de auto van je vader gerepareerd?",
    prompt_en: "Did you fix your father's car?",
    expected_responses: [
        { nl: "ja, de auto repareren was makkelijk", en: "Yes, fixing the car was easy" },
        { nl: "ik ben nog steeds de auto aan het repareren", en: "I am still fixing the car" },
        { nl: "nee, de auto is in de werkplaats", en: "No, the car is in the repair shop" }
    ]
},
{
    prompt_nl: "Hoeveel minuten blijven er over om aan te komen?",
    prompt_en: "How many minutes are left to arrive?",
    expected_responses: [
        { nl: "er blijven vijftien minuten over", en: "There are fifteen minutes left to arrive" },
        { nl: "we komen vroeg aan over twaalf minuten", en: "We arrive early in twelve minutes" },
        { nl: "de bus komt vandaag laat aan", en: "The bus arrives late today" }
    ]
},
{
    prompt_nl: "Reis je vaak met het vliegtuig?",
    prompt_en: "Do you often travel by plane?",
    expected_responses: [
        { nl: "vaak reis ik voor mijn werk", en: "Often I travel for my work" },
        { nl: "nee, ik reis liever met een snelle trein", en: "No, I prefer to travel by fast train" },
        { nl: "het is al mijn tweede reis dit jaar", en: "It is already my second trip this year" }
    ]
},

{
    prompt_nl: "Ben je vergeten vandaag de lunch te bereiden?",
    prompt_en: "Did you forget to prepare lunch today?",
    expected_responses: [
        { nl: "ja, ik vergat de lunch vroeg te koken", en: "Yes, I forgot to cook lunch early" },
        { nl: "nee, het eten is in de keuken", en: "No, the food is in the kitchen" },
        { nl: "ik heb al een biefstuk met rijst bereid", en: "I already prepared a steak with rice" }
    ]
},
{
    prompt_nl: "Wil je deze zwarte schoenen proberen?",
    prompt_en: "Do you want to try these black shoes?",
    expected_responses: [
        { nl: "ja, ik wil de nieuwe schoenen proberen", en: "Yes, I want to try the new shoes" },
        { nl: "nee, mijn oude schoenen zijn goed", en: "No, my old shoes are good" },
        { nl: "de schoenen zijn te klein voor mij", en: "The shoes are small for me" }
    ]
},
{
    prompt_nl: "Waarom wil je nu het hotel verlaten?",
    prompt_en: "Why do you want to leave the hotel now?",
    expected_responses: [
        { nl: "omdat mijn vliegtuig over een uur vertrekt", en: "Because my plane leaves in an hour" },
        { nl: "eerst wil ik het station bezoeken", en: "Before I want to visit the station" },
        { nl: "vroeg vertrekken is een goed idee", en: "Leaving early is a good idea" }
    ]
},
{
    prompt_nl: "Heb je veertien of vijftien kaartjes?",
    prompt_en: "Do you have fourteen or fifteen tickets?",
    expected_responses: [
        { nl: "ik heb veertien kaartjes voor het vervoer", en: "I have fourteen tickets for the transport" },
        { nl: "ik heb vijftien kaartjes voor de familie nodig", en: "I need fifteen tickets for the family" },
        { nl: "ik heb vandaag maar elf kaartjes", en: "I only have eleven tickets today" }
    ]
},
{
    prompt_nl: "Studieer je normaal na het avondeten?",
    prompt_en: "Do you normally study after dinner?",
    expected_responses: [
        { nl: "normaal studeer ik vóór het avondeten", en: "Normally I study before dinner" },
        { nl: "ja, ik studeer elke avond dertig minuten", en: "Yes, I study thirty minutes every night" },
        { nl: "nee, ik kijk liever laat een film", en: "No, I prefer to watch a movie late" }
    ]
},
{
    prompt_nl: "Waar is het raam van je keuken?",
    prompt_en: "Where is the window of your kitchen?",
    expected_responses: [
        { nl: "het is dichtbij de grote deur", en: "It is near the big door" },
        { nl: "het raam opent naar de heldere tuin", en: "The window opens to the clear garden" },
        { nl: "ik vergat het raam nu te sluiten", en: "I forgot to close the window now" }
    ]
},
{
    prompt_nl: "Wil je morgen vroeg ontbijten?",
    prompt_en: "Do you want to have breakfast early tomorrow?",
    expected_responses: [
        { nl: "ja, vroeg ontbijt is goed", en: "Yes, early breakfast is good" },
        { nl: "nee, morgen sta ik liever laat op", en: "No, tomorrow I prefer to get up late" },
        { nl: "ik wil nu brood, melk en fruit", en: "I want bread, milk and fruit now" }
    ]
},
{
    prompt_nl: "Heb je zeventien minuten om te praten?",
    prompt_en: "Do you have seventeen minutes to talk?",
    expected_responses: [
        { nl: "ja, ik heb nu vrije tijd", en: "Yes, I have free time now" },
        { nl: "ik moet nog steeds mijn huiswerk afmaken", en: "I still need to finish my homework" },
        { nl: "sorry, het vervoer komt al aan", en: "I am sorry, the transport is arriving already" }
    ]
},
{
    prompt_nl: "Waarom antwoordde je mijn bericht gisteravond niet?",
    prompt_en: "Why didn't you answer my message last night?",
    expected_responses: [
        { nl: "omdat ik al vroeg sliep", en: "Because I was already sleeping early" },
        { nl: "ik vergat mijn telefoon op school", en: "I forgot my phone at school" },
        { nl: "ik las het bericht vandaag in de ochtend", en: "I read the message today in the morning" }
    ]
},
{
    prompt_nl: "Kwam het vervoer vandaag op tijd aan?",
    prompt_en: "Did the transport arrive on time today?",
    expected_responses: [
        { nl: "ja, de bus kwam heel vroeg aan", en: "Yes, the bus arrived very early" },
        { nl: "nee, de trein kwam twintig minuten te laat", en: "No, the train arrived twenty minutes late" },
        { nl: "ik wacht nog steeds op het station", en: "I am still waiting at the station" }
    ]
},

B1: [
    {
        prompt_nl: "Ben je aan het werk geweest in het nieuwe restaurant?",
        prompt_en: "Have you been working at the new restaurant?",
        expected_responses: [
            { nl: "ja, ik werk daar al een maand", en: "Yes, I have been working there a month" },
            { nl: "nee, ik ben aan het studeren om beter te worden", en: "No, I have been studying to improve" },
            { nl: "nog niet, maar ik wil nu beginnen", en: "Not yet, but I want to start now" }
        ]
    },
    {
        prompt_nl: "Wat heb je geleerd van eerdere ervaringen?",
        prompt_en: "What have you learned from past experiences?",
        expected_responses: [
            { nl: "ik heb geleerd mijn vaardigheden te verbeteren", en: "I have learned to improve my skills" },
            { nl: "ik heb geleerd aandachtig te luisteren", en: "I have learned to listen carefully" },
            { nl: "ik moet de informatie nog steeds bekijken", en: "I still need to review the information" }
        ]
    },
    {
        prompt_nl: "Heeft het restaurant het menu gebracht?",
        prompt_en: "Has the restaurant brought the menu?",
        expected_responses: [
            { nl: "ja, ze hebben het menu naar de tafel gebracht", en: "Yes, they have brought the menu to the table" },
            { nl: "nee, breng alsjeblieft ook de rekening", en: "No, please bring the bill too" },
            { nl: "ik wil het menu begrijpen voordat ik eet", en: "I want to understand the menu before eating" }
        ]
    },
    {
        prompt_nl: "Waar heb je deze maand gewoond?",
        prompt_en: "Where have you been living this month?",
        expected_responses: [
            { nl: "ik heb dichtbij het vliegveld gewoond", en: "I have been living near the airport" },
            { nl: "ik heb bij mijn familie gewoond", en: "I have been living with my family" },
            { nl: "we zijn van plan binnenkort te verhuizen", en: "We plan to move house soon" }
        ]
    },
    {
        prompt_nl: "Hebben ze de busreis vandaag geannuleerd?",
        prompt_en: "Have they canceled the bus trip today?",
        expected_responses: [
            { nl: "ja, ze hebben het vervoer geannuleerd vanwege problemen", en: "Yes, they have canceled the transport due to problems" },
            { nl: "nee, de bus komt over vijftien minuten", en: "No, the bus arrives in fifteen minutes" },
            { nl: "ik moet snel een ander station vinden", en: "I need to find another station quickly" }
        ]
    },
    {
        prompt_nl: "Lees je het dagelijkse nieuws thuis?",
        prompt_en: "Are you reading the daily news at home?",
        expected_responses: [
            { nl: "ja, ik lees om mijn communicatie te verbeteren", en: "Yes, I am reading to improve my communication" },
            { nl: "nee, ik wil mijn gesprekken voortzetten", en: "No, I prefer to continue my conversations" },
            { nl: "ik vergat het dagelijkse nieuws te bekijken", en: "I forgot to review the daily information" }
        ]
    },
    {
        prompt_nl: "Hebben we de vliegtickets gekregen?",
        prompt_en: "Have we gotten the tickets for the plane?",
        expected_responses: [
            { nl: "ja, we hebben de tickets vroeg gekregen", en: "Yes, we have gotten the tickets early" },
            { nl: "nog niet, het vervoer is moeilijk", en: "Not yet, the transport is difficult" },
            { nl: "ik moet de rekeningsinformatie van de reis vinden", en: "I need to find the bill for the trip" }
        ]
    },
    {
        prompt_nl: "Wat ben je aan het bereiden voor het avondeten vandaag?",
        prompt_en: "What are you preparing for dinner today?",
        expected_responses: [
            { nl: "ik bereid kip met rijst en kaas", en: "I am preparing chicken with rice and cheese" },
            { nl: "ik heb een biefstuk met frietjes bereid", en: "I have prepared a steak with french fries" },
            { nl: "ik wil soep bereiden terwijl we wachten", en: "I want to prepare soup while we wait" }
        ]
    },
    {
        prompt_nl: "Heb je de gesprekken van school begrepen?",
        prompt_en: "Have you understood the school conversations?",
        expected_responses: [
            { nl: "ja, ik heb bijna alles vandaag begrepen", en: "Yes, I have understood almost everything today" },
            { nl: "maar ik moet nog meer studeren", en: "However, I need to study more" },
            { nl: "het is nog steeds moeilijk om snel te begrijpen", en: "It is still difficult to understand fast" }
        ]
    },
    {
        prompt_nl: "Wil je deze maand met onze reis meegaan?",
        prompt_en: "Do you want to join our trip this month?",
        expected_responses: [
            { nl: "ja, ik wil vandaag met jullie groep meegaan", en: "Yes, I want to join your group today" },
            { nl: "nee, ik moet deze maand werken", en: "No, I have to work during the month" },
            { nl: "we zijn van plan eerst onze ouders te bezoeken", en: "We plan to visit parents before" }
        ]
    },
    {
        prompt_nl: "Hoe laat hebben we de dagelijkse taken afgemaakt?",
        prompt_en: "What time have we finished the daily tasks?",
        expected_responses: [
            { nl: "we hebben vandaag vroeg afgemaakt", en: "We have finished early today" },
            { nl: "na drie uur studeren", en: "After studying for three hours" },
            { nl: "we werken er nu nog steeds aan", en: "We are still working on them now" }
        ]
    },
    {
        prompt_nl: "Waarom hebben ze hun hotelrekening geannuleerd?",
        prompt_en: "Why have they canceled their hotel account?",
        expected_responses: [
            { nl: "omdat ze hun reisplan hebben veranderd", en: "Because they have changed their trip plan" },
            { nl: "maar ze gaan morgen de rekening betalen", en: "However they are going to pay the bill tomorrow" },
            { nl: "ze vergaten de informatie te bekijken voordat ze vertrokken", en: "They forgot to review the information before leaving" }
        ]
    },
    {
        prompt_nl: "Ben je vandaag aan het studeren om je vaardigheden te verbeteren?",
        prompt_en: "Are you studying to improve your skills today?",
        expected_responses: [
            { nl: "ja, ik studeer om een baan te krijgen", en: "Yes, I am studying to get a job" },
            { nl: "ik moet mijn dagelijkse gesprekken voortzetten", en: "I need to continue my daily conversations" },
            { nl: "mijn boeken bekijken helpt me snel te leren", en: "Reviewing my books helps me learn fast" }
        ]
    },
    {
        prompt_nl: "Heb je het eten van het restaurant gebracht?",
        prompt_en: "Have you brought the food from the restaurant?",
        expected_responses: [
            { nl: "ja, ik heb brood, soep en kaas gebracht", en: "Yes, I have brought bread, soup and cheese" },
            { nl: "nee, het restaurant is nu gesloten", en: "No, the restaurant is closed now" },
            { nl: "eten brengen is moeilijk zonder vervoer", en: "Bringing the food is difficult without transport" }
        ]
    },
    {
        prompt_nl: "Waar kunnen we vandaag een goed menu vinden?",
        prompt_en: "Where can we find a good menu today?",
        expected_responses: [
            { nl: "we kunnen een menu vinden in het hotel", en: "We can find a menu at the hotel" },
            { nl: "terwijl we lopen kunnen we een restaurant zoeken", en: "While we walk we can look for a restaurant" },
            { nl: "ik heb het keukenmenu al hier", en: "I already have the kitchen menu here" }
        ]
    },
    {
        prompt_nl: "Hoe lang woon je al in dit huis?",
        prompt_en: "How much time have you been living in this house?",
        expected_responses: [
            { nl: "ik woon hier al twee jaar", en: "I have been living here for two years" },
            { nl: "we wonen hier pas een maand", en: "We have lived here one month only" },
            { nl: "na deze maand wil ik verhuizen", en: "After this month I want to move" }
        ]
    },
    {
        prompt_nl: "Wat lees je over eerdere ervaringen?",
        prompt_en: "What are you reading about past experiences?",
        expected_responses: [
            { nl: "ik lees een boek over communicatie", en: "I am reading a book about communication" },
            { nl: "het is een lange en moeilijke reis geweest", en: "It has been a long and difficult trip" },
            { nl: "ik wil hun problemen begrijpen voordat ik doorga", en: "I want to understand their problems before following" }
        ]
    },
    {
        prompt_nl: "Wil je een nieuwe reis met mij plannen?",
        prompt_en: "Do you want to plan a new trip with me?",
        expected_responses: [
            { nl: "ja, ik wil een reis met het vliegtuig plannen", en: "Yes, I want to plan a trip by plane" },
            { nl: "deze maand heb ik geen vrije tijd", en: "During this month I do not have free time" },
            { nl: "maar we kunnen er later over praten", en: "However we can talk about that later" }
        ]
    },
{
    prompt_nl: "Ben je erin geslaagd de treininformatie te bekijken?",
    prompt_en: "Have you managed to review the train information?",
    expected_responses: [
        { nl: "ja, ik heb alles op het station bekeken", en: "Yes, I have reviewed everything at the station" },
        { nl: "nog niet, het bericht is niet aangekomen", en: "Not yet, the message did not arrive" },
        { nl: "ik moet eerst mijn treinkaartje vinden", en: "I need to find my train ticket before" }
    ]
},
{
    prompt_nl: "Waarom heb je besloten dit jaar te verhuizen?",
    prompt_en: "Why have you decided to move house this year?",
    expected_responses: [
        { nl: "omdat mijn nieuwe huis dichtbij mijn werk is", en: "Because my new house is near work" },
        { nl: "om weer met mijn familie te wonen", en: "To live with my family again" },
        { nl: "ik heb in een heel kleine plek gewoond", en: "I have been living in a very small place" }
    ]
},
{
    prompt_nl: "Heb je de rekening in het restaurant betaald?",
    prompt_en: "Have you paid the bill at the restaurant?",
    expected_responses: [
        { nl: "ja, ik heb de rekening al met geld betaald", en: "Yes, I have already paid the bill with money" },
        { nl: "nee, ik wacht nog steeds tot ze de rekening brengen", en: "No, I am still waiting for them to bring the bill" },
        { nl: "mijn vriend heeft vandaag alles betaald", en: "My friend has paid for everything today" }
    ]
},
{
    prompt_nl: "Werk je eraan om je dagelijkse vaardigheden te verbeteren?",
    prompt_en: "Are you working to improve your daily skills?",
    expected_responses: [
        { nl: "ja, ik werk elk uur hard", en: "Yes, I am working hard every hour" },
        { nl: "ik wil blijven leren en meer dingen ontdekken", en: "I want to continue learning more things" },
        { nl: "mijn huiswerk bekijken helpt me te verbeteren", en: "Reviewing my homework helps me improve" }
    ]
},
{
    prompt_nl: "Heeft zij het eten voor de reis voorbereid?",
    prompt_en: "Has she prepared the food for the trip?",
    expected_responses: [
        { nl: "ja, zij heeft brood, kaas en fruit voorbereid", en: "Yes, she has prepared bread, cheese and fruit" },
        { nl: "zij bereidt nu het eten in de keuken", en: "She is preparing the food in the kitchen now" },
        { nl: "nee, zij vergat de dagelijkse dingen klaar te maken", en: "No, she forgot to prepare the daily things" }
    ]
},
{
    prompt_nl: "Waar hebben je broers deze maand gestudeerd?",
    prompt_en: "Where have your brothers been studying this month?",
    expected_responses: [
        { nl: "zij hebben op de grote school gestudeerd", en: "They have been studying at the big school" },
        { nl: "we hebben samen thuis gestudeerd", en: "We have been studying together at home" },
        { nl: "zij willen blijven studeren in het hotel", en: "They want to continue studying at the hotel" }
    ]
},
{
    prompt_nl: "Wil je zijn bericht lezen terwijl we op de trein wachten?",
    prompt_en: "Do you want to read his message while we wait for the train?",
    expected_responses: [
        { nl: "ja, ik wil het bericht nu lezen", en: "Yes, I want to read the message now" },
        { nl: "nee, ik luister liever muziek op mijn televisie", en: "No, I prefer to listen to music on my television" },
        { nl: "ik moet eerst de vervoersinformatie bekijken", en: "I need to review the transport information before" }
    ]
},
{
    prompt_nl: "Ben je erin geslaagd een plek dichtbij het station te vinden?",
    prompt_en: "Have you managed to find a place near the station?",
    expected_responses: [
        { nl: "ja, ik heb een klein huis heel dichtbij gevonden", en: "Yes, I have found a small house very near" },
        { nl: "ik zoek nog steeds samen met mijn vriend", en: "I am still looking with my friend" },
        { nl: "het is moeilijk om vandaag snel een plek te vinden", en: "It is difficult to find a place quickly today" }
    ]
},
{
    prompt_nl: "Waarom heb je je gesprekken van vandaag geannuleerd?",
    prompt_en: "Why have you canceled your conversations today?",
    expected_responses: [
        { nl: "omdat ik deze maand heel moe ben geweest", en: "Because I have been very tired this month" },
        { nl: "ik moet eerst mijn vliegreis voorbereiden", en: "I need to prepare my plane trip before" },
        { nl: "maar we kunnen praten na het avondeten", en: "However we can talk after having dinner" }
    ]
},
{
    prompt_nl: "Wat heeft zijn familie gezegd over de verhuizing?",
    prompt_en: "What has his family said about the move?",
    expected_responses: [
        { nl: "zij willen volgende maand verhuizen", en: "They want to move next month" },
        { nl: "zij zijn blij met de verandering van plek", en: "They are happy with the change of place" },
        { nl: "zij hebben nog problemen met inpakken", en: "They still have problems packing" }
    ]
},
{
    prompt_nl: "Woon je dit jaar bij je ouders?",
    prompt_en: "Are you living with your parents this year?",
    expected_responses: [
        { nl: "ja, ik woon al vijf maanden bij hen", en: "Yes, I have been living with them for five months" },
        { nl: "nee, ik woon liever alleen in de stad", en: "No, I prefer to live alone in the city" },
        { nl: "ik wil binnenkort naar een ander huis verhuizen", en: "I want to move to another house soon" }
    ]
},
{
    prompt_nl: "Heb je het menu van het nieuwe restaurant bekeken?",
    prompt_en: "Have you reviewed the menu of the new restaurant?",
    expected_responses: [
        { nl: "ja, het menu heeft biefstuk, kip en vis", en: "Yes, the menu has steak, chicken and fish" },
        { nl: "nee, ik vergat het menu eerder te bekijken", en: "No, I forgot to look at the menu before" },
        { nl: "ik wil eerst hun prijzen begrijpen", en: "I want to understand their prices first" }
    ]
},
{
    prompt_nl: "Ben je blijven studeren tijdens de reis?",
    prompt_en: "Have you continued studying during the trip?",
    expected_responses: [
        { nl: "ja, ik heb dagelijkse boeken gestudeerd", en: "Yes, I have been studying daily books" },
        { nl: "nee, ik heb gerust en films gekeken", en: "No, I have been resting and watching movies" },
        { nl: "tijdens het reizen is het moeilijk om meer te studeren", en: "While I travel it is difficult to study more" }
    ]
},
{
    prompt_nl: "Hebben de ouders hun nieuwe auto gebracht?",
    prompt_en: "Have the parents brought their new car?",
    expected_responses: [
        { nl: "ja, zij hebben de grote auto vandaag gebracht", en: "Yes, they have brought the big car today" },
        { nl: "nee, de auto wordt thuis gerepareerd", en: "No, the car is fixing at home" },
        { nl: "zij willen vandaag met de trein reizen", en: "They want to travel by train today" }
    ]
},
{
    prompt_nl: "Wil je de instructies van het menu volgen?",
    prompt_en: "Do you want to follow the menu instructions?",
    expected_responses: [
        { nl: "ja, om de vissoep te bereiden", en: "Yes, to prepare the fish soup" },
        { nl: "nee, ik wil kip met salade koken", en: "No, I want to cook chicken with salad" },
        { nl: "ik moet eerst de informatie begrijpen", en: "I need to understand the information before" }
    ]
},
{
    prompt_nl: "Heb je de vervoersrekening gekregen?",
    prompt_en: "Have you gotten the transport bill?",
    expected_responses: [
        { nl: "ja, ik heb de rekening van het station gekregen", en: "Yes, I have gotten the bill from the station" },
        { nl: "nog niet, het bericht is niet aangekomen", en: "Not yet, the message did not arrive" },
        { nl: "mijn vriend heeft het kaartje en de rekening", en: "My friend has the ticket and the bill" }
    ]
},
{
    prompt_nl: "Waarom ben je over deze plek aan het lezen geweest?",
    prompt_en: "Why have you been reading about this place?",
    expected_responses: [
        { nl: "omdat ik van plan ben het hotel binnenkort te bezoeken", en: "Because I plan to visit the hotel soon" },
        { nl: "om de cultuur en het lekkere eten te begrijpen", en: "To understand its culture and good food" },
        { nl: "maar vandaag lees ik alleen voor plezier", en: "However I only read for pleasure today" }
    ]
},
{
    prompt_nl: "Hebben ze vijf jaar in dit hotel gewoond?",
    prompt_en: "Have they been living in this hotel for five years?",
    expected_responses: [
        { nl: "nee, zij wonen hier pas een maand", en: "No, they have been living here a month" },
        { nl: "ja, zij wonen hier al vele jaren", en: "Yes, they have been living here many years" },
        { nl: "zij willen na deze maand verhuizen", en: "They want to move house after this month" }
    ]
},

{
    prompt_nl: "Wil je je huiswerk nakijken na het eten?",
    prompt_en: "Do you want to review your homework after eating?",
    expected_responses: [
        { nl: "ja, ik moet vandaag alles nakijken", en: "Yes, I need to review everything today" },
        { nl: "nee, ik luister liever muziek en rust uit", en: "No, I prefer to listen to music and rest" },
        { nl: "ik heb de dagelijkse taken al vroeg nagekeken", en: "I already reviewed the daily tasks early" }
    ]
},
{
    prompt_nl: "Ben je bezig geweest om je communicatie te verbeteren?",
    prompt_en: "Have you been working to improve your communication?",
    expected_responses: [
        { nl: "ja, ik heb veel gesprekken gehad", en: "Yes, I have been having many conversations" },
        { nl: "ik wil dit jaar betere vaardigheden krijgen", en: "I want to get better skills this year" },
        { nl: "het is nog steeds moeilijk om snel met vrienden te praten", en: "It is still difficult to talk fast with friends" }
    ]
},
{
    prompt_nl: "Wat heb je meegenomen voor het ontbijt van vandaag?",
    prompt_en: "What have you brought for today's breakfast?",
    expected_responses: [
        { nl: "ik heb warm brood, melk en fruit meegenomen", en: "I have brought hot bread, milk and fruit" },
        { nl: "ik heb niets uit de keuken meegenomen", en: "I have not brought anything from the kitchen" },
        { nl: "mijn zus heeft eieren met kaas bereid", en: "My sister has prepared eggs with cheese" }
    ]
},
{
    prompt_nl: "Zijn ze erin geslaagd hun problemen te begrijpen?",
    prompt_en: "Have they managed to understand their problems?",
    expected_responses: [
        { nl: "ja, ze hebben een uur lang gepraat", en: "Yes, they have conversed for an hour" },
        { nl: "maar ze moeten hun strategie veranderen", en: "However they need to change their strategy" },
        { nl: "nog niet, het is een moeilijke situatie", en: "Not yet, it is a difficult situation" }
    ]
},
{
    prompt_nl: "Heb je gepland om je vliegreis te annuleren?",
    prompt_en: "Have you planned to cancel your plane trip?",
    expected_responses: [
        { nl: "ja, ik moest de reis vandaag annuleren", en: "Yes, I have had to cancel the trip today" },
        { nl: "nee, ik wil deze maand naar het hotel gaan", en: "No, I want to go to the hotel this month" },
        { nl: "nog niet, ik wil eerst de informatie bekijken", en: "Not yet, I hope to review the information before" }
    ]
},
{
    prompt_nl: "Welke vaardigheden heb je geleerd in je nieuwe baan?",
    prompt_en: "What skills have you learned in your new job?",
    expected_responses: [
        { nl: "ik heb geleerd mijn dagelijkse communicatie te verbeteren", en: "I have learned to improve my daily communication" },
        { nl: "ik leer hoe ik eten moet bereiden", en: "I have been learning to prepare food" },
        { nl: "ik moet nog steeds meer blijven leren", en: "I still need to continue learning more" }
    ]
},
{
    prompt_nl: "Hebben ze hun boeken gelezen in de middag?",
    prompt_en: "Have they been reading their books during the afternoon?",
    expected_responses: [
        { nl: "ja, ze hebben gelezen over eerdere ervaringen", en: "Yes, they have been reading about past experiences" },
        { nl: "nee, ze luisteren liever muziek of kijken televisie", en: "No, they prefer to listen to music or watch TV" },
        { nl: "terwijl zij rusten, kook ik het avondeten", en: "While they rest I cook dinner" }
    ]
},
{
    prompt_nl: "Wil je het gesprek voortzetten in het restaurant?",
    prompt_en: "Do you want to continue the conversation at the restaurant?",
    expected_responses: [
        { nl: "ja, we kunnen het menu vragen en lunchen", en: "Yes, we can ask for the menu and have lunch" },
        { nl: "nee, ik ga liever naar huis om uit te rusten", en: "No, I prefer to go home to rest now" },
        { nl: "na het bekijken van de hotelrekening kunnen we gaan", en: "After reviewing the hotel bill we can go" }
    ]
},
{
    prompt_nl: "Heeft je broer een nieuwe plek gevonden om te wonen?",
    prompt_en: "Has your brother gotten a new place to live?",
    expected_responses: [
        { nl: "ja, hij heeft een heel goed klein huis gevonden", en: "Yes, he has found a very good small house" },
        { nl: "hij woont deze maand nog bij zijn ouders", en: "He is still living with his parents this month" },
        { nl: "hij wil na dit jaar verhuizen", en: "He wants to move house after this year" }
    ]
},
{
    prompt_nl: "Wat heb je deze maand voorbereid?",
    prompt_en: "What have you been preparing during the month?",
    expected_responses: [
        { nl: "ik heb mijn vliegreis voorbereid", en: "I have been preparing my plane trip" },
        { nl: "ik heb een nieuw werkplan voorbereid", en: "I have prepared a new plan for work" },
        { nl: "ik moet het huiswerk van school voorbereiden", en: "I need to prepare the school homework" }
    ]
},
{
    prompt_nl: "Heb je geprobeerd hun dagelijkse gesprekken te volgen?",
    prompt_en: "Have you tried to follow their daily conversations?",
    expected_responses: [
        { nl: "ja, maar ze praten heel snel in het restaurant", en: "Yes, but they talk very fast at the restaurant" },
        { nl: "het helpt me te begrijpen en mijn vaardigheden te verbeteren", en: "It helps me understand and improve my skills" },
        { nl: "maar ik lees liever boeken thuis", en: "However I prefer to read books at home" }
    ]
},
{
    prompt_nl: "Waarom heb je je vriend naar mijn huis gebracht?",
    prompt_en: "Why have you brought your friend to my house?",
    expected_responses: [
        { nl: "omdat we samen willen studeren en huiswerk maken", en: "Because we want to study and do homework together" },
        { nl: "om een gesprek te hebben over de vakantie", en: "To have a conversation about the vacation" },
        { nl: "hij wil vandaag mijn familie ontmoeten", en: "He wants to meet my family today" }
    ]
},
{
    prompt_nl: "Zijn ze erin geslaagd de rekening van het restaurant te bekijken?",
    prompt_en: "Have they managed to review the restaurant bill?",
    expected_responses: [
        { nl: "ja, ze hebben de rekening bekeken voordat ze betaalden", en: "Yes, they have reviewed the bill before paying" },
        { nl: "nog niet, de rekening heeft vandaag problemen", en: "Not yet, the bill has problems today" },
        { nl: "mijn vader heeft de lunchrekening al betaald", en: "My father has already paid the lunch bill" }
    ]
},
{
    prompt_nl: "Wil je later met ons mee eten?",
    prompt_en: "Do you want to join us for dinner later?",
    expected_responses: [
        { nl: "ja, ik wil na mijn werk bij jullie aan tafel zitten", en: "Yes, I want to join your table after working" },
        { nl: "sorry, ik heb al vis gegeten thuis", en: "I am sorry, I already ate fish at my house" },
        { nl: "zolang ik moet studeren kan ik niet uitgaan", en: "As long as I have to study I cannot go out" }
    ]
}
],

B2: [
{
    prompt_nl: "Hoe plan je het nieuwe systeemproces te optimaliseren?",
    prompt_en: "How do you plan to optimize the new system process?",
    expected_responses: [
        { nl: "we moeten de prestaties zorgvuldig analyseren", en: "We need to analyze the performance carefully" },
        { nl: "met een effectieve strategie kunnen we resultaten behalen", en: "With an effective strategy we can achieve results" },
        { nl: "hoewel het ingewikkeld is, kunnen we de aanpak bijwerken", en: "Although it is complicated, we can update the approach" }
    ]
},
{
    prompt_nl: "Heb je de risico’s van deze professionele strategie geëvalueerd?",
    prompt_en: "Have you evaluated the risks of this professional strategy?",
    expected_responses: [
        { nl: "ja, ik heb elk mogelijk risico geëvalueerd", en: "Yes, I have evaluated every possible risk" },
        { nl: "daarom is het nodig om de aanpak te veranderen", en: "Therefore it is necessary to change the approach" },
        { nl: "er bestaat een mogelijkheid dat er problemen ontstaan", en: "There is a possibility of having problems" }
    ]
},
{
    prompt_nl: "Welke resultaten hebben ze in de vergadering geanalyseerd?",
    prompt_en: "What results have they analyzed in the meeting?",
    expected_responses: [
        { nl: "ze hebben een zeer positieve prestatie geanalyseerd", en: "They have analyzed a very positive performance" },
        { nl: "bovendien hebben ze het werkconcept geoptimaliseerd", en: "In addition they have optimized the concept of work" },
        { nl: "de resultaten tonen dat het systeem werkt", en: "The results show that the system works" }
    ]
},
{
    prompt_nl: "Hoe kunnen we deze ingewikkelde situatie coördineren?",
    prompt_en: "How can we coordinate this complicated situation?",
    expected_responses: [
        { nl: "we moeten de stappen zorgvuldig coördineren", en: "We must coordinate the steps carefully" },
        { nl: "ondanks de problemen is de aanpak realistisch", en: "Despite the problems, the approach is realistic" },
        { nl: "ik wil vandaag een nieuwe strategie bespreken", en: "I want to discuss a new strategy today" }
    ]
},
{
    prompt_nl: "Heb je de verwachtingen voor de toekomstige reis verduidelijkt?",
    prompt_en: "Have you clarified the expectations for the future trip?",
    expected_responses: [
        { nl: "ja, ik heb alles met mijn ouders verduidelijkt", en: "Yes, I have clarified everything with my parents" },
        { nl: "hoewel het op lange termijn is, is het plan goed", en: "Although it is long term, the plan is good" },
        { nl: "ik moet nog steeds een afgelegen plek verkennen", en: "I still need to explore a remote place" }
    ]
},
{
    prompt_nl: "Waarom hebben ze erop aangedrongen het systeem bij te werken?",
    prompt_en: "Why have they insisted on updating the system?",
    expected_responses: [
        { nl: "om de communicatie in de samenleving te vergroten", en: "To increase communication in society" },
        { nl: "ze hebben aangedrongen omdat de strategie is veranderd", en: "They have insisted because the strategy has changed" },
        { nl: "zelfs met problemen is het nodig om vooruit te gaan", en: "Even with problems, it is necessary to move forward" }
    ]
},
{
    prompt_nl: "Welke motivatie heb je nodig om je doelen te bereiken?",
    prompt_en: "What motivation do you need to achieve your goals?",
    expected_responses: [
        { nl: "mijn familie is mijn grootste motivatie", en: "My family is my biggest motivation" },
        { nl: "ik moet mijn professionele vaardigheden versterken", en: "I need to strengthen my professional skills" },
        { nl: "een positieve aanpak helpt de situatie te veranderen", en: "A positive approach helps to change the situation" }
    ]
},
{
    prompt_nl: "Hoe past jouw cultuur zich aan deze uitdagingen aan?",
    prompt_en: "How does your culture adapt to these challenges?",
    expected_responses: [
        { nl: "onze samenleving weet zich aan veranderingen aan te passen", en: "Our society knows how to adapt to changes" },
        { nl: "het is een ingewikkeld maar positief proces", en: "It is a complicated but positive process" },
        { nl: "het bespreken van uitdagingen helpt de cultuur te versterken", en: "Discussing challenges helps to strengthen culture" }
    ]
},
{
    prompt_nl: "Heb je de mogelijkheid onderzocht om het risico te verminderen?",
    prompt_en: "Have you explored the possibility of reducing the risk?",
    expected_responses: [
        { nl: "ja, ik heb een realistischer strategie onderzocht", en: "Yes, I have explored a more realistic strategy" },
        { nl: "daarom hebben we vandaag het risico verminderd", en: "Therefore we have reduced the risk today" },
        { nl: "het is nog steeds nodig om het concept te analyseren", en: "It is still necessary to analyze the concept" }
    ]
},
{
    prompt_nl: "Is het mogelijk nu een effectieve prestatie te bereiken?",
    prompt_en: "Is it possible to achieve an effective performance now?",
    expected_responses: [
        { nl: "ja, met een innovatief systeem is het mogelijk", en: "Yes, with an innovative system it is possible" },
        { nl: "we hebben de aanpak geoptimaliseerd om het te bereiken", en: "We have optimized the approach to achieve it" },
        { nl: "maar de huidige situatie is moeilijk", en: "However the current situation is difficult" }
    ]
},
{
    prompt_nl: "Hebben ze de nieuwe communicatiestrategie besproken?",
    prompt_en: "Have they discussed the new communication strategy?",
    expected_responses: [
        { nl: "ja, ze hebben de strategie zorgvuldig besproken", en: "Yes, they have discussed the strategy carefully" },
        { nl: "bovendien hebben ze alle verwachtingen verduidelijkt", en: "In addition they have clarified all expectations" },
        { nl: "daarom is het proces vandaag duidelijker", en: "Therefore the process is clearer today" }
    ]
},
{
    prompt_nl: "Is het nodig om de langetermijnaanpak te veranderen?",
    prompt_en: "Is it necessary to change the long term approach?",
    expected_responses: [
        { nl: "ja, een realistische aanpak is vandaag nodig", en: "Yes, a realistic approach is necessary today" },
        { nl: "ondanks de resultaten wacht ik liever", en: "Despite the results, I prefer to wait" },
        { nl: "hoewel het moeilijk is, is de toekomst positief", en: "Although it is difficult, the future is positive" }
    ]
},
{
    prompt_nl: "Heb je de systeeminformatie bijgewerkt?",
    prompt_en: "Have you updated the system information?",
    expected_responses: [
        { nl: "ja, ik heb de informatie vandaag bijgewerkt", en: "Yes, I have updated the information today" },
        { nl: "ik moet het proces optimaliseren voordat ik verander", en: "I need to optimize the process before changing" },
        { nl: "zelfs zonder hulp heb ik alles bijgewerkt", en: "Even without help, I achieved updating everything" }
    ]
},
{
    prompt_nl: "Welke uitdagingen heeft onze huidige samenleving?",
    prompt_en: "What challenges does our current society have?",
    expected_responses: [
        { nl: "we moeten cultuur en onderwijs versterken", en: "We must strengthen culture and education" },
        { nl: "de situatie is een ingewikkeld proces", en: "The situation is a complicated process" },
        { nl: "daarom is motivatie heel belangrijk", en: "Therefore motivation is very necessary" }
    ]
},
{
    prompt_nl: "Hebben ze de prestaties van het vervoer geëvalueerd?",
    prompt_en: "Have they evaluated the transport performance?",
    expected_responses: [
        { nl: "ja, ze hebben het treinsysteem geëvalueerd", en: "Yes, they have evaluated the train system" },
        { nl: "de prestatie is deze maand verminderd", en: "The performance has been reduced this month" },
        { nl: "het is mogelijk beter vervoer te coördineren", en: "It is possible to coordinate better transport" }
    ]
},
{
    prompt_nl: "Hoe heb je de vergadering van het restaurant gecoördineerd?",
    prompt_en: "How did you manage to coordinate the restaurant meeting?",
    expected_responses: [
        { nl: "de vergadering coördineren was een eenvoudig proces", en: "Coordinating the meeting was an easy process" },
        { nl: "door het menu vooraf te bespreken ging alles snel", en: "Having discussed the menu before, everything was fast" },
        { nl: "de rekening op tijd brengen hielp veel", en: "Bringing the bill on time helped a lot" }
    ]
},
{
    prompt_nl: "Heb je de mogelijkheid van een afgelegen reis geanalyseerd?",
    prompt_en: "Have you analyzed the possibility of a remote trip?",
    expected_responses: [
        { nl: "ja, het is een mogelijkheid op lange termijn", en: "Yes, it is a long-term possibility" },
        { nl: "ik wil in de toekomst een afgelegen plek verkennen", en: "I want to explore a remote place in the future" },
        { nl: "ondanks de risico’s is de reis positief", en: "Despite the risks, the trip is positive" }
    ]
},
{
    prompt_nl: "Waarom heb je aangedrongen op een innovatieve strategie?",
    prompt_en: "Why have you insisted on an innovative strategy?",
    expected_responses: [
        { nl: "omdat we de resultaten willen optimaliseren", en: "Because we want to optimize the results" },
        { nl: "een innovatieve strategie versterkt het werk", en: "An innovative strategy strengthens work" },
        { nl: "hoewel het ingewikkeld is, helpt het de prestaties te verhogen", en: "Although it is complicated, it helps to increase performance" }
    ]
},
{
    prompt_nl: "Heb je het risicoconcept met je team verduidelijkt?",
    prompt_en: "Have you clarified the risk concept with your team?",
    expected_responses: [
        { nl: "ja, het concept is vandaag verduidelijkt", en: "Yes, the concept has been clarified today" },
        { nl: "daarom begrijpt iedereen de situatie", en: "Therefore everyone understands the situation" },
        { nl: "we moeten nog steeds enkele dingen evalueren", en: "We still need to evaluate some things" }
    ]
},
{
    prompt_nl: "Is het realistisch om nu een positieve verandering te verwachten?",
    prompt_en: "Is it realistic to expect a positive change now?",
    expected_responses: [
        { nl: "ja, met een professionele aanpak is het realistisch", en: "Yes, with a professional approach it is realistic" },
        { nl: "we hebben de strategie uitgebreid om het te bereiken", en: "We have expanded the strategy to achieve it" },
        { nl: "maar de situatie is erg moeilijk", en: "However the situation is very difficult" }
    ]
},
{
    prompt_nl: "Ben je erin geslaagd de strategie aan te passen om het proces te verbeteren?",
    prompt_en: "Have you achieved adapting the strategy to improve the process?",
    expected_responses: [
        { nl: "ja, ik heb me aangepast aan de nieuwe situatie", en: "Yes, I have adapted to the new situation" },
        { nl: "we hebben de systeemprestaties geoptimaliseerd", en: "We have optimized the system performance" },
        { nl: "daarom zijn de resultaten zeer positief", en: "Therefore the results are very positive" }
    ]
},
{
    prompt_nl: "Welke verwachtingen heb je over de cultuur van de samenleving?",
    prompt_en: "What expectations do you have about the culture of society?",
    expected_responses: [
        { nl: "ik wil hun samenleving en cultuur beter begrijpen", en: "I want to understand their society and culture better" },
        { nl: "bovendien heb ik hoge verwachtingen voor de toekomst", en: "In addition I have high expectations for the future" },
        { nl: "het is een noodzakelijk proces om de verbondenheid te versterken", en: "It is a necessary process to strengthen the union" }
    ]
},
{
    prompt_nl: "Hebben ze de risico’s van de huidige aanpak geanalyseerd?",
    prompt_en: "Have they analyzed the risks of the current approach?",
    expected_responses: [
        { nl: "ja, ze hebben elk risico zorgvuldig geanalyseerd", en: "Yes, they have analyzed every risk carefully" },
        { nl: "hoewel het ingewikkeld is, is de aanpak realistisch", en: "Although it is complicated, the approach is realistic" },
        { nl: "daarom willen ze vandaag de strategie veranderen", en: "Therefore they prefer to change the strategy today" }
    ]
},
{
    prompt_nl: "Waarom heb je erop aangedrongen de prestaties opnieuw te evalueren?",
    prompt_en: "Why have you insisted on evaluating the performance again?",
    expected_responses: [
        { nl: "omdat de eerdere resultaten niet goed waren", en: "Because past results were not good" },
        { nl: "we moeten alles evalueren om het systeem te optimaliseren", en: "We need to evaluate everything to optimize the system" },
        { nl: "zelfs met problemen wil ik de informatie opnieuw bekijken", en: "Even with problems, I prefer to review the information" }
    ]
},
{
    prompt_nl: "Is het mogelijk om het vervoer op lange termijn te coördineren?",
    prompt_en: "Is it possible to coordinate long term transport?",
    expected_responses: [
        { nl: "ja, het is een mogelijkheid die we onderzoeken", en: "Yes, it is a possibility that we are exploring" },
        { nl: "ondanks de uitdagingen kunnen we het vandaag bereiken", en: "Despite the challenges, we can achieve it today" },
        { nl: "we moeten eerst met het vliegveld coördineren", en: "We need to coordinate with the airport before" }
    ]
},
{
    prompt_nl: "Heb je het innovatieve concept met je familie verduidelijkt?",
    prompt_en: "Have you clarified the innovative concept with your family?",
    expected_responses: [
        { nl: "ja, het concept is thuis verduidelijkt", en: "Yes, the concept has been clarified at home" },
        { nl: "ze hebben vandaag een zeer positieve motivatie", en: "They have a very positive motivation today" },
        { nl: "hoewel het moeilijk te begrijpen is, vinden ze het leuk", en: "Although it is difficult to understand, they like it" }
    ]
},
{
    prompt_nl: "Hoe kunnen we de professionele strategie versterken?",
    prompt_en: "How can we strengthen the professional strategy?",
    expected_responses: [
        { nl: "we moeten het systeem en de vaardigheden bijwerken", en: "We must update the system and the skills" },
        { nl: "bovendien is het nodig de communicatie te vergroten", en: "In addition it is necessary to increase communication" },
        { nl: "een professionele aanpak helpt risico’s te verminderen", en: "A professional approach helps to reduce risks" }
    ]
},
{
    prompt_nl: "Hebben ze een afgelegen plek verkend tijdens hun reis?",
    prompt_en: "Have they explored a remote place during their trip?",
    expected_responses: [
        { nl: "ja, ze hebben een zeer afgelegen plek verkend", en: "Yes, they have explored a very remote place" },
        { nl: "hun lange reis is positief geweest", en: "Their long term trip has been positive" },
        { nl: "maar het was een ingewikkeld proces om daar te komen", en: "However it was a complicated process to get there" }
    ]
},
{
    prompt_nl: "Heb je daarom besloten de informatie bij te werken?",
    prompt_en: "Therefore have you decided to update the information?",
    expected_responses: [
        { nl: "ja, ik heb de procesresultaten bijgewerkt", en: "Yes, I have updated the process results" },
        { nl: "ik heb de situatie al zorgvuldig geanalyseerd", en: "I have already analyzed the situation carefully" },
        { nl: "ik moet dit nog met mijn vriend bespreken", en: "I still need to discuss this with my friend" }
    ]
},
{
    prompt_nl: "Is het ingewikkeld om vandaag een realistische aanpak te bereiken?",
    prompt_en: "Is it complicated to achieve a realistic approach today?",
    expected_responses: [
        { nl: "ja, de huidige situatie is zeer ingewikkeld", en: "Yes, the current situation is very complicated" },
        { nl: "hoewel het moeilijk is, is het met werk mogelijk", en: "Although it is difficult, with work it is possible" },
        { nl: "we hebben de strategie uitgebreid om resultaten te behalen", en: "We have expanded the strategy to achieve results" }
    ]
},
{
    prompt_nl: "Ben je erin geslaagd de prestaties van het restaurant te optimaliseren?",
    prompt_en: "Have you achieved optimizing the performance of the restaurant?",
    expected_responses: [
        { nl: "ja, we hebben het keukenproces geoptimaliseerd", en: "Yes, we have optimized the kitchen process" },
        { nl: "daarom zijn de resultaten vandaag zeer positief", en: "Therefore the results are very positive today" },
        { nl: "hoewel het ingewikkeld was, hebben we de aanpak veranderd", en: "Although it was complicated, we achieved changing the approach" }
    ]
},
{
    prompt_nl: "Welke professionele strategie heb je voor de toekomst?",
    prompt_en: "What professional strategy do you have for the future?",
    expected_responses: [
        { nl: "ik ben van plan mijn vaardigheden op lange termijn te versterken", en: "I plan to strengthen my skills long term" },
        { nl: "bovendien wil ik een innovatieve aanpak verkennen", en: "In addition I want to explore an innovative approach" },
        { nl: "mijn strategie is het risico van het proces te verminderen", en: "My strategy is to reduce the risk of the process" }
    ]
},
{
    prompt_nl: "Hebben ze de informatie over de verhuizing gecoördineerd?",
    prompt_en: "Have they coordinated the information of the move?",
    expected_responses: [
        { nl: "ja, de situatie is zorgvuldig gecoördineerd", en: "Yes, the situation has been coordinated carefully" },
        { nl: "we hebben vandaag de reisplannen bijgewerkt", en: "We have updated the trip plans today" },
        { nl: "zelfs met problemen is het mogelijk binnenkort te verhuizen", en: "Even with problems, it is possible to move soon" }
    ]
},

{
    prompt_nl: "Waarom heb je de uitdagingen met de familie besproken?",
    prompt_en: "Why have you discussed the challenges with the family?",
    expected_responses: [
        { nl: "omdat hun verwachtingen heel hoog zijn", en: "Because their expectations are very high" },
        { nl: "het bespreken van problemen helpt de motivatie", en: "Discussing the problems helps motivation" },
        { nl: "we willen ons samen aanpassen aan de nieuwe situatie", en: "We want to adapt together to the new situation" }
    ]
},
{
    prompt_nl: "Is het nodig om het vervoerssysteem te evalueren?",
    prompt_en: "Is it necessary to evaluate the transport system?",
    expected_responses: [
        { nl: "ja, om het risico op het station te verminderen", en: "Yes, to reduce the risk at the station" },
        { nl: "we hebben eerder de prestaties van de bus geëvalueerd", en: "We have evaluated the bus performance before" },
        { nl: "daarom is een realistische aanpak vandaag mogelijk", en: "Therefore a realistic approach is possible today" }
    ]
},
{
    prompt_nl: "Heb je het concept van samenleving met je vrienden verduidelijkt?",
    prompt_en: "Have you clarified the concept of society with your friends?",
    expected_responses: [
        { nl: "ja, we hebben hun cultuur zorgvuldig geanalyseerd", en: "Yes, we have analyzed its culture carefully" },
        { nl: "het is een ingewikkeld maar zeer positief concept", en: "It is a complicated but very positive concept" },
        { nl: "bovendien helpt het om eerdere ervaringen te begrijpen", en: "In addition it helps to understand past experiences" }
    ]
},
{
    prompt_nl: "Zijn de resultaten van je werk toegenomen?",
    prompt_en: "Have the results of your work increased?",
    expected_responses: [
        { nl: "ja, ik heb deze maand mijn prestaties verhoogd", en: "Yes, I have achieved increasing my performance this month" },
        { nl: "met een effectieve strategie is alles mogelijk", en: "With an effective strategy everything is possible" },
        { nl: "maar de huidige situatie is moeilijk", en: "However the current situation is difficult" }
    ]
},
{
    prompt_nl: "Hoe kunnen we een realistische aanpak voor de reis bereiken?",
    prompt_en: "How can we achieve a realistic approach for the trip?",
    expected_responses: [
        { nl: "we moeten de stappen van de reis zorgvuldig plannen", en: "We must plan the steps of the trip carefully" },
        { nl: "ondanks de uitdagingen is een realistische aanpak mogelijk", en: "Despite the challenges, a realistic approach is possible" },
        { nl: "ik wil vandaag een nieuwe strategie bespreken", en: "I want to discuss a new strategy today" }
    ]
},
{
    prompt_nl: "Heb je dit jaar een innovatiever systeem onderzocht?",
    prompt_en: "Have you explored a more innovative system this year?",
    expected_responses: [
        { nl: "ja, ik heb een nieuw professioneel systeem onderzocht", en: "Yes, I have explored a new professional system" },
        { nl: "we hebben de aanpak uitgebreid om resultaten te optimaliseren", en: "We have expanded the approach to optimize results" },
        { nl: "ik moet dit nog met mijn team bespreken", en: "I still need to discuss this with my team" }
    ]
},
{
    prompt_nl: "Ben je erin geslaagd de verwachtingen met je familie te coördineren?",
    prompt_en: "Have you achieved coordinating the expectations with your family?",
    expected_responses: [
        { nl: "ja, we hebben alles duidelijk besproken", en: "Yes, we have discussed everything clearly" },
        { nl: "een effectieve strategie vergroot de kans op succes", en: "An effective strategy increases the possibility of success" },
        { nl: "hoewel het moeilijk is, werken we samen aan verbetering", en: "Although it is difficult, we work together on improvement" }
    ]
},
{
    prompt_nl: "Welke resultaten heb je op het werk geëvalueerd?",
    prompt_en: "What results have you evaluated at work?",
    expected_responses: [
        { nl: "ik heb vandaag een zeer positieve prestatie geëvalueerd", en: "I have evaluated a very positive performance today" },
        { nl: "bovendien zijn de procesresultaten realistisch", en: "In addition the process results are realistic" },
        { nl: "ik moet nog wat informatie analyseren", en: "I still need to analyze some information before" }
    ]
},
{
    prompt_nl: "Is het mogelijk je aan deze andere cultuur aan te passen?",
    prompt_en: "Is it possible to adapt to this different culture?",
    expected_responses: [
        { nl: "ja, ik heb me snel aan hun samenleving aangepast", en: "Yes, I have adapted to their society quickly" },
        { nl: "hoewel het ingewikkeld is, is de cultuur goed", en: "Although it is complicated, the culture is good" },
        { nl: "ondanks de uitdagingen is de aanpak positief", en: "Despite the challenges, the approach is positive" }
    ]
},
{
    prompt_nl: "Heb je daarom besloten de afgelegen reis te annuleren?",
    prompt_en: "Therefore have you decided to cancel the remote trip?",
    expected_responses: [
        { nl: "ja, de lange reis is erg duur", en: "Yes, the long term trip is very expensive" },
        { nl: "nee, ik wil die plek in de toekomst verkennen", en: "No, I want to explore that place in the future" },
        { nl: "ik wacht nog steeds op de bevestiging van het vervoer", en: "I am still waiting for the transport confirmation" }
    ]
},
{
    prompt_nl: "Welk professioneel concept wil je vandaag bespreken?",
    prompt_en: "What professional concept do you want to discuss today?",
    expected_responses: [
        { nl: "ik wil de strategie bespreken om doelen te bereiken", en: "I want to discuss the strategy to achieve goals" },
        { nl: "het concept van een realistische systeembenadering", en: "The concept of realistic system approach" },
        { nl: "we moeten eerst de resultaten van de maand verduidelijken", en: "We need to clarify the results of the month before" }
    ]
},
{
    prompt_nl: "Heb je aangedrongen op het versterken van dagelijkse communicatie?",
    prompt_en: "Have you insisted on strengthening daily communication?",
    expected_responses: [
        { nl: "ja, om de gesprekken van het team te optimaliseren", en: "Yes, to optimize team conversations" },
        { nl: "goede communicatie vermindert het risico op problemen", en: "Good communication reduces the risk of problems" },
        { nl: "zelfs met weinig tijd is het nodig om te praten", en: "Even with little time, it is necessary to talk" }
    ]
},
{
    prompt_nl: "Hoewel de situatie moeilijk is, is de aanpak effectief?",
    prompt_en: "Although the situation is difficult, is the approach effective?",
    expected_responses: [
        { nl: "ja, we hebben zeer positieve resultaten bereikt", en: "Yes, we have achieved very positive results" },
        { nl: "daarom willen we met dit plan doorgaan", en: "Therefore we want to continue with this plan" },
        { nl: "we moeten de prestaties nog een keer evalueren", en: "We need to evaluate the performance once more" }
    ]
},
{
    prompt_nl: "Hoe plan je de motivatie van de samenleving te vergroten?",
    prompt_en: "How do you plan to increase the motivation of society?",
    expected_responses: [
        { nl: "motivatie vergroten is een proces op lange termijn", en: "Increasing motivation is a long-term process" },
        { nl: "met een innovatief systeem en een positieve aanpak", en: "With an innovative system and a positive approach" },
        { nl: "het bespreken van uitdagingen helpt om dit te bereiken", en: "Discussing the challenges helps to achieve it" }
    ]
},
{
    prompt_nl: "Heb je de reisinformatie zorgvuldig geanalyseerd?",
    prompt_en: "Have you carefully analyzed the trip information?",
    expected_responses: [
        { nl: "ja, ik heb de tickets en het hotel eerder bekeken", en: "Yes, I have reviewed the tickets and the hotel before" },
        { nl: "de reis naar deze afgelegen plek heeft zijn risico’s", en: "The trip to this remote place has its risks" },
        { nl: "ik heb alles al voorbereid voor volgende maand", en: "I have already prepared everything for next month" }
    ]
}
]
};

const CEFR_CONVERSATION_AUDIO_A1 = [
    { nl: "wat zou je graag drinken", file: "wat-zou-je-graag-drinken.mp3", en: "What would you like to drink?" },
    { nl: "hoe gaat het vandaag met je", file: "hoe-gaat-het-vandaag-met-je.mp3", en: "How are you today?" },
    { nl: "waar woon je", file: "waar-woon-je.mp3", en: "Where do you live?" },
    { nl: "wat wil je eten", file: "wat-wil-je-eten.mp3", en: "What do you want to eat?" },
    { nl: "heb je honger", file: "heb-je-honger.mp3", en: "Are you hungry?" },
    { nl: "wat doe je graag", file: "wat-doe-je-graag.mp3", en: "What do you like to do?" },
    { nl: "hoe laat sta je op", file: "hoe-laat-sta-je-op.mp3", en: "What time do you get up?" },
    { nl: "wil je vandaag uitgaan", file: "wil-je-vandaag-uitgaan.mp3", en: "Do you want to go out today?" },
    { nl: "wat ben je aan het doen", file: "wat-ben-je-aan-het-doen.mp3", en: "What are you doing?" },
    { nl: "wil je een film kijken", file: "wil-je-een-film-kijken.mp3", en: "Do you want to watch a movie?" },
    { nl: "waar is de badkamer", file: "waar-is-de-badkamer.mp3", en: "Where is the bathroom?" },
    { nl: "welke muziek vind je leuk", file: "welke-muziek-vind-je-leuk.mp3", en: "What music do you like?" },
    { nl: "wil je uitrusten", file: "wil-je-uitrusten.mp3", en: "Do you want to rest?" },
    { nl: "wat is er in de keuken", file: "wat-is-er-in-de-keuken.mp3", en: "What is in the kitchen?" },
    { nl: "wil je naar het hotel gaan", file: "wil-je-naar-het-hotel-gaan.mp3", en: "Do you want to go to the hotel?" },
    { nl: "welke fruit vind je lekker", file: "welke-fruit-vind-je-lekker.mp3", en: "What fruit do you like?" },

    // 🔥 Spanish → Dutch conversion required here
    { nl: "wil je meer nederlands leren", file: "wil-je-meer-nederlands-leren.mp3", en: "Do you want to learn more Dutch?" },

    { nl: "wat kijk je op televisie", file: "wat-kijk-je-op-televisie.mp3", en: "What do you watch on TV?" },
    { nl: "wil je brood met kaas", file: "wil-je-brood-met-kaas.mp3", en: "Do you want bread with cheese?" },
    { nl: "waar is je familie", file: "waar-is-je-familie.mp3", en: "Where is your family?" },
    { nl: "wil je met de bus gaan", file: "wil-je-met-de-bus-gaan.mp3", en: "Do you want to go by bus?" },
    { nl: "wat doe je thuis", file: "wat-doe-je-thuis.mp3", en: "What do you do at home?" }
];
const CEFR_CONVERSATION_AUDIO_A2 = [
    { nl: "wat doe je normaal in de ochtend", file: "wat-doe-je-normaal-in-de-ochtend.mp3", en: "What do you normally do in the morning?" },
    { nl: "wat zou je vandaag willen proberen", file: "wat-zou-je-vandaag-willen-proberen.mp3", en: "What would you like to try today?" },
    { nl: "hoe laat kwam je gisteravond aan", file: "hoe-laat-kwam-je-gisteravond-aan.mp3", en: "What time did you arrive last night?" },
    { nl: "wat lunch je normaal", file: "wat-lunch-je-normaal.mp3", en: "What do you normally have for lunch?" },
    { nl: "welke film wil je kijken", file: "welke-film-wil-je-kijken.mp3", en: "What movie do you want to watch?" },
    { nl: "welk bericht heb je ontvangen", file: "welk-bericht-heb-je-ontvangen.mp3", en: "What message did you receive?" },
    { nl: "wat ga je vanavond koken", file: "wat-ga-je-vanavond-koken.mp3", en: "What are you going to cook tonight?" },
    { nl: "welke taak heb je vandaag", file: "welke-taak-heb-je-vandaag.mp3", en: "What homework do you have today?" },
    { nl: "wat wil je bezoeken op je volgende reis", file: "wat-wil-je-bezoeken-op-je-volgende-reis.mp3", en: "What do you want to visit on your next trip?" },
    { nl: "rijd je vaak", file: "rijd-je-vaak.mp3", en: "Do you drive often?" },
    { nl: "waar wacht je vandaag op", file: "waar-wacht-je-vandaag-op.mp3", en: "What are you waiting for today?" },
    { nl: "wat zou je graag vergeten", file: "wat-zou-je-graag-vergeten.mp3", en: "What would you like to forget?" },
    { nl: "wat doe je voordat je gaat slapen", file: "wat-doe-je-voordat-je-gaat-slapen.mp3", en: "What do you do before sleeping?" },
    { nl: "wat doe je na de lunch", file: "wat-doe-je-na-de-lunch.mp3", en: "What do you do after lunch?" },
    { nl: "welk vervoer gebruik je normaal", file: "welk-vervoer-gebruik-je-normaal.mp3", en: "What transport do you normally use?" },
    { nl: "welke keuken vind je het lekkerst", file: "welke-keuken-vind-je-het-lekkerst.mp3", en: "Which kitchen do you like more?" },
    { nl: "wat ben je nu aan het doen", file: "wat-ben-je-nu-aan-het-doen.mp3", en: "What are you doing now?" },
    { nl: "welke schoenen draag je vandaag", file: "welke-schoenen-draag-je-vandaag.mp3", en: "What shoes are you wearing today?" },
    { nl: "wat zou je morgen willen koken", file: "wat-zou-je-morgen-willen-koken.mp3", en: "What would you like to cook tomorrow?" },
    { nl: "welke informatie heb je nodig", file: "welke-informatie-heb-je-nodig.mp3", en: "What information do you need?" },
    { nl: "wat doe je wanneer je thuis aankomt", file: "wat-doe-je-wanneer-je-thuis-aankomt.mp3", en: "What do you do when you arrive home?" },
    { nl: "wat zou je dit jaar willen bezoeken", file: "wat-zou-je-dit-jaar-willen-bezoeken.mp3", en: "What would you like to visit this year?" }
];const CEFR_CONVERSATION_AUDIO_B1 = [
    { nl: "wat heb je onlangs geleerd", file: "wat-heb-je-onlangs-geleerd.mp3", en: "What have you learned recently?" },
    { nl: "wat ben je nu aan het studeren", file: "wat-ben-je-nu-aan-het-studeren.mp3", en: "What are you studying now?" },
    { nl: "welke eerdere ervaringen herinner je het meest", file: "welke-eerdere-ervaringen-herinner-je-het-meest.mp3", en: "What past experiences do you remember most?" },
    { nl: "welke vaardigheden wil je verbeteren", file: "welke-vaardigheden-wil-je-verbeteren.mp3", en: "What skills do you want to improve?" },
    { nl: "waar werk je deze week aan", file: "waar-werk-je-deze-week-aan.mp3", en: "What are you working on this week?" },
    { nl: "welke gesprekken heb je vaak", file: "welke-gesprekken-heb-je-vaak.mp3", en: "What conversations do you often have?" },
    { nl: "wat heb je de laatste tijd gedaan", file: "wat-heb-je-de-laatste-tijd-gedaan.mp3", en: "What have you been doing lately?" },
    { nl: "wat wil je deze maand bereiken", file: "wat-wil-je-deze-maand-bereiken.mp3", en: "What do you want to achieve this month?" },
    { nl: "wat zou je graag blijven leren", file: "wat-zou-je-graag-blijven-leren.mp3", en: "What would you like to continue learning?" },
    { nl: "welke communicatie is belangrijk voor jou", file: "welke-communicatie-is-belangrijk-voor-jou.mp3", en: "What type of communication is important to you?" },
    { nl: "wat heb je onlangs gelezen", file: "wat-heb-je-onlangs-gelezen.mp3", en: "What have you been reading lately?" },
    { nl: "wat zou je morgen willen bereiden", file: "wat-zou-je-morgen-willen-bereiden.mp3", en: "What would you like to prepare tomorrow?" },
    { nl: "wat zou je dit jaar willen veranderen", file: "wat-zou-je-dit-jaar-willen-veranderen.mp3", en: "What would you like to change this year?" },
    { nl: "wat zou je graag blijven doen", file: "wat-zou-je-graag-blijven-doen.mp3", en: "What would you like to keep doing?" },
    { nl: "welke taken heb je deze week", file: "welke-taken-heb-je-deze-week.mp3", en: "What tasks do you have this week?" },
    { nl: "wat zou je vandaag willen vinden", file: "wat-zou-je-vandaag-willen-vinden.mp3", en: "What would you like to find today?" },
    { nl: "wat zou je deze maand willen annuleren", file: "wat-zou-je-deze-maand-willen-annuleren.mp3", en: "What would you like to cancel this month?" },
    { nl: "wat zou je willen meenemen naar de vergadering", file: "wat-zou-je-willen-meenemen-naar-de-vergadering.mp3", en: "What would you like to bring to the meeting?" },
    { nl: "wat ben je morgen van plan te doen", file: "wat-ben-je-morgen-van-plan-te-doen.mp3", en: "What do you plan to do tomorrow?" },
    { nl: "wat zou je beter willen begrijpen", file: "wat-zou-je-beter-willen-begrijpen.mp3", en: "What would you like to understand better?" },
    { nl: "wat zou je graag blijven nakijken", file: "wat-zou-je-graag-blijven-nakijken.mp3", en: "What would you like to keep reviewing?" }
];
const CEFR_CONVERSATION_AUDIO_B2 = [
    { nl: "welke strategie gebruik je om beter te leren", file: "welke-strategie-gebruik-je-om-beter-te-leren.mp3", en: "What strategy do you use to learn better?" },
    { nl: "hoe beoordeel je je prestaties op het werk", file: "hoe-beoordeel-je-je-prestaties-op-het-werk.mp3", en: "How do you evaluate your performance at work?" },
    { nl: "welk concept vind je de laatste tijd ingewikkeld", file: "welk-concept-vind-je-de-laatste-tijd-ingewikkeld.mp3", en: "What concept seems complicated to you lately?" },
    { nl: "welk risico vind je belangrijk in je werk", file: "welk-risico-vind-je-belangrijk-in-je-werk.mp3", en: "What risk do you consider important in your work?" },
    { nl: "welke mogelijkheid zou je graag verkennen", file: "welke-mogelijkheid-zou-je-graag-verkennen.mp3", en: "What possibility would you like to explore?" },
    { nl: "welke situatie heeft je onlangs beïnvloed", file: "welke-situatie-heeft-je-onlangs-beinvloed.mp3", en: "What situation has affected you recently?" },
    { nl: "hoe optimaliseer je elke dag je tijd", file: "hoe-optimaliseer-je-elke-dag-je-tijd.mp3", en: "How do you optimize your time each day?" },
    { nl: "welke professionele aanpak werkt het beste voor jou", file: "welke-professionele-aanpak-werkt-het-beste-voor-jou.mp3", en: "What professional approach works best for you?" },
    { nl: "welke taak zou je willen bijwerken", file: "welke-taak-zou-je-willen-bijwerken.mp3", en: "What task would you like to update?" },
    { nl: "wat heb je deze week geanalyseerd", file: "wat-heb-je-deze-week-geanalyseerd.mp3", en: "What have you analyzed this week?" },
    { nl: "wat zou je graag met je team bespreken", file: "wat-zou-je-graag-met-je-team-bespreken.mp3", en: "What would you like to discuss with your team?" },
    { nl: "wat heb je deze maand bereikt", file: "wat-heb-je-deze-maand-bereikt.mp3", en: "What have you achieved this month?" },
    { nl: "welke cultuur wil je graag verkennen", file: "welke-cultuur-wil-je-graag-verkennen.mp3", en: "What culture are you interested in exploring?" },
    { nl: "welke uitdagingen heb je onlangs gehad", file: "welke-uitdagingen-heb-je-onlangs-gehad.mp3", en: "What challenges have you faced recently?" },
    { nl: "welke verwachtingen heb je voor dit jaar", file: "welke-verwachtingen-heb-je-voor-dit-jaar.mp3", en: "What expectations do you have for this year?" },
    { nl: "welke situatie wil je graag verduidelijken", file: "welke-situatie-wil-je-graag-verduidelijken.mp3", en: "What situation would you like to clarify?" },
    { nl: "welk proces zou je willen optimaliseren", file: "welk-proces-zou-je-willen-optimaliseren.mp3", en: "What process would you like to optimize?" },
    { nl: "welke informatie heb je onlangs geëvalueerd", file: "welke-informatie-heb-je-onlangs-evaluated.mp3", en: "What information have you evaluated recently?" },
    { nl: "welk idee zou je willen versterken", file: "welk-idee-zou-je-willen-versterken.mp3", en: "What idea would you like to strengthen?" },
    { nl: "welk onderwerp wil je dieper bespreken", file: "welk-onderwerp-wil-je-dieper-bespreken.mp3", en: "What topic would you like to discuss more deeply?" },
    { nl: "welke aanpak wil je dit jaar aanpassen", file: "welke-aanpak-wil-je-dit-jaar-aanpassen.mp3", en: "What approach would you like to adapt this year?" }
];

/* ============================================================
   GRAMMAR TAB
   ============================================================ */

function renderGrammarTab() {
    const container = document.getElementById("grammar-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Grammar — Level ${appState.currentLevel}</h2>
            <p>Breakdown of word types you're training.</p>
        </div>

        <div class="glass-panel quiz-card">
            <ul>
                ${Object.keys(grouped).map(cat => `
                    <li><strong>${cat}</strong>: ${grouped[cat].length} items</li>
                `).join("")}
            </ul>
            <p style="margin-top:10px;opacity:0.8;">
                Notice how connectors, verbs, adjectives and nouns combine.
            </p>
        </div>
    `;
}

/* ============================================================
   MINING REFERENCES TAB (FIXED AUDIO INTEGRATION)
   ============================================================ */
function renderMiningReferencesTab() {
  const tabContainer = document.getElementById("mining-content");
  if (!tabContainer) return;

  const miningData = typeof MINING_REFERENCES !== 'undefined' ? MINING_REFERENCES : null;
  if (!miningData) {
    tabContainer.innerHTML = `<div class="mining-references-container"><h2>Mining Terminology</h2><p>No mining data found.</p></div>`;
    return;
  }

  const categories = Object.keys(miningData);
  
  if (!window.currentMiningCategory) {
    window.currentMiningCategory = categories[0];
  }

  let htmlContent = `
    <div class="mining-references-container">
      <div class="tab-header-section" style="margin-bottom: 20px;">
        <h2>Mining Terminology</h2>
        <p class="section-subtitle" style="color: #94a3b8;">Explore key mining concepts with individual or sequential audio playback.</p>
      </div>
  `;

  // 1. Category Filter Buttons
  htmlContent += `<div class="category-selector-container" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">`;
  categories.forEach(cat => {
    const isActive = cat === window.currentMiningCategory ? 'active' : '';
    htmlContent += `
      <button class="category-btn ${isActive}" onclick="switchMiningCategory('${cat}')" 
        style="padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: ${isActive === 'active' ? 'var(--accent-color, #3b82f6)' : 'rgba(255,255,255,0.05)'}; color: white; cursor: pointer; font-weight: 600; transition: all 0.2s;">
        ${cat}
      </button>
    `;
  });
  htmlContent += `</div>`;

  // 2. Master Audio Control Bar
  htmlContent += `
    <div class="master-audio-controls" style="display: flex; gap: 10px; margin-bottom: 25px; align-items: center; flex-wrap: wrap; background: rgba(255,255,255,0.03); padding: 12px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <button onclick="playAllMiningAudio()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 6px;">
        ▶ Play All
      </button>
      <button onclick="pauseMiningAudio()" style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        ⏸ Pause
      </button>
      <button onclick="resumeMiningAudio()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        ▶ Resume
      </button>
      <button onclick="stopMiningAudio()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        ⏹ Stop
      </button>
    </div>
  `;

  // 3. Term Pills Grid Container (using speakDutch)
  htmlContent += `<div class="mining-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">`;
  
  const currentTerms = miningData[window.currentMiningCategory] || [];
  currentTerms.forEach((item) => {
    const safeNl = item.dutch.replace(/'/g, "\\'");
    
    htmlContent += `
      <div class="word-pill" style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); padding: 14px 18px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div class="pill-text-content">
          <div class="term-nl" style="font-weight: 700; font-size: 1.05rem; color: #ffffff; margin-bottom: 3px;">${item.dutch}</div>
          <div class="term-en" style="font-size: 0.9rem; color: #94a3b8;">${item.english}</div>
        </div>
        <button class="audio-btn" onclick="speakDutch('${safeNl}')" title="Listen" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
          🔊
        </button>
      </div>
    `;
  });

  htmlContent += `</div></div>`;
  tabContainer.innerHTML = htmlContent;
}

// Category Switcher Helper
window.switchMiningCategory = function(categoryName) {
  window.currentMiningCategory = categoryName;
  renderMiningReferencesTab();
};

// Sequential Audio Engine State & Controls
let miningAudioQueueIndex = 0;
let isMiningAudioPlaying = false;
let miningQueueTimeout = null;

window.playAllMiningAudio = function() {
  const miningData = MINING_REFERENCES[window.currentMiningCategory];
  if (!miningData || miningData.length === 0) return;

  if (miningAudioQueueIndex >= miningData.length) {
    miningAudioQueueIndex = 0;
  }
  
  isMiningAudioPlaying = true;
  playNextInMiningQueue();
};

function playNextInMiningQueue() {
  if (!isMiningAudioPlaying) return;
  const miningData = MINING_REFERENCES[window.currentMiningCategory];
  
  if (!miningData || miningAudioQueueIndex >= miningData.length) {
    isMiningAudioPlaying = false;
    miningAudioQueueIndex = 0;
    return;
  }

  const item = miningData[miningAudioQueueIndex];
  miningAudioQueueIndex++;

  speakDutch(item.dutch);

  miningQueueTimeout = setTimeout(() => {
    if (isMiningAudioPlaying) {
      playNextInMiningQueue();
    }
  }, 2200);
}

window.pauseMiningAudio = function() {
  isMiningAudioPlaying = false;
  if (miningQueueTimeout) {
    clearTimeout(miningQueueTimeout);
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

window.resumeMiningAudio = function() {
  if (isMiningAudioPlaying) return;
  
  const miningData = MINING_REFERENCES[window.currentMiningCategory];
  if (!miningData || miningData.length === 0) return;

  if (miningAudioQueueIndex > 0) {
    miningAudioQueueIndex = Math.max(0, miningAudioQueueIndex - 1);
  }

  isMiningAudioPlaying = true;
  playNextInMiningQueue();
};

window.stopMiningAudio = function() {
  isMiningAudioPlaying = false;
  miningAudioQueueIndex = 0;
  if (miningQueueTimeout) {
    clearTimeout(miningQueueTimeout);
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/* ============================================================
   BADGES (UPGRADED VISUAL EDITION)
   ============================================================ */
function updateBadges() {
    const list = document.getElementById("badge-list");
    if (!list) return;
    
    const badges = new Set(appState.badges);
    const currentReviewCount = typeof reviewList !== "undefined" ? reviewList.length : 0;

    Object.keys(appState.levelStats).forEach(level => {
        const s = appState.levelStats[level];
        if (s.listens >= 20) badges.add(`${level} Listener`);
        if (s.flashSeen >= 30) badges.add(`${level} Flash Master`);
        if (s.quizScore !== null && s.quizScore >= 80) badges.add(`${level} Quiz Ace`);
        if (s.buildCompleted >= 10) badges.add(`${level} Builder`);

        // CONVERSATION AND SENTENCE UPDATES
        if (s.sentenceCompleted >= 10) badges.add(`${level} Sentence Pro`);
        if (s.conversationCompleted >= 10) badges.add(`${level} Conversationalist`);
        
        // STREAK MILESTONES — Level Specific
        if (s.streak >= 3) badges.add(`${level} 🔥 Consistent Start`);
        if (s.streak >= 7) badges.add(`${level} 👑 Habitual Hero`);
        if (s.streak >= 14) badges.add(`${level} 🔮 Unstoppable Force`);

        // COMBINED TRACKING (5-Day Streak + Clean Review Slate)
        if (s.streak >= 5 && currentReviewCount === 0) {
            badges.add(`${level} 🧹 Clean Slate Savvy`);
        }
    });

    appState.badges = Array.from(badges);
    saveState();

    if (appState.badges.length === 0) {
        list.innerHTML = `<li style="list-style: none; text-align: center; color: rgba(255,255,255,0.4); padding: 10px;">No badges yet. Keep training!</li>`;
        return;
    }

    // Maps text strings into highly visual glass cards
    list.innerHTML = appState.badges.map(badgeText => {
        // Assign dynamic visual anchors (icons) depending on the badge text contents
        let icon = "🎖️"; // Default fallback badge icon
        let desc = "Completed a major training target.";

        if (badgeText.includes("Listener")) { icon = "🎧"; desc = "Listened to over 20 core level items."; }
        else if (badgeText.includes("Flash Master")) { icon = "🎴"; desc = "Reviewed over 30 interactive cards."; }
        else if (badgeText.includes("Quiz Ace")) { icon = "🎯"; desc = "Scored an amazing 80%+ on vocabulary checks."; }
        else if (badgeText.includes("Builder")) { icon = "🧱"; desc = "Successfully constructed 10 full translations."; }
        else if (badgeText.includes("Sentence Pro")) { icon = "📝"; desc = "Passed 10 complex grammatical sentences."; }
        else if (badgeText.includes("Conversationalist")) { icon = "💬"; desc = "Maintained a conversation score above 70%."; }
        else if (badgeText.includes("Consistent Start")) { icon = "🔥"; desc = "Logged in and completed lessons 3 days in a row!"; }
        else if (badgeText.includes("Habitual Hero")) { icon = "👑"; desc = "Built an incredible 7-day learning routine!"; }
        else if (badgeText.includes("Unstoppable Force")) { icon = "🔮"; desc = "Two whole weeks of language study consistency!"; }
        else if (badgeText.includes("Clean Slate Savvy")) { icon = "🧹"; desc = "Kept a 5-day streak alive with zero review errors."; }

        // Clean out any extra emojis present inside raw text titles
        const cleanTitle = badgeText.replace(/[🔥👑🔮🧹]/g, '').trim();

        // Returns an elegant HTML card template reusing your dashboard theme variables
        return `
            <li class="review-card" style="display: flex; align-items: center; gap: 16px; margin: 10px 0; list-style: none;">
                <div style="font-size: 2rem; min-width: 45px; text-align: center; filter: drop-shadow(0 0 8px rgba(0,255,255,0.4));">
                    ${icon}
                </div>
                <div>
                    <strong class="review-word-text" style="font-size: 15px;">${cleanTitle}</strong>
                    <div style="font-size: 12px; color: #a5f3fc; margin-top: 2px; opacity: 0.85;">${desc}</div>
                </div>
            </li>
        `;
    }).join("");
}



/* ============================================================
   STUDENT NAME BOX
   ============================================================ */

function initNameBox() {
    const input = document.getElementById("student-name");
    const btn = document.getElementById("save-name-btn");
    const status = document.getElementById("name-status");

    if (!input || !btn || !status) return;

    input.value = appState.studentName || "";

    btn.onclick = () => {
        const name = input.value.trim();
        if (!name) {
            status.textContent = "Please enter a name.";
            return;
        }
        appState.studentName = name;
        saveState();
        status.textContent = `Saved as "${name}".`;
    };
}

/* ============================================================
   SPEECH RATE CONTROL
   ============================================================ */

function initRateControl() {
    const slider = document.getElementById("rate");
    if (!slider) return;
    
    slider.value = appState.speechRate;

    slider.oninput = () => {
        appState.speechRate = parseFloat(slider.value);
        saveState();
    };
}


/* ============================================================
   PROGRESS METER CONTROLLER
   ============================================================ */

// Animates numbers seamlessly to prevent sudden UI jumps
function animateNumber(id, target, suffix = "%") {
    const el = document.getElementById(id);
    if (!el) return;
    
    let current = 0;
    if (target === 0) {
        el.textContent = "0" + suffix;
        return;
    }
    const step = target / 40;

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = Math.round(current) + suffix;
    }, 20);
}

function updateProgressMeters() {
    const stats = appState.levelStats[appState.currentLevel];
    if (!stats) return;

    // Defensive defaults so undefined never becomes NaN
    const streak = typeof stats.streak === "number" ? stats.streak : 0;
    const reviewDue = Array.isArray(window.reviewList) ? window.reviewList.length : 0;

    // Helper to safely assign style width targets without breaking layout pipelines
    const setWidth = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.style.width = val + "%";
    };

    // Bar widths (percentages based on level completions)
    setWidth("quiz-progress", stats.quizScore || 0);
    setWidth("build-progress", stats.buildCompleted || 0);
    setWidth("sentence-progress", stats.sentenceCompleted || 0);

    // Converts totals into relative visual widths out of realistic milestones
    const xpPercent = Math.min(((appState.totalXP || 0) / 1000) * 100, 100); 
    setWidth("xp-progress", xpPercent);

    const streakPercent = Math.min((streak / 7) * 100, 100); 
    setWidth("streak-progress", streakPercent);

    const scorePercent = Math.min(((appState.globalScore || 0) / 500) * 100, 100); 
    setWidth("score-progress", scorePercent);

    // Fills the review bar based on density (caps full layout visualization at 10 items)
    const reviewBarPercentage = Math.min((reviewDue / 10) * 100, 100);
    setWidth("review-progress", reviewBarPercentage);

    // Animated numbers (Passing specific suffix units to match format goals)
    animateNumber("quiz-number", stats.quizScore || 0);
    animateNumber("build-number", stats.buildCompleted || 0);
    animateNumber("sentence-number", stats.sentenceCompleted || 0);

    // Displays clear point trackers instead of confusing percentage markers
    animateNumber("xp-number", appState.totalXP || 0, " XP");
    animateNumber("streak-number", streak, streak === 1 ? " day" : " days");
    animateNumber("score-number", appState.globalScore || 0, " Pts");
    animateNumber("review-number", reviewDue, reviewDue === 1 ? " word" : " words");

    // Pulse animations
    pulseTile("quiz-tile");
    pulseTile("build-tile");
    pulseTile("sentence-tile");
    pulseTile("xp-tile");
    pulseTile("streak-tile");
    pulseTile("score-tile");
    pulseTile("review-tile");
}

/* ============================================================
   TILE PULSE ANIMATION
   ============================================================ */
function pulseTile(id) {
    const tile = document.getElementById(id);
    if (!tile) return;

    tile.classList.remove("pulse");
    void tile.offsetWidth; // Forces layout recalculation to re-trigger transition rules safely
    tile.classList.add("pulse");
}
/**
 * ==========================================================================
 * MASTER LESSON PLATFORM & TRANSLATION ENGINE
 * Core Unified Runtime Application Pipeline Script (Chunk 1 of 3)
 * ==========================================================================
 */

/* ============================================================
   GLOBAL TEXT NORMALIZATION LAYER (DUTCH VERSION)
   ============================================================ */

function normalizeDutch(str) {
    if (!str) return '';
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents (é, ë, etc.)
        .replace(/-/g, "")               // remove hyphens
        .replace(/\s+/g, " ")            // normalize spaces
        .trim()
        .toLowerCase();
}

function normalizeEnglish(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[-_.,?!]/g, " ")       // convert punctuation to safe gaps
        .replace(/\s+/g, " ")            // reduce to single spaces
        .trim();
}

function cleanStringForKeyboard(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9äëïöü]/g, " ").replace(/\s+/g, " ").trim();
}

function extractDutchText(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    if (obj.nl) return obj.nl;
    if (obj.dutch) return obj.dutch;
    return Object.values(obj)[0] || "";
}

/* ============================================================
   CERTIFICATE SYSTEM — CEFR LEVEL COMPLETION
   ============================================================ */

let certificates = {
    a1: false,
    a2: false,
    b1: false,
    b2: false
};

function saveCertificates() {
    localStorage.setItem("certificates", JSON.stringify(certificates));
}

function loadCertificates() {
    const saved = localStorage.getItem("certificates");
    if (saved) {
        try {
            certificates = JSON.parse(saved);
        } catch (e) {
            console.error("Error reading certificate collection state flags:", e);
        }
    }
}
loadCertificates();

function unlockCertificate(levelKey) {
    if (!levelKey) return;
    const lowerKey = levelKey.toLowerCase();
    if (lowerKey in certificates) {
        certificates[lowerKey] = true;
        saveCertificates();
    }
}

function renderCertificates() {
    const container = document.getElementById("certificates-container");
    if (!container) return;

    container.style.display = "block";

    const studentInputField = document.getElementById("student-name");
    const name = (typeof appState !== "undefined" && appState.studentName) || (studentInputField ? studentInputField.value : "") || "Learner";

    const today = new Date().toLocaleDateString();

    const setCertFields = (prefix, isActive) => {
        const nameEl = document.getElementById(`cert-${prefix}-name`);
        const dateEl = document.getElementById(`cert-${prefix}-date`);
        if (isActive && nameEl && dateEl) {
            nameEl.innerText = name;
            dateEl.innerText = today;
        }
    };

    setCertFields("a1", certificates.a1);
    setCertFields("a2", certificates.a2);
    setCertFields("b1", certificates.b1);
    setCertFields("b2", certificates.b2);
}

/* ============================================================
   LOAD PDF LIBRARIES (html2canvas + jsPDF)
   ============================================================ */
function loadPDFLibraries(callback) {
    if (window.html2canvas && window.jspdf) {
        callback();
        return;
    }

    const html2canvasScript = document.createElement("script");
    html2canvasScript.src = "https://cloudflare.com";

    const jsPDFScript = document.createElement("script");
    jsPDFScript.src = "https://cloudflare.com";

    let loaded = 0;
    function checkLoaded() {
        loaded++;
        if (loaded === 2) callback();
    }

    html2canvasScript.onload = checkLoaded;
    jsPDFScript.onload = checkLoaded;

    document.body.appendChild(html2canvasScript);
    document.body.appendChild(jsPDFScript);
}

function downloadCertificate(certId) {
    const element = document.getElementById(certId);
    if (!element) {
        alert("Certificate not found.");
        return;
    }

    loadPDFLibraries(() => {
        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            
            const { jsPDF } = window.jspdf || jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save(certId + ".pdf");
        }).catch(err => {
            console.error("PDF engine blueprint generation error:", err);
            alert("Error downloading certificate. Please check connection and try again.");
        });
    });
}

/* ============================================================
   GLOBAL TEXT NORMALIZATION LAYER (SPANISH → DUTCH)
   ============================================================ */

function normalizeDutch(str) {
    if (!str) return '';
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/-/g, "")               // remove hyphens
        .replace(/\s+/g, " ")            // normalize spaces
        .trim()
        .toLowerCase();
}

function normalizeEnglish(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[-_.,?!]/g, " ")       // convert punctuation to safe gaps
        .replace(/\s+/g, " ")            // reduce to single spaces
        .trim();
}

function cleanStringForKeyboard(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9äëïöü]/g, " ").replace(/\s+/g, " ").trim();
}

function extractDutchText(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    if (obj.nl) return obj.nl;
    if (obj.dutch) return obj.dutch;
    return Object.values(obj)[0] || "";
}

/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY SEARCH ENGINE (SPANISH → DUTCH)
   ============================================================ */

function globalLookup(word) {
    const queryCleanEng = normalizeEnglish(word);
    const queryCleanNl = normalizeDutch(word);
    if (!queryCleanEng && !queryCleanNl) return null;

    const levelsList = ["A1", "A2", "B1", "B2"];

    // 1. CEFR Vocabulary (A1–B2)
    for (const level of levelsList) {
        const vocab = CEFR_LEVELS?.[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.dutch && normalizeDutch(item.dutch) === queryCleanNl)
        );

        if (match) {
            const isDutchInput = match.dutch && normalizeDutch(match.dutch) === queryCleanNl;
            return {
                translation: isDutchInput ? match.english : match.dutch,
                label: isDutchInput ? "English" : "Dutch",
                speakText: match.dutch,
                source: "CEFR Vocabulary",
                level
            };
        }
    }

    // 2. CEFR Sentences
    for (const level of levelsList) {
        const bank = CEFR_SENTENCES?.[level];
        if (!bank) continue;

        const match = bank.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.dutch && normalizeDutch(item.dutch) === queryCleanNl)
        );

        if (match) {
            const isDutchInput = match.dutch && normalizeDutch(match.dutch) === queryCleanNl;
            return {
                translation: isDutchInput ? match.english : match.dutch,
                label: isDutchInput ? "English" : "Dutch",
                speakText: match.dutch,
                source: "CEFR Sentences",
                level
            };
        }
    }

    // 3. CEFR Sentence Choices
    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES?.[level];
        if (!bank) continue;

        const match = bank.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.correct?.nl && normalizeDutch(item.correct.nl) === queryCleanNl)
        );

        if (match) {
            const isDutchInput = match.correct?.nl && normalizeDutch(match.correct.nl) === queryCleanNl;
            return {
                translation: isDutchInput ? match.english : match.correct.nl,
                label: isDutchInput ? "English" : "Dutch",
                speakText: match.correct.nl,
                source: "Dialogue Choices",
                level
            };
        }
    }

    // 4. CEFR Phrases
    if (CEFR_PHRASES && !Array.isArray(CEFR_PHRASES)) {
        const matchingKey = Object.keys(CEFR_PHRASES).find(dutchKey => {
            const englishValue = CEFR_PHRASES[dutchKey];
            return (englishValue && normalizeEnglish(englishValue) === queryCleanEng) ||
                   (normalizeDutch(dutchKey) === queryCleanNl);
        });

        if (matchingKey) {
            const englishValue = CEFR_PHRASES[matchingKey];
            const isDutchInput = normalizeDutch(matchingKey) === queryCleanNl;
            return {
                translation: isDutchInput ? englishValue : matchingKey,
                label: isDutchInput ? "English" : "Dutch",
                speakText: matchingKey,
                source: "CEFR Phrases",
                level: "A1"
            };
        }
    }

    // 5. Listen Vocab
    if (LISTEN_VOCAB) {
        for (const lvlKey of Object.keys(LISTEN_VOCAB)) {
            const levelData = LISTEN_VOCAB[lvlKey];
            if (!levelData) continue;

            for (const catKey of Object.keys(levelData)) {
                const wordArray = levelData[catKey];
                if (!Array.isArray(wordArray)) continue;

                const matchNl = wordArray.find(nlWord => normalizeDutch(nlWord) === queryCleanNl);

                if (matchNl) {
                    const primaryRef = CEFR_LEVELS?.[lvlKey]?.find(item => normalizeDutch(item.dutch) === queryCleanNl);
                    const englishTranslation = primaryRef ? primaryRef.english : "Vocabulary item";

                    return {
                        translation: englishTranslation,
                        label: "English",
                        speakText: matchNl,
                        source: `Listen Vocab (${catKey})`,
                        level: lvlKey
                    };
                }
            }
        }
    }

    return null;
}
// 6. Word-by-word dictionary — WORD_DICT (KEY-VALUE DIRECTORY)
if (typeof WORD_DICT !== "undefined") {
    if (WORD_DICT[queryCleanEng]) {
        return { translation: WORD_DICT[queryCleanEng], label: "Dutch", speakText: WORD_DICT[queryCleanEng], source: "Word Dictionary", level: "GLOBAL" };
    }
    const reverseKeyMatch = Object.keys(WORD_DICT).find(k => normalizeDutch(WORD_DICT[k]) === queryCleanNl);
    if (reverseKeyMatch) {
        return { translation: reverseKeyMatch, label: "English", speakText: WORD_DICT[reverseKeyMatch], source: "Word Dictionary", level: "GLOBAL" };
    }
}

// ⭐ 6.5 MINING TERMINOLOGY SEARCH SUPPORT
if (typeof MINING_REFERENCES !== "undefined" && MINING_REFERENCES !== null) {
    for (const categoryKey of Object.keys(MINING_REFERENCES)) {
        const miningCategory = MINING_REFERENCES[categoryKey];
        if (!Array.isArray(miningCategory)) continue;

        const match = miningCategory.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.dutch && normalizeDutch(item.dutch) === queryCleanNl)
        );

        if (match) {
            const isDutchInput = match.dutch && normalizeDutch(match.dutch) === queryCleanNl;
            return {
                translation: isDutchInput ? match.english : match.dutch,
                label: isDutchInput ? "English" : "Dutch",
                speakText: match.dutch,
                source: `Mining Terminology (${categoryKey})`,
                level: "GLOBAL"
            };
        }
    }
}

// 7. Conversation Prompts — CEFR_CONVERSATION_PROMPTS
if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined" && CEFR_CONVERSATION_PROMPTS !== null) {
    for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
        const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
        if (!Array.isArray(prompts)) continue;
        
        const convoMatch = prompts.find(p => {
            const nlTxt = typeof p.dutch === 'object' ? extractDutchText(p.dutch) : p.dutch;
            return (p.english && normalizeEnglish(p.english) === queryCleanEng) ||
                   (nlTxt && normalizeDutch(nlTxt) === queryCleanNl);
        });
        
        if (convoMatch) {
            const targetDutchText = typeof convoMatch.dutch === 'object' ? extractDutchText(convoMatch.dutch) : convoMatch.dutch;
            const isDutchInput = targetDutchText && normalizeDutch(targetDutchText) === queryCleanNl;
            return { 
                translation: isDutchInput ? convoMatch.english : targetDutchText, 
                label: isDutchInput ? "English" : "Dutch",
                speakText: targetDutchText,
                source: "Conversation Prompt", 
                level: levelKey 
            };
        }
    }
}

// 8. Conversation Audio — A1–B2
const convoAudioBanks = [];
if (typeof CEFR_CONVERSATION_AUDIO_A1 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_A1);
if (typeof CEFR_CONVERSATION_AUDIO_A2 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_A2);
if (typeof CEFR_CONVERSATION_AUDIO_B1 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_B1);
if (typeof CEFR_CONVERSATION_AUDIO_B2 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_B2);

for (const bank of convoAudioBanks) {
    if (!bank || !Array.isArray(bank)) continue;
    const audioMatch = bank.find(a =>
        (a.english && normalizeEnglish(a.english) === queryCleanEng) ||
        (a.dutch && normalizeDutch(a.dutch) === queryCleanNl)
    );
    if (audioMatch) {
        const isDutchInput = audioMatch.dutch && normalizeDutch(audioMatch.dutch) === queryCleanNl;
        return {
            translation: isDutchInput ? audioMatch.english : audioMatch.dutch,
            label: isDutchInput ? "English" : "Dutch",
            speakText: audioMatch.dutch,
            source: "Conversation Audio",
            level: audioMatch.level || "GLOBAL"
        };
    }
}

return null;

/* ============================================================
   DYNAMIC EVERYDAY PHRASE TEMPLATE BLUEPRINTS (SUB-PARSER)
   ============================================================ */
const EVERYDAY_PHRASE_TEMPLATES = [
    {
        // Matches: "I would like to order [a steak / the coffee / beer...]"
        pattern: /^i would like to order (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Ik zou graag ${parsedTarget} bestellen`, label: "Dutch", speakText: `Ik zou graag ${parsedTarget} bestellen`, source: "Dynamic Order Template" };
        }
    },
    {
        // Matches: "I want to buy [new shoes / a ticket...]"
        pattern: /^i want to buy (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Ik wil ${parsedTarget} kopen`, label: "Dutch", speakText: `Ik wil ${parsedTarget} kopen`, source: "Dynamic Purchase Template" };
        }
    },
    {
        // Matches: "Can I buy [a beer / shoes / tickets / a book...]"
        pattern: /^can i buy (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Kan ik ${parsedTarget} kopen?`, label: "Dutch", speakText: `Kan ik ${parsedTarget} kopen?`, source: "Dynamic Transaction Template" };
        }
    },
    {
        // Matches: "Can I order [a coffee / tea / food...]"
        pattern: /^can i order (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Kan ik ${parsedTarget} bestellen?`, label: "Dutch", speakText: `Kan ik ${parsedTarget} bestellen?`, source: "Dynamic Transaction Template" };
        }
    },

    {
        // Matches: "Where can I find [the bathroom / a hotel...]"
        pattern: /^where can i find (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Waar kan ik ${parsedTarget} vinden?`, label: "Dutch", speakText: `Waar kan ik ${parsedTarget} vinden?`, source: "Dynamic Location Template" };
        }
    },
    {
        // Matches: "Is the [hotel / station] far"
        pattern: /^is the (.+) far$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Is ${parsedTarget} ver weg?`, label: "Dutch", speakText: `Is ${parsedTarget} ver weg?`, source: "Dynamic Distance Template" };
        }
    }
];

/**
 * Helper Sub-Parser Function: Breaks down compound template inputs (e.g. "a steak")
 * and cross-references them word-by-word against your massive single word dictionary map.
 */
function parseSubPhrase(phraseText) {
    if (!phraseText) return "";
    const cleanText = phraseText.trim().toLowerCase();
    const bits = cleanText.split(/\s+/).filter(b => b.length > 0);
    const translatedBits = [];

    bits.forEach(bit => {
        const look = globalLookup(bit);
        if (look) {
            const cleanTrans = (look.translation || look.dutch).split('/');
            translatedBits.push(cleanTrans[0].trim());
        } else if (typeof WORD_DICT !== "undefined" && WORD_DICT[bit]) {
            const dictTrans = WORD_DICT[bit].split('/');
            translatedBits.push(dictTrans[0].trim());
        } else {
            translatedBits.push(`[${bit}]`);
        }
    });

    return translatedBits.join(" ");
}
/* ============================================================
   DICTIONARY SEARCH INITIALIZER SYSTEM (PATTERN INTERCEPTOR)
   ============================================================ */

function initDictionarySearch() {
    const searchInput = document.getElementById("dict-search-input");
    const resultBox = document.getElementById("dict-search-result");

    if (!searchInput || !resultBox) return;

    let clearBtn = document.getElementById("dict-clear-btn");
    if (!clearBtn) {
        clearBtn = document.createElement("button");
        clearBtn.id = "dict-clear-btn";
        clearBtn.className = "pill";
        clearBtn.innerText = "✕ Clear";
        clearBtn.style.cssText = "padding: 6px 12px; font-size: 11px; margin-left: 8px; cursor: pointer; display: none; background: rgba(248,113,113,0.15); border: 1px solid rgba(248,113,113,0.3); color: #f87171;";
        searchInput.parentNode.insertBefore(clearBtn, searchInput.nextSibling);

        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            resultBox.innerHTML = "";
            clearBtn.style.display = "none";
            searchInput.focus();
        });
    }

    searchInput.addEventListener("input", () => {
        const rawValue = searchInput.value;
        const normalizedQuery = normalizeEnglish(rawValue);

        if (!rawValue.trim()) {
            resultBox.innerHTML = "";
            clearBtn.style.display = "none";
            return;
        }

        clearBtn.style.display = "inline-block";

        // B. INTERCEPT: Safe Array Destructuring Capture Group Reader
        for (const template of EVERYDAY_PHRASE_TEMPLATES) {
            const matchArray = normalizedQuery.match(template.pattern);
            if (matchArray && matchArray.length > 1) {
                const fullMatchText = matchArray[0];
                const capturedWordGroup = matchArray[1];
                const dynamicResult = template.translate(capturedWordGroup);
                renderPhraseBox(dynamicResult);
                return;
            }
        }

        // C. FALLBACK 1: Standard Static Phrase Match
        const phraseResult = globalLookup(rawValue);
        if (phraseResult) {
            renderPhraseBox(phraseResult);
            return;
        }

        // D. FALLBACK 2: Greedy Word-by-Word Split Layer
        const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 1) {
            const translatedSegments = [];
            const unknownWords = [];
            let i = 0;

            while (i < words.length) {
                let matched = false;

                for (let len = Math.min(4, words.length - i); len >= 2; len--) {
                    const chunk = words.slice(i, i + len).join(" ");
                    const chunkResult = globalLookup(chunk);

                    if (chunkResult) {
                        translatedSegments.push(chunkResult.translation || chunkResult.dutch);
                        i += len;
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    const word = words[i];
                    // Manual baseline injection filters for clean literal rendering fallbacks
                    if (word === "the") {
                        translatedSegments.push("de/het");
                        i++;
                        continue;
                    }
                    if (word === "far") {
                        translatedSegments.push("ver");
                        i++;
                        continue;
                    }

                    const wordResult = globalLookup(word);
                    if (wordResult) {
                        translatedSegments.push(wordResult.translation || wordResult.dutch);
                    } else {
                        unknownWords.push(word);
                        translatedSegments.push(`[${word}]`);
                    }
                    i++;
                }
            }

            const dutchSentence = translatedSegments.join(" ");
            renderPhraseBox({
                translation: dutchSentence,
                label: "Dutch",
                speakText: dutchSentence.replace(/[

\[\]

]/g, ""),
                source: "Sentence Split Fallback Mode",
                level: unknownWords.length === 0 ? "ALL FOUND" : "MISSING: " + unknownWords.join(", ")
            });
            return;
        }

        resultBox.innerHTML = `
            <div style="color: #f87171; font-style: italic; font-size: 13px; margin-top: 8px;">
                Term or everyday conversational pattern not found in database.
            </div>
        `;
    });

    function renderPhraseBox(res) {
        const outputText = res.translation || res.dutch;
        const outputLabel = res.label || "Dutch";
        const speechTarget = res.speakText || res.dutch;
        const cleanSpeechText = speechTarget.replace(/'/g, "\\'");

        resultBox.innerHTML = `
            <div style="padding: 10px; background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 10px; margin-top: 5px; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="color: #a5f3fc; font-weight: bold;">${outputLabel}:</span>
                    <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600; text-shadow: 0 0 6px rgba(74,222,128,0.45);">
                        ${outputText}
                    </span>
                    <button id="dict-speak-btn" class="pill" style="padding: 4px 10px; font-size: 11px; max-width: 50px; cursor: pointer;">🔊</button>
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px;">
                    Matched via ${res.source} (${res.level || "GLOBAL"})
                </div>
            </div>
        `;

        const speakBtn = document.getElementById("dict-speak-btn");
        if (speakBtn) {
            speakBtn.onclick = () => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
                utterance.lang = 'nl-NL';
                const speedSlider = document.getElementById('rate');
                if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
                window.speechSynthesis.speak(utterance);
            };
        }
    }
}

/* ============================================================
   STARTUP & EVENT INITIALIZATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadState === "function") loadState();
    if (typeof initTabNavigation === "function") initTabNavigation();     
    if (typeof activateTab === "function") activateTab("dashboard"); 
    if (typeof initRateControl === "function") initRateControl();       
    if (typeof initNameBox === "function") initNameBox();           
    if (typeof initDictionarySearch === "function") initDictionarySearch();  
    if (typeof initFreePracticex === "function") initFreePracticex();  

    const resetBtn = document.getElementById("resetAllLevelsBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const confirmReset = confirm("Are you completely sure you want to delete everything? This will permanently wipe your scores, XP, streaks, and review list tracking.");
            if (confirmReset) {
                if (typeof resetAllProgress === "function") {
                    resetAllProgress();
                } else {
                    localStorage.clear();
                    location.reload();
                }
            }
        });
    }

    if (typeof updateBadges === "function") updateBadges();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
});

/* ============================================================
   MISTAKEN AREAS — REVIEW SYSTEM ENGINE
   ============================================================ */

window.reviewList = [];
try {
    const savedReview = localStorage.getItem('reviewList');
    if (savedReview) window.reviewList = JSON.parse(savedReview);
} catch (e) {
    console.error("Error reading saved mistake logs:", e);
    window.reviewList = [];
}

function findAudioForDutch(dutchText) {
    if (!dutchText) return null;
    const clean = cleanStringForKeyboard(dutchText.toLowerCase());
    const banks = [];

    if (typeof CEFR_CONVERSATION_AUDIO_A1 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_A1)) banks.push(...CEFR_CONVERSATION_AUDIO_A1);
    if (typeof CEFR_CONVERSATION_AUDIO_A2 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_A2)) banks.push(...CEFR_CONVERSATION_AUDIO_A2);
    if (typeof CEFR_CONVERSATION_AUDIO_B1 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_B1)) banks.push(...CEFR_CONVERSATION_AUDIO_B1);
    if (typeof CEFR_CONVERSATION_AUDIO_B2 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_B2)) banks.push(...CEFR_CONVERSATION_AUDIO_B2);

    for (const item of banks) {
        if (!item || !item.nl || !item.audio) continue;
        if (cleanStringForKeyboard(item.nl.toLowerCase()) === clean) {
            return item.audio;
        }
    }
    return null;
}

function playReviewAudio(dutchText) {
    const audioFile = findAudioForDutch(dutchText);
    if (!audioFile) {
        if (typeof speakDutch === "function") speakDutch(dutchText);
        return;
    }
    try {
        const audio = new Audio(`audio/${audioFile}`);
        audio.play().catch(e => console.warn("Native file play stalled. Audio folder missing assets.", e));
    } catch (e) {
        console.error("Audio engine failed to load instance:", e);
    }
}

function addIncorrectWord(word) {
    if (!word) return;
    if (!window.reviewList.includes(word)) {
        window.reviewList.push(word);
        localStorage.setItem('reviewList', JSON.stringify(window.reviewList));
        renderReviewList();
        if (typeof updateProgressMeters === "function") updateProgressMeters();
    }
}

function clearWordFromReview(word) {
    window.reviewList = window.reviewList.filter(item => item !== word);
    localStorage.setItem('reviewList', JSON.stringify(window.reviewList));
    renderReviewList();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
}

function renderReviewList() {
    const listContainer = document.getElementById('review-words-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (window.reviewList.length === 0) {
        listContainer.innerHTML = '<p class="review-empty-msg">🎉 Great job! No words to review.</p>';
        return;
    }

    window.reviewList.forEach(word => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.margin = '10px 0';
        
        let dutchText = word;
        if (word.includes('➔')) {
            const parts = word.split('➔');
            dutchText = (parts && parts[1]) ? parts[1].trim() : word.trim();
        } else if (word.includes('→')) {
            const parts = word.split('→');
            dutchText = (parts && parts[1]) ? parts[1].trim() : word.trim();
        }

        card.innerHTML = `
            <span class="review-word-text">${word}</span>
            <div class="review-card-actions" style="display: flex; align-items: center; gap: 12px; margin-left: auto;">
                <button class="pill review-play-btn" style="min-width: 45px; padding: 10px 14px;">🔊 Play</button>
                <button class="pill got-it-btn">Got it!</button>
            </div>
        `;

        card.querySelector('.review-play-btn').addEventListener('click', () => {
            playReviewAudio(dutchText);
        });

        card.querySelector('.got-it-btn').addEventListener('click', () => {
            clearWordFromReview(word);
        });

        listContainer.appendChild(card);
    });
}

/* ============================================================
   GLOBAL FREE PRACTICE SANDBOX (UNSCORED)
   ============================================================ */
let currentPracticeWord = null;

function initFreePracticeSandbox() {
    const checkBtn = document.getElementById("practice-check-btn");
    const nextBtn = document.getElementById("practice-next-btn");
    const inputField = document.getElementById("practice-user-input");

    if (!checkBtn || !nextBtn || !inputField) return;

    getNewPracticeWord();

    checkBtn.addEventListener("click", evaluatePracticeAnswer);

    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") evaluatePracticeAnswer();
    });

    nextBtn.addEventListener("click", () => {
        getNewPracticeWord();
    });
}

function getNewPracticeWord() {
    const inputField = document.getElementById("practice-user-input");
    const feedbackBox = document.getElementById("practice-feedback");
    const wordPlaceholder = document.getElementById("practice-english-word");

    if (!wordPlaceholder || !inputField || !feedbackBox) return;

    inputField.value = "";
    feedbackBox.innerHTML = "";

    let masterPool = null;
    if (typeof CEFR_LEVELS !== "undefined" && CEFR_LEVELS !== null) {
        masterPool = CEFR_LEVELS;
    } else if (typeof vocabularyData !== "undefined" && vocabularyData !== null) {
        masterPool = vocabularyData;
    } else if (typeof dictData !== "undefined" && dictData !== null) {
        masterPool = dictData;
    }

    if (!masterPool) {
        wordPlaceholder.textContent = "Error: Vocabulary database not found.";
        return;
    }
    
    const levels = Object.keys(masterPool).filter(lvl => Array.isArray(masterPool[lvl]) && masterPool[lvl].length > 0);
    if (levels.length === 0) {
        wordPlaceholder.textContent = "Error: Level arrays are empty.";
        return;
    }
    
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const wordPool = masterPool[randomLevel];
    
    currentPracticeWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    wordPlaceholder.textContent = `${currentPracticeWord.english} (${randomLevel})`;
}

function evaluatePracticeAnswer() {
    const inputField = document.getElementById("practice-user-input");
    const feedbackBox = document.getElementById("practice-feedback");

    if (!inputField || !feedbackBox || !currentPracticeWord) return;

    const userTyped = inputField.value.trim();
    
    if (!userTyped) {
        feedbackBox.innerHTML = `<span style="color: #f87171;">Type an answer first!</span>`;
        return;
    }

    const cleanUser = normalizeDutch(userTyped);
    const cleanCorrect = normalizeDutch(currentPracticeWord.dutch);

    if (cleanUser === cleanCorrect) {
        const cleanSpeechText = currentPracticeWord.dutch.replace(/'/g, "\\'");
        
        feedbackBox.innerHTML = `
            <div style="color: #4ade80; font-weight: 600; padding: 6px; background: rgba(74,222,128,0.1); border-radius: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>Correct! 🎉 (${currentPracticeWord.dutch})</span>
                <button id="practice-speak-btn" class="pill" style="padding: 2px 8px; font-size: 10px; max-width: 40px; cursor: pointer;">🔊</button>
            </div>
        `;
        
        const speakBtn = document.getElementById("practice-speak-btn");
        if (speakBtn) {
            speakBtn.onclick = () => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
                utterance.lang = 'nl-NL';
                const speedSlider = document.getElementById('rate');
                if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
                window.speechSynthesis.speak(utterance);
            };
        }
        
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentPracticeWord.dutch);
        utterance.lang = 'nl-NL';
        const speedSlider = document.getElementById('rate');
        if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
        window.speechSynthesis.speak(utterance);
        
    } else {
        feedbackBox.innerHTML = `
            <div style="color: #f87171; font-weight: 500; padding: 6px; background: rgba(248,113,113,0.1); border-radius: 8px;">
                Not quite! "<strong>${currentPracticeWord.english}</strong>" translates to "<strong>${currentPracticeWord.dutch}</strong>". Try again, or click Skip.
            </div>
        `;
    }
}
/* ============================================================
   UNIFIED SECURE LIFECYCLE DEPLOYMENT HOOK
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    // 1. First, make sure the automatic vocabulary hydration expander loop compiles cleanly
    if (typeof autoExpandDictionary === "function") {
        console.log("🔄 Step 1: Hydrating Master Vocabulary Matrix...");
        autoExpandDictionary();
    }

    // 2. Second, boot up your floating scoring indicators and responsive iPhone lockouts
    if (typeof renderScoreDashboardUI === "function") {
        renderScoreDashboardUI();
    }
    if (typeof enforceMobileNavigationLocks === "function") {
        enforceMobileNavigationLocks();
    }

    // 3. Final Step: Safe delayed timeout execution to force synchronous sandbox database binding
    setTimeout(() => {
        console.log("🎯 Step 2: Binding Safe Vocabulary Links to Practice Sandbox...");
        if (typeof initFreePracticeSandbox === "function") {
            initFreePracticeSandbox();
        } else {
            console.error("❌ Fatal Error: initFreePracticeSandbox initialization function block is missing.");
        }
    }, 150); // 150ms delay provides ample breathing track space for long level data arrays to initialize
});
