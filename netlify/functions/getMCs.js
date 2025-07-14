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
    const collection = db.collection("registeredMCs");
    // 파라미터 파싱
    let page = 1;
    let limit = 100;
    let region = undefined;
    let sort = 'registrationDate';
    let sortOrder = -1;
    let id = undefined;
    if (event.queryStringParameters) {
      page = parseInt(event.queryStringParameters.page || '1', 10);
      limit = parseInt(event.queryStringParameters.limit || '100', 10);
      region = event.queryStringParameters.region;
      sort = event.queryStringParameters.sort || 'registrationDate';
      sortOrder = event.queryStringParameters.sortOrder === 'asc' ? 1 : -1;
      id = event.queryStringParameters.id;
    }
    const skip = (page - 1) * limit;
    let query = {};
    if (region) query.region = region;
    if (id) query.id = isNaN(Number(id)) ? id : Number(id);
    // 단일 MC 조회
    if (id) {
      const mc = await collection.findOne(query);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data: mc ? [mc] : [], totalCount: mc ? 1 : 0 }),
      };
    }
    // 목록 조회
    const totalCount = await collection.countDocuments(query);
    const data = await collection.find(query)
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