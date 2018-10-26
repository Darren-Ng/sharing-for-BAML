// Information required for populating the table (hardcoded)
// Format: Tenor / Sort Key / Risk / Close
var data = {
    headers: [
        '-',
        'Sort Key',
        'Random',
        'Risk',
        'NB Risk',
        'Live Risk',
        'Close (%)',
        'Live (%)',
        'Move (BP)',
        'Live PL',
        'NB PL',
        'PL'
    ],
    data: [
        ['1D', 1, 1000, 5.00],
        ['1W', 7, 1200, 5.30],
        ['1M', 30, 1400, 5.60],
        ['3M', 90, 1600, 5.90],
        ['6M', 180, 1800, 6.20],
        ['1Y', 365, -1600, 6.50],
        ['2Y', 730, -1400, 6.80],
        ['5Y', 1825, 1600, 7.10],
        ['10Y', 3650, 1800, 7.40],
        ['20Y', 7300, 2000, 7.70],
    ]
};