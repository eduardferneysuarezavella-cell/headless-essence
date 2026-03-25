export type QuestionType = 'multiple-choice' | 'originals' | 'input';
export type QuestionCategory = 'PerfumeGender' | 'PerfumeBrand' | 'ScentFamily' | 'ScentIntensity' | 'LookingForSimilar';

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    question: string;
    skippable?: boolean;
    calculateResults?: boolean;
    category?: QuestionCategory;
};

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple-choice';
    maxChoices?: number;
    choices?: (string | ExtensiveChoice)[];
}

interface OriginalsQuestion extends BaseQuestion {
    type: 'originals';
}

interface InputQuestion extends BaseQuestion {
    type: 'input';
}

export type QuizProduct = typeof products[number];

export type Answers = Partial<Record<QuestionCategory, (string | ExtensiveChoice | Original)[]>>;
export type Question = MultipleChoiceQuestion | OriginalsQuestion | InputQuestion;

export type Result = { type: string, result: QuizProduct[] };
export type Results = Result[];

export const NextQuestion = 'NextQuestion';
export const Finish = 'Finish';

export interface ExtensiveChoice {
    title: string;
    value?: string;
    translationKey?: string;
    category?: QuestionCategory;
    goto?: string;
    priority?: number;
    image?: string;
}

export interface Original {
    id: number;
    essnceName: string;
    name: string;
    brand: string;
    originalMatchId: number;
    genders: string[];
}

