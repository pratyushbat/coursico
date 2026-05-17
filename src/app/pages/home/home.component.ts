import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  ngOnInit(): void {
  //  this.getMessgae()
  }
  private readonly httpClient= inject(HttpClient)
  title = 'coursico';

  getMessgae(){

    return this.httpClient.get('/api/hello').subscribe(data=>console.log(data));
  }
  getProducts(){

     this.httpClient.get('/api/product/all').subscribe(data=>console.log(data));
  }
}
