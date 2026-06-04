import { NextResponse } from 'next/server';

// Mock responses for iDoc library domain if GEMINI_API_KEY is not configured
const getMockResponse = (userPrompt: string, isVi: boolean): string => {
  const prompt = userPrompt.toLowerCase();

  if (
    prompt.includes('khoa học viễn tưởng') ||
    prompt.includes('sci-fi') ||
    prompt.includes('science fiction')
  ) {
    return isVi
      ? `Dưới đây là một số cuốn sách **Khoa học viễn tưởng** nổi bật hiện có trong thư viện số iDoc:

- **[Dune - Xứ Cát](file:///books)** của *Frank Herbert*: Tác phẩm kinh điển về cuộc tranh giành quyền lực trên hành tinh sa mạc Arrakis. Một thiên sử thi khoa học viễn tưởng vĩ đại nhất mọi thời đại.
- **[The Martian - Người Về Từ Sao Hỏa](file:///books)** của *Andy Weir*: Câu chuyện sinh tồn nghẹt thở đầy tính khoa học của một phi hành gia bị bỏ lại trên Sao Hỏa.
- **[Foundation - Thiết Lập](file:///books)** của *Isaac Asimov*: Tác phẩm dự đoán sự sụp đổ và tái sinh của đế chế ngân hà thông qua bộ môn tâm lý lịch sử.

Bạn có muốn mượn hoặc đọc thử cuốn nào trong số này không? Bạn có thể nhấp vào liên kết của từng cuốn để xem chi tiết nhé!`
      : `Here are some outstanding **Science Fiction** books available in the iDoc digital library:

- **[Dune](file:///books)** by *Frank Herbert*: The legendary epic of power struggles on the desert planet Arrakis. One of the greatest sci-fi masterpieces.
- **[The Martian](file:///books)** by *Andy Weir*: A gripping, scientifically detailed survival story of an astronaut stranded on Mars.
- **[Foundation](file:///books)** by *Isaac Asimov*: An epic tale of the fall and rebirth of a galactic empire predicted by psychohistory.

Would you like to borrow or preview any of these? Click on their links to view more details!`;
  }

  if (
    prompt.includes('mượn sách') ||
    prompt.includes('borrow') ||
    prompt.includes('gia hạn') ||
    prompt.includes('extend')
  ) {
    return isVi
      ? `Quy trình mượn sách và gia hạn tại thư viện số iDoc rất đơn giản:

1. **Tìm kiếm sách**: Bạn duyệt danh mục sách tại trang **[Khám phá sách](file:///books)** hoặc sử dụng thanh tìm kiếm.
2. **Yêu cầu mượn**: Nhấp vào nút **Mượn sách** ở trang chi tiết sách.
3. **Đọc sách**: Sách điện tử (Ebook/EPUB) sẽ hiển thị ngay trong mục **[Thư viện của tôi](file:///library)** sau khi yêu cầu được duyệt.
4. **Hạn mượn**: Thời gian mượn mặc định là **14 ngày**.
5. **Gia hạn sách**: Bạn có thể vào phần **[Thư viện của tôi](file:///library)**, chọn cuốn sách đang mượn và nhấn **Gia hạn** (tối đa thêm 7 ngày nếu không có ai khác đang chờ).

Bạn có thể kiểm tra danh sách sách đang mượn tại trang cá nhân của mình nhé!`
      : `Here is the guide for borrowing and extending books in the iDoc digital library:

1. **Search for books**: Browse categories in the **[Catalog](file:///books)** or use the search bar.
2. **Request Borrow**: Click the **Borrow** button on the book's details page.
3. **Start Reading**: The digital book (Ebook/EPUB) will be immediately available under **[My Library](file:///library)** once approved.
4. **Loan period**: The default loan period is **14 days**.
5. **Extension**: Go to **[My Library](file:///library)**, select your active loan, and click **Extend** (up to 7 additional days, provided there is no active waitlist).

You can manage all your active loans in your library dashboard!`;
  }

  if (prompt.includes('nguyễn nhật ánh') || prompt.includes('nguyen nhat anh')) {
    return isVi
      ? `Nhà văn **Nguyễn Nhật Ánh** là một trong những tác giả được yêu thích nhất tại iDoc. Các tác phẩm nổi tiếng của ông hiện đang sẵn sàng phục vụ độc giả:

- **[Mắt Biếc](file:///books)**: Câu chuyện tình yêu đơn phương đầy da diết của Ngạn dành cho Hà Lan, gắn liền với làng Đo Đo thơ mộng.
- **[Cho Tôi Xin Một Vé Đi Tuổi Thơ](file:///books)**: Tấm vé đưa người lớn quay trở lại thế giới nghịch ngợm, trong trẻo của tuổi thơ.
- **[Kính Vạn Hoa](file:///books)**: Bộ truyện học trò gắn liền với bộ ba Quý ròm, Tiểu Long và Hạnh.

Bạn có thể tìm kiếm toàn bộ tác phẩm của ông tại danh sách **[Tác giả Nguyễn Nhật Ánh](file:///authors)**.`
      : `Author **Nguyen Nhat Anh** is one of the most beloved writers on iDoc. His famous works are currently available for readers:

- **[Blue Eyes (Mat Biec)](file:///books)**: A nostalgic and poignant story of unrequited love set in a poetic countryside.
- **[Give Me a Ticket to Childhood](file:///books)**: A magical ticket that takes adults back to the playful and pure world of childhood.
- **[Kaleidoscope (Kinh Van Hoa)](file:///books)**: The iconic student adventure series following Quý ròm, Tiểu Long, and Hạnh.

You can browse all of his works under **[Nguyen Nhat Anh's Author Profile](file:///authors)**.`;
  }

  if (
    prompt.includes('phát triển bản thân') ||
    prompt.includes('self-help') ||
    prompt.includes('kỹ năng') ||
    prompt.includes('skill')
  ) {
    return isVi
      ? `Để nâng cao năng lực cá nhân và phát triển bản thân, iDoc gợi ý bạn nên đọc các cuốn sách đắt giá sau:

- **[Đắc Nhân Tâm](file:///books)** của *Dale Carnegie*: Cuốn sách nghệ thuật ứng xử kinh điển giúp xây dựng các mối quan hệ tốt đẹp.
- **[Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ (Atomic Habits)](file:///books)** của *James Clear*: Hướng dẫn chi tiết cách xây dựng thói quen tốt và từ bỏ thói quen xấu thông qua các thay đổi cực nhỏ hàng ngày.
- **[Tư Duy Nhanh Và Chậm](file:///books)** của *Daniel Kahneman*: Cuốn sách đột phá giải thích hai hệ thống tư duy chi phối hành vi của con người.

Chúc bạn có những giờ phút đọc sách tích lũy tri thức thật thú vị!`
      : `To boost your personal growth and skills, iDoc recommends these top self-help books:

- **[How to Win Friends and Influence People](file:///books)** by *Dale Carnegie*: The timeless classic on communication and building relationships.
- **[Atomic Habits](file:///books)** by *James Clear*: An easy and proven way to build good habits and break bad ones.
- **[Thinking, Fast and Slow](file:///books)** by *Daniel Kahneman*: An insightful exploration of the two systems that drive our decision-making.

Happy reading and self-improving with iDoc!`;
  }

  return isVi
    ? `**Xin chào!** Tôi là **Trợ lý AI** của Thư viện số iDoc. 

Tôi có thể hỗ trợ bạn những gì hôm nay? Dưới đây là một số chủ đề phổ biến bạn có thể hỏi tôi:

**Tìm kiếm sách**: Gợi ý sách theo thể loại, tác giả (ví dụ: *"sách khoa học viễn tưởng"*, *"tác phẩm của Nguyễn Nhật Ánh"*).
**Quy chế thư viện**: Hướng dẫn mượn/trả sách, gia hạn thời gian mượn trên hệ thống iDoc.
**Gợi ý đọc sách**: Đề xuất các tựa sách hot nhất hoặc sách phát triển bản thân.

*Hãy nhập câu hỏi của bạn ở khung bên dưới để bắt đầu trò chuyện nhé!*`
    : `**Hello!** I am the **AI Assistant** of the iDoc Digital Library.

How can I help you today? Here are some topics you can ask me about:

**Book Search**: Ask for genres or authors (e.g., *"sci-fi books"*, *"works by Nguyen Nhat Anh"*).
**Library Rules**: Learn about borrowing, returning, and extending book loans on iDoc.
**Recommendations**: Discover trending titles or books for self-growth.

*Please type your question in the input field below to get started!*`;
};

