import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper calculation functions
function calculateHealthMetrics(profile: {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activityLevel: string;
}) {
  const heightInMeters = profile.height / 100;
  const bmi = Number((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));

  let bmiCategory = 'Bình thường';
  if (bmi < 18.5) bmiCategory = 'Thiếu cân (Gầy)';
  else if (bmi < 23) bmiCategory = 'Bình thường (Chuẩn châu Á)';
  else if (bmi < 25) bmiCategory = 'Tiền béo phì';
  else if (bmi < 30) bmiCategory = 'Béo phì độ I';
  else bmiCategory = 'Béo phì độ II';

  // Mifflin-St Jeor formula for BMR
  let bmr = 0;
  if (profile.gender === 'Nam') {
    bmr = Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5);
  } else {
    bmr = Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161);
  }

  // TDEE multipliers
  let multiplier = 1.2;
  if (profile.activityLevel === 'Vừa') multiplier = 1.45;
  if (profile.activityLevel === 'Nhiều') multiplier = 1.7;

  const tdee = Math.round(bmr * multiplier);

  // Target calories based on goal
  let targetCalories = tdee;
  if (profile.goal === 'Giảm cân') targetCalories = Math.max(1200, Math.round(tdee - 450));
  if (profile.goal === 'Tăng cơ') targetCalories = Math.round(tdee + 350);

  // Macros target
  let proteinGrams = Math.round(profile.weight * (profile.goal === 'Tăng cơ' ? 2.0 : 1.6));
  let fatGrams = Math.round((targetCalories * 0.25) / 9);
  let carbCalories = targetCalories - (proteinGrams * 4 + fatGrams * 9);
  let carbGrams = Math.max(80, Math.round(carbCalories / 4));

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    macros: {
      protein: proteinGrams,
      carb: carbGrams,
      fat: fatGrams,
    },
    waterLiters: Number(((profile.weight * 0.04)).toFixed(1)),
  };
}

