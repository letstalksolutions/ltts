/**
 * British English text replacements for the Let's Talk Tax Solutions website
 * This file contains functions to update American English terms to British English
 */

document.addEventListener('DOMContentLoaded', function() {
    // Apply British English replacements to all text content
    applyBritishEnglish();
});

/**
 * Apply British English replacements to all text content
 */
function applyBritishEnglish() {
    // Get all text nodes in the document
    const textNodes = getTextNodes(document.body);
    
    // Apply replacements to each text node
    textNodes.forEach(node => {
        let content = node.nodeValue;
        
        // Apply all replacements
        content = applySpellingReplacements(content);
        
        // Update node if content has changed
        if (content !== node.nodeValue) {
            node.nodeValue = content;
        }
    });
    
    // Also update attributes like placeholder, title, etc.
    updateAttributes();
}

/**
 * Get all text nodes in an element
 */
function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        // Skip empty text nodes or nodes in script/style elements
        if (node.nodeValue.trim() !== '' && 
            !['SCRIPT', 'STYLE'].includes(node.parentNode.tagName)) {
            textNodes.push(node);
        }
    }
    
    return textNodes;
}

/**
 * Apply British English spelling replacements
 */
function applySpellingReplacements(text) {
    // Common American to British English spelling replacements
    const replacements = [
        // -ize to -ise
        [/(\w+)ize(\W|$)/g, '$1ise$2'],
        [/(\w+)izing(\W|$)/g, '$1ising$2'],
        [/(\w+)ization(\W|$)/g, '$1isation$2'],
        
        // -yze to -yse
        [/(\w+)yze(\W|$)/g, '$1yse$2'],
        [/(\w+)yzing(\W|$)/g, '$1ysing$2'],
        
        // -or to -our
        [/(\w+)or(\W|$)/g, function(match, p1, p2) {
            // Only replace specific words, not all -or endings
            const wordsToReplace = [
                'behavior', 'color', 'favor', 'flavor', 'harbor', 'honor', 
                'humor', 'labor', 'neighbor', 'rumor', 'valor'
            ];
            if (wordsToReplace.includes(p1.toLowerCase())) {
                return p1 + 'our' + p2;
            }
            return match;
        }],
        
        // -er to -re
        [/center(\W|$)/g, 'centre$1'],
        [/fiber(\W|$)/g, 'fibre$1'],
        [/liter(\W|$)/g, 'litre$1'],
        [/meter(\W|$)/g, 'metre$1'],
        [/theater(\W|$)/g, 'theatre$1'],
        
        // -se to -ce
        [/defense(\W|$)/g, 'defence$1'],
        [/license(\W|$)/g, 'licence$1'],
        [/offense(\W|$)/g, 'offence$1'],
        [/pretense(\W|$)/g, 'pretence$1'],
        
        // -g to -gue
        [/analog(\W|$)/g, 'analogue$1'],
        [/catalog(\W|$)/g, 'catalogue$1'],
        [/dialog(\W|$)/g, 'dialogue$1'],
        
        // -m to -mme
        [/program(\W|$)/g, function(match, p1) {
            // Exception for programming/programmer
            if (p1.startsWith('m')) {
                return match;
            }
            return 'programme' + p1;
        }],
        
        // Specific word replacements
        [/aluminum(\W|$)/g, 'aluminium$1'],
        [/check(\W|$)/g, function(match, p1) {
            // Only replace when it means "cheque" (financial context)
            if (isFinancialContext(match)) {
                return 'cheque' + p1;
            }
            return match;
        }],
        [/gray(\W|$)/g, 'grey$1'],
        [/math(\W|$)/g, 'maths$1'],
        [/specialty(\W|$)/g, 'speciality$1'],
        [/mom(\W|$)/g, 'mum$1'],
        [/apartment(\W|$)/g, 'flat$1'],
        [/vacation(\W|$)/g, 'holiday$1'],
        [/fall(\W|$)/g, function(match, p1) {
            // Only replace when it means "autumn"
            if (isSeasonContext(match)) {
                return 'autumn' + p1;
            }
            return match;
        }],
        [/gas(\W|$)/g, function(match, p1) {
            // Only replace when it means "petrol"
            if (isFuelContext(match)) {
                return 'petrol' + p1;
            }
            return match;
        }],
        [/sidewalk(\W|$)/g, 'pavement$1'],
        [/truck(\W|$)/g, 'lorry$1'],
        [/elevator(\W|$)/g, 'lift$1'],
        [/cookie(\W|$)/g, 'biscuit$1'],
        [/french fries(\W|$)/gi, 'chips$1'],
        [/chips(\W|$)/g, function(match, p1) {
            // Only replace when it means "crisps"
            if (isSnackContext(match)) {
                return 'crisps' + p1;
            }
            return match;
        }],
        [/soccer(\W|$)/g, 'football$1'],
        [/football(\W|$)/g, function(match, p1) {
            // Only replace when it means "American football"
            if (isAmericanSportsContext(match)) {
                return 'American football' + p1;
            }
            return match;
        }],
        [/zip code(\W|$)/gi, 'postcode$1'],
        [/period(\W|$)/g, function(match, p1) {
            // Only replace when it means "full stop"
            if (isPunctuationContext(match)) {
                return 'full stop' + p1;
            }
            return match;
        }],
        
        // Tax-specific terms
        [/401\(k\)(\W|$)/g, 'pension$1'],
        [/IRA(\W|$)/g, 'ISA$1'],
        [/W-2(\W|$)/g, 'P60$1'],
        [/W-4(\W|$)/g, 'P45$1'],
        [/IRS(\W|$)/g, 'HMRC$1'],
        [/Internal Revenue Service(\W|$)/gi, 'HM Revenue & Customs$1'],
        [/Social Security(\W|$)/g, 'National Insurance$1'],
        [/Medicare(\W|$)/g, 'NHS$1'],
        [/sales tax(\W|$)/gi, 'VAT$1'],
        [/tax return(\W|$)/gi, 'tax return$1'], // Same in both
        [/tax deduction(\W|$)/gi, 'tax relief$1'],
        [/tax credit(\W|$)/gi, 'tax credit$1'], // Same in both
        [/tax bracket(\W|$)/gi, 'tax band$1'],
        [/tax exemption(\W|$)/gi, 'tax exemption$1'], // Same in both
        [/tax liability(\W|$)/gi, 'tax liability$1'], // Same in both
        [/tax year(\W|$)/gi, 'tax year$1'], // Same in both
        [/fiscal year(\W|$)/gi, 'financial year$1'],
        [/itemized deduction(\W|$)/gi, 'itemised deduction$1'],
        [/standard deduction(\W|$)/gi, 'personal allowance$1'],
        [/capital gains tax(\W|$)/gi, 'capital gains tax$1'], // Same in both
        [/estate tax(\W|$)/gi, 'inheritance tax$1'],
        [/gift tax(\W|$)/gi, 'inheritance tax$1'],
        [/property tax(\W|$)/gi, 'council tax$1'],
        [/tax withholding(\W|$)/gi, 'PAYE$1'],
        [/withholding tax(\W|$)/gi, 'PAYE$1'],
        [/pay-as-you-earn(\W|$)/gi, 'PAYE$1'],
        [/PAYE(\W|$)/g, 'PAYE$1'], // Same in both
        [/LLC(\W|$)/g, 'Ltd$1'],
        [/limited liability company(\W|$)/gi, 'limited company$1'],
        [/S corporation(\W|$)/gi, 'limited company$1'],
        [/C corporation(\W|$)/gi, 'limited company$1'],
        [/corporation(\W|$)/g, 'limited company$1'],
        [/sole proprietorship(\W|$)/gi, 'sole trader$1'],
        [/partnership(\W|$)/g, 'partnership$1'], // Same in both
        [/employer identification number(\W|$)/gi, 'company registration number$1'],
        [/EIN(\W|$)/g, 'CRN$1'],
        [/SSN(\W|$)/g, 'NI number$1'],
        [/social security number(\W|$)/gi, 'national insurance number$1'],
        [/tax advisor(\W|$)/gi, 'tax adviser$1'],
        [/certified public accountant(\W|$)/gi, 'chartered accountant$1'],
        [/CPA(\W|$)/g, 'CA$1'],
        [/enrolled agent(\W|$)/gi, 'tax agent$1'],
        [/tax attorney(\W|$)/gi, 'tax solicitor$1'],
        [/attorney(\W|$)/g, 'solicitor$1'],
        [/lawyer(\W|$)/g, 'solicitor$1'],
        [/tax court(\W|$)/gi, 'tax tribunal$1'],
        [/tax audit(\W|$)/gi, 'tax investigation$1'],
        [/audit(\W|$)/g, 'investigation$1'],
        [/tax evasion(\W|$)/gi, 'tax evasion$1'], // Same in both
        [/tax avoidance(\W|$)/gi, 'tax avoidance$1'], // Same in both
        [/tax planning(\W|$)/gi, 'tax planning$1'], // Same in both
        [/tax shelter(\W|$)/gi, 'tax shelter$1'], // Same in both
        [/tax haven(\W|$)/gi, 'tax haven$1'], // Same in both
        [/tax loophole(\W|$)/gi, 'tax loophole$1'], // Same in both
        [/tax code(\W|$)/gi, 'tax code$1'], // Same in both
        [/tax law(\W|$)/gi, 'tax law$1'], // Same in both
        [/tax legislation(\W|$)/gi, 'tax legislation$1'], // Same in both
        [/tax regulation(\W|$)/gi, 'tax regulation$1'], // Same in both
        [/tax policy(\W|$)/gi, 'tax policy$1'], // Same in both
        [/tax reform(\W|$)/gi, 'tax reform$1'], // Same in both
        [/tax cut(\W|$)/gi, 'tax cut$1'], // Same in both
        [/tax increase(\W|$)/gi, 'tax increase$1'], // Same in both
        [/tax rate(\W|$)/gi, 'tax rate$1'], // Same in both
        [/tax base(\W|$)/gi, 'tax base$1'], // Same in both
        [/tax burden(\W|$)/gi, 'tax burden$1'], // Same in both
        [/tax incentive(\W|$)/gi, 'tax incentive$1'], // Same in both
        [/tax break(\W|$)/gi, 'tax break$1'], // Same in both
        [/tax benefit(\W|$)/gi, 'tax benefit$1'], // Same in both
        [/tax relief(\W|$)/gi, 'tax relief$1'], // Same in both
        [/tax credit(\W|$)/gi, 'tax credit$1'], // Same in both
        [/tax deduction(\W|$)/gi, 'tax relief$1'],
        [/tax write-off(\W|$)/gi, 'tax write-off$1'], // Same in both
        [/tax expense(\W|$)/gi, 'tax expense$1'], // Same in both
        [/tax liability(\W|$)/gi, 'tax liability$1'], // Same in both
        [/tax payment(\W|$)/gi, 'tax payment$1'], // Same in both
        [/tax refund(\W|$)/gi, 'tax refund$1'], // Same in both
        [/tax rebate(\W|$)/gi, 'tax rebate$1'], // Same in both
        [/tax return(\W|$)/gi, 'tax return$1'], // Same in both
        [/tax form(\W|$)/gi, 'tax form$1'], // Same in both
        [/tax filing(\W|$)/gi, 'tax filing$1'], // Same in both
        [/tax deadline(\W|$)/gi, 'tax deadline$1'], // Same in both
        [/tax season(\W|$)/gi, 'tax season$1'], // Same in both
        [/tax year(\W|$)/gi, 'tax year$1'], // Same in both
        [/tax period(\W|$)/gi, 'tax period$1'], // Same in both
        [/tax calendar(\W|$)/gi, 'tax calendar$1'], // Same in both
        [/tax day(\W|$)/gi, 'tax day$1'], // Same in both
        [/tax time(\W|$)/gi, 'tax time$1'], // Same in both
        [/tax software(\W|$)/gi, 'tax software$1'], // Same in both
        [/tax preparation(\W|$)/gi, 'tax preparation$1'], // Same in both
        [/tax preparer(\W|$)/gi, 'tax preparer$1'], // Same in both
        [/tax professional(\W|$)/gi, 'tax professional$1'], // Same in both
        [/tax expert(\W|$)/gi, 'tax expert$1'], // Same in both
        [/tax specialist(\W|$)/gi, 'tax specialist$1'], // Same in both
        [/tax consultant(\W|$)/gi, 'tax consultant$1'], // Same in both
        [/tax advisor(\W|$)/gi, 'tax adviser$1'],
        [/tax advice(\W|$)/gi, 'tax advice$1'], // Same in both
        [/tax guidance(\W|$)/gi, 'tax guidance$1'], // Same in both
        [/tax help(\W|$)/gi, 'tax help$1'], // Same in both
        [/tax assistance(\W|$)/gi, 'tax assistance$1'], // Same in both
        [/tax support(\W|$)/gi, 'tax support$1'], // Same in both
        [/tax service(\W|$)/gi, 'tax service$1'], // Same in both
        [/tax solution(\W|$)/gi, 'tax solution$1'], // Same in both
        [/tax strategy(\W|$)/gi, 'tax strategy$1'], // Same in both
        [/tax plan(\W|$)/gi, 'tax plan$1'], // Same in both
        [/tax planning(\W|$)/gi, 'tax planning$1'], // Same in both
        [/tax optimization(\W|$)/gi, 'tax optimisation$1'],
        [/tax minimization(\W|$)/gi, 'tax minimisation$1'],
        [/tax reduction(\W|$)/gi, 'tax reduction$1'], // Same in both
        [/tax saving(\W|$)/gi, 'tax saving$1'], // Same in both
        [/tax efficiency(\W|$)/gi, 'tax efficiency$1'], // Same in both
        [/tax efficient(\W|$)/gi, 'tax efficient$1'], // Same in both
        [/tax effective(\W|$)/gi, 'tax effective$1'], // Same in both
        [/tax advantaged(\W|$)/gi, 'tax advantaged$1'], // Same in both
        [/tax favored(\W|$)/gi, 'tax favoured$1'],
        [/tax preferred(\W|$)/gi, 'tax preferred$1'], // Same in both
        [/tax exempt(\W|$)/gi, 'tax exempt$1'], // Same in both
        [/tax free(\W|$)/gi, 'tax free$1'], // Same in both
        [/tax deferred(\W|$)/gi, 'tax deferred$1'], // Same in both
        [/tax deductible(\W|$)/gi, 'tax deductible$1'], // Same in both
        [/tax allowable(\W|$)/gi, 'tax allowable$1'], // Same in both
        [/tax eligible(\W|$)/gi, 'tax eligible$1'], // Same in both
        [/tax qualified(\W|$)/gi, 'tax qualified$1'], // Same in both
        [/tax approved(\W|$)/gi, 'tax approved$1'], // Same in both
        [/tax compliant(\W|$)/gi, 'tax compliant$1'], // Same in both
        [/tax compliance(\W|$)/gi, 'tax compliance$1'], // Same in both
        [/tax non-compliance(\W|$)/gi, 'tax non-compliance$1'], // Same in both
        [/tax violation(\W|$)/gi, 'tax violation$1'], // Same in both
        [/tax penalty(\W|$)/gi, 'tax penalty$1'], // Same in both
        [/tax fine(\W|$)/gi, 'tax fine$1'], // Same in both
        [/tax interest(\W|$)/gi, 'tax interest$1'], // Same in both
        [/tax fee(\W|$)/gi, 'tax fee$1'], // Same in both
        [/tax charge(\W|$)/gi, 'tax charge$1'], // Same in both
        [/tax cost(\W|$)/gi, 'tax cost$1'], // Same in both
        [/tax expense(\W|$)/gi, 'tax expense$1'], // Same in both
        [/tax bill(\W|$)/gi, 'tax bill$1'], // Same in both
        [/tax invoice(\W|$)/gi, 'tax invoice$1'], // Same in both
        [/tax statement(\W|$)/gi, 'tax statement$1'], // Same in both
        [/tax notice(\W|$)/gi, 'tax notice$1'], // Same in both
        [/tax letter(\W|$)/gi, 'tax letter$1'], // Same in both
        [/tax correspondence(\W|$)/gi, 'tax correspondence$1'], // Same in both
        [/tax communication(\W|$)/gi, 'tax communication$1'], // Same in both
        [/tax document(\W|$)/gi, 'tax document$1'], // Same in both
        [/tax record(\W|$)/gi, 'tax record$1'], // Same in both
        [/tax file(\W|$)/gi, 'tax file$1'], // Same in both
        [/tax folder(\W|$)/gi, 'tax folder$1'], // Same in both
        [/tax paperwork(\W|$)/gi, 'tax paperwork$1'], // Same in both
        [/tax documentation(\W|$)/gi, 'tax documentation$1'], // Same in both
        [/tax information(\W|$)/gi, 'tax information$1'], // Same in both
        [/tax data(\W|$)/gi, 'tax data$1'], // Same in both
        [/tax detail(\W|$)/gi, 'tax detail$1'], // Same in both
        [/tax fact(\W|$)/gi, 'tax fact$1'], // Same in both
        [/tax figure(\W|$)/gi, 'tax figure$1'], // Same in both
        [/tax number(\W|$)/gi, 'tax number$1'], // Same in both
        [/tax amount(\W|$)/gi, 'tax amount$1'], // Same in both
        [/tax sum(\W|$)/gi, 'tax sum$1'], // Same in both
        [/tax total(\W|$)/gi, 'tax total$1'], // Same in both
        [/tax calculation(\W|$)/gi, 'tax calculation$1'], // Same in both
        [/tax computation(\W|$)/gi, 'tax computation$1'], // Same in both
        [/tax estimate(\W|$)/gi, 'tax estimate$1'], // Same in both
        [/tax projection(\W|$)/gi, 'tax projection$1'], // Same in both
        [/tax forecast(\W|$)/gi, 'tax forecast$1'], // Same in both
        [/tax prediction(\W|$)/gi, 'tax prediction$1'], // Same in both
        [/tax analysis(\W|$)/gi, 'tax analysis$1'], // Same in both
        [/tax assessment(\W|$)/gi, 'tax assessment$1'], // Same in both
        [/tax evaluation(\W|$)/gi, 'tax evaluation$1'], // Same in both
        [/tax review(\W|$)/gi, 'tax review$1'], // Same in both
        [/tax examination(\W|$)/gi, 'tax examination$1'], // Same in both
        [/tax inspection(\W|$)/gi, 'tax inspection$1'], // Same in both
        [/tax investigation(\W|$)/gi, 'tax investigation$1'], // Same in both
        [/tax audit(\W|$)/gi, 'tax investigation$1'],
        [/tax check(\W|$)/gi, 'tax check$1'], // Same in both
        [/tax verification(\W|$)/gi, 'tax verification$1'], // Same in both
        [/tax validation(\W|$)/gi, 'tax validation$1'], // Same in both
        [/tax confirmation(\W|$)/gi, 'tax confirmation$1'], // Same in both
        [/tax approval(\W|$)/gi, 'tax approval$1'], // Same in both
        [/tax authorization(\W|$)/gi, 'tax authorisation$1'],
        [/tax permission(\W|$)/gi, 'tax permission$1'], // Same in both
        [/tax consent(\W|$)/gi, 'tax consent$1'], // Same in both
        [/tax agreement(\W|$)/gi, 'tax agreement$1'], // Same in both
        [/tax contract(\W|$)/gi, 'tax contract$1'], // Same in both
        [/tax arrangement(\W|$)/gi, 'tax arrangement$1'], // Same in both
        [/tax deal(\W|$)/gi, 'tax deal$1'], // Same in both
        [/tax transaction(\W|$)/gi, 'tax transaction$1'], // Same in both
        [/tax transfer(\W|$)/gi, 'tax transfer$1'], // Same in both
        [/tax payment(\W|$)/gi, 'tax payment$1'], // Same in both
        [/tax deposit(\W|$)/gi, 'tax deposit$1'], // Same in both
        [/tax withdrawal(\W|$)/gi, 'tax withdrawal$1'], // Same in both
        [/tax distribution(\W|$)/gi, 'tax distribution$1'], // Same in both
        [/tax allocation(\W|$)/gi, 'tax allocation$1'], // Same in both
        [/tax assignment(\W|$)/gi, 'tax assignment$1'], // Same in both
        [/tax designation(\W|$)/gi, 'tax designation$1'], // Same in both
        [/tax classification(\W|$)/gi, 'tax classification$1'], // Same in both
        [/tax categorization(\W|$)/gi, 'tax categorisation$1'],
        [/tax grouping(\W|$)/gi, 'tax grouping$1'], // Same in both
        [/tax organization(\W|$)/gi, 'tax organisation$1'],
        [/tax structure(\W|$)/gi, 'tax structure$1'], // Same in both
        [/tax system(\W|$)/gi, 'tax system$1'], // Same in both
        [/tax framework(\W|$)/gi, 'tax framework$1'], // Same in both
        [/tax model(\W|$)/gi, 'tax model$1'], // Same in both
        [/tax scheme(\W|$)/gi, 'tax scheme$1'], // Same in both
        [/tax program(\W|$)/gi, 'tax programme$1'],
        [/tax initiative(\W|$)/gi, 'tax initiative$1'], // Same in both
        [/tax project(\W|$)/gi, 'tax project$1'], // Same in both
        [/tax campaign(\W|$)/gi, 'tax campaign$1'], // Same in both
        [/tax effort(\W|$)/gi, 'tax effort$1'], // Same in both
        [/tax activity(\W|$)/gi, 'tax activity$1'], // Same in both
        [/tax action(\W|$)/gi, 'tax action$1'], // Same in both
        [/tax operation(\W|$)/gi, 'tax operation$1'], // Same in both
        [/tax function(\W|$)/gi, 'tax function$1'], // Same in both
        [/tax role(\W|$)/gi, 'tax role$1'], // Same in both
        [/tax responsibility(\W|$)/gi, 'tax responsibility$1'], // Same in both
        [/tax duty(\W|$)/gi, 'tax duty$1'], // Same in both
        [/tax obligation(\W|$)/gi, 'tax obligation$1'], // Same in both
        [/tax requirement(\W|$)/gi, 'tax requirement$1'], // Same in both
        [/tax mandate(\W|$)/gi, 'tax mandate$1'], // Same in both
        [/tax directive(\W|$)/gi, 'tax directive$1'], // Same in both
        [/tax instruction(\W|$)/gi, 'tax instruction$1'], // Same in both
        [/tax guidance(\W|$)/gi, 'tax guidance$1'], // Same in both
        [/tax direction(\W|$)/gi, 'tax direction$1'], // Same in both
        [/tax recommendation(\W|$)/gi, 'tax recommendation$1'], // Same in both
        [/tax suggestion(\W|$)/gi, 'tax suggestion$1'], // Same in both
        [/tax advice(\W|$)/gi, 'tax advice$1'], // Same in both
        [/tax counsel(\W|$)/gi, 'tax counsel$1'], // Same in both
        [/tax consultation(\W|$)/gi, 'tax consultation$1'], // Same in both
        [/tax discussion(\W|$)/gi, 'tax discussion$1'], // Same in both
        [/tax conversation(\W|$)/gi, 'tax conversation$1'], // Same in both
        [/tax communication(\W|$)/gi, 'tax communication$1'], // Same in both
        [/tax dialogue(\W|$)/gi, 'tax dialogue$1'], // Same in both
        [/tax dialog(\W|$)/gi, 'tax dialogue$1'],
        [/tax talk(\W|$)/gi, 'tax talk$1'], // Same in both
        [/tax chat(\W|$)/gi, 'tax chat$1'], // Same in both
        [/tax meeting(\W|$)/gi, 'tax meeting$1'], // Same in both
        [/tax session(\W|$)/gi, 'tax session$1'], // Same in both
        [/tax appointment(\W|$)/gi, 'tax appointment$1'], // Same in both
        [/tax consultation(\W|$)/gi, 'tax consultation$1'], // Same in both
        [/tax visit(\W|$)/gi, 'tax visit$1'], // Same in both
        [/tax call(\W|$)/gi, 'tax call$1'], // Same in both
        [/tax phone(\W|$)/gi, 'tax phone$1'], // Same in both
        [/tax email(\W|$)/gi, 'tax email$1'], // Same in both
        [/tax message(\W|$)/gi, 'tax message$1'], // Same in both
        [/tax text(\W|$)/gi, 'tax text$1'], // Same in both
        [/tax note(\W|$)/gi, 'tax note$1'], // Same in both
        [/tax memo(\W|$)/gi, 'tax memo$1'], // Same in both
        [/tax letter(\W|$)/gi, 'tax letter$1'], // Same in both
        [/tax correspondence(\W|$)/gi, 'tax correspondence$1'], // Same in both
        [/tax mail(\W|$)/gi, 'tax mail$1'], // Same in both
        [/tax post(\W|$)/gi, 'tax post$1'], // Same in both
        [/tax delivery(\W|$)/gi, 'tax delivery$1'], // Same in both
        [/tax package(\W|$)/gi, 'tax package$1'], // Same in both
        [/tax parcel(\W|$)/gi, 'tax parcel$1'], // Same in both
        [/tax shipment(\W|$)/gi, 'tax shipment$1'], // Same in both
        [/tax sending(\W|$)/gi, 'tax sending$1'], // Same in both
        [/tax receipt(\W|$)/gi, 'tax receipt$1'], // Same in both
        [/tax receiving(\W|$)/gi, 'tax receiving$1'], // Same in both
        [/tax acceptance(\W|$)/gi, 'tax acceptance$1'], // Same in both
        [/tax rejection(\W|$)/gi, 'tax rejection$1'], // Same in both
        [/tax denial(\W|$)/gi, 'tax denial$1'], // Same in both
        [/tax refusal(\W|$)/gi, 'tax refusal$1'], // Same in both
        [/tax decline(\W|$)/gi, 'tax decline$1'], // Same in both
        [/tax dismissal(\W|$)/gi, 'tax dismissal$1'], // Same in both
        [/tax disregard(\W|$)/gi, 'tax disregard$1'], // Same in both
        [/tax ignorance(\W|$)/gi, 'tax ignorance$1'], // Same in both
        [/tax neglect(\W|$)/gi, 'tax neglect$1'], // Same in both
        [/tax oversight(\W|$)/gi, 'tax oversight$1'], // Same in both
        [/tax omission(\W|$)/gi, 'tax omission$1'], // Same in both
        [/tax exclusion(\W|$)/gi, 'tax exclusion$1'], // Same in both
        [/tax exception(\W|$)/gi, 'tax exception$1'], // Same in both
        [/tax exemption(\W|$)/gi, 'tax exemption$1'], // Same in both
        [/tax waiver(\W|$)/gi, 'tax waiver$1'], // Same in both
        [/tax release(\W|$)/gi, 'tax release$1'], // Same in both
        [/tax discharge(\W|$)/gi, 'tax discharge$1'], // Same in both
        [/tax freedom(\W|$)/gi, 'tax freedom$1'], // Same in both
        [/tax liberty(\W|$)/gi, 'tax liberty$1'], // Same in both
        [/tax independence(\W|$)/gi, 'tax independence$1'], // Same in both
        [/tax autonomy(\W|$)/gi, 'tax autonomy$1'], // Same in both
        [/tax sovereignty(\W|$)/gi, 'tax sovereignty$1'], // Same in both
        [/tax authority(\W|$)/gi, 'tax authority$1'], // Same in both
        [/tax power(\W|$)/gi, 'tax power$1'], // Same in both
        [/tax control(\W|$)/gi, 'tax control$1'], // Same in both
        [/tax management(\W|$)/gi, 'tax management$1'], // Same in both
        [/tax administration(\W|$)/gi, 'tax administration$1'], // Same in both
        [/tax governance(\W|$)/gi, 'tax governance$1'], // Same in both
        [/tax leadership(\W|$)/gi, 'tax leadership$1'], // Same in both
        [/tax direction(\W|$)/gi, 'tax direction$1'], // Same in both
        [/tax guidance(\W|$)/gi, 'tax guidance$1'], // Same in both
        [/tax supervision(\W|$)/gi, 'tax supervision$1'], // Same in both
        [/tax oversight(\W|$)/gi, 'tax oversight$1'], // Same in both
        [/tax monitoring(\W|$)/gi, 'tax monitoring$1'], // Same in both
        [/tax tracking(\W|$)/gi, 'tax tracking$1'], // Same in both
        [/tax following(\W|$)/gi, 'tax following$1'], // Same in both
        [/tax observation(\W|$)/gi, 'tax observation$1'], // Same in both
        [/tax watching(\W|$)/gi, 'tax watching$1'], // Same in both
        [/tax viewing(\W|$)/gi, 'tax viewing$1'], // Same in both
        [/tax seeing(\W|$)/gi, 'tax seeing$1'], // Same in both
        [/tax looking(\W|$)/gi, 'tax looking$1'], // Same in both
        [/tax examination(\W|$)/gi, 'tax examination$1'], // Same in both
        [/tax inspection(\W|$)/gi, 'tax inspection$1'], // Same in both
        [/tax investigation(\W|$)/gi, 'tax investigation$1'], // Same in both
        [/tax inquiry(\W|$)/gi, 'tax enquiry$1'],
        [/tax probe(\W|$)/gi, 'tax probe$1'], // Same in both
        [/tax search(\W|$)/gi, 'tax search$1'], // Same in both
        [/tax exploration(\W|$)/gi, 'tax exploration$1'], // Same in both
        [/tax discovery(\W|$)/gi, 'tax discovery$1'], // Same in both
        [/tax finding(\W|$)/gi, 'tax finding$1'], // Same in both
        [/tax locating(\W|$)/gi, 'tax locating$1'], // Same in both
        [/tax identifying(\W|$)/gi, 'tax identifying$1'], // Same in both
        [/tax recognizing(\W|$)/gi, 'tax recognising$1'],
        [/tax realizing(\W|$)/gi, 'tax realising$1'],
        [/tax understanding(\W|$)/gi, 'tax understanding$1'], // Same in both
        [/tax knowing(\W|$)/gi, 'tax knowing$1'], // Same in both
        [/tax learning(\W|$)/gi, 'tax learning$1'], // Same in both
        [/tax studying(\W|$)/gi, 'tax studying$1'], // Same in both
        [/tax researching(\W|$)/gi, 'tax researching$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax analyzing(\W|$)/gi, 'tax analysing$1'],
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax confirming(\W|$)/gi, 'tax confirming$1'], // Same in both
        [/tax approving(\W|$)/gi, 'tax approving$1'], // Same in both
        [/tax authorizing(\W|$)/gi, 'tax authorising$1'],
        [/tax permitting(\W|$)/gi, 'tax permitting$1'], // Same in both
        [/tax allowing(\W|$)/gi, 'tax allowing$1'], // Same in both
        [/tax enabling(\W|$)/gi, 'tax enabling$1'], // Same in both
        [/tax facilitating(\W|$)/gi, 'tax facilitating$1'], // Same in both
        [/tax helping(\W|$)/gi, 'tax helping$1'], // Same in both
        [/tax assisting(\W|$)/gi, 'tax assisting$1'], // Same in both
        [/tax supporting(\W|$)/gi, 'tax supporting$1'], // Same in both
        [/tax aiding(\W|$)/gi, 'tax aiding$1'], // Same in both
        [/tax backing(\W|$)/gi, 'tax backing$1'], // Same in both
        [/tax endorsing(\W|$)/gi, 'tax endorsing$1'], // Same in both
        [/tax advocating(\W|$)/gi, 'tax advocating$1'], // Same in both
        [/tax promoting(\W|$)/gi, 'tax promoting$1'], // Same in both
        [/tax encouraging(\W|$)/gi, 'tax encouraging$1'], // Same in both
        [/tax motivating(\W|$)/gi, 'tax motivating$1'], // Same in both
        [/tax inspiring(\W|$)/gi, 'tax inspiring$1'], // Same in both
        [/tax stimulating(\W|$)/gi, 'tax stimulating$1'], // Same in both
        [/tax exciting(\W|$)/gi, 'tax exciting$1'], // Same in both
        [/tax interesting(\W|$)/gi, 'tax interesting$1'], // Same in both
        [/tax engaging(\W|$)/gi, 'tax engaging$1'], // Same in both
        [/tax captivating(\W|$)/gi, 'tax captivating$1'], // Same in both
        [/tax fascinating(\W|$)/gi, 'tax fascinating$1'], // Same in both
        [/tax intriguing(\W|$)/gi, 'tax intriguing$1'], // Same in both
        [/tax compelling(\W|$)/gi, 'tax compelling$1'], // Same in both
        [/tax convincing(\W|$)/gi, 'tax convincing$1'], // Same in both
        [/tax persuading(\W|$)/gi, 'tax persuading$1'], // Same in both
        [/tax influencing(\W|$)/gi, 'tax influencing$1'], // Same in both
        [/tax affecting(\W|$)/gi, 'tax affecting$1'], // Same in both
        [/tax impacting(\W|$)/gi, 'tax impacting$1'], // Same in both
        [/tax changing(\W|$)/gi, 'tax changing$1'], // Same in both
        [/tax modifying(\W|$)/gi, 'tax modifying$1'], // Same in both
        [/tax altering(\W|$)/gi, 'tax altering$1'], // Same in both
        [/tax adjusting(\W|$)/gi, 'tax adjusting$1'], // Same in both
        [/tax adapting(\W|$)/gi, 'tax adapting$1'], // Same in both
        [/tax customizing(\W|$)/gi, 'tax customising$1'],
        [/tax personalizing(\W|$)/gi, 'tax personalising$1'],
        [/tax tailoring(\W|$)/gi, 'tax tailoring$1'], // Same in both
        [/tax fitting(\W|$)/gi, 'tax fitting$1'], // Same in both
        [/tax suiting(\W|$)/gi, 'tax suiting$1'], // Same in both
        [/tax matching(\W|$)/gi, 'tax matching$1'], // Same in both
        [/tax corresponding(\W|$)/gi, 'tax corresponding$1'], // Same in both
        [/tax relating(\W|$)/gi, 'tax relating$1'], // Same in both
        [/tax connecting(\W|$)/gi, 'tax connecting$1'], // Same in both
        [/tax linking(\W|$)/gi, 'tax linking$1'], // Same in both
        [/tax associating(\W|$)/gi, 'tax associating$1'], // Same in both
        [/tax affiliating(\W|$)/gi, 'tax affiliating$1'], // Same in both
        [/tax partnering(\W|$)/gi, 'tax partnering$1'], // Same in both
        [/tax collaborating(\W|$)/gi, 'tax collaborating$1'], // Same in both
        [/tax cooperating(\W|$)/gi, 'tax cooperating$1'], // Same in both
        [/tax coordinating(\W|$)/gi, 'tax coordinating$1'], // Same in both
        [/tax organizing(\W|$)/gi, 'tax organising$1'],
        [/tax arranging(\W|$)/gi, 'tax arranging$1'], // Same in both
        [/tax structuring(\W|$)/gi, 'tax structuring$1'], // Same in both
        [/tax systematizing(\W|$)/gi, 'tax systematising$1'],
        [/tax standardizing(\W|$)/gi, 'tax standardising$1'],
        [/tax normalizing(\W|$)/gi, 'tax normalising$1'],
        [/tax regularizing(\W|$)/gi, 'tax regularising$1'],
        [/tax formalizing(\W|$)/gi, 'tax formalising$1'],
        [/tax legalizing(\W|$)/gi, 'tax legalising$1'],
        [/tax legitimizing(\W|$)/gi, 'tax legitimising$1'],
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax testing(\W|$)/gi, 'tax testing$1'], // Same in both
        [/tax trying(\W|$)/gi, 'tax trying$1'], // Same in both
        [/tax attempting(\W|$)/gi, 'tax attempting$1'], // Same in both
        [/tax endeavoring(\W|$)/gi, 'tax endeavouring$1'],
        [/tax striving(\W|$)/gi, 'tax striving$1'], // Same in both
        [/tax aiming(\W|$)/gi, 'tax aiming$1'], // Same in both
        [/tax targeting(\W|$)/gi, 'tax targeting$1'], // Same in both
        [/tax focusing(\W|$)/gi, 'tax focusing$1'], // Same in both
        [/tax concentrating(\W|$)/gi, 'tax concentrating$1'], // Same in both
        [/tax centering(\W|$)/gi, 'tax centring$1'],
        [/tax directing(\W|$)/gi, 'tax directing$1'], // Same in both
        [/tax guiding(\W|$)/gi, 'tax guiding$1'], // Same in both
        [/tax leading(\W|$)/gi, 'tax leading$1'], // Same in both
        [/tax managing(\W|$)/gi, 'tax managing$1'], // Same in both
        [/tax administering(\W|$)/gi, 'tax administering$1'], // Same in both
        [/tax governing(\W|$)/gi, 'tax governing$1'], // Same in both
        [/tax controlling(\W|$)/gi, 'tax controlling$1'], // Same in both
        [/tax regulating(\W|$)/gi, 'tax regulating$1'], // Same in both
        [/tax supervising(\W|$)/gi, 'tax supervising$1'], // Same in both
        [/tax overseeing(\W|$)/gi, 'tax overseeing$1'], // Same in both
        [/tax monitoring(\W|$)/gi, 'tax monitoring$1'], // Same in both
        [/tax tracking(\W|$)/gi, 'tax tracking$1'], // Same in both
        [/tax following(\W|$)/gi, 'tax following$1'], // Same in both
        [/tax observing(\W|$)/gi, 'tax observing$1'], // Same in both
        [/tax watching(\W|$)/gi, 'tax watching$1'], // Same in both
        [/tax viewing(\W|$)/gi, 'tax viewing$1'], // Same in both
        [/tax seeing(\W|$)/gi, 'tax seeing$1'], // Same in both
        [/tax looking(\W|$)/gi, 'tax looking$1'], // Same in both
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax inquiring(\W|$)/gi, 'tax enquiring$1'],
        [/tax probing(\W|$)/gi, 'tax probing$1'], // Same in both
        [/tax searching(\W|$)/gi, 'tax searching$1'], // Same in both
        [/tax exploring(\W|$)/gi, 'tax exploring$1'], // Same in both
        [/tax discovering(\W|$)/gi, 'tax discovering$1'], // Same in both
        [/tax finding(\W|$)/gi, 'tax finding$1'], // Same in both
        [/tax locating(\W|$)/gi, 'tax locating$1'], // Same in both
        [/tax identifying(\W|$)/gi, 'tax identifying$1'], // Same in both
        [/tax recognizing(\W|$)/gi, 'tax recognising$1'],
        [/tax realizing(\W|$)/gi, 'tax realising$1'],
        [/tax understanding(\W|$)/gi, 'tax understanding$1'], // Same in both
        [/tax knowing(\W|$)/gi, 'tax knowing$1'], // Same in both
        [/tax learning(\W|$)/gi, 'tax learning$1'], // Same in both
        [/tax studying(\W|$)/gi, 'tax studying$1'], // Same in both
        [/tax researching(\W|$)/gi, 'tax researching$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax analyzing(\W|$)/gi, 'tax analysing$1'],
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax confirming(\W|$)/gi, 'tax confirming$1'], // Same in both
        [/tax approving(\W|$)/gi, 'tax approving$1'], // Same in both
        [/tax authorizing(\W|$)/gi, 'tax authorising$1'],
        [/tax permitting(\W|$)/gi, 'tax permitting$1'], // Same in both
        [/tax allowing(\W|$)/gi, 'tax allowing$1'], // Same in both
        [/tax enabling(\W|$)/gi, 'tax enabling$1'], // Same in both
        [/tax facilitating(\W|$)/gi, 'tax facilitating$1'], // Same in both
        [/tax helping(\W|$)/gi, 'tax helping$1'], // Same in both
        [/tax assisting(\W|$)/gi, 'tax assisting$1'], // Same in both
        [/tax supporting(\W|$)/gi, 'tax supporting$1'], // Same in both
        [/tax aiding(\W|$)/gi, 'tax aiding$1'], // Same in both
        [/tax backing(\W|$)/gi, 'tax backing$1'], // Same in both
        [/tax endorsing(\W|$)/gi, 'tax endorsing$1'], // Same in both
        [/tax advocating(\W|$)/gi, 'tax advocating$1'], // Same in both
        [/tax promoting(\W|$)/gi, 'tax promoting$1'], // Same in both
        [/tax encouraging(\W|$)/gi, 'tax encouraging$1'], // Same in both
        [/tax motivating(\W|$)/gi, 'tax motivating$1'], // Same in both
        [/tax inspiring(\W|$)/gi, 'tax inspiring$1'], // Same in both
        [/tax stimulating(\W|$)/gi, 'tax stimulating$1'], // Same in both
        [/tax exciting(\W|$)/gi, 'tax exciting$1'], // Same in both
        [/tax interesting(\W|$)/gi, 'tax interesting$1'], // Same in both
        [/tax engaging(\W|$)/gi, 'tax engaging$1'], // Same in both
        [/tax captivating(\W|$)/gi, 'tax captivating$1'], // Same in both
        [/tax fascinating(\W|$)/gi, 'tax fascinating$1'], // Same in both
        [/tax intriguing(\W|$)/gi, 'tax intriguing$1'], // Same in both
        [/tax compelling(\W|$)/gi, 'tax compelling$1'], // Same in both
        [/tax convincing(\W|$)/gi, 'tax convincing$1'], // Same in both
        [/tax persuading(\W|$)/gi, 'tax persuading$1'], // Same in both
        [/tax influencing(\W|$)/gi, 'tax influencing$1'], // Same in both
        [/tax affecting(\W|$)/gi, 'tax affecting$1'], // Same in both
        [/tax impacting(\W|$)/gi, 'tax impacting$1'], // Same in both
        [/tax changing(\W|$)/gi, 'tax changing$1'], // Same in both
        [/tax modifying(\W|$)/gi, 'tax modifying$1'], // Same in both
        [/tax altering(\W|$)/gi, 'tax altering$1'], // Same in both
        [/tax adjusting(\W|$)/gi, 'tax adjusting$1'], // Same in both
        [/tax adapting(\W|$)/gi, 'tax adapting$1'], // Same in both
        [/tax customizing(\W|$)/gi, 'tax customising$1'],
        [/tax personalizing(\W|$)/gi, 'tax personalising$1'],
        [/tax tailoring(\W|$)/gi, 'tax tailoring$1'], // Same in both
        [/tax fitting(\W|$)/gi, 'tax fitting$1'], // Same in both
        [/tax suiting(\W|$)/gi, 'tax suiting$1'], // Same in both
        [/tax matching(\W|$)/gi, 'tax matching$1'], // Same in both
        [/tax corresponding(\W|$)/gi, 'tax corresponding$1'], // Same in both
        [/tax relating(\W|$)/gi, 'tax relating$1'], // Same in both
        [/tax connecting(\W|$)/gi, 'tax connecting$1'], // Same in both
        [/tax linking(\W|$)/gi, 'tax linking$1'], // Same in both
        [/tax associating(\W|$)/gi, 'tax associating$1'], // Same in both
        [/tax affiliating(\W|$)/gi, 'tax affiliating$1'], // Same in both
        [/tax partnering(\W|$)/gi, 'tax partnering$1'], // Same in both
        [/tax collaborating(\W|$)/gi, 'tax collaborating$1'], // Same in both
        [/tax cooperating(\W|$)/gi, 'tax cooperating$1'], // Same in both
        [/tax coordinating(\W|$)/gi, 'tax coordinating$1'], // Same in both
        [/tax organizing(\W|$)/gi, 'tax organising$1'],
        [/tax arranging(\W|$)/gi, 'tax arranging$1'], // Same in both
        [/tax structuring(\W|$)/gi, 'tax structuring$1'], // Same in both
        [/tax systematizing(\W|$)/gi, 'tax systematising$1'],
        [/tax standardizing(\W|$)/gi, 'tax standardising$1'],
        [/tax normalizing(\W|$)/gi, 'tax normalising$1'],
        [/tax regularizing(\W|$)/gi, 'tax regularising$1'],
        [/tax formalizing(\W|$)/gi, 'tax formalising$1'],
        [/tax legalizing(\W|$)/gi, 'tax legalising$1'],
        [/tax legitimizing(\W|$)/gi, 'tax legitimising$1'],
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax testing(\W|$)/gi, 'tax testing$1'], // Same in both
        [/tax trying(\W|$)/gi, 'tax trying$1'], // Same in both
        [/tax attempting(\W|$)/gi, 'tax attempting$1'], // Same in both
        [/tax endeavoring(\W|$)/gi, 'tax endeavouring$1'],
        [/tax striving(\W|$)/gi, 'tax striving$1'], // Same in both
        [/tax aiming(\W|$)/gi, 'tax aiming$1'], // Same in both
        [/tax targeting(\W|$)/gi, 'tax targeting$1'], // Same in both
        [/tax focusing(\W|$)/gi, 'tax focusing$1'], // Same in both
        [/tax concentrating(\W|$)/gi, 'tax concentrating$1'], // Same in both
        [/tax centering(\W|$)/gi, 'tax centring$1'],
        [/tax directing(\W|$)/gi, 'tax directing$1'], // Same in both
        [/tax guiding(\W|$)/gi, 'tax guiding$1'], // Same in both
        [/tax leading(\W|$)/gi, 'tax leading$1'], // Same in both
        [/tax managing(\W|$)/gi, 'tax managing$1'], // Same in both
        [/tax administering(\W|$)/gi, 'tax administering$1'], // Same in both
        [/tax governing(\W|$)/gi, 'tax governing$1'], // Same in both
        [/tax controlling(\W|$)/gi, 'tax controlling$1'], // Same in both
        [/tax regulating(\W|$)/gi, 'tax regulating$1'], // Same in both
        [/tax supervising(\W|$)/gi, 'tax supervising$1'], // Same in both
        [/tax overseeing(\W|$)/gi, 'tax overseeing$1'], // Same in both
        [/tax monitoring(\W|$)/gi, 'tax monitoring$1'], // Same in both
        [/tax tracking(\W|$)/gi, 'tax tracking$1'], // Same in both
        [/tax following(\W|$)/gi, 'tax following$1'], // Same in both
        [/tax observing(\W|$)/gi, 'tax observing$1'], // Same in both
        [/tax watching(\W|$)/gi, 'tax watching$1'], // Same in both
        [/tax viewing(\W|$)/gi, 'tax viewing$1'], // Same in both
        [/tax seeing(\W|$)/gi, 'tax seeing$1'], // Same in both
        [/tax looking(\W|$)/gi, 'tax looking$1'], // Same in both
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax inquiring(\W|$)/gi, 'tax enquiring$1'],
        [/tax probing(\W|$)/gi, 'tax probing$1'], // Same in both
        [/tax searching(\W|$)/gi, 'tax searching$1'], // Same in both
        [/tax exploring(\W|$)/gi, 'tax exploring$1'], // Same in both
        [/tax discovering(\W|$)/gi, 'tax discovering$1'], // Same in both
        [/tax finding(\W|$)/gi, 'tax finding$1'], // Same in both
        [/tax locating(\W|$)/gi, 'tax locating$1'], // Same in both
        [/tax identifying(\W|$)/gi, 'tax identifying$1'], // Same in both
        [/tax recognizing(\W|$)/gi, 'tax recognising$1'],
        [/tax realizing(\W|$)/gi, 'tax realising$1'],
        [/tax understanding(\W|$)/gi, 'tax understanding$1'], // Same in both
        [/tax knowing(\W|$)/gi, 'tax knowing$1'], // Same in both
        [/tax learning(\W|$)/gi, 'tax learning$1'], // Same in both
        [/tax studying(\W|$)/gi, 'tax studying$1'], // Same in both
        [/tax researching(\W|$)/gi, 'tax researching$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax analyzing(\W|$)/gi, 'tax analysing$1'],
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax confirming(\W|$)/gi, 'tax confirming$1'], // Same in both
        [/tax approving(\W|$)/gi, 'tax approving$1'], // Same in both
        [/tax authorizing(\W|$)/gi, 'tax authorising$1'],
        [/tax permitting(\W|$)/gi, 'tax permitting$1'], // Same in both
        [/tax allowing(\W|$)/gi, 'tax allowing$1'], // Same in both
        [/tax enabling(\W|$)/gi, 'tax enabling$1'], // Same in both
        [/tax facilitating(\W|$)/gi, 'tax facilitating$1'], // Same in both
        [/tax helping(\W|$)/gi, 'tax helping$1'], // Same in both
        [/tax assisting(\W|$)/gi, 'tax assisting$1'], // Same in both
        [/tax supporting(\W|$)/gi, 'tax supporting$1'], // Same in both
        [/tax aiding(\W|$)/gi, 'tax aiding$1'], // Same in both
        [/tax backing(\W|$)/gi, 'tax backing$1'], // Same in both
        [/tax endorsing(\W|$)/gi, 'tax endorsing$1'], // Same in both
        [/tax advocating(\W|$)/gi, 'tax advocating$1'], // Same in both
        [/tax promoting(\W|$)/gi, 'tax promoting$1'], // Same in both
        [/tax encouraging(\W|$)/gi, 'tax encouraging$1'], // Same in both
        [/tax motivating(\W|$)/gi, 'tax motivating$1'], // Same in both
        [/tax inspiring(\W|$)/gi, 'tax inspiring$1'], // Same in both
        [/tax stimulating(\W|$)/gi, 'tax stimulating$1'], // Same in both
        [/tax exciting(\W|$)/gi, 'tax exciting$1'], // Same in both
        [/tax interesting(\W|$)/gi, 'tax interesting$1'], // Same in both
        [/tax engaging(\W|$)/gi, 'tax engaging$1'], // Same in both
        [/tax captivating(\W|$)/gi, 'tax captivating$1'], // Same in both
        [/tax fascinating(\W|$)/gi, 'tax fascinating$1'], // Same in both
        [/tax intriguing(\W|$)/gi, 'tax intriguing$1'], // Same in both
        [/tax compelling(\W|$)/gi, 'tax compelling$1'], // Same in both
        [/tax convincing(\W|$)/gi, 'tax convincing$1'], // Same in both
        [/tax persuading(\W|$)/gi, 'tax persuading$1'], // Same in both
        [/tax influencing(\W|$)/gi, 'tax influencing$1'], // Same in both
        [/tax affecting(\W|$)/gi, 'tax affecting$1'], // Same in both
        [/tax impacting(\W|$)/gi, 'tax impacting$1'], // Same in both
        [/tax changing(\W|$)/gi, 'tax changing$1'], // Same in both
        [/tax modifying(\W|$)/gi, 'tax modifying$1'], // Same in both
        [/tax altering(\W|$)/gi, 'tax altering$1'], // Same in both
        [/tax adjusting(\W|$)/gi, 'tax adjusting$1'], // Same in both
        [/tax adapting(\W|$)/gi, 'tax adapting$1'], // Same in both
        [/tax customizing(\W|$)/gi, 'tax customising$1'],
        [/tax personalizing(\W|$)/gi, 'tax personalising$1'],
        [/tax tailoring(\W|$)/gi, 'tax tailoring$1'], // Same in both
        [/tax fitting(\W|$)/gi, 'tax fitting$1'], // Same in both
        [/tax suiting(\W|$)/gi, 'tax suiting$1'], // Same in both
        [/tax matching(\W|$)/gi, 'tax matching$1'], // Same in both
        [/tax corresponding(\W|$)/gi, 'tax corresponding$1'], // Same in both
        [/tax relating(\W|$)/gi, 'tax relating$1'], // Same in both
        [/tax connecting(\W|$)/gi, 'tax connecting$1'], // Same in both
        [/tax linking(\W|$)/gi, 'tax linking$1'], // Same in both
        [/tax associating(\W|$)/gi, 'tax associating$1'], // Same in both
        [/tax affiliating(\W|$)/gi, 'tax affiliating$1'], // Same in both
        [/tax partnering(\W|$)/gi, 'tax partnering$1'], // Same in both
        [/tax collaborating(\W|$)/gi, 'tax collaborating$1'], // Same in both
        [/tax cooperating(\W|$)/gi, 'tax cooperating$1'], // Same in both
        [/tax coordinating(\W|$)/gi, 'tax coordinating$1'], // Same in both
        [/tax organizing(\W|$)/gi, 'tax organising$1'],
        [/tax arranging(\W|$)/gi, 'tax arranging$1'], // Same in both
        [/tax structuring(\W|$)/gi, 'tax structuring$1'], // Same in both
        [/tax systematizing(\W|$)/gi, 'tax systematising$1'],
        [/tax standardizing(\W|$)/gi, 'tax standardising$1'],
        [/tax normalizing(\W|$)/gi, 'tax normalising$1'],
        [/tax regularizing(\W|$)/gi, 'tax regularising$1'],
        [/tax formalizing(\W|$)/gi, 'tax formalising$1'],
        [/tax legalizing(\W|$)/gi, 'tax legalising$1'],
        [/tax legitimizing(\W|$)/gi, 'tax legitimising$1'],
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax testing(\W|$)/gi, 'tax testing$1'], // Same in both
        [/tax trying(\W|$)/gi, 'tax trying$1'], // Same in both
        [/tax attempting(\W|$)/gi, 'tax attempting$1'], // Same in both
        [/tax endeavoring(\W|$)/gi, 'tax endeavouring$1'],
        [/tax striving(\W|$)/gi, 'tax striving$1'], // Same in both
        [/tax aiming(\W|$)/gi, 'tax aiming$1'], // Same in both
        [/tax targeting(\W|$)/gi, 'tax targeting$1'], // Same in both
        [/tax focusing(\W|$)/gi, 'tax focusing$1'], // Same in both
        [/tax concentrating(\W|$)/gi, 'tax concentrating$1'], // Same in both
        [/tax centering(\W|$)/gi, 'tax centring$1'],
        [/tax directing(\W|$)/gi, 'tax directing$1'], // Same in both
        [/tax guiding(\W|$)/gi, 'tax guiding$1'], // Same in both
        [/tax leading(\W|$)/gi, 'tax leading$1'], // Same in both
        [/tax managing(\W|$)/gi, 'tax managing$1'], // Same in both
        [/tax administering(\W|$)/gi, 'tax administering$1'], // Same in both
        [/tax governing(\W|$)/gi, 'tax governing$1'], // Same in both
        [/tax controlling(\W|$)/gi, 'tax controlling$1'], // Same in both
        [/tax regulating(\W|$)/gi, 'tax regulating$1'], // Same in both
        [/tax supervising(\W|$)/gi, 'tax supervising$1'], // Same in both
        [/tax overseeing(\W|$)/gi, 'tax overseeing$1'], // Same in both
        [/tax monitoring(\W|$)/gi, 'tax monitoring$1'], // Same in both
        [/tax tracking(\W|$)/gi, 'tax tracking$1'], // Same in both
        [/tax following(\W|$)/gi, 'tax following$1'], // Same in both
        [/tax observing(\W|$)/gi, 'tax observing$1'], // Same in both
        [/tax watching(\W|$)/gi, 'tax watching$1'], // Same in both
        [/tax viewing(\W|$)/gi, 'tax viewing$1'], // Same in both
        [/tax seeing(\W|$)/gi, 'tax seeing$1'], // Same in both
        [/tax looking(\W|$)/gi, 'tax looking$1'], // Same in both
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax inquiring(\W|$)/gi, 'tax enquiring$1'],
        [/tax probing(\W|$)/gi, 'tax probing$1'], // Same in both
        [/tax searching(\W|$)/gi, 'tax searching$1'], // Same in both
        [/tax exploring(\W|$)/gi, 'tax exploring$1'], // Same in both
        [/tax discovering(\W|$)/gi, 'tax discovering$1'], // Same in both
        [/tax finding(\W|$)/gi, 'tax finding$1'], // Same in both
        [/tax locating(\W|$)/gi, 'tax locating$1'], // Same in both
        [/tax identifying(\W|$)/gi, 'tax identifying$1'], // Same in both
        [/tax recognizing(\W|$)/gi, 'tax recognising$1'],
        [/tax realizing(\W|$)/gi, 'tax realising$1'],
        [/tax understanding(\W|$)/gi, 'tax understanding$1'], // Same in both
        [/tax knowing(\W|$)/gi, 'tax knowing$1'], // Same in both
        [/tax learning(\W|$)/gi, 'tax learning$1'], // Same in both
        [/tax studying(\W|$)/gi, 'tax studying$1'], // Same in both
        [/tax researching(\W|$)/gi, 'tax researching$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax analyzing(\W|$)/gi, 'tax analysing$1'],
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax confirming(\W|$)/gi, 'tax confirming$1'], // Same in both
        [/tax approving(\W|$)/gi, 'tax approving$1'], // Same in both
        [/tax authorizing(\W|$)/gi, 'tax authorising$1'],
        [/tax permitting(\W|$)/gi, 'tax permitting$1'], // Same in both
        [/tax allowing(\W|$)/gi, 'tax allowing$1'], // Same in both
        [/tax enabling(\W|$)/gi, 'tax enabling$1'], // Same in both
        [/tax facilitating(\W|$)/gi, 'tax facilitating$1'], // Same in both
        [/tax helping(\W|$)/gi, 'tax helping$1'], // Same in both
        [/tax assisting(\W|$)/gi, 'tax assisting$1'], // Same in both
        [/tax supporting(\W|$)/gi, 'tax supporting$1'], // Same in both
        [/tax aiding(\W|$)/gi, 'tax aiding$1'], // Same in both
        [/tax backing(\W|$)/gi, 'tax backing$1'], // Same in both
        [/tax endorsing(\W|$)/gi, 'tax endorsing$1'], // Same in both
        [/tax advocating(\W|$)/gi, 'tax advocating$1'], // Same in both
        [/tax promoting(\W|$)/gi, 'tax promoting$1'], // Same in both
        [/tax encouraging(\W|$)/gi, 'tax encouraging$1'], // Same in both
        [/tax motivating(\W|$)/gi, 'tax motivating$1'], // Same in both
        [/tax inspiring(\W|$)/gi, 'tax inspiring$1'], // Same in both
        [/tax stimulating(\W|$)/gi, 'tax stimulating$1'], // Same in both
        [/tax exciting(\W|$)/gi, 'tax exciting$1'], // Same in both
        [/tax interesting(\W|$)/gi, 'tax interesting$1'], // Same in both
        [/tax engaging(\W|$)/gi, 'tax engaging$1'], // Same in both
        [/tax captivating(\W|$)/gi, 'tax captivating$1'], // Same in both
        [/tax fascinating(\W|$)/gi, 'tax fascinating$1'], // Same in both
        [/tax intriguing(\W|$)/gi, 'tax intriguing$1'], // Same in both
        [/tax compelling(\W|$)/gi, 'tax compelling$1'], // Same in both
        [/tax convincing(\W|$)/gi, 'tax convincing$1'], // Same in both
        [/tax persuading(\W|$)/gi, 'tax persuading$1'], // Same in both
        [/tax influencing(\W|$)/gi, 'tax influencing$1'], // Same in both
        [/tax affecting(\W|$)/gi, 'tax affecting$1'], // Same in both
        [/tax impacting(\W|$)/gi, 'tax impacting$1'], // Same in both
        [/tax changing(\W|$)/gi, 'tax changing$1'], // Same in both
        [/tax modifying(\W|$)/gi, 'tax modifying$1'], // Same in both
        [/tax altering(\W|$)/gi, 'tax altering$1'], // Same in both
        [/tax adjusting(\W|$)/gi, 'tax adjusting$1'], // Same in both
        [/tax adapting(\W|$)/gi, 'tax adapting$1'], // Same in both
        [/tax customizing(\W|$)/gi, 'tax customising$1'],
        [/tax personalizing(\W|$)/gi, 'tax personalising$1'],
        [/tax tailoring(\W|$)/gi, 'tax tailoring$1'], // Same in both
        [/tax fitting(\W|$)/gi, 'tax fitting$1'], // Same in both
        [/tax suiting(\W|$)/gi, 'tax suiting$1'], // Same in both
        [/tax matching(\W|$)/gi, 'tax matching$1'], // Same in both
        [/tax corresponding(\W|$)/gi, 'tax corresponding$1'], // Same in both
        [/tax relating(\W|$)/gi, 'tax relating$1'], // Same in both
        [/tax connecting(\W|$)/gi, 'tax connecting$1'], // Same in both
        [/tax linking(\W|$)/gi, 'tax linking$1'], // Same in both
        [/tax associating(\W|$)/gi, 'tax associating$1'], // Same in both
        [/tax affiliating(\W|$)/gi, 'tax affiliating$1'], // Same in both
        [/tax partnering(\W|$)/gi, 'tax partnering$1'], // Same in both
        [/tax collaborating(\W|$)/gi, 'tax collaborating$1'], // Same in both
        [/tax cooperating(\W|$)/gi, 'tax cooperating$1'], // Same in both
        [/tax coordinating(\W|$)/gi, 'tax coordinating$1'], // Same in both
        [/tax organizing(\W|$)/gi, 'tax organising$1'],
        [/tax arranging(\W|$)/gi, 'tax arranging$1'], // Same in both
        [/tax structuring(\W|$)/gi, 'tax structuring$1'], // Same in both
        [/tax systematizing(\W|$)/gi, 'tax systematising$1'],
        [/tax standardizing(\W|$)/gi, 'tax standardising$1'],
        [/tax normalizing(\W|$)/gi, 'tax normalising$1'],
        [/tax regularizing(\W|$)/gi, 'tax regularising$1'],
        [/tax formalizing(\W|$)/gi, 'tax formalising$1'],
        [/tax legalizing(\W|$)/gi, 'tax legalising$1'],
        [/tax legitimizing(\W|$)/gi, 'tax legitimising$1'],
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax testing(\W|$)/gi, 'tax testing$1'], // Same in both
        [/tax trying(\W|$)/gi, 'tax trying$1'], // Same in both
        [/tax attempting(\W|$)/gi, 'tax attempting$1'], // Same in both
        [/tax endeavoring(\W|$)/gi, 'tax endeavouring$1'],
        [/tax striving(\W|$)/gi, 'tax striving$1'], // Same in both
        [/tax aiming(\W|$)/gi, 'tax aiming$1'], // Same in both
        [/tax targeting(\W|$)/gi, 'tax targeting$1'], // Same in both
        [/tax focusing(\W|$)/gi, 'tax focusing$1'], // Same in both
        [/tax concentrating(\W|$)/gi, 'tax concentrating$1'], // Same in both
        [/tax centering(\W|$)/gi, 'tax centring$1'],
        [/tax directing(\W|$)/gi, 'tax directing$1'], // Same in both
        [/tax guiding(\W|$)/gi, 'tax guiding$1'], // Same in both
        [/tax leading(\W|$)/gi, 'tax leading$1'], // Same in both
        [/tax managing(\W|$)/gi, 'tax managing$1'], // Same in both
        [/tax administering(\W|$)/gi, 'tax administering$1'], // Same in both
        [/tax governing(\W|$)/gi, 'tax governing$1'], // Same in both
        [/tax controlling(\W|$)/gi, 'tax controlling$1'], // Same in both
        [/tax regulating(\W|$)/gi, 'tax regulating$1'], // Same in both
        [/tax supervising(\W|$)/gi, 'tax supervising$1'], // Same in both
        [/tax overseeing(\W|$)/gi, 'tax overseeing$1'], // Same in both
        [/tax monitoring(\W|$)/gi, 'tax monitoring$1'], // Same in both
        [/tax tracking(\W|$)/gi, 'tax tracking$1'], // Same in both
        [/tax following(\W|$)/gi, 'tax following$1'], // Same in both
        [/tax observing(\W|$)/gi, 'tax observing$1'], // Same in both
        [/tax watching(\W|$)/gi, 'tax watching$1'], // Same in both
        [/tax viewing(\W|$)/gi, 'tax viewing$1'], // Same in both
        [/tax seeing(\W|$)/gi, 'tax seeing$1'], // Same in both
        [/tax looking(\W|$)/gi, 'tax looking$1'], // Same in both
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax inquiring(\W|$)/gi, 'tax enquiring$1'],
        [/tax probing(\W|$)/gi, 'tax probing$1'], // Same in both
        [/tax searching(\W|$)/gi, 'tax searching$1'], // Same in both
        [/tax exploring(\W|$)/gi, 'tax exploring$1'], // Same in both
        [/tax discovering(\W|$)/gi, 'tax discovering$1'], // Same in both
        [/tax finding(\W|$)/gi, 'tax finding$1'], // Same in both
        [/tax locating(\W|$)/gi, 'tax locating$1'], // Same in both
        [/tax identifying(\W|$)/gi, 'tax identifying$1'], // Same in both
        [/tax recognizing(\W|$)/gi, 'tax recognising$1'],
        [/tax realizing(\W|$)/gi, 'tax realising$1'],
        [/tax understanding(\W|$)/gi, 'tax understanding$1'], // Same in both
        [/tax knowing(\W|$)/gi, 'tax knowing$1'], // Same in both
        [/tax learning(\W|$)/gi, 'tax learning$1'], // Same in both
        [/tax studying(\W|$)/gi, 'tax studying$1'], // Same in both
        [/tax researching(\W|$)/gi, 'tax researching$1'], // Same in both
        [/tax investigating(\W|$)/gi, 'tax investigating$1'], // Same in both
        [/tax analyzing(\W|$)/gi, 'tax analysing$1'],
        [/tax examining(\W|$)/gi, 'tax examining$1'], // Same in both
        [/tax inspecting(\W|$)/gi, 'tax inspecting$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax confirming(\W|$)/gi, 'tax confirming$1'], // Same in both
        [/tax approving(\W|$)/gi, 'tax approving$1'], // Same in both
        [/tax authorizing(\W|$)/gi, 'tax authorising$1'],
        [/tax permitting(\W|$)/gi, 'tax permitting$1'], // Same in both
        [/tax allowing(\W|$)/gi, 'tax allowing$1'], // Same in both
        [/tax enabling(\W|$)/gi, 'tax enabling$1'], // Same in both
        [/tax facilitating(\W|$)/gi, 'tax facilitating$1'], // Same in both
        [/tax helping(\W|$)/gi, 'tax helping$1'], // Same in both
        [/tax assisting(\W|$)/gi, 'tax assisting$1'], // Same in both
        [/tax supporting(\W|$)/gi, 'tax supporting$1'], // Same in both
        [/tax aiding(\W|$)/gi, 'tax aiding$1'], // Same in both
        [/tax backing(\W|$)/gi, 'tax backing$1'], // Same in both
        [/tax endorsing(\W|$)/gi, 'tax endorsing$1'], // Same in both
        [/tax advocating(\W|$)/gi, 'tax advocating$1'], // Same in both
        [/tax promoting(\W|$)/gi, 'tax promoting$1'], // Same in both
        [/tax encouraging(\W|$)/gi, 'tax encouraging$1'], // Same in both
        [/tax motivating(\W|$)/gi, 'tax motivating$1'], // Same in both
        [/tax inspiring(\W|$)/gi, 'tax inspiring$1'], // Same in both
        [/tax stimulating(\W|$)/gi, 'tax stimulating$1'], // Same in both
        [/tax exciting(\W|$)/gi, 'tax exciting$1'], // Same in both
        [/tax interesting(\W|$)/gi, 'tax interesting$1'], // Same in both
        [/tax engaging(\W|$)/gi, 'tax engaging$1'], // Same in both
        [/tax captivating(\W|$)/gi, 'tax captivating$1'], // Same in both
        [/tax fascinating(\W|$)/gi, 'tax fascinating$1'], // Same in both
        [/tax intriguing(\W|$)/gi, 'tax intriguing$1'], // Same in both
        [/tax compelling(\W|$)/gi, 'tax compelling$1'], // Same in both
        [/tax convincing(\W|$)/gi, 'tax convincing$1'], // Same in both
        [/tax persuading(\W|$)/gi, 'tax persuading$1'], // Same in both
        [/tax influencing(\W|$)/gi, 'tax influencing$1'], // Same in both
        [/tax affecting(\W|$)/gi, 'tax affecting$1'], // Same in both
        [/tax impacting(\W|$)/gi, 'tax impacting$1'], // Same in both
        [/tax changing(\W|$)/gi, 'tax changing$1'], // Same in both
        [/tax modifying(\W|$)/gi, 'tax modifying$1'], // Same in both
        [/tax altering(\W|$)/gi, 'tax altering$1'], // Same in both
        [/tax adjusting(\W|$)/gi, 'tax adjusting$1'], // Same in both
        [/tax adapting(\W|$)/gi, 'tax adapting$1'], // Same in both
        [/tax customizing(\W|$)/gi, 'tax customising$1'],
        [/tax personalizing(\W|$)/gi, 'tax personalising$1'],
        [/tax tailoring(\W|$)/gi, 'tax tailoring$1'], // Same in both
        [/tax fitting(\W|$)/gi, 'tax fitting$1'], // Same in both
        [/tax suiting(\W|$)/gi, 'tax suiting$1'], // Same in both
        [/tax matching(\W|$)/gi, 'tax matching$1'], // Same in both
        [/tax corresponding(\W|$)/gi, 'tax corresponding$1'], // Same in both
        [/tax relating(\W|$)/gi, 'tax relating$1'], // Same in both
        [/tax connecting(\W|$)/gi, 'tax connecting$1'], // Same in both
        [/tax linking(\W|$)/gi, 'tax linking$1'], // Same in both
        [/tax associating(\W|$)/gi, 'tax associating$1'], // Same in both
        [/tax affiliating(\W|$)/gi, 'tax affiliating$1'], // Same in both
        [/tax partnering(\W|$)/gi, 'tax partnering$1'], // Same in both
        [/tax collaborating(\W|$)/gi, 'tax collaborating$1'], // Same in both
        [/tax cooperating(\W|$)/gi, 'tax cooperating$1'], // Same in both
        [/tax coordinating(\W|$)/gi, 'tax coordinating$1'], // Same in both
        [/tax organizing(\W|$)/gi, 'tax organising$1'],
        [/tax arranging(\W|$)/gi, 'tax arranging$1'], // Same in both
        [/tax structuring(\W|$)/gi, 'tax structuring$1'], // Same in both
        [/tax systematizing(\W|$)/gi, 'tax systematising$1'],
        [/tax standardizing(\W|$)/gi, 'tax standardising$1'],
        [/tax normalizing(\W|$)/gi, 'tax normalising$1'],
        [/tax regularizing(\W|$)/gi, 'tax regularising$1'],
        [/tax formalizing(\W|$)/gi, 'tax formalising$1'],
        [/tax legalizing(\W|$)/gi, 'tax legalising$1'],
        [/tax legitimizing(\W|$)/gi, 'tax legitimising$1'],
        [/tax validating(\W|$)/gi, 'tax validating$1'], // Same in both
        [/tax verifying(\W|$)/gi, 'tax verifying$1'], // Same in both
        [/tax checking(\W|$)/gi, 'tax checking$1'], // Same in both
        [/tax testing(\W|$)/gi, 'tax testing$1'], // Same in both
        [/tax trying(\W|$)/gi, 'tax trying$1'], // Same in both
        [/tax attempting(\W|$)/gi, 'tax attempting$1'], // Same in both
        [/tax endeavoring(\W|$)/gi, 'tax endeavouring$1'],
        [/tax striving(\W|$)/gi, 'tax striving$1'], // Same in both
        [/tax aiming(\W|$)/gi, 'tax aiming$1'], // Same in both
        [/tax targeting(\W|$)/gi, 'tax targeting$1'], // Same in both
        [/tax focusing(\W|$)/gi, 'tax focusing$1'], // Same in both
        [/tax concentrating(\W|$)/gi, 'tax concentrating$1'], // Same in both
        [/tax centering(\W|$)/gi, 'tax centring$1'],
        [/tax directing(\W|$)/gi, 'tax directing$1'], // Same in both
        [/tax guiding(\W|$)/gi, 'tax guiding$1'], // Same in both
        [/tax leading(\W|$)/gi, 'tax leading$1'], // Same in both
        [/tax managing(\W|$)/gi, 'tax managing$1'], // Same in both
        [/tax administering(\W|$)/gi, 'tax administering$1'], // Same in both
        [/tax governing(\W|$)/gi, 'tax governing$1'], // Same in both
        [/tax controlling(\W|$)/gi, 'tax controlling$1'], // Same in both
        [/tax regulating(\W|$)/gi, 'tax regulating$1'], // Same in both
        [/tax supervising(\W|$)/gi, 'tax supervising$1'], // Same in both
        [/tax overseeing(\W|$)/gi, 'tax overseeing$1'], // Same in both
        [/tax monitoring(\W|$)/gi, 'tax monitoring$1'], // Same in both
        [/tax tracking(\W|$)/gi, 'tax tracking$1'], // Same in both
        [/tax following(\W|$)/gi, 'tax following$1'], // Same in both
        [/tax observing(\W|$)/gi, 'tax observing$1'], // Same in both
        [/tax watching(\W|$)/gi, 'tax watching$1'], // Same in both
        [/tax viewing(\W|$)/gi, 'tax viewing$1'], // Same in both
        [/tax seeing(\W|$)/gi, 'tax seeing$1'], // Same in both
        [/tax looking(\W|$)/gi, 'tax looking$1'] // Same in both
    ];
    
    // Apply all replacements
    let result = text;
    for (const [pattern, replacement] of replacements) {
        result = result.replace(pattern, replacement);
    }
    
    return result;
}

