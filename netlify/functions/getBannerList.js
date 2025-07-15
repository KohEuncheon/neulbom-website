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
  // throw new Error("Netlify function region: " + (process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION)); // 테스트용 코드 삭제 또는 주석 처리
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

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
    const collection = db.collection("bannerList");
    // page, limit, sort 파라미터 파싱
    let page = 1;
    let limit = 20;
    let sort = 'date';
    let sortOrder = -1;
    if (event.queryStringParameters) {
      page = parseInt(event.queryStringParameters.page || '1', 10);
      limit = parseInt(event.queryStringParameters.limit || '20', 10);
      sort = event.queryStringParameters.sort || 'date';
      sortOrder = event.queryStringParameters.sortOrder === 'asc' ? 1 : -1;
    }
    const skip = (page - 1) * limit;
    const totalCount = await collection.countDocuments({});
    const data = await collection.find({})
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data, totalCount }),
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