import { RoomService } from './room.service';
import { OrganizationService } from './organization.service';
import { BookingService } from 'src/app/_services/booking.service';
import { Injectable } from '@angular/core';
import { Booking, BookingPrivateData } from '../_model/booking';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { avcLogo } from 'src/assets/img/AVC_logo';
import { Room } from '../_model/room';
import { Extra } from '../_model/extra';

export class PdfData {
  constructor(
    private pdf: pdfMake.TCreatedPdf
    ) {}

  getBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.pdf.getBlob(blob => {
        resolve(blob);
      });
    });
  }

  getStrBase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pdf.getBase64(str => {
        resolve(str);
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

const default_image = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=`;

const header = {
  columns: [
    {
      image: 'avcLogo',
      width: 300
    },
   {
      style: 'avc_address',
      stack: [
        `Ashford Volunteer Centre`,
        `Berwick House, 8 Elwick Road`,
        `Ashford, Kent`,
        `TN23 1PF`
      ]
    }
  ]
};

const title = {
  text: 'ROOM HIRE BOOKING FORM',
  style: 'title'
};

const tableTitle = (theTitle: string) => { return {
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
          text: theTitle,
          style: 'table_title'
        }
      ]
    ]
  }
}; };

const tableRow = (field: string, value: string) => { return [
  {text: field, style: 'table_cell'},
  {text: value, style: 'table_cell'}
]; };

const hirersDetails = (hirer: any, responsible: any, organization: any ) => { return {
  layout: 'lightHorizontalLines',
  table: {
    headerRows: 0,
    widths: [ 200, '*' ],
    fillColor: 'blue',
    body: [
      tableRow('Name of organisation/group', organization.name),
      tableRow('Name and contact details of person making booking', hirer.firstName),
      tableRow(
        'Name and telephone no. of person who will be on site responsible for booking',
        `${responsible.firstName} ${responsible.lastName} ${responsible.phone}`),
      tableRow(
        'Invoice address',
        `${organization.address} ${organization.city} ${organization.postcode}`),
      tableRow(
        'Email address',
        hirer.email),
      tableRow(
        'Type of organization',
        organization.type),
    ]
  }
}; };

const eventDetails = (booking: Booking, privateData: BookingPrivateData, room: Room) => { return {
  layout: 'lightHorizontalLines',
  table: {
    headerRows: 0,
    widths: [ 200, '*' ],
    fillColor: 'blue',
    body: [
      tableRow('Title of event', privateData.title),
      tableRow('Name of room to be hired?', room.name),
      tableRow('Date(s) of event', booking.startDate.toLocaleDateString()),
    ]
  }
}; };

const emptyLine = () => {
  return {
    text: ' ',
    style: 'empty_line'
  };
};

const getExtras = (privateData: BookingPrivateData) => {
  let extras = [];
  privateData.extras.forEach((extra: Extra) => {
    extras.push([{
      text: extra.name,
      style: 'table_cell'
    },
    {
      text: extra.defaultRate,
      style: 'table_cell'
    },
    {
      text: '',
      style: 'table_cell'
    }]);
  });
  return extras;
}

@Injectable({
  providedIn: 'root'
})
export class PdfCreatorService {

  constructor(
    private bookingService: BookingService,
    private organizationService: OrganizationService,
    private roomService: RoomService
  ) { }

  createBookingForm(booking: Booking, privateData: BookingPrivateData, signatureURL: string = default_image): Promise<PdfData> {
    console.log('createBookingForm', signatureURL);
    return new Promise((resolve, reject) => {
      this.organizationService.getOrganizationFromId(privateData.organizationId).subscribe((organization) => {
        this.roomService.getRoomFromId(booking.roomId).subscribe((room) => {
          const pdfDefinition = {
            content: [
              header,
              title,
              '',
              emptyLine(),
              tableTitle('HIRER\'S DETAILS'),
              hirersDetails(
                booking.privateDataRef.hirersDetails,
                booking.privateDataRef.responsibleDetails,
                organization
              ),
              emptyLine(),
              tableTitle('EVENT/BOOKING DETAILS'),
              eventDetails(booking, privateData, room),
              {
                layout: {
                  fillColor: 'blue',
                  fillOpacity: 0.5,
                  defaultBorder: true,
                },
                table: {
                  widths: ['33%', '33%', '*'],
                  body: [
                    [{
                      text: 'Access to room start time',
                      style: 'table_title_2'
                    },
                    {
                      text: 'Access to room end time',
                      style: 'table_title_2'
                    },
                    {
                      text: 'Expected number of delegates',
                      style: 'table_title_2'
                    }]
                  ]
                }
              },
              {
                table: {
                  widths: ['33%', '33%', '*'],
                  body: [
                    [{
                      text: booking.startDate.toLocaleTimeString()
                    },
                    {
                      text: booking.endDate.toLocaleTimeString()
                    },
                    {
                      text: booking.nbPeopleExpected
                    }]
                  ]
                }
              },
              emptyLine(),
              tableTitle('OPTIONAL EXTRAS'),
              {
                table: {
                  widths: ['50%', '25%', '*'],
                  body: [
                    [{
                      text: 'Equipment/service',
                      style: 'table_title_2'
                    },
                    {
                      text: 'Cost of hire',
                      style: 'table_title_2'
                    },
                    {
                      text: '',
                      style: 'table_title_2'
                    }]
                  ]
                }
              },
              // {
              //   table: {
              //     widths: ['50%', '25%', '*'],
              //     body: getExtras(privateData)
              //   }
              // },
              emptyLine(),
              tableTitle(''),
              {
                table: {
                  widths: ['*'],
                  body: [
                    [{
                      text: `Hirer's signature and date - confirming booking details given are correct and that they have read and
                      understood the Terms and Conditions of hiring a room at Ashford Volunteer Centre:`,
                      style: 'table_cell'
                    }],
                    [{
                      image: 'signature'
                    }]
                  ]
                }
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
                bold: true
              },
              table_title_2: {
                alignment: "center" as any, // to avoid compilation error
                fontSize: 12,
                bold: true
              },
              table_cell: {
              },
              empty_line: {
                fontSize: 20,
              }
            },
            images: {
              avcLogo: avcLogo,
              signature: signatureURL
            }
          };
          try {
            const thePdf = pdfMake.createPdf(pdfDefinition, undefined, undefined, pdfFonts.pdfMake.vfs);
            resolve(new PdfData(thePdf));
          } catch (err) {
            console.error(err);
            reject(err);
          }
        });
      });
    });
  }

}
