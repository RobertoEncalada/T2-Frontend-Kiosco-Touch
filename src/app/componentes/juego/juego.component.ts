import { AwardsService } from "src/app/servicios/awards/awards.service"
import { GameLogicService } from "./service/gameLogic/game-logic.service"
import { GameService } from "src/app/servicios/game/game.service"
import { AuthService } from "src/app/servicios/auth/auth.service"
import { AfterViewInit, Component, OnInit } from "@angular/core"
import { ThemeService } from "./service/theme/theme.service"
import { DashboardStyleService } from "../../servicios/theme/dashboardStyle/dashboard-style.service"
import { DashboardPublicityService } from "../../servicios/publicity/dashboardPublicity/dashboard-publicity.service"
import { PublicityService } from "../../servicios/publicity/publicity.service"
import { Subscription } from "rxjs"
import { NavigationEnd, NavigationStart, Router } from "@angular/router"
import { filter } from "rxjs/operators"
import { ConfirmDialogService } from "src/app/servicios/confirm-dialog/confirm-dialog.service"
import { AudioService } from "src/app/servicios/audio/audio.service"
import { Audio } from "src/app/interfaces/audio/Audio"

@Component({
	selector: "app-juego",
	templateUrl: "./juego.component.html",
	styleUrls: ["./juego.component.css"],
})
export class JuegoComponent {
	backgroundImgUrl = ""
	buttonTitle: string = ""
	logoImage?: string = ""
	videoUrl: string = ""

	boxes_images: number = 0
	design_images: number = 0

	audio = new Audio()
	audioArray: Audio[] = []

	constructor(
		public dashPublicity: DashboardPublicityService,
		private themeService: ThemeService,
		private styles: DashboardStyleService,
		private publicity: PublicityService,
		private router: Router,
		private AuthSrv: AuthService,
		private GameSrv: GameService,
		private confirmDialog: ConfirmDialogService,
		private Gamelogic: GameLogicService,
		private audioService: AudioService
	) {}

	// async ngAfterViewInit(): Promise<void> {
	// 	// this.audio.loop;
	// 	this.audio.play()
	// }

	async ngOnInit(): Promise<void> {
		// this.audioService.getAll().subscribe((data) => {
		// 	this.audioArray = data
		// 	this.audio.src = this.audioArray[0].audio
		// 	// console.log(this.audio.src);
		// })

		// let today = new Date();
		// console.log(today)
		// this.Gamelogic.changeStateTicket(1)
		await this.auth()
		this.validateSlot()
		sessionStorage.removeItem("juego_scan")
		sessionStorage.removeItem("juego_play")
		this.publicity.getPublicityTopList().subscribe((dataTopPublicity) => {
			if (dataTopPublicity.length > 0) {
				this.dashPublicity.loadTopData(dataTopPublicity)
				// console.log(dataTopPublicity);
				this.publicity.getPublicityBottomList().subscribe((dataBottomPublicity) => {
					this.dashPublicity.loadBottomData(dataBottomPublicity)
				})
			}
			this.themeService.getDesignInformation().subscribe((data) => {
				this.styles.loadData(data[0])
				this.buttonTitle = this.styles.get_title_button_screensaver()
				this.logoImage = this.styles.get_image_logo_game()
				this.videoUrl = this.styles.get_video_screensaver()
				// console.log(this.themeService.publicityGameList);
			})
		})
	}
	async goScan() {
		// this.Gamelogic.deleteAwardConditionPast()
		await this.validateSlot()
		if (this.boxes_images == 10 && this.design_images == 3) {
			this.router.navigate(["/juego/scan"])
			sessionStorage.setItem("juego_scan", "juego_scan")
		} else {
			let game_message = [
				"Revise que esten todas las imágenes de las casillas",
				"Revise que este el contenedor del juego",
				"Revise que este el logo del juego",
				"Revise que este la imagen al ganar",
			]
			this.confirmDialog.error(game_message)
		}
	}
	async auth() {
		let formData: FormData = new FormData()
		formData.append("username", "admin")
		formData.append("password", "admin")
		this.AuthSrv.auth_token(formData).subscribe((data: any) => {
			sessionStorage.setItem("token", data.access)
			sessionStorage.setItem("refresh", data.refresh)
		})
	}

	async validateSlot() {
		this.GameSrv.getPublicityGame().subscribe((data: any) => {
			for (let clave of data) {
				if (clave.image) {
					this.boxes_images += 1
				}
			}
		})
		this.GameSrv.getDesign().subscribe((data: any) => {
			for (let clave of data) {
				if (clave.image_machine_game) {
					this.design_images += 1
				}
				if (clave.image_logo_game) {
					this.design_images += 1
				}
				if (clave.image_winner) {
					this.design_images += 1
				}
			}
		})
	}
}
