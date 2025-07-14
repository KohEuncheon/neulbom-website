const { MongoClient, ObjectId } = require('mongodb');

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

  const url = new URL(event.rawUrl || `http://localhost${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
  const id = url.searchParams.get('id');
  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'id 파라미터가 필요합니다.' })
    };
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('reservations');
    // id가 ObjectId일 수도 있고 string일 수도 있음
    let query = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [ { id }, { _id: new ObjectId(id) } ] };
    }
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: '문서를 찾을 수 없습니다.' })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  } finally {
    await client.close();
  }
}; 