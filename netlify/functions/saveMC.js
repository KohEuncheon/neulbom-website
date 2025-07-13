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

  const data = JSON.parse(event.body);
  const uri = "mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("registeredMCs");
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