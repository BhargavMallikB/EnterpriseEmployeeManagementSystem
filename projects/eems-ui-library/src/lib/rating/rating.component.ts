import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-rating',
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {
  @Input() initialRatings: { [key: string]: number } = {};
  @Output() submitRating = new EventEmitter<{ [key: string]: number }>();

  aspects = [
    'Learning & Development',
    'Team Contribution',
    'Problem Solving',
    'Communication'
  ];

  ratings: { [key: string]: number } = {};
  submitted = false;

  ngOnInit() {
    this.aspects.forEach(aspect => {
      this.ratings[aspect] = this.initialRatings[aspect] || 0;
    });
  }

  setRating(aspect: string, value: number) {
    this.ratings[aspect] = value;
  }

  get overallRating(): number {
    const values = Object.values(this.ratings);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  onSubmit() {
    this.submitted = true;
    this.submitRating.emit(this.ratings);
  }
}
