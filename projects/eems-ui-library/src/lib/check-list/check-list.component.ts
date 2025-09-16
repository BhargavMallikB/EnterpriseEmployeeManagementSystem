import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-check-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './check-list.component.html',
  styleUrl: './check-list.component.scss'
})
export class CheckListComponent {
  @Input() skills: string[] = ['JavaScript', 'Angular', 'HTML', 'CSS', 'TypeScript'];
  @Output() selectionChange = new EventEmitter<string[]>();

  selectedSkills: string[] = [];

  onCheckboxChange(skill: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedSkills.push(skill);
    } else {
      this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    }
    this.selectionChange.emit(this.selectedSkills);
  }

  onCheckboxEvent(skill: string, event: Event): void {
  const target = event.target as HTMLInputElement;
  this.onCheckboxChange(skill, target.checked);
}

  onSubmit() {
    if (this.selectedSkills.length === 0) {
      alert('No courses selected.');
    } else {
      alert('Selected courses: ' + this.selectedSkills.join(', '));
    }
    this.selectedSkills = [];
  }
}
