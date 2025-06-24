import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { inject, injectable } from 'inversify';
import { IStorageService, IStorageServiceId } from '../StorageService/IStorageService';
import logger from '@infrastructure/Logger/logger';

@injectable()
class PreAuthFormService {
  private document: any;

  constructor(
    @inject(IStorageServiceId) private storageService: IStorageService,
  ) {
    this.document = new PDFDocument({ size: 'A4', margin: 50 });
  }

  async createPreAuthForm(fileName: string, totalAmount: number, investorsDetail: any) {
    logger.info("starting preAuth Form generation...")
    const filePath = `static/${fileName}`;
    logger.info(`filePath: ${filePath}`)
    this.document.pipe(fs.createWriteStream(path.join(process.cwd(), filePath)));
    logger.info("document pipe created.");

    const imageBuffer = await this.storageService.getFileBuffer("uploads/images/honeyCombCreditLogo.png");
    logger.info(`imageBuffer created`)
    this.addImage(imageBuffer[0]);
    this.addHoneyCombDetails();
    this.addFormDetails(totalAmount);
    this.addInvestorTable(investorsDetail);
    logger.info(`Document created about to end the document.`)
    await this.document.end();
    logger.info(`Document created successfully.`)

    return filePath;
  }

  addImage(image: any) {
    this.document.image(image, 35, 45, { width: 250 });
  }

  addHoneyCombDetails() {
    this.document.fontSize(13).text("Honeycomb Portal, LLC", 50, 150);
    this.document.text("6008 Broad Street", 50, 167);
    this.document.text("Pittsburgh, PA 15206", 50, 184);
    this.document.text("412-301-7774", 50, 201);
  }

  addFormDetails(totalAmount: number) {
    const date = new Date();
    this.document.moveDown(1);
    this.document.font("Helvetica-Bold").fontSize(13).text("Refund Pre-Authorization Form", 50, this.document.y);
    this.document.fontSize(12).text(`Date:  ${date.toLocaleDateString()}`, 50, this.document.y + 2);
    this.document.text(`Destination:  Dwolla`, 50, this.document.y + 2);
    this.document.text(`Refund batch total:  $${totalAmount}`, 50, this.document.y + 2);
  }

  addInvestorTable(investorsDetails: any) {
    this.document.moveDown(2);
    this.document.fontSize(12).text("Details");
    this.document.moveDown();

    let startX = 50;
    let startY = this.document.y;
    const tableStart = this.document.y;
    const columnWidths = [200, 150, 100];
    const rowHeight = 25;
    const pageHeight = this.document.page.height;
    const bottomMargin = 50;

    this.document.font('Helvetica-Bold').fontSize(12);
    this.document.text("Offering", startX + 10, startY + 3);
    this.document.text("Investor", startX + columnWidths[0] + 10, startY + 3);
    this.document.text("Amount", startX + columnWidths[0] + columnWidths[1] + 10, startY + 3);

    this.document.moveTo(startX, startY - 5)
      .lineTo(startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY - 5)
      .stroke();

    this.document.moveTo(startX, startY + rowHeight - 5)
      .lineTo(startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY + rowHeight - 5)
      .stroke();

    let columnX = startX;
    for (let i = 0; i <= 3; i++) {
      this.document.moveTo(columnX, startY - 5)
        .lineTo(columnX, startY + rowHeight - 5)
        .stroke();
      columnX += columnWidths[i] || 0;
    }

    this.document.font('Helvetica').fontSize(10);
    startY += rowHeight;

    investorsDetails.forEach(investor => {
      if (startY + rowHeight + bottomMargin > pageHeight) {
        this.document.addPage();
        startY = this.document.y
      }
      this.document.text(investor.campaignName, startX + 10, startY + 5);
      this.document.text(investor.investorName, startX + columnWidths[0] + 10, startY + 5);
      this.document.text(investor.amount, startX + columnWidths[0] + columnWidths[1] + 10, startY + 5);

      this.document.moveTo(startX, startY + rowHeight - 5)
        .lineTo(startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY + rowHeight - 5)
        .stroke();

      let columnX = startX;
      for (let i = 0; i <= 3; i++) {
        this.document.moveTo(columnX, startY - 5)
          .lineTo(columnX, startY + rowHeight - 5)
          .stroke();
        columnX += columnWidths[i] || 0;
      }

      startY += rowHeight;
    });
  }
}

export default PreAuthFormService;