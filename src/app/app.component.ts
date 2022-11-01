import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './iemployee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employee-manager-app';
  
  public employeeList:IEmployee[]=[];

  constructor(private employeeService:EmployeeService){}

  ngOnInit(){
    this.getEmployees(); // call the api on initialisation
  }

  private getEmployees():void{
    this.employeeService.getEmployees().subscribe(
    (response:IEmployee[])=>{
      this.employeeList = response;
    },
    (error:HttpErrorResponse)=>{
      alert(error.message);
    }
    );
  }
  
}