export const originals: Original[] = [
    {
        id: 1,
        essnceName: "SMOKIN' HOT",
        brand: "Armani",
        name: "Stronger with you",
        originalMatchId: 1,
        genders: ["Herr"]
    },
    {
        id: 2,
        essnceName: "DEWY DESERT",
        brand: "Byredo",
        name: "Mojave Ghost",
        originalMatchId: 2,
        genders: ["Unisex", "Dam", "Herr"]
    },
    {
        id: 3,
        essnceName: "BACCO LE DOUX",
        brand: "Tom Ford",
        name: "Tobacco Vanille",
        originalMatchId: 3,
        genders: ["Unisex", "Herr", "Dam"]
    },
    {
        id: 4,
        essnceName: "SPICY PEPPER",
        brand: "Dior",
        name: "Sauvage",
        originalMatchId: 4,
        genders: ["Herr"]
    },
    {
        id: 5,
        essnceName: "WOODY SANDAL",
        brand: "Le Labo",
        name: "Santal 33",
        originalMatchId: 5,
        genders: ["Unisex", "Herr", "Dam"]
    },
    {
        id: 6,
        essnceName: "CHAOS KNIGHT",
        brand: "Aventus",
        name: "Creed",
        originalMatchId: 6,
        genders: ["Herr"]
    },
    {
        id: 7,
        essnceName: "INTENSE DESIRE",
        brand: "Versace",
        name: "Eros",
        originalMatchId: 7,
        genders: ["Herr"]
    },
    {
        id: 8,
        essnceName: "BLACK VELVET",
        brand: "YSL",
        name: "Black Opium",
        originalMatchId: 8,
        genders: ["Dam"]
    },
    {
        id: 9,
        essnceName: "FEMINA VIVIT",
        brand: "Armani",
        name: "Sì",
        originalMatchId: 9,
        genders: ["Dam"]
    },
    {
        id: 10,
        essnceName: "DUSTY AMBER",
        brand: "Carolina Herrera",
        name: "Good Girl",
        originalMatchId: 10,
        genders: ["Dam"]
    },
    {
        id: 11,
        essnceName: "FLEUR CHERE",
        brand: "Maison Francis Kurkdjian",
        name: "Baccarat rouge 540",
        originalMatchId: 11,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 12,
        essnceName: "PERENNE AMORE",
        brand: "Valentino Donna",
        name: "Born in Roma",
        originalMatchId: 12,
        genders: ["Dam"]
    },
    {
        id: 13,
        essnceName: "HOT MIMOSA",
        brand: "Linn Ahlborg",
        name: "Hotshot",
        originalMatchId: 13,
        genders: ["Dam"]
    },
    {
        id: 14,
        essnceName: "DELICATE JASMINE",
        brand: "Armani",
        name: "My Way",
        originalMatchId: 14,
        genders: ["Dam"]
    },
    {
        id: 15,
        essnceName: "ABSOLU VANILLA",
        brand: "Kayali",
        name: "Vanilla 28",
        originalMatchId: 15,
        genders: ["Dam"]
    },
    {
        id: 16,
        essnceName: "SASSY CLASSY",
        brand: "YSL",
        name: "Libre",
        originalMatchId: 16,
        genders: ["Dam"]
    },
    {
        id: 17,
        essnceName: "SUMMER BREEZE",
        brand: "Dolce & Gabbana",
        name: "Light Blue",
        originalMatchId: 17,
        genders: ["Dam"]
    },
    {
        id: 18,
        essnceName: "FEMINA FIORI",
        brand: "Armani",
        name: "Sì Fiori",
        originalMatchId: 18,
        genders: ["Dam"]
    },
    {
        id: 19,
        essnceName: "ICONIC FLOWER",
        brand: "Viktor & Rolf",
        name: "Flowerbomb",
        originalMatchId: 19,
        genders: ["Dam"]
    },
    {
        id: 20,
        essnceName: "WARM'N SPICY",
        brand: "Lancome",
        name: "La vie est belle",
        originalMatchId: 20,
        genders: ["Dam"]
    },
    {
        id: 21,
        essnceName: "VERY CHERRY",
        brand: "Tom Ford",
        name: "Lost Cherry",
        originalMatchId: 21,
        genders: ["Dam"]
    },
    {
        id: 22,
        essnceName: "COZY GODDESS",
        brand: "Zadig",
        name: "This is her",
        originalMatchId: 22,
        genders: ["Dam"]
    },
    {
        id: 23,
        essnceName: "ROSE ROSE",
        brand: "Chloé",
        name: "EDP Chloé",
        originalMatchId: 23,
        genders: ["Dam"]
    },
    {
        id: 24,
        essnceName: "HOTTER MIMOSA",
        brand: "Linn Ahlborg",
        name: "Hotshot But Hotter",
        originalMatchId: 24,
        genders: ["Dam"]
    },
    {
        id: 25,
        essnceName: "MIDSUMMER DREAM",
        brand: "Marc Jacobs",
        name: "Daisy",
        originalMatchId: 25,
        genders: ["Dam"]
    },
    {
        id: 26,
        essnceName: "CLEAN VIBES",
        brand: "Byredo",
        name: "Blanche",
        originalMatchId: 26,
        genders: ["Dam"]
    },
    {
        id: 27,
        essnceName: "TRES FEMME",
        brand: "Chanel",
        name: "Coco Mademoiselle",
        originalMatchId: 27,
        genders: ["Dam"]
    },
    {
        id: 28,
        essnceName: "ELLE LA NUIT",
        brand: "Jean Paul Gaultier",
        name: "Scandal",
        originalMatchId: 28,
        genders: ["Dam"]
    },
    {
        id: 29,
        essnceName: "BELLE FEMME",
        brand: "Hugo Boss",
        name: "The scent for her",
        originalMatchId: 29,
        genders: ["Dam"]
    },
    {
        id: 30,
        essnceName: "SIGNATURE VANG",
        brand: "Byredo",
        name: "Bal d'afrique",
        originalMatchId: 30,
        genders: ["Unisex", "Dam", "Herr"]
    },
    {
        id: 31,
        essnceName: "ORANGE BLOSSOM",
        brand: "Kilian",
        name: "Paris Love Don't be Shy",
        originalMatchId: 31,
        genders: ["Dam"]
    },
    {
        id: 32,
        essnceName: "SWEET CARA",
        brand: "Sol de Janeiros",
        name: "Brazilian Crush 62",
        originalMatchId: 32,
        genders: ["Dam"]
    },
    {
        id: 33,
        essnceName: "IRRESISTIBLE ENIGMA",
        brand: "Prada",
        name: "Paradoxe",
        originalMatchId: 33,
        genders: ["Dam"]
    },
    {
        id: 34,
        essnceName: "DRUNK APPLE PIE",
        brand: "Kilian",
        name: "Angel Share",
        originalMatchId: 34,
        genders: ["Unisex", "Dam", "Herr"]
    },
    {
        id: 35,
        essnceName: "BOOSY PEACH",
        brand: "Tom Ford",
        name: "Bitter Peach",
        originalMatchId: 35,
        genders: ["Dam"]
    },
    {
        id: 36,
        essnceName: "CARASHMELLOW",
        brand: "Giardini di Toscana",
        name: "Bianco Latte",
        originalMatchId: 36,
        genders: ["Dam"]
    },
    {
        id: 37,
        essnceName: "FRESHOTIC",
        brand: "Dolce & Gabbana",
        name: "L'imperatrice",
        originalMatchId: 37,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 38,
        essnceName: "LADY ESSNCE",
        brand: "Dolce & Gabbana",
        name: "The One",
        originalMatchId: 38,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 39,
        essnceName: "COCO ON THE BEACH",
        brand: "Tom Ford",
        name: "Soleil Blanc",
        originalMatchId: 39,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 40,
        essnceName: "JARDIN DE FLORA",
        brand: "Gucci",
        name: "Flora Gorgeous Gardenia",
        originalMatchId: 40,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 44,
        essnceName: "TOXIQUE",
        brand: "Marc Jacobs",
        name: "Decadence Divine",
        originalMatchId: 44,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 45,
        essnceName: "COTTON CLOUDS",
        brand: "Clean",
        name: "Warm Cotton",
        originalMatchId: 45,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 49,
        essnceName: "VANILLA SASS'",
        brand: "Burberry",
        name: "Goddess",
        originalMatchId: 49,
        genders: ["Dam", "Unisex"]
    },
    {
        id: 50,
        essnceName: "PINK HAZE",
        brand: "Juicy Couture",
        name: "Viva la Juicy",
        originalMatchId: 50,
        genders: ["Dam", "Unisex"]
    }
];

