import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/servicios/game/game.service';
import { Game } from 'src/app/interfaces/game/Game';
import { TicketService } from 'src/app/servicios/ticket/ticket.service';
import { Ticket } from 'src/app/interfaces/ticket/Ticket'; // Asegúrate de importar la interfaz o clase Ticket
import { GameLogicService } from '../../service/gameLogic/game-logic.service';
import { DashboardPublicityService } from 'src/app/servicios/publicity/dashboardPublicity/dashboard-publicity.service';
import { DashboardStyleService } from 'src/app/servicios/theme/dashboardStyle/dashboard-style.service';
import { ThemeService } from 'src/app/servicios/theme/theme.service';

@Component({
  selector: 'app-selectiongame-view',
  templateUrl: './selectiongame-view.component.html',
  styleUrls: ['./selectiongame-view.component.css']
})
export class SelectiongameViewComponent implements OnInit {
  informationText: string = "ELIGE UN JUEGO";
  allGames: Game[] = [];
  gameId: number | undefined;
  ticket: Ticket | undefined;
  ticketId: Number | undefined;

  image_background?: string = "";

  gameRoutes: { [key: string]: string } = {
    "Dados": "rolldice",
    "Tragamonedas": "play",
    "Precision": "precision",
    "Puertas": "puertas"
  };

  constructor(
   private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute, // Inyectar ActivatedRoute
    private ticketService: TicketService,
    private gameLogicService: GameLogicService,
    public dashPublicity: DashboardPublicityService,
    public styles: DashboardStyleService,
    private theme: ThemeService,
  ) {}

  ngOnInit(): void {
      this.gameService.getAll().subscribe((data) => {
      this.allGames = data;
      });

      this.theme.getDesignInformation().subscribe((designData) => {
        this.styles.loadData(designData[0]);
      });
  }

  

  navigateTo(gameName: string, gameId: number) {
    const route = this.gameRoutes[gameName];
    if (route) {
      this.router.navigate([`/${route}`], { queryParams: { gameId: gameId,reload: true } });
    } else {
      console.error(`No se encontró una ruta para el juego ${gameName}`);
    }
  }

  

}
