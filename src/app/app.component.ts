import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeeService } from './employee.service';
import { IEmployee } from './iemployee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'employee-manager-app';
  
  sub!:Subscription; //subscription variable

  public employeeList:IEmployee[]=[];

  constructor(private employeeService:EmployeeService){}
  

  ngOnInit():void{
    this.getEmployees(); // call the api on initialisation
  }

  private getEmployees():void{
    this.sub=this.employeeService.getEmployees().subscribe( //deprecated
    (response:IEmployee[])=>{
      this.employeeList = response;
    },
    (error:HttpErrorResponse)=>{
      alert(error.message);
    }
    );
  }
  private getEmployees2():void{
    this.sub=this.employeeService.getEmployees().subscribe({
      next:employee=>{this.employeeList=employee;},
      error:err=>{alert(err.message);},
      complete:()=>{
        console.log("reception of data completed");
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe(); //unscribing
  }

}
