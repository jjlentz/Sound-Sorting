const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const other = {
    participantId: 'ub41',
    browser: ' Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/82.0',
    start: '2020-11-22T13:38:38.238Z'
}
const another = {
    participantId: 'ub41',
    browser: ' Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/82.0',
    end: '2020-11-22T09:38:38.999Z',
    stu0: 41,
    stu1: 43,
    stu2: 45,
    stu3: 47,
    stu4: 49,
    stu5: 51,
    stu6: '5.44444',
    frequencies: [250, 500, 750, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
    moreStuff: 'NP'
}

const getRows = async (name, newName) => {
    const rows = [];
    const stream = fs.createReadStream(path.resolve(__dirname, '../data', name));
    await csv.parseStream(stream)
        .on('error', error => console.error(error))
        .on('data', row => rows.push(row))
        .on('end', (rowCount) => {
            console.log(`Parsed ${rowCount} rows`)
            rows.push(other);
            console.log(`Rows is again now ${rows.length}`);
            doWrite(newName, rows);
        });
    return rows;
}

const updateRow = async (name, newName, record) => {
    const rows = [];

    const ws = fs.createWriteStream(path.resolve(__dirname, '../data', newName));
    const stream = fs.createReadStream(path.resolve(__dirname, '../data', name))
        .pipe(csv.parse({headers: true}))
        .pipe(csv.format({headers: true}))
        .transform((row, next) => {
            if (row.participantId === record.participantId) {
                return next(null, {
                    ...row,
                    ...record
                });
            }
            return next(null, row)
        })
        .pipe(ws)
        .on('end', () => console.log('done...'));
}
// getRows('moreStuff2.csv', 'moreStuff3.csv').then((rows) => {
//     console.log(`Rows is now ${rows.length}`);
// });
updateRow('moreStuff7.csv','moreStuff8.csv', another).then(() => {
    console.log('OK');
});


const doWrite = (newName, data) => {
    const ws = fs.createWriteStream(path.resolve(__dirname, '../data', newName));
    // const formatterStream = csv.format({header:['participantId','browser','start','end','stu0','stu1','stu2','stu3','stu4','stu5','stu6','moreStuff']})
    // formatterStream.pipe(ws);
    // cs
    // rows.forEach(row => formatterStream.write(row))
    // formatterStream.end();
    csv.write(data)
        .pipe(ws);
};



