const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// 한글 헤더 ↔ 영문 필드명 매핑표
const headerMap = {
  '문의번호': 'id',
  '이름': 'author',
  '문의제목': 'title',
  '비밀번호': 'password',
  '배우자': 'spouse',
  '연락처': 'phone',
  '사회자': 'mc',
  '예식장': 'weddingHall',
  '주례여부': 'ceremonyType',
  '2부': 'secondPart',
  '예식날짜': 'ceremonyDate',
  '예식시간': 'ceremonyTime',
  '접한경로': 'howDidYouHear',
  '링크': 'linkUrl',
  '기타비고': 'otherNotes',
  '날짜': 'date',
  '상태': 'status',
};

if (process.argv.length < 4) {
  console.log('사용법: node convertHeader.js <input.csv> <output.csv>');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (data) => {
    // 한글 헤더 → 영문 필드명으로 변환
    const newRow = {};
    for (const key in data) {
      const mappedKey = headerMap[key] || key;
      newRow[mappedKey] = data[key];
    }
    results.push(newRow);
  })
  .on('end', () => {
    // 영문 헤더로 CSV 저장
    const fields = Object.values(headerMap);
    const opts = { fields };
    try {
      const csvData = parse(results, opts);
      fs.writeFileSync(outputFile, csvData, 'utf8');
      console.log(`변환 완료! ${outputFile} 파일이 생성되었습니다.`);
    } catch (err) {
      console.error(err);
    }
  }); 