import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
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

  public filteredEmployee:IEmployee[]=[];

  private _employeeFilter!:string; //field is empty, if you add data input field will contain the data as getter is called 
  
  public editEmployee!: IEmployee | null; // ! means i will initialize the employee later | is or operator

  public deleteEmployee!:IEmployee | null;

  constructor(private employeeService:EmployeeService){}
  
  get employeeFilter(){ //employeeFilter in template is bind to this property [(ngModel)]="employeeFilter"
    return this._employeeFilter;
  }

  set employeeFilter(filter:string){//employeeFilter in template is bind to this property [(ngModel)]="employeeFilter" // the filter parameter contains the value of input field employeeFilter in html
    this._employeeFilter=filter; //_employeeFilter is equal to the value of the input field
    this.filteredEmployee = this.performEmployeeFilter(this._employeeFilter);
  }

   public performEmployeeFilter(filter:string){
        return this.employeeList
        .filter((e)=> {
          return e.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          ||e.email.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          ||e.employeeCode.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          ||e.jobTitle.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          ||e.phone.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        }
        );
   }

  //  performing filter way 2 using ngModalChange 
  searchEmployee(key: any) {
     console.log(key);
     const results:IEmployee[]=[];
     for(const employee of this.employeeList){
        if(employee.name.toLowerCase().indexOf(key.toLocaleLowerCase())!==-1){
          results.push(employee);
        }
     }
     this.employeeList = results;
     if(results.length===0 || !key){ // if employee isnot found or no key is set, get the employee
      this.getEmployees2();
     }
    }

  ngOnInit():void{
    // this.getEmployees(); // call the api on initialisation
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
      next:employee=>{this.employeeList=employee;this.filteredEmployee=employee },
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
    if (mode==='add')
    {
      btn.setAttribute('data-target','#employeeAddModal');
      this.deleteEmployee = employee;

    }
    if (mode==='delete')
    {
      btn.setAttribute('data-target','#employeeDeleteModal');
      this.deleteEmployee = employee;

    }else if (mode==='update'){
      btn.setAttribute('data-target','#employeeUpdateModal');
      this.editEmployee=employee; // get the employee to display in ui
      
    }
    displayContainer?.appendChild(btn);
    
    console.log(btn); // display the dynamic button created in console

    btn.click();

  }

  onAddEmployee(addForm: NgForm) {
    console.log(addForm.value);
    this.employeeService.addEmployee(addForm.value).subscribe(
    {
      next:employee=>{
          console.log(employee);
          this.getEmployees();
          addForm.reset(); // reset the form as during the addition of a new employee the data on the form is preceived
      },
      error:err=>{
        alert(err.message);
        addForm.reset();
      }
    });
    document.getElementById('add-modal-close-btn')?.click(); //close the form by clicking the X button
  }

  onModifyEmployee(modifyFormData:IEmployee) {
    console.log(modifyFormData); 

    this.employeeService.updateEmployee(modifyFormData).subscribe({
      next:employee=>{
         console.log(employee);
         this.getEmployees();
      },
      error:err=>alert(err.message)
    });

    document.getElementById('modal-update-add-button')?.click();
  }

  onDeleteEmployee() :void{
    
    console.log('delete employee : '+this.deleteEmployee?.id); //delete-modal-close-btn-tag
    this.employeeService.deleteEmployee(this.deleteEmployee?.id).subscribe({
      next:employee=>{console.log('employee with id : '+this.deleteEmployee?.id +'will be deleted'); this.getEmployees()},
      error:err=> {alert(err.message)}
    });

    document.getElementById('delete-modal-close-btn-tag')?.click();
  }

}