// 1. Endpoint: Analyze User Profile
app.post('/api/analyze-profile', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Dữ liệu hồ sơ không hợp lệ' });
    }

    const metrics = calculateHealthMetrics(profile);

    let aiAdvice = {
      nutritionDirection: `Tập trung vào thâm hụt/thặng dư calo an toàn (${metrics.targetCalories} kcal/ngày). Ưu tiên đạm nạc, tinh bột hấp thu chậm (khoai lang, gạo lứt, yến mạch) và bổ sung tối thiểu ${metrics.waterLiters}L nước/ngày. Tránh các thực phẩm chế biến sẵn và hạn chế đồ uống có đường.`,
      workoutDirection: `Duy trì lịch tập ${profile.workoutDaysPerWeek || 4} buổi/tuần, mỗi buổi ${profile.workoutDuration || 45} phút. Kết hợp bài tập kháng lực toàn thân (Compound: Squat, Push-up, Lunge) và Cardio nhịp tim vùng 2 để tăng cường trao đổi chất.`,
      keyTakeaways: [
        `Mức năng lượng mục tiêu: ${metrics.targetCalories} kcal/ngày (TDEE: ${metrics.tdee} kcal)`,
        `Khẩu phần dinh dưỡng khuyến nghị: ${metrics.macros.protein}g Đạm - ${metrics.macros.carb}g Tinh bột - ${metrics.macros.fat}g Chất béo`,
        `Lượng nước uống tối thiểu: ${metrics.waterLiters} lít/ngày`,
        `Lưu ý thực phẩm: Hạn chế dị ứng/thực phẩm cần tránh: ${profile.allergies || 'Không có'}`
      ]
    };

    if (ai) {
      try {
        const prompt = `Bạn là chuyên gia dinh dưỡng và HLV thể hình AI chuyên nghiệp.
Phân tích hồ sơ người dùng sau đây và đưa ra định hướng cá nhân hóa bằng tiếng Việt:
- Họ tên: ${profile.fullName || 'Người dùng'}
- Tuổi: ${profile.age}, Giới tính: ${profile.gender}
- Chiều cao: ${profile.height} cm, Cân nặng: ${profile.weight} kg
- Chỉ số tính toán: BMI ${metrics.bmi} (${metrics.bmiCategory}), BMR ${metrics.bmr} kcal, TDEE ${metrics.tdee} kcal, Mục tiêu calo: ${metrics.targetCalories} kcal
- Mục tiêu cá nhân: ${profile.goal}
- Mức độ vận động: ${profile.activityLevel}
- Lịch tập: ${profile.workoutDaysPerWeek} buổi/tuần, mỗi buổi ${profile.workoutDuration} phút
- Món ăn yêu thích: ${profile.favoriteFoods || 'Đa dạng'}
- Món ăn không thích: ${profile.dislikedFoods || 'Không có'}
- Dị ứng/Tránh: ${profile.allergies || 'Không có'}

Yêu cầu trả về đúng cú pháp JSON thuần (không bọc markdown backtick thừa):
{
  "nutritionDirection": "Đoạn văn ngắn gọn, thực tế, khoa học về chế độ dinh dưỡng phù hợp mục tiêu và sở thích món ăn",
  "workoutDirection": "Đoạn văn ngắn gọn, rõ ràng về phương pháp tập luyện phù hợp số buổi và thể trạng",
  "keyTakeaways": ["Điểm lưu ý quan trọng 1", "Điểm lưu ý quan trọng 2", "Điểm lưu ý quan trọng 3", "Điểm lưu ý quan trọng 4"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '';
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.nutritionDirection && parsed.workoutDirection) {
            aiAdvice = parsed;
          }
        }
      } catch (err) {
        console.error('Gemini analyze profile error:', err);
      }
    }

    return res.json({
      success: true,
      metrics,
      aiAdvice,
    });
  } catch (error) {
    console.error('Error analyzing profile:', error);
    return res.status(500).json({ error: 'Lỗi khi phân tích hồ sơ' });
  }
});

// 2. Endpoint: Adjust Meal with AI
app.post('/api/adjust-meal', async (req, res) => {
  try {
    const { dayNumber, currentDayPlan, userRequest, profile } = req.body;

    if (!userRequest || !currentDayPlan) {
      return res.status(400).json({ error: 'Thiếu thông tin yêu cầu điều chỉnh' });
    }

    let modifiedPlan = JSON.parse(JSON.stringify(currentDayPlan));
    let explanation = `AI đã tiếp nhận yêu cầu "${userRequest}" và tối ưu lại thực đơn ngày ${dayNumber} để đảm bảo sự ngon miệng và cân đối dinh dưỡng.`;

    if (ai) {
      try {
        const prompt = `Bạn là trợ lý dinh dưỡng AI. Người dùng đang xem thực đơn Ngày ${dayNumber}:
Bữa sáng: ${currentDayPlan.breakfast?.name} (${currentDayPlan.breakfast?.calories} kcal)
Bữa trưa: ${currentDayPlan.lunch?.name} (${currentDayPlan.lunch?.calories} kcal)
Bữa phụ: ${currentDayPlan.snack?.name} (${currentDayPlan.snack?.calories} kcal)
Bữa tối: ${currentDayPlan.dinner?.name} (${currentDayPlan.dinner?.calories} kcal)
Tổng calo hiện tại: ${currentDayPlan.totalCalories} kcal.

Yêu cầu điều chỉnh của người dùng: "${userRequest}".
Hồ sơ người dùng: Mục tiêu: ${profile?.goal || 'Duy trì'}, Dị ứng/tránh: ${profile?.allergies || 'Không'}.

Hãy điều chỉnh thực đơn các bữa ăn sao cho giải quyết đúng yêu cầu của người dùng (ví dụ: thay thế cá bằng ức gà/đậu phụ/trứng/thịt nạc có calo và đạm tương đương, hoặc ăn chay, hoặc đổi món theo yêu cầu).
Trả về JSON đúng cấu trúc:
{
  "breakfast": { "name": "Tên món sáng mới", "items": ["nguyên liệu 1", "nguyên liệu 2"], "calories": 420 },
  "lunch": { "name": "Tên món trưa mới", "items": ["nguyên liệu 1", "nguyên liệu 2"], "calories": 580 },
  "snack": { "name": "Tên món phụ mới", "items": ["nguyên liệu 1"], "calories": 160 },
  "dinner": { "name": "Tên món tối mới", "items": ["nguyên liệu 1", "nguyên liệu 2"], "calories": 480 },
  "totalCalories": 1640,
  "explanation": "Lời giải thích ngắn gọn vì sao AI chọn món thay thế này và đảm bảo dinh dưỡng ra sao"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '';
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.breakfast && parsed.lunch && parsed.dinner) {
            modifiedPlan = {
              ...currentDayPlan,
              ...parsed,
            };
            explanation = parsed.explanation || explanation;
          }
        }
      } catch (err) {
        console.error('Gemini adjust meal error:', err);
      }
    } else {
      // Intelligent fallback adjustment
      const lowerReq = userRequest.toLowerCase();
      if (lowerReq.includes('cá') || lowerReq.includes('không thích cá')) {
        explanation = 'AI đã thay thế cá hấp ở bữa tối bằng Ức gà nướng thảo mộc (150g) và bổ sung hạt chia để duy trì lượng Omega-3 và đạm tương đương (khoảng 32g protein).';
        modifiedPlan.dinner = {
          name: 'Ức gà nướng thảo mộc & Khoai lang',
          items: ['150g ức gà áp chảo thơm thảo mộc', '1 củ khoai lang luộc', 'Rau củ luộc sốt mè'],
          calories: 450,
          protein: '34g',
          carb: '45g',
          fat: '8g',
        };
      } else if (lowerReq.includes('chay') || lowerReq.includes('thực vật')) {
        explanation = 'AI đã chuyển đổi các nguồn đạm động vật sang đậu phụ hữu cơ, nấm đùi gà và đậu gà để đảm bảo dinh dưỡng thực vật lành mạnh.';
        modifiedPlan.lunch = {
          name: 'Cơm gạo lứt Đậu phụ sốt cà chua nấm',
          items: ['1 chén cơm gạo lứt', '180g đậu phụ sốt cà nấm hương', 'Canh bí xanh nấu kỷ tử'],
          calories: 520,
          protein: '22g',
          carb: '68g',
          fat: '14g',
        };
        modifiedPlan.dinner = {
          name: 'Salad Đậu gà sốt mè & Khoai tây nướng',
          items: ['120g đậu gà luộc chín', 'Rau rocket, cà chua bi', '1 củ khoai tây nướng'],
          calories: 430,
          protein: '18g',
          carb: '62g',
          fat: '10g',
        };
      } else {
        explanation = `AI đã ghi nhận yêu cầu "${userRequest}" và tối ưu khẩu phần các bữa ăn trong ngày ${dayNumber}.`;
      }
    }

    return res.json({
      success: true,
      modifiedPlan,
      explanation,
    });
  } catch (error) {
    console.error('Error adjusting meal:', error);
    return res.status(500).json({ error: 'Lỗi khi điều chỉnh thực đơn' });
  }
});

