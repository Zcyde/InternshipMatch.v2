import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class ResumeParserService {

  constructor() {
    // Required for pdfjs to work in a browser environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  }

  async extractText(file: File): Promise<string> {
    // 1. Handle Images (OCR)
    if (file.type.startsWith('image/')) {
      return await this.performOCR(file);
    }

    // 2. Handle PDFs
    if (file.type === 'application/pdf') {
      return await this.extractPdfText(file);
    }

    // 3. Handle Plain Text
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  private async extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + ' ';
    }
    return text;
  }

  private async performOCR(file: File): Promise<string> {
    const imageUrl = URL.createObjectURL(file);
    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      return text;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }
}