import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input('appTooltip') text = '';
  private tooltip?: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  private isTruncated(): boolean {
    const el = this.el.nativeElement;

    // Works for both truncate and line-clamp
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight);
    const maxLines = parseInt(computed.webkitLineClamp || '0', 10);

    // Case 1: standard overflow truncation
    const horizontallyClamped = el.scrollWidth > el.clientWidth;

    // Case 2: multi-line clamp (needs approximate height comparison)
    const verticallyClamped = maxLines > 0 && el.scrollHeight > lineHeight * maxLines + 1;

    return horizontallyClamped || verticallyClamped;
  }

  @HostListener('mouseenter')
  show() {
    if (!this.text || !this.isTruncated()) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();

    // Create tooltip
    this.tooltip = this.r.createElement('div');
    if (!this.tooltip) return;
    this.tooltip.textContent = this.text;

    // Tailwind style
    this.r.addClass(this.tooltip, 'fixed');
    this.r.addClass(this.tooltip, 'z-[9999]');
    this.r.addClass(this.tooltip, 'bg-gray-900');
    this.r.addClass(this.tooltip, 'text-white');
    this.r.addClass(this.tooltip, 'text-xs');
    this.r.addClass(this.tooltip, 'rounded');
    this.r.addClass(this.tooltip, 'px-2');
    this.r.addClass(this.tooltip, 'py-1');
    this.r.addClass(this.tooltip, 'shadow-lg');
    this.r.addClass(this.tooltip, 'max-w-sm');
    this.r.addClass(this.tooltip, 'whitespace-normal');
    this.r.addClass(this.tooltip, 'pointer-events-none');

    // Append to <body>
    this.r.appendChild(document.body, this.tooltip);

    // Position BELOW element
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const top = hostRect.bottom + 8;
    let left = hostRect.left;

    // Prevent going offscreen right
    const rightEdge = left + tooltipRect.width;
    if (rightEdge > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    this.r.setStyle(this.tooltip, 'top', `${top}px`);
    this.r.setStyle(this.tooltip, 'left', `${left}px`);
  }

  @HostListener('mouseleave')
  hide() {
    if (this.tooltip) {
      this.r.removeChild(document.body, this.tooltip);
      this.tooltip = undefined;
    }
  }
}
