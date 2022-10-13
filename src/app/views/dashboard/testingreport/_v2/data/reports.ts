import { ColumnModel } from "../models/ColumnModel";
import { RowModel } from "../models/RowModel";
import { TestReportPro } from "../models/TestReportPro";
import { MANUFACTURERS } from "./dropdowns";
const column1: ColumnModel[] = [
    new ColumnModel('', 'D 702', 'Text', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', 'VERSION 12', 'Text', []),
    new ColumnModel('', '04/04/2022', 'Text', []),
]
const column5: ColumnModel[] = [
    new ColumnModel('CERT NO: ', 'GTIR(GEN)', 'Text', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('INSPECTION DATE: ', '04/04/2022', 'Date', []),
    new ColumnModel('NEXT INSPECTION DATE: ', '04/04/2022', 'Date', []),
]
const column6: ColumnModel[] = [
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('TIME OF TEST- START: ', '10:00', 'Time', []),
    new ColumnModel('END', '10:00', 'Time', []),
]
const column7: ColumnModel[] = [
    new ColumnModel('CLIENT NAME:', '', '', []),
    new ColumnModel('', 'TRENT COMPRESSORS', 'Text', []),
    new ColumnModel('USERS NAME: ', '', '', []),
    new ColumnModel('', 'JOHN@TRENTCOMPRESSORS.CO.ZA', 'Text', []),
]
const column8: ColumnModel[] = [
    new ColumnModel('VESSEL DESCRIPTION:', '', '', []),
    new ColumnModel('', '', 'Text', []),
    new ColumnModel('VERTICAL:', '', 'Text', []),
    new ColumnModel('HORIZONTAL:', '', 'Text', []),

]
const column9: ColumnModel[] = [
    new ColumnModel('2. DATA PLATE VERIFICATION:', '', '', ['heading']),
    new ColumnModel('', 'PRE-VUP (PRIOR TO 23/10/1992)', 'Select', [], ['PRE-VUP (PRIOR TO 23/10/1992)', 'VUP (23/10/1992 - 30/09/2009)', 'PER (01/10/2009 - PRESENT)'])
]
const column10: ColumnModel[] = [
    new ColumnModel('MANUFACTURER:', '', '', []),
    new ColumnModel('', 'EURE', 'Select', [], MANUFACTURERS)
];

const column11: ColumnModel[] = [
    new ColumnModel('COUNTRY OF ORIGIN:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column12: ColumnModel[] = [
    new ColumnModel('YEAR OF MANUFACTURE:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column13: ColumnModel[] = [
    new ColumnModel('CAPACITY:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column14: ColumnModel[] = [
    new ColumnModel('SERIAL NO:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column15: ColumnModel[] = [
    new ColumnModel('UNIQUE MARK OF AIA:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column16: ColumnModel[] = [
    new ColumnModel('NAME, NUMBER AND DATE OF STANDARD OF DESIGN:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column17: ColumnModel[] = [
    new ColumnModel('OPERATING TEMPERATURE:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column18: ColumnModel[] = [
    new ColumnModel('MIN TEMP: ', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column19: ColumnModel[] = [
    new ColumnModel('MAX TEMP:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column20: ColumnModel[] = [
    new ColumnModel('HAZARD CATEGORY:', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column21: ColumnModel[] = [
    new ColumnModel('DESIGN PRESSURE (DP): ', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];
const column22: ColumnModel[] = [
    new ColumnModel('MAXIMUM WORKING PRESSURE: ', '', '', []),
    new ColumnModel('', '', 'Text', [], [])

];

const column23: ColumnModel[] = [
    new ColumnModel('ACCEPTABLE NAME/DATA PLATE TYPE?', '', '', ['']),
    new ColumnModel('', 'Yes', 'Select', [], ['Yes', 'No'])
]


const column24: ColumnModel[] = [
    new ColumnModel('1. PRE-INSPECTION PREPARATION', '', '', ['heading']),
]

const column25: ColumnModel[] = [
    new ColumnModel('1.1 CERTIFICATE OF MANUFACTURE VIEWED', '', '', ['']),
    new ColumnModel('', 'Yes', 'Select', [], ['Yes', 'No'])
]

const column26: ColumnModel[] = [
    new ColumnModel('1.2 PREVIOUS INSPECTION HISTORY BEEN VIEWED?', '', '', ['']),
    new ColumnModel('', 'NO PRECOMMISSIONING REPORT AVAILABLE', 'Select', [], ['NO PRECOMMISSIONING REPORT AVAILABLE', 'FIRST TEST BY G TRENT COMPRESSORS', 'Yes'])
]
const column27: ColumnModel[] = [
    new ColumnModel('1.3 PREVIOUS INSPECTION REPORT DATE: ', '', '', ['']),
    new ColumnModel('', '', 'Date', [], [])
]


const column28: ColumnModel[] = [
    new ColumnModel('3. INSPECTION INFORMATION', '', '', ['heading']),
]

const column29: ColumnModel[] = [
    new ColumnModel('2. EXTERNAL SURFACES INSPECTED & CLEANED, INCLUDING INSULATION, FIRE PROOFING AND EARTH CABLES', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column30: ColumnModel[] = [
    new ColumnModel('3. CLEAN AND FREE FROM OIL DEPOSITS', '', '', ['']),
    new ColumnModel('', 'SLIGHT OIL DEPOSITS ALONG THE BOTTOM OF THE VESSEL', 'Select', [], [

        'SLIGHT OIL DEPOSITS ALONG THE BOTTOM OF THE VESSEL',
        'VERY SLIGHT OIL DEPOSITS ALONG THE BOTTOM OF THE VESSEL',
        'MODERATE OIL DEPOSITS ALONG THE BOTTOM OF THE VESSEL',
        'VESSEL IS AN AIR OIL SEPARATOR',
        'HEAVY OIL DEPOSITS ALONG THE BOTTOM OF THE VESSEL - CLEANED OUT',
        'SLIGHT OIL DEPOSITS ALONG THE BOTTOM OF THE SHELL',
        'SOME OIL DEPOSITS REMAIN AFTER FLUSHING',
        'SLIGHT OIL DEPOSITS ALONG THE BOTTOM AND SIDES OF THE VESSEL',
        'VERY SLIGHT OIL DEPOSITS ALONG THE BOTTOM AND LOWER SIDES OF THE VESSEL'

    ])
];

const column31: ColumnModel[] = [
    new ColumnModel('4. CLEAN AND FREE OF CHEMICALLY REACTIVE MATTERS', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column32: ColumnModel[] = [
    new ColumnModel('5. FREE FROM CORROSION', '', '', ['']),
    new ColumnModel('', 'GENERAL SURFACE RUST', 'Select', [], [
        'GENERAL SURFACE RUST',
        'GENERAL UNIFORM SURFACE RUST',
        'VERY SLIGHT GENERAL SURFACE RUST ALONG BOTTOM OF VESSEL',
        'GENERAL SURFACE RUST ON ALL INTERNAL SEAMS AND SURFACES',
        'GENERAL UNIFORM RUST',
        'UNIFORM GENERAL SURFACE RUST ON ALL INTERNAL SEAMS AND SURFACES',
        'GENERAL SURFACE RUST ON ALL INTERNAL SURFACES WORSENING ALONG THE BOTTOM OF THE VESSEL',
        'SLIGHT GENERAL SURFACE RUST'

    ])
];

const column33: ColumnModel[] = [
    new ColumnModel('6. INTERNAL SURFACES & SEAMS INSPECTED & CLEANED', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column34: ColumnModel[] = [
    new ColumnModel('7. FREE FROM DEFORMATION', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column35: ColumnModel[] = [
    new ColumnModel('8. FREE FROM PITTING', '', '', ['']),
    new ColumnModel('', 'SLIGHT PITTING ALONG THE BOTTOM OF THE VESSEL', 'Select', [], [
        'SLIGHT PITTING ALONG THE BOTTOM OF THE VESSEL',
        'VERY SLIGHT PITTING ALONG THE BOTTOM OF THE VESSEL',
        'MODERATE PITTING ALONG THE BOTTOM OF THE VESSEL'

    ])
];

const column36: ColumnModel[] = [
    new ColumnModel('9. PAINT CONDITION ACCEPTABLE, NO FLAKING?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column37: ColumnModel[] = [
    new ColumnModel('10. ATTACHMENTS SECURE?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column38: ColumnModel[] = [
    new ColumnModel('11. PIPING SECURE WITH NO VISIBLE DAMAGE? ', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];


const column39: ColumnModel[] = [
    new ColumnModel('4 SAFETY ACCESSORY VERIFICATION', '', '', ['heading']),
]


const column40: ColumnModel[] = [
    new ColumnModel('13. CORRECT RANGE GAUGE INSTALLED WITH RED MARK ON DIAL?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'YES AND REPLACED', 'NO', 'N/A', 'OTHER'])
];
const column41: ColumnModel[] = [
    new ColumnModel('14. SAFETY VALVE OPERATION CHECKED, LOCKED OR SEALED', '', '', ['']),
    new ColumnModel('', 'REPLACED AND SET AT? YES SEALED AND SET AT', 'Select', [], [
        'REPLACED AND SET AT? YES SEALED AND SET AT',
        'YES LOCKED AND SET AT',
        'YES REPLACED, SEALED  AND SET AT',
        'YES REPLACED, LOCKED AND SET AT'
    ], '', '', true, 'KPA')
];

const column42: ColumnModel[] = [
    new ColumnModel('15. STOP VALVE FITTED?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'YES AND REPLACED', 'NO', 'N/A', 'OTHER'])
];

const column43: ColumnModel[] = [
    new ColumnModel('16. DRAIN VALVE FITTED AND CHECKED?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'YES AND REPLACED', 'NO', 'N/A', 'OTHER'])
];
const column44: ColumnModel[] = [
    new ColumnModel('17. AUTOMATIC CONTROLS AND INDICATORS CONDITION/EFFICIENCY  CHECKED?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'YES AND REPLACED', 'NO', 'N/A', 'OTHER'])
];


const column45: ColumnModel[] = [
    new ColumnModel('5 WALL THICKNESS TESTING: ', '', '', ['heading']),
    new ColumnModel('SHELL MIN', '', 'Text', [], [], '', '', false, 'MM'),
    new ColumnModel('SHELL MAX', '', 'Text', [], [], '', '', false, 'MM'),
    new ColumnModel('', '', '', []),

]
const column46: ColumnModel[] = [
    new ColumnModel('', '', '', ['']),
    new ColumnModel('DOME MIN', '', 'Text', [], [], '', '', false, 'MM'),
    new ColumnModel('DOME MAX', '', 'Text', [], [], '', '', false, 'MM'),
    new ColumnModel('', '', '', []),

]
const column47: ColumnModel[] = [
    new ColumnModel('CML:1-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),

]
const column48: ColumnModel[] = [
    new ColumnModel('CML:2-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('INSIDE DIAMETER OF SHELL: ', '', 'Text', [], [], '', '', false, 'MM'),
    new ColumnModel('', '', '', []),

]

const column49: ColumnModel[] = [
    new ColumnModel('CML:3-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),

]

const column50: ColumnModel[] = [
    new ColumnModel('CML:4-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('MAXIMUM ALLOWABLE STRESS VALUE: ', '', 'Text', [], [], '', '', false, 'KPA'),
    new ColumnModel('', '', '', []),

]

const column51: ColumnModel[] = [
    new ColumnModel('CML:5-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),

]

const column52: ColumnModel[] = [
    new ColumnModel('CML:6-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('PICTURE OF TANK WITH COMMENTS AND ARROWS ', '', '', [], [], '', '', false, ''),
    new ColumnModel('', '', '', []),

]

const column53: ColumnModel[] = [
    new ColumnModel('CML:7-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),

]


const column54: ColumnModel[] = [
    new ColumnModel('CML:8-', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),

]


const column55: ColumnModel[] = [
    new ColumnModel('6 TEST INFORMATION:', '', '', ['heading']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])

]


const column56: ColumnModel[] = [
    new ColumnModel('TEST PRESSURE GAUGE S/N: ', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('TEST PUMP: ', '', 'Text', ['']),
    new ColumnModel('', '', '', []),

]
const column57: ColumnModel[] = [
    new ColumnModel('TEST TEMPERATURE GAUGE S/N:', '', 'Text', ['']),
    new ColumnModel('', '', '', []),
    new ColumnModel('THICKNESS TESTER: ', '', 'Text', ['']),
    new ColumnModel('', '', '', []),

]
const column58: ColumnModel[] = [
    new ColumnModel('a) TEST TYPE', '', '', ['']),
    new ColumnModel('', 'HYDRAULIC', 'Select', [], ['HYDRAULIC', 'PNEUMATIC']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];

const column59: ColumnModel[] = [
    new ColumnModel('b) TEST DURATION:', '', '', ['']),
    new ColumnModel('', '20 MIN', 'Select', [], ['20 MIN', 'OTHER']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];
const column60: ColumnModel[] = [
    new ColumnModel('c) TEST MEDIUM', '', '', ['']),
    new ColumnModel('', 'WATER', 'Select', [], ['WATER', 'AIR', 'OTHER']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];
const column61: ColumnModel[] = [
    new ColumnModel('d) TEST POSITION', '', '', ['']),
    new ColumnModel('', 'VERTICAL', 'Select', [], ['VERTICAL', 'HORIZONTAL']),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];
const column62: ColumnModel[] = [
    new ColumnModel('e) TEST PRESSURE', '', '', ['']),
    new ColumnModel('', '', 'Text', [], [], '', '', false, 'KPA (DP X 1.25)'),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];
const column63: ColumnModel[] = [
    new ColumnModel('f) METAL/WATER TEMPERATURE: ', '', '', ['']),
    new ColumnModel('', '', 'Text', [], [], '', '', false, ' °C'),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];

const column64: ColumnModel[] = [
    new ColumnModel('ZEROING OF TEST GAUGE WAS VERIFIED BY THE CP UPON COMPLETION OF VENTING', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column65: ColumnModel[] = [
    new ColumnModel('TEST PRESSURE GAUGE INSTALLED AT THE HIGHEST POINT ON THE VESSEL? ', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column66: ColumnModel[] = [
    new ColumnModel('19. ARE ALL WELDS & SURFACES, CHECKED UNDER PRESSURE, SATISFACTORY?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column67: ColumnModel[] = [
    new ColumnModel('20. WERE ANY LEAKS DETECTED? ', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column68: ColumnModel[] = [
    new ColumnModel('21. WERE OTHER DEFECTS DETECTED?', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column69: ColumnModel[] = [
    new ColumnModel('22. WAS THE ACCESS/EXIT SAFE & UNOBSTRUCTED? ', '', '', ['']),
    new ColumnModel('', 'YES', 'Select', [], ['YES', 'NO', 'N/A', 'OTHER'])
];

const column70: ColumnModel[] = [
    new ColumnModel('OTHER COMMENTS/OBSERVATIONS', '', '', ['']),
    new ColumnModel('', '', 'Notes', [], [])
];

const column71: ColumnModel[] = [
    new ColumnModel('SIGNATURE: ', '', '', ['']),
    new ColumnModel('', '', 'Text', [], [], '', '', false, ' '),
];
const column72: ColumnModel[] = [
    new ColumnModel('NAME (PRINT): ', '', 'Text', ['']),
    new ColumnModel('Date', '', 'Date', [], [], '', '', false, ' ')
];
const column73: ColumnModel[] = [
    new ColumnModel('INSPECTOR: ', '', '', ['']),
    new ColumnModel('', '', 'Text', [], [], '', '', false, ' '),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];
const column74: ColumnModel[] = [
    new ColumnModel('NAME: ', '', '', ['']),
    new ColumnModel('', 'GM TRENT', 'Text', [], [], '', '', false, ' '),
    new ColumnModel('SIGNATURE:', '', '', []),
    new ColumnModel('', '', 'Text', [])
];
const column75: ColumnModel[] = [
    new ColumnModel('SAQCC CPPV CERT NO:: ', '', '', ['']),
    new ColumnModel('', 'PV: 210', 'Text', [], [], '', '', false, ' '),
    new ColumnModel('', '', '', []),
    new ColumnModel('', '', '', [])
];

const rows: RowModel[] = [
    new RowModel(column1, ['grid-4']),  // row 1
    new RowModel([new ColumnModel('', '', '', [])], ['grid-1']),  // row 2
    new RowModel([new ColumnModel('', '', '', [])], ['grid-1']),  // row 3
    new RowModel([new ColumnModel('', 'PRESSURE VESSEL STATUTORY  INSPECTION REPORT', 'h1', ['h1'])], ['grid-1']),  // row 4
    new RowModel(column5, ['grid-4']), // row 5
    new RowModel(column6, ['grid-4']), // row 6
    new RowModel(column7, ['grid-4']), // row 7
    new RowModel([new ColumnModel('VESSEL LOCATION:', '', '', []),new ColumnModel('', '', 'Text', [])], ['grid-4']),  // row 8
    new RowModel(column8, ['grid-4']),  // row 8
    new RowModel(column9, ['grid-25-75']),  // row 9
    new RowModel(column10, ['grid-25-75']),  // row 10
    new RowModel(column11, ['grid-25-75']),  // row 11
    new RowModel(column12, ['grid-25-75']),  // row 12
    new RowModel(column13, ['grid-25-75']),  // row 12
    new RowModel(column14, ['grid-25-75']),  // row 12
    new RowModel(column15, ['grid-25-75']),  // row 12
    new RowModel(column16, ['grid-25-75']),  // row 12
    new RowModel(column17, ['grid-25-75']),  // row 12
    new RowModel(column18, ['grid-25-75']),  // row 12
    new RowModel(column19, ['grid-25-75']),  // row 12
    new RowModel(column20, ['grid-25-75']),  // row 12
    new RowModel(column21, ['grid-25-75']),  // row 12
    new RowModel(column22, ['grid-25-75']),  // row 12
    new RowModel(column23, ['grid-25-75']),  // row 12
    new RowModel(column24, ['grid-1']),  // row 12
    new RowModel(column25, ['grid-25-75']),  // row 12
    new RowModel(column26, ['grid-25-75']),  // row 12
    new RowModel(column27, ['grid-25-75']),  // row 12
    new RowModel(column29, ['grid-25-75']),  // row 12
    new RowModel(column30, ['grid-25-75']),  // row 12
    new RowModel(column31, ['grid-25-75']),  // row 12
    new RowModel(column32, ['grid-25-75']),  // row 12
    new RowModel(column33, ['grid-25-75']),  // row 12
    new RowModel(column34, ['grid-25-75']),  // row 12
    new RowModel(column35, ['grid-25-75']),  // row 12
    new RowModel(column36, ['grid-25-75']),  // row 12
    new RowModel(column37, ['grid-25-75']),  // row 12
    new RowModel(column38, ['grid-25-75']),  // row 12
    new RowModel(column39, ['grid-1']),  // row 12
    new RowModel(column40, ['grid-25-75']),  // row 12
    new RowModel(column41, ['grid-25-75']),  // row 12
    new RowModel(column42, ['grid-25-75']),  // row 12
    new RowModel(column43, ['grid-25-75']),  // row 12
    new RowModel(column44, ['grid-25-75']),  // row 12
    new RowModel(column45, ['grid-4']),  // row 8
    new RowModel(column46, ['grid-4']),  // row 8
    new RowModel(column47, ['grid-4']),  // row 8
    new RowModel(column48, ['grid-4']),  // row 8
    new RowModel(column49, ['grid-4']),  // row 8
    new RowModel(column50, ['grid-4']),  // row 8
    new RowModel(column51, ['grid-4']),  // row 8
    new RowModel(column52, ['grid-4']),  // row 8
    new RowModel(column53, ['grid-4']),  // row 8
    new RowModel(column54, ['grid-4']),  // row 8
    new RowModel(column55, ['grid-4']),  // row 8
    new RowModel(column56, ['grid-4']),  // row 8
    new RowModel(column57, ['grid-4']),  // row 8
    new RowModel(column58, ['grid-4']),  // row 8
    new RowModel(column59, ['grid-4']),  // row 8
    new RowModel(column60, ['grid-4']),  // row 8
    new RowModel(column61, ['grid-4']),  // row 8
    new RowModel(column62, ['grid-4']),  // row 8
    new RowModel(column63, ['grid-4']),  // row 8
    new RowModel(column64, ['grid-25-75']),  // row 8
    new RowModel(column65, ['grid-25-75']),  // row 8
    new RowModel(column66, ['grid-25-75']),  // row 8
    new RowModel(column67, ['grid-25-75']),  // row 8
    new RowModel(column68, ['grid-25-75']),  // row 8
    new RowModel(column69, ['grid-25-75']),  // row 8
    new RowModel(column70, ['grid-25-75']),  // row 8


    new RowModel([new ColumnModel('', 'User:', 'h1', ['b'])], ['grid-1']),  // row 4


    new RowModel([new ColumnModel('',
        `WE APPOINT G TRENT COMPRESSOR SERVICES TRUST (REPRESENTED BY THE 
        COMPETENT PERSON AS SIGNATORY TO THIS REPORT) AS THE IN-SERVICE
        INSPECTION AUTHORITY FOR THIS PRESSURE VESSEL. WE CONFIRM THAT 
        WE HAVE BEEN ADVISED OF ALL WEAKNESSES AND DEFECTS. :`, 'h1', [''])], ['grid-1']),  // row 4


    new RowModel([new ColumnModel('', '', 'h1', ['h1'])], ['grid-1']),  // Blank line
    new RowModel(column71, ['grid-25-75']),  // row 8
    new RowModel(column72, ['grid-25-75']),  // row 8
    new RowModel([new ColumnModel('', '', 'h1', ['h1'])], ['grid-1']),  // Blank line
    new RowModel([new ColumnModel('', 'INSPECTOR STATEMENT:', 'h1', ['b'])], ['grid-1']),  // row 4
    new RowModel([new ColumnModel('',
        `I, the undersigned, hereby acknowledge that I have
     inspected and verified the test carried out on the
      abovementioned pressure vessel and that the detail 
      given above is a true report on the condition of this
       vessel at the time of the inspection. I have verified 

       the data transferred to this report. `, 'h1', [''])], ['grid-1']),  // row 4
    new RowModel([new ColumnModel('', '', 'h1', ['b'])], ['grid-1']),  // Blank line


    new RowModel([new ColumnModel('',
        `As inspected, this pressure vessel complies with the Pressure Equipment Regulations, and is
     deemed fit to continue operation within its
      design and operating perameters. Any unauthorised
       welding repairs or modifications shall invalidate
        this report `, 'h1', [''])], ['grid-1']),  // row 4


    new RowModel([new ColumnModel('', 'Or:', 'h1', ['b'])], ['grid-1']),  // row 4
    new RowModel([new ColumnModel('',
        `As inspected, this pressure vessel does not comply with the Pressure  Equipment Regulations`, 'h1', [''])], ['grid-1']),  // row 4,

    new RowModel(column73, ['grid-25-75']),  // row 8
    new RowModel(column74, ['grid-4']),  // row 8
    new RowModel(column75, ['grid-25-75']),  // row 8
]

export const REPORT: TestReportPro = new TestReportPro(rows);