export const questions: Question[] = [
    {
        id: 'Q1',
        type: 'multiple-choice',
        question: 'quiz.questions.Q1.question',
        category: 'PerfumeGender',
        choices: [{
            title: 'Dam',
            translationKey: 'quiz.questions.Q1.choices.woman'
        }, {
            title: 'Herr',
            translationKey: 'quiz.questions.Q1.choices.man'
        }, {
            title: 'Unisex',
            translationKey: 'quiz.questions.Q1.choices.unisex'
        }]
    },
    {
        id: 'Q2',
        type: 'multiple-choice',
        question: 'quiz.questions.Q2.question',
        choices: [
            { title: 'Ja', translationKey: 'quiz.questions.Q2.choices.yes', goto: 'Q3' },
            { title: 'Nej', translationKey: 'quiz.questions.Q2.choices.no', goto: 'Q5' }
        ]
    },
    {
        id: 'Q3',
        type: 'originals',
        question: 'quiz.questions.Q3.question',
        category: 'PerfumeBrand'
    },
    {
        id: 'Q4',
        type: 'multiple-choice',
        question: 'quiz.questions.Q4.question',
        category: 'LookingForSimilar',
        choices: [
            { title: 'Ja', translationKey: 'quiz.questions.Q4.choices.yes', goto: 'Q8' },
            { title: 'Nej', translationKey: 'quiz.questions.Q4.choices.no', goto: 'Q5' }
        ],
        calculateResults: true,
    },
    {
        id: 'Q5',
        type: 'multiple-choice',
        question: 'quiz.questions.Q5.question',
        choices: [
            { title: 'Varje dag', translationKey: 'quiz.questions.Q5.choices.daily' },
            { title: 'Ibland', translationKey: 'quiz.questions.Q5.choices.sometimes' },
            { title: 'Sällan', translationKey: 'quiz.questions.Q5.choices.rarely' }
        ],
    },
    {
        id: 'Q6',
        type: 'multiple-choice',
        question: 'quiz.questions.Q6.question',
        category: 'ScentIntensity',
        choices: [
            { title: 'Subtil', translationKey: 'quiz.questions.Q6.choices.subtle', value: '1' },
            { title: 'Medel', translationKey: 'quiz.questions.Q6.choices.medium', value: '2' },
            { title: 'Stark', translationKey: 'quiz.questions.Q6.choices.strong', value: '3' }
        ]
    },
    {
        id: 'Q7',
        type: 'multiple-choice',
        question: 'quiz.questions.Q7.question',
        category: 'ScentFamily',
        maxChoices: 2,
        calculateResults: true,
        choices: [
            {
                title: 'Fräsch',
                translationKey: 'quiz.questions.Q7.choices.fresh',
                priority: 10,
                image: '/family/Fräsch.jpg'
            },
            {
                title: 'Orientalisk',
                translationKey: 'quiz.questions.Q7.choices.oriental',
                priority: 2,
                image: '/family/Orientalisk.jpg'
            },
            {
                title: 'Blommig',
                translationKey: 'quiz.questions.Q7.choices.floral',
                priority: 3,
                image: '/family/Blommig.jpg'
            },
            {
                title: 'Träig',
                translationKey: 'quiz.questions.Q7.choices.woody',
                priority: 4,
                image: '/family/Traig.jpg'
            },
            {
                title: 'Vanilj',
                translationKey: 'quiz.questions.Q7.choices.vanilla',
                priority: 6,
                image: '/family/Vanilj.jpg'
            },
            {
                title: 'Fruktig',
                translationKey: 'quiz.questions.Q7.choices.fruity',
                priority: 5,
                image: '/family/Fruktig.jpg'
            },
            {
                title: 'Söt',
                translationKey: 'quiz.questions.Q7.choices.sweet',
                priority: 6,
                image: '/family/Sot.jpg'
            },
            {
                title: 'Gourmand',
                translationKey: 'quiz.questions.Q7.choices.gourmand',
                priority: 6,
                image: '/family/Gourmand.jpg'
            }
        ]
    },
    {
        id: 'Q8',
        type: 'input',
        question: 'quiz.questions.Q8.question',
        skippable: true,
        calculateResults: true,
    }
];

