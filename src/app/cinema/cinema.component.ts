import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes; public cinemas; public salles;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTickets;

  constructor(public cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles().subscribe(data => {
      this.villes = data;
    }, error => {
      console.log(error);
    })
  }

  onGetCinemas(v) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v).subscribe(data => {
      this.cinemas = data;
    }, error => {
      console.log(error);
    })
  }

  onGetSalles(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c).subscribe(data => {
      this.salles = data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjections(salle).subscribe(data => {
          salle.projections = data;
        }, error => {
          console.log(error);
        })
      });
    }, error => {
      console.log(error);
    })
  }

  onGetTicketsPlaces(p) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p).subscribe(data => {
      this.currentProjection.tickets = data;
      this.selectedTickets = [];
    }, error => {
      console.log(error);
    })
  }

  onSelectTicket(t) {
    if (!t.selected) {
      t.selected=true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
  }

  getTicketClass(t) {
    let str = "btn ticket ";
    if (t.reserve==true) {
      str+="btn-danger"
    } else if (t.selected) {
      str+="btn-warning"
    }
     else {
       str+="btn-success"
     }
     return str;
  }

  onPayTickets(formData) {
    console.log("onPayTickets");
    let tickets = [];
    this.selectedTickets.forEach(t => {
      tickets.push(t.id);
    });
    formData.tickets = tickets;
    console.log(formData);
    this.cinemaService.payerTickets(formData).subscribe(data => {
      alert("Tickets Réservés avec succès");
      this.onGetTicketsPlaces(this.currentProjection);
    }, err => {
      console.log(err);
    })
  }
}
