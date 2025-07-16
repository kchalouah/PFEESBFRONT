import {Ilot, Machine} from './ilot.model';
import {AppUser} from './user.model';

export interface Demande {
  id?: number;
  of_demande?: string;
  date_demande?: string;
  status?: string;
  duree_en_minutes?: number;
  etq?: string;

  started?: boolean;
  finished?: boolean;
  nombre_produit_controle?: number;

  ilot?: Ilot;
  machine?: Machine;
  operateur?: AppUser;
  controleur?: AppUser;
}

export interface DemandeDelegue extends Demande {
  delegatedTo?: AppUser;
  delegationDate?: string;
}

export interface DemandeTe extends Demande {
  teStatus?: string;
}

export interface DemandeFinale extends Demande {
  finalDecision?: string;
  approvedDate?: string;
  manager?: AppUser;
}
