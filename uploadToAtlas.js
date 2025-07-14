const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');

// === 1. 파일 경로와 Atlas 정보만 수정하면 됨 ===
const FILE_PATH = '업로드할파일.xlsx'; // 또는 .csv
const SHEET_NAME = null; // null이면 첫 번째 시트 사용
const MONGO_URI = 'mongodb+srv://<username>:<password>@클러스터주소.mongodb.net/test?retryWrites=true&w=majority';
const DB_NAME = 'test';
const COLLECTION_NAME = 'reservations';

// === 2. 엑셀/CSV 파일 읽기 ===
const workbook = XLSX.readFile(FILE_PATH);
const sheetName = SHEET_NAME || workbook.SheetNames[0];
const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

// === 3. 컬럼 매핑(알려준 규칙 반영) ===
const mapRow = (row) => ({
  author: row['이름'] || row['author'] || '',
  title: row['문의제목'] || row['title'] || '',
  phone: row['연락처'] || row['phone'] || '',
  weddingHall: row['웨딩홀'] || row['weddingHall'] || row['장소'] || '',
  ceremonyType: row['주례여부'] || row['ceremonyType'] || '',
  secondPart: row['2부'] || row['secondPart'] || '',
  ceremonyDate: row['예식날짜'] || row['ceremonyDate'] || '',
  ceremonyTime: row['예식시간'] || row['ceremonyTime'] || '',
  status: row['상태'] || row['status'] || '',
  otherNotes: row['비고'] || row['otherNotes'] || '',
  date: row['생성일'] || row['date'] || new Date().toISOString().split('T')[0],
  mc: row['사회자'] || row['mc'] || '',
});

// === 4. 유효성 검사 및 데이터 변환 ===
const data = rawData
  .map(mapRow)
  .filter(row => row.title && row.author && row.mc); // 필수값 없는 행 제외

console.log(`업로드할 데이터: ${data.length}개`);

// === 5. Atlas로 업로드 ===
const client = new MongoClient(MONGO_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    if (data.length === 0) {
      console.log('업로드할 데이터가 없습니다.');
      return;
    }

    const result = await collection.insertMany(data);
    console.log('업로드 완료:', result.insertedCount, '개');
  } catch (err) {
    console.error('업로드 중 에러:', err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir); 