import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'lib-stepper',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() showBlockedMarks = false;
  @Input() steps: string[] = [];
  @Input() currentStep = 0;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() clickable = false;

  @Output() stepChange = new EventEmitter<number>();

  goToStep(index: number) {
    if (this.clickable) {
      this.currentStep = index;
      this.stepChange.emit(this.currentStep);
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.stepChange.emit(this.currentStep);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.stepChange.emit(this.currentStep);
    }
  }
}
