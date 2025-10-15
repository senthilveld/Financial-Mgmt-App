import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() highlightClass: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyHighlight();
  }

  private applyHighlight(): void {
    // Remove existing highlight classes
    this.renderer.removeClass(this.el.nativeElement, 'highlight-positive');
    this.renderer.removeClass(this.el.nativeElement, 'highlight-negative');
    this.renderer.removeClass(this.el.nativeElement, 'highlight-neutral');

    // Add appropriate highlight class
    switch (this.appHighlight) {
      case 'positive':
        this.renderer.addClass(this.el.nativeElement, 'highlight-positive');
        break;
      case 'negative':
        this.renderer.addClass(this.el.nativeElement, 'highlight-negative');
        break;
      case 'neutral':
        this.renderer.addClass(this.el.nativeElement, 'highlight-neutral');
        break;
    }

    // Add custom highlight class if provided
    if (this.highlightClass) {
      this.renderer.addClass(this.el.nativeElement, this.highlightClass);
    }
  }
}
