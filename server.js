import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://bbode2003:!Rhrhrhrh3142@cluster0.ypnaqhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let isConnected = false;

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("✅ MongoDB 연결 성공!");
    isConnected = true;
  })
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// 데이터 구조 정의 (스키마) - Netlify 함수와 일치
const ReservationSchema = new mongoose.Schema({
  title: String,
  password: String,
  author: String,
  spouse: String,
  phone: String,
  mc: String,
  weddingHall: String,
  ceremonyType: String,
  secondPart: String,
  ceremonyDate: String,
  ceremonyTime: String,
  howDidYouHear: String,
  linkUrl: String,
  otherNotes: String,
  status: { type: String, default: "문의" },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

const McSchema = new mongoose.Schema({
  id: Number,
  name: String,
  region: String,
  specialty: String,
  status: { type: String, default: "활동중" },
  registrationDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
  profileImageBase64: String,
  profileColor: String,
  introduction: String,
  websiteUrl: String,
});

const BannerSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

const PromotionSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

const TipsSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

// 데이터베이스 모델 - Netlify 함수와 일치하는 컬렉션명 사용
const Reservation = mongoose.model("reservations", ReservationSchema);
const Mc = mongoose.model("registeredMCs", McSchema);
const Banner = mongoose.model("bannerList", BannerSchema);
const Promotion = mongoose.model("promotionList", PromotionSchema);
const Tips = mongoose.model("tipsList", TipsSchema);

// API 엔드포인트들

// 예약 관련
app.get("/api/reservations", async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: "데이터베이스 연결 중입니다. 잠시 후 다시 시도해주세요." });
  }
  
  try {
    const reservations = await Reservation.find().sort({ _id: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사회자 관련
app.get("/api/mcs", async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: "데이터베이스 연결 중입니다. 잠시 후 다시 시도해주세요." });
  }
  
  try {
    const mcs = await Mc.find();
    res.json(mcs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/mcs", async (req, res) => {
  try {
    const mc = new Mc(req.body);
    await mc.save();
    res.json(mc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/mcs/:id", async (req, res) => {
  try {
    const mc = await Mc.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(mc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/mcs/:id", async (req, res) => {
  try {
    await Mc.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 배너 관련
app.get("/api/banners", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ _id: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/banners", async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/banners/:id", async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/banners/:id", async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 프로모션 관련
app.get("/api/promotions", async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ _id: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/promotions", async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/promotions/:id", async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/promotions/:id", async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 안내&TIP 관련
app.get("/api/tips", async (req, res) => {
  try {
    const tips = await Tips.find().sort({ _id: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tips", async (req, res) => {
  try {
    const tip = new Tips(req.body);
    await tip.save();
    res.json(tip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/tips/:id", async (req, res) => {
  try {
    const tip = await Tips.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(tip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/tips/:id", async (req, res) => {
  try {
    await Tips.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버��� 포트 ${PORT}에서 실행 중입니다!`);
});

export default app;
