import PDFDocument from "pdfkit";
import { IReceiptService, SourceData, RecipientData } from "../../domain/interfaces/IReceiptService.js";
import Transaction from "../../domain/entities/transaction.entity.js";

export class PdfkitReceiptService implements IReceiptService {
  async generateTransactionReceipt(
    transaction: Transaction,
    source: SourceData,
    recipient: RecipientData
  ): Promise<Buffer> {
    const doc: PDFKit.PDFDocument = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    const endPromise: Promise<void> = new Promise((resolve) =>
      doc.on("end", resolve)
    );

    const pageWidth = doc.page.width;
    const margin = doc.page.margins.left;
    const contentWidth = pageWidth - margin * 2;

    const maskId = (id?: string): string => {
      if (!id) return "N/A";
      const visible = id.slice(-4);
      return `#${visible}`;
    };

    const drawField = (label: string, value: string) => {
      const labelX = margin + 10;
      const valueX = margin + 250;
      const y = doc.y;
      doc.fontSize(12).text(label, labelX, y);
      doc.text(value, valueX, y);
      doc.moveDown(0.5);
    };

    const drawSectionHeading = (title: string) => {
      doc.moveDown(1);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(title, margin, doc.y, { align: "center", width: contentWidth });
      doc.moveDown(1);
      doc.font("Helvetica");
    };

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("CalmConnect Receipt", margin, doc.y, {
        align: "center",
        width: contentWidth,
      });

    doc.moveDown(1);
    doc.font("Helvetica");

    drawField("Transaction ID:", maskId(transaction.id));
    drawField("Date:", transaction.createdAt?.toLocaleString() || "N/A");
    drawField("Type:", transaction.type.toUpperCase());
    drawField("Amount:", `INR ${transaction.amount.toFixed(2)}`);
    drawField("Reference:", transaction.referenceType || "N/A");
    drawField("Session ID:", maskId(transaction.sessionId));
    if (transaction.providerPaymentId)
      drawField("Payment ID:", transaction.providerPaymentId);

    drawSectionHeading("Source Account");
    drawField("Type:", source.type);
    if (source.name) drawField("Name:", source.name);
    if (source.email) drawField("Email:", source.email);

    drawSectionHeading("Recipient Account");
    drawField("Type:", recipient.type);
    if (recipient.name) drawField("Name:", recipient.name);
    if (recipient.email) drawField("Email:", recipient.email);

    doc.moveDown(1);
    drawField("Description:", transaction.description || "—");

    doc.moveDown(1.2);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Thank you for using CalmConnect!", margin, doc.y, {
        align: "center",
        width: contentWidth,
      });

    doc.end();
    await endPromise;

    return Buffer.concat(chunks);
  }
}
