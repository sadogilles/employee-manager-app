import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from './iemployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url:string="http://localhost:8080/employee";

  constructor(private http:HttpClient) { 
    
  }

  public getEmployees():Observable<IEmployee[]>{

    return this.http.get<IEmployee[]>(`${this.url}/all`);

  }

  public addEmployee(employee:IEmployee):Observable<IEmployee>{

    return this.http.post<IEmployee>(`${this.url}/add`,employee);

  }

  public deleteEmployee(employeeId:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/delete/${employeeId}`);
  }

  public updateEmployee(employee:IEmployee):Observable<IEmployee>{
    return this.http.put<IEmployee>(`${this.url}/update`,employee);
  }

  public findEmployeeById(employeeId:number):Observable<IEmployee>{
    return this.http.get<IEmployee>(`${this.url}/find/${employeeId}`);
  }
}