export const isExtensiveChoice = (choice: string | ExtensiveChoice | Original): choice is ExtensiveChoice =>
    typeof choice === 'object' && choice !== null && 'title' in choice;

export const isMultipleChoiceQuestion = (question: Question): question is MultipleChoiceQuestion =>
    question.type === 'multiple-choice';

export const isOriginal = (choice: string | ExtensiveChoice | Original): choice is Original =>
    typeof choice === 'object' && choice !== null && 'name' in choice;

export const getQuestionValue = (choice: string | ExtensiveChoice | Original | undefined): string =>
    typeof choice !== 'undefined' ? (isExtensiveChoice(choice) ? choice.value || choice.title : isOriginal(choice) ? choice.name : choice) : '';


export function findProductsSortedByScent(products: QuizProduct[], scentName: string): QuizProduct[] {
    const productsWithScentValue = products
        .map((product): [QuizProduct, number] => {
            const scentObject = product.scent_family.find(scent => scent.hasOwnProperty(scentName));
            return [product, scentObject ? (scentObject as any)[scentName] || 0 : 0];
        })
        .filter(([, scentValue]) => scentValue > 0);

    productsWithScentValue.sort((a, b) => b[1] - a[1]);

    const sortedProducts = productsWithScentValue.map(([product]) => product);

    return sortedProducts;
}

export function getProductsFromResults(results: Results): QuizProduct[] {
    return results.flatMap((result) => result.result);
}

export function getProductFromOriginal(original: Original): QuizProduct | undefined {
    return products.find(product => parseInt(product.id) === original.originalMatchId);
}

