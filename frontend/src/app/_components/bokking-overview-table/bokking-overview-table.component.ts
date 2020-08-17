import { Booking } from './../../_model/booking';
import { OrganizationService } from './../../_services/organization.service';
import { RoomService } from './../../_services/room.service';
import { Organization } from './../../_model/organization';
import { Room } from './../../_model/room';
import { BookingService } from './../../_services/booking.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatSort } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-bokking-overview-table',
  templateUrl: './bokking-overview-table.component.html',
  styleUrls: ['./bokking-overview-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BokkingOverviewTableComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  columnsToDisplay = ['room', 'date', 'startTime', 'endTime', 'organization'];
  expandedElement: PeriodicElement | null;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  bookings: Booking[];
  rooms: Room[];
  organizations: Organization[];
  filterCriteria = {
    selectedOrganizations: [],
    selectedRooms: [],
    dateFrom: new Date(),
    dateTo: new Date()
  };

  @Input()
  set bookingFilter(value: (booking) => boolean) {
    this._bookingFilter = value;
    this.getBookings();
  }

  _bookingFilter: (booking) => boolean = (booking) => true;

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService,
    private organizationService: OrganizationService
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'date':
          return data.booking.startDate.valueOf();
        case 'startTime':
            return data.booking.startDate.valueOf();
        case 'endTime':
            return data.booking.endDate.valueOf();
        default:
          return data[sortHeaderId];
      }
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return (
        this.filterCriteria.selectedRooms.map(room => room.id).includes(data.booking.roomId)
        && this.filterCriteria.selectedOrganizations.map(orga => orga.id).includes(data.booking.privateDataRef.organizationId)
        && (this.filterCriteria.dateFrom <= data.booking.startDate)
        && (this.filterCriteria.dateTo >= data.booking.endDate)
      );
    };
    const p = [];
    p.push(this.getRooms());
    p.push(this.getOrganizations());
    Promise.all(p).then(() => {
      this.getBookings();
    });
  }


  public doFilter = (value: string) => {
    const filter = value.trim().toLocaleLowerCase();
    this.dataSource.filter = filter;
  }

  getBookings() {
    this.bookingService.getBookings().subscribe(
      bookings => {
        this.bookings = bookings.filter(this._bookingFilter);
        this.dataSource.data = this.bookings.map(booking => {
          this.filterCriteria.dateFrom = new Date(Math.min(booking.startDate.valueOf(), this.filterCriteria.dateFrom.valueOf()));
          this.filterCriteria.dateTo = new Date(Math.max(booking.startDate.valueOf(), this.filterCriteria.dateTo.valueOf()));
          return {
            booking: booking,
            room: this.rooms.find((room: Room) => room.id === booking.roomId).name,
            date: booking.startDate.toLocaleDateString(),
            startTime: booking.startDate.toLocaleTimeString(),
            endTime: booking.endDate.toLocaleTimeString(),
            organization: this.organizations.find((orga: Organization) => orga.id === booking.privateDataRef.organizationId).name
          };
        });
      });
  }

  async getRooms() {
    return new Promise((resolve) => {
      this.roomService.getRooms().subscribe(
        rooms => {
          this.rooms = rooms;
          this.filterCriteria.selectedRooms = rooms;
          resolve();
      });
    });
  }

  async getOrganizations() {
    return new Promise((resolve) => {
      this.organizationService.getOrganizations().subscribe(
        organizations => {
          this.organizations = organizations;
          this.filterCriteria.selectedOrganizations = organizations;
          resolve();
      });
    });
  }

  selectOrganizations(value: Organization[]) {
    this.filterCriteria.selectedOrganizations = value;
    this.dataSource.filter = JSON.stringify(this.filterCriteria);
  }

  selectRooms(value: Room[]) {
    this.filterCriteria.selectedRooms = value;
    this.dataSource.filter = JSON.stringify(this.filterCriteria);
  }

  setDateFrom(value: Date) {
    this.filterCriteria.dateFrom = value;
    this.dataSource.filter = JSON.stringify(this.filterCriteria);
  }

  setDateTo(value: Date) {
    this.filterCriteria.dateTo = value;
    this.dataSource.filter = JSON.stringify(this.filterCriteria);
  }

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  }, {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
  }, {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  }, {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
  }, {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
  }, {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
  },
];

