import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of, catchError, tap, switchMap } from "rxjs";
import { UserService } from "./user.service";
import { MachineService } from "./machine.service";
import { DemandeService } from "./demande.service";
import { MetierService } from "./metier.service";
import { AppUser, UserRole } from "../models/user.model";
import { Ilot, Machine, Programme } from "../models/ilot.model";
import { Demande, DemandeDelegue, DemandeFinale, DemandeTe } from "../models/demande.model";
import { Metier } from "../models/metier.model";

@Injectable({
  providedIn: "root",
})
export class DataInitializerService {
  private initialized = false;

  constructor(
    private userService: UserService,
    private machineService: MachineService,
    private demandeService: DemandeService,
    private metierService: MetierService,
    private http: HttpClient
  ) {
    // Reset the initialized flag when the service is created
    this.initialized = false;
  }

  /**
   * Initialize the database with sample data
   */
  initializeData(): Observable<boolean> {
    if (this.initialized) {
      return of(true);
    }

    return forkJoin({
      roles: this.initializeRoles(),
      users: this.initializeUsers(),
      ilots: this.initializeIlots(),
      machines: this.initializeMachines(),
      metiers: this.initializeMetiers(),
      demandes: this.initializeDemandes(),
      demandesDelegue: this.initializeDemandesDelegue(),
      demandesFinale: this.initializeDemandesFinale(),
      demandesTe: this.initializeDemandesTe()
    }).pipe(
      switchMap(result => {
        this.initialized = true;
        console.log("Database initialized with sample data");
        return of(true);
      }),
      catchError(error => {
        console.error("Error initializing database:", error);
        return of(false);
      })
    );
  }

