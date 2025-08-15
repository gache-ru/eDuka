import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0 })),
  transition(':enter', [
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

export const slideUpAnimation = trigger('slideUp', [
  state('void', style({ transform: 'translateY(20px)', opacity: 0 })),
  transition(':enter', [
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const slideInFromLeft = trigger('slideInFromLeft', [
  state('void', style({ transform: 'translateX(-100%)', opacity: 0 })),
  transition(':enter', [
    animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ])
]);

export const staggerAnimation = trigger('stagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const scaleInAnimation = trigger('scaleIn', [
  state('void', style({ transform: 'scale(0.8)', opacity: 0 })),
  transition(':enter', [
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);

export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0.8)',
      }),
    ], { optional: true }),
    query(':enter', [
      animate('600ms ease', style({ opacity: 1, transform: 'scale(1)' })),
    ], { optional: true })
  ]),
]);