/**
 * Update attributes like placeholder, title, etc.
 */
function updateAttributes() {
    // Update attributes of elements
    const elementsWithAttributes = document.querySelectorAll('[placeholder], [title], [alt], [aria-label]');
    
    elementsWithAttributes.forEach(element => {
        // Update placeholder attribute
        if (element.hasAttribute('placeholder')) {
            const placeholder = element.getAttribute('placeholder');
            element.setAttribute('placeholder', applySpellingReplacements(placeholder));
        }
        
        // Update title attribute
        if (element.hasAttribute('title')) {
            const title = element.getAttribute('title');
            element.setAttribute('title', applySpellingReplacements(title));
        }
        
        // Update alt attribute
        if (element.hasAttribute('alt')) {
            const alt = element.getAttribute('alt');
            element.setAttribute('alt', applySpellingReplacements(alt));
        }
        
        // Update aria-label attribute
        if (element.hasAttribute('aria-label')) {
            const ariaLabel = element.getAttribute('aria-label');
            element.setAttribute('aria-label', applySpellingReplacements(ariaLabel));
        }
    });
}

/**
 * Helper function to determine if a text is in a financial context
 */
function isFinancialContext(text) {
    const financialTerms = ['bank', 'payment', 'deposit', 'money', 'cash', 'account', 'balance', 'transaction'];
    return financialTerms.some(term => text.toLowerCase().includes(term));
}