export async function POST(req: Request) {
  try {
    const { messages, model, locale } = (await req.json()) as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      model: string;
      locale: string;
    };
    const isVi = locale === 'vi';

    // Get latest user prompt
    const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0];
    const userPrompt = lastUserMessage ? lastUserMessage.content : '';

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      // GEMINI REAL CALL
      const geminiModel = model === 'gemini-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: messages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            systemInstruction: {
              parts: [
                {
                  text: `You are iDoc AI Assistant, a friendly and professional chatbot for iDoc Digital Library. 
                Answer in ${isVi ? 'Vietnamese' : 'English'}.
                If users ask about books, authors, or borrowing processes, guide them politely and link them to routes like [All Books](file:///books), [Authors](file:///authors), [My Library](file:///library), [Discover](file:///discover).
                Formatting tip: Keep answers organized, use bullet points, and markdown bold/italic where needed.`,
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Gemini API error');
      }

      // Create a readable stream to forward the Gemini chunk stream to client
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          if (reader) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Gemini SSE stream chunks are JSON objects separated by newlines, often starting with '[' or ','
                // Let's parse the parts properly. In streamGenerateContent, it streams JSON array elements.
                // An easier way is to extract text chunks using regex since we want text.
                const regex = /"text"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
                let match;
                while ((match = regex.exec(buffer)) !== null) {
                  let text = match[1];
                  // Unescape JSON string
                  try {
                    text = JSON.parse(`"${text}"`);
                  } catch (_e) {}

                  controller.enqueue(new TextEncoder().encode(text));
                }

                // Reset buffer to avoid infinite parsing of old matches, but keep unfinished parts
                if (buffer.length > 50000) {
                  buffer = buffer.substring(buffer.length - 1000);
                }
              }
            } catch (err) {
              controller.error(err);
            } finally {
              controller.close();
            }
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // fallback to Mock AI Streaming
    const botReply = getMockResponse(userPrompt, isVi);

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // We will split reply into words or small character blocks to simulate typing stream
        const chunks = botReply.split(' ');
        for (let i = 0; i < chunks.length; i++) {
          const delay = Math.random() * 25 + 10; // Random delay between 10ms and 35ms
          await new Promise((resolve) => setTimeout(resolve, delay));

          const suffix = i === chunks.length - 1 ? '' : ' ';
          controller.enqueue(encoder.encode(chunks[i] + suffix));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
