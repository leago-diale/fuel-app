import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    loading: boolean = false
    validate: any = {}

    onInputChange(fieldName: string, value: any) {
        if (fieldName === 'username' ) {
            value.length !== 0 ? delete this.validate[fieldName] : this.validate = {...this.validate, username: true}
        }

        if (fieldName === 'password') {
            value.length !== 0 ? delete this.validate[fieldName]  : this.validate = {...this.validate, password: true}
        }
    }

    handleChange($event: any) {
        console.log($event)
    }

    submitForm() {
        // Access the values of username and password here
        this.loading = true;
        console.log(this.validate)
        this.validate = {}
        if (Object.keys(this.validate).length === 0) {
            if (this.username.length === 0) {
                this.validate = {...this.validate, username: true}
            }
    
            if (this.password.length === 0) {
                this.validate = {...this.validate, password: true}
            }
        }
        this.loading = false;
    }
}
