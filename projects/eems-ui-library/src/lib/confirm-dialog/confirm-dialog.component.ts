import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../input-field/input-field.component';

@Component({
  selector: 'lib-confirm-dialog',
  imports: [CommonModule,FormsModule,InputFieldComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Input() width?: string;
  @Input() height?: string;
  @Input() backgroundColor?: string;

  @Input() showTextbox: boolean = false;
  @Input() confirmationText: string = '';
  @Input() textboxLabel: string = 'Type to confirm';
  @Input() textboxError: string = 'Input does not match.';
  @Input() textboxType: string = 'text';
  @Input() confirmButtonText: string = 'Confirm';

  userInput: string = '';
  get isConfirmEnabled(): boolean {
    if (!this.showTextbox) return true;
    return this.userInput === this.confirmationText;
  }

  @Output() confirmed = new EventEmitter<string | boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() confirmEnabledChange = new EventEmitter<boolean>();

  screenSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium';

  constructor(private breakpointObserver: BreakpointObserver) {}

  onConfirm() {
    if (this.showTextbox && !this.isConfirmEnabled) return;
    this.confirmed.emit(this.showTextbox ? this.userInput : true);
    this.closed.emit();
  }

  onCancel() {
    this.confirmed.emit(false);
    this.closed.emit();
  }

  onUserInputChange() {
    this.confirmEnabledChange.emit(this.isConfirmEnabled);
  }

  private observeScreenSize(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe(result => {
        const { breakpoints } = result;
        if (breakpoints[Breakpoints.XSmall]) {
          this.screenSize = 'xsmall';
        } else if (breakpoints[Breakpoints.Small]) {
          this.screenSize = 'small';
        } else if (breakpoints[Breakpoints.Medium]) {
          this.screenSize = 'medium';
        } else if (breakpoints[Breakpoints.Large]) {
          this.screenSize = 'large';
        } else if (breakpoints[Breakpoints.XLarge]) {
          this.screenSize = 'xlarge';
        }
      });
  }

  ngOnInit(): void {
    this.observeScreenSize();
    this.confirmEnabledChange.emit(this.isConfirmEnabled);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue === true) {
      this.userInput = '';
      this.confirmEnabledChange.emit(this.isConfirmEnabled);
    }
  }
}
