import { Component } from '@angular/core';
import { CardModule } from "primeng/card";
import { MonthlySales } from "./monthly-sales/monthly-sales";

@Component({
  selector: 'app-dashboard-header',
  imports: [CardModule, MonthlySales],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss'
})
export class DashboardHeader {

}
