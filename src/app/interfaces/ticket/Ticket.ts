export interface Ticket {
    invoice_number : string,
    qr_code: string;
    date_created : string;
    date_modified : string;
    state : string;
    client : string,
    game : string;
    user_register : string;
    user_modifier : string;
  }