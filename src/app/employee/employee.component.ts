import { Component, OnInit} from '@angular/core';
import { EmployeeService} from './employee_service/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers :[EmployeeService]
})
export class EmployeeComponent implements OnInit  {
  displayedColumns: string[] = ['id', 'name', 'username', 'email','phone','website','company','edit' ,'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  private testInfo = [];
  statusMessage: any;
  form:FormGroup;
  employee_id: any;
  
  constructor(private employee_service : EmployeeService,private router:Router,
    fb:FormBuilder){

    this.form=fb.group({
      name:["", [Validators.required ,noWhitespaceValidator ]],
      username:["", [Validators.required ,noWhitespaceValidator ]],
      email:["", [ Validators.required, noWhitespaceValidator]],
       id:[""],
       phone:["",[Validators.required,noWhitespaceValidator]],
       website:["" ],
      // address : fb.group({
      //   street :[""],
      //   suite :[""],
      //   city :[""],
      //   zipcode :[""],
      //   geo :fb.group({
      //     lat :[""],
      //     lng :[""]
      //   })
      // }),
    //  website:[""],
      // company : fb.group({
      //   name:[""],
      //   catchPhrase:[""],
      //   bs :[""]
      // }),
    })
  }
  ngOnInit(){
    this.employee_service.getHistory()
    .subscribe(
    ShowData => {
        this.testInfo = ShowData;
        this.dataSource =  new MatTableDataSource(this.testInfo)
        }, error => {
        this.statusMessage = error;
    });
  }
 
   submit(){
    if(this.form.valid)
    {
      if(this.employee_id == undefined ){
     this.employee_service.saveData(this.form.value).subscribe(
       data=>{
        console.log(data);
        this.dataSource.data.push(data);
        this.dataSource._updateChangeSubscription();
       // this.form.reset();
       },error=>{
         this.statusMessage = error;
       })
      }
      else{
        this.employee_service.updateData(this.form.value).subscribe(
          data=>{
           console.log(data);
           this.dataSource.data[data.id -1] = this.form.value;
           this.dataSource._updateChangeSubscription();
           alert("updated successfully")
          //  this.form.reset();
          },error=>{
            this.statusMessage = error;
          }
        )
      }
    }
    else{
      alert("Please Fill The Required Fields")
    }
  }
  removeEmp(n: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
          this.dataSource.data.splice(n-1,1);
          this.dataSource._updateChangeSubscription();
      }
    })
  }

  public edittUser(employee, i) {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    this.employee_id = i;
    this.form.setValue({
      id: i,
      name: employee.name,
      username: employee.username,
      email: employee.email,
      phone: employee.phone,
      website : employee.website
    });
  }

}


export function noWhitespaceValidator(control: FormControl) {
 // const isSpace = (control.value || '').match(/\s/g);
  const isSpace = control.value.startsWith(' ') || control.value.endsWith(' ')
  return isSpace ? {'whitespace': true} : null;
}