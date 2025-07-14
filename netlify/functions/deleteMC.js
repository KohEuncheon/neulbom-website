const { MongoClient, ObjectId } = require('mongodb');

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

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed',
    };
  }

  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: 'Missing id',
    };
  }

  const uri = process.env.MONGODB_URI || 'mongodb+srv://...'; // 실제 환경변수 사용
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('registeredmcs');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 404,
        headers,
        body: 'MC not found',
      };
    }
  } catch (err) {
    console.error('Error deleting MC:', err, err.stack);
    return {
      statusCode: 500,
      headers,
      body: 'Error deleting MC: ' + err.message,
    };
  } finally {
    await client.close();
  }
}; 