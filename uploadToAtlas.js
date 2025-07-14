const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// 한글 헤더 ↔ 영문 필드명 매핑표
const headerMap = {
  '문의번호': 'id',
  '이름': 'author',
  '문의제목': 'title',
  '예식날짜': 'ceremonyDate',
  '장소': 'place',
  '연락처': 'phone',
  '주례여부': 'ceremonyType',
  '2부': 'secondPart',
  '비고': 'note',
  '접한경로': 'howDidYouHear',
  '네이버기타': 'naverEtc',
  '플래너및홀': 'plannerAndHall',
  '기타그외': 'otherEtc',
  '상태': 'status',
  '생성일': 'createdAt',
  '사회자': 'mc',
  '할인구분': 'discountType',
};

if (process.argv.length < 3) {
  console.log('사용법: node uploadToAtlas.js <input.csv>');
  process.exit(1);
}

const inputFile = process.argv[2];
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
    // 예식날짜 분리: '2025-09-20 오후 12시 10분' → ceremonyDate, ceremonyTime
    if (newRow.ceremonyDate && typeof newRow.ceremonyDate === 'string') {
      const match = newRow.ceremonyDate.match(/^(\d{4}-\d{2}-\d{2})\s*(.*)$/);
      if (match) {
        newRow.ceremonyDate = match[1];
        if (match[2]) {
          newRow.ceremonyTime = match[2].trim();
        }
      }
    }
    results.push(newRow);
  })
  .on('end', async () => {
    // MongoDB Atlas에 업로드
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI 환경변수를 .env 파일에 설정하세요.');
      process.exit(1);
    }
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('test');
      const collection = db.collection('reservations');
      const result = await collection.insertMany(results);
      console.log(`업로드 완료! ${result.insertedCount}개 문서가 추가되었습니다.`);
    } catch (err) {
      console.error('업로드 중 오류:', err);
    } finally {
      await client.close();
    }
  }); 