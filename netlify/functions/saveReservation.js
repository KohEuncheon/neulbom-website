const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  // CORS 헤더 추가
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // OPTIONS 요청 처리 (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 프론트엔드에서 보낸 데이터 받기
  const data = JSON.parse(event.body);

  // MongoDB Atlas URI (실제 클러스터 이름, 비밀번호, DB 이름 적용)
  const uri = "mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, {
    useNewUrlParser: true
  });

  try {
    await client.connect();
    const db = client.db("test"); // 실제 DB 이름: 'test'로 지정
    const collection = db.collection("reservations"); // 컬렉션 이름: 'reservations'
    const result = await collection.insertOne(data);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id: result.insertedId }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.close();
  }
}; 