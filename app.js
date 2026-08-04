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
    const currentPercent = Math.min(
        100,
        Math.round((correctUniqueCount / totalAvailableQueries) * 100)
    );

    return currentPercent;
}

/**
 * Gatekeeper Engine Check: Determines if a level tier is legally open for the user
 */
function isLevelUnlocked(levelKey) {
    if (levelKey === "A1") return true; // A1 is wide open by default
    if (levelKey === "A2") return calculateLevelPercentage("A1") >= PASSING_PERCENTAGE_CRITERIA;
    if (levelKey === "B1") return isLevelUnlocked("A2") &&
        calculateLevelPercentage("A2") >= PASSING_PERCENTAGE_CRITERIA;
    if (levelKey === "B2") return isLevelUnlocked("B1") &&
        calculateLevelPercentage("B1") >= PASSING_PERCENTAGE_CRITERIA;

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
        cefrUserProgressMatrix.currentScore += 10;
        cefrUserProgressMatrix.correctStreak += 1;

        localStorage.setItem(
            "cefr_user_score",
            cefrUserProgressMatrix.currentScore
        );

        localStorage.setItem(
            "cefr_user_streak",
            cefrUserProgressMatrix.correctStreak
        );

        localStorage.setItem(
            "cefr_mastered_fingerprints",
            JSON.stringify(cefrUserProgressMatrix.masteredItems)
        );

        evaluateMilestoneThresholds(levelKey);

    } else {

        cefrUserProgressMatrix.correctStreak += 1;

        localStorage.setItem(
            "cefr_user_streak",
            cefrUserProgressMatrix.correctStreak
        );
    }

    renderScoreDashboardUI();
}

/**
 * Milestone Review Tracker: Monitors percentages and pops up promotion modals
 */
