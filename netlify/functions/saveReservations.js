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

  // 프론트엔드에서 보낸 데이터 받기 (배열)
  let data;
  try {
    data = JSON.parse(event.body);
    if (!Array.isArray(data)) {
      throw new Error('입력 데이터가 배열이 아닙니다.');
    }
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: '잘못된 입력 데이터: ' + err.message }),
    };
  }

  // MongoDB Atlas URI
  const uri = "mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, {
    useNewUrlParser: true
  });

  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("reservations");
    const result = await collection.insertMany(data);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, insertedCount: result.insertedCount }),
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