export type MaintenanceMode = 'hide_menu' | 'block_checkout_only';

/** Training-store maintenance switch, set in the admin. */
export interface StoreSettings {
  storeClosed: boolean;
  message: string;
  contactChannel: string;
  mode: MaintenanceMode;
  notifyOnReopen: boolean;
}