  /**
   * Initialize roles
   */
  private initializeRoles(): Observable<UserRole[]> {
    return this.userService.getAllRoles().pipe(
      tap(roles => {
        if (roles.length === 0) {
          // Roles don't exist yet, create them
          const rolesToCreate: UserRole[] = [
            { roleName: "ROLE_ADMIN", description: "Administrator" },
            { roleName: "ROLE_MANAGER", description: "Manager" },
            { roleName: "ROLE_CONTROLEUR", description: "Controleur" },
            { roleName: "ROLE_OPERATEUR", description: "Operateur" }
          ];

          // Since there's no batch create for roles, we'll just log this
          console.log("Roles need to be created on the backend");
        } else {
          console.log("Roles already exist");
        }
      }),
      catchError(error => {
        console.error("Error checking roles:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize users
   */
  private initializeUsers(): Observable<AppUser[]> {
    return this.userService.getAllUsers().pipe(
      tap(users => {
        if (users.length === 0) {
          // Users don't exist yet, create them
          const usersToCreate: AppUser[] = [
            {
              username: "admin",
              email: "admin@example.com",
              password: "admin123",
              firstName: "Admin",
              lastName: "User",
              roles: [{ roleName: "ROLE_ADMIN" }]
            },
            {
              username: "manager",
              email: "manager@example.com",
              password: "manager123",
              firstName: "Manager",
              lastName: "User",
              roles: [{ roleName: "ROLE_MANAGER" }]
            },
            {
              username: "controleur",
              email: "controleur@example.com",
              password: "controleur123",
              firstName: "Controleur",
              lastName: "User",
              roles: [{ roleName: "ROLE_CONTROLEUR" }]
            },
            {
              username: "operateur",
              email: "operateur@example.com",
              password: "operateur123",
              firstName: "Operateur",
              lastName: "User",
              roles: [{ roleName: "ROLE_OPERATEUR" }]
            }
          ];

          // Create users one by one
          for (const user of usersToCreate) {
            this.userService.createUser(user).subscribe({
              next: createdUser => console.log(`User ${createdUser.username} created`),
              error: error => console.error(`Error creating user ${user.username}:`, error)
            });
          }
        } else {
          console.log("Users already exist");
        }
      }),
      catchError(error => {
        console.error("Error checking users:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize ilots
   */
  private initializeIlots(): Observable<Ilot[]> {
    return this.machineService.getAllIlots().pipe(
      tap(ilots => {
        if (ilots.length === 0) {
          // Ilots don't exist yet, create them
          const ilotsToCreate: Ilot[] = [
            { name: "Ilot A", description: "Production Line A", location: "Building 1" },
            { name: "Ilot B", description: "Production Line B", location: "Building 1" },
            { name: "Ilot C", description: "Production Line C", location: "Building 2" },
            { name: "Ilot D", description: "Production Line D", location: "Building 2" }
          ];

          // Since there's no create method for ilots in the service, we'll use direct HTTP call
          for (const ilot of ilotsToCreate) {
            this.http.post("http://localhost:8080/api/ilots", ilot).subscribe({
              next: createdIlot => console.log(`Ilot ${ilot.name} created`),
              error: error => console.error(`Error creating ilot ${ilot.name}:`, error)
            });
          }
        } else {
          console.log("Ilots already exist");
        }
      }),
      catchError(error => {
        console.error("Error checking ilots:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize machines
   */
  private initializeMachines(): Observable<Machine[]> {
    return this.machineService.getAllMachines().pipe(
      switchMap(machines => {
        if (machines.length === 0) {
          // Get ilots first to associate machines with them
          return this.machineService.getAllIlots().pipe(
            switchMap(ilots => {
              if (ilots.length > 0) {
                // Machines don't exist yet, create them
                const machinesToCreate: Machine[] = [
                  { name: "Machine 1", type: "Type A", model: "Model X", serialNumber: "SN001", ilot: ilots[0] },
                  { name: "Machine 2", type: "Type B", model: "Model Y", serialNumber: "SN002", ilot: ilots[0] },
                  { name: "Machine 3", type: "Type A", model: "Model Z", serialNumber: "SN003", ilot: ilots[1] },
                  { name: "Machine 4", type: "Type C", model: "Model X", serialNumber: "SN004", ilot: ilots[1] },
                  { name: "Machine 5", type: "Type B", model: "Model Y", serialNumber: "SN005", ilot: ilots[2] },
                  { name: "Machine 6", type: "Type C", model: "Model Z", serialNumber: "SN006", ilot: ilots[2] },
                  { name: "Machine 7", type: "Type A", model: "Model X", serialNumber: "SN007", ilot: ilots[3] },
                  { name: "Machine 8", type: "Type B", model: "Model Y", serialNumber: "SN008", ilot: ilots[3] }
                ];

                // Create machines one by one using forkJoin to wait for all to complete
                const createObservables = machinesToCreate.map(machine =>
                  this.machineService.createMachine(machine).pipe(
                    tap(createdMachine => console.log(`Machine ${createdMachine.name} created`)),
                    catchError(error => {
                      console.error(`Error creating machine ${machine.name}:`, error);
                      return of(null);
                    })
                  )
                );

                return forkJoin(createObservables).pipe(
                  tap(() => console.log("All machines created")),
                  switchMap(() => this.machineService.getAllMachines())
                );
              } else {
                console.log("No ilots found to associate with machines");
                return of(machines);
              }
            })
          );
        } else {
          console.log("Machines already exist");
          return of(machines);
        }
      }),
      catchError(error => {
        console.error("Error checking machines:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize metiers
   */
  private initializeMetiers(): Observable<Metier[]> {
    return this.metierService.getAllMetiers().pipe(
      tap(metiers => {
        if (metiers.length === 0) {
          // Metiers don't exist yet, create them
          const metiersToCreate: Metier[] = [
            { name: "Operator", description: "Machine operator", category: "Production", requiredSkills: ["Technical knowledge", "Attention to detail"] },
            { name: "Technician", description: "Machine technician", category: "Maintenance", requiredSkills: ["Technical knowledge", "Problem solving"] },
            { name: "Quality Control", description: "Quality control specialist", category: "Quality", requiredSkills: ["Attention to detail", "Quality standards"] },
            { name: "Supervisor", description: "Production supervisor", category: "Management", requiredSkills: ["Leadership", "Organization"] }
          ];

          // Create metiers one by one
          for (const metier of metiersToCreate) {
            this.metierService.createMetier(metier).subscribe({
              next: createdMetier => console.log(`Metier ${createdMetier.name} created`),
              error: error => console.error(`Error creating metier ${metier.name}:`, error)
            });
          }
        } else {
          console.log("Metiers already exist");
        }
      }),
      catchError(error => {
        console.error("Error checking metiers:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize demandes
   */
  private initializeDemandes(): Observable<Demande[]> {
    return this.demandeService.getAllDemandes().pipe(
      switchMap(demandes => {
        if (demandes.length === 0) {
          // Get users, ilots, and machines to associate with demandes
          return forkJoin({
            users: this.userService.getAllUsers(),
            ilots: this.machineService.getAllIlots(),
            machines: this.machineService.getAllMachines()
          }).pipe(
            switchMap(({ users, ilots, machines }) => {
              if (users.length > 0 && ilots.length > 0 && machines.length > 0) {
                // Find users by role
                const operateur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_OPERATEUR"));
                const controleur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_CONTROLEUR"));

                // Demandes don't exist yet, create them
                const demandesToCreate: Demande[] = [
                  {
                    of_demande: "OF001",
                    date_demande: new Date().toISOString(),
                    status: "EN_ATTENTE",
                    duree_en_minutes: 60,
                    etq: "ETQ001",
                    started: false,
                    finished: false,
                    nombre_produit_controle: 100,
                    ilot: ilots[0],
                    machine: machines[0],
                    operateur: operateur,
                    controleur: controleur
                  },
                  {
                    of_demande: "OF002",
                    date_demande: new Date().toISOString(),
                    status: "EN_COURS",
                    duree_en_minutes: 120,
                    etq: "ETQ002",
                    started: true,
                    finished: false,
                    nombre_produit_controle: 200,
                    ilot: ilots[1],
                    machine: machines[2],
                    operateur: operateur,
                    controleur: controleur
                  },
                  {
                    of_demande: "OF003",
                    date_demande: new Date().toISOString(),
                    status: "TERMINE",
                    duree_en_minutes: 90,
                    etq: "ETQ003",
                    started: true,
                    finished: true,
                    nombre_produit_controle: 150,
                    ilot: ilots[2],
                    machine: machines[4],
                    operateur: operateur,
                    controleur: controleur
                  }
                ];

                // Create demandes one by one using forkJoin to wait for all to complete
                const createObservables = demandesToCreate.map(demande =>
                  this.demandeService.createDemande(demande).pipe(
                    tap(createdDemande => console.log(`Demande ${createdDemande.of_demande} created`)),
                    catchError(error => {
                      console.error(`Error creating demande ${demande.of_demande}:`, error);
                      return of(null);
                    })
                  )
                );

                return forkJoin(createObservables).pipe(
                  tap(() => console.log("All demandes created")),
                  switchMap(() => this.demandeService.getAllDemandes())
                );
              } else {
                console.log("Missing users, ilots, or machines for demandes");
                return of(demandes);
              }
            })
          );
        } else {
          console.log("Demandes already exist");
          return of(demandes);
        }
      }),
      catchError(error => {
        console.error("Error checking demandes:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize demandes delegue
   */
  private initializeDemandesDelegue(): Observable<DemandeDelegue[]> {
    return this.demandeService.getAllDemandesDelegue().pipe(
      switchMap(demandesDelegue => {
        if (demandesDelegue.length === 0) {
          // Get users, ilots, and machines to associate with demandes
          return forkJoin({
            users: this.userService.getAllUsers(),
            ilots: this.machineService.getAllIlots(),
            machines: this.machineService.getAllMachines()
          }).pipe(
            switchMap(({ users, ilots, machines }) => {
              if (users.length > 0 && ilots.length > 0 && machines.length > 0) {
                // Find users by role
                const operateur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_OPERATEUR"));
                const controleur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_CONTROLEUR"));
                const manager = users.find(user => user.roles?.some(role => role.roleName === "ROLE_MANAGER"));

                // Demandes delegue don't exist yet, create them
                const demandesDelegueToCreate: DemandeDelegue[] = [
                  {
                    of_demande: "OFD001",
                    date_demande: new Date().toISOString(),
                    status: "EN_ATTENTE",
                    duree_en_minutes: 60,
                    etq: "ETQD001",
                    started: false,
                    finished: false,
                    nombre_produit_controle: 100,
                    ilot: ilots[0],
                    machine: machines[0],
                    operateur: operateur,
                    controleur: controleur,
                    delegatedTo: manager,
                    delegationDate: new Date().toISOString()
                  },
                  {
                    of_demande: "OFD002",
                    date_demande: new Date().toISOString(),
                    status: "EN_COURS",
                    duree_en_minutes: 120,
                    etq: "ETQD002",
                    started: true,
                    finished: false,
                    nombre_produit_controle: 200,
                    ilot: ilots[1],
                    machine: machines[2],
                    operateur: operateur,
                    controleur: controleur,
                    delegatedTo: manager,
                    delegationDate: new Date().toISOString()
                  }
                ];

                // Create demandes delegue one by one using forkJoin to wait for all to complete
                const createObservables = demandesDelegueToCreate.map(demandeDelegue =>
                  this.demandeService.createDemandeDelegue(demandeDelegue).pipe(
                    tap(createdDemandeDelegue => console.log(`Demande Delegue ${createdDemandeDelegue.of_demande} created`)),
                    catchError(error => {
                      console.error(`Error creating demande delegue ${demandeDelegue.of_demande}:`, error);
                      return of(null);
                    })
                  )
                );

                return forkJoin(createObservables).pipe(
                  tap(() => console.log("All demandes delegue created")),
                  switchMap(() => this.demandeService.getAllDemandesDelegue())
                );
              } else {
                console.log("Missing users, ilots, or machines for demandes delegue");
                return of(demandesDelegue);
              }
            })
          );
        } else {
          console.log("Demandes Delegue already exist");
          return of(demandesDelegue);
        }
      }),
      catchError(error => {
        console.error("Error checking demandes delegue:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize demandes finale
   */
  private initializeDemandesFinale(): Observable<DemandeFinale[]> {
    return this.demandeService.getAllDemandesFinale().pipe(
      switchMap(demandesFinale => {
        if (demandesFinale.length === 0) {
          // Get users, ilots, and machines to associate with demandes
          return forkJoin({
            users: this.userService.getAllUsers(),
            ilots: this.machineService.getAllIlots(),
            machines: this.machineService.getAllMachines()
          }).pipe(
            switchMap(({ users, ilots, machines }) => {
              if (users.length > 0 && ilots.length > 0 && machines.length > 0) {
                // Find users by role
                const operateur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_OPERATEUR"));
                const controleur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_CONTROLEUR"));
                const manager = users.find(user => user.roles?.some(role => role.roleName === "ROLE_MANAGER"));

                // Demandes finale don't exist yet, create them
                const demandesFinaleToCreate: DemandeFinale[] = [
                  {
                    of_demande: "OFF001",
                    date_demande: new Date().toISOString(),
                    status: "EN_ATTENTE",
                    duree_en_minutes: 60,
                    etq: "ETQF001",
                    started: false,
                    finished: false,
                    nombre_produit_controle: 100,
                    ilot: ilots[0],
                    machine: machines[0],
                    operateur: operateur,
                    controleur: controleur,
                    manager: manager,
                    finalDecision: "EN_ATTENTE_APPROBATION",
                    approvedDate: undefined
                  },
                  {
                    of_demande: "OFF002",
                    date_demande: new Date().toISOString(),
                    status: "TERMINE",
                    duree_en_minutes: 120,
                    etq: "ETQF002",
                    started: true,
                    finished: true,
                    nombre_produit_controle: 200,
                    ilot: ilots[1],
                    machine: machines[2],
                    operateur: operateur,
                    controleur: controleur,
                    manager: manager,
                    finalDecision: "APPROUVE",
                    approvedDate: new Date().toISOString()
                  }
                ];

                // Create demandes finale one by one using forkJoin to wait for all to complete
                const createObservables = demandesFinaleToCreate.map(demandeFinale =>
                  this.demandeService.createDemandeFinale(demandeFinale).pipe(
                    tap(createdDemandeFinale => console.log(`Demande Finale ${createdDemandeFinale.of_demande} created`)),
                    catchError(error => {
                      console.error(`Error creating demande finale ${demandeFinale.of_demande}:`, error);
                      return of(null);
                    })
                  )
                );

                return forkJoin(createObservables).pipe(
                  tap(() => console.log("All demandes finale created")),
                  switchMap(() => this.demandeService.getAllDemandesFinale())
                );
              } else {
                console.log("Missing users, ilots, or machines for demandes finale");
                return of(demandesFinale);
              }
            })
          );
        } else {
          console.log("Demandes Finale already exist");
          return of(demandesFinale);
        }
      }),
      catchError(error => {
        console.error("Error checking demandes finale:", error);
        return of([]);
      })
    );
  }

  /**
   * Initialize demandes te
   */
  private initializeDemandesTe(): Observable<DemandeTe[]> {
    return this.demandeService.getAllDemandesTe().pipe(
      switchMap(demandesTe => {
        if (demandesTe.length === 0) {
          // Get users, ilots, and machines to associate with demandes
          return forkJoin({
            users: this.userService.getAllUsers(),
            ilots: this.machineService.getAllIlots(),
            machines: this.machineService.getAllMachines()
          }).pipe(
            switchMap(({ users, ilots, machines }) => {
              if (users.length > 0 && ilots.length > 0 && machines.length > 0) {
                // Find users by role
                const operateur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_OPERATEUR"));
                const controleur = users.find(user => user.roles?.some(role => role.roleName === "ROLE_CONTROLEUR"));

                // Demandes te don't exist yet, create them
                const demandesToCreate: DemandeTe[] = [
                  {
                    of_demande: "OFT001",
                    date_demande: new Date().toISOString(),
                    status: "EN_ATTENTE",
                    duree_en_minutes: 60,
                    etq: "ETQT001",
                    started: false,
                    finished: false,
                    nombre_produit_controle: 100,
                    ilot: ilots[0],
                    machine: machines[0],
                    operateur: operateur,
                    controleur: controleur,
                    teStatus: "NOUVEAU"
                  },
                  {
                    of_demande: "OFT002",
                    date_demande: new Date().toISOString(),
                    status: "EN_COURS",
                    duree_en_minutes: 120,
                    etq: "ETQT002",
                    started: true,
                    finished: false,
                    nombre_produit_controle: 200,
                    ilot: ilots[1],
                    machine: machines[2],
                    operateur: operateur,
                    controleur: controleur,
                    teStatus: "EN_ANALYSE"
                  },
                  {
                    of_demande: "OFT003",
                    date_demande: new Date().toISOString(),
                    status: "TERMINE",
                    duree_en_minutes: 90,
                    etq: "ETQT003",
                    started: true,
                    finished: true,
                    nombre_produit_controle: 150,
                    ilot: ilots[2],
                    machine: machines[4],
                    operateur: operateur,
                    controleur: controleur,
                    teStatus: "VALIDE"
                  }
                ];

                // Create demandes te one by one using forkJoin to wait for all to complete
                const createObservables = demandesToCreate.map(demandeTe =>
                  this.demandeService.createDemandeTe(demandeTe).pipe(
                    tap(createdDemandeTe => console.log(`Demande TE ${createdDemandeTe.of_demande} created`)),
                    catchError(error => {
                      console.error(`Error creating demande te ${demandeTe.of_demande}:`, error);
                      return of(null);
                    })
                  )
                );

                return forkJoin(createObservables).pipe(
                  tap(() => console.log("All demandes TE created")),
                  switchMap(() => this.demandeService.getAllDemandesTe())
                );
              } else {
                console.log("Missing users, ilots, or machines for demandes TE");
                return of(demandesTe);
              }
            })
          );
        } else {
          console.log("Demandes TE already exist");
          return of(demandesTe);
        }
      }),
      catchError(error => {
        console.error("Error checking demandes te:", error);
        return of([]);
      })
    );
  }
}
