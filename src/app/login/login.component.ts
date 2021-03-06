import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

/**
 * Send login form data and check if the respective user exist inside API
 * @export LoginComponent
 * @class LoginComponent
 * @implements {OnInit}
 */
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	loginFrom: FormGroup;
	formIsvalid: boolean;

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		private router: Router
	) {}

	/**
	 * Init event of Angular component
	 * @memberof LoginComponent
	 */
	ngOnInit() {
		this.loginFrom = this.fb.group({
			id: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(5)
				])
			],
			passwd: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(8)
				])
			]
		});
	}

	get userId() {
		return (
			this.loginFrom.controls.id.valid ||
			this.loginFrom.controls.id.pristine
		);
	}
	get userPass() {
		return (
			this.loginFrom.controls.passwd.valid ||
			this.loginFrom.controls.passwd.pristine
		);
	}

	isValid() {
		const formData = new FormData();
		if (this.loginFrom.invalid) {
			this.formIsvalid = false;
		} else {
			formData.append("id", this.loginFrom.controls.id.value);
			formData.append("passwd", this.loginFrom.controls.passwd.value);
			this.http
				.post(
					"https://beca-sn-pwa-instantapps-api.herokuapp.com/login",
					formData
				)
				.subscribe(response => {
					if (response == null) {
						this.formIsvalid = false;
					} else {
						localStorage.setItem(
							"userProps",
							JSON.stringify(response["logado"])
						);
						localStorage.setItem("isLoggedIn", "true");
						this.router.navigate(["profiles"]);
					}
				});
		}
	}
}
