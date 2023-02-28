import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit  {
  showPasswordStatus: boolean = false;
  showDetails: boolean=true;
  setPassForm: FormGroup ;
  token : string;
  successMessage: string;
  errorMessage: string;

  constructor(    
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute){}


  ngOnInit(){


    this.setPassForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}') ]],
      newPasswordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}') ]]
    })

  }

  OnPasswordToggle(){
    this.showPasswordStatus = !this.showPasswordStatus;
   }
   onStrengthChanged(strength: number) {
  }

  onResetPass(form:FormGroup){
    this.route.params.subscribe( (param) =>{
      this.token = param.token
    } )

    const newPassword = form.value.newPassword
    const newPasswordConfirm = form.value.newPasswordConfirm



    this.authService.changeForgottenPassword(
            this.token,
            newPassword,
            newPasswordConfirm
    ).subscribe( (data:any)=>{
      this.successMessage  = data
    }, (error) =>{
      this.errorMessage = error
    })

  }


}