// 3. Endpoint: AI Health Assistant Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Tin nhắn không hợp lệ' });
    }

    const latestMessage = messages[messages.length - 1]?.content || '';

    let reply = `Chào bạn! Tôi là trợ lý AI Health & Fitness. Đối với câu hỏi "${latestMessage}", tôi luôn khuyến khích bạn kết hợp giữa dinh dưỡng tự nhiên cân bằng và lịch tập luyện bền vững. Hãy cho tôi biết thêm về mục tiêu của bạn để tôi hỗ trợ cụ thể nhất nhé!`;

    if (ai) {
      try {
        const systemPrompt = `Bạn là AI Health & Fitness Coach - Trợ lý trí tuệ nhân tạo chuyên sâu về dinh dưỡng cá nhân hóa và huấn luyện thể hình khoa học.
Phong cách giao tiếp:
- Thân thiện, truyền cảm hứng, ngắn gọn, súc tích, chuyên nghiệp bằng tiếng Việt.
- Sử dụng các gạch đầu dòng rõ ràng khi gợi ý món ăn hoặc bài tập.
- Luôn nhắc nhở an toàn sức khỏe: không ép ăn kiêng cực đoan, không tập quá sức khi đau chấn thương; luôn kèm thông điệp "Thông tin mang tính tham khảo khoa học, hãy tham khảo bác sĩ/chuyên gia nếu có bệnh lý nền."
- Ngữ cảnh người dùng hiện tại:
${userContext ? JSON.stringify(userContext, null, 2) : 'Người dùng mới bắt đầu hành trình sống khỏe.'}`;

        // Format Gemini contents from message history, ensuring first turn is 'user'
        let conversationContents = messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        // Trim any leading model turns so history starts with a user turn
        while (conversationContents.length > 0 && conversationContents[0].role === 'model') {
          conversationContents.shift();
        }

        if (conversationContents.length === 0) {
          conversationContents = [{ role: 'user', parts: [{ text: latestMessage }] }];
        }

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini chat timeout')), 8000)
        );

        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        if (response?.text) {
          reply = response.text;
        }
      } catch (err) {
        console.warn('Gemini chat handled with local knowledge fallback:', err);
      }
    }

    // If reply is default or failed, apply rich local knowledge base
    if (reply.startsWith('Chào bạn! Tôi là trợ lý AI Health & Fitness.')) {
      const lower = latestMessage.toLowerCase();
      if (lower.includes('trước khi tập') || lower.includes('bữa ăn nhẹ')) {
        reply = `**Gợi ý bữa ăn nhẹ trước khi tập 30 - 45 phút:**\n\n1. **1 quả chuối chín + 1 muỗng bơ đậu phộng**: Cung cấp carbohydrate hấp thu nhanh và kali chống chuột rút.\n2. **1 lát bánh mì nguyên cám + 1 quả trứng ốp la**.\n3. **1 hũ sữa chua Hy Lạp + 1 nắm nhỏ quả mọng hoặc yến mạch ngâm**.\n\n*Lưu ý: Tránh ăn quá no hoặc thức ăn nhiều dầu mỡ khó tiêu.*`;
      } else if (lower.includes('đau gối') || lower.includes('squat')) {
        reply = `**Khi bị mỏi hoặc đau khớp gối nhẹ:**\n\n- Tạm thời thay thế Back Squat sâu bằng: **Glute Bridge (Nâng hông sàn)**, **Step-ups thấp**, hoặc **Wall Sit (Tựa lưng vào tường góc 45-60 độ)**.\n- Tập trung tăng sức mạnh cơ đùi sau (Hamstrings) và cơ mông để giảm tải lực lên xương bánh chè.\n- Nếu cơn đau nhói kéo dài hoặc sưng, hãy ngừng bài tập và tham khảo ý kiến bác sĩ chuyên khoa chấn thương chỉnh hình!`;
      } else if (lower.includes('nước') || lower.includes('uống nước')) {
        reply = `**Bí quyết uống đủ 2 - 2.5 lít nước mỗi ngày:**\n\n- Uống ngay 1 ly nước ấm (300ml) sau khi thức dậy để kích hoạt tiêu hóa.\n- Luôn chuẩn bị bình nước cá nhân 1L trên bàn làm việc, chia mốc thời gian uống: hết 1 bình trước 12h trưa, 1 bình trước 18h tối.\n- Bổ sung nước điện giải hoặc thêm vài lát chanh/dưa leo nếu thấy nước lọc nhàm chán.\n- Uống từng ngụm nhỏ thay vì uống ừng ực một lượng lớn cùng lúc.`;
      } else if (lower.includes('tdee') || lower.includes('thâm hụt calo')) {
        reply = `**Chỉ số TDEE & Thâm hụt calo an toàn:**\n\n- **TDEE (Total Daily Energy Expenditure)**: Tổng lượng calo cơ thể tiêu hao trong ngày, bao gồm trao đổi chất cơ bản (BMR), vận động và tiêu hóa thức ăn.\n- **Thâm hụt an toàn**: Nên giảm từ **300 - 500 kcal/ngày** so với TDEE để giảm 0.3 - 0.5kg mỡ/tuần mà không gây suy nhược hay mất cơ bắp.\n- Tuyệt đối không ăn dưới mức BMR (thường là 1200 kcal với nữ, 1500 kcal với nam).`;
      }
    }

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return res.status(500).json({ error: 'Lỗi khi trò chuyện cùng trợ lý AI' });
  }
});

// Configure Vite middleware or static serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
