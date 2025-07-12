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
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// 데이터 구조 정의 (스키마)
const InquirySchema = new mongoose.Schema({
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
  name: String,
  region: String,
  profileImage: String,
  profileColor: String,
  status: { type: String, default: "활동중" },
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

// 데이터베이스 모델
const Inquiry = mongoose.model("Inquiry", InquirySchema);
const Mc = mongoose.model("Mc", McSchema);
const Banner = mongoose.model("Banner", BannerSchema);
const Promotion = mongoose.model("Promotion", PromotionSchema);
const Tips = mongoose.model("Tips", TipsSchema);

// API 엔드포인트들

// 문의 관련
app.get("/api/inquiries", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ _id: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/inquiries", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/inquiries/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/inquiries/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사회자 관련
app.get("/api/mcs", async (req, res) => {
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