function evaluateMilestoneThresholds(currentLevel) {

    const currentPercent = calculateLevelPercentage(currentLevel);

    console.log(
        `📊 Progress Matrix: Level ${currentLevel} is currently at ${currentPercent}% completion.`
    );

    if (currentPercent >= PASSING_PERCENTAGE_CRITERIA) {

        let nextLvlMap = {
            "A1": "A2",
            "A2": "B1",
            "B1": "B2"
        };

        let nextLevelName = nextLvlMap[currentLevel];

        if (nextLevelName) {

            const alreadyNotified =
                localStorage.getItem(`notified_pass_${currentLevel}`) === "true";

            if (!alreadyNotified) {
                localStorage.setItem(
                    `notified_pass_${currentLevel}`,
                    "true"
                );

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
        { dutch: "avegaarmijnbouw", english: "auger mining", category: "Open Cut Mining" },
        { dutch: "graafmachine met voorlader", english: "backhoe excavator", category: "Open Cut Mining" },
        { dutch: "bank", english: "bench", category: "Open Cut Mining" },
        { dutch: "berm", english: "berm", category: "Open Cut Mining" },
        { dutch: "boorpatroon", english: "blast pattern", category: "Open Cut Mining" },
        { dutch: "startgroeve", english: "box cut", category: "Open Cut Mining" },
        { dutch: "grootschalige mijnbouw", english: "bulk mining", category: "Open Cut Mining" },
        { dutch: "opvangberm", english: "catch bench", category: "Open Cut Mining" },
        { dutch: "kruin", english: "crest", category: "Open Cut Mining" },
        { dutch: "dozerval", english: "dozer trap", category: "Open Cut Mining" },
        { dutch: "dragline", english: "dragline", category: "Open Cut Mining" },
        { dutch: "boorinstallatie voor springgaten", english: "drill rig (rotary blasthole)", category: "Open Cut Mining" },
        { dutch: "stortplaats", english: "dump / waste dump", category: "Open Cut Mining" },
        { dutch: "elektrische kabelgraafmachine", english: "electric rope shovel", category: "Open Cut Mining" },
        { dutch: "externe stortplaats", english: "ex-pit dump", category: "Open Cut Mining" },
        { dutch: "winningfront", english: "face", category: "Open Cut Mining" },
        { dutch: "gehaltecontrole", english: "grade control", category: "Open Cut Mining" },
        { dutch: "transportweg", english: "haul road", category: "Open Cut Mining" },
        { dutch: "hoge wand", english: "highwall", category: "Open Cut Mining" },
        { dutch: "breek- en transportsysteem in de groeve", english: "in-pit crushing and conveying (IPCC)", category: "Open Cut Mining" },
        { dutch: "interne stortplaats", english: "in-pit dump", category: "Open Cut Mining" },
        { dutch: "bankhoogte", english: "lift", category: "Open Cut Mining" },
        { dutch: "laden en transporteren", english: "load-and-haul", category: "Open Cut Mining" },
        { dutch: "lage wand", english: "lowwall", category: "Open Cut Mining" },
        { dutch: "levensduur van de mijn", english: "mine life", category: "Open Cut Mining" },
        { dutch: "mijnplan", english: "mine plan", category: "Open Cut Mining" },
        { dutch: "mobiele breker", english: "mobile crusher", category: "Open Cut Mining" },
        { dutch: "schroothoop", english: "muckpile", category: "Open Cut Mining" },
        { dutch: "dagbouw", english: "open-cut / open-pit", category: "Open Cut Mining" },
        { dutch: "deklaag", english: "overburden", category: "Open Cut Mining" },
        { dutch: "perimeterberm", english: "perimeter bund", category: "Open Cut Mining" },
        { dutch: "groevevloer", english: "pit floor", category: "Open Cut Mining" },
        { dutch: "uiteindelijke groevegrens", english: "pit limit / ultimate pit limit", category: "Open Cut Mining" },
        { dutch: "steengroeve", english: "quarry", category: "Open Cut Mining" },
        { dutch: "herverwerken", english: "rehandle", category: "Open Cut Mining" },
        { dutch: "milieurehabilitatie", english: "rehabilitation", category: "Open Cut Mining" },
        { dutch: "roterende boorinstallatie", english: "rotary blasthole drill", category: "Open Cut Mining" },
        { dutch: "ROM-opslagplaats", english: "run-of-mine (rom) pad", category: "Open Cut Mining" },
        { dutch: "veiligheidsberm", english: "safety bund", category: "Open Cut Mining" },
        { dutch: "voorafscheiding", english: "scalping", category: "Open Cut Mining" },
        { dutch: "taludstabiliteit", english: "slope stability", category: "Open Cut Mining" },
        { dutch: "stripratio", english: "stripping ratio", category: "Open Cut Mining" },
        { dutch: "oppervlaktemijnwerker", english: "surface miner", category: "Open Cut Mining" },
        { dutch: "taludvoet", english: "toe", category: "Open Cut Mining" },
        { dutch: "verwijdering van teelaarde", english: "topsoil stripping", category: "Open Cut Mining" },
        { dutch: "verkeersbeheerplan", english: "traffic management plan", category: "Open Cut Mining" },
        { dutch: "uiteindelijke groeve", english: "ultimate pit", category: "Open Cut Mining" },
        { dutch: "wiellader", english: "wheel loader", category: "Open Cut Mining" }
    ],

   "Underground Mining": [
    { dutch: "toegangsstol", english: "adit", category: "Underground Mining" },
    { dutch: "opvulling", english: "backfill", category: "Underground Mining" },
    { dutch: "blokafbouw", english: "block caving", category: "Underground Mining" },
    { dutch: "blokpijler", english: "block pillar", category: "Underground Mining" },
    { dutch: "trechterkamer", english: "drawbell", category: "Underground Mining" },
    { dutch: "afvoerpunt", english: "drawpoint", category: "Underground Mining" },
    { dutch: "instortingsmijnbouw", english: "caving", category: "Underground Mining" },
    { dutch: "dwarsgang", english: "crosscut", category: "Underground Mining" },
    { dutch: "horizontale galerij", english: "drift", category: "Underground Mining" },
    { dutch: "liggende wand", english: "footwall", category: "Underground Mining" },
    { dutch: "hangende wand", english: "hanging wall", category: "Underground Mining" },
    { dutch: "langewandmijnbouw", english: "longwall mining", category: "Underground Mining" },
    { dutch: "productieniveau", english: "production level", category: "Underground Mining" },
    { dutch: "raise", english: "raise", category: "Underground Mining" },
    { dutch: "schacht", english: "shaft", category: "Underground Mining" },
    { dutch: "stope", english: "stope", category: "Underground Mining" },
    { dutch: "bodemdaling", english: "subsidence", category: "Underground Mining" },
    { dutch: "ondersnijding", english: "undercut", category: "Underground Mining" },
    { dutch: "ondersnijdingsniveau", english: "undercut level", category: "Underground Mining" },
    { dutch: "winze", english: "winze", category: "Underground Mining" }
]
};

/* ============================================================
   CEFR SENTENCE BANKS (for Build tab)
   ============================================================ */

const CEFR_SENTENCES = {
    A1: [

        // Simple Greetings & Formal Introductions
        { english: "Hello, how are you?", dutch: "hallo hoe gaat het" },
        { english: "Good morning, sir.", dutch: "goedemorgen meneer" },
        { english: "Good afternoon, ma'am.", dutch: "goedemiddag mevrouw" },
        { english: "Good night, family.", dutch: "goedenacht familie" },
        { english: "Goodbye, my friend.", dutch: "tot ziens mijn vriend" },
        { english: "I am very happy today.", dutch: "ik ben vandaag erg blij" },
        { english: "How is he?", dutch: "hoe gaat het met hem" },
        { english: "How is she?", dutch: "hoe gaat het met haar" },
        { english: "Hello, good morning.", dutch: "hallo goedemorgen" },
        { english: "Goodbye, sir.", dutch: "tot ziens meneer" },

        // Travel, Transit & Essential Needs
        { english: "I would like water, please.", dutch: "ik wil graag water alstublieft" },
        { english: "I would like beer, please.", dutch: "ik wil graag bier alstublieft" },
        { english: "Where is the bathroom?", dutch: "waar is het toilet" },
        { english: "Where is the hotel?", dutch: "waar is het hotel" },
        { english: "The hotel is near.", dutch: "het hotel is dichtbij" },
        { english: "Where is the station?", dutch: "waar is het station" },
        { english: "Where is the train?", dutch: "waar is de trein" },
        { english: "Where is the bus?", dutch: "waar is de bus" },
        { english: "Where is the airport?", dutch: "waar is de luchthaven" },
        { english: "Where is the ticket?", dutch: "waar is het kaartje" },

        // Daily Routines, Work & Study
        { english: "I want a coffee.", dutch: "ik wil een koffie" },
        { english: "The coffee is hot.", dutch: "de koffie is heet" },
        { english: "I want to study more.", dutch: "meer studeren" },
        { english: "I want to work more.", dutch: "meer werken" },
        { english: "I want to read books.", dutch: "boeken lezen" },
        { english: "I want to write books.", dutch: "boeken schrijven" },
        { english: "I want to go home.", dutch: "naar huis gaan" },
        { english: "I want to rest.", dutch: "rusten" },
        { english: "I want to clean the house.", dutch: "het huis schoonmaken" },
        { english: "I want to cook today.", dutch: "vandaag koken" },
        { english: "I am learning.", dutch: "lerend" },
        { english: "He is fixing the television.", dutch: "hij repareert de televisie" },
        { english: "We are ready.", dutch: "wij zijn klaar" },
        { english: "The hour is near.", dutch: "het uur is dichtbij" },

        // Family, Home Life & Food Transactions
        { english: "She is my sister.", dutch: "zij is mijn zus" },
        { english: "I have two brothers.", dutch: "ik heb twee broers" },
        { english: "My friend is very happy.", dutch: "mijn vriend is erg blij" },
        { english: "We have hunger.", dutch: "wij hebben honger" },
        { english: "They have a big house.", dutch: "zij hebben een groot huis" },
        { english: "The food is good.", dutch: "het eten is goed" },
        { english: "I want bread and milk.", dutch: "ik wil brood en melk" },
        { english: "Steak with french fries, please.", dutch: "biefstuk met friet alstublieft" },
        { english: "Rice without beans.", dutch: "rijst zonder bonen" },
        { english: "I like cold tea.", dutch: "ik houd van koude thee" },
        { english: "They like cheese and eggs.", dutch: "zij houden van kaas en eieren" },
        { english: "We like this place.", dutch: "wij houden van deze plek" }

    ],
A2: [

    // Time Sequences, Indicators, and Routines
    { english: "Normally I get up early.", dutch: "normaal vroeg opstaan" },
    { english: "I want to cook dinner now.", dutch: "ik wil nu avondeten koken" },
    { english: "She is learning fast now.", dutch: "zij leert nu snel" },
    { english: "He wants to finish homework early.", dutch: "hij wil vroeg zijn huiswerk afmaken" },
    { english: "They want information now.", dutch: "zij willen nu informatie" },
    { english: "The movie finishes in ten minutes.", dutch: "de film eindigt over tien minuten" },
    { english: "I have fifteen minutes now.", dutch: "ik heb nu vijftien minuten" },
    { english: "Anoche I was happy.", dutch: "gisteravond was ik blij" },
    { english: "Before, I want breakfast.", dutch: "vooraf wil ik ontbijt" },
    { english: "She already finished homework.", dutch: "zij heeft haar huiswerk al afgemaakt" },
    { english: "I still have problems.", dutch: "ik heb nog steeds problemen" },

    // Household Actions, Cooking, and Spaces
    { english: "The kitchen is clean now.", dutch: "de keuken is nu schoon" },
    { english: "Open the kitchen window, please.", dutch: "open het keukenraam alstublieft" },
    { english: "I want to try a new breakfast today.", dutch: "ik wil vandaag een nieuw ontbijt proberen" },
    { english: "I want to fix the window now.", dutch: "ik wil nu het raam repareren" },
    { english: "He is fixing the television in the house.", dutch: "hij repareert de televisie in huis" },
    { english: "We have food for lunch and dinner.", dutch: "wij hebben eten voor lunch en avondeten" },

    // Family Transactions & Travel Contexts
    { english: "We want to visit parents today.", dutch: "vandaag ouders bezoeken" },
    { english: "Where is my friend? I want to wait.", dutch: "waar is mijn vriend ik wil wachten" },
    { english: "I want to drive to the airport.", dutch: "naar de luchthaven rijden" },

    // Messages, Information & Communication Loops
    { english: "I want to read the message now.", dutch: "ik wil nu het bericht lezen" },
    { english: "She wants to write a message.", dutch: "zij wil een bericht schrijven" },
    { english: "He wants more information, please.", dutch: "hij wil meer informatie alstublieft" },
    { english: "Don't forget the message.", dutch: "vergeet het bericht niet" },

    // Travel Logistics, Apparel, & Social Scenarios
    { english: "Where is the plane? It is late.", dutch: "waar is het vliegtuig het is laat" },
    { english: "The plane arrives in twenty minutes.", dutch: "het vliegtuig komt over twintig minuten aan" },
    { english: "I need transport to the station.", dutch: "ik heb vervoer naar het station nodig" },
    { english: "They want to leave the hotel early.", dutch: "zij willen het hotel vroeg verlaten" },
    { english: "We arrived near the new place.", dutch: "wij zijn dichtbij de nieuwe plek aangekomen" },
    { english: "I want new shoes for the trip.", dutch: "ik wil nieuwe schoenen voor de reis" },
    { english: "She likes her small shoes.", dutch: "zij houdt van haar kleine schoenen" },
    { english: "Often, he likes this clean house.", dutch: "vaak houdt hij van dit schone huis" },

    // Number Assemblies & Quantities
    { english: "I have eleven new books.", dutch: "ik heb elf nieuwe boeken" },
    { english: "There are twelve buses in the station.", dutch: "er zijn twaalf bussen op het station" },
    { english: "Thirteen minutes to finish.", dutch: "dertien minuten om af te maken" },
    { english: "Fourteen fish and rice, please.", dutch: "veertien porties vis en rijst alstublieft" },
    { english: "We have fifteen eggs for breakfast.", dutch: "wij hebben vijftien eieren voor het ontbijt" },
    { english: "She has sixteen apples.", dutch: "zij heeft zestien appels" },
    { english: "Seventeen train tickets, please.", dutch: "zeventien treinkaartjes alstublieft" },
    { english: "Eighteen beers for the house.", dutch: "achttien bieren voor het huis" },
    { english: "Nineteen people study here.", dutch: "negentien mensen studeren hier" },
    { english: "Twenty minutes to rest.", dutch: "twintig minuten om uit te rusten" }

],

B1: [

    // Present Perfect & Continuous Actions (The Core B1 Milestone)
    { english: "I have been here for a month.", dutch: "ik ben hier een maand geweest" },
    { english: "You have learned fast during the trip.", dutch: "je hebt snel geleerd tijdens de reis" },
    { english: "He has worked hard today.", dutch: "hij heeft vandaag hard gewerkt" },
    { english: "We have studied the past experiences.", dutch: "wij hebben de ervaringen uit het verleden bestudeerd" },
    { english: "They have lived here for two years.", dutch: "zij hebben hier twee jaar gewoond" },
    { english: "She is working in the kitchen now.", dutch: "zij werkt nu in de keuken" },
    { english: "We are studying to improve our skills.", dutch: "wij studeren om onze vaardigheden te verbeteren" },
    { english: "He is reading a new book while waiting.", dutch: "hij leest een nieuw boek terwijl hij wacht" },
    { english: "They are living in a small place near school.", dutch: "zij wonen op een kleine plaats dichtbij school" },

    // Daily Life Management, Communication & Improvement
    { english: "I want to improve my communication skills.", dutch: "ik wil mijn communicatieve vaardigheden verbeteren" },
    { english: "We need to continue the conversations today.", dutch: "wij moeten de gesprekken vandaag voortzetten" },
    { english: "I want to understand the past experiences.", dutch: "ik wil de ervaringen uit het verleden begrijpen" },
    { english: "She wants to review the information now.", dutch: "zij wil de informatie nu bekijken" },
    { english: "He needs to prepare the daily homework.", dutch: "hij moet het dagelijkse huiswerk voorbereiden" },
    { english: "They want to follow the rules after lunch.", dutch: "zij willen de regels na de lunch volgen" },
    { english: "I want to get a ticket for the trip.", dutch: "ik wil een kaartje voor de reis krijgen" },
    { english: "We need to change the daily routine.", dutch: "wij moeten de dagelijkse routine veranderen" },
    { english: "However, I understand your problems.", dutch: "ik begrijp echter je problemen" },

    // Restaurant Transactions & Food Contexts
    { english: "Where is the new restaurant?", dutch: "waar is het nieuwe restaurant" },
    { english: "Bring the menu, please.", dutch: "breng het menu alstublieft" },

    // Restaurant Billings, Logistics & Connections
    { english: "Bring the bill to the table, please.", dutch: "breng de rekening naar de tafel alstublieft" },
    { english: "The bill is big after dinner.", dutch: "de rekening is hoog na het avondeten" },
    { english: "I want to understand the restaurant menu.", dutch: "ik wil het restaurantmenu begrijpen" },

    // Travel Logistics, Planning & Household Shifting
    { english: "I want to plan a new trip.", dutch: "ik wil een nieuwe reis plannen" },
    { english: "They want to find a hotel near the station.", dutch: "zij willen een hotel dichtbij het station vinden" },
    { english: "She needs to cancel her train ticket.", dutch: "zij moet haar treinkaartje annuleren" },
    { english: "He wants to bring his parents on the trip.", dutch: "hij wil zijn ouders meenemen op de reis" },
    { english: "We plan to move house this month.", dutch: "wij zijn van plan deze maand te verhuizen" },
    { english: "They want to join our trip today.", dutch: "zij willen vandaag met onze reis meegaan" },
    { english: "Where can I find transport now?", dutch: "waar kan ik nu vervoer vinden" },
    { english: "The plane was canceled last night.", dutch: "het vliegtuig werd gisteravond geannuleerd" },

    // Timeline Scales, Numbers & Duration Indicators
    { english: "He studied for an hour during lunch.", dutch: "hij studeerde een uur tijdens de lunch" },
    { english: "She has been working here for a month.", dutch: "zij werkt hier al een maand" },
    { english: "They have lived in this house for ten years.", dutch: "zij wonen al tien jaar in dit huis" },
    { english: "I need to review everything after this month.", dutch: "ik moet alles na deze maand bekijken" },
    { english: "We want to prepare the trip during the month.", dutch: "wij willen de reis gedurende de maand voorbereiden" },
    { english: "He has learned a lot about skills this year.", dutch: "hij heeft dit jaar veel over vaardigheden geleerd" },
    { english: "She wants to get information about the hotel before.", dutch: "zij wil vooraf informatie over het hotel krijgen" },
    { english: "They will continue studying after two years.", dutch: "zij zullen na twee jaar blijven studeren" },
    { english: "While studying, I want to improve daily.", dutch: "terwijl ik studeer wil ik dagelijks verbeteren" }

],

B2: [

    // Professional Strategies, Abstract Processes, and Analysis
    { english: "They want to analyze the situation.", dutch: "zij willen de situatie analyseren" },
    { english: "We need to evaluate the risks carefully.", dutch: "wij moeten de risico's zorgvuldig evalueren" },
    { english: "Although it was difficult, she finished the task.", dutch: "hoewel het moeilijk was heeft zij de taak voltooid" },
    { english: "They argued that the plan was not realistic.", dutch: "zij betoogden dat het plan niet realistisch was" },
    { english: "The strategy has increased our performance results.", dutch: "de strategie heeft onze prestatieresultaten verbeterd" },
    { english: "Therefore, it is necessary to analyze the risk concept.", dutch: "daarom is het noodzakelijk het risicoconcept te analyseren" },
    { english: "We need to coordinate a positive strategy to achieve results.", dutch: "wij moeten een positieve strategie coördineren om resultaten te behalen" },
    { english: "She has clarified her innovative approach during the discussion.", dutch: "zij heeft haar innovatieve aanpak tijdens de discussie verduidelijkt" },
    { english: "I want to update the system to strengthen our skills.", dutch: "ik wil het systeem bijwerken om onze vaardigheden te versterken" },
    { english: "He has explored every possibility to optimize the task.", dutch: "hij heeft elke mogelijkheid verkend om de taak te optimaliseren" },
    { english: "They argued that a professional approach is necessary.", dutch: "zij betoogden dat een professionele aanpak noodzakelijk is" },
    { english: "We have analyzed the complicated situation again.", dutch: "wij hebben de ingewikkelde situatie opnieuw geanalyseerd" },
    { english: "She has adapted the strategy to improve performance.", dutch: "zij heeft de strategie aangepast om de prestaties te verbeteren" },
    { english: "I want to try a positive approach now.", dutch: "ik wil nu een positieve aanpak proberen" },
    { english: "He forgot to check the results of the process.", dutch: "hij vergat de resultaten van het proces te controleren" },
    { english: "We must analyze the results carefully.", dutch: "wij moeten de resultaten zorgvuldig analyseren" },
    { english: "She wants to improve her performance.", dutch: "zij wil haar prestaties verbeteren" },
    { english: "We need to update the system.", dutch: "wij moeten het systeem bijwerken" },
    { english: "He explained the strategy clearly.", dutch: "hij legde de strategie duidelijk uit" },
    { english: "They want to optimize the process.", dutch: "zij willen het proces optimaliseren" },

    // Abstract Milestones, Culture, and Challenges
    { english: "We will continue even if there are challenges.", dutch: "wij zullen doorgaan zelfs als er uitdagingen zijn" },
    { english: "Despite the problems, they finished the trip.", dutch: "ondanks de problemen hebben zij de reis voltooid" },
    { english: "We need to adapt to the new situation.", dutch: "wij moeten ons aanpassen aan de nieuwe situatie" },
    { english: "She wants to expand her professional experience.", dutch: "zij wil haar professionele ervaring uitbreiden" },
    { english: "He insisted on reviewing the data again.", dutch: "hij stond erop de gegevens opnieuw te bekijken" },
    { english: "They hope to achieve better results.", dutch: "zij hopen betere resultaten te behalen" },
    { english: "We need to clarify the instructions.", dutch: "wij moeten de instructies verduidelijken" },
    { english: "Although it seems easy, it is complicated.", dutch: "hoewel het eenvoudig lijkt is het ingewikkeld" },
    { english: "She argued that the change was necessary.", dutch: "zij betoogde dat de verandering noodzakelijk was" },
    { english: "They want to strengthen the communication process.", dutch: "zij willen het communicatieproces versterken" },
    { english: "They discussed the situation for an hour during lunch.", dutch: "zij bespraken de situatie een uur tijdens de lunch" },
    { english: "She wants to learn about our society and culture.", dutch: "zij wil meer leren over onze maatschappij en cultuur" },
    { english: "In addition, motivation is necessary to achieve goals.", dutch: "bovendien is motivatie noodzakelijk om doelen te bereiken" },
    { english: "Expectations are high for the future long term trip.", dutch: "de verwachtingen zijn hoog voor de toekomstige langetermijnreis" },
    { english: "They live in a remote place, however they study daily.", dutch: "zij wonen op een afgelegen plek maar studeren dagelijks" },

    // Final Verification Loops & Resource Management
    { english: "I want to understand this abstract concept better.", dutch: "ik wil dit abstracte concept beter begrijpen" },
    { english: "We must prepare for possible system changes.", dutch: "wij moeten ons voorbereiden op mogelijke systeemwijzigingen" },
    { english: "They want to increase information access in society.", dutch: "zij willen de toegang tot informatie in de maatschappij vergroten" },
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
        { dutch: "afronden", english: "to finish", category: "Daily Life" },
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
        { dutch: "bedankt", english: "thank you", category: "Daily Life" },
        { dutch: "sorry", english: "sorry / I feel", category: "Daily Life" },
        { dutch: "bent", english: "you are", category: "Daily Life" },
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
        { dutch: "hebben", english: "we have", category: "Family" },
        { dutch: "hebben", english: "they have", category: "Family" },

        // Food & Drink
        { dutch: "water", english: "water", category: "Food & Drink" },
        { dutch: "eten", english: "food", category: "Food & Drink" },
        { dutch: "koffie", english: "coffee", category: "Food & Drink" },
        { dutch: "thee", english: "tea", category: "Food & Drink" },
        { dutch: "melk", english: "milk", category: "Food & Drink" },
        { dutch: "biefstuk", english: "steak", category: "Food & Drink" },
        { dutch: "friet", english: "french fries", category: "Food & Drink" },
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
        { dutch: "kaartje", english: "ticket", category: "Travel" },
        { dutch: "station", english: "station", category: "Travel" },
        { dutch: "luchthaven", english: "airport", category: "Travel" },
        { dutch: "huis", english: "house", category: "Travel" },
        { dutch: "school", english: "school", category: "Travel" },
        { dutch: "hotel", english: "hotel", category: "Travel" },
        { dutch: "toilet", english: "bathroom", category: "Travel" },
        { dutch: "plaats", english: "place", category: "Travel" },

        // Connectors & Pronouns
        { dutch: "en", english: "and", category: "Connectors" },
        { dutch: "of", english: "or", category: "Connectors" },
        { dutch: "met", english: "with", category: "Connectors" },
        { dutch: "zonder", english: "without", category: "Connectors" },
        { dutch: "meer", english: "more", category: "Connectors" },
        { dutch: "weinig", english: "little", category: "Connectors" },
        { dutch: "alleen", english: "only", category: "Connectors" },
        { dutch: "zeer", english: "very", category: "Connectors" },
        { dutch: "dichtbij", english: "near", category: "Connectors" },
        { dutch: "voor", english: "for", category: "Connectors" },
        { dutch: "naar", english: "to", category: "Connectors" },
        { dutch: "in", english: "in", category: "Connectors" },
        { dutch: "zij", english: "she", category: "Connectors" },
        { dutch: "hij", english: "he", category: "Connectors" },
        { dutch: "zij", english: "they", category: "Connectors" },
        { dutch: "zijn", english: "his / her / their", category: "Connectors" },
        { dutch: "wat", english: "what", category: "Connectors" },
        { dutch: "wie", english: "who", category: "Connectors" },
        { dutch: "wanneer", english: "when", category: "Connectors" },
        { dutch: "hoe", english: "how", category: "Connectors" },
        { dutch: "welke", english: "which", category: "Connectors" },
        { dutch: "waar", english: "where", category: "Connectors" },
        { dutch: "nee", english: "no / not", category: "Connectors" },
        { dutch: "ja", english: "yes", category: "Connectors" },
        { dutch: "er is", english: "there is / there are", category: "Connectors" },
        { dutch: "ander", english: "other / another", category: "Connectors" },
        { dutch: "ondanks", english: "despite", category: "Connectors" },
        { dutch: "alstublieft", english: "please", category: "Connectors" },
        { dutch: "mij", english: "myself / to me", category: "Connectors" },
        { dutch: "mijn", english: "my", category: "Connectors" },
        { dutch: "een", english: "a / an", category: "Connectors" },
        { dutch: "de", english: "the", category: "Connectors" },
        { dutch: "het", english: "the", category: "Connectors" },

        // Verbs & Participles
        { dutch: "is", english: "is", category: "Verbs" },
        { dutch: "houdt van", english: "likes", category: "Verbs" },
        { dutch: "houden van", english: "they like", category: "Verbs" },
        { dutch: "zou graag willen", english: "would like", category: "Verbs" },
        { dutch: "lerend", english: "learning", category: "Verbs" },
        { dutch: "reparerend", english: "fixing", category: "Verbs" },
        { dutch: "bent", english: "is / you are (formal)", category: "Verbs" },
        { dutch: "ik wil", english: "I want", category: "Verbs" },
        { dutch: "ik heb", english: "I have", category: "Verbs" },
        { dutch: "ik heb nodig", english: "I need", category: "Verbs" },

        // Adjectives
        { dutch: "goed", english: "good", category: "Adjectives" },
        { dutch: "moeilijk", english: "difficult", category: "Adjectives" },
        { dutch: "duidelijk", english: "clear", category: "Adjectives" },
        { dutch: "gemakkelijk", english: "easy", category: "Adjectives" },
        { dutch: "slecht", english: "bad", category: "Adjectives" },
        { dutch: "klein", english: "small", category: "Adjectives" },

        // Numbers
        { dutch: "een", english: "one", category: "Numbers" },
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
        { dutch: "avondeten", english: "dinner", category: "Daily Life" },
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
        { dutch: "vertrekken", english: "to leave", category: "Daily Life" },
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
        { dutch: "normaal", english: "normally", category: "Connectors" },
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
        { dutch: "heb", english: "I have (auxiliary)", category: "Daily Life" },
        { dutch: "hebt", english: "you have (auxiliary)", category: "Daily Life" },
        { dutch: "heeft", english: "he/she has (auxiliary)", category: "Daily Life" },
        { dutch: "hebben", english: "we have (auxiliary)", category: "Daily Life" },
        { dutch: "hebben", english: "you (plural) have (auxiliary)", category: "Daily Life" },
        { dutch: "hebben", english: "they have (auxiliary)", category: "Daily Life" },

        // Daily Life — participles
        { dutch: "geweest", english: "been", category: "Daily Life" },
        { dutch: "geleerd", english: "learned", category: "Daily Life" },
        { dutch: "werkend", english: "working", category: "Daily Life" },
        { dutch: "studerend", english: "studying", category: "Daily Life" },
        { dutch: "lezend", english: "reading", category: "Daily Life" },
        { dutch: "wonend", english: "living", category: "Daily Life" },
        { dutch: "dagelijks", english: "daily", category: "Daily Life" },

        // Daily Life — verbs & nouns
        { dutch: "communicatie", english: "communication", category: "Daily Life" },
        { dutch: "gesprekken", english: "conversations", category: "Daily Life" },
        { dutch: "verbeteren", english: "to improve", category: "Daily Life" },
        { dutch: "vaardigheden", english: "skills", category: "Daily Life" },
        { dutch: "bekijken", english: "to review", category: "Daily Life" },
        { dutch: "doorgaan", english: "to continue", category: "Daily Life" },
        { dutch: "volgen", english: "to follow", category: "Daily Life" },
        { dutch: "voorbereiden", english: "to prepare", category: "Daily Life" },
        { dutch: "verkrijgen", english: "to get", category: "Daily Life" },
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
        { dutch: "deelnemen", english: "to join", category: "Travel" },

        // Connectors
        { dutch: "terwijl", english: "while", category: "Connectors" },
        { dutch: "echter", english: "however", category: "Connectors" },
        { dutch: "over", english: "about", category: "Connectors" },
        { dutch: "na", english: "after", category: "Connectors" },
        { dutch: "tijdens", english: "during", category: "Connectors" },

        // Numbers & Time Scales
        { dutch: "maand", english: "month", category: "Numbers" },
        { dutch: "jaar", english: "years", category: "Numbers" }

    ],
	
B2: [

    // Daily Life — abstract nouns & professional vocabulary
    { dutch: "proces", english: "process", category: "Daily Life" },
    { dutch: "resultaten", english: "results", category: "Daily Life" },
    { dutch: "prestaties", english: "performance", category: "Daily Life" },
    { dutch: "strategie", english: "strategy", category: "Daily Life" },
    { dutch: "systeem", english: "system", category: "Daily Life" },
    { dutch: "aanpak", english: "approach", category: "Daily Life" },
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
    { dutch: "aanpassen", english: "to adapt", category: "Daily Life" },
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
    { dutch: "aangedrongen", english: "insisted", category: "Daily Life" },
    { dutch: "verkend", english: "explored", category: "Daily Life" },
    { dutch: "verduidelijkt", english: "clarified", category: "Daily Life" },
    { dutch: "versterkt", english: "strengthened", category: "Daily Life" },
    { dutch: "besproken", english: "discussed", category: "Daily Life" },
    { dutch: "bijgewerkt", english: "updated", category: "Daily Life" },
    { dutch: "geoptimaliseerd", english: "optimized", category: "Daily Life" },

    // Family — abstract B2 concepts
    { dutch: "maatschappij", english: "society", category: "Family" },
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
    { dutch: "opnieuw", english: "again", category: "Connectors" },
    { dutch: "zorgvuldig", english: "carefully", category: "Connectors" }

],
};

/* ============================================================
   LISTEN VOCAB — A1 → B2 (Category → Word List)
   ============================================================ */
const LISTEN_VOCAB = {
    A1: {
        "Daily Life": [
            "leven","werken","studeren","lezen","boeken","uur",
            "opstaan","muziek","televisie","schoonmaken","koken",
            "openen","afronden","schrijven","leren","gaan","doen",
            "zien","luisteren","uitgaan","rusten","heet","koud",
            "blij","nieuw","hallo","tot ziens","bedankt","sorry",
            "bent","klaar","wakker","tijd","problemen","verandering",
            "goedemorgen","goedemiddag","goedenavond","goed","meneer","mevrouw"
        ],
        "Family": [
            "familie","moeder","vader","zoon","dochter","vriend","vriendin",
            "zus","broers","zussen","grootmoeder","honger",
            "hebben","hebben"
        ],
        "Food & Drink": [
            "water","eten","koffie","thee","melk","biefstuk","friet",
            "brood","bier","ei","fruit","appel","sinaasappel",
            "banaan","kip","vis","soep","salade","rijst",
            "bonen","kaas","zout"
        ],
        "Travel": [
            "bus","trein","kaartje","station","luchthaven",
            "huis","school","hotel","toilet","plaats"
        ],
        "Connectors": [
            "en","of","met","zonder","meer","weinig","alleen","zeer",
            "dichtbij","voor","naar","in","wat","wie","wanneer",
            "hoe","welke","waar","nee","ja","er is","ander",
            "ondanks","alstublieft","mij","mijn","een","de","het",
            "zij","zijn"
        ],
        "Verbs": [
            "is","houdt van","houden van","zou graag willen","lerend","reparerend",
            "bent","ik wil","ik heb","ik heb nodig"
        ],
        "Adjectives": [
            "goed","moeilijk","duidelijk","gemakkelijk","slecht","klein"
        ],
        "Numbers": [
            "een","twee","drie","vier","vijf","zes","zeven","acht","negen","tien"
        ]
    },

    A2: {
        "Daily Life": [
            "ontbijt","lunch","avondeten","vroeg","laat","gisteravond",
            "nu","minuten","huiswerk","bericht","informatie",
            "film","raam","keuken","schoenen","reis","proberen",
            "vergeten","wachten","rijden","repareren","vertrekken","aankomen"
        ],
        "Family": [],
        "Travel": [
            "vliegtuig","bezoeken","vervoer"
        ],
        "Connectors": [
            "vaak","voor","al","nog steeds","normaal","omdat"
        ],
        "Numbers": [
            "elf","twaalf","dertien","veertien","vijftien",
            "zestien","zeventien","achttien","negentien","twintig"
        ]
    },

    B1: {
        "Daily Life": [
            "heb","hebt","heeft","hebben","hebben","hebben",
            "geweest","geleerd","werkend","studerend",
            "lezend","wonend","dagelijks",
            "communicatie","gesprekken","verbeteren",
            "vaardigheden","bekijken","doorgaan",
            "volgen","voorbereiden","verkrijgen","begrijpen"
        ],
        "Family": [
            "ervaringen","verleden"
        ],
        "Food & Drink": [
            "restaurant","menu","rekening"
        ],
        "Travel": [
            "vinden","annuleren","brengen","plannen",
            "verhuizen","deelnemen"
        ],
        "Connectors": [
            "terwijl","echter","over",
            "na","tijdens"
        ],
        "Numbers": [
            "maand","jaar"
        ]
    },

    B2: {
        "Daily Life": [
            "proces","resultaten","prestaties",
            "strategie","systeem","aanpak","concept",
            "risico","mogelijkheid","situatie",
            "optimaliseren","coördineren","verhogen","bijwerken",
            "analyseren","evalueren","bespreken","verduidelijken",
            "versterken","aanpassen","bereiken",
            "ingewikkeld","noodzakelijk","mogelijk","effectief",
            "realistisch","innovatief","professioneel","positief",
            "geanalyseerd","geëvalueerd","betoogd","uitgebreid",
            "aangepast","verminderd","aangedrongen","verkend",
            "verduidelijkt","versterkt","besproken","bijgewerkt",
            "geoptimaliseerd"
        ],
        "Family": [
            "maatschappij","cultuur","motivatie",
            "uitdagingen","verwachtingen"
        ],
        "Food & Drink": [],
        "Travel": [
            "afgelegen","toekomst","lange termijn"
        ],
        "Connectors": [
            "bovendien","daarom","ondanks",
            "hoewel","zelfs","opnieuw","zorgvuldig"
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

    /* ============================================================
       ENGLISH DIRECT ANCHORS & FUNCTIONAL OVERRIDES
       ============================================================ */
    "can": "kan / kunt / kan",
    "buy": "kopen",
    "order": "bestellen",
    "the": "de / het",
    "a": "een",
    "an": "een",
    "is": "is",
    "are": "zijn",
    "want": "wil / wil / willen / willen",
    "need": "heb nodig / heeft nodig / hebben nodig / hebben nodig",

    /* ============================================================
       VERB INFLECTION MATRIX (SUBJECT LOOPS)
       ============================================================ */
    "kan": "I can / he can",
    "kunt": "you can (formal / informal)",
    "kunnen": "we / they can",
    "wil": "I want / he wants",
    "willen": "we want / they want",
    "heb nodig": "I need",
    "heeft nodig": "he / she needs",
    "hebben nodig": "we / they need",
    "hebt": "you have",
    "doet": "you do / you make",
    "koop": "I buy",
    "koopt": "you buy",
    "bestel": "I order",
    "bestelt": "you order",

    /* ============================================================
       ADJECTIVE AGREEMENT AGREEMENTS
       ============================================================ */
    "goede": "good",
    "slechte": "bad",
    "nieuwe": "new",
    "kleine": "small",
    "koude": "cold",
    "grote": "big / large",
    "hoge": "tall",
    "schone": "clean",

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
    "zeer": "very",
    "dichtbij": "near",
    "voor": "for",
    "naar": "to",
    "in": "in / on",
    "door": "for / by",
    "van": "of / from",
    "naar de": "to the",
    "van de": "of the",
    "maar": "but",
    "omdat": "because",
    "ook": "also",
    "dan": "then",
    "ja": "yes / if",
    "er is": "there is / there are",
    "ander": "other / another",
    "andere": "other / another",
    "ondanks": "despite",
    "gunst": "favor",
    "alstublieft": "please",
    "terwijl": "while",
    "echter": "however",
    "over": "about / on top of",
    "na": "after",
    "tijdens": "during",
    "bovendien": "in addition / furthermore",
    "daarom": "therefore",
    "hoewel": "although",
    "zelfs": "even",
    "opnieuw": "again",
/* ============================
   Question Roots & Interrogatives
   ============================ */
"wat": "what",
"wie": "who",
"wanneer": "when",
"hoe": "how",
"welke": "which",
"waar": "where",
"waarom": "why",

/* ============================
   Grammatical Definite & Indefinite Articles
   ============================ */
"de": "the",
"het": "the",
"de_pl": "the (plural)",
"een": "a / an",
"sommige": "some",

/* ============================
   Pronouns & Object Markers
   =========================== */
"mij": "me / myself",
"je": "you / yourself",
"hem": "to him / him",
"haar": "to her / her",
"ons": "us / ourselves",
"hen": "to them",
"het_pronoun": "it",
"die": "that / which",
"hij": "he",
"zij": "she",
"ik": "I",
"jij": "you (informal)",
"wij": "we",
"ze": "they",
"jullie": "you all",
"mijn": "my",
"mijne": "my (plural)",
"zijn": "his / her / their / your",
"hun": "their",
"jouw": "your (possessive)",
"jullie_bezit": "your (possessive plural)",
"dit": "this (neutral)",
"deze": "this",
"dat": "that",
"iets": "something",
"alles": "everything / all",
"alle": "all",

/* ============================
   High-Frequency Verb Inflections (A1-B2)
   ============================ */
"is": "is",
"ben": "I am",
"bent": "you are",
"zijn": "they are / you all are",
"was": "was",
"waren": "were",
"wil": "I want / he or she wants",
"willen": "we want / they want",
"heb nodig": "I need",
"heeft nodig": "he / she needs",
"hebben nodig": "we need / they need",
"heb": "I have",
"heeft": "he / she has",
"hebben": "we have / they have",
"honger": "hunger (as in 'ik heb honger')",
"houdt van": "likes",
"houden van": "they like",
"zou graag willen": "would like",
"ik zou graag willen": "I would like",
"woon": "I live",
"wonen": "they live",
"werkt": "he / she works",
"werkend": "working",
"studerend": "studying",
"lerend": "learning",
"reparerend": "fixing",
"lezend": "reading",
"wonend": "living",
"wachtend": "waiting",
"kijkend": "watching / seeing",
"sprekend": "talking / speaking",
"kokend": "cooking",
"rijdend": "driving",
"plannend": "planning",
"ontbijtend": "eating breakfast",
"komt aan": "arrives / he or she arrives",
"kwamen aan": "we arrived",
"zullen aankomen": "they will arrive",
"arriveert": "I arrive / he or she arrives",
"opent": "opens",
"suggereerde": "suggested",
"betoogden": "argued",
"maakten af": "they finished",
"drong aan": "insisted",
"legde uit": "explained",
"vroeg": "asked for / requested",
"hielp": "helped",
"plannen": "they plan",
"ons aanpassen": "to adapt ourselves",
"ons voorbereiden": "to prepare ourselves",
"zal hebben": "he / she will have",
"zullen zijn": "they will be",
"voltooide": "completed",
"bezocht": "visited",
"vergat": "forgot",
"belde": "called",
"kocht": "I bought",
"maakte schoon": "I cleaned",
"schreef": "I wrote",
"zal studeren": "I will study",
"zal helpen": "I will help",
"zullen doorgaan": "we will continue",
"zullen eten": "we will eat",
"weggaan": "to leave / to go away",

/* ============================
   Time, Chronology & Adverbs
   ============================ */
"vandaag": "today",
"morgen": "tomorrow / morning",
"gisteren": "yesterday",
"gisteravond": "last night",
"nu": "now",
"altijd": "always",
"nooit": "never",
"al": "already / now",
"nog steeds": "still / yet",
"normaal": "normally",
"binnenkort": "soon",
"laat": "late / afternoon",
"vroeg": "early",
"vaak": "often",
"later": "later",
"vanavond": "tonight",
"om negen uur": "at nine",
"duidelijk": "clearly",
"langzaam": "slowly",
/* ============================
   Gender & Plural Adjective Maps
   ============================ */
"goed": "good",
"goede": "good",
"slecht": "bad",
"slechte": "bad",
"nieuw": "new",
"nieuwe": "new",
"klein": "small",
"kleine": "small",
"heet": "hot",
"hete": "hot",
"koud": "cold",
"koude": "cold",
"blij": "happy",
"blije": "happy",
"moeilijk": "difficult",
"moeilijke": "difficult",
"gemakkelijk": "easy",
"gemakkelijke": "easy",
"duidelijk": "clear / bright",
"grote": "big / large",
"hoog": "tall / high",
"hoge": "tall",
"heerlijk": "delicious",
"heerlijke": "delicious",
"vriendelijk": "kind / nice",
"vriendelijke": "kind / nice",
"schoon": "clean",
"schone": "clean",
"rood": "red",
"rode": "red",
"vertraagd": "delayed / late",
"realistisch": "realistic",
"realistische": "realistic",
"professioneel": "professional",
"professionele": "professional",
"innovatief": "innovative",
"innovatieve": "innovative",
"onnodig": "unnecessary",
"onnodige": "unnecessary",
"riskant": "risky",
"riskante": "risky",
"capabel": "capable",
"capabele": "capable",
"effectief": "effective",
"effectieve": "effective",
"positief": "positive",
"positieve": "positive",
"ingewikkeld": "complicated",
"ingewikkelde": "complicated",
"belangrijk": "important",
"belangrijke": "important",
"anders": "different",
"betere": "better",
"uitstekend": "excellent",
"uitstekende": "excellent",
"mogelijk": "possible",
"mogelijke": "possible",
"volgend": "next",
"volgende": "next",

/* ============================
   A2 Intermediate Core Numbers
   ============================ */
"elf": "eleven",
"twaalf": "twelve",
"dertien": "thirteen",
"veertien": "fourteen",
"vijftien": "fifteen",
"zestien": "sixteen",
"zeventien": "seventeen",
"achttien": "eighteen",
"negentien": "nineteen",
"twintig": "twenty"

}; // ✔ Safely closes the master WORD_DICT map shell container

/* ============================================================
   AUTO‑EXPAND DICTIONARY FROM CEFR LEVELS
   ============================================================ */
function autoExpandDictionary() {
    const allWords = Object.values(CEFR_LEVELS).flat();

    allWords.forEach(item => {
        if (!item || !item.dutch || !item.english) return;

        const key = item.dutch.toLowerCase().trim();
        const value = item.english.trim();

        WORD_DICT[key] = value; // Hydrates real vocabulary mappings natively
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
    "houd je van koffie": "you like coffee",
    "ik houd van muziek": "I like music",
    "ik woon in de stad": "I live in the city",
    "ik werk in een hotel": "I work in a hotel",
    "ik wil eten": "I want to eat",
    "ik wil drinken": "I want to drink",
    "waar is het toilet": "where is the bathroom",
    "zij rent snel": "she runs fast",
    "zij is snel": "she is fast",
    "zij gaat snel": "she goes fast",

    // A2
    "wat deed je gisteren": "what did you do yesterday",
    "ging je naar de supermarkt": "did you go to the supermarket",
    "reis je vaak": "you travel often",
    "wat heb je gekocht": "what did you buy",
    "wat ben je aan het doen": "what are you doing",
    "eet je meestal vroeg": "you usually eat early",
    "ik heb hulp nodig": "I need help",
    "ik wil een reservering maken": "I want to make a reservation",
    "waar is het station": "where is the station",

    // B1
    "ik ben nederlands aan het leren": "I have been learning Dutch",
    "ik geniet van reizen": "I enjoy traveling",
    "ik wil mijn vaardigheden verbeteren": "I want to improve my skills",
    "wat vind je van de stad": "what do you think of the city",
    "hoe onderhoud je een gezond leven": "how do you maintain a healthy life",
    "wat heb je recent geleerd": "what did you learn recently",
    "wat zijn je doelen": "what are your goals",
    "welke ervaringen heb je": "what past experiences do you have",

    // B2
    "hoe ga je om met stressvolle situaties": "how do you handle stressful situations",
    "wat is jouw mening over technologie": "what is your opinion on technology",
    "hoe is je leven veranderd": "how has your life changed",
    "met welke uitdagingen word je geconfronteerd": "what challenges do you face",
    "wat hoop je te bereiken": "what do you hope to achieve",
    "wat denk je over de toekomst": "what do you think about the future",
    "hoe zie je de moderne maatschappij": "how do you see modern society",
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

    // 1. CEFR sentences
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scan(item.dutch));
    });

    // 2. Build disruptors
    [
        "snel","langzaam","altijd","nooit","gisteren","morgen",
        "omdat","maar","zeer","ook","alleen","dan"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 3. Grammar helpers
    [
        "ik","jij","hij","zij","ze","wij","jullie",
        "ben","bent","is","zijn",
        "was","waren"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 4. Conversation fillers
    [
        "hallo","tot ziens","bedankt","alstublieft","sorry",
        "wat","wie","waar","wanneer","hoe","welke",
        "omdat","maar","ook","dan"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 5. Quiz distractors
    [
        "goed","slecht","groot","klein","gemakkelijk","moeilijk",
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
   SUPER VALIDATOR — AUTO-TRANSLATE + AUTO-CATEGORIZE + AUTO-FIX
   ============================================================ */

function validateAndEnhanceDictionary() {

    const missing = new Set();
    const added = [];

    // === CATEGORY DETECTORS ===
    const isArticle = w => ["de", "het", "een"].includes(w);
    const isPronoun = w => ["mij", "je", "hem", "haar", "ons", "hen"].includes(w);
    const isPreposition = w => ["naar", "van", "door", "voor", "met", "zonder", "in"].includes(w);
    const isConnector = w => ["en", "of", "maar", "omdat", "ook", "dan"].includes(w);
    const isAdverb = w => ["vandaag", "gisteren", "morgen", "nu", "binnenkort", "vroeg", "laat", "duidelijk"].includes(w);
    const isMultiWord = w => w.includes(" ");

    // === SMART TRANSLATION RULES ===
    function inferTranslation(word) {

        if (isArticle(word)) return "the";
        if (isPronoun(word)) return "it / him / her / them";
        if (isPreposition(word)) return "to / from / for / by / with";
        if (isConnector(word)) return "and / or / but / because / also / then";
        if (isAdverb(word)) return "time-related adverb";

        if (isMultiWord(word)) return "multi-word phrase";

        // Dutch infinitives
        if (word.endsWith("en")) return "to " + word.slice(0, -2);

        // Common Dutch past participles
        if (word.startsWith("ge")) return word + " (past participle)";

        // Common adjective endings
        if (word.endsWith("e")) return word + " (adjective)";

        return word + " (unclassified)";
    }

    // === TOKEN SCANNER ===
    function scanSentence(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    // === 1. Scan CEFR sentences ===
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scanSentence(item.dutch));
    });

    // === 2. Scan disruptors ===
    const BUILD_DISRUPTORS = [
        "snel", "langzaam", "altijd", "nooit", "gisteren", "morgen",
        "omdat", "maar", "zeer", "ook", "alleen", "dan"
    ];

    BUILD_DISRUPTORS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 3. Scan grammar helpers ===
    const SENTENCE_GRAMMAR = [
        "ik", "jij", "hij", "zij", "ze", "wij", "jullie",
        "ben", "bent", "is", "zijn",
        "was", "waren"
    ];

    SENTENCE_GRAMMAR.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 4. Scan conversation fillers ===
    const CONVERSATION_FILLERS = [
        "hallo", "tot ziens", "bedankt", "alstublieft", "sorry",
        "wat", "wie", "waar", "wanneer", "hoe", "welke",
        "omdat", "maar", "ook", "dan"
    ];

    CONVERSATION_FILLERS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 5. Scan quiz distractors ===
    const QUIZ_DISTRACTORS = [
        "goed", "slecht", "groot", "klein", "gemakkelijk", "moeilijk",
        "auto", "straat", "stad"
    ];

    QUIZ_DISTRACTORS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 6. Auto-add missing words with inferred translations ===
    missing.forEach(w => {
        if (!WORD_DICT[w]) {
            WORD_DICT[w] = inferTranslation(w);

            added.push({
                word: w,
                translation: WORD_DICT[w]
            });
        }
    });

    // === 7. Diagnostic report ===
    console.group("=== SUPER VALIDATOR REPORT ===");

    console.log("Missing words found:", missing.size);
    console.log("Auto-added:", added.length);

    if (added.length > 0) {
        console.log("=== Added Entries ===");

        added.forEach(entry => {
            console.log(`+ ${entry.word} → ${entry.translation}`);
        });
    }

    console.log("New dictionary size:", Object.keys(WORD_DICT).length);

    console.groupEnd();
}
/* ============================================================
   GRAMMAR ERROR EXPLAINER
   ============================================================ */
function explainGrammarError(user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    // Missing pronoun "je"
    if (c.includes("houd je van") && !u.includes("je") && u.includes("houd")) {
        return "You forgot the pronoun “je”. Dutch commonly uses “Je houdt van…” to mean “You like…”.";
    }

    // Missing article
    if ((c.includes("de ") || c.includes("het ")) &&
        !u.includes("de ") && !u.includes("het ")) {
        return "You missed the article (de/het). Dutch usually needs an article before nouns.";
    }

    // Wrong adverb vs frequency
    if (c.includes("vaak") && u.includes("langzaam")) {
        return "You used “langzaam” (slow) instead of a frequency word like “vaak” (often).";
    }

    // Wrong verb form
    if (c.split(" ")[0] !== u.split(" ")[0]) {
        return "Your verb form doesn’t match the target sentence. Check the conjugation.";
    }

    return "Your sentence is understandable, but the grammar or word choice doesn’t match the target answer.";
}

function getCEFRGrammarHint(level, user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    /* ============================
       A1 HINTS
       ============================ */
    if (level === "A1") {
        if (!u.includes("de") && !u.includes("het") &&
            (c.includes("de") || c.includes("het"))) {
            return "A1 hint: Remember to include articles (de/het) before nouns.";
        }

        if (!u.includes("je") && c.includes("houd je van")) {
            return "A1 hint: Use “je houdt van” to say “you like”.";
        }

        return "A1 hint: Focus on simple present tense and basic sentence structure.";
    }

    /* ============================
       A2 HINTS
       ============================ */
    if (level === "A2") {
        if (u.includes("langzaam") && c.includes("vaak")) {
            return "A2 hint: Use frequency words like “vaak” instead of speed words like “langzaam”.";
        }

        if (!u.includes("gisteren") && c.includes("gisteren")) {
            return "A2 hint: Practice past-time markers like “gisteren”.";
        }

        return "A2 hint: Practice common past tense verbs and daily routine vocabulary.";
    }

    /* ============================
       B1 HINTS
       ============================ */
    if (level === "B1") {
        if (!u.includes("omdat") && c.includes("omdat")) {
            return "B1 hint: Use connectors like “omdat” to explain reasons.";
        }

        if (!u.includes("dat") && c.includes("dat")) {
            return "B1 hint: Multi-clause sentences often require “dat”.";
        }

        return "B1 hint: Try adding connectors (omdat, hoewel, wanneer) to build longer sentences.";
    }

    /* ============================
       B2 HINTS
       ============================ */
    if (level === "B2") {
        if (!u.includes("hoewel") && c.includes("hoewel")) {
            return "B2 hint: Use contrast connectors like “hoewel” for complex ideas.";
        }

        if (!u.includes("voor") && c.includes("voor")) {
            return "B2 hint: Use “voor” to express purpose or intention.";
        }

        return "B2 hint: Aim for abstract vocabulary and multi-clause structures.";
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
   CATEGORY AUTO‑ASSIGNER — PLACE HERE
   ============================================================ */

function autoAssignCategory(word) {
    const w = word.dutch.toLowerCase();

    // Verbs (Dutch infinitives)
    if (w.endsWith("en"))
        return "verbs";

    // Adjectives
    if ([
        "goed","slecht","nieuw","klein","heet","koud","blij",
        "moeilijk","gemakkelijk","duidelijk","groot"
    ].includes(w))
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
        "luchthaven","hotel","taxi","trein","vliegtuig",
        "kaartje","kaart","stad","land","reis","toerist"
    ].includes(w))
        return "travel";

    // Daily life
    if ([
        "morgen","middag","avond","huis","werk",
        "school","dag","week","maand"
    ].includes(w))
        return "Daily Life";

    // Family
    if ([
        "moeder","vader","broer","zus","grootvader",
        "grootmoeder","oom","tante","neef","nicht","familie"
    ].includes(w))
        return "family";

    // Shopping
    if ([
        "geld","prijs","winkel","kopen",
        "verkopen","markt","product"
    ].includes(w))
        return "shopping";

    // Emergency
    if ([
        "hulp","politie","ziekenhuis",
        "ambulance","brand","noodgeval"
    ].includes(w))
        return "emergency";

    // Work
    if ([
        "werk","kantoor","manager",
        "werknemer","bedrijf","vergadering"
    ].includes(w))
        return "work";

    // Places / objects
    if ([
        "huis","school","park","straat",
        "deur","tafel","stoel","auto",
        "kamer","toilet"
    ].includes(w))
        return "places-objects";

    // Connectors
    if ([
        "en","maar","omdat","hoewel","wanneer",
        "als","of","dan","vervolgens",
        "na","voor"
    ].includes(w))
        return "connectors";

    // Grammar words
    if ([
        "de","het","een",
        "ik","jij","hij","zij",
        "wij","jullie","ze"
    ].includes(w))
        return "grammar";

    return "Daily Life";
}

/* ============================================================
   APPLY CATEGORIES TO ALL CEFR LEVELS — PLACE HERE
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

        if (raw) {
            Object.assign(appState, JSON.parse(raw));
        }

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
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(appState)
        );
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
    const todayStr = new Date().toLocaleDateString('en-CA'); // Formats cleanly as YYYY-MM-DD
    const lastActive = appState.lastActiveDate;

    // Fallback: Ensure active level stats object has a numeric streak parameter initialized
    if (typeof appState.levelStats[appState.currentLevel].streak !== "number") {
        appState.levelStats[appState.currentLevel].streak = 0;
    }

    // Case 1: First time playing, or progress was just reset
    if (!lastActive) {
        appState.levelStats[appState.currentLevel].streak = 1;
        appState.lastActiveDate = todayStr;
        saveState();
        return;
    }

    // Case 2: Already played today, do nothing to the count
    if (lastActive === todayStr) {
        return;
    }

    // Calculate the difference in calendar days
    const lastDateObj = new Date(lastActive);
    const todayDateObj = new Date(todayStr);
    const timeDiff = todayDateObj.getTime() - lastDateObj.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
        // Case 3: Played yesterday! Increment the consecutive day count
        appState.levelStats[appState.currentLevel].streak++;
    } else if (dayDiff > 1) {
        // Case 4: Skipped a day or more. Reset streak back to 1
        appState.levelStats[appState.currentLevel].streak = 1;
    }

    // Update the last active date milestone to today
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

    // ⭐ FIXED: Completely zeroes global metrics memory data structures
    appState.totalXP = 0;
    appState.globalScore = 0;
    appState.badges = [];
    appState.currentLevel = "A1";
    appState.lastActiveDate = null;

    // ⭐ FIXED: Clears your live review list array and local tracking storage
    reviewList = [];
    localStorage.removeItem("reviewList");

    // Save changes to disk memory
    saveState();

    // ⭐ FIXED: Instantly redraws the entire interface so everything clicks down to 0% right away
    updateBadges();
    updateProgressMeters();
    renderReviewList();

    // Optional: Take the user back to the clean dashboard overview tab
    activateTab("dashboard");

    console.log("🧼 Application data successfully cleared back to baseline!");
}

/* ============================================================
   DUTCH VOICE (Dutch TTS for explanations)
   ============================================================ */

function speak(text) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);

    u.lang = "nl-NL"; // Dutch voice
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
    "review" // ⭐ ADDED: Tells the routing loop your review panel exists
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

        // ⭐ INTEGRATION: Populates mining references whenever this tab is opened
        case "mining":
            renderMiningReferencesTab();
            break;

        // ⭐ INTEGRATION: Populates your mistake cards list whenever this tab is opened
        case "review":
            renderReviewList();
            break;

        case "dashboard":
            // static
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

// Initialize navigation + default tab
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

            alert("Alle niveaus zijn gereset. Je bent terug op A1!");
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

    // Pull the correct CEFR level vocabulary (already categorized)
    const levelData = LISTEN_VOCAB[appState.currentLevel];

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen — Level ${appState.currentLevel}</h2>
            <p>Tap a category, then click a word pill to hear it.</p>

            <div class="listen-player-controls" style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin-top:6px;
                justify-content:flex-start;
            ">
                <button class="pill" id="listen-playall">Play All</button>
                <button class="pill" id="listen-pause">Pause</button>
                <button class="pill" id="listen-resume">Resume</button>
                <button class="pill" id="listen-stop">Stop</button>
            </div>
        </div>
    `;

    /* ============================================================
       CATEGORY LIST (already grouped in LISTEN_VOCAB)
       ============================================================ */
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

                const entry = CEFR_LEVELS[appState.currentLevel]
                    .find(w => w.dutch === dutch);

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

    /* ============================================================
       CATEGORY COLLAPSE
       ============================================================ */
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

    /* ============================================================
       SINGLE WORD PLAYBACK
       ============================================================ */
    container.querySelectorAll(".pill[data-dutch]").forEach(btn => {

        btn.addEventListener("click", () => {

            speakDutch(btn.dataset.dutch);

            appState.levelStats[appState.currentLevel].listens++;

            saveState();
            updateBadges();
            updateProgressMeters();
        });
    });

    /* ============================================================
       AUTO PLAY — PLAY ALL WORDS
       ============================================================ */

    // Flatten all categories into one list
    listenAutoPlay.list = Object.values(levelData).flat();

    document.getElementById("listen-playall").onclick = () => {
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;

        playNextListenWord();
    };

    document.getElementById("listen-pause").onclick = () => {
        listenAutoPlay.paused = true;

        if (speechSynthesis.pause) {
            speechSynthesis.pause();
        }
    };

    document.getElementById("listen-resume").onclick = () => {
        listenAutoPlay.paused = false;

        if (speechSynthesis.resume) {
            speechSynthesis.resume();
        }

        playNextListenWord();
    };

    document.getElementById("listen-stop").onclick = () => {
        listenAutoPlay.active = false;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;

        if (speechSynthesis.cancel) {
            speechSynthesis.cancel();
        }
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
   FLASHCARDS — CATEGORY GROUPED + FLIP + AUDIO (STABLE VERSION)
   ============================================================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    /* ------------------------------------------------------------
       NORMALIZE CATEGORY KEYS (MERGES DUPLICATES)
       ------------------------------------------------------------ */
    const normalized = {};

    Object.keys(grouped).forEach(cat => {
        const cleanKey = cat.trim().toLowerCase();

        if (!normalized[cleanKey]) {
            normalized[cleanKey] = {
                display: cat.trim(),
                items: []
            };
        }

        normalized[cleanKey].items =
            normalized[cleanKey].items.concat(grouped[cat]);
    });

    /* ------------------------------------------------------------
       HEADER
       ------------------------------------------------------------ */
    let html = `
        <div class="glass-panel">
            <h2>Flashcards — Level ${appState.currentLevel}</h2>
            <p>Translate the word then tap the card to flip it over and see if you're correct. Dutch side plays audio.</p>
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

            const content = container.querySelector(
                `.flash-category-content[data-cat="${cat}"]`
            );

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

            const dutch = inner
                .querySelector(".fc-back")
                .textContent
                .trim();

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
}
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

        if (!opts.includes(w.dutch)) {
            opts.push(w.dutch);
        }
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
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    quizState.currentWord =
        words[Math.floor(Math.random() * words.length)];

    quizState.options =
        generateQuizOptions(words, quizState.currentWord);

    quizState.selected = null;

    container.innerHTML = `
    <div class="glass-panel quiz-card">
        <h2>Quiz — Level ${appState.currentLevel}</h2>
        <p>Select the correct Dutch for the English word.</p>

        <div id="qb-meta">
            <strong>English:</strong> ${quizState.currentWord.english}
        </div>

        <div id="qb-grid" class="sb-grid">
            ${quizState.options.map(opt => `
                <button class="pill" data-dutch="${opt}">
                    ${opt}
                </button>
            `).join("")}
        </div>

        <div id="qb-answer" class="qb-answer"></div>

        <div class="sb-controls quiz-controls-tight">
            <button id="qb-submit">Check</button>
            <button id="qb-next">Next</button>
            <button id="qb-harder"
                class="${quizState.harderMode ? "active" : ""}">
                Harder
            </button>
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

    // Pill selection
    grid.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {

            grid.querySelectorAll(".pill")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            quizState.selected = btn.dataset.dutch;
            answerBox.textContent = quizState.selected;
        });
    });

    // Helper: translate Dutch → English
    function getEnglishForDutch(dutchWord) {
        const levelWords = CEFR_LEVELS[appState.currentLevel];

        const match = levelWords.find(
            w => w.dutch === dutchWord
        );

        return match ? match.english : "[no match]";
    }

    // Check button
    submitBtn.addEventListener("click", () => {

        if (!quizState.selected) {
            feedback.textContent = "Choose an answer first.";
            return;
        }

        const correct = quizState.currentWord.dutch;
        const learnerDutch = quizState.selected;
        const learnerEnglish = getEnglishForDutch(learnerDutch);

        // Ensure quizScore is not null before incrementing
        if (
            appState.levelStats[appState.currentLevel].quizScore === null
        ) {
            appState.levelStats[appState.currentLevel].quizScore = 0;
        }

        // Correct / Incorrect feedback + NEW "You selected:"
        if (learnerDutch === correct) {

            feedback.innerHTML = `
                <div class="quiz-correct">Correct! 🎉</div>
                <div class="quiz-selected">
                    <strong>You selected:</strong>
                    ${learnerDutch} (${learnerEnglish})
                </div>
            `;

            appState.levelStats[appState.currentLevel].quizScore++;
            appState.levelStats[appState.currentLevel].quizCompleted++;

            // Increments global state stats when answers match perfectly
            appState.totalXP = (appState.totalXP || 0) + 10;
            appState.globalScore = (appState.globalScore || 0) + 5;

            // ⭐ UPDATED: Invokes calendar comparison check engine for daily streak increments
            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();

        } else {

            feedback.innerHTML = `
                <div class="quiz-incorrect">
                    Incorrect — correct answer: ${correct}
                </div>

                <div class="quiz-selected">
                    <strong>You selected:</strong>
                    ${learnerDutch} (${learnerEnglish})
                </div>
            `;

            // INTEGRATION: Formats the phrase "English ➔ Dutch" and adds it to your review tracking list
            const mistakeString =
                `${quizState.currentWord.english} ➔ ${correct}`;

            addIncorrectWord(mistakeString);
        }

        // Dutch audio
        setTimeout(() => speakQuiz(correct), 50);

        saveState();
    });

    // Next button
    nextBtn.addEventListener("click", () => {
        renderQuizTab();
    });

    // Harder mode toggle
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
        // Dutch-friendly normalization
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
        "omdat","maar","zeer","ook","alleen","dan"
    ];

    let bank = [...coreTokens];

    while (bank.length < coreTokens.length + 5) {
        const d = disruptors[Math.floor(Math.random() * disruptors.length)];

        if (!bank.includes(d)) {
            bank.push(d);
        }
    }

    bank = bank.sort(() => Math.random() - 0.5);

    buildState.tokens = bank;
    buildState.answer = [];

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Duplicate this sentence in Dutch</h2>
            <p class="build-english"><strong>English:</strong> ${english}</p>

            <div id="build-selected" class="build-selected"></div>

            <div id="build-words" class="sb-grid">
                ${bank.map(w => `
                    <button class="pill build-opt" data-token="${w}">
                        ${w}
                    </button>
                `).join("")}
            </div>

            <input
                id="build-input"
                class="input-field"
                placeholder="Or type the Dutch sentence…"
            >

            <div id="build-feedback"></div>

            <div class="sb-controls">
                <button id="build-undo">Undo</button>
                <button id="build-reset">Reset</button>
                <button id="build-check">Check</button>
                <button id="build-next">Next</button>
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

            selectedArea.textContent =
                buildState.answer.join(" ");
        });
    });

    input.addEventListener("input", () => {

        buildState.answer =
            input.value.trim().split(" ");

        selectedArea.textContent =
            buildState.answer.join(" ");
    });

    undoBtn.addEventListener("click", () => {

        buildState.answer.pop();

        selectedArea.textContent =
            buildState.answer.join(" ");

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

        // Translate learner answer to English
        const learnerEnglish = translateToEnglish(user);

        // Normalize input for keyboard-friendly matching
        const cleanCorrect = cleanStringForKeyboard(correct);
        const cleanUser = cleanStringForKeyboard(user);

        if (cleanUser === cleanCorrect) {

            feedback.innerHTML = `
                <span style="color:#4ade80;font-weight:600;">
                    Correct! 🎉
                </span><br><br>

                <strong>Your Translated Response is:</strong><br>
                ${learnerEnglish}
            `;

            appState.levelStats[appState.currentLevel].buildCompleted++;

            appState.totalXP =
                (appState.totalXP || 0) + 20;

            appState.globalScore =
                (appState.globalScore || 0) + 15;

            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();

            setTimeout(() => speakQuiz(correct), 50);

        } else {

            const correctTokens = correct.split(" ");
            const userTokens = buildState.answer;

            let html =
                `<strong>The correct answer is:</strong><br>${correct}<br><br>`;

            html +=
                `<strong>Your Answer:</strong><br>${user}<br><br>`;

            html +=
                `<strong>Your Translated Response is:</strong><br>${learnerEnglish}<br><br>`;

            html +=
                `<strong>Word-by-word feedback:</strong><br>`;

            userTokens.forEach((t, i) => {

                if (
                    cleanStringForKeyboard(correctTokens[i]) ===
                    cleanStringForKeyboard(t)
                ) {
                    html +=
                        `<span style="color:#4ade80;">${t} ✔</span> `;
                } else {
                    html +=
                        `<span style="color:#f87171;">${t} ✖</span> `;
                }
            });

            feedback.innerHTML = html;

            setTimeout(() => speakQuiz(correct), 50);

            const mistakeSentenceString =
                `${sentence.english} ➔ ${correct}`;

            addIncorrectWord(mistakeSentenceString);
        }

        saveState();
    });

    nextBtn.addEventListener("click", () => {
        renderBuildTab();
    });
}
/* ============================================================
   SENTENCE TAB — CEFR MULTIPLE‑CHOICE (FINAL MASTER VERSION)
   ============================================================ */

function generateSentenceForLevel(level) {
    const pool = CEFR_SENTENCE_CHOICES[level];

    const item =
        pool[Math.floor(Math.random() * pool.length)];

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

    // SAFETY CHECK — prevents crashes if level has no sentences
    if (!CEFR_SENTENCE_CHOICES[level]) {
        container.innerHTML =
            "<p>No sentences available for this level.</p>";
        return;
    }

    const q = generateSentenceForLevel(level);

    container.innerHTML = `
        <div class="glass-panel sentence-card">
            <h2>Sentence — Level ${level}</h2>
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
                <button id="sentence-next" class="pill">
                    Next
                </button>
            </div>
        </div>
    `;

    setupSentenceEvents(q);
}

function setupSentenceEvents(q) {

    // FIX: only select answer pills, not the Next button
    const buttons =
        document.querySelectorAll("#sentence-options .pill");

    const feedback =
        document.getElementById("sentence-feedback");

    const nextBtn =
        document.getElementById("sentence-next");

    // Translate Dutch → English using the current sentence item
    function getEnglishForDutch(dutchWord) {

        const match =
            q.options.find(opt => opt.nl === dutchWord);

        return match ? match.en : "[no match]";
    }

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            const chosen = btn.dataset.opt;
            const chosenEnglish =
                getEnglishForDutch(chosen);

            if (chosen === q.correct.nl) {

                feedback.innerHTML = `
                    <span style="color:#4ade80;font-weight:600;">
                        Correct! 🎉
                    </span><br>

                    <div class="sentence-selected">
                        <strong>You selected:</strong>
                        ${chosen} (${chosenEnglish})
                    </div>
                `;

                appState.levelStats[
                    appState.currentLevel
                ].sentenceCompleted++;

                // Increments global progress metrics on success
                appState.totalXP =
                    (appState.totalXP || 0) + 15;

                appState.globalScore =
                    (appState.globalScore || 0) + 10;

                // ⭐ UPDATED: Invokes calendar comparison check engine for daily streak increments
                checkAndAdvanceStreak();

                updateBadges();
                updateProgressMeters();

                speakQuiz(q.correct.nl);

            } else {

                feedback.innerHTML = `
                    <span style="color:#f87171;font-weight:600;">
                        Incorrect.
                    </span><br>

                    Correct answer:
                    <strong>${q.correct.nl}</strong><br>

                    <div class="sentence-selected">
                        <strong>You selected:</strong>
                        ${chosen} (${chosenEnglish})
                    </div>
                `;

                // INTEGRATION: Formats sentence mistake path and updates tracking engine
                const mistakeSentenceString =
                    `${q.english} ➔ ${q.correct.nl}`;

                addIncorrectWord(mistakeSentenceString);

                speakQuiz(q.correct.nl);
            }

            // Disable only answer buttons
            buttons.forEach(b => b.disabled = true);

            saveState();
        });
    });

    nextBtn.addEventListener("click", () => {
        renderSentenceTab();
    });
}
const CEFR_SENTENCE_CHOICES = {

    /* ============================
       A1 — Beginner
       ============================ */

    A1: [
    {
        english: "I’m a bit tired today.",
        correct: { nl: "ik ben vandaag een beetje moe", en: "I’m a bit tired today." },
        options: [
            { nl: "ik ben vandaag een beetje moe", en: "I’m a bit tired today." },
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
        correct: { nl: "wij zijn nu thuis", en: "We’re at home right now." },
        options: [
            { nl: "wij zijn nu thuis", en: "We’re at home right now." },
            { nl: "wij zijn nu op het werk", en: "We’re at work right now." },
            { nl: "wij zijn nu in de winkel", en: "We’re at the shop right now." }
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
        correct: { nl: "de bus komt laat aan", en: "The bus is running late." },
        options: [
            { nl: "de bus komt laat aan", en: "The bus is running late." },
            { nl: "de bus komt vroeg aan", en: "The bus is arriving early." },
            { nl: "de bus werkt niet", en: "The bus isn’t working." }
        ]
    },
    {
        english: "My mate is really nice.",
        correct: { nl: "mijn vriend is erg aardig", en: "My mate is really nice." },
        options: [
            { nl: "mijn vriend is erg aardig", en: "My mate is really nice." },
            { nl: "mijn vriend is erg serieus", en: "My mate is very serious." },
            { nl: "mijn vriend is erg luidruchtig", en: "My mate is very loud." }
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
        english: "I’m learning Spanish.",
        correct: { nl: "ik leer nederlands", en: "I’m learning Spanish." },
        options: [
            { nl: "ik leer nederlands", en: "I’m learning Spanish." },
            { nl: "ik leer engels", en: "I’m learning English." },
            { nl: "ik leer frans", en: "I’m learning French." }
        ]
    },
    {
        english: "The weather’s pretty warm today.",
        correct: { nl: "het weer is vandaag behoorlijk warm", en: "The weather’s pretty warm today." },
        options: [
            { nl: "het weer is vandaag behoorlijk warm", en: "The weather’s pretty warm today." },
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
            { nl: "de hond is erg luidruchtig", en: "The dog is very loud." },
            { nl: "de hond is erg klein", en: "The dog is very small." }
        ]
    },
    {
        english: "We’re having dinner now.",
        correct: { nl: "wij eten nu avondeten", en: "We’re having dinner now." },
        options: [
            { nl: "wij eten nu avondeten", en: "We’re having dinner now." },
            { nl: "wij eten nu ontbijt", en: "We’re having breakfast now." },
            { nl: "wij werken nu", en: "We’re working now." }
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
        correct: { nl: "het huis is behoorlijk groot", en: "The house is pretty big." },
        options: [
            { nl: "het huis is behoorlijk groot", en: "The house is pretty big." },
            { nl: "het huis is behoorlijk klein", en: "The house is pretty small." },
            { nl: "het huis is behoorlijk oud", en: "The house is pretty old." }
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
    },
	/* ===== A1 PART 2 (joined cleanly) ===== */

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
    correct: { nl: "ik kook avondeten", en: "I’m cooking dinner." },
    options: [
        { nl: "ik kook avondeten", en: "I’m cooking dinner." },
        { nl: "ik eet avondeten", en: "I’m eating dinner." },
        { nl: "ik maak ontbijt", en: "I’m making breakfast." }
    ]
},
{
    english: "The street is very quiet.",
    correct: { nl: "de straat is erg rustig", en: "The street is very quiet." },
    options: [
        { nl: "de straat is erg rustig", en: "The street is very quiet." },
        { nl: "de straat is erg luidruchtig", en: "The street is very noisy." },
        { nl: "de straat is erg druk", en: "The street is very busy." }
    ]
},
{
    english: "We’re watching a movie.",
    correct: { nl: "wij kijken een film", en: "We’re watching a movie." },
    options: [
        { nl: "wij kijken een film", en: "We’re watching a movie." },
        { nl: "wij maken een film", en: "We’re making a movie." },
        { nl: "wij kopen een film", en: "We’re buying a movie." }
    ]
},
{
    english: "The water is really cold.",
    correct: { nl: "het water is erg koud", en: "The water is really cold." },
    options: [
        { nl: "het water is erg koud", en: "The water is really cold." },
        { nl: "het water is erg heet", en: "The water is really hot." },
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
    correct: { nl: "de koffie ruikt erg lekker", en: "The coffee smells great." },
    options: [
        { nl: "de koffie ruikt erg lekker", en: "The coffee smells great." },
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
        { nl: "ik maak het toilet schoon", en: "I’m cleaning the bathroom." },
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
    correct: { nl: "wij wachten op de bus", en: "We’re waiting for the bus." },
    options: [
        { nl: "wij wachten op de bus", en: "We’re waiting for the bus." },
        { nl: "wij wachten op de trein", en: "We’re waiting for the train." },
        { nl: "wij wachten op een vriend", en: "We’re waiting for a mate." }
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
        { nl: "zij zingt", en: "She’s singing." },
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
    correct: { nl: "wij lopen samen", en: "We’re walking together." },
    options: [
        { nl: "wij lopen samen", en: "We’re walking together." },
        { nl: "wij rennen samen", en: "We’re running together." },
        { nl: "wij praten samen", en: "We’re talking together." }
    ]
}

], // ← CLEAN END OF A1 ARRAY
	/* ============================
   A2 — Elementary
   ============================ */

A2: [
{
    english: "We’re planning a trip next week.",
    correct: { nl: "wij plannen volgende week een reis", en: "We’re planning a trip next week." },
    options: [
        { nl: "wij plannen volgende week een reis", en: "We’re planning a trip next week." },
        { nl: "wij annuleren volgende week een reis", en: "We’re cancelling a trip next week." },
        { nl: "wij herinneren ons volgende week een reis", en: "We’re remembering a trip next week." }
    ]
},

{
    english: "I forgot my keys at home.",
    correct: { nl: "ik ben mijn sleutels thuis vergeten", en: "I forgot my keys at home." },
    options: [
        { nl: "ik ben mijn sleutels thuis vergeten", en: "I forgot my keys at home." },
        { nl: "ik ben mijn sleutels thuis kwijtgeraakt", en: "I lost my keys at home." },
        { nl: "ik heb mijn sleutels in de auto gelaten", en: "I left my keys in the car." }
    ]
},
{
    english: "They’re cooking dinner together.",
    correct: { nl: "zij koken samen avondeten", en: "They’re cooking dinner together." },
    options: [
        { nl: "zij koken samen avondeten", en: "They’re cooking dinner together." },
        { nl: "zij eten samen avondeten", en: "They’re eating dinner together." },
        { nl: "zij maken samen schoon", en: "They’re cleaning together." }
    ]
},
{
    english: "She often arrives late.",
    correct: { nl: "zij komt vaak laat aan", en: "She often arrives late." },
    options: [
        { nl: "zij komt vaak laat aan", en: "She often arrives late." },
        { nl: "zij komt vaak vroeg aan", en: "She often arrives early." },
        { nl: "zij komt vaak moe aan", en: "She often arrives tired." }
    ]
},
{
    english: "We’ll visit the market tomorrow.",
    correct: { nl: "wij bezoeken morgen de markt", en: "We’ll visit the market tomorrow." },
    options: [
        { nl: "wij bezoeken morgen de markt", en: "We’ll visit the market tomorrow." },
        { nl: "wij bezoeken morgen de winkel", en: "We’ll visit the shop tomorrow." },
        { nl: "wij bezoeken morgen het park", en: "We’ll visit the park tomorrow." }
    ]
},
{
    english: "I’m listening to a new song.",
    correct: { nl: "ik luister naar een nieuw lied", en: "I’m listening to a new song." },
    options: [
        { nl: "ik luister naar een nieuw lied", en: "I’m listening to a new song." },
        { nl: "ik zing een nieuw lied", en: "I’m singing a new song." },
        { nl: "ik schrijf een nieuw lied", en: "I’m writing a new song." }
    ]
},
{
    english: "She bought fresh fruit this morning.",
    correct: { nl: "zij kocht vanmorgen vers fruit", en: "She bought fresh fruit this morning." },
    options: [
        { nl: "zij kocht vanmorgen vers fruit", en: "She bought fresh fruit this morning." },
        { nl: "zij verkocht vanmorgen vers fruit", en: "She sold fresh fruit this morning." },
        { nl: "zij kookte vanmorgen vers fruit", en: "She cooked fresh fruit this morning." }
    ]
},
{
    english: "We’re waiting for our food.",
    correct: { nl: "wij wachten op ons eten", en: "We’re waiting for our food." },
    options: [
        { nl: "wij wachten op ons eten", en: "We’re waiting for our food." },
        { nl: "wij eten ons eten", en: "We’re eating our food." },
        { nl: "wij bereiden ons eten voor", en: "We’re preparing our food." }
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
        { nl: "zij rust nu uit", en: "She’s resting right now." }
    ]
},
{
    english: "We usually eat dinner at six.",
    correct: { nl: "wij eten meestal om zes uur avondeten", en: "We usually eat dinner at six." },
    options: [
        { nl: "wij eten meestal om zes uur avondeten", en: "We usually eat dinner at six." },
        { nl: "wij eten meestal om zes uur ontbijt", en: "We usually eat breakfast at six." },
        { nl: "wij gaan meestal om zes uur naar buiten", en: "We usually go out at six." }
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
    correct: { nl: "wij kwamen vanmorgen vroeg aan", en: "We arrived early this morning." },
    options: [
        { nl: "wij kwamen vanmorgen vroeg aan", en: "We arrived early this morning." },
        { nl: "wij kwamen vanmorgen laat aan", en: "We arrived late this morning." },
        { nl: "wij kwamen vanmorgen moe aan", en: "We arrived tired this morning." }
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
    correct: { nl: "ik zie je in het café", en: "I’ll meet you at the café." },
    options: [
        { nl: "ik zie je in het café", en: "I’ll meet you at the café." },
        { nl: "ik zie je in het park", en: "I’ll meet you at the park." },
        { nl: "ik zie je in de winkel", en: "I’ll meet you at the shop." }
    ]
},
{
    english: "She’s learning new words every day.",
    correct: { nl: "zij leert elke dag nieuwe woorden", en: "She’s learning new words every day." },
    options: [
        { nl: "zij leert elke dag nieuwe woorden", en: "She’s learning new words every day." },
        { nl: "zij vergeet elke dag woorden", en: "She’s forgetting words every day." },
        { nl: "zij leert anderen elke dag woorden", en: "She’s teaching words every day." }
    ]
},
{
    english: "We’re looking for a good restaurant.",
    correct: { nl: "wij zoeken een goed restaurant", en: "We’re looking for a good restaurant." },
    options: [
        { nl: "wij zoeken een goed restaurant", en: "We’re looking for a good restaurant." },
        { nl: "wij zoeken een goed hotel", en: "We’re looking for a good hotel." },
        { nl: "wij zoeken een goed park", en: "We’re looking for a good park." }
    ]
},
{
    english: "I’m finishing my work now.",
    correct: { nl: "ik maak mijn werk nu af", en: "I’m finishing my work now." },
    options: [
        { nl: "ik maak mijn werk nu af", en: "I’m finishing my work now." },
        { nl: "ik begin nu met mijn werk", en: "I’m starting my work now." },
        { nl: "ik verlaat nu mijn werk", en: "I’m leaving my work now." }
    ]
},

/* ===== A2 PART 2 (joined cleanly) ===== */
	{
    english: "She’s visiting her mum today.",
    correct: { nl: "zij bezoekt vandaag haar moeder", en: "She’s visiting her mum today." },
    options: [
        { nl: "zij bezoekt vandaag haar moeder", en: "She’s visiting her mum today." },
        { nl: "zij bezoekt vandaag haar vriendin", en: "She’s visiting her friend today." },
        { nl: "zij bezoekt vandaag haar zus", en: "She’s visiting her sister today." }
    ]
},
{
    english: "We’re having lunch at the market.",
    correct: { nl: "wij lunchen op de markt", en: "We’re having lunch at the market." },
    options: [
        { nl: "wij lunchen op de markt", en: "We’re having lunch at the market." },
        { nl: "wij ontbijten op de markt", en: "We’re having breakfast at the market." },
        { nl: "wij eten avondeten op de markt", en: "We’re having dinner at the market." }
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
    correct: { nl: "wij eten later samen", en: "We’ll eat together later." },
    options: [
        { nl: "wij eten later samen", en: "We’ll eat together later." },
        { nl: "wij ontbijten later samen", en: "We’ll have breakfast together later." },
        { nl: "wij eten later samen avondeten", en: "We’ll have dinner together later." }
    ]
},
{
    english: "I’m learning new phrases now.",
    correct: { nl: "ik leer nu nieuwe zinnen", en: "I’m learning new phrases now." },
    options: [
        { nl: "ik leer nu nieuwe zinnen", en: "I’m learning new phrases now." },
        { nl: "ik leer nu nieuwe woorden", en: "I’m learning new words now." },
        { nl: "ik leer nu cijfers", en: "I’m learning numbers now." }
    ]
},
{
    english: "He’s cleaning the kitchen again.",
    correct: { nl: "hij maakt de keuken opnieuw schoon", en: "He’s cleaning the kitchen again." },
    options: [
        { nl: "hij maakt de keuken opnieuw schoon", en: "He’s cleaning the kitchen again." },
        { nl: "hij maakt het toilet opnieuw schoon", en: "He’s cleaning the bathroom again." },
        { nl: "hij maakt zijn kamer opnieuw schoon", en: "He’s cleaning his room again." }
    ]
},
{
    english: "We arrived late yesterday.",
    correct: { nl: "wij kwamen gisteren laat aan", en: "We arrived late yesterday." },
    options: [
        { nl: "wij kwamen gisteren laat aan", en: "We arrived late yesterday." },
        { nl: "wij kwamen gisteren vroeg aan", en: "We arrived early yesterday." },
        { nl: "wij kwamen gisteren moe aan", en: "We arrived tired yesterday." }
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
    correct: { nl: "wij bezoeken nu de winkel", en: "We’re visiting the shop now." },
    options: [
        { nl: "wij bezoeken nu de winkel", en: "We’re visiting the shop now." },
        { nl: "wij bezoeken nu de markt", en: "We’re visiting the market now." },
        { nl: "wij bezoeken nu het park", en: "We’re visiting the park now." }
    ]
},
{
    english: "She’s drinking cold water.",
    correct: { nl: "zij drinkt koud water", en: "She’s drinking cold water." },
    options: [
        { nl: "zij drinkt koud water", en: "She’s drinking cold water." },
        { nl: "zij drinkt heet water", en: "She’s drinking hot water." },
        { nl: "zij drinkt koud sap", en: "She’s drinking cold juice." }
    ]
},
{
    english: "I’m finishing my coffee.",
    correct: { nl: "ik maak mijn koffie op", en: "I’m finishing my coffee." },
    options: [
        { nl: "ik maak mijn koffie op", en: "I’m finishing my coffee." },
        { nl: "ik drink mijn koffie", en: "I’m drinking my coffee." },
        { nl: "ik bereid mijn koffie", en: "I’m preparing my coffee." }
    ]
},
{
    english: "We’re eating together now.",
    correct: { nl: "wij eten nu samen", en: "We’re eating together now." },
    options: [
        { nl: "wij eten nu samen", en: "We’re eating together now." },
        { nl: "wij koken nu samen", en: "We’re cooking together now." },
        { nl: "wij maken nu samen schoon", en: "We’re cleaning together now." }
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
    correct: { nl: "ik ga morgen mijn moeder bezoeken", en: "I’m visiting my mum tomorrow." },
    options: [
        { nl: "ik ga morgen mijn moeder bezoeken", en: "I’m visiting my mum tomorrow." },
        { nl: "ik ga morgen mijn vriend bezoeken", en: "I’m visiting my mate tomorrow." },
        { nl: "ik ga morgen mijn zus bezoeken", en: "I’m visiting my sister tomorrow." }
    ]
},
{
    english: "We’re learning together today.",
    correct: { nl: "wij leren vandaag samen", en: "We’re learning together today." },
    options: [
        { nl: "wij leren vandaag samen", en: "We’re learning together today." },
        { nl: "wij lezen vandaag samen", en: "We’re reading together today." },
        { nl: "wij schrijven vandaag samen", en: "We’re writing together today." }
    ]
},
{
    english: "She’s finishing her work now.",
    correct: { nl: "zij maakt haar werk nu af", en: "She’s finishing her work now." },
    options: [
        { nl: "zij maakt haar werk nu af", en: "She’s finishing her work now." },
        { nl: "zij begint nu met haar werk", en: "She’s starting her work now." },
        { nl: "zij verlaat nu haar werk", en: "She’s leaving her work now." }
    ]
}

], // ← CLEAN END OF A2 ARRAY

	/* ============================
   B1 — Intermediate
   ============================ */

B1: [

{
    english: "We need to explain the plan clearly.",
    correct: { nl: "wij moeten het plan duidelijk uitleggen", en: "We need to explain the plan clearly." },
    options: [
        { nl: "wij moeten het plan duidelijk uitleggen", en: "We need to explain the plan clearly." },
        { nl: "wij moeten het plan duidelijk veranderen", en: "We need to change the plan clearly." },
        { nl: "wij moeten het plan duidelijk vergeten", en: "We need to forget the plan clearly." },
        { nl: "wij moeten het plan duidelijk bekijken", en: "We need to review the plan clearly." }
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
    correct: { nl: "ik besloot de eerdere bus te nemen", en: "I decided to take the earlier bus." },
    options: [
        { nl: "ik besloot de eerdere bus te nemen", en: "I decided to take the earlier bus." },
        { nl: "ik besloot de latere bus te nemen", en: "I decided to take the later bus." },
        { nl: "ik besloot de verkeerde bus te nemen", en: "I decided to take the wrong bus." },
        { nl: "ik besloot de juiste bus te nemen", en: "I decided to take the correct bus." }
    ]
},
{
    english: "We’re preparing a simple dinner tonight.",
    correct: { nl: "wij bereiden vanavond een eenvoudige maaltijd voor", en: "We’re preparing a simple dinner tonight." },
    options: [
        { nl: "wij bereiden vanavond een eenvoudige maaltijd voor", en: "We’re preparing a simple dinner tonight." },
        { nl: "wij bereiden vanavond een grote maaltijd voor", en: "We’re preparing a big dinner tonight." },
        { nl: "wij bereiden vanavond een koude maaltijd voor", en: "We’re preparing a cold dinner tonight." },
        { nl: "wij bereiden vanavond een nieuwe maaltijd voor", en: "We’re preparing a new dinner tonight." }
    ]
},
{
    english: "He explained the problem very well.",
    correct: { nl: "hij legde het probleem heel goed uit", en: "He explained the problem very well." },
    options: [
        { nl: "hij legde het probleem heel goed uit", en: "He explained the problem very well." },
        { nl: "hij vergat het probleem heel goed", en: "He forgot the problem very well." },
        { nl: "hij veranderde het probleem heel goed", en: "He changed the problem very well." },
        { nl: "hij bekeek het probleem heel goed", en: "He reviewed the problem very well." }
    ]
},
{
    english: "I’m trying to improve my Spanish every day.",
    correct: { nl: "ik probeer elke dag mijn nederlands te verbeteren", en: "I’m trying to improve my Spanish every day." },
    options: [
        { nl: "ik probeer elke dag mijn nederlands te verbeteren", en: "I’m trying to improve my Spanish every day." },
        { nl: "ik probeer elke dag mijn nederlands te vergeten", en: "I’m trying to forget my Spanish every day." },
        { nl: "ik probeer elke dag mijn nederlands te veranderen", en: "I’m trying to change my Spanish every day." },
        { nl: "ik probeer elke dag mijn nederlands te onderwijzen", en: "I’m trying to teach my Spanish every day." }
    ]
},
{
    english: "She described the place in great detail.",
    correct: { nl: "zij beschreef de plek zeer gedetailleerd", en: "She described the place in great detail." },
    options: [
        { nl: "zij beschreef de plek zeer gedetailleerd", en: "She described the place in great detail." },
        { nl: "zij vergat de plek zeer gedetailleerd", en: "She forgot the place in great detail." },
        { nl: "zij veranderde de plek zeer gedetailleerd", en: "She changed the place in great detail." },
        { nl: "zij bekeek de plek zeer gedetailleerd", en: "She reviewed the place in great detail." }
    ]
},
{
    english: "We chose the restaurant because it’s quiet.",
    correct: { nl: "wij kozen het restaurant omdat het rustig is", en: "We chose the restaurant because it’s quiet." },
    options: [
        { nl: "wij kozen het restaurant omdat het rustig is", en: "We chose the restaurant because it’s quiet." },
        { nl: "wij kozen het restaurant omdat het luidruchtig is", en: "We chose the restaurant because it’s noisy." },
        { nl: "wij kozen het restaurant omdat het duur is", en: "We chose the restaurant because it’s expensive." },
        { nl: "wij kozen het restaurant omdat het klein is", en: "We chose the restaurant because it’s small." }
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
    correct: { nl: "ik kan me niet voorstellen op een koude plek te wonen", en: "I can’t imagine living in a cold place." },
    options: [
        { nl: "ik kan me niet voorstellen op een koude plek te wonen", en: "I can’t imagine living in a cold place." },
        { nl: "ik kan me niet voorstellen op een warme plek te wonen", en: "I can’t imagine living in a warm place." },
        { nl: "ik kan me niet voorstellen op een dure plek te wonen", en: "I can’t imagine living in an expensive place." },
        { nl: "ik kan me niet voorstellen op een kleine plek te wonen", en: "I can’t imagine living in a small place." }
    ]
},
{
    english: "We continued walking until we found the café.",
    correct: { nl: "wij bleven lopen tot we het café vonden", en: "We continued walking until we found the café." },
    options: [
        { nl: "wij bleven lopen tot we het café vonden", en: "We continued walking until we found the café." },
        { nl: "wij bleven lopen tot we de winkel vonden", en: "We continued walking until we found the shop." },
        { nl: "wij bleven lopen tot we het park vonden", en: "We continued walking until we found the park." },
        { nl: "wij bleven lopen tot we het huis vonden", en: "We continued walking until we found the house." }
    ]
},
{
    english: "She explained why she arrived late.",
    correct: { nl: "zij legde uit waarom zij laat aankwam", en: "She explained why she arrived late." },
    options: [
        { nl: "zij legde uit waarom zij laat aankwam", en: "She explained why she arrived late." },
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
        { nl: "ik studeer liever 's nachts", en: "I prefer to study at night." },
        { nl: "ik studeer liever thuis", en: "I prefer to study at home." }
    ]
},
{
    english: "We’re trying to choose a good time.",
    correct: { nl: "wij proberen een goed moment te kiezen", en: "We’re trying to choose a good time." },
    options: [
        { nl: "wij proberen een goed moment te kiezen", en: "We’re trying to choose a good time." },
        { nl: "wij proberen een slecht moment te kiezen", en: "We’re trying to choose a bad time." },
        { nl: "wij proberen een vroeg moment te kiezen", en: "We’re trying to choose an early time." },
        { nl: "wij proberen een laat moment te kiezen", en: "We’re trying to choose a late time." }
    ]
},
{
    english: "He described the problem again.",
    correct: { nl: "hij beschreef het probleem opnieuw", en: "He described the problem again." },
    options: [
        { nl: "hij beschreef het probleem opnieuw", en: "He described the problem again." },
        { nl: "hij vergat het probleem opnieuw", en: "He forgot the problem again." },
        { nl: "hij veranderde het probleem opnieuw", en: "He changed the problem again." },
        { nl: "hij bekeek het probleem opnieuw", en: "He reviewed the problem again." }
    ]
},
{
    english: "I’m preparing something simple for lunch.",
    correct: { nl: "ik bereid iets eenvoudigs voor de lunch voor", en: "I’m preparing something simple for lunch." },
    options: [
        { nl: "ik bereid iets eenvoudigs voor de lunch voor", en: "I’m preparing something simple for lunch." },
        { nl: "ik bereid iets groots voor de lunch voor", en: "I’m preparing something big for lunch." },
        { nl: "ik bereid iets kouds voor de lunch voor", en: "I’m preparing something cold for lunch." },
        { nl: "ik bereid iets nieuws voor de lunch voor", en: "I’m preparing something new for lunch." }
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
    correct: { nl: "wij kozen deze plek omdat die comfortabel is", en: "We chose this place because it’s comfortable." },
    options: [
        { nl: "wij kozen deze plek omdat die comfortabel is", en: "We chose this place because it’s comfortable." },
        { nl: "wij kozen deze plek omdat die duur is", en: "We chose this place because it’s expensive." },
        { nl: "wij kozen deze plek omdat die koud is", en: "We chose this place because it’s cold." },
        { nl: "wij kozen deze plek omdat die klein is", en: "We chose this place because it’s small." }
    ]
},
{
    english: "He suggested meeting a bit earlier.",
    correct: { nl: "hij stelde voor iets eerder af te spreken", en: "He suggested meeting a bit earlier." },
    options: [
        { nl: "hij stelde voor iets eerder af te spreken", en: "He suggested meeting a bit earlier." },
        { nl: "hij stelde voor iets later af te spreken", en: "He suggested meeting a bit later." },
        { nl: "hij stelde voor thuis af te spreken", en: "He suggested meeting at home." },
        { nl: "hij stelde voor in het park af te spreken", en: "He suggested meeting at the park." }
    ]
},

/* ===== B1 PART 2 (joined cleanly) ===== */
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
    correct: { nl: "wij proberen het plan een beetje te verbeteren", en: "We’re trying to improve the plan a little." },
    options: [
        { nl: "wij proberen het plan een beetje te verbeteren", en: "We’re trying to improve the plan a little." },
        { nl: "wij proberen het plan een beetje te veranderen", en: "We’re trying to change the plan a little." },
        { nl: "wij proberen het plan een beetje te vergeten", en: "We’re trying to forget the plan a little." },
        { nl: "wij proberen het plan een beetje te bekijken", en: "We’re trying to review the plan a little." }
    ]
},
{
    english: "He suggested taking a short break.",
    correct: { nl: "hij stelde voor een korte pauze te nemen", en: "He suggested taking a short break." },
    options: [
        { nl: "hij stelde voor een korte pauze te nemen", en: "He suggested taking a short break." },
        { nl: "hij stelde voor een lange pauze te nemen", en: "He suggested taking a long break." },
        { nl: "hij stelde voor een koude pauze te nemen", en: "He suggested taking a cold break." },
        { nl: "hij stelde voor een vroege pauze te nemen", en: "He suggested taking an early break." }
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
    correct: { nl: "wij bleven praten tot het laat werd", en: "We continued talking until it got late." },
    options: [
        { nl: "wij bleven praten tot het laat werd", en: "We continued talking until it got late." },
        { nl: "wij bleven praten tot het vroeg werd", en: "We continued talking until it got early." },
        { nl: "wij bleven praten tot het koud werd", en: "We continued talking until it got cold." },
        { nl: "wij bleven praten tot het comfortabel werd", en: "We continued talking until it got comfortable." }
    ]
},
{
    english: "He explained the reason very clearly.",
    correct: { nl: "hij legde de reden heel duidelijk uit", en: "He explained the reason very clearly." },
    options: [
        { nl: "hij legde de reden heel duidelijk uit", en: "He explained the reason very clearly." },
        { nl: "hij legde de reden heel langzaam uit", en: "He explained the reason very slowly." },
        { nl: "hij legde de reden heel snel uit", en: "He explained the reason very quickly." },
        { nl: "hij legde de reden erg slecht uit", en: "He explained the reason very badly." }
    ]
},
{
    english: "I prefer to walk when the weather is warm.",
    correct: { nl: "ik loop liever wanneer het warm weer is", en: "I prefer to walk when the weather is warm." },
    options: [
        { nl: "ik loop liever wanneer het warm weer is", en: "I prefer to walk when the weather is warm." },
        { nl: "ik loop liever wanneer het koud weer is", en: "I prefer to walk when the weather is cold." },
        { nl: "ik loop liever wanneer het regenachtig is", en: "I prefer to walk when the weather is rainy." },
        { nl: "ik loop liever wanneer het duur is", en: "I prefer to walk when the weather is expensive." }
    ]
},
{
    english: "We’re preparing everything for tomorrow.",
    correct: { nl: "wij bereiden alles voor morgen voor", en: "We’re preparing everything for tomorrow." },
    options: [
        { nl: "wij bereiden alles voor morgen voor", en: "We’re preparing everything for tomorrow." },
        { nl: "wij bereiden alles voor vandaag voor", en: "We’re preparing everything for today." },
        { nl: "wij bereiden alles voor vanmiddag voor", en: "We’re preparing everything for the afternoon." },
        { nl: "wij bereiden alles voor vanavond voor", en: "We’re preparing everything for tonight." }
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
    correct: { nl: "wij liepen door tot we de winkel bereikten", en: "We continued walking until we reached the shop." },
    options: [
        { nl: "wij liepen door tot we de winkel bereikten", en: "We continued walking until we reached the shop." },
        { nl: "wij liepen door tot we het park bereikten", en: "We continued walking until we reached the park." },
        { nl: "wij liepen door tot we het café bereikten", en: "We continued walking until we reached the café." },
        { nl: "wij liepen door tot we het huis bereikten", en: "We continued walking until we reached the house." }
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
    correct: { nl: "ik besloot het eerdere tijdstip te kiezen", en: "I decided to choose the earlier time." },
    options: [
        { nl: "ik besloot het eerdere tijdstip te kiezen", en: "I decided to choose the earlier time." },
        { nl: "ik besloot het latere tijdstip te kiezen", en: "I decided to choose the later time." },
        { nl: "ik besloot het koudere tijdstip te kiezen", en: "I decided to choose the colder time." },
        { nl: "ik besloot het duurdere tijdstip te kiezen", en: "I decided to choose the more expensive time." }
    ]
},
{
    english: "She explained the plan again.",
    correct: { nl: "zij legde het plan opnieuw uit", en: "She explained the plan again." },
    options: [
        { nl: "zij legde het plan opnieuw uit", en: "She explained the plan again." },
        { nl: "zij veranderde het plan opnieuw", en: "She changed the plan again." },
        { nl: "zij vergat het plan opnieuw", en: "She forgot the plan again." },
        { nl: "zij bekeek het plan opnieuw", en: "She reviewed the plan again." }
    ]
},
{
    english: "We’re preparing something warm for dinner.",
    correct: { nl: "wij bereiden iets warms voor het avondeten", en: "We’re preparing something warm for dinner." },
    options: [
        { nl: "wij bereiden iets warms voor het avondeten", en: "We’re preparing something warm for dinner." },
        { nl: "wij bereiden iets kouds voor het avondeten", en: "We’re preparing something cold for dinner." },
        { nl: "wij bereiden iets duurs voor het avondeten", en: "We’re preparing something expensive for dinner." },
        { nl: "wij bereiden iets kleins voor het avondeten", en: "We’re preparing something small for dinner." }
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

], // ← CLEAN END OF B1 ARRAY
	/* ============================
   B2 — Upper Intermediate
   ============================ */

B2: [

{
    english: "We need to consider all the details before deciding.",
    correct: { nl: "wij moeten alle details overwegen voordat we beslissen", en: "We need to consider all the details before deciding." },
    options: [
        { nl: "wij moeten alle details overwegen voordat we beslissen", en: "We need to consider all the details before deciding." },
        { nl: "wij moeten alle details negeren voordat we beslissen", en: "We need to ignore all the details before deciding." },
        { nl: "wij moeten alle details veranderen voordat we beslissen", en: "We need to change all the details before deciding." },
        { nl: "wij moeten alle details bekijken voordat we beslissen", en: "We need to review all the details before deciding." }
    ]
},

{
    english: "She realised the problem was more complex than expected.",
    correct: { nl: "zij besefte dat het probleem ingewikkelder was dan verwacht", en: "She realised the problem was more complex than expected." },
    options: [
        { nl: "zij besefte dat het probleem ingewikkelder was dan verwacht", en: "She realised the problem was more complex than expected." },
        { nl: "zij besefte dat het probleem eenvoudiger was dan verwacht", en: "She realised the problem was simpler than expected." },
        { nl: "zij besefte dat het probleem korter was dan verwacht", en: "She realised the problem was shorter than expected." },
        { nl: "zij besefte dat het probleem duurder was dan verwacht", en: "She realised the problem was more expensive than expected." }
    ]
},
{
    english: "We’re organising everything so the day runs smoothly.",
    correct: { nl: "wij organiseren alles zodat de dag soepel verloopt", en: "We’re organising everything so the day runs smoothly." },
    options: [
        { nl: "wij organiseren alles zodat de dag soepel verloopt", en: "We’re organising everything so the day runs smoothly." },
        { nl: "wij organiseren alles zodat de dag slecht verloopt", en: "We’re organising everything so the day goes badly." },
        { nl: "wij organiseren alles zodat de dag kort is", en: "We’re organising everything so the day is short." },
        { nl: "wij organiseren alles zodat de dag duur is", en: "We’re organising everything so the day is expensive." }
    ]
},
{
    english: "He managed to finish the task on time.",
    correct: { nl: "hij slaagde erin de taak op tijd af te ronden", en: "He managed to finish the task on time." },
    options: [
        { nl: "hij slaagde erin de taak op tijd af te ronden", en: "He managed to finish the task on time." },
        { nl: "hij slaagde erin de taak laat af te ronden", en: "He managed to finish the task late." },
        { nl: "hij slaagde erin de taak slecht af te ronden", en: "He managed to finish the task badly." },
        { nl: "hij slaagde erin de taak vroeg af te ronden", en: "He managed to finish the task early." }
    ]
},
{
    english: "I recommend choosing a quieter place for the meeting.",
    correct: { nl: "ik raad aan een rustigere plek voor de vergadering te kiezen", en: "I recommend choosing a quieter place for the meeting." },
    options: [
        { nl: "ik raad aan een rustigere plek voor de vergadering te kiezen", en: "I recommend choosing a quieter place for the meeting." },
        { nl: "ik raad aan een luidruchtigere plek voor de vergadering te kiezen", en: "I recommend choosing a noisier place for the meeting." },
        { nl: "ik raad aan een duurdere plek voor de vergadering te kiezen", en: "I recommend choosing a more expensive place for the meeting." },
        { nl: "ik raad aan een kleinere plek voor de vergadering te kiezen", en: "I recommend choosing a smaller place for the meeting." }
    ]
},
{
    english: "We discussed several options before making a decision.",
    correct: { nl: "wij bespraken verschillende opties voordat we een beslissing namen", en: "We discussed several options before making a decision." },
    options: [
        { nl: "wij bespraken verschillende opties voordat we een beslissing namen", en: "We discussed several options before making a decision." },
        { nl: "wij bespraken verschillende opties nadat we een beslissing namen", en: "We discussed several options after making a decision." },
        { nl: "wij bespraken verschillende opties zonder een beslissing te nemen", en: "We discussed several options without making a decision." },
        { nl: "wij bespraken verschillende opties om een beslissing te vermijden", en: "We discussed several options to avoid a decision." }
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
    correct: { nl: "wij analyseerden het probleem en vonden een eenvoudige oplossing", en: "We analysed the problem and found a simple solution." },
    options: [
        { nl: "wij analyseerden het probleem en vonden een eenvoudige oplossing", en: "We analysed the problem and found a simple solution." },
        { nl: "wij analyseerden het probleem en vonden een dure oplossing", en: "We analysed the problem and found an expensive solution." },
        { nl: "wij analyseerden het probleem en vonden een koude oplossing", en: "We analysed the problem and found a cold solution." },
        { nl: "wij analyseerden het probleem en vonden een kleine oplossing", en: "We analysed the problem and found a small solution." }
    ]
},
{
    english: "He realised he needed more time to prepare.",
    correct: { nl: "hij besefte dat hij meer tijd nodig had om zich voor te bereiden", en: "He realised he needed more time to prepare." },
    options: [
        { nl: "hij besefte dat hij meer tijd nodig had om zich voor te bereiden", en: "He realised he needed more time to prepare." },
        { nl: "hij besefte dat hij minder tijd nodig had om zich voor te bereiden", en: "He realised he needed less time to prepare." },
        { nl: "hij besefte dat hij koude tijd nodig had om zich voor te bereiden", en: "He realised he needed cold time to prepare." },
        { nl: "hij besefte dat hij dure tijd nodig had om zich voor te bereiden", en: "He realised he needed expensive time to prepare." }
    ]
},
{
    english: "We’re trying to organise the day more efficiently.",
    correct: { nl: "wij proberen de dag efficiënter te organiseren", en: "We’re trying to organise the day more efficiently." },
    options: [
        { nl: "wij proberen de dag efficiënter te organiseren", en: "We’re trying to organise the day more efficiently." },
        { nl: "wij proberen de dag langzamer te organiseren", en: "We’re trying to organise the day more slowly." },
        { nl: "wij proberen de dag duurder te organiseren", en: "We’re trying to organise the day more expensively." },
        { nl: "wij proberen de dag kouder te organiseren", en: "We’re trying to organise the day more coldly." }
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
    correct: { nl: "wij verwachten dat de vergadering vroeg eindigt", en: "We expect the meeting to finish early." },
    options: [
        { nl: "wij verwachten dat de vergadering vroeg eindigt", en: "We expect the meeting to finish early." },
        { nl: "wij verwachten dat de vergadering laat eindigt", en: "We expect the meeting to finish late." },
        { nl: "wij verwachten dat de vergadering slecht eindigt", en: "We expect the meeting to finish badly." },
        { nl: "wij verwachten dat de vergadering koud eindigt", en: "We expect the meeting to finish cold." }
    ]
},
{
    english: "He managed to organise everything before midday.",
    correct: { nl: "hij slaagde erin alles voor de middag te organiseren", en: "He managed to organise everything before midday." },
    options: [
        { nl: "hij slaagde erin alles voor de middag te organiseren", en: "He managed to organise everything before midday." },
        { nl: "hij slaagde erin alles na de middag te organiseren", en: "He managed to organise everything after midday." },
        { nl: "hij slaagde erin alles 's nachts te organiseren", en: "He managed to organise everything at night." },
        { nl: "hij slaagde erin alles 's ochtends te organiseren", en: "He managed to organise everything in the morning." }
    ]
},
{
    english: "I recommend preparing a bit earlier next time.",
    correct: { nl: "ik raad aan je de volgende keer iets eerder voor te bereiden", en: "I recommend preparing a bit earlier next time." },
    options: [
        { nl: "ik raad aan je de volgende keer iets eerder voor te bereiden", en: "I recommend preparing a bit earlier next time." },
        { nl: "ik raad aan je de volgende keer iets later voor te bereiden", en: "I recommend preparing a bit later next time." },
        { nl: "ik raad aan je de volgende keer thuis voor te bereiden", en: "I recommend preparing at home next time." },
        { nl: "ik raad aan je de volgende keer in het park voor te bereiden", en: "I recommend preparing at the park next time." }
    ]
},
{
    english: "We discussed the plan and agreed on a few changes.",
    correct: { nl: "wij bespraken het plan en waren het eens over enkele wijzigingen", en: "We discussed the plan and agreed on a few changes." },
    options: [
        { nl: "wij bespraken het plan en waren het eens over enkele wijzigingen", en: "We discussed the plan and agreed on a few changes." },
        { nl: "wij bespraken het plan en waren het eens over geen wijzigingen", en: "We discussed the plan and agreed on no changes." },
        { nl: "wij bespraken het plan en waren het eens over veel wijzigingen", en: "We discussed the plan and agreed on many changes." },
        { nl: "wij bespraken het plan en waren het eens over koude wijzigingen", en: "We discussed the plan and agreed on cold changes." }
    ]
},
{
    english: "She recognised the problem immediately.",
    correct: { nl: "zij herkende het probleem onmiddellijk", en: "She recognised the problem immediately." },
    options: [
        { nl: "zij herkende het probleem onmiddellijk", en: "She recognised the problem immediately." },
        { nl: "zij herkende het probleem langzaam", en: "She recognised the problem slowly." },
        { nl: "zij herkende het probleem laat", en: "She recognised the problem late." },
        { nl: "zij herkende het probleem slecht", en: "She recognised the problem badly." }
    ]
},
{
    english: "We analysed the situation and chose the best option.",
    correct: { nl: "wij analyseerden de situatie en kozen de beste optie", en: "We analysed the situation and chose the best option." },
    options: [
        { nl: "wij analyseerden de situatie en kozen de beste optie", en: "We analysed the situation and chose the best option." },
        { nl: "wij analyseerden de situatie en kozen de slechtste optie", en: "We analysed the situation and chose the worst option." },
        { nl: "wij analyseerden de situatie en kozen een koude optie", en: "We analysed the situation and chose a cold option." },
        { nl: "wij analyseerden de situatie en kozen een dure optie", en: "We analysed the situation and chose an expensive option." }
    ]
},
{
    english: "He realised the meeting would take longer than planned.",
    correct: { nl: "hij besefte dat de vergadering langer zou duren dan gepland", en: "He realised the meeting would take longer than planned." },
    options: [
        { nl: "hij besefte dat de vergadering langer zou duren dan gepland", en: "He realised the meeting would take longer than planned." },
        { nl: "hij besefte dat de vergadering korter zou duren dan gepland", en: "He realised the meeting would take less time than planned." },
        { nl: "hij besefte dat de vergadering koude tijd zou kosten", en: "He realised the meeting would take cold time." },
        { nl: "hij besefte dat de vergadering dure tijd zou kosten", en: "He realised the meeting would take expensive time." }
    ]
},

/* ===== B2 PART 2 (joined cleanly) ===== */
	{
    english: "She considered changing the plan after the meeting.",
    correct: { nl: "zij overwoog het plan na de vergadering te veranderen", en: "She considered changing the plan after the meeting." },
    options: [
        { nl: "zij overwoog het plan na de vergadering te veranderen", en: "She considered changing the plan after the meeting." },
        { nl: "zij overwoog het plan na de vergadering te vergeten", en: "She considered forgetting the plan after the meeting." },
        { nl: "zij overwoog het plan na de vergadering te bekijken", en: "She considered reviewing the plan after the meeting." },
        { nl: "zij overwoog het plan na de vergadering af te ronden", en: "She considered finishing the plan after the meeting." }
    ]
},

{
    english: "We realised the situation required more attention.",
    correct: { nl: "wij beseften dat de situatie meer aandacht vereiste", en: "We realised the situation required more attention." },
    options: [
        { nl: "wij beseften dat de situatie meer aandacht vereiste", en: "We realised the situation required more attention." },
        { nl: "wij beseften dat de situatie minder aandacht vereiste", en: "We realised the situation required less attention." },
        { nl: "wij beseften dat de situatie koude aandacht vereiste", en: "We realised the situation required cold attention." },
        { nl: "wij beseften dat de situatie dure aandacht vereiste", en: "We realised the situation required expensive attention." }
    ]
},
{
    english: "He managed to explain everything without any confusion.",
    correct: { nl: "hij slaagde erin alles zonder verwarring uit te leggen", en: "He managed to explain everything without any confusion." },
    options: [
        { nl: "hij slaagde erin alles zonder verwarring uit te leggen", en: "He managed to explain everything without any confusion." },
        { nl: "hij slaagde erin alles met veel verwarring uit te leggen", en: "He managed to explain everything with a lot of confusion." },
        { nl: "hij slaagde erin alles erg laat uit te leggen", en: "He managed to explain everything very late." },
        { nl: "hij slaagde erin alles erg snel uit te leggen", en: "He managed to explain everything very quickly." }
    ]
},
{
    english: "I recommend discussing the problem before choosing a solution.",
    correct: { nl: "ik raad aan het probleem te bespreken voordat je een oplossing kiest", en: "I recommend discussing the problem before choosing a solution." },
    options: [
        { nl: "ik raad aan het probleem te bespreken voordat je een oplossing kiest", en: "I recommend discussing the problem before choosing a solution." },
        { nl: "ik raad aan het probleem te bespreken nadat je een oplossing kiest", en: "I recommend discussing the problem after choosing a solution." },
        { nl: "ik raad aan het probleem te bespreken zonder een oplossing te kiezen", en: "I recommend discussing the problem without choosing a solution." },
        { nl: "ik raad aan het probleem te bespreken om een oplossing te vermijden", en: "I recommend discussing the problem to avoid a solution." }
    ]
},
{
    english: "We compared several ideas and chose the most practical one.",
    correct: { nl: "wij vergeleken verschillende ideeën en kozen de meest praktische", en: "We compared several ideas and chose the most practical one." },
    options: [
        { nl: "wij vergeleken verschillende ideeën en kozen de meest praktische", en: "We compared several ideas and chose the most practical one." },
        { nl: "wij vergeleken verschillende ideeën en kozen de duurste", en: "We compared several ideas and chose the most expensive one." },
        { nl: "wij vergeleken verschillende ideeën en kozen de koudste", en: "We compared several ideas and chose the coldest one." },
        { nl: "wij vergeleken verschillende ideeën en kozen de kleinste", en: "We compared several ideas and chose the smallest one." }
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
    correct: { nl: "wij analyseerden de resultaten en merkten een duidelijk patroon op", en: "We analysed the results and noticed a clear pattern." },
    options: [
        { nl: "wij analyseerden de resultaten en merkten een duidelijk patroon op", en: "We analysed the results and noticed a clear pattern." },
        { nl: "wij analyseerden de resultaten en merkten een klein patroon op", en: "We analysed the results and noticed a small pattern." },
        { nl: "wij analyseerden de resultaten en merkten een duur patroon op", en: "We analysed the results and noticed an expensive pattern." },
        { nl: "wij analyseerden de resultaten en merkten een koud patroon op", en: "We analysed the results and noticed a cold pattern." }
    ]
},
{
    english: "He considered waiting a bit longer before leaving.",
    correct: { nl: "hij overwoog iets langer te wachten voordat hij vertrok", en: "He considered waiting a bit longer before leaving." },
    options: [
        { nl: "hij overwoog iets langer te wachten voordat hij vertrok", en: "He considered waiting a bit longer before leaving." },
        { nl: "hij overwoog iets minder lang te wachten voordat hij vertrok", en: "He considered waiting a bit less before leaving." },
        { nl: "hij overwoog thuis te wachten voordat hij vertrok", en: "He considered waiting at home before leaving." },
        { nl: "hij overwoog in het park te wachten voordat hij vertrok", en: "He considered waiting at the park before leaving." }
    ]
},
{
    english: "We expect the project to take a few more days.",
    correct: { nl: "wij verwachten dat het project nog een paar dagen zal duren", en: "We expect the project to take a few more days." },
    options: [
        { nl: "wij verwachten dat het project nog een paar dagen zal duren", en: "We expect the project to take a few more days." },
        { nl: "wij verwachten dat het project een paar dagen minder zal duren", en: "We expect the project to take a few fewer days." },
        { nl: "wij verwachten dat het project koude dagen zal duren", en: "We expect the project to take cold days." },
        { nl: "wij verwachten dat het project dure dagen zal duren", en: "We expect the project to take expensive days." }
    ]
},
{
    english: "She managed to organise everything without any help.",
    correct: { nl: "zij slaagde erin alles zonder hulp te organiseren", en: "She managed to organise everything without any help." },
    options: [
        { nl: "zij slaagde erin alles zonder hulp te organiseren", en: "She managed to organise everything without any help." },
        { nl: "zij slaagde erin alles met veel hulp te organiseren", en: "She managed to organise everything with a lot of help." },
        { nl: "zij slaagde erin alles erg laat te organiseren", en: "She managed to organise everything very late." },
        { nl: "zij slaagde erin alles erg snel te organiseren", en: "She managed to organise everything very quickly." }
    ]
},
{
    english: "I recommend choosing the option that feels most comfortable.",
    correct: { nl: "ik raad aan de optie te kiezen die het comfortabelst aanvoelt", en: "I recommend choosing the option that feels most comfortable." },
    options: [
        { nl: "ik raad aan de optie te kiezen die het comfortabelst aanvoelt", en: "I recommend choosing the option that feels most comfortable." },
        { nl: "ik raad aan de optie te kiezen die het duurst aanvoelt", en: "I recommend choosing the option that feels more expensive." },
        { nl: "ik raad aan de optie te kiezen die kouder aanvoelt", en: "I recommend choosing the option that feels colder." },
        { nl: "ik raad aan de optie te kiezen die kleiner aanvoelt", en: "I recommend choosing the option that feels smaller." }
    ]
},
{
    english: "We discussed the idea and agreed it was practical.",
    correct: { nl: "wij bespraken het idee en waren het erover eens dat het praktisch was", en: "We discussed the idea and agreed it was practical." },
    options: [
        { nl: "wij bespraken het idee en waren het erover eens dat het praktisch was", en: "We discussed the idea and agreed it was practical." },
        { nl: "wij bespraken het idee en waren het erover eens dat het duur was", en: "We discussed the idea and agreed it was expensive." },
        { nl: "wij bespraken het idee en waren het erover eens dat het koud was", en: "We discussed the idea and agreed it was cold." },
        { nl: "wij bespraken het idee en waren het erover eens dat het klein was", en: "We discussed the idea and agreed it was small." }
    ]
},
{
    english: "She recognised the voice immediately.",
    correct: { nl: "zij herkende de stem onmiddellijk", en: "She recognised the voice immediately." },
    options: [
        { nl: "zij herkende de stem onmiddellijk", en: "She recognised the voice immediately." },
        { nl: "zij herkende de stem langzaam", en: "She recognised the voice slowly." },
        { nl: "zij herkende de stem laat", en: "She recognised the voice late." },
        { nl: "zij herkende de stem slecht", en: "She recognised the voice badly." }
    ]
},
{
    english: "We analysed the options and chose the most efficient one.",
    correct: { nl: "wij analyseerden de opties en kozen de meest efficiënte", en: "We analysed the options and chose the most efficient one." },
    options: [
        { nl: "wij analyseerden de opties en kozen de meest efficiënte", en: "We analysed the options and chose the most efficient one." },
        { nl: "wij analyseerden de opties en kozen de duurste", en: "We analysed the options and chose the most expensive one." },
        { nl: "wij analyseerden de opties en kozen de koudste", en: "We analysed the options and chose the coldest one." },
        { nl: "wij analyseerden de opties en kozen de kleinste", en: "We analysed the options and chose the smallest one." }
    ]
},
{
    english: "He considered preparing everything earlier next time.",
    correct: { nl: "hij overwoog de volgende keer alles eerder voor te bereiden", en: "He considered preparing everything earlier next time." },
    options: [
        { nl: "hij overwoog de volgende keer alles eerder voor te bereiden", en: "He considered preparing everything earlier next time." },
        { nl: "hij overwoog de volgende keer alles later voor te bereiden", en: "He considered preparing everything later next time." },
        { nl: "hij overwoog de volgende keer alles thuis voor te bereiden", en: "He considered preparing everything at home next time." },
        { nl: "hij overwoog de volgende keer alles in het park voor te bereiden", en: "He considered preparing everything at the park next time." }
    ]
},
{
    english: "We expect the day to run smoothly if we organise well.",
    correct: { nl: "wij verwachten dat de dag soepel verloopt als we goed organiseren", en: "We expect the day to run smoothly if we organise well." },
    options: [
        { nl: "wij verwachten dat de dag soepel verloopt als we goed organiseren", en: "We expect the day to run smoothly if we organise well." },
        { nl: "wij verwachten dat de dag slecht verloopt als we goed organiseren", en: "We expect the day to go badly if we organise well." },
        { nl: "wij verwachten dat de dag koud verloopt als we goed organiseren", en: "We expect the day to go cold if we organise well." },
        { nl: "wij verwachten dat de dag duur verloopt als we goed organiseren", en: "We expect the day to go expensive if we organise well." }
    ]
},
{
    english: "She managed to finish everything before the deadline.",
    correct: { nl: "zij slaagde erin alles vóór de deadline af te ronden", en: "She managed to finish everything before the deadline." },
    options: [
        { nl: "zij slaagde erin alles vóór de deadline af te ronden", en: "She managed to finish everything before the deadline." },
        { nl: "zij slaagde erin alles na de deadline af te ronden", en: "She managed to finish everything after the deadline." },
        { nl: "zij slaagde erin alles erg laat af te ronden", en: "She managed to finish everything very late." },
        { nl: "zij slaagde erin alles erg snel af te ronden", en: "She managed to finish everything very quickly." }
    ]
},
{
    english: "I recommend discussing the details more carefully next time.",
    correct: { nl: "ik raad aan de details de volgende keer zorgvuldiger te bespreken", en: "I recommend discussing the details more carefully next time." },
    options: [
        { nl: "ik raad aan de details de volgende keer zorgvuldiger te bespreken", en: "I recommend discussing the details more carefully next time." },
        { nl: "ik raad aan de details de volgende keer sneller te bespreken", en: "I recommend discussing the details more quickly next time." },
        { nl: "ik raad aan de details de volgende keer later te bespreken", en: "I recommend discussing the details later next time." },
        { nl: "ik raad aan de details de volgende keer thuis te bespreken", en: "I recommend discussing the details at home next time." }
    ]
}

] // ← CLEAN END OF B2 ARRAY
};
/* ============================================================
   REDUCED DISRUPTOR SET — 5 PER LEVEL (FIXED DOUBLE-NESTING)
   ============================================================ */
function getDisruptorResponses(level) {
    const disruptors = DISRUPTOR_WORDS[level] || [];

    return disruptors.slice(0, 3).map(d => {
        if (d && typeof d === "object" && d.nl) {
            return { nl: d.nl, en: d.en || "Incorrect response" };
        }

        return {
            nl: String(d),
            en: "Incorrect response"
        };
    });
}

const DISRUPTORS_A1 = [
    { nl: "Nou, laat me je iets vertellen.", en: "Well, let me tell you something." },
    { nl: "Kijk eens.", en: "Well, look." },
    { nl: "De waarheid is dat...", en: "The truth is that..." }
];

const DISRUPTORS_A2 = [
    { nl: "Ik denk hier vaak over na.", en: "I often think about this." },
    { nl: "Voordat ik antwoord geef, laat me iets vertellen.", en: "Before answering, let me tell you something." },
    { nl: "Je weet hoe het is.", en: "You know how it is." }
];

const DISRUPTORS_B1 = [
    { nl: "Terwijl ik erover nadenk, zal ik iets zeggen.", en: "While I think about it, let me tell you something." },
    { nl: "Er is echter meer te zeggen.", en: "However, there's more to say." },
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

    for (const level of levelsList) {
        const vocab = CEFR_LEVELS[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            item.english &&
            item.english.toLowerCase() === w
        );

        if (match) {
            return {
                dutch: match.dutch,
                source: "CEFR Vocabulary",
                level
            };
        }
    }

    for (const level of levelsList) {
        const bank = CEFR_SENTENCES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english &&
            item.english.toLowerCase() === w
        );

        if (match) {
            return {
                dutch: match.dutch,
                source: "CEFR Sentences",
                level
            };
        }
    }

    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english &&
            item.english.toLowerCase() === w
        );

        if (match) {
            return {
                dutch: match.correct.nl,
                source: "Dialogue Choices",
                level
            };
        }
    }

    if (typeof CEFR_PHRASES !== "undefined") {

        // Object-based phrase bank
        if (!Array.isArray(CEFR_PHRASES)) {

            const phraseKeys = Object.keys(CEFR_PHRASES);

            for (const key of phraseKeys) {

                const english = CEFR_PHRASES[key];

                if (
                    english &&
                    english.toLowerCase() === w
                ) {
                    return {
                        dutch: key,
                        source: "CEFR Phrases",
                        level: "GLOBAL"
                    };
                }
            }

        } else {

            const phraseMatch = CEFR_PHRASES.find(p =>
                p.english &&
                p.english.toLowerCase() === w
            );

            if (phraseMatch) {
                return {
                    dutch: phraseMatch.dutch,
                    source: "CEFR Phrases",
                    level: phraseMatch.level || "GLOBAL"
                };
            }
        }
    }

    if (typeof LISTEN_VOCAB !== "undefined") {

        const levels = ["A1", "A2", "B1", "B2"];

        for (const level of levels) {

            const cats = LISTEN_VOCAB[level];
            if (!cats) continue;

            for (const category of Object.keys(cats)) {

                const hit = cats[category].find(
                    v => String(v).toLowerCase() === w
                );

                if (hit) {
                    return {
                        dutch: hit,
                        source: "Listen Vocab",
                        level
                    };
                }
            }
        }
    }

    if (typeof WORD_DICT !== "undefined" && WORD_DICT[w]) {
        return {
            dutch: WORD_DICT[w],
            source: "Word Dictionary",
            level: "GLOBAL"
        };
    }

    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined") {

        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {

            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];

            const convoMatch = prompts.find(p =>
                p.english &&
                p.english.toLowerCase() === w
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

    const convoAudioBanks = [
        CEFR_CONVERSATION_AUDIO_A1,
        CEFR_CONVERSATION_AUDIO_A2,
        CEFR_CONVERSATION_AUDIO_B1,
        CEFR_CONVERSATION_AUDIO_B2
    ];

    for (const bank of convoAudioBanks) {

        if (!bank) continue;

        const audioMatch = bank.find(a =>
            a.english &&
            a.english.toLowerCase() === w
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

    // 1. Gather all standard expected responses
    Object.values(CEFR_CONVERSATION_PROMPTS || {}).forEach(levelArray => {
        if (Array.isArray(levelArray)) {
            levelArray.forEach(prompt => {
                if (Array.isArray(prompt.expected_responses)) {
                    banks.push(...prompt.expected_responses);
                }
            });
        }
    });

    // 2. Inject disruptor bank entries
    const levelsList = ["A1", "A2", "B1", "B2"];

    levelsList.forEach(level => {
        if (typeof getDisruptorResponses === "function") {
            const levelDisruptors = getDisruptorResponses(level);

            if (Array.isArray(levelDisruptors)) {
                banks.push(...levelDisruptors);
            }
        }
    });

    for (const item of banks) {

        if (!item) continue;

        const dutchString =
            typeof item === "object"
                ? item.nl || item.dutch
                : item;

        if (!dutchString) continue;

        if (
            cleanStringForKeyboard(
                dutchString.toLowerCase()
            ) === s
        ) {
            return (
                item.en ||
                item.english ||
                "[Unknown translation]"
            );
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

    if (typeof item === "string") {
        return item;
    }

    if (typeof item === "object") {

        if (item.nl && typeof item.nl === "object") {
            return extractDutchText(item.nl);
        }

        if (item.dutch && typeof item.dutch === "object") {
            return extractDutchText(item.dutch);
        }

        if (item.nl) return item.nl;
        if (item.dutch) return item.dutch;
        if (item.text) return item.text;

        const properties = Object.values(item);

        for (const value of properties) {

            if (
                typeof value === "string" &&
                !value.includes("[object")
            ) {
                return value;
            }

            if (
                typeof value === "object" &&
                value !== null
            ) {
                const nestedString =
                    extractDutchText(value);

                if (nestedString) {
                    return nestedString;
                }
            }
        }
    }

    return String(item);
}


/* ============================================================
   CONVERSATION TAB — MAIN RENDER PIPELINE (PART 2A)
   ============================================================ */

function shuffle(array) {
    return array
        .map(x => ({ x, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.x);
}

function generateConversationPrompt(level) {
    const pool = CEFR_CONVERSATION_PROMPTS[level];

    const item =
        pool[Math.floor(Math.random() * pool.length)];

    return {
        prompt_nl: item.prompt_nl,
        prompt_en: item.prompt_en,
        expected: item.expected_responses
    };
}

function renderConversationTab() {

    const container =
        document.getElementById("conversation-content");

    const level = appState.currentLevel;

    if (!CEFR_CONVERSATION_PROMPTS[level]) {

        container.innerHTML =
            "<p>No conversation prompts available for this level.</p>";

        return;
    }

    // Isolate conversation variables cleanly inside state
    convoState.currentPrompt =
        generateConversationPrompt(level);

    const correctButtons =
        (convoState.currentPrompt.expected || [])
            .map(exp => {

                const text =
                    extractDutchText(exp);

                return {
                    html: `
                        <button
                            class="pill preset-response correct"
                            data-response="${text}">
                            ${text}
                        </button>
                    `
                };
            });

    const rawDisruptors =
        typeof getDisruptorResponses === "function"
            ? getDisruptorResponses(level)
            : [];

    const disruptorButtons =
        (Array.isArray(rawDisruptors)
            ? rawDisruptors
            : [])
            .map(exp => {

                const text =
                    extractDutchText(exp);

                return {
                    html: `
                        <button
                            class="pill preset-response disruptor"
                            data-response="${text}">
                            ${text}
                        </button>
                    `
                };
            });

    const allButtons =
        shuffle([
            ...correctButtons,
            ...disruptorButtons
        ]);

    const presetButtons =
        allButtons
            .map(b => b && b.html ? b.html : "")
            .join("");

    container.innerHTML = `
        <div class="glass-panel convo-card">

            <h2>Conversation — Level ${level}</h2>

            <p>Respond naturally using Dutch.</p>

            <div class="convo-prompt">
                <strong>Dutch:</strong>
                ${convoState.currentPrompt.prompt_nl}
                <br>

                <strong>English:</strong>
                ${convoState.currentPrompt.prompt_en}
            </div>

            <div class="preset-box">
                ${presetButtons}
            </div>

            <textarea
                id="convo-input"
                class="convo-input"
                placeholder="Type your response here..."
            ></textarea>

            <div
                class="sb-controls quiz-controls-tight"
                style="margin-top:15px; display:flex; gap:8px;"
            >
                <button
                    id="convo-submit"
                    class="pill"
                    style="padding:10px 20px;"
                >
                    Check
                </button>

                <button
                    id="convo-next"
                    class="pill"
                    style="padding:10px 20px;"
                >
                    Next
                </button>

                <button
                    id="convo-reset"
                    class="pill"
                    style="padding:10px 20px;"
                >
                    Reset
                </button>
            </div>

            <div
                id="convo-feedback"
                class="convo-feedback-box"
            ></div>
        </div>
    `;

    setupConversationEvents(
        convoState.currentPrompt
    );
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

    // Bind selection pills
    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;

            textarea.value =
                btn.getAttribute("data-response") ||
                btn.dataset.response;

            feedback.innerHTML = "";
        };
    });

    // RESET — Reload current prompt
    resetBtn.onclick = () => {
        document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
        });

        reloadSameConversation(convo);
    };

    // SUBMIT — Insulated from all potential data-bank crashes
    submitBtn.onclick = () => {

        const userText = textarea.value.trim();

        if (!userText) {
            feedback.innerHTML = `
                <span style="color:#f87171; display:block; margin-top:10px;">
                    Please enter or select a response first.
                </span>
            `;
            return;
        }

        // Initialize defensive fallbacks
        let finalScore = 0;
        let expectedNl = "No reference text found";
        let expectedEn = "Translation unavailable";
        let learnerEnglishTranslation = "[Unknown translation]";

        /* ------------------------------------------------------------
           CRASH-PROOF EVALUATION ENGINE (TRY-CATCH BUNKER)
           ------------------------------------------------------------ */
        try {

            // Safe extraction of the correct answers object
            let targetSource = convo.expected;

            if (Array.isArray(targetSource) && targetSource.length > 0) {
                targetSource = targetSource[0];
            }

            if (targetSource) {

                expectedNl =
                    typeof targetSource === "object"
                        ? (targetSource.nl || targetSource.dutch || "")
                        : String(targetSource);

                expectedEn =
                    typeof targetSource === "object"
                        ? (targetSource.en || targetSource.english || "Translation unavailable")
                        : "Translation unavailable";
            }

            // Attempt translation using global lookup
            if (typeof globalLookupDutch === "function") {
                learnerEnglishTranslation =
                    globalLookupDutch(userText);
            }

            // Short-circuit: Force 0% immediately if user picked an active disruptor
            let isDisruptor = false;

            if (typeof getDisruptorResponses === "function") {

                const disruptors =
                    getDisruptorResponses(
                        appState.currentLevel || "A1"
                    );

                isDisruptor = disruptors.some(d => {

                    const dText =
                        typeof d === "object"
                            ? (d.nl || d.dutch || "")
                            : String(d);

                    return (
                        dText.toLowerCase().trim() ===
                        userText.toLowerCase().trim()
                    );
                });
            }

            if (isDisruptor) {

                finalScore = 0;

            } else {

                // Safely evaluate score using core engine
                if (typeof scoreConversationResponse === "function") {

                    const correctResponsesOnly =
                        Array.isArray(convo.expected)
                            ? convo.expected
                            : [convo.expected];

                    const result =
                        scoreConversationResponse(
                            userText,
                            correctResponsesOnly
                        );

                    finalScore =
                        result &&
                        typeof result.score === "number"
                            ? result.score
                            : 0;

                } else {

                    // EMERGENCY FALLBACK SCORER
                    const userWords =
                        userText.toLowerCase().split(/\s+/);

                    const matchWords =
                        expectedNl.toLowerCase().split(/\s+/);

                    const matches =
                        userWords.filter(w =>
                            matchWords.includes(w)
                        ).length;

                    finalScore =
                        matchWords.length > 0
                            ? Math.round(
                                  (matches / matchWords.length) * 100
                              )
                            : 0;
                }
            }

        } catch (error) {

            console.error(
                "The evaluation loop caught a crash, deploying emergency fallbacks:",
                error
            );

            const userWords =
                userText.toLowerCase().split(/\s+/);

            const matches =
                userWords.filter(w =>
                    expectedNl.toLowerCase().includes(w)
                ).length;

            finalScore =
                userWords.length > 0
                    ? Math.min(
                          Math.round(
                              (matches / userWords.length) * 100
                          ),
                          100
                      )
                    : 0;
        }

        /* ------------------------------------------------------------
           RENDER ENGINE — GUARANTEED VISUAL INJECTION
           ------------------------------------------------------------ */

        let verdictHTML = "";
        let borderGradientColor =
            "rgba(148, 163, 184, 0.2)";
        let matchStatus = "incorrect";
        let baseXP = 0;
        let baseScore = 0;
        let bonusText = "";

        if (
            finalScore >= 70 &&
            learnerEnglishTranslation !==
                "[Unknown translation]"
        ) {

            matchStatus = "correct";
            borderGradientColor =
                "rgba(74, 222, 128, 0.4)";

            if (finalScore === 100) {
                baseXP = 40;
                baseScore = 30;
                bonusText =
                    " — 💎 100% Perfect Match! ⚡";
            } else {
                baseXP = 25;
                baseScore = 20;
            }

            verdictHTML = `
                <span style="color:#4ade80;font-weight:600;font-size:1.1rem;">
                    Correct! 🎉 (+${baseXP} XP)${bonusText}
                </span>
            `;

            if (typeof speakDutch === "function") {
                speakDutch(userText);
            }

        } else if (
            finalScore >= 40 &&
            finalScore < 70
        ) {

            matchStatus = "partial";
            borderGradientColor =
                "rgba(251,146,60,0.5)";

            baseXP = 10;
            baseScore = 5;

            verdictHTML = `
                <span style="color:#fb923c;font-weight:600;font-size:1.1rem;">
                    Partial Match! ⚠️ (+10 XP)
                </span>
            `;

            if (typeof audioContextPlayback === "function") {
                audioContextPlayback("partial");
            }

        } else {

            matchStatus = "incorrect";
            borderGradientColor =
                "rgba(248,113,113,0.4)";

            verdictHTML = `
                <span style="color:#f87171;font-weight:600;font-size:1.1rem;">
                    Incorrect. ✖ (0 XP)
                </span>
            `;

            if (typeof audioContextPlayback === "function") {
                audioContextPlayback("incorrect");
            }
        }

        // Lock options post submission
        document.querySelectorAll(
            "#conversation-content .preset-response"
        ).forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.6";
        });

        // Safe HTML print command
        feedback.innerHTML = `
            <div class="convo-result"
                 style="
                    margin-top:15px;
                    padding:12px;
                    background:rgba(15,23,42,0.4);
                    border-radius:12px;
                    border:1px solid ${borderGradientColor};
                 ">

                ${verdictHTML}

                <br><br>

                <strong>Your response:</strong>
                ${userText}
                <br>

                <strong>Your Translated Response is:</strong>
                <span style="color:#a5f3fc;">
                    "${learnerEnglishTranslation}"
                </span>

                <br><br>

                <strong>Score:</strong>

                <span style="color:${
                    matchStatus === "correct"
                        ? "#4ade80"
                        : (
                            matchStatus === "partial"
                                ? "#fb923c"
                                : "#f87171"
                        )
                }">
                    ${finalScore}%
                </span>

                <br>

                <strong>Expected Dutch:</strong>
                ${expectedNl} (${expectedEn})

            </div>
        `;

        // Safe accounting execution forwarding
        if (typeof processConversationRewards === "function") {

            try {

                processConversationRewards(
                    matchStatus,
                    baseXP,
                    baseScore,
                    expectedNl,
                    convo.prompt_nl
                );

            } catch (e) {

                console.error(
                    "Error updating scores/badges storage counters:",
                    e
                );
            }
        }
    };

    nextBtn.onclick = () => renderConversationTab();
}
/* ============================================================
   CONVERSATION RUNTIME — STORAGE MANAGEMENT & SCENE RELOADS (PART 2B - B)
   ============================================================ */

function processConversationRewards(
    matchStatus,
    baseXP,
    baseScore,
    expectedNl,
    promptNlRaw
) {

    if (!appState.levelStats[appState.currentLevel]) {
        appState.levelStats[appState.currentLevel] = {
            conversationCompleted: 0
        };
    }

    appState.levelStats[
        appState.currentLevel
    ].conversationCompleted++;

    // Process metric awards safely inside application memory blocks
    if (matchStatus === "correct") {

        appState.totalXP =
            (appState.totalXP || 0) + baseXP;

        appState.globalScore =
            (appState.globalScore || 0) + baseScore;

        if (typeof checkAndAdvanceStreak === "function") {
            checkAndAdvanceStreak();
        }

    } else if (matchStatus === "partial") {

        appState.totalXP =
            (appState.totalXP || 0) + baseXP;

        appState.globalScore =
            (appState.globalScore || 0) + baseScore;

    } else {

        const promptNlClean =
            promptNlRaw || "Conversation Prompt";

        const mistakeString =
            `${promptNlClean} ➔ ${expectedNl}`;

        // DEDUPLICATION FILTER
        const cleanMistakeEntry =
            mistakeString.trim();

        const alreadyLogged =
            Array.isArray(window.reviewList) &&
            window.reviewList.some(
                item =>
                    item.trim() ===
                    cleanMistakeEntry
            );

        if (
            !alreadyLogged &&
            typeof addIncorrectWord === "function"
        ) {
            addIncorrectWord(cleanMistakeEntry);
        }
    }

    if (typeof updateBadges === "function") {
        updateBadges();
    }

    if (typeof updateProgressMeters === "function") {
        updateProgressMeters();
    }

    saveState();
}

function reloadSameConversation(convo) {

    const presetBox = document.querySelector(
        "#conversation-content .preset-box"
    );

    const inputBox = document.querySelector(
        "#conversation-content #convo-input"
    );

    const feedbackBox = document.querySelector(
        "#conversation-content #convo-feedback"
    );

    if (!presetBox || !inputBox || !feedbackBox) {
        console.warn(
            "Conversation UI elements missing — aborting scene reset."
        );
        return;
    }

    const correct = convo.expected.map(exp => {

        const text =
            extractDutchText(exp);

        return {
            html: `
                <button
                    class="pill preset-response correct"
                    data-response="${text}">
                    ${text}
                </button>
            `
        };
    });

    const disruptors =
        getDisruptorResponses(
            appState.currentLevel
        ).map(exp => {

            const text =
                extractDutchText(exp);

            return {
                html: `
                    <button
                        class="pill preset-response disruptor"
                        data-response="${text}">
                        ${text}
                    </button>
                `
            };
        });

    const allButtons =
        shuffle([
            ...correct,
            ...disruptors
        ]);

    const presetButtons =
        allButtons
            .map(b => b && b.html ? b.html : "")
            .join("");

    presetBox.innerHTML = presetButtons;

    inputBox.value = "";
    feedbackBox.innerHTML = "";

    document.querySelectorAll(
        "#conversation-content .preset-response"
    ).forEach(btn => {

        btn.onclick = () => {

            if (btn.disabled) return;

            inputBox.value =
                btn.getAttribute("data-response") ||
                btn.dataset.response;
        };
    });
}

// Low-level synthesizer fallback note generation anchor node
function audioContextPlayback(type) {
    try {

        const AudioCtx =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioCtx) return;

        const ctx = new AudioCtx();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "partial") {

            osc.type = "triangle";

            osc.frequency.setValueAtTime(
                330,
                ctx.currentTime
            );

            gain.gain.setValueAtTime(
                0.1,
                ctx.currentTime
            );

            osc.start();

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                ctx.currentTime + 0.3
            );

            osc.stop(
                ctx.currentTime + 0.3
            );

        } else {

            osc.type = "sawtooth";

            osc.frequency.setValueAtTime(
                120,
                ctx.currentTime
            );

            gain.gain.setValueAtTime(
                0.15,
                ctx.currentTime
            );

            osc.start();

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                ctx.currentTime + 0.4
            );

            osc.stop(
                ctx.currentTime + 0.4
            );
        }

    } catch (e) {

        console.warn("WebAudio player stalled:",e);
    }
}

const CEFR_CONVERSATION_PROMPTS = {
A1: [
    {
        prompt_nl: "Wat wil je drinken?",
        prompt_en: "What would you like to drink?",
        expected_responses: [
            { nl: "ik wil water alstublieft", en: "I want water please" },
            { nl: "ik wil graag een bier", en: "I would like a beer" },
            { nl: "ik wil koffie", en: "I want coffee" }
        ]
    },
    {
        prompt_nl: "Hoe gaat het vandaag?",
        prompt_en: "How are you today?",
        expected_responses: [
            { nl: "ik ben blij", en: "I am happy" },
            { nl: "het gaat goed dank je", en: "I am good, thank you" },
            { nl: "ik ben moe", en: "I am tired" }
        ]
    },
    {
        prompt_nl: "Waar woon je?",
        prompt_en: "Where do you live?",
        expected_responses: [
            { nl: "ik woon in een huis", en: "I live in the house" },
            { nl: "ik woon dicht bij het hotel", en: "I live near the hotel" },
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
            { nl: "ja ik heb honger", en: "Yes, I'm hungry" },
            { nl: "nee ik heb geen honger", en: "I'm not hungry" },
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
            { nl: "ja ik wil uitgaan", en: "Yes, I want to go out" },
            { nl: "nee ik wil niet uitgaan", en: "I don't want to go out" },
            { nl: "ik wil later uitgaan", en: "I want to go out later" }
        ]
    },
    {
        prompt_nl: "Wat ben je aan het doen?",
        prompt_en: "What are you doing?",
        expected_responses: [
            { nl: "ik leer nederlands", en: "I am learning Dutch" },
            { nl: "ik ben aan het koken", en: "I am cooking" },
            { nl: "ik kijk televisie", en: "I am watching TV" }
        ]
    },
    {
        prompt_nl: "Wil je een film kijken?",
        prompt_en: "Do you want to watch a movie?",
        expected_responses: [
            { nl: "ja ik wil een film kijken", en: "Yes, I want to watch a movie" },
            { nl: "ik wil geen televisie kijken", en: "I don't want to watch TV" },
            { nl: "ik wil een nieuwe film kijken", en: "I want to watch a new movie" }
        ]
    },
    {
        prompt_nl: "Waar is het toilet?",
        prompt_en: "Where is the bathroom?",
        expected_responses: [
            { nl: "het is dichtbij", en: "It is near" },
            { nl: "het is in het station", en: "It is in the station" },
            { nl: "het is in het huis", en: "It is in the house" }
        ]
    },
    {
        prompt_nl: "Van welke muziek houd je?",
        prompt_en: "What music do you like?",
        expected_responses: [
            { nl: "ik houd van muziek", en: "I like music" },
            { nl: "ik luister graag naar muziek", en: "I like listening to music" },
            { nl: "ik houd van nieuwe muziek", en: "I like new music" }
        ]
    },
    {
        prompt_nl: "Wil je uitrusten?",
        prompt_en: "Do you want to rest?",
        expected_responses: [
            { nl: "ja ik wil uitrusten", en: "Yes, I want to rest" },
            { nl: "nee ik wil niet uitrusten", en: "I don't want to rest" },
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
        { nl: "ja ik wil naar het hotel gaan", en: "Yes, I want to go to the hotel" },
        { nl: "ik wil niet gaan", en: "I don't want to go" },
        { nl: "ik wil later gaan", en: "I want to go later" }
    ]
},
{
    prompt_nl: "Van welk fruit houd je?",
    prompt_en: "What fruit do you like?",
    expected_responses: [
        { nl: "ik houd van appels", en: "I like apple" },
        { nl: "ik houd van sinaasappels", en: "I like orange" },
        { nl: "ik houd van bananen", en: "I like banana" }
    ]
},
{
    prompt_nl: "Wil je meer leren?",
    prompt_en: "Do you want to learn more?",
    expected_responses: [
        { nl: "ja ik wil meer leren", en: "Yes, I want to learn more" },
        { nl: "ik wil snel leren", en: "I want to learn fast" },
        { nl: "ik wil met muziek leren", en: "I want to learn with music" }
    ]
},
{
    prompt_nl: "Wat kijk je op televisie?",
    prompt_en: "What do you watch on TV?",
    expected_responses: [
        { nl: "ik kijk naar boeken", en: "I look at books" },
        { nl: "ik kijk naar leuke dingen", en: "I watch good things" },
        { nl: "ik kijk naar nieuwe muziekvideo's", en: "I watch new music videos" }
    ]
},
{
    prompt_nl: "Wil je brood met kaas?",
    prompt_en: "Do you want bread with cheese?",
    expected_responses: [
        { nl: "ja ik wil brood met kaas", en: "Yes, I want bread with cheese" },
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
        { nl: "ja ik wil met de bus gaan", en: "Yes, I want to go by bus" },
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
    prompt_nl: "Hallo, heb je je kaartje?",
    prompt_en: "Hello, do you have your ticket?",
    expected_responses: [
        { nl: "ja ik heb mijn kaartje", en: "Yes, I have my ticket" },
        { nl: "ik heb mijn kaartje niet", en: "I don't have my ticket" },
        { nl: "ik heb een kaartje nodig", en: "I need a ticket" }
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
        { nl: "ja er zijn problemen met de trein", en: "Yes, there are problems with the train" },
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
        { nl: "ja met friet", en: "Yes, with french fries" },
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
        { nl: "ik heb koud bier", en: "I have cold beer" },
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
        { nl: "mijn oma is erg blij", en: "His grandmother is very happy" },
        { nl: "het gaat goed dank je", en: "She is well, thank you" },
        { nl: "ze is vandaag moe", en: "She is tired today" }
    ]
},
{
    prompt_nl: "Wil je naar nieuwe muziek luisteren?",
    prompt_en: "Do you want to listen to new music?",
    expected_responses: [
        { nl: "ja ik houd van muziek", en: "Yes, I like music" },
        { nl: "ik wil niet naar muziek luisteren", en: "I don't want to listen to music" },
        { nl: "ik wil met mijn vriend luisteren", en: "I want to listen with my friend" }
    ]
},
{
    prompt_nl: "Wat moet je vandaag schoonmaken?",
    prompt_en: "What do you need to clean today?",
    expected_responses: [
        { nl: "ik moet het huis schoonmaken", en: "I need to clean the house" },
        { nl: "ik moet het toilet schoonmaken", en: "I need to clean the bathroom" },
        { nl: "ik hoef vandaag niet schoon te maken", en: "I don't need to clean today" }
    ]
},
{
    prompt_nl: "Houd je van nieuwe boeken?",
    prompt_en: "Do you like new books?",
    expected_responses: [
        { nl: "ja ik lees graag veel", en: "Yes, I like reading a lot" },
        { nl: "ik houd niet van boeken", en: "I don't like books" },
        { nl: "ik wil een boek schrijven", en: "I want to write a book" }
    ]
},
{
    prompt_nl: "Is er fruit op tafel?",
    prompt_en: "Is there fruit on the table?",
    expected_responses: [
        { nl: "er zijn appels en sinaasappels", en: "There is apple and orange" },
        { nl: "er is een lekkere banaan", en: "There is a good banana" },
        { nl: "er is vandaag geen fruit", en: "There is no fruit today" }
    ]
},
{
    prompt_nl: "Wil je rijst met bonen?",
    prompt_en: "Do you want rice with beans?",
    expected_responses: [
        { nl: "ja met een beetje kaas", en: "Yes, with a little cheese" },
        { nl: "ik wil rijst zonder bonen", en: "I want rice without beans" },
        { nl: "ik wil vandaag geen rijst", en: "I don't want rice today" }
    ]
},
{
    prompt_nl: "Goedemorgen, ben je klaar?",
    prompt_en: "Good morning, are you ready?",
    expected_responses: [
        { nl: "goedemorgen ja ik ben klaar", en: "Good morning, yes I am ready" },
        { nl: "ik ben vandaag niet klaar", en: "I am not ready today" },
        { nl: "ik heb meer tijd nodig alstublieft", en: "I need more time please" }
    ]
},
{
    prompt_nl: "Wanneer ga je naar de luchthaven?",
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
        { nl: "ja deze plek is erg goed", en: "Yes, the place is very good" },
        { nl: "ik vind deze plek niet leuk", en: "I don't like this place" },
        { nl: "het is een kleine plek", en: "It is a small place" }
    ]
},
{
    prompt_nl: "Wil je een biefstuk met friet?",
    prompt_en: "Do you want a steak with french fries?",
    expected_responses: [
        { nl: "ja met een beetje zout", en: "Yes, with a little salt" },
        { nl: "nee ik wil een salade", en: "No, I want a salad" },
        { nl: "ik wil biefstuk zonder friet", en: "I want steak without fries" }
    ]
},
{
    prompt_nl: "Hoe laat eindigt het televisieprogramma?",
    prompt_en: "What hour does the television finish?",
    expected_responses: [
        { nl: "het eindigt om tien uur", en: "It finishes at ten" },
        { nl: "het eindigt over een uur", en: "It finishes in an hour" },
        { nl: "ik kijk vandaag geen televisie", en: "I don't watch TV today" }
    ]
},
{
    prompt_nl: "Welk fruit is er in huis?",
    prompt_en: "What fruit is there in the house?",
    expected_responses: [
        { nl: "er zijn appels en bananen", en: "There is apple and banana" },
        { nl: "er is een zoete sinaasappel", en: "There is sweet orange" },
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
    prompt_nl: "Wil je met je vriend naar muziek luisteren?",
    prompt_en: "Do you want to listen to music with your friend?",
    expected_responses: [
        { nl: "ja ik luister graag naar muziek", en: "Yes, I like to listen to music" },
        { nl: "nee ik wil een boek lezen", en: "No, I want to read a book" },
        { nl: "mijn vriend is hier niet", en: "My friend is not here" }
    ]
},
{
    prompt_nl: "Wat moet je vandaag doen?",
    prompt_en: "What do you need to do today?",
    expected_responses: [
        { nl: "ik moet meer werken", en: "I need to work more" },
        { nl: "ik moet nederlands studeren", en: "I need to study Spanish" },
        { nl: "ik wil thuis uitrusten", en: "I want to rest at home" }
    ]
},
{
    prompt_nl: "Heb je problemen met de bus?",
    prompt_en: "Do you have problems with the bus?",
    expected_responses: [
        { nl: "er zijn vandaag geen problemen", en: "There are no problems today" },
        { nl: "ja de bus is langzaam", en: "Yes, the bus is slow" },
        { nl: "ik wil met de trein gaan", en: "I want to go by train" }
    ]
},
{
    prompt_nl: "Houd je van warm eten koken?",
    prompt_en: "Do you like to cook hot food?",
    expected_responses: [
        { nl: "ja ik kook soep en kip", en: "Yes, I cook soup and chicken" },
        { nl: "nee ik houd van koud fruit", en: "No, I like cold fruit" },
        { nl: "ik wil leren koken", en: "I want to learn to cook" }
    ]
}
],

A2: [
{
    prompt_nl: "Wat wil je als ontbijt?",
    prompt_en: "What do you want for breakfast?",
    expected_responses: [
        { nl: "ik wil ei brood en koffie", en: "I want egg, bread and coffee" },
        { nl: "normaal geef ik de voorkeur aan koud fruit", en: "Normally I prefer cold fruit" },
        { nl: "een vroeg ontbijt alstublieft", en: "An early breakfast, please" }
    ]
},
{
    prompt_nl: "Hoe laat is het avondeten vandaag?",
    prompt_en: "What time is dinner today?",
    expected_responses: [
        { nl: "het avondeten is vandaag laat", en: "Dinner is late today" },
        { nl: "het is over twintig minuten", en: "It is in twenty minutes" },
        { nl: "ik wil nu avondeten koken", en: "I want to cook dinner now" }
    ]
},
{
    prompt_nl: "Waarom kom je laat aan?",
    prompt_en: "Why are you arriving late?",
    expected_responses: [
        { nl: "de bus is vandaag langzaam", en: "The bus is slow today" },
        { nl: "omdat ik problemen had met de auto", en: "Because I had problems with the car" },
        { nl: "sorry de reis is moeilijk", en: "I am sorry, the trip is difficult" }
    ]
},
{
    prompt_nl: "Heb je het huiswerk afgemaakt?",
    prompt_en: "Did you finish the school homework?",
    expected_responses: [
        { nl: "ja ik heb het huiswerk al afgemaakt", en: "Yes, I already finished the homework" },
        { nl: "ik heb nog meer tijd nodig", en: "I still need more minutes" },
        { nl: "nee het huiswerk is erg moeilijk", en: "No, the homework is very difficult" }
    ]
},
{
    prompt_nl: "Heb je mijn bericht gisteravond gelezen?",
    prompt_en: "Did you read my message last night?",
    expected_responses: [
        { nl: "ja ik heb je bericht gisteravond gelezen", en: "Yes, I read your message last night" },
        { nl: "nee ik vergat te kijken", en: "No, I forgot to look at the television" },
        { nl: "ik heb de informatie nu ontvangen", en: "I received the information now" }
    ]
},
	{
    prompt_nl: "Wil je nu een film kijken?",
    prompt_en: "Do you want to watch a movie now?",
    expected_responses: [
        { nl: "ja de film is nieuw", en: "Yes, the movie is new" },
        { nl: "eerst wil ik de keuken schoonmaken", en: "Before I want to clean the kitchen" },
        { nl: "nee het is te laat om een film te kijken", en: "No, it is very late to watch a movie" }
    ]
},
{
    prompt_nl: "Kun je het keukenraam openen?",
    prompt_en: "Can you open the kitchen window?",
    expected_responses: [
        { nl: "ja de keuken is erg warm", en: "Yes, the kitchen is very hot" },
        { nl: "ik kan het raam nu niet openen", en: "I cannot open the window now" },
        { nl: "het raam is kapot", en: "The window is broken" }
    ]
},
{
    prompt_nl: "Wil je nieuwe schoenen kopen?",
    prompt_en: "Do you want to buy new shoes?",
    expected_responses: [
        { nl: "ja ik heb schoenen nodig voor de reis", en: "Yes, I need shoes for the trip" },
        { nl: "nee mijn schoenen zijn nog goed", en: "No, my small shoes are good" },
        { nl: "ik wil deze zwarte schoenen passen", en: "I want to try these black shoes" }
    ]
},
{
    prompt_nl: "Wanneer reis je met het vliegtuig?",
    prompt_en: "When do you travel by plane?",
    expected_responses: [
        { nl: "het vliegtuig vertrekt over vijftien minuten", en: "The plane leaves in fifteen minutes" },
        { nl: "ik reis vroeg in de ochtend", en: "I travel early in the morning" },
        { nl: "ik wacht nog op mijn vliegticket", en: "I am still waiting for my plane ticket" }
    ]
},
{
    prompt_nl: "Ga je je ouders bezoeken?",
    prompt_en: "Are you going to visit your parents?",
    expected_responses: [
        { nl: "ja ik ga vandaag mijn ouders bezoeken", en: "Yes, I am going to visit my parents today" },
        { nl: "ik bezoek hen vaak thuis", en: "Often I visit them at their house" },
        { nl: "nee zij zijn nu op reis", en: "No, they are on a trip now" }
    ]
},
{
    prompt_nl: "Heb je vervoer nodig om naar het hotel te gaan?",
    prompt_en: "Do you need transport to go to the hotel?",
    expected_responses: [
        { nl: "ja ik heb nu snel vervoer nodig", en: "Yes, I need fast transport now" },
        { nl: "nee het hotel is heel dichtbij", en: "No, the hotel is very near" },
        { nl: "ik rijd liever zelf naar het hotel", en: "I prefer to drive my car to the hotel" }
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
        { nl: "ja ik heb veel honger", en: "Yes, I am very hungry" },
        { nl: "eerst moet ik mijn huiswerk afmaken", en: "Before I need to finish my homework" },
        { nl: "sorry het is te laat om te lunchen", en: "I am sorry, it is very late to have lunch" }
    ]
},
{
    prompt_nl: "Ben je het bericht gisteravond vergeten?",
    prompt_en: "Did you forget the message last night?",
    expected_responses: [
        { nl: "ja ik vergat het bericht gisteravond te lezen", en: "Yes, I forgot to read the message last night" },
        { nl: "nee ik heb de informatie hier", en: "No, I have the information here" },
        { nl: "ik heb je bericht niet ontvangen", en: "I did not receive your message" }
    ]
},
{
    prompt_nl: "Hoeveel minuten heb je nodig om klaar te zijn?",
    prompt_en: "How many minutes do you need to be ready?",
    expected_responses: [
        { nl: "ik heb nog twaalf minuten nodig", en: "I need twelve minutes more" },
        { nl: "ik ben al klaar om weg te gaan", en: "I am already ready to go out" },
        { nl: "wacht vijftien minuten alstublieft", en: "Wait fifteen minutes please" }
    ]
},
{
    prompt_nl: "Rijd je graag 's nachts?",
    prompt_en: "Do you like to drive at night?",
    expected_responses: [
        { nl: "nee ik rijd liever in de middag", en: "No, I prefer to drive in the afternoon" },
        { nl: "ik rijd vaak vroeg", en: "Often I drive early" },
        { nl: "ja de weg is nu vrij", en: "Yes, the road is clear now" }
    ]
},
{
    prompt_nl: "Wat moet je in huis repareren?",
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
        { nl: "ik moet nog op mijn vervoer wachten", en: "I still need to wait for my transport" }
    ]
},
{
    prompt_nl: "Hoeveel buskaartjes heb je?",
    prompt_en: "How many bus tickets do you have?",
    expected_responses: [
        { nl: "ik heb veertien nieuwe kaartjes", en: "I have fourteen new tickets" },
        { nl: "ik heb maar twaalf kaartjes voor de familie", en: "I only have twelve tickets for the family" },
        { nl: "ik moet nog een kaartje kopen", en: "I need to buy another entry" }
    ]
},
{
    prompt_nl: "Wil je dit nieuwe eten proberen?",
    prompt_en: "Do you want to try this new food?",
    expected_responses: [
        { nl: "ja ik wil graag de biefstuk proberen", en: "Yes, I would like to try the steak" },
        { nl: "nee ik geef de voorkeur aan mijn gewone ontbijt", en: "No, I prefer my usual breakfast" },
        { nl: "omdat ik al rijst met bonen heb gegeten", en: "Because I already ate rice with beans" }
    ]
},
{
    prompt_nl: "Heb je informatie over de reis?",
    prompt_en: "Do you have information about the trip?",
    expected_responses: [
        { nl: "ja ik heb de informatie hier al", en: "Yes, I already have the information here" },
        { nl: "ik wacht nog op een bericht van mijn vriend", en: "I am still waiting for my friend's message" },
        { nl: "nee ik vergat het te vragen op het station", en: "No, I forgot to ask at the station" }
    ]
},
{
    prompt_nl: "Hoe laat komt je vriend aan?",
    prompt_en: "What time does your friend arrive?",
    expected_responses: [
        { nl: "hij komt over zestien minuten aan", en: "He arrives in sixteen minutes" },
        { nl: "normaal komt hij vroeg voor de lunch", en: "Normally he arrives early for lunch" },
        { nl: "hij komt laat aan omdat de trein langzaam is", en: "Arriving late because the train is slow" }
    ]
},
{
    prompt_nl: "Wil je vandaag in het hotel dineren?",
    prompt_en: "Do you want to have dinner at the hotel today?",
    expected_responses: [
        { nl: "ja het avondeten in het hotel is goed", en: "Yes, the hotel dinner is good" },
        { nl: "eerst wil ik mijn ouders bezoeken", en: "Before I want to visit my parents" },
        { nl: "nee ik kook liever thuis", en: "No, I prefer to cook at my house" }
    ]
},
{
    prompt_nl: "Hoeveel minuten duurt de film nog?",
    prompt_en: "How many minutes does the movie last?",
    expected_responses: [
        { nl: "de film duurt nog twintig minuten", en: "The movie lasts twenty minutes more" },
        { nl: "hij eindigt vandaag vroeg", en: "Finishing early today" },
        { nl: "er zijn nog zeventien minuten over", en: "There are still seventeen minutes left" }
    ]
},
{
    prompt_nl: "Heb je het keukenraam schoongemaakt?",
    prompt_en: "Did you clean the kitchen window?",
    expected_responses: [
        { nl: "ja het raam is nu schoon", en: "Yes, the window is clean now" },
        { nl: "nee ik vergat de keuken schoon te maken", en: "No, I forgot to clean the kitchen" },
        { nl: "ik wil eerst het raam repareren", en: "Before, I want to fix the window" }
    ]
},
{
    prompt_nl: "Hoeveel nieuwe schoenen heb je?",
    prompt_en: "How many new shoes do you have?",
    expected_responses: [
        { nl: "ik heb achttien schoenen thuis", en: "I have eighteen shoes at my house" },
        { nl: "ik heb maar één nieuw paar", en: "I only have one new pair" },
        { nl: "ik moet schoenen kopen voor de reis", en: "I need to buy shoes for the trip" }
    ]
},
{
    prompt_nl: "Wil je hier op de bus wachten?",
    prompt_en: "Do you want to wait for the bus here?",
    expected_responses: [
        { nl: "ja het vervoer is vandaag laat", en: "Yes, the transport is late today" },
        { nl: "nee ik ga liever nu naar de luchthaven", en: "No, I prefer to go to the airport now" },
        { nl: "het is beter om op het station te wachten", en: "It is better to wait at the station" }
    ]
},
{
    prompt_nl: "Waarom heb je veertien appels gekocht?",
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
        { nl: "ja vliegen is snel", en: "Yes, the trip by plane is fast" },
        { nl: "nee ik geef de voorkeur aan de trein of de bus", en: "No, I prefer the train or the bus" },
        { nl: "ik reis vaak voor mijn werk", en: "Often I travel for my work" }
    ]
},
{
    prompt_nl: "Heb je negentien treinkaartjes?",
    prompt_en: "Do you have nineteen train tickets?",
    expected_responses: [
        { nl: "ja ik heb negentien kaartjes klaar", en: "Yes, I have nineteen tickets ready" },
        { nl: "nee ik heb slechts vijftien kaartjes", en: "No, I only have fifteen tickets" },
        { nl: "ik heb er twintig nodig voor de groep", en: "I need twenty for the group" }
    ]
},
{
    prompt_nl: "Wanneer ga je je familie bezoeken?",
    prompt_en: "When are you going to visit your family?",
    expected_responses: [
        { nl: "normaal bezoek ik hen vroeg", en: "Normally I visit them early" },
        { nl: "ik ga nu met de trein", en: "I am going to go now by train" },
        { nl: "morgen want vandaag heb ik huiswerk", en: "Tomorrow because today I have homework" }
    ]
},
{
    prompt_nl: "Heb je een bericht op mijn telefoon achtergelaten?",
    prompt_en: "Did you leave a message on my phone?",
    expected_responses: [
        { nl: "ja ik heb een snel bericht gestuurd", en: "Yes, I sent a quick message" },
        { nl: "nee ik ben je informatie vergeten", en: "No, I forgot your information" },
        { nl: "nog niet ik bel later", en: "Not yet, I will call later" }
    ]
},
{
    prompt_nl: "Welke film wil je op televisie kijken?",
    prompt_en: "What movie do you want to watch on TV?",
    expected_responses: [
        { nl: "ik wil een nieuwe film kijken", en: "I want to watch a new movie" },
        { nl: "ik luister nu liever naar muziek", en: "I prefer to listen to music now" },
        { nl: "elke goede film is perfect", en: "Any good movie is perfect" }
    ]
},
{
    prompt_nl: "Waar heb je die nieuwe schoenen gekocht?",
    prompt_en: "Where did you buy those new shoes?",
    expected_responses: [
        { nl: "ik heb ze dichtbij het station gekocht", en: "I bought them near the station" },
        { nl: "in een kleine winkel in het centrum", en: "In a small place downtown" },
        { nl: "ik ben de naam van de winkel vergeten", en: "I already forgot the name of the store" }
    ]
},
{
    prompt_nl: "Waarom heb je het keukenraam geopend?",
    prompt_en: "Why did you open the kitchen window?",
    expected_responses: [
        { nl: "omdat de keuken erg warm is", en: "Because the kitchen is very hot" },
        { nl: "voordat ik vandaag de keuken schoonmaak", en: "Before cleaning the kitchen today" },
        { nl: "om een minuut naar de tuin te kijken", en: "To see the garden for a minute" }
    ]
},
{
    prompt_nl: "Heb je genoeg informatie voor de reis?",
    prompt_en: "Do you have enough information for the trip?",
    expected_responses: [
        { nl: "ja ik heb de informatie al klaar", en: "Yes, I already have the information ready" },
        { nl: "ik moet nog op het bericht wachten", en: "I still need to wait for the message" },
        { nl: "nee de informatie is erg moeilijk", en: "No, the information is very difficult" }
    ]
},
{
    prompt_nl: "Wil je vandaag vroeg avondeten?",
    prompt_en: "Do you want to have dinner early today?",
    expected_responses: [
        { nl: "ja ik wil nu avondeten", en: "Yes, I want to have dinner now please" },
        { nl: "nee normaal eet ik heel laat", en: "No, normally I have dinner very late" },
        { nl: "omdat ik eerst huiswerk moet maken", en: "Because I have to do homework before" }
    ]
},
{
    prompt_nl: "Heb je de auto van je vader gerepareerd?",
    prompt_en: "Did you fix your father's car?",
    expected_responses: [
        { nl: "ja de auto repareren was makkelijk", en: "Yes, fixing the car was easy" },
        { nl: "ik ben de auto nog aan het repareren", en: "I am still fixing the car" },
        { nl: "nee de auto staat in de garage", en: "No, the car is in the repair shop" }
    ]
},
{
    prompt_nl: "Hoeveel minuten zijn er nog tot aankomst?",
    prompt_en: "How many minutes are left to arrive?",
    expected_responses: [
        { nl: "er zijn nog vijftien minuten", en: "There are fifteen minutes left to arrive" },
        { nl: "we komen vroeg aan over twaalf minuten", en: "We arrive early in twelve minutes" },
        { nl: "de bus komt vandaag laat aan", en: "The bus arrives late today" }
    ]
},
{
    prompt_nl: "Reis je vaak met het vliegtuig?",
    prompt_en: "Do you often travel by plane?",
    expected_responses: [
        { nl: "ik reis vaak voor mijn werk", en: "Often I travel for my work" },
        { nl: "nee ik reis liever met een snelle trein", en: "No, I prefer to travel by fast train" },
        { nl: "het is al mijn tweede reis dit jaar", en: "It is already my second trip this year" }
    ]
},
{
    prompt_nl: "Ben je vergeten vandaag de lunch klaar te maken?",
    prompt_en: "Did you forget to prepare lunch today?",
    expected_responses: [
        { nl: "ja ik vergat vroeg lunch te maken", en: "Yes, I forgot to cook lunch early" },
        { nl: "nee het eten staat in de keuken", en: "No, the food is in the kitchen" },
        { nl: "ik heb al biefstuk met rijst gemaakt", en: "I already prepared a steak with rice" }
    ]
},
{
    prompt_nl: "Wil je deze zwarte schoenen passen?",
    prompt_en: "Do you want to try these black shoes?",
    expected_responses: [
        { nl: "ja ik wil de nieuwe schoenen passen", en: "Yes, I want to try the new shoes" },
        { nl: "nee mijn oude schoenen zijn goed", en: "No, my old shoes are good" },
        { nl: "de schoenen zijn te klein voor mij", en: "The shoes are small for me" }
    ]
},
{
    prompt_nl: "Waarom wil je het hotel nu verlaten?",
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
        { nl: "ik heb vijftien kaartjes nodig voor de familie", en: "I need fifteen tickets for the family" },
        { nl: "ik heb vandaag maar elf kaartjes", en: "I only have eleven tickets today" }
    ]
},
{
    prompt_nl: "Studeer je normaal na het avondeten?",
    prompt_en: "Do you normally study after dinner?",
    expected_responses: [
        { nl: "normaal studeer ik voor het avondeten", en: "Normally I study before dinner" },
        { nl: "ja ik studeer elke avond dertig minuten", en: "Yes, I study thirty minutes every night" },
        { nl: "nee ik kijk liever laat een film", en: "No, I prefer to watch a movie late" }
    ]
},
{
    prompt_nl: "Waar is het raam van je keuken?",
    prompt_en: "Where is the window of your kitchen?",
    expected_responses: [
        { nl: "het is dichtbij de grote deur", en: "It is near the big door" },
        { nl: "het raam kijkt uit op de tuin", en: "The window opens to the clear garden" },
        { nl: "ik ben vergeten het raam te sluiten", en: "I forgot to close the window now" }
    ]
},
{
    prompt_nl: "Wil je morgen vroeg ontbijten?",
    prompt_en: "Do you want to have breakfast early tomorrow?",
    expected_responses: [
        { nl: "ja vroeg ontbijten is goed", en: "Yes, early breakfast is good" },
        { nl: "nee morgen sta ik liever laat op", en: "No, tomorrow I prefer to get up late" },
        { nl: "ik wil nu brood melk en fruit", en: "I want bread, milk and fruit now" }
    ]
},
{
    prompt_nl: "Heb je zeventien minuten om te praten?",
    prompt_en: "Do you have seventeen minutes to talk?",
    expected_responses: [
        { nl: "ja ik heb nu vrije tijd", en: "Yes, I have free time now" },
        { nl: "ik moet mijn huiswerk nog afmaken", en: "I still need to finish my homework" },
        { nl: "sorry het vervoer komt er al aan", en: "I am sorry, the transport is arriving already" }
    ]
},
{
    prompt_nl: "Waarom heb je gisteravond niet op mijn bericht gereageerd?",
    prompt_en: "Why didn't you answer my message last night?",
    expected_responses: [
        { nl: "omdat ik al vroeg sliep", en: "Because I was already sleeping early" },
        { nl: "ik vergat mijn telefoon op school", en: "I forgot my phone at school" },
        { nl: "ik heb het bericht vanochtend gelezen", en: "I read the message today in the morning" }
    ]
},
{
    prompt_nl: "Kwam het vervoer vandaag op tijd aan?",
    prompt_en: "Did the transport arrive on time today?",
    expected_responses: [
        { nl: "ja de bus kwam heel vroeg aan", en: "Yes, the bus arrived very early" },
        { nl: "nee de trein kwam twintig minuten te laat", en: "No, the train arrived twenty minutes late" },
        { nl: "ik wacht nog steeds op het station", en: "I am still waiting at the station" }
    ]
},
	{
    prompt_nl: "Heb je gewerkt in het nieuwe restaurant?",
    prompt_en: "Have you been working at the new restaurant?",
    expected_responses: [
        { nl: "ja ik werk daar al een maand", en: "Yes, I have been working there a month" },
        { nl: "nee ik heb gestudeerd om mezelf te verbeteren", en: "No, I have been studying to improve" },
        { nl: "nog niet maar ik wil nu beginnen", en: "Not yet, but I want to start now" }
    ]
},
{
    prompt_nl: "Wat heb je geleerd van eerdere ervaringen?",
    prompt_en: "What have you learned from past experiences?",
    expected_responses: [
        { nl: "ik heb geleerd mijn vaardigheden te verbeteren", en: "I have learned to improve my skills" },
        { nl: "ik heb geleerd aandachtig te luisteren", en: "I have learned to listen carefully" },
        { nl: "ik moet de informatie nog bekijken", en: "I still need to review the information" }
    ]
},
{
    prompt_nl: "Heeft het restaurant het menu gebracht?",
    prompt_en: "Has the restaurant brought the menu?",
    expected_responses: [
        { nl: "ja het menu is naar de tafel gebracht", en: "Yes, they have brought the menu to the table" },
        { nl: "nee breng alsjeblieft ook de rekening", en: "No, please bring the bill too" },
        { nl: "ik wil het menu begrijpen voordat ik eet", en: "I want to understand the menu before eating" }
    ]
},
{
    prompt_nl: "Waar heb je deze maand gewoond?",
    prompt_en: "Where have you been living this month?",
    expected_responses: [
        { nl: "ik heb dichtbij de luchthaven gewoond", en: "I have been living near the airport" },
        { nl: "ik heb bij mijn familie gewoond", en: "I have been living with my family" },
        { nl: "we zijn van plan binnenkort te verhuizen", en: "We plan to move house soon" }
    ]
},
{
    prompt_nl: "Hebben ze vandaag de busreis geannuleerd?",
    prompt_en: "Have they canceled the bus trip today?",
    expected_responses: [
        { nl: "ja het vervoer is geannuleerd vanwege problemen", en: "Yes, they have canceled the transport due to problems" },
        { nl: "nee de bus komt over vijftien minuten", en: "No, the bus arrives in fifteen minutes" },
        { nl: "ik moet snel een ander station vinden", en: "I need to find another station quickly" }
    ]
},
{
    prompt_nl: "Lees je thuis het dagelijkse nieuws?",
    prompt_en: "Are you reading the daily news at home?",
    expected_responses: [
        { nl: "ja ik lees om mijn communicatie te verbeteren", en: "Yes, I am reading to improve my communication" },
        { nl: "nee ik ga liever verder met mijn gesprekken", en: "No, I prefer to continue my conversations" },
        { nl: "ik vergat het dagelijkse nieuws te bekijken", en: "I forgot to review the daily information" }
    ]
},
{
    prompt_nl: "Hebben we de vliegtickets gekregen?",
    prompt_en: "Have we gotten the tickets for the plane?",
    expected_responses: [
        { nl: "ja we hebben de tickets vroeg gekregen", en: "Yes, we have gotten the tickets early" },
        { nl: "nog niet het vervoer is moeilijk", en: "Not yet, the transport is difficult" },
        { nl: "ik moet de rekening van de reis vinden", en: "I need to find the bill for the trip" }
    ]
},
{
    prompt_nl: "Wat bereid je vandaag voor het avondeten?",
    prompt_en: "What are you preparing for dinner today?",
    expected_responses: [
        { nl: "ik maak kip met rijst en kaas", en: "I am preparing chicken with rice and cheese" },
        { nl: "ik heb een biefstuk met friet gemaakt", en: "I have prepared a steak with french fries" },
        { nl: "ik wil soep maken terwijl we wachten", en: "I want to prepare soup while we wait" }
    ]
},
{
    prompt_nl: "Heb je de gesprekken op school begrepen?",
    prompt_en: "Have you understood the school conversations?",
    expected_responses: [
        { nl: "ja ik heb vandaag bijna alles begrepen", en: "Yes, I have understood almost everything today" },
        { nl: "toch moet ik meer studeren", en: "However, I need to study more" },
        { nl: "het is nog steeds moeilijk om snel te begrijpen", en: "It is still difficult to understand fast" }
    ]
},
{
    prompt_nl: "Wil je deze maand met onze reis meegaan?",
    prompt_en: "Do you want to join our trip this month?",
    expected_responses: [
        { nl: "ja ik wil vandaag met jullie groep meegaan", en: "Yes, I want to join your group today" },
        { nl: "nee ik moet deze maand werken", en: "No, I have to work during the month" },
        { nl: "we willen eerst onze ouders bezoeken", en: "We plan to visit parents before" }
    ]
},
{
    prompt_nl: "Hoe laat hebben we de dagelijkse taken afgerond?",
    prompt_en: "What time have we finished the daily tasks?",
    expected_responses: [
        { nl: "we zijn vandaag vroeg klaar geweest", en: "We have finished early today" },
        { nl: "na drie uur studeren", en: "After studying for three hours" },
        { nl: "we werken er nu nog aan", en: "We are still working on them now" }
    ]
},
{
    prompt_nl: "Waarom hebben ze hun hotelaccount geannuleerd?",
    prompt_en: "Why have they canceled their hotel account?",
    expected_responses: [
        { nl: "omdat ze hun reisplan hebben gewijzigd", en: "Because they have changed their trip plan" },
        { nl: "toch gaan ze morgen de rekening betalen", en: "However they are going to pay the bill tomorrow" },
        { nl: "ze vergaten de informatie te bekijken voordat ze vertrokken", en: "They forgot to review the information before leaving" }
    ]
},
{
    prompt_nl: "Studeer je vandaag om je vaardigheden te verbeteren?",
    prompt_en: "Are you studying to improve your skills today?",
    expected_responses: [
        { nl: "ja ik studeer om een baan te krijgen", en: "Yes, I am studying to get a job" },
        { nl: "ik moet doorgaan met mijn dagelijkse gesprekken", en: "I need to continue my daily conversations" },
        { nl: "mijn boeken bekijken helpt me snel te leren", en: "Reviewing my books helps me learn fast" }
    ]
},
{
    prompt_nl: "Heb je het eten uit het restaurant meegenomen?",
    prompt_en: "Have you brought the food from the restaurant?",
    expected_responses: [
        { nl: "ja ik heb brood soep en kaas meegenomen", en: "Yes, I have brought bread, soup and cheese" },
        { nl: "nee het restaurant is nu gesloten", en: "No, the restaurant is closed now" },
        { nl: "eten meenemen is moeilijk zonder vervoer", en: "Bringing the food is difficult without transport" }
    ]
},
{
    prompt_nl: "Waar kunnen we vandaag een goed menu vinden?",
    prompt_en: "Where can we find a good menu today?",
    expected_responses: [
        { nl: "we kunnen een menu vinden in het hotel", en: "We can find a menu at the hotel" },
        { nl: "terwijl we lopen kunnen we een restaurant zoeken", en: "While we walk we can look for a restaurant" },
        { nl: "ik heb het menu hier al", en: "I already have the kitchen menu here" }
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
        { nl: "ik wil hun problemen begrijpen voordat ik verderga", en: "I want to understand their problems before following" }
    ]
},
{
    prompt_nl: "Wil je samen met mij een nieuwe reis plannen?",
    prompt_en: "Do you want to plan a new trip with me?",
    expected_responses: [
        { nl: "ja ik wil een vliegreis plannen", en: "Yes, I want to plan a trip by plane" },
        { nl: "deze maand heb ik geen vrije tijd", en: "During this month I do not have free time" },
        { nl: "toch kunnen we er later over praten", en: "However we can talk about that later" }
    ]
},
{
    prompt_nl: "Heb je de treininformatie kunnen bekijken?",
    prompt_en: "Have you managed to review the train information?",
    expected_responses: [
        { nl: "ja ik heb alles op het station bekeken", en: "Yes, I have reviewed everything at the station" },
        { nl: "nog niet het bericht is niet aangekomen", en: "Not yet, the message did not arrive" },
        { nl: "ik moet eerst mijn treinkaartje vinden", en: "I need to find my train ticket before" }
    ]
},
{
    prompt_nl: "Waarom heb je besloten dit jaar te verhuizen?",
    prompt_en: "Why have you decided to move house this year?",
    expected_responses: [
        { nl: "omdat mijn nieuwe huis dicht bij mijn werk ligt", en: "Because my new house is near work" },
        { nl: "om weer bij mijn familie te wonen", en: "To live with my family again" },
        { nl: "ik woonde op een erg kleine plek", en: "I have been living in a very small place" }
    ]
},
{
    prompt_nl: "Heb je de rekening in het restaurant betaald?",
    prompt_en: "Have you paid the bill at the restaurant?",
    expected_responses: [
        { nl: "ja ik heb de rekening al betaald", en: "Yes, I have already paid the bill with money" },
        { nl: "nee ik wacht nog op de rekening", en: "No, I am still waiting for them to bring the bill" },
        { nl: "mijn vriend heeft vandaag alles betaald", en: "My friend has paid for everything today" }
    ]
},
{
    prompt_nl: "Werk je aan het verbeteren van je dagelijkse vaardigheden?",
    prompt_en: "Are you working to improve your daily skills?",
    expected_responses: [
        { nl: "ja ik werk elk uur hard", en: "Yes, I am working hard every hour" },
        { nl: "ik wil meer blijven leren", en: "I want to continue learning more things" },
        { nl: "mijn huiswerk nakijken helpt me verbeteren", en: "Reviewing my homework helps me improve" }
    ]
},
{
    prompt_nl: "Heeft zij het eten voor de reis voorbereid?",
    prompt_en: "Has she prepared the food for the trip?",
    expected_responses: [
        { nl: "ja ze heeft brood kaas en fruit voorbereid", en: "Yes, she has prepared bread, cheese and fruit" },
        { nl: "ze bereidt nu het eten in de keuken", en: "She is preparing the food in the kitchen now" },
        { nl: "nee ze vergat de dagelijkse dingen voor te bereiden", en: "No, she forgot to prepare the daily things" }
    ]
},
{
    prompt_nl: "Waar hebben je broers deze maand gestudeerd?",
    prompt_en: "Where have your brothers been studying this month?",
    expected_responses: [
        { nl: "ze hebben op de grote school gestudeerd", en: "They have been studying at the big school" },
        { nl: "we hebben samen thuis gestudeerd", en: "We have been studying together at home" },
        { nl: "ze willen blijven studeren in het hotel", en: "They want to continue studying at the hotel" }
    ]
},
{
    prompt_nl: "Wil je zijn bericht lezen terwijl we op de trein wachten?",
    prompt_en: "Do you want to read his message while we wait for the train?",
    expected_responses: [
        { nl: "ja ik wil het bericht nu lezen", en: "Yes, I want to read the message now" },
        { nl: "nee ik luister liever naar muziek", en: "No, I prefer to listen to music on my television" },
        { nl: "ik moet eerst de vervoersinformatie bekijken", en: "I need to review the transport information before" }
    ]
},
{
    prompt_nl: "Heb je een plek dichtbij het station gevonden?",
    prompt_en: "Have you managed to find a place near the station?",
    expected_responses: [
        { nl: "ja ik heb een klein huis dichtbij gevonden", en: "Yes, I have found a small house very near" },
        { nl: "ik zoek nog steeds met mijn vriend", en: "I am still looking with my friend" },
        { nl: "het is vandaag moeilijk om snel een plek te vinden", en: "It is difficult to find a place quickly today" }
    ]
},
	{
    prompt_nl: "Waarom heb je je gesprekken vandaag geannuleerd?",
    prompt_en: "Why have you canceled your conversations today?",
    expected_responses: [
        { nl: "omdat ik deze maand erg moe ben geweest", en: "Because I have been very tired this month" },
        { nl: "ik moet eerst mijn vliegreis voorbereiden", en: "I need to prepare my plane trip before" },
        { nl: "toch kunnen we na het avondeten praten", en: "However we can talk after having dinner" }
    ]
},
{
    prompt_nl: "Wat heeft zijn familie gezegd over de verhuizing?",
    prompt_en: "What has his family said about the move?",
    expected_responses: [
        { nl: "ze willen volgende maand verhuizen", en: "They want to move next month" },
        { nl: "ze zijn blij met de verandering van plek", en: "They are happy with the change of place" },
        { nl: "ze hebben nog steeds problemen met inpakken", en: "They still have problems packing" }
    ]
},
{
    prompt_nl: "Woon je dit jaar bij je ouders?",
    prompt_en: "Are you living with your parents this year?",
    expected_responses: [
        { nl: "ja ik woon al vijf maanden bij hen", en: "Yes, I have been working/living with them for five months" },
        { nl: "nee ik woon liever alleen in de stad", en: "No, I prefer to live alone in the city" },
        { nl: "ik wil binnenkort naar een ander huis verhuizen", en: "I want to move to another house soon" }
    ]
},
{
    prompt_nl: "Heb je het menu van het nieuwe restaurant bekeken?",
    prompt_en: "Have you reviewed the menu of the new restaurant?",
    expected_responses: [
        { nl: "ja het menu heeft biefstuk kip en vis", en: "Yes, the menu has steak, chicken and fish" },
        { nl: "nee ik vergat het menu eerder te bekijken", en: "No, I forgot to look at the menu before" },
        { nl: "ik wil eerst de prijzen begrijpen", en: "I want to understand their prices first" }
    ]
},
{
    prompt_nl: "Ben je tijdens de reis blijven studeren?",
    prompt_en: "Have you continued studying during the trip?",
    expected_responses: [
        { nl: "ja ik heb dagelijks gestudeerd", en: "Yes, I have been studying daily books" },
        { nl: "nee ik heb gerust en films gekeken", en: "No, I have been resting and watching movies" },
        { nl: "tijdens het reizen is het moeilijk om meer te studeren", en: "While I travel it is difficult to study more" }
    ]
},
{
    prompt_nl: "Hebben je ouders hun nieuwe auto meegenomen?",
    prompt_en: "Have the parents brought their new car?",
    expected_responses: [
        { nl: "ja ze hebben vandaag de grote auto meegenomen", en: "Yes, they have brought the big car today" },
        { nl: "nee de auto wordt thuis gerepareerd", en: "No, the car is fixing at home" },
        { nl: "ze willen vandaag met de trein reizen", en: "They want to travel by train today" }
    ]
},
{
    prompt_nl: "Wil je de instructies van het menu volgen?",
    prompt_en: "Do you want to follow the menu instructions?",
    expected_responses: [
        { nl: "ja om de vissoep te bereiden", en: "Yes, to prepare the fish soup" },
        { nl: "nee ik wil kip met salade koken", en: "No, I want to cook chicken with salad" },
        { nl: "ik moet eerst de informatie begrijpen", en: "I need to understand the information before" }
    ]
},
{
    prompt_nl: "Heb je de rekening voor het vervoer gekregen?",
    prompt_en: "Have you gotten the transport bill?",
    expected_responses: [
        { nl: "ja ik heb de rekening van het station gekregen", en: "Yes, I have gotten the bill from the station" },
        { nl: "nog niet het bericht is niet aangekomen", en: "Not yet, the message did not arrive" },
        { nl: "mijn vriend heeft het kaartje en de rekening", en: "My friend has the ticket and the bill" }
    ]
},
{
    prompt_nl: "Waarom heb je over deze plek gelezen?",
    prompt_en: "Why have you been reading about this place?",
    expected_responses: [
        { nl: "omdat ik van plan ben het hotel binnenkort te bezoeken", en: "Because I plan to visit the hotel soon" },
        { nl: "om de cultuur en het goede eten te begrijpen", en: "To understand its culture and good food" },
        { nl: "toch lees ik vandaag alleen voor mijn plezier", en: "However I only read for pleasure today" }
    ]
},
{
    prompt_nl: "Wonen zij al vijf jaar in dit hotel?",
    prompt_en: "Have they been living in this hotel for five years?",
    expected_responses: [
        { nl: "nee ze wonen hier pas een maand", en: "No, they have been living here a month" },
        { nl: "ja ze wonen hier al vele jaren", en: "Yes, they have been living here many years" },
        { nl: "ze willen na deze maand verhuizen", en: "They want to move house after this month" }
    ]
},
{
    prompt_nl: "Wil je je huiswerk nakijken na het eten?",
    prompt_en: "Do you want to review your homework after eating?",
    expected_responses: [
        { nl: "ja ik moet vandaag alles nakijken", en: "Yes, I need to review everything today" },
        { nl: "nee ik luister liever naar muziek en rust uit", en: "No, I prefer to listen to music and rest" },
        { nl: "ik heb de dagelijkse taken al vroeg nagekeken", en: "I already reviewed the daily tasks early" }
    ]
},
{
    prompt_nl: "Heb je gewerkt aan het verbeteren van je communicatie?",
    prompt_en: "Have you been working to improve your communication?",
    expected_responses: [
        { nl: "ja ik heb veel gesprekken gevoerd", en: "Yes, I have been having many conversations" },
        { nl: "ik wil dit jaar betere vaardigheden ontwikkelen", en: "I want to get better skills this year" },
        { nl: "het is nog steeds moeilijk om snel met vrienden te praten", en: "It is still difficult to talk fast with friends" }
    ]
},
{
    prompt_nl: "Wat heb je meegenomen voor het ontbijt van vandaag?",
    prompt_en: "What have you brought for today's breakfast?",
    expected_responses: [
        { nl: "ik heb warm brood melk en fruit meegenomen", en: "I have brought hot bread, milk and fruit" },
        { nl: "ik heb niets uit de keuken meegenomen", en: "I have not brought anything from the kitchen" },
        { nl: "mijn zus heeft eieren met kaas klaargemaakt", en: "My sister has prepared eggs with cheese" }
    ]
},
{
    prompt_nl: "Zijn ze erin geslaagd hun problemen te begrijpen?",
    prompt_en: "Have they managed to understand their problems?",
    expected_responses: [
        { nl: "ja ze hebben een uur lang gepraat", en: "Yes, they have conversed for an hour" },
        { nl: "toch moeten ze hun strategie veranderen", en: "However they need to change their strategy" },
        { nl: "nog niet het is een moeilijke situatie", en: "Not yet, it is a difficult situation" }
    ]
},
{
    prompt_nl: "Heb je gepland je vliegreis te annuleren?",
    prompt_en: "Have you planned to cancel your plane trip?",
    expected_responses: [
        { nl: "ja ik moest de reis vandaag annuleren", en: "Yes, I have had to cancel the trip today" },
        { nl: "nee ik wil deze maand naar het hotel gaan", en: "No, I want to go to the hotel this month" },
        { nl: "nog niet ik hoop eerst de informatie te bekijken", en: "Not yet, I hope to review the information before" }
    ]
},
{
    prompt_nl: "Welke vaardigheden heb je geleerd in je nieuwe baan?",
    prompt_en: "What skills have you learned in your new job?",
    expected_responses: [
        { nl: "ik heb geleerd mijn dagelijkse communicatie te verbeteren", en: "I have learned to improve my daily communication" },
        { nl: "ik heb geleerd eten te bereiden", en: "I have been learning to prepare food" },
        { nl: "ik moet nog meer blijven leren", en: "I still need to continue learning more" }
    ]
},
{
    prompt_nl: "Hebben ze 's middags hun boeken gelezen?",
    prompt_en: "Have they been reading their books during the afternoon?",
    expected_responses: [
        { nl: "ja ze hebben gelezen over eerdere ervaringen", en: "Yes, they have been reading about past experiences" },
        { nl: "nee ze luisteren liever naar muziek of kijken televisie", en: "No, they prefer to listen to music or watch TV" },
        { nl: "terwijl zij uitrusten kook ik het avondeten", en: "While they rest I cook dinner" }
    ]
},
{
    prompt_nl: "Wil je het gesprek voortzetten in het restaurant?",
    prompt_en: "Do you want to continue the conversation at the restaurant?",
    expected_responses: [
        { nl: "ja we kunnen het menu vragen en lunchen", en: "Yes, we can ask for the menu and have lunch" },
        { nl: "nee ik ga liever naar huis om uit te rusten", en: "No, I prefer to go home to rest now" },
        { nl: "nadat we de hotelrekening hebben bekeken kunnen we gaan", en: "After reviewing the hotel bill we can go" }
    ]
},
{
    prompt_nl: "Heeft je broer een nieuwe plek gevonden om te wonen?",
    prompt_en: "Has your brother gotten a new place to live?",
    expected_responses: [
        { nl: "ja hij heeft een heel goed klein huis gevonden", en: "Yes, he has found a very good small house" },
        { nl: "hij woont deze maand nog bij zijn ouders", en: "He is still living with his parents this month" },
        { nl: "hij wil na dit jaar verhuizen", en: "He wants to move house after this year" }
    ]
},
{
    prompt_nl: "Wat heb je deze maand voorbereid?",
    prompt_en: "What have you been preparing during the month?",
    expected_responses: [
        { nl: "ik heb mijn vliegreis voorbereid", en: "I have been preparing my plane trip" },
        { nl: "ik heb een nieuw werkplan gemaakt", en: "I have prepared a new plan for work" },
        { nl: "ik moet het huiswerk voorbereiden", en: "I need to prepare the school homework" }
    ]
},
{
    prompt_nl: "Heb je geprobeerd hun dagelijkse gesprekken te volgen?",
    prompt_en: "Have you tried to follow their daily conversations?",
    expected_responses: [
        { nl: "ja maar ze praten heel snel in het restaurant", en: "Yes, but they talk very fast at the restaurant" },
        { nl: "het helpt mij mijn vaardigheden te begrijpen en te verbeteren", en: "It helps me understand and improve my skills" },
        { nl: "toch lees ik liever boeken thuis", en: "However I prefer to read books at home" }
    ]
},
{
    prompt_nl: "Waarom heb je je vriend naar mijn huis gebracht?",
    prompt_en: "Why have you brought your friend to my house?",
    expected_responses: [
        { nl: "omdat we samen willen studeren en huiswerk maken", en: "Because we want to study and do homework together" },
        { nl: "om een gesprek over de vakantie te hebben", en: "To have a conversation about the vacation" },
        { nl: "hij wil vandaag mijn familie ontmoeten", en: "He wants to meet my family today" }
    ]
},
{
    prompt_nl: "Hebben ze de restaurantrekening kunnen nakijken?",
    prompt_en: "Have they managed to review the restaurant bill?",
    expected_responses: [
        { nl: "ja ze hebben de rekening bekeken voordat ze betaalden", en: "Yes, they have reviewed the bill before paying" },
        { nl: "nog niet er zijn vandaag problemen met de rekening", en: "Not yet, the bill has problems today" },
        { nl: "mijn vader heeft de lunchrekening al betaald", en: "My father has already paid the lunch bill" }
    ]
},
{
    prompt_nl: "Wil je later met ons mee eten?",
    prompt_en: "Do you want to join us for dinner later?",
    expected_responses: [
        { nl: "ja ik wil na het werk bij jullie aan tafel zitten", en: "Yes, I want to join your table after working" },
        { nl: "sorry ik heb thuis al vis gegeten", en: "I am sorry, I already ate fish at my house" },
        { nl: "zolang ik moet studeren kan ik niet uitgaan", en: "As long as I have to study I cannot go out" }
    ]
}
],
B2: [
{
    prompt_nl: "Hoe ben je van plan het nieuwe systeemproces te optimaliseren?",
    prompt_en: "How do you plan to optimize the new system process?",
    expected_responses: [
        { nl: "we moeten de prestaties zorgvuldig analyseren", en: "We need to analyze the performance carefully" },
        { nl: "met een effectieve strategie kunnen we resultaten bereiken", en: "With an effective strategy we can achieve results" },
        { nl: "hoewel het ingewikkeld is kunnen we de aanpak aanpassen", en: "Although it is complicated, we can update the approach" }
    ]
},
{
    prompt_nl: "Heb je de risico's van deze professionele strategie geëvalueerd?",
    prompt_en: "Have you evaluated the risks of this professional strategy?",
    expected_responses: [
        { nl: "ja ik heb elk mogelijk risico geëvalueerd", en: "Yes, I have evaluated every possible risk" },
        { nl: "daarom is het nodig de aanpak te veranderen", en: "Therefore it is necessary to change the approach" },
        { nl: "er bestaat een mogelijkheid op problemen", en: "There is a possibility of having problems" }
    ]
},
{
    prompt_nl: "Welke resultaten hebben ze tijdens de vergadering geanalyseerd?",
    prompt_en: "What results have they analyzed in the meeting?",
    expected_responses: [
        { nl: "ze hebben zeer positieve prestaties geanalyseerd", en: "They have analyzed a very positive performance" },
        { nl: "bovendien hebben ze het werkconcept geoptimaliseerd", en: "In addition they have optimized the concept of work" },
        { nl: "de resultaten tonen aan dat het systeem werkt", en: "The results show that the system works" }
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
        { nl: "ja ik heb alles met mijn ouders verduidelijkt", en: "Yes, I have clarified everything with my parents" },
        { nl: "hoewel het een langetermijnplan is is het goed", en: "Although it is long term, the plan is good" },
        { nl: "ik moet nog een afgelegen plek verkennen", en: "I still need to explore a remote place" }
    ]
},
{
    prompt_nl: "Waarom hebben ze erop aangedrongen het systeem te vernieuwen?",
    prompt_en: "Why have they insisted on updating the system?",
    expected_responses: [
        { nl: "om de communicatie in de samenleving te verbeteren", en: "To increase communication in society" },
        { nl: "ze hebben aangedrongen omdat de strategie is veranderd", en: "They have insisted because the strategy has changed" },
        { nl: "zelfs met problemen is vooruitgang nodig", en: "Even with problems, it is necessary to move forward" }
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
        { nl: "onze samenleving kan zich goed aanpassen aan veranderingen", en: "Our society knows how to adapt to changes" },
        { nl: "het is een ingewikkeld maar positief proces", en: "It is a complicated but positive process" },
        { nl: "uitdagingen bespreken helpt de cultuur te versterken", en: "Discussing challenges helps to strengthen culture" }
    ]
},
{
    prompt_nl: "Heb je de mogelijkheid onderzocht om het risico te verminderen?",
    prompt_en: "Have you explored the possibility of reducing the risk?",
    expected_responses: [
        { nl: "ja ik heb een realistischere strategie onderzocht", en: "Yes, I have explored a more realistic strategy" },
        { nl: "daarom hebben we vandaag het risico verminderd", en: "Therefore we have reduced the risk today" },
        { nl: "het concept moet nog steeds geanalyseerd worden", en: "It is still necessary to analyze the concept" }
    ]
},
{
    prompt_nl: "Is het mogelijk nu effectieve prestaties te bereiken?",
    prompt_en: "Is it possible to achieve an effective performance now?",
    expected_responses: [
        { nl: "ja met een innovatief systeem is dat mogelijk", en: "Yes, with an innovative system it is possible" },
        { nl: "we hebben de aanpak geoptimaliseerd om dat te bereiken", en: "We have optimized the approach to achieve it" },
        { nl: "de huidige situatie is echter moeilijk", en: "However the current situation is difficult" }
    ]
},
{
    prompt_nl: "Hebben ze de nieuwe communicatiestrategie besproken?",
    prompt_en: "Have they discussed the new communication strategy?",
    expected_responses: [
        { nl: "ja ze hebben de strategie zorgvuldig besproken", en: "Yes, they have discussed the strategy carefully" },
        { nl: "bovendien hebben ze alle verwachtingen verduidelijkt", en: "In addition they have clarified all expectations" },
        { nl: "daarom is het proces vandaag duidelijker", en: "Therefore the process is clearer today" }
    ]
},
{
    prompt_nl: "Is het nodig de langetermijnaanpak te veranderen?",
    prompt_en: "Is it necessary to change the long term approach?",
    expected_responses: [
        { nl: "ja een realistische aanpak is vandaag nodig", en: "Yes, a realistic approach is necessary today" },
        { nl: "ondanks de resultaten wacht ik liever", en: "Despite the results, I prefer to wait" },
        { nl: "hoewel het moeilijk is ziet de toekomst er positief uit", en: "Although it is difficult, the future is positive" }
    ]
},
{
    prompt_nl: "Heb je de informatie over het systeem bijgewerkt?",
    prompt_en: "Have you updated the system information?",
    expected_responses: [
        { nl: "ja ik heb de informatie vandaag bijgewerkt", en: "Yes, I have updated the information today" },
        { nl: "ik moet het proces optimaliseren voordat ik iets verander", en: "I need to optimize the process before changing" },
        { nl: "zelfs zonder hulp heb ik alles bijgewerkt", en: "Even without help, I achieved updating everything" }
    ]
},
{
    prompt_nl: "Welke uitdagingen heeft onze huidige samenleving?",
    prompt_en: "What challenges does our current society have?",
    expected_responses: [
        { nl: "we moeten cultuur en onderwijs versterken", en: "We must strengthen culture and education" },
        { nl: "de situatie is een ingewikkeld proces", en: "The situation is a complicated process" },
        { nl: "daarom is motivatie erg belangrijk", en: "Therefore motivation is very necessary" }
    ]
},
{
    prompt_nl: "Hebben ze de prestaties van het vervoer geëvalueerd?",
    prompt_en: "Have they evaluated the transport performance?",
    expected_responses: [
        { nl: "ja ze hebben het treinsysteem geëvalueerd", en: "Yes, they have evaluated the train system" },
        { nl: "de prestaties zijn deze maand verminderd", en: "The performance has been reduced this month" },
        { nl: "het is mogelijk beter vervoer te coördineren", en: "It is possible to coordinate better transport" }
    ]
},
	{
    prompt_nl: "Hebben ze tijdens hun reis een afgelegen plek verkend?",
    prompt_en: "Have they explored a remote place during their trip?",
    expected_responses: [
        { nl: "ja ze hebben een zeer afgelegen plek verkend", en: "Yes, they have explored a very remote place" },
        { nl: "hun langetermijnreis is positief geweest", en: "Their long term trip has been positive" },
        { nl: "het was echter een ingewikkeld proces om daar te komen", en: "However it was a complicated process to get there" }
    ]
},
{
    prompt_nl: "Heb je daarom besloten de informatie bij te werken?",
    prompt_en: "Therefore have you decided to update the information?",
    expected_responses: [
        { nl: "ja ik heb de resultaten van het proces bijgewerkt", en: "Yes, I have updated the process results" },
        { nl: "ik heb de situatie al zorgvuldig geanalyseerd", en: "I have already analyzed the situation carefully" },
        { nl: "ik moet dit nog met mijn vriend bespreken", en: "I still need to discuss this with my friend" }
    ]
},
{
    prompt_nl: "Is het moeilijk om vandaag een realistische aanpak te bereiken?",
    prompt_en: "Is it complicated to achieve a realistic approach today?",
    expected_responses: [
        { nl: "ja de huidige situatie is erg ingewikkeld", en: "Yes, the current situation is very complicated" },
        { nl: "hoewel het moeilijk is is het met inzet mogelijk", en: "Although it is difficult, with work it is possible" },
        { nl: "we hebben de strategie uitgebreid om resultaten te bereiken", en: "We have expanded the strategy to achieve results" }
    ]
},
{
    prompt_nl: "Heb je de prestaties van het restaurant kunnen optimaliseren?",
    prompt_en: "Have you achieved optimizing the performance of the restaurant?",
    expected_responses: [
        { nl: "ja we hebben het keukenproces geoptimaliseerd", en: "Yes, we have optimized the kitchen process" },
        { nl: "daarom zijn de resultaten vandaag erg positief", en: "Therefore the results are very positive today" },
        { nl: "hoewel het ingewikkeld was hebben we de aanpak veranderd", en: "Although it was complicated, we achieved changing the approach" }
    ]
},
{
    prompt_nl: "Welke professionele strategie heb je voor de toekomst?",
    prompt_en: "What professional strategy do you have for the future?",
    expected_responses: [
        { nl: "ik ben van plan mijn vaardigheden op lange termijn te versterken", en: "I plan to strengthen my skills long term" },
        { nl: "bovendien wil ik een innovatieve aanpak onderzoeken", en: "In addition I want to explore an innovative approach" },
        { nl: "mijn strategie is het risico van het proces te verminderen", en: "My strategy is to reduce the risk of the process" }
    ]
},
{
    prompt_nl: "Hebben ze de informatie over de verhuizing gecoördineerd?",
    prompt_en: "Have they coordinated the information of the move?",
    expected_responses: [
        { nl: "ja de situatie is zorgvuldig gecoördineerd", en: "Yes, the situation has been coordinated carefully" },
        { nl: "we hebben vandaag de reisplannen bijgewerkt", en: "We have updated the trip plans today" },
        { nl: "zelfs met problemen is het mogelijk snel te verhuizen", en: "Even with problems, it is possible to move soon" }
    ]
},
{
    prompt_nl: "Waarom heb je de uitdagingen met de familie besproken?",
    prompt_en: "Why have you discussed the challenges with the family?",
    expected_responses: [
        { nl: "omdat hun verwachtingen erg hoog zijn", en: "Because their expectations are very high" },
        { nl: "problemen bespreken helpt de motivatie", en: "Discussing the problems helps motivation" },
        { nl: "we willen ons samen aanpassen aan de nieuwe situatie", en: "We want to adapt together to the new situation" }
    ]
},
{
    prompt_nl: "Is het nodig het transportsysteem te evalueren?",
    prompt_en: "Is it necessary to evaluate the transport system?",
    expected_responses: [
        { nl: "ja om het risico op het station te verminderen", en: "Yes, to reduce the risk at the station" },
        { nl: "we hebben de prestaties van de bus eerder geëvalueerd", en: "We have evaluated the bus performance before" },
        { nl: "daarom is een realistische aanpak vandaag mogelijk", en: "Therefore a realistic approach is possible today" }
    ]
},
{
    prompt_nl: "Heb je het begrip van de samenleving met je vrienden verduidelijkt?",
    prompt_en: "Have you clarified the concept of society with your friends?",
    expected_responses: [
        { nl: "ja we hebben de cultuur zorgvuldig geanalyseerd", en: "Yes, we have analyzed its culture carefully" },
        { nl: "het is een ingewikkeld maar zeer positief concept", en: "It is a complicated but very positive concept" },
        { nl: "bovendien helpt het om eerdere ervaringen te begrijpen", en: "In addition it helps to understand past experiences" }
    ]
},
{
    prompt_nl: "Zijn de resultaten van je werk verbeterd?",
    prompt_en: "Have the results of your work increased?",
    expected_responses: [
        { nl: "ja ik heb mijn prestaties deze maand verbeterd", en: "Yes, I have achieved increasing my performance this month" },
        { nl: "met een effectieve strategie is alles mogelijk", en: "With an effective strategy everything is possible" },
        { nl: "de huidige situatie is echter moeilijk", en: "However the current situation is difficult" }
    ]
},
{
    prompt_nl: "Hoe kunnen we een realistische aanpak voor de reis bereiken?",
    prompt_en: "How can we achieve a realistic approach for the trip?",
    expected_responses: [
        { nl: "we moeten de stappen van de reis vooraf plannen", en: "We must plan the trip steps before" },
        { nl: "ondanks de afstand is het een goede afgelegen locatie", en: "Despite the distance, it is a good remote place" },
        { nl: "hoewel het een langetermijnplan is is het effectief", en: "Although it is long term, the plan is effective" }
    ]
},
{
    prompt_nl: "Waarom heb je betoogd dat het risico hoog is?",
    prompt_en: "Why have you argued that the risk is high?",
    expected_responses: [
        { nl: "omdat ik de situatie al opnieuw heb geëvalueerd", en: "Because I have already evaluated the situation again" },
        { nl: "het huidige proces heeft veel uitdagingen", en: "The current process has many challenges" },
        { nl: "daarom is het nodig de strategie te veranderen", en: "Therefore it is necessary to change the strategy" }
    ]
},
{
    prompt_nl: "Heb je dit jaar een innovatiever systeem onderzocht?",
    prompt_en: "Have you explored a more innovative system this year?",
    expected_responses: [
        { nl: "ja ik heb een nieuw professioneel systeem onderzocht", en: "Yes, I have explored a new professional system" },
        { nl: "we hebben de aanpak uitgebreid om resultaten te optimaliseren", en: "We have expanded the approach to optimize results" },
        { nl: "ik moet dit nog met mijn team bespreken", en: "I still need to discuss this with my team" }
    ]
},
{
    prompt_nl: "Is het je gelukt de verwachtingen met je familie af te stemmen?",
    prompt_en: "Have you achieved coordinating the expectations with your family?",
    expected_responses: [
        { nl: "ja de verwachtingen zijn vandaag verduidelijkt", en: "Yes, the expectations have been clarified today" },
        { nl: "we hebben een positieve motivatie voor de toekomst", en: "We have a positive motivation for the future" },
        { nl: "hoewel het een moeilijk proces was zijn we vooruitgekomen", en: "Although it was a difficult process, we achieved moving forward" }
    ]
},
{
    prompt_nl: "Waarom wil je de systeemstrategie bijwerken?",
    prompt_en: "Why do you want to update the system strategy?",
    expected_responses: [
        { nl: "omdat we de dagelijkse prestaties willen optimaliseren", en: "Because we want to optimize the daily performance" },
        { nl: "om het risico van de huidige situatie te verminderen", en: "To reduce the risk of the current situation" },
        { nl: "een effectieve strategie vergroot de kans op succes", en: "An effective strategy increases the possibility of success" }
    ]
},
{
    prompt_nl: "Welke resultaten heb je op het werk geëvalueerd?",
    prompt_en: "What results have you evaluated at work?",
    expected_responses: [
        { nl: "ik heb vandaag zeer positieve prestaties geëvalueerd", en: "I have evaluated a very positive performance today" },
        { nl: "bovendien zijn de resultaten van het proces realistisch", en: "In addition the process results are realistic" },
        { nl: "ik moet eerst nog wat informatie analyseren", en: "I still need to analyze some information before" }
    ]
},
{
    prompt_nl: "Is het mogelijk je aan deze andere cultuur aan te passen?",
    prompt_en: "Is it possible to adapt to this different culture?",
    expected_responses: [
        { nl: "ja ik heb mij snel aangepast aan hun samenleving", en: "Yes, I have adapted to their society quickly" },
        { nl: "hoewel het ingewikkeld is is de cultuur goed", en: "Although it is complicated, the culture is good" },
        { nl: "ondanks de uitdagingen blijft de aanpak positief", en: "Despite the challenges, the approach is positive" }
    ]
},
{
    prompt_nl: "Heb je daarom besloten de afgelegen reis te annuleren?",
    prompt_en: "Therefore have you decided to cancel the remote trip?",
    expected_responses: [
        { nl: "ja de langetermijnreis is erg duur", en: "Yes, the long term trip is very expensive" },
        { nl: "nee ik wil die plek in de toekomst verkennen", en: "No, I want to explore that place in the future" },
        { nl: "ik wacht nog op bevestiging van het vervoer", en: "I am still waiting for the transport confirmation" }
    ]
},
{
    prompt_nl: "Welk professioneel concept wil je vandaag bespreken?",
    prompt_en: "What professional concept do you want to discuss today?",
    expected_responses: [
        { nl: "ik wil de strategie bespreken om doelen te bereiken", en: "I want to discuss the strategy to achieve goals" },
        { nl: "het concept van een realistische systeembenadering", en: "The concept of realistic system approach" },
        { nl: "we moeten eerst de resultaten van deze maand verduidelijken", en: "We need to clarify the results of the month before" }
    ]
},
{
    prompt_nl: "Heb je erop aangedrongen de dagelijkse communicatie te versterken?",
    prompt_en: "Have you insisted on strengthening daily communication?",
    expected_responses: [
        { nl: "ja om de gesprekken binnen het team te verbeteren", en: "Yes, to optimize team conversations" },
        { nl: "goede communicatie vermindert het risico op problemen", en: "Good communication reduces the risk of problems" },
        { nl: "zelfs met weinig tijd is praten noodzakelijk", en: "Even with little time, it is necessary to talk" }
    ]
},
{
    prompt_nl: "Hoewel de situatie moeilijk is, is de aanpak effectief?",
    prompt_en: "Although the situation is difficult, is the approach effective?",
    expected_responses: [
        { nl: "ja we hebben zeer positieve resultaten bereikt", en: "Yes, we have achieved very positive results" },
        { nl: "daarom willen we met dit plan doorgaan", en: "Therefore we want to continue with this plan" },
        { nl: "we moeten de prestaties nogmaals evalueren", en: "We need to evaluate the performance once more" }
    ]
},
{
    prompt_nl: "Hoe wil je de motivatie van de samenleving vergroten?",
    prompt_en: "How do you plan to increase the motivation of society?",
    expected_responses: [
        { nl: "motivatie vergroten is een langetermijnproces", en: "Increasing motivation is a long-term process" },
        { nl: "met een innovatief systeem en een positieve aanpak", en: "With an innovative system and a positive approach" },
        { nl: "uitdagingen bespreken helpt daarbij", en: "Discussing the challenges helps to achieve it" }
    ]
},
{
    prompt_nl: "Heb je de reisinformatie zorgvuldig geanalyseerd?",
    prompt_en: "Have you carefully analyzed the trip information?",
    expected_responses: [
        { nl: "ja ik heb eerder de tickets en het hotel gecontroleerd", en: "Yes, I have reviewed the tickets and the hotel before" },
        { nl: "de reis naar deze afgelegen plek heeft risico's", en: "The trip to this remote place has its risks" },
        { nl: "ik heb alles al voorbereid voor volgende maand", en: "I have already prepared everything for next month" }
    ]
}
]
};

const CEFR_CONVERSATION_AUDIO_A1 = [
    { nl: "wat wil je drinken", file: "wat-wil-je-drinken.mp3", en: "What would you like to drink?" },
    { nl: "hoe gaat het vandaag", file: "hoe-gaat-het-vandaag.mp3", en: "How are you today?" },
    { nl: "waar woon je", file: "waar-woon-je.mp3", en: "Where do you live?" },
    { nl: "wat wil je eten", file: "wat-wil-je-eten.mp3", en: "What do you want to eat?" },
    { nl: "heb je honger", file: "heb-je-honger.mp3", en: "Are you hungry?" },
    { nl: "wat doe je graag", file: "wat-doe-je-graag.mp3", en: "What do you like to do?" },
    { nl: "hoe laat sta je op", file: "hoe-laat-sta-je-op.mp3", en: "What time do you get up?" },
    { nl: "wil je vandaag uitgaan", file: "wil-je-vandaag-uitgaan.mp3", en: "Do you want to go out today?" },
    { nl: "wat ben je aan het doen", file: "wat-ben-je-aan-het-doen.mp3", en: "What are you doing?" },
    { nl: "wil je een film kijken", file: "wil-je-een-film-kijken.mp3", en: "Do you want to watch a movie?" },
    { nl: "waar is het toilet", file: "waar-is-het-toilet.mp3", en: "Where is the bathroom?" },
    { nl: "van welke muziek houd je", file: "van-welke-muziek-houd-je.mp3", en: "What music do you like?" },
    { nl: "wil je uitrusten", file: "wil-je-uitrusten.mp3", en: "Do you want to rest?" },
    { nl: "wat is er in de keuken", file: "wat-is-er-in-de-keuken.mp3", en: "What is in the kitchen?" },
    { nl: "wil je naar het hotel gaan", file: "wil-je-naar-het-hotel-gaan.mp3", en: "Do you want to go to the hotel?" },
    { nl: "van welk fruit houd je", file: "van-welk-fruit-houd-je.mp3", en: "What fruit do you like?" },
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
    { nl: "wat eet je normaal als lunch", file: "wat-eet-je-normaal-als-lunch.mp3", en: "What do you normally have for lunch?" },
    { nl: "welke film wil je kijken", file: "welke-film-wil-je-kijken.mp3", en: "What movie do you want to watch?" },
    { nl: "welk bericht heb je ontvangen", file: "welk-bericht-heb-je-ontvangen.mp3", en: "What message did you receive?" },
    { nl: "wat ga je vanavond koken", file: "wat-ga-je-vanavond-koken.mp3", en: "What are you going to cook tonight?" },
    { nl: "welk huiswerk heb je vandaag", file: "welk-huiswerk-heb-je-vandaag.mp3", en: "What homework do you have today?" },
    { nl: "wat wil je bezoeken tijdens je volgende reis", file: "wat-wil-je-bezoeken-tijdens-je-volgende-reis.mp3", en: "What do you want to visit on your next trip?" },
    { nl: "rijd je vaak", file: "rijd-je-vaak.mp3", en: "Do you drive often?" },
    { nl: "waar wacht je vandaag op", file: "waar-wacht-je-vandaag-op.mp3", en: "What are you waiting for today?" },
    { nl: "wat zou je willen vergeten", file: "wat-zou-je-willen-vergeten.mp3", en: "What would you like to forget?" },
    { nl: "wat doe je voordat je gaat slapen", file: "wat-doe-je-voordat-je-gaat-slapen.mp3", en: "What do you do before sleeping?" },
    { nl: "wat doe je na de lunch", file: "wat-doe-je-na-de-lunch.mp3", en: "What do you do after lunch?" },
    { nl: "welk vervoer gebruik je normaal", file: "welk-vervoer-gebruik-je-normaal.mp3", en: "What transport do you normally use?" },
    { nl: "welke keuken vind je het leukst", file: "welke-keuken-vind-je-het-leukst.mp3", en: "Which kitchen do you like more?" },
    { nl: "wat doe je nu", file: "wat-doe-je-nu.mp3", en: "What are you doing now?" },
    { nl: "welke schoenen draag je vandaag", file: "welke-schoenen-draag-je-vandaag.mp3", en: "What shoes are you wearing today?" },
    { nl: "wat zou je morgen willen koken", file: "wat-zou-je-morgen-willen-koken.mp3", en: "What would you like to cook tomorrow?" },
    { nl: "welke informatie heb je nodig", file: "welke-informatie-heb-je-nodig.mp3", en: "What information do you need?" },
    { nl: "wat doe je wanneer je thuiskomt", file: "wat-doe-je-wanneer-je-thuiskomt.mp3", en: "What do you do when you arrive home?" },
    { nl: "wat zou je dit jaar willen bezoeken", file: "wat-zou-je-dit-jaar-willen-bezoeken.mp3", en: "What would you like to visit this year?" }
];

const CEFR_CONVERSATION_AUDIO_B1 = [
    { nl: "wat heb je onlangs geleerd", file: "wat-heb-je-onlangs-geleerd.mp3", en: "What have you learned recently?" },
    { nl: "wat studeer je nu", file: "wat-studeer-je-nu.mp3", en: "What are you studying now?" },
    { nl: "welke ervaringen uit het verleden herinner je je het meest", file: "welke-ervaringen-uit-het-verleden-herinner-je-je-het-meest.mp3", en: "What past experiences do you remember most?" },
    { nl: "welke vaardigheden wil je verbeteren", file: "welke-vaardigheden-wil-je-verbeteren.mp3", en: "What skills do you want to improve?" },
    { nl: "waar werk je deze week aan", file: "waar-werk-je-deze-week-aan.mp3", en: "What are you working on this week?" },
    { nl: "welke gesprekken voer je vaak", file: "welke-gesprekken-voer-je-vaak.mp3", en: "What conversations do you often have?" },
    { nl: "wat heb je de laatste tijd gedaan", file: "wat-heb-je-de-laatste-tijd-gedaan.mp3", en: "What have you been doing lately?" },
    { nl: "wat wil je deze maand bereiken", file: "wat-wil-je-deze-maand-bereiken.mp3", en: "What do you want to achieve this month?" },
    { nl: "wat zou je graag blijven leren", file: "wat-zou-je-graag-blijven-leren.mp3", en: "What would you like to continue learning?" },
    { nl: "welk type communicatie is belangrijk voor jou", file: "welk-type-communicatie-is-belangrijk-voor-jou.mp3", en: "What type of communication is important to you?" }
];

const CEFR_CONVERSATION_AUDIO_B2 = [
    { nl: "welke strategie gebruik je om beter te leren", file: "welke-strategie-gebruik-je-om-beter-te-leren.mp3", en: "What strategy do you use to learn better?" },
    { nl: "hoe beoordeel je je prestaties op het werk", file: "hoe-beoordeel-je-je-prestaties-op-het-werk.mp3", en: "How do you evaluate your performance at work?" },
    { nl: "welk concept vind je de laatste tijd ingewikkeld", file: "welk-concept-vind-je-de-laatste-tijd-ingewikkeld.mp3", en: "What concept seems complicated to you lately?" },
    { nl: "welk risico vind je belangrijk in je werk", file: "welk-risico-vind-je-belangrijk-in-je-werk.mp3", en: "What risk do you consider important in your work?" },
    { nl: "welke mogelijkheid zou je willen onderzoeken", file: "welke-mogelijkheid-zou-je-willen-onderzoeken.mp3", en: "What possibility would you like to explore?" },
    { nl: "welke situatie heeft je onlangs beïnvloed", file: "welke-situatie-heeft-je-onlangs-beinvloed.mp3", en: "What situation has affected you recently?" },
    { nl: "hoe optimaliseer je elke dag je tijd", file: "hoe-optimaliseer-je-elke-dag-je-tijd.mp3", en: "How do you optimize your time each day?" },
    { nl: "welke professionele aanpak werkt het beste voor jou", file: "welke-professionele-aanpak-werkt-het-beste-voor-jou.mp3", en: "What professional approach works best for you?" },
    { nl: "welke taak zou je willen bijwerken", file: "welke-taak-zou-je-willen-bijwerken.mp3", en: "What task would you like to update?" },
    { nl: "wat heb je deze week geanalyseerd", file: "wat-heb-je-deze-week-geanalyseerd.mp3", en: "What have you analyzed this week?" }
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
            <p>Breakdown of Dutch word types you're training.</p>
        </div>

        <div class="glass-panel quiz-card">
            <ul>
                ${Object.keys(grouped).map(cat => `
                    <li><strong>${cat}</strong>: ${grouped[cat].length} items</li>
                `).join("")}
            </ul>

            <p style="margin-top:10px;opacity:0.8;">
                Notice how Dutch connectors, verbs, adjectives and nouns combine.
            </p>
        </div>
    `;
}


/* ============================================================
   MINING REFERENCES TAB (DUTCH VERSION)
   ============================================================ */

function renderMiningReferencesTab() {

  const tabContainer = document.getElementById("mining-content");
  if (!tabContainer) return;

  const miningData =
    typeof MINING_REFERENCES !== "undefined"
      ? MINING_REFERENCES
      : null;

  if (!miningData) {

    tabContainer.innerHTML = `
      <div class="mining-references-container">
        <h2>Mining Terminology</h2>
        <p>No mining data found.</p>
      </div>
    `;

    return;
  }

  const categories = Object.keys(miningData);

  if (!window.currentMiningCategory) {
    window.currentMiningCategory = categories[0];
  }

  let htmlContent = `
    <div class="mining-references-container">

      <div class="tab-header-section" style="margin-bottom:20px;">
        <h2>Mining Terminology / Mijnbouwterminologie</h2>

        <p class="section-subtitle" style="color:#94a3b8;">
          Explore key mining concepts with individual or sequential audio playback.
        </p>
      </div>
  `;

  // Category Buttons
  htmlContent += `
    <div
      class="category-selector-container"
      style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;"
    >
  `;

  categories.forEach(cat => {

    const isActive =
      cat === window.currentMiningCategory
        ? "active"
        : "";

    htmlContent += `
      <button
        class="category-btn ${isActive}"
        onclick="switchMiningCategory('${cat}')"
        style="
          padding:10px 18px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.2);
          background:${
            isActive === "active"
              ? "var(--accent-color,#3b82f6)"
              : "rgba(255,255,255,0.05)"
          };
          color:white;
          cursor:pointer;
          font-weight:600;
          transition:all 0.2s;
        "
      >
        ${cat}
      </button>
    `;
  });

  htmlContent += `</div>`;

  // Master Audio Controls
  htmlContent += `
    <div
      class="master-audio-controls"
      style="
        display:flex;
        gap:10px;
        margin-bottom:25px;
        align-items:center;
        flex-wrap:wrap;
        background:rgba(255,255,255,0.03);
        padding:12px 18px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,0.1);
      "
    >
      <button
        onclick="playAllMiningAudio()"
        style="
          background:#10b981;
          color:white;
          border:none;
          padding:8px 16px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        "
      >
        ▶ Play All
      </button>

      <button
        onclick="pauseMiningAudio()"
        style="
          background:#f59e0b;
          color:white;
          border:none;
          padding:8px 16px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        "
      >
        ⏸ Pause
      </button>

      <button
        onclick="resumeMiningAudio()"
        style="
          background:#3b82f6;
          color:white;
          border:none;
          padding:8px 16px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        "
      >
        ▶ Resume
      </button>

      <button
        onclick="stopMiningAudio()"
        style="
          background:#ef4444;
          color:white;
          border:none;
          padding:8px 16px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        "
      >
        ⏹ Stop
      </button>
    </div>
  `;

  // Mining Cards
  htmlContent += `
    <div
      class="mining-cards-grid"
      style="
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
        gap:15px;
      "
    >
  `;

  const currentTerms =
    miningData[window.currentMiningCategory] || [];

  currentTerms.forEach(item => {

    const safeNl =
      item.dutch.replace(/'/g, "\\'");

    htmlContent += `
      <div
        class="word-pill"
        style="
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.12);
          padding:14px 18px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          box-shadow:0 4px 6px rgba(0,0,0,0.1);
        "
      >
        <div class="pill-text-content">

          <div
            class="term-nl"
            style="
              font-weight:700;
              font-size:1.05rem;
              color:#ffffff;
              margin-bottom:3px;
            "
          >
            ${item.dutch}
          </div>

          <div
            class="term-en"
            style="
              font-size:0.9rem;
              color:#94a3b8;
            "
          >
            ${item.english}
          </div>

        </div>

        <button
          class="audio-btn"
          onclick="speakDutch('${safeNl}')"
          title="Listen"
          style="
            background:rgba(59,130,246,0.2);
            border:1px solid rgba(59,130,246,0.4);
            color:#60a5fa;
            width:38px;
            height:38px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
          "
        >
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

  const miningData =
    MINING_REFERENCES[window.currentMiningCategory];

  if (!miningData || miningData.length === 0) {
    return;
  }

  if (miningAudioQueueIndex >= miningData.length) {
    miningAudioQueueIndex = 0;
  }

  isMiningAudioPlaying = true;
  playNextInMiningQueue();
};

function playNextInMiningQueue() {

  if (!isMiningAudioPlaying) return;

  const miningData =
    MINING_REFERENCES[window.currentMiningCategory];

  if (
    !miningData ||
    miningAudioQueueIndex >= miningData.length
  ) {
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

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

window.resumeMiningAudio = function() {

  if (isMiningAudioPlaying) return;

  const miningData =
    MINING_REFERENCES[window.currentMiningCategory];

  if (!miningData || miningData.length === 0) {
    return;
  }

  if (miningAudioQueueIndex > 0) {
    miningAudioQueueIndex =
      Math.max(0, miningAudioQueueIndex - 1);
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

  if ("speechSynthesis" in window) {
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
    void tile.offsetWidth;
    tile.classList.add("pulse");
}

/**
 * ==========================================================================
 * MASTER LESSON PLATFORM & TRANSLATION ENGINE
 * Core Unified Runtime Application Pipeline Script (Chunk 1 of 3)
 * ==========================================================================
 */

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
    const container =
        document.getElementById("certificates-container");

    if (!container) return;

    container.style.display = "block";

    const studentInputField =
        document.getElementById("student-name");

    const name =
        (typeof appState !== "undefined" &&
         appState.studentName)
        ||
        (studentInputField
            ? studentInputField.value
            : "")
        ||
        "Learner";

    const today =
        new Date().toLocaleDateString();

    const setCertFields = (prefix, isActive) => {

        const nameEl =
            document.getElementById(`cert-${prefix}-name`);

        const dateEl =
            document.getElementById(`cert-${prefix}-date`);

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

    const html2canvasScript =
        document.createElement("script");

    const jsPDFScript =
        document.createElement("script");

    let loaded = 0;

    function checkLoaded() {
        loaded++;

        if (loaded === 2) {
            callback();
        }
    }

    html2canvasScript.onload = checkLoaded;
    jsPDFScript.onload = checkLoaded;

    document.body.appendChild(html2canvasScript);
    document.body.appendChild(jsPDFScript);
}

function downloadCertificate(certId) {

    const element =
        document.getElementById(certId);

    if (!element) {
        alert("Certificate not found.");
        return;
    }

    loadPDFLibraries(() => {

        html2canvas(element, { scale: 2 })
            .then(canvas => {

                const imgData =
                    canvas.toDataURL("image/png");

                const { jsPDF } =
                    window.jspdf || jspdf;

                const pdf =
                    new jsPDF("p", "mm", "a4");

                const pageWidth =
                    pdf.internal.pageSize.getWidth();

                const imgWidth =
                    pageWidth - 20;

                const imgHeight =
                    (canvas.height * imgWidth) /
                    canvas.width;

                pdf.addImage(
                    imgData,
                    "PNG",
                    10,
                    10,
                    imgWidth,
                    imgHeight
                );

                pdf.save(certId + ".pdf");

            })
            .catch(err => {

                console.error(
                    "PDF engine blueprint generation error:",
                    err
                );

                alert(
                    "Error downloading certificate. Please check connection and try again."
                );
            });
    });
}

/* ============================================================
   GLOBAL TEXT NORMALIZATION LAYER
   ============================================================ */

function normalizeDutch(str) {
    if (!str) return '';

    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/-/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function normalizeEnglish(str) {
    if (!str) return '';

    return str
        .toLowerCase()
        .replace(/[-_.,?!]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function cleanStringForKeyboard(str) {
    if (!str) return '';

    return str
        .toLowerCase()
        .replace(/[^a-z0-9äëïöüáéíóúàèìòùâêîôû]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function extractDutchText(obj) {
    if (!obj) return "";

    if (typeof obj === "string") return obj;
    if (obj.nl) return obj.nl;
    if (obj.dutch) return obj.dutch;

    return Object.values(obj)[0] || "";
}

/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY SEARCH ENGINE (BIDIRECTIONAL)
   ============================================================ */

function globalLookup(word) {

    const queryCleanEng = normalizeEnglish(word);
    const queryCleanNl = normalizeDutch(word);

    if (!queryCleanEng && !queryCleanNl) return null;

    const levelsList = ["A1", "A2", "B1", "B2"];

    // 1. CEFR Vocabulary (A1–B2) — CEFR_LEVELS
    for (const level of levelsList) {

        if (typeof CEFR_LEVELS === "undefined" || !CEFR_LEVELS) continue;

        const vocab = CEFR_LEVELS[level];

        if (!vocab) continue;

        const match = vocab.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.dutch && normalizeDutch(item.dutch) === queryCleanNl)
        );

        if (match) {

            const isDutchInput =
                match.dutch &&
                normalizeDutch(match.dutch) === queryCleanNl;

            return {
                translation: isDutchInput ? match.english : match.dutch,
                label: isDutchInput ? "English" : "Dutch",
                speakText: match.dutch,
                source: "CEFR Vocabulary",
                level
            };
        }
    }

    // 2. CEFR Sentences — CEFR_SENTENCES
    for (const level of levelsList) {

        if (typeof CEFR_SENTENCES === "undefined" || !CEFR_SENTENCES) continue;

        const bank = CEFR_SENTENCES[level];

        if (!bank) continue;

        const match = bank.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.dutch && normalizeDutch(item.dutch) === queryCleanNl)
        );

        if (match) {

            const isDutchInput =
                match.dutch &&
                normalizeDutch(match.dutch) === queryCleanNl;

            return {
                translation: isDutchInput ? match.english : match.dutch,
                label: isDutchInput ? "English" : "Dutch",
                speakText: match.dutch,
                source: "CEFR Sentences",
                level
            };
        }
    }

    // 3. CEFR Sentence Choices — CEFR_SENTENCE_CHOICES
    for (const level of levelsList) {

        if (
            typeof CEFR_SENTENCE_CHOICES === "undefined" ||
            !CEFR_SENTENCE_CHOICES
        ) continue;

        const bank = CEFR_SENTENCE_CHOICES[level];

        if (!bank) continue;

        const match = bank.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (
                item.correct &&
                item.correct.nl &&
                normalizeDutch(item.correct.nl) === queryCleanNl
            )
        );

        if (match) {

            const isDutchInput =
                match.correct &&
                match.correct.nl &&
                normalizeDutch(match.correct.nl) === queryCleanNl;

            return {
                translation: isDutchInput
                    ? match.english
                    : match.correct.nl,

                label: isDutchInput
                    ? "English"
                    : "Dutch",

                speakText: match.correct.nl,
                source: "Dialogue Choices",
                level
            };
        }
    }

    // 4. CEFR Phrases — CEFR_PHRASES (OBJECT MODEL)
    if (
        typeof CEFR_PHRASES !== "undefined" &&
        CEFR_PHRASES !== null &&
        !Array.isArray(CEFR_PHRASES)
    ) {

        const matchingKey = Object.keys(CEFR_PHRASES).find(dutchKey => {

            const englishValue =
                CEFR_PHRASES[dutchKey];

            return (
                (englishValue &&
                 normalizeEnglish(englishValue) === queryCleanEng)
                ||
                (normalizeDutch(dutchKey) === queryCleanNl)
            );
        });

        if (matchingKey) {

            const englishValue =
                CEFR_PHRASES[matchingKey];

            const isDutchInput =
                normalizeDutch(matchingKey) === queryCleanNl;

            return {
                translation:
                    isDutchInput
                        ? englishValue
                        : matchingKey,

                label:
                    isDutchInput
                        ? "English"
                        : "Dutch",

                speakText:
                    matchingKey,

                source:
                    "CEFR Phrases",

                level:
                    "A1"
            };
        }
    }

    // 5. Listen Vocab — LISTEN_VOCAB
    if (
        typeof LISTEN_VOCAB !== "undefined" &&
        LISTEN_VOCAB !== null
    ) {

        for (const lvlKey of Object.keys(LISTEN_VOCAB)) {

            const levelData =
                LISTEN_VOCAB[lvlKey];

            if (!levelData) continue;

            for (const catKey of Object.keys(levelData)) {

                const wordArray =
                    levelData[catKey];

                if (!Array.isArray(wordArray)) continue;

                const matchDutch =
                    wordArray.find(
                        dutchWord =>
                            normalizeDutch(dutchWord) === queryCleanNl
                    );

                if (matchDutch) {

                    const primaryRef =
                        (
                            typeof CEFR_LEVELS !== "undefined" &&
                            CEFR_LEVELS[lvlKey]
                        )
                        ? CEFR_LEVELS[lvlKey].find(
                            item =>
                                normalizeDutch(item.dutch) === queryCleanNl
                          )
                        : null;

                    const englishTranslation =
                        primaryRef
                            ? primaryRef.english
                            : "Vocabulary item";

                    return {
                        translation: englishTranslation,
                        label: "English",
                        speakText: matchDutch,
                        source: `Listen Vocab (${catKey})`,
                        level: lvlKey
                    };
                }
            }
        }
    }

    // 6. Word-by-word dictionary — WORD_DICT
    if (typeof WORD_DICT !== "undefined") {

        if (WORD_DICT[queryCleanEng]) {

            return {
                translation: WORD_DICT[queryCleanEng],
                label: "Dutch",
                speakText: WORD_DICT[queryCleanEng],
                source: "Word Dictionary",
                level: "GLOBAL"
            };
        }

        const reverseKeyMatch =
            Object.keys(WORD_DICT).find(
                k =>
                    normalizeDutch(
                        WORD_DICT[k]
                    ) === queryCleanNl
            );

        if (reverseKeyMatch) {

            return {
                translation: reverseKeyMatch,
                label: "English",
                speakText: WORD_DICT[reverseKeyMatch],
                source: "Word Dictionary",
                level: "GLOBAL"
            };
        }
    }

    // ⭐ 6.5 MINING TERMINOLOGY SEARCH SUPPORT
    if (
        typeof MINING_REFERENCES !== "undefined" &&
        MINING_REFERENCES !== null
    ) {

        for (const categoryKey of Object.keys(MINING_REFERENCES)) {

            const miningCategory =
                MINING_REFERENCES[categoryKey];

            if (!Array.isArray(miningCategory)) continue;

            const match =
                miningCategory.find(item =>
                    (item.english &&
                     normalizeEnglish(item.english) === queryCleanEng)
                    ||
                    (item.dutch &&
                     normalizeDutch(item.dutch) === queryCleanNl)
                );

            if (match) {

                const isDutchInput =
                    match.dutch &&
                    normalizeDutch(match.dutch) === queryCleanNl;

                return {
                    translation:
                        isDutchInput
                            ? match.english
                            : match.dutch,

                    label:
                        isDutchInput
                            ? "English"
                            : "Dutch",

                    speakText:
                        match.dutch,

                    source:
                        `Mining Terminology (${categoryKey})`,

                    level:
                        "GLOBAL"
                };
            }
        }
    }
    // 7. Conversation Prompts — CEFR_CONVERSATION_PROMPTS
    if (
        typeof CEFR_CONVERSATION_PROMPTS !== "undefined" &&
        CEFR_CONVERSATION_PROMPTS !== null
    ) {

        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {

            const prompts =
                CEFR_CONVERSATION_PROMPTS[levelKey];

            if (!Array.isArray(prompts)) continue;

            const convoMatch = prompts.find(p => {

                const dutchText =
                    typeof p.dutch === "object"
                        ? extractDutchText(p.dutch)
                        : p.dutch;

                return (
                    p.english &&
                    normalizeEnglish(p.english) === queryCleanEng
                ) || (
                    dutchText &&
                    normalizeDutch(dutchText) === queryCleanNl
                );
            });

            if (convoMatch) {

                const targetDutchText =
                    typeof convoMatch.dutch === "object"
                        ? extractDutchText(convoMatch.dutch)
                        : convoMatch.dutch;

                const isDutchInput =
                    targetDutchText &&
                    normalizeDutch(targetDutchText) === queryCleanNl;

                return {
                    translation:
                        isDutchInput
                            ? convoMatch.english
                            : targetDutchText,

                    label:
                        isDutchInput
                            ? "English"
                            : "Dutch",

                    speakText:
                        targetDutchText,

                    source:
                        "Conversation Prompt",

                    level:
                        levelKey
                };
            }
        }
    }

    // 8. Conversation Audio — A1–B2
    const convoAudioBanks = [];

    if (typeof CEFR_CONVERSATION_AUDIO_A1 !== "undefined")
        convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_A1);

    if (typeof CEFR_CONVERSATION_AUDIO_A2 !== "undefined")
        convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_A2);

    if (typeof CEFR_CONVERSATION_AUDIO_B1 !== "undefined")
        convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_B1);

    if (typeof CEFR_CONVERSATION_AUDIO_B2 !== "undefined")
        convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_B2);

    for (const bank of convoAudioBanks) {

        if (!bank || !Array.isArray(bank)) continue;

        const audioMatch = bank.find(a =>
            (a.english &&
             normalizeEnglish(a.english) === queryCleanEng)
            ||
            (a.nl &&
             normalizeDutch(a.nl) === queryCleanNl)
        );

        if (audioMatch) {

            const isDutchInput =
                audioMatch.nl &&
                normalizeDutch(audioMatch.nl) === queryCleanNl;

            return {

                translation:
                    isDutchInput
                        ? audioMatch.english
                        : audioMatch.nl,

                label:
                    isDutchInput
                        ? "English"
                        : "Dutch",

                speakText:
                    audioMatch.nl,

                source:
                    "Conversation Audio",

                level:
                    audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}

/* ============================================================
   DYNAMIC EVERYDAY PHRASE TEMPLATE BLUEPRINTS (SUB-PARSER)
   ============================================================ */
const EVERYDAY_PHRASE_TEMPLATES = [

    {
        // Matches: "I would like to order ..."
        pattern: /^i would like to order (.+)$/i,

        translate: (targetWord) => {

            const parsedTarget =
                parseSubPhrase(targetWord);

            return {
                translation: `Ik wil graag ${parsedTarget} bestellen`,
                label: "Dutch",
                speakText: `Ik wil graag ${parsedTarget} bestellen`,
                source: "Dynamic Order Template"
            };
        }
    },

    {
        // Matches: "I want to buy ..."
        pattern: /^i want to buy (.+)$/i,

        translate: (targetWord) => {

            const parsedTarget =
                parseSubPhrase(targetWord);

            return {
                translation: `Ik wil ${parsedTarget} kopen`,
                label: "Dutch",
                speakText: `Ik wil ${parsedTarget} kopen`,
                source: "Dynamic Purchase Template"
            };
        }
    },

    {
        // Matches: "Can I buy ..."
        pattern: /^can i buy (.+)$/i,

        translate: (targetWord) => {

            const parsedTarget =
                parseSubPhrase(targetWord);

            return {
                translation: `Kan ik ${parsedTarget} kopen?`,
                label: "Dutch",
                speakText: `Kan ik ${parsedTarget} kopen`,
                source: "Dynamic Transaction Template"
            };
        }
    },

    {
        // Matches: "Can I order ..."
        pattern: /^can i order (.+)$/i,

        translate: (targetWord) => {

            const parsedTarget =
                parseSubPhrase(targetWord);

            return {
                translation: `Kan ik ${parsedTarget} bestellen?`,
                label: "Dutch",
                speakText: `Kan ik ${parsedTarget} bestellen`,
                source: "Dynamic Transaction Template"
            };
        }
    },

    {
        // Matches: "Where can I find ..."
        pattern: /^where can i find (.+)$/i,

        translate: (targetWord) => {

            const parsedTarget =
                parseSubPhrase(targetWord);

            return {
                translation: `Waar kan ik ${parsedTarget} vinden?`,
                label: "Dutch",
                speakText: `Waar kan ik ${parsedTarget} vinden`,
                source: "Dynamic Location Template"
            };
        }
    },

    {
        // Matches: "Is the ... far"
        pattern: /^is the (.+) far$/i,

        translate: (targetWord) => {

            const parsedTarget =
                parseSubPhrase(targetWord);

            return {
                translation: `Is ${parsedTarget} ver weg?`,
                label: "Dutch",
                speakText: `Is ${parsedTarget} ver weg`,
                source: "Dynamic Distance Template"
            };
        }
    }
];


/**
 * Helper Sub-Parser Function:
 * Breaks down compound inputs and translates them word by word.
 */
function parseSubPhrase(phraseText) {

    if (!phraseText) return "";

    const cleanText =
        phraseText.trim().toLowerCase();

    const bits =
        cleanText
            .split(/\s+/)
            .filter(b => b.length > 0);

    const translatedBits = [];

    bits.forEach(bit => {

        const look =
            globalLookup(bit);

        if (look) {

            const cleanTrans =
                (look.translation || look.dutch || "")
                    .split("/");

            translatedBits.push(
                cleanTrans[0].trim()
            );

        } else if (
            typeof WORD_DICT !== "undefined" &&
            WORD_DICT[bit]
        ) {

            const dictTrans =
                WORD_DICT[bit].split("/");

            translatedBits.push(
                dictTrans[0].trim()
            );

        } else {

            translatedBits.push(
                `[${bit}]`
            );
        }
    });

    return translatedBits.join(" ");
}

/* ============================================================
   DICTIONARY SEARCH INITIALIZER SYSTEM
   ============================================================ */

function initDictionarySearch() {

    const searchInput =
        document.getElementById("dict-search-input");

    const resultBox =
        document.getElementById("dict-search-result");

    if (!searchInput || !resultBox) return;

    let clearBtn =
        document.getElementById("dict-clear-btn");

    if (!clearBtn) {

        clearBtn =
            document.createElement("button");

        clearBtn.id = "dict-clear-btn";
        clearBtn.className = "pill";
        clearBtn.innerText = "✕ Clear";

        clearBtn.style.cssText =
            "padding: 6px 12px; font-size: 11px; margin-left: 8px; cursor: pointer; display: none; background: rgba(248,113,113,0.15); border: 1px solid rgba(248,113,113,0.3); color: #f87171;";

        searchInput.parentNode.insertBefore(
            clearBtn,
            searchInput.nextSibling
        );

        clearBtn.addEventListener("click", () => {

            searchInput.value = "";
            resultBox.innerHTML = "";
            clearBtn.style.display = "none";
            searchInput.focus();

        });
    }

    searchInput.addEventListener("input", () => {

        const rawValue =
            searchInput.value;

        const normalizedQuery =
            normalizeEnglish(rawValue);

        if (!rawValue.trim()) {

            resultBox.innerHTML = "";
            clearBtn.style.display = "none";
            return;
        }

        clearBtn.style.display = "inline-block";

        // Template Matching
        for (const template of EVERYDAY_PHRASE_TEMPLATES) {

            const matchArray =
                normalizedQuery.match(
                    template.pattern
                );

            if (
                matchArray &&
                matchArray.length > 1
            ) {

                const capturedWordGroup =
                    matchArray[1];

                const dynamicResult =
                    template.translate(
                        capturedWordGroup
                    );

                renderPhraseBox(dynamicResult);
                return;
            }
        }

        // Dictionary lookup
        const phraseResult =
            globalLookup(rawValue);

        if (phraseResult) {

            renderPhraseBox(phraseResult);
            return;
        }

        // Word-by-word fallback
        const words =
            normalizedQuery
                .split(/\s+/)
                .filter(
                    w => w.length > 0
                );

        if (words.length > 1) {

            const translatedSegments = [];
            const unknownWords = [];

            let i = 0;

            while (i < words.length) {

                let matched = false;

                for (
                    let len = Math.min(4, words.length - i);
                    len >= 2;
                    len--
                ) {

                    const chunk =
                        words
                            .slice(i, i + len)
                            .join(" ");

                    const chunkResult =
                        globalLookup(chunk);

                    if (chunkResult) {

                        translatedSegments.push(
                            chunkResult.translation ||
                            chunkResult.dutch
                        );

                        i += len;
                        matched = true;
                        break;
                    }
                }

                if (!matched) {

                    const word = words[i];

                    // English → Dutch helpers

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

                    const wordResult =
                        globalLookup(word);

                    if (wordResult) {

                        translatedSegments.push(
                            wordResult.translation ||
                            wordResult.dutch
                        );

                    } else {

                        unknownWords.push(word);

                        translatedSegments.push(
                            `[${word}]`
                        );
                    }

                    i++;
                }
            }

            const dutchSentence =
                translatedSegments.join(" ");

            renderPhraseBox({

                translation:
                    dutchSentence,

                label:
                    "Dutch",

                speakText:
                    dutchSentence.replace(
                        /[\[\]]/g,
                        ""
                    ),

                source:
                    "Sentence Split Fallback Mode",

                level:
                    unknownWords.length === 0
                        ? "ALL FOUND"
                        : "MISSING: " +
                          unknownWords.join(", ")
            });

            return;
        }

        resultBox.innerHTML = `
            <div style="
                color:#f87171;
                font-style:italic;
                font-size:13px;
                margin-top:8px;
            ">
                Term or conversational pattern not found in database.
            </div>
        `;
    });


    function renderPhraseBox(res) {

        const outputText =
            res.translation || res.dutch;

        const outputLabel =
            res.label || "Dutch";

        const speechTarget =
            res.speakText || res.dutch;

        const cleanSpeechText =
            speechTarget.replace(/'/g, "\\'");

        resultBox.innerHTML = `
            <div style="
                padding:10px;
                background:rgba(74,222,128,0.1);
                border:1px solid rgba(74,222,128,0.3);
                border-radius:10px;
                margin-top:5px;
                display:flex;
                flex-direction:column;
                gap:4px;
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    flex-wrap:wrap;
                ">

                    <span style="
                        color:#a5f3fc;
                        font-weight:bold;
                    ">
                        ${outputLabel}:
                    </span>

                    <span style="
                        color:#4ade80;
                        font-size:1.1rem;
                        font-weight:600;
                        text-shadow:0 0 6px rgba(74,222,128,0.45);
                    ">
                        ${outputText}
                    </span>

                    <button
                        id="dict-speak-btn"
                        class="pill"
                        style="
                            padding:4px 10px;
                            font-size:11px;
                            max-width:50px;
                            cursor:pointer;
                        "
                    >
                        🔊
                    </button>

                </div>

                <div style="
                    font-size:11px;
                    color:rgba(255,255,255,0.4);
                    margin-top:2px;
                ">
                    Matched via ${res.source}
                    (${res.level || "GLOBAL"})
                </div>

            </div>
        `;

        const speakBtn =
            document.getElementById(
                "dict-speak-btn"
            );

        if (speakBtn) {

            speakBtn.onclick = () => {

                window.speechSynthesis.cancel();

                const utterance =
                    new SpeechSynthesisUtterance(
                        cleanSpeechText
                    );

                utterance.lang = "nl-NL";

                const speedSlider =
                    document.getElementById("rate");

                if (speedSlider) {
                    utterance.rate =
                        parseFloat(
                            speedSlider.value
                        );
                }

                window.speechSynthesis.speak(
                    utterance
                );
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

    if (typeof initFreePracticeSandbox === "function") {
        initFreePracticeSandbox();
    }

    const resetBtn =
        document.getElementById(
            "resetAllLevelsBtn"
        );

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            () => {

                const confirmReset = confirm(
                    "Weet je zeker dat je alle gegevens wilt verwijderen? Scores, XP, streaks en de reviewlijst worden permanent gewist."
                );

                if (confirmReset) {

                    if (
                        typeof resetAllProgress ===
                        "function"
                    ) {

                        resetAllProgress();

                    } else {

                        localStorage.clear();
                        location.reload();
                    }
                }
            }
        );
    }

    if (typeof updateBadges === "function") {
        updateBadges();
    }

    if (
        typeof updateProgressMeters ===
        "function"
    ) {
        updateProgressMeters();
    }
});


/* ============================================================
   MISTAKEN AREAS — REVIEW SYSTEM ENGINE
   ============================================================ */

window.reviewList = [];

try {

    const savedReview =
        localStorage.getItem("reviewList");

    if (savedReview) {
        window.reviewList =
            JSON.parse(savedReview);
    }

} catch (e) {

    console.error(
        "Error reading saved mistake logs:",
        e
    );

    window.reviewList = [];
}


function findAudioForDutch(dutchText) {

    if (!dutchText) return null;

    const clean =
        cleanStringForKeyboard(
            dutchText.toLowerCase()
        );

    const banks = [];

    if (
        typeof CEFR_CONVERSATION_AUDIO_A1 !==
            "undefined" &&
        Array.isArray(
            CEFR_CONVERSATION_AUDIO_A1
        )
    ) {
        banks.push(
            ...CEFR_CONVERSATION_AUDIO_A1
        );
    }

    if (
        typeof CEFR_CONVERSATION_AUDIO_A2 !==
            "undefined" &&
        Array.isArray(
            CEFR_CONVERSATION_AUDIO_A2
        )
    ) {
        banks.push(
            ...CEFR_CONVERSATION_AUDIO_A2
        );
    }

    if (
        typeof CEFR_CONVERSATION_AUDIO_B1 !==
            "undefined" &&
        Array.isArray(
            CEFR_CONVERSATION_AUDIO_B1
        )
    ) {
        banks.push(
            ...CEFR_CONVERSATION_AUDIO_B1
        );
    }

    if (
        typeof CEFR_CONVERSATION_AUDIO_B2 !==
            "undefined" &&
        Array.isArray(
            CEFR_CONVERSATION_AUDIO_B2
        )
    ) {
        banks.push(
            ...CEFR_CONVERSATION_AUDIO_B2
        );
    }

    for (const item of banks) {

        if (
            !item ||
            !item.nl ||
            !item.audio
        ) {
            continue;
        }

        if (
            cleanStringForKeyboard(
                item.nl.toLowerCase()
            ) === clean
        ) {
            return item.audio;
        }
    }

    return null;
}


function playReviewAudio(dutchText) {

    const audioFile =
        findAudioForDutch(dutchText);

    if (!audioFile) {

        if (
            typeof speakDutch ===
            "function"
        ) {
            speakDutch(dutchText);
        }

        return;
    }

    try {

        const audio =
            new Audio(`audio/${audioFile}`);

        audio.play().catch(e =>
            console.warn(
                "Native file play stalled. Audio folder missing assets.",
                e
            )
        );

    } catch (e) {

        console.error(
            "Audio engine failed to load instance:",
            e
        );
    }
}


function addIncorrectWord(word) {

    if (!word) return;

    if (!window.reviewList.includes(word)) {

        window.reviewList.push(word);

        localStorage.setItem(
            "reviewList",
            JSON.stringify(
                window.reviewList
            )
        );

        renderReviewList();

        if (
            typeof updateProgressMeters ===
            "function"
        ) {
            updateProgressMeters();
        }
    }
}


function clearWordFromReview(word) {

    window.reviewList =
        window.reviewList.filter(
            item => item !== word
        );

    localStorage.setItem(
        "reviewList",
        JSON.stringify(
            window.reviewList
        )
    );

    renderReviewList();

    if (
        typeof updateProgressMeters ===
        "function"
    ) {
        updateProgressMeters();
    }
}


function renderReviewList() {

    const listContainer =
        document.getElementById(
            "review-words-list"
        );

    if (!listContainer) return;

    listContainer.innerHTML = "";

    if (
        window.reviewList.length === 0
    ) {

        listContainer.innerHTML = `
            <p class="review-empty-msg">
                🎉 Goed gedaan! Geen woorden om te herhalen.
            </p>
        `;

        return;
    }

    window.reviewList.forEach(word => {

        const card =
            document.createElement("div");

        card.className = "review-card";

        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.margin = "10px 0";

        let dutchText = word;

        if (word.includes("➔")) {

            const parts =
                word.split("➔");

            dutchText =
                (parts && parts[1])
                    ? parts[1].trim()
                    : word.trim();

        } else if (
            word.includes("→")
        ) {

            const parts =
                word.split("→");

            dutchText =
                (parts && parts[1])
                    ? parts[1].trim()
                    : word.trim();
        }

        card.innerHTML = `
            <span class="review-word-text">
                ${word}
            </span>

            <div
                class="review-card-actions"
                style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                    margin-left:auto;
                "
            >

                <button
                    class="pill review-play-btn"
                    style="
                        min-width:45px;
                        padding:10px 14px;
                    "
                >
                    🔊 Afspelen
                </button>

                <button
                    class="pill got-it-btn"
                >
                    Begrepen!
                </button>

            </div>
        `;

        card
            .querySelector(
                ".review-play-btn"
            )
            .addEventListener(
                "click",
                () => {
                    playReviewAudio(
                        dutchText
                    );
                }
            );

        card
            .querySelector(
                ".got-it-btn"
            )
            .addEventListener(
                "click",
                () => {
                    clearWordFromReview(
                        word
                    );
                }
            );

        listContainer.appendChild(
            card
        );
    });
}


/* ============================================================
   GLOBAL FREE PRACTICE SANDBOX (UNSCORED)
   ============================================================ */

let currentPracticeWord = null;

function initFreePracticeSandbox() {

    const checkBtn =
        document.getElementById(
            "practice-check-btn"
        );

    const nextBtn =
        document.getElementById(
            "practice-next-btn"
        );

    const inputField =
        document.getElementById(
            "practice-user-input"
        );

    if (
        !checkBtn ||
        !nextBtn ||
        !inputField
    ) {
        return;
    }

    getNewPracticeWord();

    checkBtn.addEventListener(
        "click",
        evaluatePracticeAnswer
    );

    inputField.addEventListener(
        "keypress",
        e => {

            if (e.key === "Enter") {
                evaluatePracticeAnswer();
            }
        }
    );

    nextBtn.addEventListener(
        "click",
        () => {
            getNewPracticeWord();
        }
    );
}


function getNewPracticeWord() {

    const inputField =
        document.getElementById(
            "practice-user-input"
        );

    const feedbackBox =
        document.getElementById(
            "practice-feedback"
        );

    const wordPlaceholder =
        document.getElementById(
            "practice-english-word"
        );

    if (
        !wordPlaceholder ||
        !inputField ||
        !feedbackBox
    ) {
        return;
    }

    inputField.value = "";
    feedbackBox.innerHTML = "";

    let masterPool = null;

    if (
        typeof CEFR_LEVELS !==
            "undefined" &&
        CEFR_LEVELS !== null
    ) {

        masterPool = CEFR_LEVELS;

    } else if (
        typeof vocabularyData !==
            "undefined" &&
        vocabularyData !== null
    ) {

        masterPool = vocabularyData;

    } else if (
        typeof dictData !==
            "undefined" &&
        dictData !== null
    ) {

        masterPool = dictData;
    }

    if (!masterPool) {

        wordPlaceholder.textContent =
            "Fout: Woordenlijst niet gevonden.";

        return;
    }

    const levels =
        Object.keys(masterPool).filter(
            lvl =>
                Array.isArray(
                    masterPool[lvl]
                ) &&
                masterPool[lvl].length > 0
        );

    if (levels.length === 0) {

        wordPlaceholder.textContent =
            "Fout: Niveaugegevens zijn leeg.";

        return;
    }

    const randomLevel =
        levels[
            Math.floor(
                Math.random() *
                levels.length
            )
        ];

    const wordPool =
        masterPool[randomLevel];

    currentPracticeWord =
        wordPool[
            Math.floor(
                Math.random() *
                wordPool.length
            )
        ];

    wordPlaceholder.textContent =
        `${currentPracticeWord.english} (${randomLevel})`;
}
function evaluatePracticeAnswer() {

    const inputField =
        document.getElementById(
            "practice-user-input"
        );

    const feedbackBox =
        document.getElementById(
            "practice-feedback"
        );

    if (
        !inputField ||
        !feedbackBox ||
        !currentPracticeWord
    ) {
        return;
    }

    const userTyped =
        inputField.value.trim();

    if (!userTyped) {

        feedbackBox.innerHTML = `
            <span style="color:#f87171;">
                Typ eerst een antwoord!
            </span>
        `;

        return;
    }

    const cleanUser =
        normalizeDutch(userTyped);

    const cleanCorrect =
        normalizeDutch(
            currentPracticeWord.dutch
        );

    if (cleanUser === cleanCorrect) {

        const cleanSpeechText =
            currentPracticeWord.dutch.replace(
                /'/g,
                "\\'"
            );

        feedbackBox.innerHTML = `
            <div style="
                color:#4ade80;
                font-weight:600;
                padding:6px;
                background:rgba(74,222,128,0.1);
                border-radius:8px;
                display:flex;
                align-items:center;
                gap:6px;
                flex-wrap:wrap;
            ">
                <span>
                    Correct! 🎉 (${currentPracticeWord.dutch})
                </span>

                <button
                    id="practice-speak-btn"
                    class="pill"
                    style="
                        padding:2px 8px;
                        font-size:10px;
                        max-width:40px;
                        cursor:pointer;
                    "
                >
                    🔊
                </button>
            </div>
        `;

        const speakBtn =
            document.getElementById(
                "practice-speak-btn"
            );

        if (speakBtn) {

            speakBtn.onclick = () => {

                window.speechSynthesis.cancel();

                const utterance =
                    new SpeechSynthesisUtterance(
                        cleanSpeechText
                    );

                utterance.lang = "nl-NL";

                const speedSlider =
                    document.getElementById("rate");

                if (speedSlider) {
                    utterance.rate =
                        parseFloat(
                            speedSlider.value
                        );
                }

                window.speechSynthesis.speak(
                    utterance
                );
            };
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                currentPracticeWord.dutch
            );

        utterance.lang = "nl-NL";

        const speedSlider =
            document.getElementById("rate");

        if (speedSlider) {
            utterance.rate =
                parseFloat(
                    speedSlider.value
                );
        }

        window.speechSynthesis.speak(
            utterance
        );

    } else {

        feedbackBox.innerHTML = `
            <div style="
                color:#f87171;
                font-weight:500;
                padding:6px;
                background:rgba(248,113,113,0.1);
                border-radius:8px;
            ">
                Nog niet goed!
                "<strong>${currentPracticeWord.english}</strong>"
                vertaalt naar
                "<strong>${currentPracticeWord.dutch}</strong>".
                Probeer opnieuw of klik op Overslaan.
            </div>
        `;
    }
}


/* ============================================================
   UNIFIED SECURE LIFECYCLE DEPLOYMENT HOOK
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

    if (
        typeof autoExpandDictionary ===
        "function"
    ) {

        console.log(
            "🔄 Stap 1: Woordenlijst laden..."
        );

        autoExpandDictionary();
    }

    if (
        typeof renderScoreDashboardUI ===
        "function"
    ) {
        renderScoreDashboardUI();
    }

    if (
        typeof enforceMobileNavigationLocks ===
        "function"
    ) {
        enforceMobileNavigationLocks();
    }

    setTimeout(() => {

        console.log(
            "🎯 Stap 2: Oefenomgeving initialiseren..."
        );

        if (
            typeof initFreePracticeSandbox ===
            "function"
        ) {

            initFreePracticeSandbox();

        } else {

            console.error(
                "❌ Fout: initFreePracticeSandbox ontbreekt."
            );
        }

    }, 150);
});
