import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CompanyCategory } from 'src/models/company.category.model';
import { Order, Orderproduct, Product } from 'src/models';


@Injectable({
  providedIn: 'root'
})
export class OrderProductsService {


  
  url: string;

  constructor(
    private http: HttpClient
  ) {
  
    this.url = environment.API_URL;
  }

  getByOtherId(otherId: string) {
    return this.http.get<CompanyCategory>(`${this.url}/api/order_products/get-by-otherid.php?OtherId=${otherId}`)
  }

  update(image: Orderproduct) {
    return this.http.post<Order>(
      `${this.url}/api/order_products/update-order_product.php`, image
    );
  }
  updateRange(Orderproduct: Orderproduct[]) {
    return this.http.post<Product>(
      `${this.url}/api/order_products/update-image-range.php`, Orderproduct
    );
  }
  add(company: Orderproduct) {
    return this.http.post<Order>(
      `${this.url}/api/order_products/add-order_product.php`, company
    );
  }



}
