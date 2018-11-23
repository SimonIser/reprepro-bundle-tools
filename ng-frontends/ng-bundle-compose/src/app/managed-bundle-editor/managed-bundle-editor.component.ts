import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ManagedBundleService } from "../services/managed-bundle.service";
import { Subscription } from "rxjs";
import { ManagedBundle, ManagedBundleInfo } from "shared/shared";

@Component({
  selector: "app-managed-bundle-editor",
  templateUrl: "./managed-bundle-editor.component.html",
  styleUrls: ["./managed-bundle-editor.component.css"]
})
export class ManagedBundleEditorComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  bundlename: string;
  info: ManagedBundleInfo = {
    basedOn: "",
    creator: "",
    managedBundle: {
      distribution: "",
      id: "",
      status: null,
      target: "",
      ticket: "",
      ticketUrl: ""
    },
    subject: "-- No Subject --",
  };

  constructor(
    private route: ActivatedRoute,
    private bundleService: ManagedBundleService
  ) {
    this.subscriptions.push(
      this.route.params.subscribe(p => {
        this.bundlename = "bundle:" + p["dist"] + "/" + p["id"];
        this.update();
      })
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.bundleService.cast.subscribe(() => this.update())
    );
    this.bundleService.update();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  update(): void {
    const info = this.bundleService.getManagedBundleInfo(this.bundlename);
    if (info != null) {
      this.info = info;
    }
  }
}
