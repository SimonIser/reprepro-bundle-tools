/***********************************************************************
* Copyright (c) 2018 Landeshauptstadt München
*           (c) 2018 Christoph Lutz (InterFace AG)
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the European Union Public Licence (EUPL),
* version 1.1 (or any later version).
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* European Union Public Licence for more details.
*
* You should have received a copy of the European Union Public Licence
* along with this program. If not, see
* https://joinup.ec.europa.eu/collection/eupl/eupl-text-11-12
***********************************************************************/

import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Bundle } from "shared";
import { ConfigService } from "shared";

@Injectable({
  providedIn: "root"
})
export class BundleListService {

  private changed = new Subject();
  cast = this.changed.asObservable();

  bundles: Bundle[] = [];

  constructor(private config: ConfigService, private http: HttpClient) {}

  update(): void {
    this.http.get<Bundle[]>(this.config.getApiUrl("bundleList")).subscribe(
      (data: Bundle[]) => {
        this.bundles = data;
        this.changed.next();
      },
      errResp => {
        console.error("Error loading bundle list", errResp);
      }
    );
  }

  getAvailableDistributions(): Set<string> {
    return new Set(this.bundles.map(bundle => bundle.distribution));
  }

  getAvailableTargets(): Set<string> {
    return new Set(this.bundles.map(bundle => bundle.target));
  }

  getUserOrOthers(user: string, bundle: Bundle): string {
    return bundle.creator === user ? user : "Others";
  }

  getAvailableUserOrOthers(user: string): Set<string> {
    return new Set(
      this.bundles.map(bundle => this.getUserOrOthers(user, bundle))
    );
  }

  getAvailableReadonly(): Set<boolean> {
    return new Set(this.bundles.map(bundle => bundle.readonly));
  }

  getAvailableStates(): Set<"Readonly" | "Editable"> {
    return new Set(this.bundles.map(bundle => bundle.readonly ? "Readonly" : "Editable"));
  }
}
