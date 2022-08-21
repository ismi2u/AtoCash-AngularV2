import { CommonService } from 'src/app/services/common.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessAreaService } from 'src/app/services/businessarea.service';

@Component({
	selector: 'app-businessArea-list',
	templateUrl: './businessArea-list.component.html',
	styleUrls: ['./businessArea-list.component.scss'],
})
export class BusinessAreaListComponent implements OnInit {
	businessAreas: any;
	businessAreaHeaders: any = [
		'tableHeader.businessArea.businessAreaCode',
		'tableHeader.businessArea.businessAreaName',
		'tableHeader.businessArea.costCenter',
		'tableHeader.businessArea.status',
	];

	constructor(
		private _cdr: ChangeDetectorRef,
		private service: BusinessAreaService,
		private router: Router,
		private commonService:CommonService
	) {}

	ngOnInit(): void {
		this.commonService.loading.next(true);
		this.service.getBusinessAreas();
		this.service.BusinessAreas.subscribe((data) => {
			this.businessAreas = data;
			this._cdr.detectChanges();
		});
	}

	deleteRecord = (event) => {
		this.commonService.loading.next(true);
		this.service.deleteBusinessArea(event.id).subscribe(() => {
			this.service.getBusinessAreas();
		});
	};

	editRecord = (event) => {
		this.router.navigateByUrl(`/businessAreas/action/edit/${event.id}`);
	};
}
