const { MongoClient } = require('mongodb');

let cachedClient = null;
async function getClient() {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    return cachedClient;
  }
  const uri = "mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

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

  try {
    const client = await getClient();
    const db = client.db("test");
    const collection = db.collection("promotionList");
    // page, limit 쿼리 파라미터 파싱 (Netlify 환경 호환)
    let page = 1;
    let limit = 100;
    if (event.queryStringParameters) {
      page = parseInt(event.queryStringParameters.page || '1', 10);
      limit = parseInt(event.queryStringParameters.limit || '100', 10);
    }
    const skip = (page - 1) * limit;
    const data = await collection.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    // Netlify/Lambda 환경에서는 커넥션을 닫지 않고 재사용
    // await client.close();
  }
}; 