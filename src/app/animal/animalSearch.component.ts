import {Component} from '@angular/core';
import {AuthenticationService, UserDetails} from '../authentication.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

import { environment } from '../../environments/environment';

@Component({
  templateUrl: './animalSearch.component.html'
})

export class AnimalSearchComponent {

  animals: string[];
  animalForm : FormGroup;
  details: UserDetails;

  constructor(private auth: AuthenticationService, private http: HttpClient) {
  }

  search = (text$: Observable<string[]>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.animals
    ));

  getAnimals(){
    let url = `${environment.baseApiUrl}/api/animals`;
    this.http.get<string[]>(url).subscribe(res=>this.animals=res);
  };

  ngOnInit() {
    this.animalForm = new FormGroup({name : new FormControl()});

    this.getAnimals();

    this.auth.profile().subscribe(user => {
      this.details = user;
    });
  }

  onSubmit() {
    if (this.animalForm.valid) {
      let url = `${environment.baseApiUrl}/api/newanimal`;
      this.http.post(url, {name:this.animalForm.controls.name.value,userId:this.details._id})
        .subscribe(res => console.log(res));
      this.animalForm.reset();
    }
  }
}