export const products = [
    {
        "id": "1",
        "name": "SMOKIN' HOT",
        "url": "https://essnce.se/products/smokin-hot",
        "image": "https://essnce.se/cdn/shop/files/10.png",
        "text": "Smokin' hot är kryddig i toppen, aromatisk i hjärtat och i botten varm vanilj i kombination med cederträ och amber",
        "sex": ["Herr"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Orientalisk": 10
            },
            {
                "Träig": 10
            }
        ]
    },
    {
        "id": "2",
        "name": "DEWY DESERT",
        "url": "https://essnce.se/products/dewy-desert",
        "image": "https://essnce.se/cdn/shop/files/34.png",
        "text": "Det är en muskig, soapy clean doft som också är väl balanserad av blomnoter som magnolia och viol",
        "sex": ["Unisex", "Dam", "Herr"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 97
            },
            {
                "Orientalisk": 10
            }
        ]
    },
    {
        "id": "3",
        "name": "BACCO LE DOUX",
        "url": "https://essnce.se/products/bacco-le-doux",
        "image": "https://essnce.se/cdn/shop/files/43.png",
        "text": "Noter av tobak och vanilj träder verkligen fram i denna unisex doft",
        "sex": ["Unisex", "Herr", "Dam"],
        "intensity": ["3"],
        "scent_family": [
            {
                "Orientalisk": 10
            },
            {
                "Vanilj": 50
            }
        ]
    },
    {
        "id": "4",
        "name": "SPICY PEPPER",
        "url": "https://essnce.se/products/spicy-pepper",
        "image": "https://essnce.se/cdn/shop/files/9.png",
        "sex": ["Herr"],
        "text": "Den har en fräschhet från bergamott, kryddighet från peppar och rosépeppar och vetiver ger den en läderartad rökighet.",
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 5
            },
            {
                "Orientalisk": 10
            }
        ]
    },
    {
        "id": "5",
        "name": "WOODY SANDAL",
        "url": "https://essnce.se/products/woody-sandal",
        "image": "https://essnce.se/cdn/shop/files/2_9118e820-f997-4379-a63a-a07d0f92d4c4.png",
        "sex": ["Unisex", "Herr", "Dam"],
        "text": "Det är en varm, träig och sensuell doft.",
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Träig": 98
            }
        ]
    },
    {
        "id": "6",
        "name": "CHAOS KNIGHT",
        "url": "https://essnce.se/products/chaos-knight",
        "image": "https://essnce.se/cdn/shop/files/38.png",
        "text": "Noterna byggs upp av äpple, svartvinbär, ananas, bergamott, jasmin, enbär och patchouli som ger en fruktig och fräsch öppning.",
        "sex": ["Herr"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 5
            },
            {
                "Fruktig": 5
            }
        ]
    },
    {
        "id": "7",
        "name": "INTENSE DESIRE",
        "url": "https://essnce.se/products/intense-desire",
        "image": "https://essnce.se/cdn/shop/files/22.png",
        "text": "Doften inleder med livfulla noter av äpple, mynta och citron som sedan följs av de mer komplexa och djupa noterna av cederträ, vetiver, ekmossa och amber.",
        "sex": ["Herr"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 5
            },
            {
                "Fruktig": 5
            }
        ]
    },
    {
        "id": "8",
        "name": "BLACK VELVET",
        "url": "https://essnce.se/products/black-velvet",
        "image": "https://essnce.se/cdn/shop/files/41.png",
        "text": "Vår absoluta bästsäljare och vi förstår varför! En doft som har både det där kryddiga och blommiga",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Orientalisk": 99
            },
            {
                "Vanilj": 50
            }
        ]
    },
    {
        "id": "9",
        "name": "FEMINA VIVIT",
        "url": "https://essnce.se/products/femina-vivit",
        "image": "https://essnce.se/cdn/shop/files/Femina_Vivit_Frilagd.png",
        "text": "Detta är en doft som är mycket populär bland kvinnor i alla åldrar och är en av våra bästsäljare!",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 10
            },
            {
                "Fruktig": 100
            }
        ]
    },
    {
        "id": "10",
        "name": "DUSTY AMBER",
        "url": "https://essnce.se/products/dusty-amber",
        "image": "https://essnce.se/cdn/shop/files/31.png",
        "text": "Det är en doft som passar till dag som natt med sina förföriska och beroendeframkallande noter",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Orientalisk": 100
            },
            {
                "Blommig": 5
            }
        ]
    },
    {
        "id": "11",
        "name": "FLEUR CHERE",
        "url": "https://essnce.se/products/fleur-chere",
        "image": "https://essnce.se/cdn/shop/files/27.png",
        "text": "Fleur Chere tar doftsinnet till en ny dimension med sött, blommigt och träigt på samma gång och är något alldeles unikt",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Söt": 5
            },
            {
                "Träig": 100
            }
        ]
    },
    {
        "id": "12",
        "name": "PERENNE AMORE",
        "url": "https://essnce.se/products/perenne-amore",
        "image": "https://essnce.se/cdn/shop/files/16.png",
        "text": "Detta är en doft som har lite av allt, den är söt, varm, träig och blommig. I toppnoterna finner man rosépeppar, svarta vinbär och bergamott",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Söt": 100
            },
            {
                "Orientalisk": 50
            }
        ]
    },
    {
        "id": "13",
        "name": "HOT MIMOSA",
        "url": "https://essnce.se/products/hot-mimosa",
        "image": "https://essnce.se/cdn/shop/files/25.png",
        "text": "Doften är förförisk och sensuell som passar dig som vill ha en riktigt självförtroende boost",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Orientalisk": 10
            },
            {
                "Blommig": 5
            }
        ]
    },
    {
        "id": "14",
        "name": "DELICATE JASMINE",
        "url": "https://essnce.se/products/delicate-jasmine",
        "image": "https://essnce.se/cdn/shop/files/33.png",
        "text": "Om du vill dofta fruktigt och sött men inte så att det blir för tungt utan ändå fräscht",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Blommig": 100
            },
            {
                "Söt": 97
            }
        ]
    },
    {
        "id": "15",
        "name": "ABSOLU VANILLA",
        "url": "https://essnce.se/products/absolu-vanilla",
        "image": "https://essnce.se/cdn/shop/files/45.png",
        "text": "Vill du dofta som en vaniljbakelse är Absolu Vanilla en parfym som du kommer älska",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Vanilj": 100
            },
            {
                "Gourmand": 100
            }
        ]
    },
    {
        "id": "16",
        "name": "SASSY CLASSY",
        "url": "https://essnce.se/products/sassy-classy",
        "image": "https://essnce.se/cdn/shop/files/13.png",
        "text": "Doften är unik med sina kontraster mellan blommighet, värme och lite kryddighet",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fruktig": 50
            },
            {
                "Orientalisk": 5
            }
        ]
    },
    {
        "id": "17",
        "name": "SUMMER BREEZE",
        "url": "https://essnce.se/products/summer-breeze",
        "image": "https://essnce.se/cdn/shop/files/7.png",
        "text": "Summer Breeze tar dig tillbaka till sommaren, det kristallklara vattnet och citrusfrukter",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 100
            }
        ]
    },
    {
        "id": "18",
        "name": "FEMINA FIORI",
        "url": "https://essnce.se/products/femina-fiori",
        "image": "https://essnce.se/cdn/shop/files/30.png",
        "text": "Denna doft lägger sig behagligt på huden och är en mer vanilj:ig version av Femina Vivit som utstrålar ljusa och fräscha toppnoter samt fylliga hjärtnoter av apelsinblomma som sprider ut sig på den fina, feminina huden",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Söt": 10
            },
            {
                "Blommig": 5
            }
        ]
    },
    {
        "id": "19",
        "name": "ICONIC FLOWER",
        "url": "https://essnce.se/products/iconic-flower",
        "image": "https://essnce.se/cdn/shop/files/23.png",
        "text": "En doft som är blommig, men som med sina basnoter blir mjuk och ungdomlig",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Blommig": 50
            },
            {
                "Söt": 97
            }
        ]
    },
    {
        "id": "20",
        "name": "WARM'N SPICY",
        "url": "https://essnce.se/products/warmn-spicy",
        "image": "https://essnce.se/cdn/shop/files/1.png",
        "text": "En doft som är blommig, men som med sina basnoter blir mjuk och ungdomlig.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Orientalisk": 5
            },
            {
                "Fruktig": 50
            }
        ]
    },
    {
        "id": "21",
        "name": "VERY CHERRY",
        "url": "https://essnce.se/products/very-cherry",
        "image": "https://essnce.se/cdn/shop/files/4.png",
        "text": "Doften är lekfull och har en stark godisliknande körsbärsdoft i toppen.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Orientalisk": 10
            },
            {
                "Blommig": 5
            }
        ]
    },
    {
        "id": "22",
        "name": "COZY GODDESS",
        "url": "https://essnce.se/products/cozy-godness",
        "image": "https://essnce.se/cdn/shop/files/35.png",
        "text": "Doften har en rik krämig vanilj, med en hint av peppar och sandelträ i bakgruden för att ge doften struktur och djup.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Orientalisk": 5
            },
            {
                "Vanilj": 96
            }
        ]
    },
    {
        "id": "23",
        "name": "ROSE ROSE",
        "url": "https://essnce.se/products/rose-rose",
        "image": "https://essnce.se/cdn/shop/files/14.png",
        "text": "Rose rose betyder rosa ros på franska och det är just vad denna parfym doftar.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Blommig": 10
            },
            {
                "Fräsch": 5
            }
        ]
    },
    {
        "id": "24",
        "name": "HOTTER MIMOSA",
        "url": "https://essnce.se/products/hotter-mimosa",
        "image": "https://essnce.se/cdn/shop/files/24.png",
        "text": "Det är en varm och stilren doft samtidigt som den är elegant och exklusiv.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fruktig": 98
            },
            {
                "Söt": 5
            }
        ]
    },
    {
        "id": "25",
        "name": "MIDSUMMER DREAM",
        "url": "https://essnce.se/products/midsummer-dream",
        "image": "https://essnce.se/cdn/shop/files/17.png",
        "text": "Denna doft har en harmonisk balans av fräschör, fruktighet och blommighet.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 99
            },
            {
                "Fruktig": 5
            }
        ]
    },
    {
        "id": "26",
        "name": "CLEAN VIBES",
        "url": "https://essnce.se/products/clean-vibes",
        "image": "https://essnce.se/cdn/shop/files/39.png",
        "text": "Clean Vibes är den parfym som kommer att få dig utstråla subtil lyx.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 10
            },
            {
                "Blommig": 5
            }
        ]
    },
    {
        "id": "27",
        "name": "TRES FEMME",
        "url": "https://essnce.se/products/tres-femme",
        "image": "https://essnce.se/cdn/shop/files/6.png",
        "text": "En mångsidig och mogen doft för dag som natt med noter som kan beskrivas som ikoniska, romantiska och förföriska.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Blommig": 10
            },
            {
                "Fräsch": 5
            }
        ]
    },
    {
        "id": "28",
        "name": "ELLE LA NUIT",
        "url": "https://essnce.se/products/elle-la-nuit",
        "image": "https://essnce.se/cdn/shop/files/29.png",
        "text": "En statement doft som fångar uppmärksamhet och utstrålar en elegant och sensuell energi.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Söt": 10
            },
            {
                "Blommig": 50
            }
        ]
    },
    {
        "id": "29",
        "name": "BELLE FEMME",
        "url": "https://essnce.se/products/belle-femme",
        "image": "https://essnce.se/cdn/shop/files/42.png",
        "text": "Doften öppnar med noter av saftiga persikor och freesia blommor.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Söt": 98
            },
            {
                "Fruktig": 5
            }
        ]
    },
    {
        "id": "30",
        "name": "SIGNATURE VANG",
        "url": "https://essnce.se/products/signature-vang",
        "image": "https://essnce.se/cdn/shop/files/12.png",
        "text": "Denna doft är unisex och öppnar med en fräschhet av citrus i toppnoterna.",
        "sex": ["Unisex", "Dam", "Herr"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fräsch": 98
            },
            {
                "Träig": 99
            }
        ]
    },
    {
        "id": "31",
        "name": "ORANGE BLOSSOM",
        "url": "https://essnce.se/products/orange-blossom",
        "image": "https://essnce.se/cdn/shop/files/15.png",
        "text": "Vill du dofta marshmallow-sött och pudrigt på ett sensuellt sätt? Då måste du testa Orange Blossom.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Blommig": 5
            },
            {
                "Gourmand": 97
            }
        ]
    },
    {
        "id": "32",
        "name": "SWEET CARA",
        "url": "https://essnce.se/collections/alla-parfymer/products/sweet-cara",
        "image": "https://essnce.se/cdn/shop/files/8.png",
        "text": "Denna parfym är en ljuvlig och förförisk doft som för tankarna till en solig dag på en sommarstrand.",
        "sex": ["Dam"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Söt": 10
            },
            {
                "Blommig": 6
            }
        ]
    },
    {
        "id": "33",
        "name": "IRRESISTIBLE ENIGMA",
        "url": "https://essnce.se/products/irresistible-enigma",
        "image": "https://essnce.se/cdn/shop/files/Irresistible_Enigma_Frilagd.png",
        "text": "Denna doft bjuder på en livfull värme och är intensiv men ändå subtil.",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Fräsch": 10
            },
            {
                "Blommig": 97
            }
        ]
    },
    {
        "id": "34",
        "name": "DRUNK APPLE PIE",
        "url": "https://essnce.se/collections/alla-parfymer/products/drunk-apple-pie",
        "image": "https://essnce.se/cdn/shop/files/Drunk_Apple_Pie_Frilagd.png",
        "text": "Denna doft är av äkta gourmand karaktär som ger ett varmt och mysigt uttryck.",
        "sex": ["Unisex", "Dam", "Herr"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Gourmand": 98
            },
            {
                "Orientalisk": 98
            }
        ]
    },
    {
        "id": "35",
        "name": "BOOSY PEACH",
        "url": "https://essnce.se/collections/alla-parfymer/products/boosy-peach",
        "image": "https://essnce.se/cdn/shop/files/40.png",
        "text": "Du som bär denna doft har en aura av sofistikerad glamour, lyx och elegans.",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Orientalisk": 10
            },
            {
                "Gourmand": 10
            }
        ]
    },
    {
        "id": "36",
        "name": "CARASHMELLOW",
        "url": "https://essnce.se/products/carashmellow",
        "image": "https://essnce.se/cdn/shop/files/Carashmellow_Frilagd.png",
        "text": "Du som bär denna doft har en aura av sofistikerad glamour, lyx och elegans.",
        "sex": ["Dam"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Vanilj": 99
            },
            {
                "Gourmand": 99
            }
        ]
    },
    {
        "id": "37",
        "name": "FRESHOTIC",
        "url": "https://essnce.se/products/freshotic",
        "image": "https://essnce.se/cdn/shop/files/26.png",
        "text": "Freshotic upplevs som en lätt, fruktig doft som är unik i sin enkelhet.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Fruktig": 80
            },
            {
                "Blommig": 80
            }
        ]
    },
    {
        "id": "38",
        "name": "LADY ESSNCE",
        "url": "https://essnce.se/products/lady-essnce",
        "image": "https://essnce.se/cdn/shop/files/ProduktbilderWebSize_3.jpg",
        "text": "Den kan beskrivas som mogen utan att vara tantig och balanserar fruktighet med vita blommor, varm vanilj och pudrig mysk.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Vanilj": 80
            },
            {
                "Fruktig": 80
            }
        ]
    },
    {
        "id": "39",
        "name": "COCO ON THE BEACH",
        "url": "https://essnce.se/products/coco-on-the-beach",
        "image": "https://essnce.se/cdn/shop/files/36.png",
        "text": "Coco on the Beach för tankarna till en tropisk atmosfär vid havet där sommaren varar året om.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Orientalisk": 100
            },
            {
                "Blommig": 50
            }
        ]
    },
    {
        "id": "40",
        "name": "Jardin De flora",
        "url": "https://essnce.se/products/jardin-de-flora",
        "image": "https://essnce.se/cdn/shop/files/19.png",
        "text": "Om du gillar söta, blommiga och fruktiga dofter så är Jardin de Flora något för dig!",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Blommig": 99
            },
            {
                "Söt": 50
            }
        ]
    },
    {
        "id": "41",
        "name": "I am Vanilla",
        "url": "https://essnce.se/products/i-am-vanilla",
        "image": "https://essnce.se/cdn/shop/files/I_am_Vanilla_Frilagd.png",
        "text": "Tänk dig en nybakad jordgubbstårta med massa vaniljkräm - där har du doften av I Am Vanilla!",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Vanilj": 95
            },
            {
                "Söt": 50
            }
        ]
    },
    {
        "id": "42",
        "name": "Milky Flower",
        "url": "https://essnce.se/products/milky-flower",
        "image": "https://essnce.se/cdn/shop/files/Milky_Flower_Frilagd.png",
        "text": "Milky Flower är en unik fusion av vita blommor, mjuk mjölk och träigt djup.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Blommig": 50
            },
            {
                "Träig": 99
            }
        ]
    },
    {
        "id": "43",
        "name": "Keep it fruity",
        "url": "https://essnce.se/products/keep-it-fruity",
        "image": "https://essnce.se/cdn/shop/files/Keep_It_Fruity_Frilagd.png",
        "text": "Keep it Fruity är en sprudlande doft sprängfylld av fruktiga och blommiga noter.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Fruktig": 97
            },
            {
                "Blommig": 50
            }
        ]
    },
    {
        "id": "44",
        "name": "Toxique",
        "url": "https://essnce.se/products/toxique",
        "image": "https://essnce.se/cdn/shop/files/Toxique_frilagd.png",
        "text": "Magisk och mystisk - Toxique är en sexig, söt och sofistikerad doft som står ut i mängden!",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Blommig": 50
            },
            {
                "Orientalisk": 98
            }
        ]
    },
    {
        "id": "45",
        "name": "Cotton Clouds",
        "url": "https://essnce.se/products/cotton-clouds",
        "image": "https://essnce.se/cdn/shop/files/37.png",
        "text": "Cotton Clouds är definitionen av ren, fräsch och clean! Denna doft passar perfekt för dig som letar efter just den där nytvättade känslan.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Fräsch": 97
            },
            {
                "Blommig": 50
            }
        ]
    },
    {
        "id": "49",
        "name": "Vanilla Sass'",
        "url": "https://essnce.se/products/vanilla-sass",
        "image": "https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Vanilla_Sass.png?v=1728897362",
        "text": "Vanilla Sass' är kvinnlig, elegant och krämig! En välkomponerad doft där ingenting är för mycket eller för lite.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["1", "2"],
        "scent_family": [
            {
                "Vanilj": 97
            },
            {
                "Söt": 99
            }
        ]
    },
    {
        "id": "50",
        "name": "Pink Haze",
        "url": "https://essnce.se/products/pink-haze",
        "image": "https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Pink_haze.png?v=1729748644",
        "text": "Flirty and fun - där har du Pink Haze! Denna explosion av söta noter ger en sprudlande men samtidigt sexig doft.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Fruktig": 99
            },
            {
                "Blommig": 98
            }
        ]
    },
    {
        "id": "51",
        "name": "Noble Eclat",
        "url": "https://essnce.se/products/noble-eclat",
        "image": "https://essnce.se/cdn/shop/files/Noble_eclat.png",
        "text": "Noble Eclat är vår perfekta cold weather scent! Denna unisexparfym är en varm och söt doft som balanserar kryddighet med maskulina inslag.",
        "sex": ["Herr", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Vanilj": 90
            },
            {
                "Orientalisk": 50
            }
        ]
    },
    {
        "id": "52",
        "name": "Suit & Tie",
        "url": "https://essnce.se/products/suit-tie",
        "image": "https://essnce.se/cdn/shop/files/Suit___tie_fran_ESSNCE.png",
        "text": "Lika klassiskt och maskulint som svart kostym och slips doftar Suit & Tie! En os av lyx blandas med exklusiv iris och varma tränoter.",
        "sex": ["Herr", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Träig": 96
            },
            {
                "Blommig": 50
            }
        ]
    },
    {
        "id": "53",
        "name": "Oh Darling",
        "url": "https://essnce.se/products/oh-darling",
        "image": "https://essnce.se/cdn/shop/files/Oh_Darling.png",
        "text": "Oh Darling är en förtrollande, feminin och söt doft! Saftiga hallon, blandas med pudrig ros, frisk citron och fördjupas med en touch av vanilj samt mysk.",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Blommig": 96
            },
            {
                "Fruktig": 96
            }
        ]
    },
    {
        "id": "54",
        "name": "Skyfall Mystery",
        "url": "https://essnce.se/products/skyfall-mystery",
        "image": "https://essnce.se/cdn/shop/files/Skyfall_Mystery.png",
        "text": "Skyfall Mystery på ett kontrastspel mellan mörkt och ljust, djupt och lent. Förbered näsan på nya doftdimensioner!",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Träig": 95
            },
            {
                "Orientalisk": 97
            }
        ]
    },
    {
        "id": "55",
        "name": "Vanilla Baby",
        "url": "https://essnce.se/products/vanilla-baby",
        "image": "https://essnce.se/cdn/shop/files/VanillaBaby.png",
        "text": "Vanilla Baby är den perfekta blandningen av värme, sötma och sensualitet – en krämig vaniljklassiker som är oemotståndlig!",
        "sex": ["Dam", "Unisex"],
        "intensity": ["2", "3"],
        "scent_family": [
            {
                "Vanilj": 98
            },
            {
                "Orientalisk": 96
            }
        ]
    }
]
