const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://...'; // 실제 환경변수 사용

let conn = null;

const ReservationMC = new mongoose.Schema({
  id: Number,
  name: String,
  region: String,
  specialty: String,
  status: String,
  registrationDate: String,
  profileImageBase64: String,
  profileColor: String,
  introduction: String,
  websiteUrl: String,
});

const MC = mongoose.models.MC || mongoose.model('MC', ReservationMC);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) {
    return {
      statusCode: 400,
      body: 'Missing id',
    };
  }

  if (!conn) {
    conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
  }

  try {
    const result = await MC.deleteOne({ id: Number(id) });
    if (result.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 404,
        body: 'MC not found',
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error deleting MC',
    };
  }
}; 