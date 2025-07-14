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

  // page, limit 쿼리 파라미터 파싱 (Netlify 환경 호환)
  let page = 1;
  let limit = 20;
  if (event.queryStringParameters) {
    page = parseInt(event.queryStringParameters.page || '1', 10);
    limit = parseInt(event.queryStringParameters.limit || '20', 10);
  } else {
    try {
      const url = new URL(event.rawUrl || `http://localhost${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
      page = parseInt(url.searchParams.get('page') || '1', 10);
      limit = parseInt(url.searchParams.get('limit') || '20', 10);
    } catch (e) {
      // fallback: 기본값 유지
    }
  }
  const skip = (page - 1) * limit;

  const uri = process.env.MONGODB_URI || "mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, {
    useNewUrlParser: true
  });

  try {
    console.log('==== getReservations: DB 연결 시도 ====');
    await client.connect();
    console.log('==== getReservations: DB 연결 성공 ====');
    const db = client.db("test");
    const collection = db.collection("reservations");
    const totalCount = await collection.countDocuments({});
    const data = await collection.find({})
      .sort({ ceremonyDate: -1, date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    console.log('==================== getReservations ====================');
    console.log('data.length:', data.length, 'totalCount:', totalCount);
    if (data.length > 0) {
      console.log('샘플 데이터:', JSON.stringify(data[0]));
    } else {
      console.log('DB에서 읽은 데이터가 0개입니다.');
    }
    console.log('========================================================');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data, totalCount }),
    };
  } catch (err) {
    console.log('==== getReservations: ERROR ====', err && err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.close();
  }
}; 