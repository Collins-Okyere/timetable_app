import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { LocalDbService } from '../../../shared/services/local-db.service';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
})
export class TimetableComponent {
  Math = Math;
  page = 1;
  pageSize = 5;
  totalPages = 1;
  fetchedData: any;
  incomingRequests: any;
  currUser: any;

  // Modals
  showSwapModal = false;
  showRequestModal = false;

  // Swap / Requests
  selectedRequest: any;
  swapTargetId: any;
  swapMessage: string = '';

  constructor(private api: ApiService, private db: LocalDbService) {}

  async ngOnInit() {
    this.currUser = this.api.safeJSONParse('currUser');
    const neededData: any = ['timetables', 'incomingRequests', 'lecturers'];
    this.fetchedData = await this.api.fetchData(neededData);
    this.incomingRequests = [...this.fetchedData.incomingRequests];
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.fetchedData.timetables.length / this.pageSize
    );
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  openSwapModal(request: any) {
    this.showSwapModal = true;
    this.selectedRequest = request;
  }

  closeSwapModal() {
    this.showSwapModal = false;
    this.selectedRequest = null;
    this.swapTargetId = null;
    this.swapMessage = '';
  }

  markCompleted(item: any) {
    const lecturerId = item?.lecturer?.id ?? item?.lecturerId;
    if (lecturerId !== this.currUser?.id) return;
    item.status = 'Completed';
    item.loggedOutAt = new Date().toISOString();
  }

  markMissed(item: any) {
    const lecturerId = item?.lecturer?.id ?? item?.lecturerId;
    if (lecturerId !== this.currUser?.id) return;
    item.status = 'Missed';
    item.loggedOutAt = new Date().toISOString();
  }

  logStart(item: any) {
    const lecturerId = item?.lecturer?.id ?? item?.lecturerId;
    if (lecturerId !== this.currUser?.id) return;
    if (!item.loggedInAt) {
      item.loggedInAt = new Date().toISOString();
      item.status = 'Ongoing';
    }
  }

  logEnd(item: any) {
    const lecturerId = item?.lecturer?.id ?? item?.lecturerId;
    if (lecturerId !== this.currUser?.id || !item.loggedInAt) return;
    item.loggedOutAt = new Date().toISOString();
    item.status = 'Completed';
  }

  confirmSwapRequest() {
    if (!this.selectedRequest || !this.swapTargetId) return;

    const req: any = {
      id: 'req-' + Math.random().toString(36).substr(2, 9),
      requestId: this.selectedRequest.id,
      fromLecturer: this.currUser,
      toLecturer: this.swapTargetId,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      message: this.swapMessage || undefined,
    };

    this.incomingRequests.push(req);
    this.closeSwapModal();
  }

  viewRequest(r: any) {
    this.selectedRequest = r;
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
  }

  approveRequest(r: any) {
    console.log('Approved request', r);
    this.incomingRequests = this.incomingRequests.filter(
      (req: any) => req.id !== r.id
    );
    this.closeRequestModal();
  }

  declineRequest(r: any) {
    console.log('Declined request', r);
    this.incomingRequests = this.incomingRequests.filter(
      (req: any) => req.id !== r.id
    );
    this.closeRequestModal();
  }
}
