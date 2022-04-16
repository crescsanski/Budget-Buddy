export interface User {
    user_id: number;
    user_level: number;
    user_first_name: string;
    user_last_name: string;
    user_user_name: string;
    user_email: string
    user_phone_number: string;
    user_has_notifications: boolean;
    user_recommendation_consent: boolean;
    user_auto_renewal: boolean;
    user_independent: boolean;
    user_retired: boolean;
    user_married: boolean;
    user_multiple_incomes: boolean;
    user_children: boolean;
    user_city: boolean;
    user_pet: boolean;
    user_gets_tax_refund: boolean;
    user_registration_date: string;
    user_birth_date: Date;
    token: string;
  }
  
  
  /*
  Copyright Google LLC. All Rights Reserved.
  Use of this source code is governed by an MIT-style license that
  can be found in the LICENSE file at https://angular.io/license
  */