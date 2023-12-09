export class WeightsEditor {
  private _Brush: any;
  private _SuppressDragOperation: boolean = false;
  private _WasBoneSelectionDisabled: boolean = false;
  private _SelectedBoneIndex: number = 0;

  constructor() {
    this._Brush = null; // new s.default()
    console.log("NEW WeightsEditor");
  }

  static initializeStageContext(e: any, t: any) {}
}