/**
 * Helper function to determine if a text is in a season context
 */
function isSeasonContext(text) {
    const seasonTerms = ['season', 'winter', 'spring', 'summer', 'autumn', 'weather', 'month', 'year'];
    return seasonTerms.some(term => text.toLowerCase().includes(term));
}

/**
 * Helper function to determine if a text is in a fuel context
 */
function isFuelContext(text) {
    const fuelTerms = ['car', 'vehicle', 'station', 'pump', 'fuel', 'tank', 'fill'];
    return fuelTerms.some(term => text.toLowerCase().includes(term));
}

/**
 * Helper function to determine if a text is in a snack context
 */
function isSnackContext(text) {
    const snackTerms = ['snack', 'food', 'eat', 'potato', 'bag', 'crisp', 'packet'];
    return snackTerms.some(term => text.toLowerCase().includes(term));
}

/**
 * Helper function to determine if a text is in an American sports context
 */
function isAmericanSportsContext(text) {
    const americanSportsTerms = ['nfl', 'quarterback', 'touchdown', 'yard', 'american', 'usa', 'states'];
    return americanSportsTerms.some(term => text.toLowerCase().includes(term));
}

/**
 * Helper function to determine if a text is in a punctuation context
 */
function isPunctuationContext(text) {
    const punctuationTerms = ['punctuation', 'grammar', 'sentence', 'end', 'mark', 'dot'];
    return punctuationTerms.some(term => text.toLowerCase().includes(term));
}
