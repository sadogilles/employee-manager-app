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
  title = 'Employee Management Application';
  
  sub!:Subscription; //subscription variable

  public employeeList:IEmployee[]=[];

  constructor(private employeeService:EmployeeService){}
  

  ngOnInit():void{
    this.getEmployees(); // call the api on initialisation
    this.getEmployees2(); // set the employee variable
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

  public onOpenModel(employee:IEmployee|null,mode:string):void{
  
    const displayContainer = document.getElementById('main-container'); //get the container to display the modal

    const btn = document.createElement('button'); // by default btn is of type submit
    btn.type='button'; //set the type of btn
    btn.style.display='none'; // hide the button
    btn.setAttribute('data-toggle','modal'); //set the data-toggle property to modal
    
    //check the mode to display the appropriate model 
    if(mode==='add'){
      btn.setAttribute('data-target','#employeeAddModal');
    }else if (mode==='delete')
    {
      btn.setAttribute('data-target','#employeeDeleteModal');
    }else if (mode==='update'){
      btn.setAttribute('data-target','#employeeUpdateModal');
    }
    displayContainer?.appendChild(btn);
    
    console.log(btn); // display the dynamic button created in console

    btn.click();

  }

}
