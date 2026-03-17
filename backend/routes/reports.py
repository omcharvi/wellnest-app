from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from routes.auth import get_current_user, get_db
from io import BytesIO
from datetime import datetime
from backend.models.user import UserRegister, UserLogin
from backend.services.auth_service import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/export/pdf")
async def export_pdf(user_id: str = Depends(get_current_user)):
    db = get_db()
    
    # Fetch data
    user = await db.users.find_one({"_id": user_id})
    moods = [doc async for doc in db.moods.find({"user_id": user_id}).sort("date", -1).limit(30)]
    journals = [doc async for doc in db.journals.find({"user_id": user_id}).sort("date", -1).limit(10)]
    
    # Build PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    story.append(Paragraph("WellNest Wellness Report", styles['Title']))
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Mood Summary
    if moods:
        avg = round(sum(m["mood_score"] for m in moods) / len(moods), 1)
        story.append(Paragraph(f"Mood Summary (Last 30 Days)", styles['Heading2']))
        story.append(Paragraph(f"Average Mood Score: {avg}/10", styles['Normal']))
        story.append(Paragraph(f"Total Entries: {len(moods)}", styles['Normal']))
        story.append(Spacer(1, 10))
        
        # Mood table
        data = [["Date", "Score", "Mood", "Notes"]]
        for m in moods[:10]:
            data.append([m["date"], str(m["mood_score"]), m["mood_label"], m.get("notes","")[:40]])
        
        table = Table(data, colWidths=[80, 50, 80, 250])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4A90D9')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
            ('FONTSIZE', (0,0), (-1,-1), 9),
        ]))
        story.append(table)
        story.append(Spacer(1, 20))
    
    # Journal Summaries
    if journals:
        story.append(Paragraph("Recent Journal Summaries", styles['Heading2']))
        for j in journals[:5]:
            story.append(Paragraph(f"📅 {j['date']}", styles['Heading3']))
            story.append(Paragraph(j.get("ai_summary", ""), styles['Normal']))
            story.append(Spacer(1, 8))
    
    doc.build(story)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=wellnest_report.pdf"}
    )