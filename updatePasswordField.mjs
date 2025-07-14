// MongoDB Atlas에 접속해서 reservations 컬렉션의 모든 문서에 password 필드가 없으면 빈 문자열로 추가하는 스크립트입니다.
// 이 파일은 자동으로 접속 정보를 채워넣었습니다.

import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('test');
    const result = await db.collection('reservations').updateMany(
      { password: { $exists: false } },
      { $set: { password: "" } }
    );
    console.log('Updated:', result.modifiedCount);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();