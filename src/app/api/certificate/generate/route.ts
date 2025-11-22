import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userName, userEmail } = await request.json();

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: "User name and email are required" },
        { status: 400 }
      );
    }

    // Generate certificate HTML
    const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', 'Times New Roman', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .certificate {
      width: 11.69in;
      height: 8.27in;
      background: white;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 60px;
      box-sizing: border-box;
    }
    .border {
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border: 8px solid #f59e0b;
      border-radius: 10px;
    }
    .inner-border {
      position: absolute;
      top: 50px;
      left: 50px;
      right: 50px;
      bottom: 50px;
      border: 2px solid #d97706;
      border-radius: 5px;
    }
    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header {
      margin-top: 40px;
    }
    .logo {
      font-size: 48px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    .subtitle {
      font-size: 18px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 60px;
    }
    .title {
      font-size: 42px;
      font-weight: bold;
      color: #1f2937;
      margin: 40px 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .certificate-text {
      font-size: 24px;
      color: #374151;
      margin: 30px 0;
      line-height: 1.8;
    }
    .name {
      font-size: 48px;
      font-weight: bold;
      color: #1f2937;
      margin: 30px 0;
      text-decoration: underline;
      text-decoration-color: #f59e0b;
      text-decoration-thickness: 3px;
      text-underline-offset: 10px;
    }
    .description {
      font-size: 20px;
      color: #6b7280;
      margin: 30px 0;
      line-height: 1.6;
    }
    .footer {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature {
      text-align: center;
      width: 200px;
    }
    .signature-line {
      border-top: 2px solid #1f2937;
      margin: 60px auto 10px;
      width: 150px;
    }
    .signature-name {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
    }
    .signature-title {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    .date {
      text-align: center;
      width: 200px;
    }
    .date-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 5px;
    }
    .date-value {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
    }
    .certificate-id {
      position: absolute;
      bottom: 20px;
      right: 30px;
      font-size: 12px;
      color: #9ca3af;
    }
    .seal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border: 4px solid #f59e0b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245, 158, 11, 0.1);
      opacity: 0.3;
    }
    .seal::before {
      content: '✓';
      font-size: 80px;
      color: #f59e0b;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border"></div>
    <div class="inner-border"></div>
    <div class="seal"></div>
    <div class="content">
      <div class="header">
        <div class="logo">Mewayz</div>
        <div class="subtitle">FoundrVerse</div>
        <div class="title">Certificate of Completion</div>
      </div>
      
      <div class="certificate-text">
        This is to certify that
      </div>
      
      <div class="name">${userName}</div>
      
      <div class="description">
        has successfully completed the comprehensive course on<br>
        <strong>Practical Startup School for Students</strong><br>
        demonstrating proficiency in startup fundamentals, idea validation, MVP development,<br>
        marketing, branding, and entrepreneurship.
      </div>
      
      <div class="footer">
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-name">Founder & CEO</div>
          <div class="signature-title">Mewayz - FoundrVerse</div>
        </div>
        <div class="date">
          <div class="date-label">Date of Completion</div>
          <div class="date-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-name">Program Director</div>
          <div class="signature-title">Mewayz - FoundrVerse</div>
        </div>
      </div>
      
      <div class="certificate-id">
        Certificate ID: ${userEmail.split('@')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // For now, return HTML that can be converted to PDF client-side
    // In production, you might want to use a library like puppeteer or pdfkit
    return new NextResponse(certificateHTML, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error: any) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}

