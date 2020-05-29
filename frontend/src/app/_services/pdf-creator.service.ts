import { Injectable } from '@angular/core';
import { Booking, BookingPrivateData } from '../_model/booking';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { avcLogo } from 'src/assets/img/AVC_logo';

export class PdfData {
  constructor(private pdf: pdfMake.TCreatedPdf) {}

  getBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.pdf.getBlob(blob => {
        resolve(blob);
      });
    });
  }

  print() {
    this.pdf.print();
  }

  open() {
    this.pdf.open();
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfCreatorService {
  createBookingForm(booking: Booking, privateData: BookingPrivateData, signatureURL: string): PdfData {
    const pdfDefinition = {
      content: [
        'This is a sample PDF',
        {
          columns: [
            {
              image: avcLogo,
              width: 300
            },
            {
              style: 'avc_address',
              stack: [
                'line 1',
                'line 2',
                'line3'
              ]
            }
          ]
        },
        {
          text: 'ROOM HIRE BOOKING FORM',
          style: 'title'
        },
        {
          layout: {
            fillColor: 'blue',
            fillOpacity: 0.5,
            defaultBorder: true,

          },
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*' ],
            fillColor: 'blue',
            body: [
              [
                {
                  text: 'HIRER\'S DETAILS',
                  style: 'table_title'
                }
              ]
            ]
          }
        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 0,
            widths: [ 200, '*' ],
            fillColor: 'blue',
            body: [
              [ {text: 'Name of organisation/group', style: 'table_cell'}, booking.privateDataRef.organizationId ],
              [ {text: 'Name and contact details of person making booking', style: 'table_cell'}, booking.privateDataRef.hirersDetails.firstName ]
            ]
          }
        },
        {
          image: signatureURL
        }
      ],
      styles: {
        avc_address: {
          alignment: "right" as any, // to avoid compilation error
          fontSize: 10
        },
        title: {
          alignment: "center" as any, // to avoid compilation error
          fontSize: 30,
          bold: true
        },
        table_title: {
          alignment: "center" as any, // to avoid compilation error
          fontSize: 20,
          bold: true,
        },
        table_cell: {
        }
      }
    };
    return new PdfData(pdfMake.createPdf(pdfDefinition, undefined, undefined, pdfFonts.pdfMake.vfs));
  }

  constructor() { }
}
