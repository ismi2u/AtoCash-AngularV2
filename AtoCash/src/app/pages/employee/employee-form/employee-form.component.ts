import { CommonService } from 'src/app/services/common.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { constant } from './../../../constant/constant';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalGroupsService } from 'src/app/services/approval-groups.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeTypesService } from 'src/app/services/employee-types.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RolesService } from 'src/app/services/roles.service';
import { BusinessAreaService } from 'src/app/services/businessarea.service';
import { StatusService } from 'src/app/services/status.service'; 
import {BankService} from 'src/app/services/bank.service';

@Component({
	selector: 'app-employee-form',
	templateUrl: './employee-form.component.html',
	styleUrls: ['./employee-form.component.scss'],
})


export class EmployeeFormComponent implements OnInit {
	form!: FormGroup;
	recordId: any;
	mode: any = 'add';
	groups = [];
	roles = [];
	employeeTypes = [];
	departments = [];
	nationalities = [];
	dojValidation;
	businessAreas=[];
	status = [];
	currencies = [];
	BAroles=[];
	BankList=[];

	constructor(
		private fb: FormBuilder,
		private snapshot: ActivatedRoute,
		private employeeService: EmployeeService,
		private router: Router,
		private approvalGroupsService: ApprovalGroupsService,
		private employeeTypesService: EmployeeTypesService,
		private rolesService: RolesService,
		private departmentService: DepartmentService,
		private translate: TranslateService,
		private statusService: StatusService,
		private currencyService: CurrencyService,
		private commonService: CommonService, 
		private businessAreaService: BusinessAreaService,
		private bankService:BankService,
	) {}

	ngOnInit(): void {
		this.statusService.getStatusList().subscribe((response: any) => {
			this.status = response.data;
		});
		this.currencyService.getCurrencyList().subscribe((response: any) => {
			this.currencies = response.data;
		});
	
		this.nationalities = constant.nationality;
		this.approvalGroupsService
			.getApprovalGroupsList()
			.subscribe((response: any) => {
				this.groups = response.data;
			});
	
		this.rolesService.getJobRoleListSpecific(false).subscribe((response: any) => {
			this.roles = response.data;
			// this.employeeTypesService.getEmploymentTypes();
		});
	
		this.employeeTypesService
			.getEmploymentTypesList()
			.subscribe((response: any) => {
				this.employeeTypes = response.data;
			});
	
		this.departmentService.getDepartmentList().subscribe((response: any) => {
			this.departments = response.data;
		});
	
		this.businessAreaService.getBusinessAreaList().subscribe((response: any) => {
			this.businessAreas = response.data;
		}); 
	
		this.rolesService.getJobRoleListSpecific(true).subscribe((response: any) => {
			this.BAroles = response.data;
		});
	
		this.bankService.getBankList().subscribe((response: any) => {
			this.BankList = response.data;
		});

		this.snapshot.params.subscribe((param) => {
			if (param.type === 'edit') {
				this.mode = param.type;
				this.employeeService
					.getEmployeeById(param.id)
					.subscribe((response: any) => {
						this.recordId = param.id;
						delete response.data.id;
						delete response.data.fullName;
						delete response.data.employmentType;
						delete response.data.department;
						delete response.data.bankName;
						delete response.data.jobRole;
						delete response.data.approvalGroup;
						delete response.data.businessArea;
						delete response.data.businessAreaApprovalGroup;
						delete response.data.businessAreaRoleName;
						delete response.data.statusType;
						this.form.setValue(response.data);
						this.commonService.loading.next(false);
					});
			 } else {
				this.commonService.loading.next(false);
			 }
		});

		this.form = this.fb.group({
			firstName: [null,[Validators.required]],
			middleName: [null],
			lastName: [null,[Validators.required]],
			empCode: [null, [Validators.required]],
			bankId: [null, [Validators.required]],
			iban: [null],
			bankAccount: [null,
				[
					Validators.required,
					Validators.pattern('^(0|[1-9][0-9]*)$'),
					Validators.minLength(10),
				]
			],
			bankCardNo: [null,
				[
					Validators.required,
					Validators.pattern('^(0|[1-9][0-9]*)$'),
					Validators.minLength(16),
					Validators.maxLength(16),
				]
			],
			nationalID: [null],
			passportNo: [null],
			taxNumber: [null, [Validators.pattern('^(0|[1-9][0-9]*)$')]],
			nationality: [null, [Validators.required]],
			email: [
				null,
				[
					Validators.required,
					Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
				]
			],
			mobileNumber: [
				null,
				[
					Validators.required,
					Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'),
				],
			],
			
			dob: [null, [Validators.required]],
			doj: [null, [Validators.required]],
			gender: [null, [Validators.required]],
			departmentId: [null, [Validators.required]],			
			approvalGroupId: [null, [Validators.required]],
			roleId: [null, [Validators.required]],
			businessAreaId:[0],
			businessAreaApprovalGroupId:[0],			
			businessAreaRoleId:[0],
			employmentTypeId: [null, [Validators.required]],
			currencyTypeId: [null, [Validators.required]],
			statusTypeId: [null, [Validators.required]],
		});

		this.form.controls['doj'].valueChanges.subscribe((value) => {
			const selectedValue = new Date(value).setHours(0, 0, 0, 0);
			const dobValue = new Date(this.form.controls['dob'].value).setHours(
				0,
				0,
				0,
				0,
			);
			if (
				value &&
				new Date(selectedValue).getTime() <= new Date(dobValue).getTime()
			) {
				this.form.controls['doj'].setValue(null);
			}
		});

	}

	getButtonLabel = () => {
		return this.mode !== 'edit'
			? this.translate.instant('button.create')
			: this.translate.instant('button.update');
	};

	

	submitForm(): void {
		this.commonService.loading.next(true);
		for (const i in this.form.controls) {
			this.form.controls[i].markAsDirty();
			this.form.controls[i].updateValueAndValidity();
		}

		if (this.mode === 'edit') {
			this.employeeService
				.updateEmployeeById(this.recordId, {
					...this.form.value,
					id: this.recordId,
				})
				.subscribe(
					(data: any) => {
						if (data.success) {
							this.router.navigateByUrl(`/employee/list`);
						}
					},
					(err) => {},
				);
		} else {
			this.employeeService.addEmployee(this.form.value).subscribe(
				(data: any) => {
					if (data.success) {
						this.router.navigateByUrl(`/employee/list`);
					}
				},
				(err) => {},
			);
		}
	}

}